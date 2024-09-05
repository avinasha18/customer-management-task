import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from 'tailwindcss'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  css: {
    postcss: {
      plugins: [tailwindcss()],
    },
  },
  server: {
    host: '0.0.0.0',
    port: process.env.PORT || 5173,
  },
  build: {
    sourcemap: mode === 'production' ? false : true,  // Disable source maps in production
  },
  preview: {
    host: '0.0.0.0',
    port: process.env.PORT || 4173,
  },
}))
