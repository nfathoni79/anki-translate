import axios from 'axios'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_BASE_URL,
})

export default {
  scrape(enText) {
    return apiClient.get(`/translate?en=${enText}`)
  }
}