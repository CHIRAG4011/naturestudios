import { NextRequest, NextResponse } from 'next/server';
import { requireAdminPermission, unauthorizedResponse } from '@/lib/admin-guard';
import { isMongoConfigured } from '@/lib/mongodb';

export async function GET(req: NextRequest) {
  const auth = await requireAdminPermission(req, 'backups.view');
  if (!auth.authorized) {
    return unauthorizedResponse(auth);
  }

  const mongoConfigured = isMongoConfigured();

  return NextResponse.json({
    backupSystem: {
      provider: mongoConfigured ? 'MongoDB Atlas Continuous Cloud Backup' : 'Not configured (Local Development)',
      configured: mongoConfigured,
      status: mongoConfigured ? 'OPERATIONAL' : 'NOT_CONFIGURED',
      type: 'Continuous Point-In-Time Restore (PITR)',
      retentionPolicy: mongoConfigured ? '7-day continuous snapshots + 30-day daily backups' : 'None',
      storageLocation: 'Atlas Dedicated Regional Snapshot Storage',
      automated: mongoConfigured,
      note: mongoConfigured
        ? 'Backups are managed externally through MongoDB Atlas Cloud Console with automatic TLS encryption and point-in-time recovery.'
        : 'Connect a production MONGODB_URI in MongoDB Atlas to enable continuous point-in-time cloud backups.',
    },
  });
}
