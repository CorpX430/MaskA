import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#070707',
        panel: '#111111',
        line: '#252525',
        electric: '#3a9bff',
        mint: '#73f7bb',
        paper: '#f4f5f6',
        muted: '#94989f',
      },
      fontFamily: {
        sans: ['var(--font-geist)', 'Arial', 'sans-serif'],
        display: ['var(--font-space-grotesk)', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(58,155,255,.2), 0 12px 60px rgba(0,0,0,.35)',
      },
    },
  },
  plugins: [],
};

export default config;
