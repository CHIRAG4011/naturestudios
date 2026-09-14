import { NextRequest, NextResponse } from 'next/server';
import { requireAdminPermission, unauthorizedResponse } from '@/lib/admin-guard';
import { getMongoDb } from '@/lib/mongodb';
import { logAdminAudit, MediaAssetDoc } from '@/lib/admin-db';
import { ObjectId } from 'mongodb';
import fs from 'fs/promises';
import path from 'path';

export const dynamic = 'force-dynamic';

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

  return NextResponse.json({ success: true, media, assets: media });
}

export async function POST(req: NextRequest) {
  const auth = await requireAdminPermission(req, 'media.upload');
  if (!auth.authorized) {
    return unauthorizedResponse(auth);
  }

  const contentType = req.headers.get('content-type') || '';

  try {
    let name = '';
    let url = '';
    let mimeType = 'image/jpeg';
    let size = 0;
    let folder = 'general';
    let altText = '';

    // Handle Multipart Form Data (Direct File Upload)
    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const file = (formData.get('file') || formData.get('image')) as File | null;
      altText = (formData.get('altText') as string) || '';
      folder = (formData.get('folder') as string) || 'general';

      if (!file) {
        return NextResponse.json({ error: 'No image file provided in form data' }, { status: 400 });
      }

      // Security check: reject executable or script extensions
      const forbidden = ['.exe', '.bat', '.cmd', '.sh', '.js', '.mjs', '.php', '.py', '.html', '.htm'];
      if (forbidden.some((ext) => file.name.toLowerCase().endsWith(ext))) {
        return NextResponse.json({ error: 'File type rejected by media security policy.' }, { status: 400 });
      }

      name = file.name;
      mimeType = file.type || 'image/jpeg';
      size = file.size;

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Attempt to save to public/uploads directory
      try {
        const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
        await fs.mkdir(uploadsDir, { recursive: true });

        const ext = path.extname(file.name) || '.jpg';
        const cleanName = path.basename(file.name, ext).replace(/[^a-zA-Z0-9_-]/g, '-').slice(0, 30);
        const filename = `media-${Date.now()}-${cleanName}${ext}`;
        const filePath = path.join(uploadsDir, filename);

        await fs.writeFile(filePath, buffer);
        url = `/uploads/${filename}`;
      } catch (fsError: any) {
        // Fallback for read-only environments (e.g. serverless)
        console.warn('Filesystem write unavailable, persisting as data URL:', fsError?.message);
        url = `data:${mimeType};base64,${buffer.toString('base64')}`;
      }
    } else {
      // Handle JSON payload (URL registration)
      const body = await req.json();
      name = body.name;
      url = body.url;
      mimeType = body.mimeType || 'image/jpeg';
      size = body.size || 150000;
      folder = body.folder || 'general';
      altText = body.altText || name;

      if (!name || !url) {
        return NextResponse.json({ error: 'Name and URL are required' }, { status: 400 });
      }

      const forbidden = ['.exe', '.bat', '.cmd', '.sh', '.js', '.mjs', '.php', '.py'];
      if (forbidden.some((ext) => url.toLowerCase().endsWith(ext) || name.toLowerCase().endsWith(ext))) {
        return NextResponse.json({ error: 'Malicious or executable file extensions rejected.' }, { status: 400 });
      }
    }

    const doc: MediaAssetDoc = {
      name,
      url,
      mimeType,
      size,
      folder,
      altText: altText || name,
      usageCount: 1,
      usedIn: ['Media Library'],
      uploadedBy: auth.user!.email,
      createdAt: new Date().toISOString(),
    };

    const db = await getMongoDb();
    let createdId = '';
    if (db) {
      const res = await db.collection('mediaAssets').insertOne(doc as any);
      createdId = res.insertedId.toString();
    }

    await logAdminAudit(auth.user!.id, auth.user!.email, 'MEDIA_UPLOADED', 'media', name, { url, size });

    const savedDoc = { id: createdId, ...doc };
    return NextResponse.json({
      success: true,
      media: savedDoc,
      asset: savedDoc,
    });
  } catch (e: any) {
    console.error('Failed to process media upload:', e);
    return NextResponse.json({ error: e.message || 'Failed to record media asset' }, { status: 500 });
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
