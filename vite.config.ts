import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { sentryVitePlugin } from "@sentry/vite-plugin";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load .env / .env.local / .env.production (all keys, not just VITE_*).
  // Needed so SENTRY_AUTH_TOKEN from .env.local reaches the Sentry plugin.
  const env = loadEnv(mode, process.cwd(), "");
  const sentryToken = env.SENTRY_AUTH_TOKEN || process.env.SENTRY_AUTH_TOKEN;

  return {
  plugins: [
    react(),
    // Upload source maps to Sentry on production builds only.
    // Requires SENTRY_AUTH_TOKEN in .env.local or CI secret.
    mode === "production" && sentryToken
      ? sentryVitePlugin({
          org: "onda-y0",
          project: env.SENTRY_PROJECT || process.env.SENTRY_PROJECT || "capacitor",
          authToken: sentryToken,
          sourcemaps: {
            assets: "./dist/**",
          },
          release: {
            name: env.SENTRY_RELEASE || process.env.SENTRY_RELEASE || "onda-life@1.0.1",
          },
        })
      : null,
  ].filter(Boolean),
  base: "./",
  build: {
    // Needed so Sentry can map minified stacks back to source.
    sourcemap: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    exclude: ["lucide-react"],
  },
  server: {
    host: "0.0.0.0",
    port: 5000,
    allowedHosts: true,
  },
  preview: {
    host: "0.0.0.0",
    port: 5000,
    allowedHosts: true,
  },
  };
});
