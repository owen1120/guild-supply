import axios from 'axios';

const client = axios.create({
  baseURL: 'http://localhost:3001',
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