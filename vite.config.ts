import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  base: '/CoinLedgerWebApp/',
  plugins: [
    vue(),
    vueDevTools(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
      },
      manifest: {
        name: 'Coin Ledger Conversion Tool',
        short_name: 'CoinLedger',
        description: 'Convert cryptocurrency reward data to CoinLedger CSV format',
        theme_color: '#1976D2',
        background_color: '#121212',
        display: 'standalone',
        icons: [
          {
            src: '/src/assets/favicon.ico',
            sizes: '16x16 32x32',
            type: 'image/x-icon',
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
