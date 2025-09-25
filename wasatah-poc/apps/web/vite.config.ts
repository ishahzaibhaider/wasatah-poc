import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // Make environment variables available at build time
    'import.meta.env.VITE_READONLY': JSON.stringify(process.env.VITE_READONLY || 'false'),
    'import.meta.env.VITE_API_URL': JSON.stringify(process.env.VITE_API_URL || 'https://68d4f5b9c0da7f00085dc062--wasatah-poc.netlify.app/.netlify/functions/api'),
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      external: [],
    },
  },
  server: {
    port: 5173,
    host: true
  }
})
