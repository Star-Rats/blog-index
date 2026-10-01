import axios from 'axios'

// 后端地址：可用 VITE_API_BASE 覆盖，默认本地 FastAPI
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || 'http://127.0.0.1:8000',
  timeout: 15000,
})

export default api
