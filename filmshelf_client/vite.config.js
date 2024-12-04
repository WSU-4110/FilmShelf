import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/showtimes': {
        target: 'https://serpapi.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/showtimes/, '/search'),
      },
    },
  },
  test: {
    environment: 'jsdom', // Use jsdom for DOM-like environment
    globals: true, // Enable global test functions like `describe` and `it`
    setupFiles: './vitest.setup.js', // (Optional) Path to setup file for mocking
  },
})
