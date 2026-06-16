/// <reference types="vite/client" />

declare global {
  interface Window {
    lastPlatform?: string
    // Reddit Pixel queue/function, installed by the snippet in index.html.
    rdt?: (...args: unknown[]) => void
  }
}

export {}
