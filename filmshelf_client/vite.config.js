import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

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
  build: {
    target: 'esnext',
  },
  test: {
    environment: 'jsdom', 
    globals: true, 
    setupFiles: './vitest.setup.js', 
  },
});
