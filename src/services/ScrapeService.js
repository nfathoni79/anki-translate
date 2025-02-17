import axios from 'axios'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_BASE_URL,
})

const scrape = (enText, usingLocalBrowser) => {
  return apiClient.get(`/translate?en=${enText}&local=${usingLocalBrowser}`)
}

export default {
  scrape,
}