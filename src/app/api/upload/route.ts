import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import fs from 'fs/promises';
import path from 'path';

export const dynamic = 'force-dynamic';

const ALLOWED_IMAGE_TYPES: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'image/svg+xml': 'svg',
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
    const file = (formData.get('file') || formData.get('image')) as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const extension = ALLOWED_IMAGE_TYPES[file.type] || 'jpg';
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Only image files (JPEG, PNG, WebP, GIF, SVG) are permitted.' },
        { status: 400 }
      );
    }

    // 10MB limit
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'Image size exceeds 10MB limit.' }, { status: 400 });
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
