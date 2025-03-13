import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // Ajustez ceci à l'URL de votre serveur backend
        changeOrigin: true,
      }
    }
  }
})