import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        blue: {
          600: '#2563eb',
          700: '#1d4ed8',
        },
      },
    },
  },
  // Optimización de CSS
  plugins: [],
  // Minimizar CSS en producción
  safelist: [],
  // Habilitar modo purge agresivo
  corePlugins: {
    preflight: true,
  },
};

export default config;
