import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import * as dotenv from 'dotenv';

const envPaths = {
  development: '.env.dev',
  integration: '.env.dev',
  production: '.env.prod',
};

dotenv.config({
  path: envPaths[process.env.NODE_ENV as keyof typeof envPaths],
});

export default defineConfig({
  ...(process.env.VITE_BASE_URL ? { base: process.env.VITE_BASE_URL } : {}),
  plugins: [react()],
});
