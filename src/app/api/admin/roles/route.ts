import { NextRequest, NextResponse } from 'next/server';
import { requireAdminPermission, unauthorizedResponse } from '@/lib/admin-guard';
import { getMongoDb } from '@/lib/mongodb';
import { SYSTEM_ROLES } from '@/lib/admin-rbac';
import { logAdminAudit, AdminRoleDoc } from '@/lib/admin-db';

export async function GET(req: NextRequest) {
  const auth = await requireAdminPermission(req, 'roles.view');
  if (!auth.authorized) {
    return unauthorizedResponse(auth);
  }

  const db = await getMongoDb();
  let roles: AdminRoleDoc[] = [];

  if (db) {
    const docs = await db.collection('adminRoles').find({}).toArray();
    roles = docs.map((d: any) => {
      const { _id, ...rest } = d;
      return { id: _id.toString(), ...rest } as any;
    });
  }

  if (roles.length === 0) {
    roles = SYSTEM_ROLES.map((r) => ({
      ...r,
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));
  }

  // Count user assignments per role
  const rolesWithCounts = await Promise.all(
    roles.map(async (r) => {
      let userCount = 0;
      if (db) {
        userCount = await db.collection('adminRoleAssignments').countDocuments({ roleSlug: r.slug });
      }
      return {
        ...r,
        userCount,
      };
    })
  );

  return NextResponse.json({ roles: rolesWithCounts });
}

export async function POST(req: NextRequest) {
  const auth = await requireAdminPermission(req, 'roles.create');
  if (!auth.authorized) {
    return unauthorizedResponse(auth);
  }

  try {
    const { name, slug, description, permissions } = await req.json();

    if (!name || !slug) {
      return NextResponse.json({ error: 'Name and slug are required' }, { status: 400 });
    }

    const cleanSlug = slug.toUpperCase().trim().replace(/[^A-Z0-9_]/g, '');

    const db = await getMongoDb();
    if (db) {
      const existing = await db.collection('adminRoles').findOne({ slug: cleanSlug });
      if (existing) {
        return NextResponse.json({ error: 'A role with this slug already exists' }, { status: 400 });
      }

      const newRole: AdminRoleDoc = {
        slug: cleanSlug,
        name,
        description: description || '',
        permissions: Array.isArray(permissions) ? permissions : [],
        systemRole: false,
        active: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await db.collection('adminRoles').insertOne(newRole as any);

      await logAdminAudit(
        auth.user!.id,
        auth.user!.email,
        'ROLE_CREATED',
        'roles',
        cleanSlug,
        { name, permissionsCount: newRole.permissions.length }
      );

      return NextResponse.json({ success: true, role: newRole });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to create role' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const auth = await requireAdminPermission(req, 'roles.edit');
  if (!auth.authorized) {
    return unauthorizedResponse(auth);
  }

  try {
    const { slug, name, description, permissions, active } = await req.json();

    if (!slug) {
      return NextResponse.json({ error: 'Role slug is required' }, { status: 400 });
    }

    const db = await getMongoDb();
    if (db) {
      const updateData: any = { updatedAt: new Date().toISOString() };
      if (name) updateData.name = name;
      if (description !== undefined) updateData.description = description;
      if (Array.isArray(permissions)) updateData.permissions = permissions;
      if (active !== undefined) updateData.active = active;

      await db.collection('adminRoles').updateOne({ slug }, { $set: updateData });

      await logAdminAudit(
        auth.user!.id,
        auth.user!.email,
        'ROLE_UPDATED',
        'roles',
        slug,
        { permissionsUpdated: Array.isArray(permissions) }
      );

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to update role' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const auth = await requireAdminPermission(req, 'roles.delete');
  if (!auth.authorized) {
    return unauthorizedResponse(auth);
  }

  try {
    const { slug } = await req.json();

    if (!slug) {
      return NextResponse.json({ error: 'Role slug is required' }, { status: 400 });
    }

    // Protect system roles
    const systemRole = SYSTEM_ROLES.find((r) => r.slug === slug);
    if (systemRole || slug === 'SUPER_ADMIN' || slug === 'ADMIN') {
      return NextResponse.json({ error: 'System critical roles cannot be deleted.' }, { status: 403 });
    }

    const db = await getMongoDb();
    if (db) {
      // Check if users are assigned
      const assignedCount = await db.collection('adminRoleAssignments').countDocuments({ roleSlug: slug });
      if (assignedCount > 0) {
        return NextResponse.json(
          { error: `Cannot delete role: ${assignedCount} user(s) currently assigned. Reassign users first.` },
          { status: 400 }
        );
      }

      await db.collection('adminRoles').deleteOne({ slug });

      await logAdminAudit(auth.user!.id, auth.user!.email, 'ROLE_DELETED', 'roles', slug);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to delete role' }, { status: 500 });
  }
}
