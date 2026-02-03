import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const client = axios.create({
  baseURL: baseURL,
  timeout: 10000, 
  headers: {
    'Content-Type': 'application/json',
  },
});

client.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export default client;