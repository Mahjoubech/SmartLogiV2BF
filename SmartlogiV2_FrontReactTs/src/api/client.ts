import axios from 'axios';

const client = axios.create({
  baseURL: 'http://localhost:8080/api/v2', // Adjust as needed
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add interceptors for JWT
client.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
        // Handle unauthorized access (e.g., logout)
        // window.location.href = '/login'; 
    }
    return Promise.reject(error);
  }
);

export default client;
