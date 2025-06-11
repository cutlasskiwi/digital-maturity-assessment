import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Use different base paths for dev vs production
  base: process.env.NODE_ENV === 'production' 
    ? '/content/digital-maturity-assessment/' 
    : '/',
})