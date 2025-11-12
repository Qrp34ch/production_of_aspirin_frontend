import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/RIP_frontend/',
  plugins: [
    react({
      jsxRuntime: 'automatic'
    }),
    VitePWA({
      registerType: 'prompt',
      includeAssets: ['favicon.ico'],
      manifest: {
        name: 'Производство аспирина',
        short_name: 'Аспирин',
        description: 'Веб-сервис по производству аспирина с этапами химических реакций',
        theme_color: '#00A88F',
        background_color: '#EBF8F6',
        display: 'standalone',
        start_url: '/RIP_frontend/',
        scope: '/RIP_frontend/',
        icons: [
          {
            src: 'A.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'A512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        navigateFallback: '/RIP_frontend/index.html',
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: true
      }
    })
  ],
  build: {
    sourcemap: false
  }
})