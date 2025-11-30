import axios from 'axios'

const API_BASE = (import.meta.env.VITE_API_URL as string) || 'http://localhost:4000/api'

const client = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Attach token from localStorage to each request if present
client.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem('token')
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
  } catch (e) {
    // ignore
  }
  return config
})

export default client

