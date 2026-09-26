import { getActiveSiteTheme, SiteThemeDoc } from './admin-db';

/**
 * NATURESTUDIOS — GLOBAL THEME INJECTOR
 * Provides centralized CSS custom properties and tokens dynamically loaded
 * from MongoDB Atlas with fallback to Deep Burgundy & Warm Beige.
 */

export async function getGlobalThemeCss(): Promise<string> {
  let theme: SiteThemeDoc;

  try {
    theme = await getActiveSiteTheme();
  } catch (e) {
    theme = {
      version: 1,
      name: 'Cyber Onyx & Electric Blue',
      status: 'PUBLISHED',
      colors: {
        primary: '#2563EB',
        secondary: '#38BDF8',
        background: '#030712',
        surface: '#0B132B',
        text: '#F8FAFC',
        mutedText: '#94A3B8',
        border: '#172554',
        accent: '#38BDF8',
        success: '#18A957',
        warning: '#F59E0B',
        error: '#E63946',
        liveRed: '#E63946',
      },
      gradients: {
        primary: 'linear-gradient(135deg, #2563EB 0%, #0B132B 100%)',
        secondary: 'linear-gradient(135deg, #38BDF8 0%, #F8FAFC 100%)',
        ambientMesh: 'radial-gradient(circle, rgba(37, 99, 235, 0.4) 0%, transparent 70%)',
      },
      typography: {
        displayFont: 'Syne, sans-serif',
        headingFont: 'Outfit, sans-serif',
        bodyFont: 'Inter, sans-serif',
        monoFont: 'JetBrains Mono, monospace',
        headingScale: '1.0',
        bodyScale: '1.0',
      },
      design: {
        borderRadius: '16px',
        spacingScale: '1.0',
        shadowIntensity: '0.8',
        blurIntensity: '12px',
        buttonStyle: 'rounded-xl',
        cardStyle: 'bordered',
        animationIntensity: 'CINEMATIC',
        grainIntensity: 0.15,
        particleIntensity: 0.25,
      },
      createdBy: 'system',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  const { colors, gradients, typography, design } = theme;

  return `
    :root {
      --ns-color-primary: ${colors.primary};
      --ns-color-secondary: ${colors.secondary};
      --ns-color-bg: ${colors.background};
      --ns-color-surface: ${colors.surface};
      --ns-color-text: ${colors.text};
      --ns-color-muted: ${colors.mutedText};
      --ns-color-border: ${colors.border};
      --ns-color-accent: ${colors.accent};
      --ns-color-success: ${colors.success};
      --ns-color-warning: ${colors.warning};
      --ns-color-error: ${colors.error};
      --ns-color-live: ${colors.liveRed};

      --ns-grad-primary: ${gradients.primary};
      --ns-grad-secondary: ${gradients.secondary};
      --ns-grad-mesh: ${gradients.ambientMesh};

      --ns-radius: ${design.borderRadius};
      --ns-blur: ${design.blurIntensity};
    }
  `;
}
