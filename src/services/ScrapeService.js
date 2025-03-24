import axios from 'axios'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_BASE_URL,
})

const scrape = (enText, usingLocalBrowser) => {
  return apiClient.get(`/translate?en=${enText}&local=${usingLocalBrowser}`)
}

const scrapeQuran = quranUrl => {
  console.log(encodeURI(quranUrl))
  return apiClient.get(`/quran?url=${encodeURIComponent(quranUrl)}`)
}

export default {
  scrape,
  scrapeQuran,
}