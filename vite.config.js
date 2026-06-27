import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path'; // 🔥 TAMBAHKAN INI

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'), // 🔥 TAMBAHKAN INI
    }
  },
  server: {
    port: 3001,
    host: true,
  }
});