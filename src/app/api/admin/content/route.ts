import { NextRequest, NextResponse } from 'next/server';
import { requireAdminPermission, unauthorizedResponse } from '@/lib/admin-guard';
import { getPageContent, savePageContent, DEFAULT_PAGE_CONTENT } from '@/lib/site-content';
import { logAdminAudit } from '@/lib/admin-db';
import { getMongoDb } from '@/lib/mongodb';

export async function GET(req: NextRequest) {
  const auth = await requireAdminPermission(req, 'content.view');
  if (!auth.authorized) {
    return unauthorizedResponse(auth);
  }

  const slug = req.nextUrl.searchParams.get('slug') || 'homepage';
  const content = await getPageContent(slug);

  const db = await getMongoDb();
  let draft = null;
  if (db) {
    draft = await db.collection('siteContent').findOne({ slug, status: 'DRAFT' });
  }

  return NextResponse.json({
    slug,
    content,
    draft: draft ? draft.sections : null,
    defaults: DEFAULT_PAGE_CONTENT[slug] || {},
    availablePages: ['homepage', 'about', 'services', 'studio', 'contact', 'footer'],
  });
}

export async function POST(req: NextRequest) {
  const { slug, title, sections, action } = await req.json();

  const requiredPerm = action === 'PUBLISH' ? 'content.publish' : 'content.edit';
  const auth = await requireAdminPermission(req, requiredPerm);
  if (!auth.authorized) {
    return unauthorizedResponse(auth);
  }

  if (!slug || !sections) {
    return NextResponse.json({ error: 'Missing slug or sections' }, { status: 400 });
  }

  const saved = await savePageContent(
    slug,
    title || slug.toUpperCase(),
    sections,
    action === 'PUBLISH' ? 'PUBLISH' : 'DRAFT',
    auth.user!.email
  );

  await logAdminAudit(
    auth.user!.id,
    auth.user!.email,
    action === 'PUBLISH' ? 'CONTENT_PUBLISHED' : 'CONTENT_DRAFTED',
    'content',
    slug,
    { status: saved.status, keysUpdated: Object.keys(sections) }
  );

  return NextResponse.json({ success: true, content: saved });
}
