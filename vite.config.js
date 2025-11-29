import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  build: {
    outDir: 'dist',
    emptyOutDir: false, // не удаляет manifest.json
    rollupOptions: {
      input: {
        popup: resolve(__dirname, 'index.html'), // твой popup
        background: resolve(__dirname, 'public/background/background.js'),
        content: resolve(__dirname, 'public/content/content.js')
      },
      output: {
        entryFileNames: `[name].js`,
        chunkFileNames: `chunks/[name].js`,
        assetFileNames: `assets/[name].[ext]`
      }
    }
  }
})