import { NextRequest, NextResponse } from 'next/server';
import { requireAdminPermission, unauthorizedResponse } from '@/lib/admin-guard';
import { getMongoDb } from '@/lib/mongodb';
import { logAdminAudit, MediaAssetDoc } from '@/lib/admin-db';
import { ObjectId } from 'mongodb';

export async function GET(req: NextRequest) {
  const auth = await requireAdminPermission(req, 'media.view');
  if (!auth.authorized) {
    return unauthorizedResponse(auth);
  }

  const db = await getMongoDb();
  let media: MediaAssetDoc[] = [];

  if (db) {
    const docs = await db.collection('mediaAssets').find({}).sort({ createdAt: -1 }).toArray();
    media = docs.map((d: any) => {
      const { _id, ...rest } = d;
      return { id: _id.toString(), ...rest };
    });
  }

  // If database media is empty, provide default studio media plates
  if (media.length === 0) {
    media = [
      {
        name: 'Hero Lightfield Wide',
        url: '/media/hero-lightfield.jpg',
        mimeType: 'image/jpeg',
        size: 245000,
        folder: 'hero',
        altText: 'NatureStudios Golden Hour Lightfield Arena',
        usageCount: 4,
        usedIn: ['Homepage Hero', 'Scroll Story Chapter 01', 'Editorial Theme'],
        uploadedBy: 'system',
        createdAt: new Date().toISOString(),
      },
      {
        name: 'Studio Production Plate',
        url: '/media/studio-plate.jpg',
        mimeType: 'image/jpeg',
        size: 320000,
        folder: 'studio',
        altText: 'NatureStudios Directing Console Plate',
        usageCount: 2,
        usedIn: ['Scroll Story Chapter 02', 'Studio Overview'],
        uploadedBy: 'system',
        createdAt: new Date().toISOString(),
      },
      {
        name: 'Nexus Arena Championship',
        url: '/media/work-nexus-arena.jpg',
        mimeType: 'image/jpeg',
        size: 410000,
        folder: 'work',
        altText: 'Nexus Arena Championship 2026 Stage',
        usageCount: 3,
        usedIn: ['Work Showcase', 'Scroll Story Chapter 03'],
        uploadedBy: 'system',
        createdAt: new Date().toISOString(),
      },
      {
        name: 'Valorant Championship Broadcast',
        url: '/media/work-valorant-championship.jpg',
        mimeType: 'image/jpeg',
        size: 380000,
        folder: 'work',
        altText: 'Valorant Champions Tour Broadcast Interface',
        usageCount: 2,
        usedIn: ['Work Showcase', 'Scroll Story Chapter 04'],
        uploadedBy: 'system',
        createdAt: new Date().toISOString(),
      },
    ];
  }

  return NextResponse.json({ media });
}

export async function POST(req: NextRequest) {
  const auth = await requireAdminPermission(req, 'media.upload');
  if (!auth.authorized) {
    return unauthorizedResponse(auth);
  }

  try {
    const { name, url, mimeType, size, folder, altText } = await req.json();

    if (!name || !url) {
      return NextResponse.json({ error: 'Name and URL are required' }, { status: 400 });
    }

    // Security check: Reject executable/script extensions
    const forbidden = ['.exe', '.bat', '.cmd', '.sh', '.js', '.mjs', '.php', '.py'];
    if (forbidden.some((ext) => url.toLowerCase().endsWith(ext) || name.toLowerCase().endsWith(ext))) {
      return NextResponse.json({ error: 'Malicious or executable file extensions rejected.' }, { status: 400 });
    }

    const doc: MediaAssetDoc = {
      name,
      url,
      mimeType: mimeType || 'image/jpeg',
      size: size || 150000,
      folder: folder || 'general',
      altText: altText || name,
      usageCount: 1,
      usedIn: ['Media Library'],
      uploadedBy: auth.user!.email,
      createdAt: new Date().toISOString(),
    };

    const db = await getMongoDb();
    if (db) {
      await db.collection('mediaAssets').insertOne(doc as any);
    }

    await logAdminAudit(auth.user!.id, auth.user!.email, 'MEDIA_UPLOADED', 'media', name, { url, size });
    return NextResponse.json({ success: true, media: doc });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to record media asset' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const auth = await requireAdminPermission(req, 'media.delete');
  if (!auth.authorized) {
    return unauthorizedResponse(auth);
  }

  try {
    const { id } = await req.json();
    const db = await getMongoDb();
    if (db && id) {
      await db.collection('mediaAssets').deleteOne({ _id: new ObjectId(id) });
      await logAdminAudit(auth.user!.id, auth.user!.email, 'MEDIA_DELETED', 'media', id);
    }
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to delete media asset' }, { status: 500 });
  }
}
