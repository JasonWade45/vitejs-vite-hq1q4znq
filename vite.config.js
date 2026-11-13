import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Arena live-preview proxy rewrites the Host header (e.g. 5173-<sandbox>.e2b.app)
    allowedHosts: true,
  },
  preview: {
    allowedHosts: true,
  },
})
