import type { Config } from 'tailwindcss';
const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: { extend: { colors: { navy: { DEFAULT: '#1e3a5f', dark: '#0d2040', mid: '#2563a8' } } } },
  plugins: [],
};
export default config;
