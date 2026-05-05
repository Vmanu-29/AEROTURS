import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    // Los plugins de React y Tailwind son requeridos para Make, incluso si
    // Tailwind no se está usando activamente – no los elimines
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      // Alias @ hacia el directorio src
      '@': path.resolve(__dirname, './src'),
    },
  },

  // Tipos de archivo para soportar importaciones raw. Nunca agregues archivos .css, .tsx, o .ts a esto.
  assetsInclude: ['**/*.svg', '**/*.csv'],
})