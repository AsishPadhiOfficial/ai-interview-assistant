import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  // When hosting on GitHub Pages at https://<user>.github.io/ai-interview-assistant/
  // we must set the base path so assets resolve correctly.
  base: '/ai-interview-assistant/',
  plugins: [react()],
  server: {
    port: 3000,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
})
