import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'


function figmaAssetResolver() {
  return {
    name: 'figma-asset-resolver',
    resolveId(id) {
      if (id.startsWith('figma:asset/')) {
        const filename = id.replace('figma:asset/', '')
        return path.resolve(__dirname, 'src/assets', filename)
      }
    },
  }
}

export default defineConfig({
  plugins: [
    figmaAssetResolver(),
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