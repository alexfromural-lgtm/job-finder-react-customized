import axios from 'axios';

const axiosClient = axios.create({
  baseURL: '/api',
  withCredentials: true, // sends refresh token cookie automatically
  headers: {
    'Content-Type': 'application/json',
  },
});

// ─── Request interceptor: attach access token ─────────────────────────────────
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response interceptor: clear token on 401 ────────────────────────────────
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken');
      // Let the AuthContext handle the redirect
      window.dispatchEvent(new CustomEvent('auth:unauthorized'));
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
