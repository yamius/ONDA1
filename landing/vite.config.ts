import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

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

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    // Preload critical chunks the homepage needs in parallel with parsing HTML.
    // Pages stay lazy (other routes don't pull these into the network).
    preloadCriticalChunks(['HomePage', 'vendor-react', 'vendor-router', 'vendor-i18n']),
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
    cssCodeSplit: true,
    // Inline very small assets to skip extra HTTP roundtrips
    assetsInlineLimit: 2048,
    rollupOptions: {
      output: {
        // Stable vendor chunks → long-lived cache across deploys.
        // Pages already split via React.lazy in main.tsx.
        manualChunks(id: string) {
          if (!id.includes('node_modules')) return
          if (id.includes('react-router')) return 'vendor-router'
          if (id.includes('react-i18next') || id.includes('/i18next/') || id.includes('\\i18next\\')) return 'vendor-i18n'
          if (id.includes('react-markdown') || id.includes('rehype') || id.includes('remark') || id.includes('unified') || id.includes('mdast') || id.includes('hast') || id.includes('micromark')) return 'vendor-markdown'
          if (id.includes('react-dom') || id.includes('/react/') || id.includes('scheduler')) return 'vendor-react'
          if (id.includes('@supabase')) return 'vendor-supabase'
          return 'vendor'
        },
      },
    },
  },
})
