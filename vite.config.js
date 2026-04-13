import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const API = 'https://rbi-track-c-api-2333988202.asia-south1.run.app'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/auth':         { target: API, changeOrigin: true, secure: true },
      '/voice':        { target: API, changeOrigin: true, secure: true },
      '/conversation': { target: API, changeOrigin: true, secure: true },
      '/complaints':   { target: API, changeOrigin: true, secure: true },
      '/admin':        { target: API, changeOrigin: true, secure: true },
      '/analytics':    { target: API, changeOrigin: true, secure: true },
      '/lifecycle':    { target: API, changeOrigin: true, secure: true },
      '/department':   { target: API, changeOrigin: true, secure: true },
      '/status':       { target: API, changeOrigin: true, secure: true },
    },
  },
})
