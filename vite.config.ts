import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import devContent from './scripts/dev-content.mjs'

export default defineConfig({
  plugins: [react(), devContent()],
  server: { allowedHosts: ["terminal.local"] },
  build: {
    target: 'es2022',
    sourcemap: true,
  },
})
