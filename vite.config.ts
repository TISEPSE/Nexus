import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// @ts-expect-error process is a nodejs global
const host = process.env.TAURI_DEV_HOST;

// https://vite.dev/config/
export default defineConfig(async () => ({
  plugins: [react()],

  // Set base path: '/' for Tauri/Docker builds, '/Nexus/' for GitHub Pages
  base: process.env.TAURI_ENV_PLATFORM || process.env.TAURI_PLATFORM || process.env.VITE_BASE_PATH === '/' ? '/' : '/Nexus/',

  // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
  //
  // 1. prevent Vite from obscuring rust errors
  clearScreen: false,
  // 2. tauri expects a fixed port, fail if that port is not available
  server: {
    port: 1420,
    strictPort: true,
    host: host || false,
    hmr: {
      protocol: "ws",
      host: host || "localhost",
      port: 1420,
      clientPort: 1420,
    },
    watch: {
      // 3. tell Vite to ignore watching `src-tauri`
      ignored: ["**/src-tauri/**"],
    },
  },
}));
