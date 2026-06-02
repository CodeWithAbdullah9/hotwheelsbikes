import axios from 'axios'

// Use environment variable if set (for production/other devices), otherwise use Vite proxy
const baseURL = import.meta.env.VITE_API_URL || '/api'

const api = axios.create({ baseURL })

api.interceptors.request.use(cfg => {
  const token = localStorage.getItem('hw_token')
  if (token) cfg.headers.Authorization = `Bearer ${token}`
  return cfg
})

api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('hw_token')
      localStorage.removeItem('hw_admin')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export default api
