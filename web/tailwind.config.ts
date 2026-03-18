import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: { DEFAULT: '#1e3a5f', light: '#e8eef7', mid: '#2563a8' },
        brand: { DEFAULT: '#1e3a5f', foreground: '#ffffff' },
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
export default config;
