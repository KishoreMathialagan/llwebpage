import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2020',
    cssCodeSplit: true,
    // The lazy 3D hero chunk bundles Three.js; it is intentionally large and
    // deferred, so keep the warning threshold aligned with that reality.
    chunkSizeWarningLimit: 1000,
  },
})
