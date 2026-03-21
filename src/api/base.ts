import axios from 'axios'

// const baseURL = import.meta.env.PROD ? '/api' : 'http://localhost:3001/api'
const baseURL = import.meta.env.PROD ? 'http://217.177.74.174:3001' : 'http://localhost:3001/api'
const instance = axios.create({
	baseURL,
	withCredentials: true,
})

export default instance;
