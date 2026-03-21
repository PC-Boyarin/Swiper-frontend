import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  esbuild: {
    // Игнорировать ошибки при сборке
    logOverride: { 'this-is-undefined-in-esm': 'silent' }
  },
  build: {
    // Продолжать сборку даже при ошибках
    rollupOptions: {
      onwarn(warning, warn) {
        // if (warning.code === 'ESLINT_ERROR') return;
        warn(warning);
      }
    }
  }
})
