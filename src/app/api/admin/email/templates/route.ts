import { NextRequest, NextResponse } from 'next/server';
import { requireAdminPermission, unauthorizedResponse } from '@/lib/admin-guard';
import { getMongoDb } from '@/lib/mongodb';
import { logAdminAudit, EmailTemplateDoc } from '@/lib/admin-db';

export async function GET(req: NextRequest) {
  const auth = await requireAdminPermission(req, 'email.view');
  if (!auth.authorized) {
    return unauthorizedResponse(auth);
  }

  const db = await getMongoDb();
  let templates: EmailTemplateDoc[] = [];

  if (db) {
    const docs = await db.collection('emailTemplates').find({}).toArray();
    templates = docs.map((d: any) => {
      const { _id, ...rest } = d;
      return { id: _id.toString(), ...rest };
    });
  }

  return NextResponse.json({ templates });
}

export async function PUT(req: NextRequest) {
  const auth = await requireAdminPermission(req, 'email.templates.edit');
  if (!auth.authorized) {
    return unauthorizedResponse(auth);
  }

  try {
    const { slug, subject, bodyHtml, bodyText, enabled } = await req.json();

    if (!slug || !subject) {
      return NextResponse.json({ error: 'Missing template slug or subject' }, { status: 400 });
    }

    const db = await getMongoDb();
    if (db) {
      await db.collection('emailTemplates').updateOne(
        { slug },
        {
          $set: {
            subject,
            bodyHtml,
            bodyText,
            enabled: enabled !== undefined ? enabled : true,
            updatedBy: auth.user!.email,
            updatedAt: new Date().toISOString(),
          },
        }
      );

      await logAdminAudit(
        auth.user!.id,
        auth.user!.email,
        'EMAIL_TEMPLATE_UPDATED',
        'email_templates',
        slug,
        { subject }
      );

      return NextResponse.json({ success: true, slug });
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to update template' }, { status: 500 });
  }
}
