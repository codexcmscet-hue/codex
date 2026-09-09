import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#09090b',
        foreground: '#fafafa',
        background: '#030507',
        foreground: '#f1f5f9',
        card: {
          DEFAULT: 'rgba(18, 18, 23, 0.7)',
          foreground: '#fafafa',
          DEFAULT: 'rgba(8, 12, 18, 0.65)',
          foreground: '#f1f5f9',
        },
        popover: {
          DEFAULT: '#121217',
          foreground: '#fafafa',
          DEFAULT: '#080c14',
          foreground: '#f1f5f9',
        },
        primary: {
          DEFAULT: '#ffffff',
          foreground: '#09090b',
          DEFAULT: '#00a8ff',
          foreground: '#030507',
        },
        secondary: {
          DEFAULT: '#27272a',
          foreground: '#fafafa',
          DEFAULT: '#0e1726',
          foreground: '#94a3b8',
        },
        muted: {
          DEFAULT: '#27272a',
          foreground: '#a1a1aa',
          DEFAULT: '#0e1726',
          foreground: '#64748b',
        },
        accent: {
          DEFAULT: '#27272a',
          foreground: '#fafafa',
          DEFAULT: '#00a8ff',
          foreground: '#ffffff',
        },
        destructive: {
          DEFAULT: '#ef4444',
          foreground: '#fafafa',
          foreground: '#ffffff',
        },
        border: 'rgba(255, 255, 255, 0.1)',
        input: 'rgba(255, 255, 255, 0.15)',
        ring: '#ffffff',
        electric: {
          DEFAULT: '#00a8ff',
          light: '#00c8ff',
          dark: '#008cff',
          glow: 'rgba(0, 168, 255, 0.25)',
        },
        border: 'rgba(0, 168, 255, 0.15)',
        input: 'rgba(0, 168, 255, 0.1)',
        ring: '#00a8ff',
      },
      borderRadius: {
        lg: '16px',
        md: '12px',
        sm: '8px',
        xl: '18px',
        lg: '14px',
        md: '10px',
        sm: '6px',
      },
      boxShadow: {
        glass: '0 8px 32px rgba(0, 0, 0, 0.45)',
        'electric-sm': '0 0 15px rgba(0, 168, 255, 0.2)',
        'electric-md': '0 0 25px rgba(0, 168, 255, 0.3)',
        'electric-lg': '0 0 40px rgba(0, 168, 255, 0.4)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;

