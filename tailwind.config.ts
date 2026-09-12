import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // ─── NATURESTUDIOS BURGUNDY + WARM BEIGE VISUAL IDENTITY ────────────────
      colors: {
        // Primary Identity: Deep Burgundy, Wine & Maroon
        burgundy: {
          DEFAULT: '#59171B',
          deep:    '#3A0E11',
          dark:    '#220608',
          darker:  '#150304',
          light:   '#7A2228',
          bright:  '#9B2831',
          glow:    'rgba(89, 23, 27, 0.45)',
        },
        wine: {
          DEFAULT: '#3A0E11',
          deep:    '#240709',
          dark:    '#1A0507',
          light:   '#4D1418',
          glow:    'rgba(58, 14, 17, 0.50)',
        },
        maroon: {
          DEFAULT: '#450E13',
          dark:    '#2C080B',
          light:   '#5C141B',
        },

        // Primary Accent / Highlights: Warm Beige & Cream
        beige: {
          DEFAULT: '#FED7B8',
          light:   '#FFF0E3',
          warm:    '#F7C49E',
          dark:    '#E6AD84',
          muted:   '#C89E7E',
          glow:    'rgba(254, 215, 184, 0.25)',
        },
        cream: {
          DEFAULT: '#FFF5ED',
          soft:    '#F5E8DC',
          dim:     '#E8D5C4',
          muted:   '#A88874',
        },
        peach: {
          DEFAULT: '#F7C49E',
          soft:    '#FADEC9',
          deep:    '#E59E6B',
        },
        'dusty-rose': {
          DEFAULT: '#B86B77',
          light:   '#D48B96',
          dark:    '#8E4C56',
        },
        brown: {
          DEFAULT: '#4A2518',
          deep:    '#31170E',
          light:   '#633321',
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

        // Backgrounds: Deep Burgundy Void to Wine Surfaces
        void:     '#150304',
        midnight: '#1C0507',
        deep:     '#240709',
        navy:     '#2D0A0E',
        indigo:   { DEFAULT: '#3A0E11', deep: '#240709', soft: '#4A1216', glow: 'rgba(89, 23, 27, 0.20)' },
        surface: {
          DEFAULT:   '#2D0A0E',
          raised:    '#3A0E11',
          secondary: '#350B10',
          elevated:  '#4A1216',
          hover:     '#5A161D',
          card:      '#240709',
        },

        // Status
        success: '#18A957',
        warning: '#D9540C',
        error:   '#E63946',
        info:    '#8A2E3B',

        // Typography / Content
        smoke: '#543D36',
        fog:   '#B89B8D',
        sand:  '#FED7B8',
        ash:   '#7A6158',

        // Borders
        rim:   '#3D0D13',
        edge:  '#52141A',
        frame: '#6E1D24',

        // Legacy aliases
        teal: {
          DEFAULT: '#2D0A0E',
          deep:    '#240709',
          shadow:  '#1C0507',
          card:    '#240709',
          border:  '#52141A',
          light:   '#3A0E11',
        },
        paper: {
          DEFAULT: '#FFF5ED',
          dim:     '#FED7B8',
          muted:   '#B89B8D',
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
        'glow-burgundy': '0 0 40px -5px rgba(89, 23, 27, 0.65)',
        'glow-beige':    '0 0 35px -5px rgba(254, 215, 184, 0.35)',
        'glow-wine':     '0 0 50px 0px rgba(58, 14, 17, 0.80)',
        'glow-forest':   '0 0 35px -5px rgba(24, 169, 87, 0.40)',
        'glow-ember':    '0 0 35px -5px rgba(255, 107, 26, 0.40)',
        'glow-red':      '0 0 35px -5px rgba(230, 57, 70, 0.50)',
        'card':          '0 20px 40px -15px rgba(21, 3, 4, 0.90)',
        'card-lg':       '0 30px 60px -20px rgba(21, 3, 4, 0.95)',
        'float':         '0 8px 32px -8px rgba(21, 3, 4, 0.80)',
        // Legacy
        'glow-green':    '0 0 35px -5px rgba(24, 169, 87, 0.40)',
        'glow-orange':   '0 0 35px -5px rgba(255, 107, 26, 0.40)',
        'card-elevated': '0 20px 40px -15px rgba(21, 3, 4, 0.90)',
      },

      // ─── BACKGROUNDS ────────────────────────────────────────────────────────
      backgroundImage: {
        'gradient-radial':    'radial-gradient(var(--tw-gradient-stops))',
        'noise-grain':        "url('/media/grain.png')",
        'gradient-void':      'linear-gradient(180deg, #150304 0%, #220608 100%)',
        'gradient-cinematic': 'linear-gradient(135deg, #1A0507 0%, #3A0E11 50%, #240709 100%)',
        'gradient-burgundy':  'linear-gradient(180deg, #240709 0%, #3A0E11 50%, #59171B 100%)',
        'gradient-warm':      'linear-gradient(135deg, #59171B 0%, #8E2B33 50%, #FED7B8 100%)',
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
