import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  define: {
    // Make environment variables available at build time
    'import.meta.env.VITE_READONLY': JSON.stringify(process.env.VITE_READONLY || 'false'),
    'import.meta.env.VITE_API_URL': JSON.stringify(process.env.VITE_API_URL || 'https://wasatah-poc.netlify.app/.netlify/functions/api'),
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    assetsDir: 'assets',
    rollupOptions: {
      external: [],
    },
  },
  server: {
    port: 5173,
    host: true
  },
  publicDir: 'public'
})
