import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    VITE_BUCKET_SLUG: process.env.VITE_BUCKET_SLUG,
  },
})
