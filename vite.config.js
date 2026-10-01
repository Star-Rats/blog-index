import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// 主站 dev 端口 5173；API 地址用 VITE_API_BASE 覆盖（默认本地后端）
export default defineConfig({
  plugins: [vue()],
  server: {
    port: 5173,
    host: '127.0.0.1',
  },
})
