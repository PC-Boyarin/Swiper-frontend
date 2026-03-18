import axios from 'axios'

const baseURL = import.meta.env.PROD ? '/api' : 'http://localhost:3001/api'
const instance = axios.create({
	baseURL,
	withCredentials: true,
})

export default instance;
