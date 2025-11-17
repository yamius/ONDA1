import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/", // ← было './', ставим '/' ИЛИ просто удаляем эту строку
  optimizeDeps: {
    exclude: ["lucide-react"],
  },
  server: {
    host: "0.0.0.0",
    port: 5000,
  },
  preview: {
    host: "0.0.0.0",
    port: 5000,
  },
});
