import axios from 'axios';

const api = axios.create({
   const allowedOrigins = [
  "http://localhost:5173",
  "https://finflow-fwoo.vercel.app",
];

    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true
});

// Request interceptor to add the auth token to headers
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('finflow_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;
