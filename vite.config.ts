import { defineConfig } from "vite";
import dotenv from "dotenv";
import environment from "vite-plugin-environment";
import path from "path";
import vue from "@vitejs/plugin-vue";

dotenv.config({ path: ".env" });

export default defineConfig({
  root: "packages/frontend",
  build: {
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./packages/frontend"),
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: "globalThis",
      },
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://127.0.0.1:4943",
        changeOrigin: true,
      },
    },
  },
  plugins: [
    vue(),
    environment("all", { prefix: "CANISTER_" }),
    environment("all", { prefix: "DFX_" }),
  ],
});
