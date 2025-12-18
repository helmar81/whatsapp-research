import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),

    VitePWA({
      /* ----------------------------
       * PWA registration
       * ---------------------------- */
      registerType: 'autoUpdate',
      injectRegister: 'auto',

      /* ----------------------------
       * Assets to precache
       * ---------------------------- */
      includeAssets: [
        'favicon.svg',
        'icon-192.png',
        'icon-512.png',
      ],

      /* ----------------------------
       * Web App Manifest
       * ---------------------------- */
      manifest: {
        name: 'ChatLens – WhatsApp Research',
        short_name: 'ChatLens',
        description: 'Private, offline-first WhatsApp chat analysis tool',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        orientation: 'portrait-primary',
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
          {
            src: '/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },

      /* ----------------------------
       * Offline & caching strategy
       * ---------------------------- */
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico}'],
        navigateFallback: '/',
        cleanupOutdatedCaches: true,
      },

      /* ----------------------------
       * Dev options (important!)
       * ---------------------------- */
      devOptions: {
        enabled: true, // allows PWA testing in dev
      },
    }),
  ],

  /* ----------------------------
   * Dev server (unchanged, verified)
   * ---------------------------- */
  server: {
    port: 3003,
    strictPort: true,
    host: true,
    hmr: {
      clientPort: 3003,
    },
  },
});
