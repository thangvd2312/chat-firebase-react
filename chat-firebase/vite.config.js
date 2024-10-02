import react from '@vitejs/plugin-react';

import { defineConfig } from 'vite';

import path from 'path';
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      // eslint-disable-next-line no-undef
      "@": path.resolve(__dirname, "src"),
    },
  },
});