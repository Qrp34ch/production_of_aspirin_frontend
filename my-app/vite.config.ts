// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
// // import { VitePWA } from 'vite-plugin-pwa'

// // https://vitejs.dev/config/
// export default defineConfig({
//   server: { 
//     port: 3000,
//     proxy: {
//       '/API': {
//         target: 'http://localhost:8080', 
//         changeOrigin: true,
//         secure: false,
//       },
//     }
//   },
//   plugins: [react()],
// })

// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/RIP_frontend/',
  plugins: [
    react({
      jsxRuntime: 'automatic'
    }),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico'],
      manifest: {
        name: 'Производство аспирина',
        short_name: 'Аспирин',
        description: 'Веб-сервис по производству аспирина с этапами химических реакций',
        theme_color: '#00A88F',
        background_color: '#EBF8F6',
        display: 'standalone',
        start_url: '/RIP_frontend/',
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
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/localhost:9000\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'aspirin-images-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 30 * 24 * 60 * 60 // 30 дней
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      },
      devOptions: {
        enabled: false // Включаем PWA в development для тестирования
      }
    })
  ],
  build: {
    sourcemap: false // Отключаем sourcemaps для уменьшения размера
  },
  server: { 
    port: 3000,
    proxy: {
      '/API': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
    }
  },
})