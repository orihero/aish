import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    port: 8300,
    host: "0.0.0.0",
    allowedHosts: ["business.aish.uz", "api.aish.uz", "localhost"],
    cors: true,
    // Configure HMR based on environment
    hmr: mode === 'development' ? {
      port: 8300,
      host: "localhost",
    } : false,
  },
  // Ensure proper base URL for production builds
  base: mode === 'production' ? '/' : '/',
}));
