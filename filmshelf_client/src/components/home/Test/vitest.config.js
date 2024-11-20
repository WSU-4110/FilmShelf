import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true, // Enables global test methods
    environment: 'jsdom', // Simulates browser environment for testing
    setupFiles: './test/setup.js', // Global setup file
    css: true, // Enables CSS imports in tests
  },
});