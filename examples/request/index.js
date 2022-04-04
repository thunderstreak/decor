import axios from 'axios'

const service = axios.create({
  baseURL: '',
  // withCredentials: true,
  timeout: 20000 // request timeout
})

service.interceptors.request.use((config) => config)
service.interceptors.response.use((response) => response)

export default service
