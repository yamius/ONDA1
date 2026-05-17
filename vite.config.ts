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
            name: env.SENTRY_RELEASE || process.env.SENTRY_RELEASE || "onda-life@1.7.1",
          },
        })
      : null,
  ].filter(Boolean),
  base: "./",
  build: {
    // Needed so Sentry can map minified stacks back to source.
    sourcemap: true,
    rollupOptions: {
      output: {
        // Split big vendor libraries into their own chunks so the initial
        // bundle (main.tsx + App.tsx + i18n) stays small. Each chunk is
        // cached separately by the WebView and parsed only when its
        // dynamic import fires — Three.js, Sentry, Supabase, etc. all live
        // outside the cold-start path now.
        manualChunks: (id) => {
          if (!id.includes("node_modules")) return undefined;
          if (id.includes("three")) return "vendor-three";
          if (id.includes("@sentry")) return "vendor-sentry";
          if (id.includes("@supabase")) return "vendor-supabase";
          if (id.includes("@capacitor")) return "vendor-capacitor";
          if (id.includes("firebase")) return "vendor-firebase";
          if (id.includes("react-i18next") || id.includes("i18next")) return "vendor-i18n";
          if (id.includes("lottie")) return "vendor-lottie";
          if (id.includes("framer-motion")) return "vendor-motion";
          if (id.includes("react-dom") || id.includes("react/")) return "vendor-react";
          return undefined;
        },
      },
    },
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
