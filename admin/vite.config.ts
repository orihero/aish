import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    port: 8300,
    host: "0.0.0.0",
    allowedHosts: ["business.aish.uz", "api.aish.uz"],
    hmr: {
      port: 8300,
      host: "0.0.0.0",
      clientPort: 8300,
    },
    cors: true,
  },
});
