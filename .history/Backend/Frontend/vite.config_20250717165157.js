import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/Remove-Item -Recurse -Force node_modules, package-lock.json

export default defineConfig({
  plugins: [react(), tailwindcss()],
   server: {
    port: 4001,
    proxy: {
      "/api": {
        target: "https://chatify1-e482.onrender.com",
        changeOrigin: true,
      },
    },
  },
})
