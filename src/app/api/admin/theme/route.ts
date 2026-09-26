import { NextRequest, NextResponse } from 'next/server';
import { requireAdminPermission, unauthorizedResponse } from '@/lib/admin-guard';
import {
  getActiveSiteTheme,
  saveSiteTheme,
  rollbackSiteTheme,
  logAdminAudit,
} from '@/lib/admin-db';
import { getMongoDb } from '@/lib/mongodb';

export async function GET(req: NextRequest) {
  const auth = await requireAdminPermission(req, 'theme.view');
  if (!auth.authorized) {
    return unauthorizedResponse(auth);
  }

  const activeTheme = await getActiveSiteTheme();

  const db = await getMongoDb();
  let versions: any[] = [];
  if (db) {
    const docs = await db
      .collection('siteThemeSettings')
      .find({})
      .sort({ version: -1 })
      .limit(10)
      .toArray();

    versions = docs.map((d: any) => {
      const { _id, ...rest } = d;
      return { id: _id.toString(), ...rest };
    });
  }

  return NextResponse.json({
    activeTheme,
    versions,
  });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { theme, action } = body; // action: 'DRAFT' | 'PUBLISH'

  const requiredPerm = action === 'PUBLISH' ? 'theme.publish' : 'theme.edit';
  const auth = await requireAdminPermission(req, requiredPerm);
  if (!auth.authorized) {
    return unauthorizedResponse(auth);
  }

  if (!theme || !theme.colors) {
    return NextResponse.json({ error: 'Invalid theme structure' }, { status: 400 });
  }

  // Prevent arbitrary CSS / HTML injection by strictly whitelisting properties
  const sanitizedTheme = {
    name: String(theme.name || 'Custom Theme'),
    status: (action === 'PUBLISH' ? 'PUBLISHED' : 'DRAFT') as any,
    colors: {
      primary: String(theme.colors.primary || '#2563EB'),
      secondary: String(theme.colors.secondary || '#38BDF8'),
      background: String(theme.colors.background || '#030712'),
      surface: String(theme.colors.surface || '#0B132B'),
      text: String(theme.colors.text || '#F8FAFC'),
      mutedText: String(theme.colors.mutedText || '#94A3B8'),
      border: String(theme.colors.border || '#172554'),
      accent: String(theme.colors.accent || '#38BDF8'),
      success: String(theme.colors.success || '#18A957'),
      warning: String(theme.colors.warning || '#F59E0B'),
      error: String(theme.colors.error || '#E63946'),
      liveRed: String(theme.colors.liveRed || '#E63946'),
    },
    gradients: {
      primary: String(theme.gradients?.primary || 'linear-gradient(135deg, #2563EB 0%, #0B132B 100%)'),
      secondary: String(theme.gradients?.secondary || 'linear-gradient(135deg, #38BDF8 0%, #F8FAFC 100%)'),
      ambientMesh: String(theme.gradients?.ambientMesh || 'radial-gradient(circle, rgba(37, 99, 235, 0.4) 0%, transparent 70%)'),
    },
    typography: {
      displayFont: String(theme.typography?.displayFont || 'Syne, sans-serif'),
      headingFont: String(theme.typography?.headingFont || 'Outfit, sans-serif'),
      bodyFont: String(theme.typography?.bodyFont || 'Inter, sans-serif'),
      monoFont: String(theme.typography?.monoFont || 'JetBrains Mono, monospace'),
      headingScale: String(theme.typography?.headingScale || '1.0'),
      bodyScale: String(theme.typography?.bodyScale || '1.0'),
    },
    design: {
      borderRadius: String(theme.design?.borderRadius || '16px'),
      spacingScale: String(theme.design?.spacingScale || '1.0'),
      shadowIntensity: String(theme.design?.shadowIntensity || '0.8'),
      blurIntensity: String(theme.design?.blurIntensity || '12px'),
      buttonStyle: String(theme.design?.buttonStyle || 'rounded-xl'),
      cardStyle: String(theme.design?.cardStyle || 'bordered'),
      animationIntensity: (theme.design?.animationIntensity || 'CINEMATIC') as any,
      grainIntensity: Number(theme.design?.grainIntensity || 0.15),
      particleIntensity: Number(theme.design?.particleIntensity || 0.25),
    },
    createdBy: auth.user!.email,
  };

  const saved = await saveSiteTheme(sanitizedTheme, action === 'PUBLISH' ? 'PUBLISH' : 'DRAFT');

  await logAdminAudit(
    auth.user!.id,
    auth.user!.email,
    action === 'PUBLISH' ? 'THEME_PUBLISHED' : 'THEME_DRAFTED',
    'theme',
    `v${saved.version}`,
    { version: saved.version, status: saved.status, primary: saved.colors.primary }
  );

  return NextResponse.json({ success: true, theme: saved });
}

export async function PUT(req: NextRequest) {
  const auth = await requireAdminPermission(req, 'theme.publish');
  if (!auth.authorized) {
    return unauthorizedResponse(auth);
  }

  try {
    const { version } = await req.json();
    if (!version) {
      return NextResponse.json({ error: 'Target version required for rollback' }, { status: 400 });
    }

    const success = await rollbackSiteTheme(Number(version));
    if (!success) {
      return NextResponse.json({ error: 'Failed to rollback: version not found' }, { status: 404 });
    }

    await logAdminAudit(
      auth.user!.id,
      auth.user!.email,
      'THEME_ROLLBACK',
      'theme',
      `v${version}`,
      { targetVersion: version }
    );

    return NextResponse.json({ success: true, version });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to execute theme rollback' }, { status: 500 });
  }
}
