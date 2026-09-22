import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import fs from 'fs/promises';
import path from 'path';

export const dynamic = 'force-dynamic';

const ALLOWED_TYPES: Record<string, string> = {
  // Images
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'image/svg+xml': 'svg',
  // Videos
  'video/mp4': 'mp4',
  'video/webm': 'webm',
  'video/quicktime': 'mov',
  'video/ogg': 'ogv',
};

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (user.isSuspended || user.status === 'SUSPENDED') {
      return NextResponse.json(
        { error: 'Account is suspended. File uploads are restricted.' },
        { status: 403 }
      );
    }

    const formData = await req.formData();
    const file = (formData.get('file') || formData.get('image') || formData.get('video')) as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const category = (formData.get('category') as string)?.toUpperCase() || req.nextUrl.searchParams.get('category')?.toUpperCase();
    const mediaType = (formData.get('mediaType') as string)?.toLowerCase() || req.nextUrl.searchParams.get('mediaType')?.toLowerCase();
    const isPoster = formData.get('isPoster') === 'true' || formData.get('role') === 'poster';

    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');

    // Category-specific backend validation
    if (category === 'GFX' || mediaType === 'image') {
      if (!isImage) {
        return NextResponse.json(
          { error: 'GFX portfolios only support image files (PNG, JPG, JPEG, WEBP).' },
          { status: 400 }
        );
      }
    } else if (category === 'VFX' || mediaType === 'video') {
      if (!isVideo && !isPoster) {
        return NextResponse.json(
          { error: 'VFX portfolios require a supported video file (MP4, WEBM, MOV).' },
          { status: 400 }
        );
      }
    }

    if (!isImage && !isVideo) {
      return NextResponse.json(
        { error: 'Only image files (JPEG, PNG, WebP, GIF, SVG) or video files (MP4, WebM, QuickTime) are permitted.' },
        { status: 400 }
      );
    }

    const extension = ALLOWED_TYPES[file.type] || (isVideo ? 'mp4' : 'jpg');

    // 50MB limit for video, 15MB for image
    const maxLimit = isVideo ? 50 * 1024 * 1024 : 15 * 1024 * 1024;
    if (file.size > maxLimit) {
      return NextResponse.json(
        { error: `File size exceeds ${isVideo ? '50MB' : '15MB'} limit.` },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    let publicUrl = '';

    try {
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
      await fs.mkdir(uploadsDir, { recursive: true });

      const cleanName = path
        .basename(file.name, path.extname(file.name))
        .replace(/[^a-zA-Z0-9_-]/g, '-')
        .slice(0, 30);
      const filename = `up-${Date.now()}-${cleanName}.${extension}`;
      const filePath = path.join(uploadsDir, filename);

      await fs.writeFile(filePath, buffer);
      publicUrl = `/uploads/${filename}`;
    } catch (fsErr: any) {
      // Fallback for read-only filesystem environments
      publicUrl = `data:${file.type};base64,${buffer.toString('base64')}`;
    }

    return NextResponse.json({
      success: true,
      url: publicUrl,
      name: file.name,
      size: file.size,
    });
  } catch (err: any) {
    console.error('Universal upload error:', err);
    return NextResponse.json({ error: err.message || 'Upload failed' }, { status: 500 });
  }
}
