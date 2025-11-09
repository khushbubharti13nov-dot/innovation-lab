import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path'; // Import the path module

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Add SCSS path resolver
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});