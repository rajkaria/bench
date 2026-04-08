import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        bench: {
          primary: '#0A0A0A',
          accent: '#F97316',
          green: '#22C55E',
          yellow: '#EAB308',
          red: '#EF4444',
          muted: '#71717A',
          surface: '#18181B',
          border: '#27272A',
        },
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
    },
  },
  plugins: [],
};

export default config;
