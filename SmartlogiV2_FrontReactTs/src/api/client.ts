import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';

export const BASE_URL = 'http://localhost:8080/api/v2';

const client = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

client.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

client.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response && error.response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user_data');
        
        if (!window.location.pathname.includes('/login')) {
             window.location.href = '/login';
        }
    }
    return Promise.reject(error);
  }
);

export default client;
