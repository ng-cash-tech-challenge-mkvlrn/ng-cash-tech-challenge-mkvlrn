import react from '@vitejs/plugin-react';
import { config as dotenvConfig } from 'dotenv';
import { resolve } from 'path';
import { defineConfig } from 'vite';

dotenvConfig();

export default defineConfig({
  plugins: [react()],
  root: './src/frontend',
  resolve: {
    alias: {
      '#': resolve(__dirname, './src'),
    },
  },
  define: {
    'process.env.PORT': process.env.PORT,
  },
  base: '',
  build: {
    outDir: '../../build/client',
  },
  server: {
    port: +process.env.PORT! - 1000,
    open: true,
  },
});
