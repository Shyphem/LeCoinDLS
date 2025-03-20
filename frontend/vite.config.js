import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    host: '0.0.0.0', // Permet d'accepter les connexions externes
    port: 5173, // Vous pouvez changer le port si nécessaire
  }
})
