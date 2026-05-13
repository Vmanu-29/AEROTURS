import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    open: true,
  },

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  build: {
    // Minificación agresiva
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    // Code splitting para reducir bundle principal
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router'],
          'vendor-ui': [
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-select',
            '@radix-ui/react-popover',
          ],
          'vendor-charts': ['recharts'],
          'vendor-form': ['react-hook-form'],
        },
      },
    },
    // Reportar tamaño del bundle
    reportCompressedSize: false,
    // Aumentar límite de warnings
    chunkSizeWarningLimit: 1000,
  },

  // Optimizar CSS
  css: {
    transformer: 'lightningcss',
  },

  // Tipos de archivo para soportar importaciones raw
  assetsInclude: ['**/*.svg', '**/*.csv'],
})