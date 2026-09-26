import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // ─── NATURESTUDIOS CYBER ONYX + ELECTRIC BLUE VISUAL IDENTITY ───────────
      colors: {
        // Primary Identity: Electric Blue, Royal Blue & Deep Navy
        burgundy: {
          DEFAULT: '#2563EB',
          deep:    '#1D4ED8',
          dark:    '#1E3A8A',
          darker:  '#0B132B',
          light:   '#3B82F6',
          bright:  '#60A5FA',
          glow:    'rgba(37, 99, 235, 0.45)',
        },
        wine: {
          DEFAULT: '#1D4ED8',
          deep:    '#0B132B',
          dark:    '#070D1E',
          light:   '#2563EB',
          glow:    'rgba(29, 78, 216, 0.50)',
        },
        maroon: {
          DEFAULT: '#1E40AF',
          dark:    '#0B132B',
          light:   '#3B82F6',
        },

        // Primary Accent / Highlights: Cyber Cyan & Ice White
        beige: {
          DEFAULT: '#38BDF8',
          light:   '#E0F2FE',
          warm:    '#7DD3FC',
          dark:    '#0284C7',
          muted:   '#0284C7',
          glow:    'rgba(56, 189, 248, 0.35)',
        },
        cream: {
          DEFAULT: '#F8FAFC',
          soft:    '#F1F5F9',
          dim:     '#CBD5E1',
          muted:   '#94A3B8',
        },
        peach: {
          DEFAULT: '#60A5FA',
          soft:    '#93C5FD',
          deep:    '#3B82F6',
        },
        'dusty-rose': {
          DEFAULT: '#3B82F6',
          light:   '#60A5FA',
          dark:    '#1D4ED8',
        },
        brown: {
          DEFAULT: '#0F1D38',
          deep:    '#0B132B',
          light:   '#1E3A8A',
        },

        // Secondary DNA: Subtle Green & Orange (Nature & Creative Energy)
        green: {
          DEFAULT: '#18A957',
          dark:    '#10753C',
          light:   '#22C55E',
          glow:    'rgba(24, 169, 87, 0.25)',
        },
        forest: {
          DEFAULT: '#18A957',
          dark:    '#10753C',
          light:   '#22C55E',
          bright:  '#2ECC72',
          glow:    'rgba(24, 169, 87, 0.25)',
        },
        orange: {
          DEFAULT: '#FF6B1A',
          dark:    '#D9540C',
          light:   '#FF8843',
          bright:  '#FF7A28',
          glow:    'rgba(255, 107, 26, 0.25)',
        },
        ember: {
          DEFAULT: '#FF6B1A',
          dark:    '#D9540C',
          light:   '#FF8843',
          bright:  '#FF7A28',
          glow:    'rgba(255, 107, 26, 0.25)',
        },

        // Cinematic Red: Esports / Live Status / Alerts
        red: {
          DEFAULT: '#E63946',
          dark:    '#961B24',
          bright:  '#FF3B47',
          live:    '#E63946',
          glow:    'rgba(230, 57, 70, 0.35)',
        },
        live: {
          DEFAULT: '#E63946',
          bright:  '#FF3B47',
          glow:    'rgba(230, 57, 70, 0.35)',
        },

        // Backgrounds: Pitch Black Void to Obsidian Blue Surfaces
        void:     '#030712',
        midnight: '#050B17',
        deep:     '#0B132B',
        navy:     '#0F1D38',
        indigo:   { DEFAULT: '#2563EB', deep: '#0B132B', soft: '#1E3A8A', glow: 'rgba(37, 99, 235, 0.20)' },
        surface: {
          DEFAULT:   '#0B132B',
          raised:    '#111C35',
          secondary: '#0D182E',
          elevated:  '#16274B',
          hover:     '#1E3A6C',
          card:      '#070D1E',
        },

        // Status
        success: '#18A957',
        warning: '#D9540C',
        error:   '#E63946',
        info:    '#2563EB',

        // Typography / Content
        smoke: '#334155',
        fog:   '#94A3B8',
        sand:  '#38BDF8',
        ash:   '#64748B',

        // Borders
        rim:   '#172554',
        edge:  '#1E3A8A',
        frame: '#2563EB',

        // Legacy aliases
        teal: {
          DEFAULT: '#0F1D38',
          deep:    '#0B132B',
          shadow:  '#050B17',
          card:    '#070D1E',
          border:  '#1E3A8A',
          light:   '#1E40AF',
        },
        paper: {
          DEFAULT: '#F8FAFC',
          dim:     '#38BDF8',
          muted:   '#94A3B8',
        },
      },

      // ─── TYPOGRAPHY ─────────────────────────────────────────────────────────
      fontFamily: {
        display: ['var(--font-archivo)', 'Archivo', 'system-ui', 'sans-serif'],
        sans:    ['var(--font-archivo)', 'Archivo', 'system-ui', 'sans-serif'],
        mono:    ['var(--font-mono)', 'JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        'hero':        ['clamp(3.5rem, 12vw, 11rem)',  { lineHeight: '0.88', letterSpacing: '-0.04em' }],
        'display-xl':  ['clamp(2.5rem, 9.5vw, 8rem)',  { lineHeight: '0.90', letterSpacing: '-0.035em' }],
        'display-lg':  ['clamp(2rem, 7vw, 6rem)',       { lineHeight: '0.90', letterSpacing: '-0.03em'  }],
        'display-md':  ['clamp(1.8rem, 4.2vw, 3.6rem)',{ lineHeight: '0.95', letterSpacing: '-0.025em' }],
        'display-sm':  ['clamp(1.35rem, 2.5vw, 2rem)', { lineHeight: '1.04', letterSpacing: '-0.02em'  }],
        'stat':        ['clamp(2.8rem, 7.5vw, 6.2rem)',{ lineHeight: '0.85', letterSpacing: '-0.045em' }],
        'label':       ['0.6875rem', { lineHeight: '1', letterSpacing: '0.2em'  }],
        'label-sm':    ['0.625rem',  { lineHeight: '1', letterSpacing: '0.22em' }],
      },

      // ─── SHADOWS / GLOWS ────────────────────────────────────────────────────
      boxShadow: {
        'glow-burgundy': '0 0 40px -5px rgba(37, 99, 235, 0.65)',
        'glow-beige':    '0 0 35px -5px rgba(56, 189, 248, 0.45)',
        'glow-wine':     '0 0 50px 0px rgba(29, 78, 216, 0.80)',
        'glow-forest':   '0 0 35px -5px rgba(24, 169, 87, 0.40)',
        'glow-ember':    '0 0 35px -5px rgba(255, 107, 26, 0.40)',
        'glow-red':      '0 0 35px -5px rgba(230, 57, 70, 0.50)',
        'card':          '0 20px 40px -15px rgba(3, 7, 18, 0.95)',
        'card-lg':       '0 30px 60px -20px rgba(2, 6, 23, 0.98)',
        'float':         '0 8px 32px -8px rgba(3, 7, 18, 0.85)',
        // Legacy
        'glow-green':    '0 0 35px -5px rgba(24, 169, 87, 0.40)',
        'glow-orange':   '0 0 35px -5px rgba(255, 107, 26, 0.40)',
        'card-elevated': '0 20px 40px -15px rgba(3, 7, 18, 0.95)',
      },

      // ─── BACKGROUNDS ────────────────────────────────────────────────────────
      backgroundImage: {
        'gradient-radial':    'radial-gradient(var(--tw-gradient-stops))',
        'noise-grain':        "url('/media/grain.png')",
        'gradient-void':      'linear-gradient(180deg, #030712 0%, #070D1E 100%)',
        'gradient-cinematic': 'linear-gradient(135deg, #050B17 0%, #0F224A 50%, #070D1E 100%)',
        'gradient-burgundy':  'linear-gradient(180deg, #070D1E 0%, #172554 50%, #2563EB 100%)',
        'gradient-warm':      'linear-gradient(135deg, #1D4ED8 0%, #2563EB 50%, #38BDF8 100%)',
      },

      // ─── ANIMATION ──────────────────────────────────────────────────────────
      animation: {
        'pulse-subtle':  'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float-slow':    'float 8s ease-in-out infinite',
        'drift':         'ambientDrift 14s ease-in-out infinite',
        'scanline':      'scanline 8s linear infinite',
        'fade-in':       'fadeIn 0.6s ease-out forwards',
        'slide-up':      'slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'ticker':        'ticker 30s linear infinite',
        'shimmer':       'shimmer 2.5s infinite linear',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-12px)' },
        },
        ambientDrift: {
          '0%':   { transform: 'translate(0, 0) scale(1)', opacity: '0.35' },
          '50%':  { transform: 'translate(30px, -20px) scale(1.1)', opacity: '0.6' },
          '100%': { transform: 'translate(0, 0) scale(1)', opacity: '0.35' },
        },
        scanline: {
          '0%':   { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%':   { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        ticker: {
          '0%':   { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        shimmer: {
          '0%':   { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },

      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '26': '6.5rem',
        '30': '7.5rem',
        '34': '8.5rem',
        '38': '9.5rem',
      },

      borderRadius: {
        'sm':  '4px',
        'md':  '8px',
        'lg':  '12px',
        'xl':  '16px',
        '2xl': '20px',
        '3xl': '28px',
      },

      transitionDuration: {
        '180': '180ms',
        '240': '240ms',
        '350': '350ms',
        '500': '500ms',
        '700': '700ms',
      },
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'in-expo':  'cubic-bezier(0.7, 0, 0.84, 0)',
        'cinema':   'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [],
};

export default config;
