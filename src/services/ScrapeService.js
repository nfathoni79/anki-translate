import axios from 'axios'

const apiClient = axios.create({
  baseURL: 'http://localhost:5000',
})

export default {
  scrape(enText) {
    return apiClient.get(`/translate?en=${enText}`)
  }
}