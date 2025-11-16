import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import fs from 'fs'

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  // server: {
  //   https: {
  //     key: fs.readFileSync('./certs/localhost+1-key.pem'),
  //     cert: fs.readFileSync('./certs/localhost+1.pem'),
  //   },
  //   host: '127.0.0.1',
  //   port: 3000,
  // },
})
