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
        background: '#030507',
        foreground: '#f1f5f9',
        card: {
          DEFAULT: 'rgba(8, 12, 18, 0.65)',
          foreground: '#f1f5f9',
        },
        popover: {
          DEFAULT: '#080c14',
          foreground: '#f1f5f9',
        },
        primary: {
          DEFAULT: '#00a8ff',
          foreground: '#030507',
        },
        secondary: {
          DEFAULT: '#0e1726',
          foreground: '#94a3b8',
        },
        muted: {
          DEFAULT: '#0e1726',
          foreground: '#64748b',
        },
        accent: {
          DEFAULT: '#00a8ff',
          foreground: '#ffffff',
        },
        destructive: {
          DEFAULT: '#ef4444',
          foreground: '#ffffff',
        },
        border: 'rgba(0, 168, 255, 0.15)',
        input: 'rgba(0, 168, 255, 0.1)',
        ring: '#00a8ff',
        electric: {
          DEFAULT: '#00a8ff',
          light: '#00c8ff',
          dark: '#008cff',
          glow: 'rgba(0, 168, 255, 0.25)',
        },
      },
      borderRadius: {
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


