import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 8200,
    host: '0.0.0.0',
  },
  build: {
    outDir: 'build',
    sourcemap: true,
  },
  define: {
    // Define environment variables that should be available in the client
    'process.env': process.env,
  },
})
