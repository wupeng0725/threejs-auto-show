import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: process.env.NODE_ENV === 'production' ? '/threejs-auto-show/' : '/',
  build: {
    outDir: 'docs', // 使用 GitHub Pages默认识别目录
    assetsDir: 'static' // 静态资源子目录
  },
})
