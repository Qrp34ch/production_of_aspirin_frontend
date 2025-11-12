import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import mkcert from 'vite-plugin-mkcert'
import fs from 'fs'
import path from 'path'

export default defineConfig({
  base: '/',
  plugins: [
    react({
      jsxRuntime: 'automatic'
    }),
    mkcert(),
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
        start_url: '/',
        scope: '/',
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
        navigateFallback: '/index.html',
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: true
      },
      devOptions: {
        enabled: true,
        type: 'module'
      }
    })
  ],
  server: { 
    host: '0.0.0.0',
    port: 3000,
    strictPort: true,
    https: {
      key: fs.readFileSync(path.resolve(__dirname, 'cert.key')),
      cert: fs.readFileSync(path.resolve(__dirname, 'cert.crt')),
    },
    proxy: {
      '/API': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
    }
  },
})