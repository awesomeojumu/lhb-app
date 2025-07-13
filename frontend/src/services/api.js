import axios from 'axios';

// Create Axios instance with base API path
const api = axios.create({
  baseURL: '/api', // Vite proxy will forward to localhost:5000
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token from localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Optional: Global error handler (e.g., redirect on 401)
// api.interceptors.response.use(
//   res => res,
//   err => {
//     if (err.response?.status === 401) {
//       window.location.href = '/'; // redirect to login
//     }
//     return Promise.reject(err);
//   }
// );

export default api;
