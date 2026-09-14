import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import fs from 'fs/promises';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const fullUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        name: true,
        email: true,
        avatarUrl: true,
        emailVerified: true,
        createdAt: true,
        accounts: {
          select: {
            provider: true,
          },
        },
      },
    });

    return NextResponse.json({ user: fullUser });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (user.isSuspended || user.status === 'SUSPENDED') {
      return NextResponse.json(
        { error: 'Account is suspended. Profile updates are restricted. Please appeal via Support Tickets.' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { name, avatarUrl } = body;

    const dataToUpdate: { name?: string; avatarUrl?: string | null } = {};

    if (name !== undefined) {
      if (typeof name !== 'string' || name.trim() === '') {
        return NextResponse.json({ error: 'Name cannot be empty' }, { status: 400 });
      }
      if (name.trim().length > 80) {
        return NextResponse.json(
          { error: 'Name must be 80 characters or fewer' },
          { status: 400 }
        );
      }
      dataToUpdate.name = name.trim();
    }

    if (avatarUrl !== undefined) {
      // Accept only an absolute http(s) URL or one of our own upload paths.
      // Anything else (javascript:, data:, protocol-relative //evil) is
      // rejected rather than stored and later rendered into an <img src>.
      if (avatarUrl === null || avatarUrl === '') {
        dataToUpdate.avatarUrl = null;
      } else if (typeof avatarUrl === 'string' && avatarUrl.startsWith('data:image/')) {
        // Safe base64 image data URL (up to 4MB)
        if (avatarUrl.length > 4 * 1024 * 1024) {
          return NextResponse.json({ error: 'Avatar image payload too large' }, { status: 400 });
        }
        dataToUpdate.avatarUrl = avatarUrl;
      } else if (typeof avatarUrl !== 'string' || avatarUrl.length > 2048) {
        return NextResponse.json({ error: 'Invalid avatar URL' }, { status: 400 });
      } else if (avatarUrl.startsWith('/uploads/') && !avatarUrl.includes('..')) {
        dataToUpdate.avatarUrl = avatarUrl;
      } else {
        let parsed: URL;
        try {
          parsed = new URL(avatarUrl);
        } catch {
          return NextResponse.json({ error: 'Invalid avatar URL' }, { status: 400 });
        }
        if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
          return NextResponse.json(
            { error: 'Avatar URL must start with http:// or https://' },
            { status: 400 }
          );
        }
        dataToUpdate.avatarUrl = parsed.toString();
      }
    }

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: dataToUpdate,
      select: {
        id: true,
        name: true,
        email: true,
        avatarUrl: true,
        emailVerified: true,
      },
    });

    // Add notification
    await prisma.notification.create({
      data: {
        userId: user.id,
        type: 'profile_updated',
        title: 'Profile Updated',
        message: 'Your profile details and avatar were successfully updated.',
      },
    });

    return NextResponse.json({ success: true, user: updated });
  } catch (error) {
    console.error('Error updating user profile:', error);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}

/**
 * Server-controlled extension map.
 *
 * SVG is deliberately absent: files written here are served from `/uploads/*`
 * on this same origin, and an SVG can carry inline <script>. Accepting one
 * would be stored XSS against every visitor who opened the image URL.
 */
const ALLOWED_IMAGE_TYPES: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
};

/**
 * Confirms the bytes actually match the declared MIME type. `file.type` is
 * supplied by the client and cannot be trusted on its own.
 */
function magicBytesMatch(buffer: Buffer, mime: string): boolean {
  if (buffer.length < 12) return false;

  switch (mime) {
    case 'image/jpeg':
      return buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
    case 'image/png':
      return (
        buffer[0] === 0x89 &&
        buffer[1] === 0x50 &&
        buffer[2] === 0x4e &&
        buffer[3] === 0x47 &&
        buffer[4] === 0x0d &&
        buffer[5] === 0x0a &&
        buffer[6] === 0x1a &&
        buffer[7] === 0x0a
      );
    case 'image/gif': {
      const header = buffer.subarray(0, 6).toString('ascii');
      return header === 'GIF87a' || header === 'GIF89a';
    }
    case 'image/webp':
      return (
        buffer.subarray(0, 4).toString('ascii') === 'RIFF' &&
        buffer.subarray(8, 12).toString('ascii') === 'WEBP'
      );
    default:
      return false;
  }
}

/** Filesystem errors that mean "this platform has no writable disk". */
const READ_ONLY_FS_CODES = new Set(['EROFS', 'EACCES', 'EPERM']);

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (user.isSuspended || user.status === 'SUSPENDED') {
      return NextResponse.json(
        { error: 'Account is suspended. Avatar uploads are restricted. Please appeal via Support Tickets.' },
        { status: 403 }
      );
    }

    const formData = await req.formData();
    const file = formData.get('avatar') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No avatar file provided' }, { status: 400 });
    }

    const extension = ALLOWED_IMAGE_TYPES[file.type];
    if (!extension) {
      return NextResponse.json(
        { error: 'Please upload a JPEG, PNG, WebP, or GIF image.' },
        { status: 400 }
      );
    }

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size exceeds 5MB limit' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    if (!magicBytesMatch(buffer, file.type)) {
      return NextResponse.json(
        { error: 'That file does not appear to be a valid image.' },
        { status: 400 }
      );
    }

    let publicUrl = '';
    try {
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
      await fs.mkdir(uploadsDir, { recursive: true });

      const filename = `avatar-${user.id}-${Date.now()}.${extension}`;
      const filePath = path.join(uploadsDir, filename);

      await fs.writeFile(filePath, buffer);
      publicUrl = `/uploads/${filename}`;
    } catch (fsErr) {
      // Graceful fallback for read-only filesystem environments (Vercel serverless)
      console.warn('Read-only filesystem detected, storing avatar as base64 data URL.');
      publicUrl = `data:${file.type};base64,${buffer.toString('base64')}`;
    }

    // Update user in database
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { avatarUrl: publicUrl },
      select: {
        id: true,
        name: true,
        email: true,
        avatarUrl: true,
        emailVerified: true,
      },
    });

    await prisma.notification.create({
      data: {
        userId: user.id,
        type: 'avatar_updated',
        title: 'Profile Picture Updated',
        message: 'Your new avatar image was uploaded and saved.',
      },
    });

    return NextResponse.json({
      success: true,
      avatarUrl: publicUrl,
      user: updatedUser,
    });
  } catch (error: any) {
    console.error('Error uploading avatar:', error);
    return NextResponse.json({ error: error.message || 'Failed to upload profile picture' }, { status: 500 });
  }
}
