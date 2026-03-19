// src/services/api.js
import axios from 'axios'

// Use proxy in dev; real base URL in prod
const baseURL = import.meta.env.DEV
  ? '/api'
  : (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080')

const api = axios.create({ baseURL, headers: { 'Content-Type': 'application/json' } })

api.interceptors.request.use(cfg => {
  const u = localStorage.getItem('esh_user')
  if (u) {
    const { token } = JSON.parse(u)
    if (token) cfg.headers.Authorization = `Bearer ${token}`
  }
  return cfg
})

export default api