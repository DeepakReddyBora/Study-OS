import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // This ensures assets are loaded correctly regardless of the URL depth
  base: '/', 
  build: {
    outDir: 'dist',
  }
})