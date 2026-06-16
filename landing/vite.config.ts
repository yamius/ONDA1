import { defineConfig, loadEnv, type PluginOption } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// Dev mirror of server.js's /runtime-env.js so the runtime-config path works the
// same way in `vite dev` (reads VITE_POSTHOG_* from .env/.env.local). In prod the
// real route lives in server.js (request-time process.env).
function runtimeEnvDev(env: Record<string, string>): PluginOption {
  return {
    name: 'runtime-env-dev',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if ((req.url ?? '').split('?')[0] !== '/runtime-env.js') return next()
        const cfg = { POSTHOG_KEY: env.VITE_POSTHOG_KEY || '', POSTHOG_HOST: env.VITE_POSTHOG_HOST || '' }
        res.setHeader('Content-Type', 'application/javascript')
        res.end(`window.__ONDA_ENV__=${JSON.stringify(cfg)};`)
      })
    },
  }
}

function preloadCriticalChunks(names: string[]) {
  return {
    name: 'preload-critical-chunks',
    apply: 'build' as const,
    transformIndexHtml: {
      order: 'post' as const,
      handler(html: string, ctx: { bundle?: Record<string, { type: string; fileName: string; name?: string }> }) {
        if (!ctx.bundle) return html

        // modulepreload for JS chunks
        const jsTags = Object.values(ctx.bundle)
          .filter(chunk => chunk.type === 'chunk' && names.includes(chunk.name ?? ''))
          .map(chunk => `  <link rel="modulepreload" crossorigin href="/${chunk.fileName}">`)
          .join('\n')

        // CSS preload removed: Vite already injects <link rel="stylesheet"> which triggers
        // the download immediately. A preload hint *after* the stylesheet tag is redundant.
        const tags = [jsTags].filter(Boolean).join('\n')
        if (!tags) return html
        return html.replace('</head>', `${tags}\n</head>`)
      },
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())
  return {
  plugins: [
    react(),
    tailwindcss(),
    preloadCriticalChunks(['HomePage']),
    runtimeEnvDev(env),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    allowedHosts: true,
  },
  build: {
    outDir: 'dist',
  },
  }
})
