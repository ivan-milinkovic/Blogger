import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    setupFiles: ["src/__tests__/vitest-setup.ts"],
    environment: "jsdom",
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true
  }
});
