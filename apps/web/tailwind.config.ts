import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        aicte: {
          blue: '#1E3A8A',
          dark: '#0F172A',
          accent: '#2563EB',
          gold: '#D97706',
          emerald: '#059669',
          crimson: '#DC2626',
        },
      },
    },
  },
  plugins: [],
};

export default config;
