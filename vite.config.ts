import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'ChatLens - WhatsApp Research',
        short_name: 'ChatLens',
        start_url: '/',
        display: 'standalone',
        background_color: '#0b141a',
        theme_color: '#25D366',
        icons: [
          {
            src: '/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
  server: {
    port: 3003,      // Matches your browser's current port
    strictPort: true, // Prevents Vite from switching to another port if 3003 is busy
    host: true,       // Exposes the project on the network
    hmr: {
      clientPort: 3003, // Fixes the "[vite] failed to connect to websocket" error
    },
  },
});