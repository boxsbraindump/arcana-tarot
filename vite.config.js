import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// 部署到 GitHub Pages 时站点在 /arcana-tarot/ 子路径下；本地开发仍用根路径
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/arcana-tarot/' : '/',
  plugins: [react()],
}))
