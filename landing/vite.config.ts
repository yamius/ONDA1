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

        // preload as="style" for the main CSS bundle — moves it before <script> in discovery order
        const cssTags = Object.values(ctx.bundle)
          .filter(chunk => chunk.type === 'asset' && chunk.fileName.endsWith('.css'))
          .map(chunk => `  <link rel="preload" as="style" href="/${chunk.fileName}">`)
          .join('\n')

        const tags = [cssTags, jsTags].filter(Boolean).join('\n')
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
    preloadCriticalChunks(['HomePage']),
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
})
