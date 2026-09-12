import { NextRequest, NextResponse } from 'next/server';
import { requireAdminPermission, unauthorizedResponse } from '@/lib/admin-guard';
import { getRedirects, createRedirect, updateRedirect, deleteRedirect, logAdminAudit } from '@/lib/admin-db';

export async function GET(req: NextRequest) {
  const auth = await requireAdminPermission(req, 'seo.view');
  if (!auth.authorized || !auth.user) {
    return unauthorizedResponse(auth);
  }

  const redirects = await getRedirects();
  return NextResponse.json({ redirects });
}

export async function POST(req: NextRequest) {
  const auth = await requireAdminPermission(req, 'seo.edit');
  if (!auth.authorized || !auth.user) {
    return unauthorizedResponse(auth);
  }

  try {
    const body = await req.json();
    const { source, destination, statusCode = 301, enabled = true } = body;

    if (!source || !destination) {
      return NextResponse.json({ error: 'Source and destination URLs are required' }, { status: 400 });
    }

    // Prevent redirect loop
    if (source.trim() === destination.trim()) {
      return NextResponse.json({ error: 'Redirect loop detected: source cannot match destination' }, { status: 400 });
    }

    const created = await createRedirect({
      source: source.trim(),
      destination: destination.trim(),
      statusCode: statusCode === 302 ? 302 : 301,
      enabled: Boolean(enabled),
    });

    await logAdminAudit(
      auth.user.id,
      auth.user.email,
      'CREATE_REDIRECT',
      'redirects',
      (created as any).id || (created as any)._id?.toString() || 'redirect',
      { source, destination, statusCode }
    );

    return NextResponse.json({ redirect: created, message: 'Redirect created successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create redirect' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const auth = await requireAdminPermission(req, 'seo.edit');
  if (!auth.authorized || !auth.user) {
    return unauthorizedResponse(auth);
  }

  try {
    const body = await req.json();
    const { id, source, destination, statusCode, enabled } = body;

    if (!id) {
      return NextResponse.json({ error: 'Redirect ID is required' }, { status: 400 });
    }

    if (source && destination && source.trim() === destination.trim()) {
      return NextResponse.json({ error: 'Redirect loop detected' }, { status: 400 });
    }

    const success = await updateRedirect(id, {
      ...(source && { source: source.trim() }),
      ...(destination && { destination: destination.trim() }),
      ...(statusCode && { statusCode: statusCode === 302 ? 302 : 301 }),
      ...(typeof enabled === 'boolean' && { enabled }),
    });

    if (!success) {
      return NextResponse.json({ error: 'Redirect not found or update failed' }, { status: 404 });
    }

    await logAdminAudit(
      auth.user.id,
      auth.user.email,
      'UPDATE_REDIRECT',
      'redirects',
      id,
      { source, destination, statusCode, enabled }
    );

    return NextResponse.json({ success: true, message: 'Redirect updated successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update redirect' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const auth = await requireAdminPermission(req, 'seo.edit');
  if (!auth.authorized || !auth.user) {
    return unauthorizedResponse(auth);
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Redirect ID is required' }, { status: 400 });
  }

  const success = await deleteRedirect(id);
  if (!success) {
    return NextResponse.json({ error: 'Redirect not found or could not be deleted' }, { status: 404 });
  }

  await logAdminAudit(
    auth.user.id,
    auth.user.email,
    'DELETE_REDIRECT',
    'redirects',
    id
  );


  return NextResponse.json({ success: true, message: 'Redirect deleted' });
}

