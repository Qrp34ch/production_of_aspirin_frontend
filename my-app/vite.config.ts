import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  server: { 
    port: 3000,
    proxy: {
      '/API': {
        target: 'http://localhost:8080', // Ваш Go бэкенд на порту 8080
        changeOrigin: true,
        secure: false,
        //rewrite: (path) => path.replace(/^\/api/, '') // Убираем /api из пути
      },
    }
  },
  plugins: [react()],
})