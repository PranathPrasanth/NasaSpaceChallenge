// frontend/vite.config.js

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {                          // Match any request starting with /api
        target: 'https://nasaspacechallenge-rj3s.onrender.com/send-data', // Your Flask backend
        changeOrigin: true,
        secure: false,                   // If using HTTPS on Flask, set to true
        rewrite: (path) => path.replace(/^\/api/, ''), // Remove /api prefix
      },
    },
  },
})
