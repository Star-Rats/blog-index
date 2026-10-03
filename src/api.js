import axios from 'axios'

// 后端地址：可用 VITE_API_BASE 覆盖，默认本地 FastAPI
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE ?? '', // 生产为空串走同域（nginx 网关反代 /api）；dev 由 .env.development 提供
  timeout: 15000,
})

// 统一 ApiResponse 解包：调用方仍从 res.data 取业务数据
api.interceptors.response.use(
  (res) => {
    const body = res.data
    if (body && typeof body === 'object' && 'code' in body) {
      if (body.code === 20000) {
        res.data = body.data
        return res
      }
      return Promise.reject(new Error(body.message || '请求失败'))
    }
    return res
  },
  (err) => Promise.reject(err),
)

export default api
