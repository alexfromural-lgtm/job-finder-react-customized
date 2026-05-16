import axios from 'axios';

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api',
  withCredentials: true, // sends both accessToken + refreshToken cookies automatically
  timeout: 10_000, // 10 seconds — prevents requests hanging indefinitely
  headers: {
    'Content-Type': 'application/json',
  },
});

// ─── Response interceptor: silent refresh + single-shot retry on 401 ─────────
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as typeof error.config & { _retry?: boolean };

    // Only attempt refresh once per request; skip if the failing call IS /auth/refresh
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/auth/refresh')
    ) {
      originalRequest._retry = true;

      try {
        // Backend sets a new accessToken cookie — no token value handled in JS
        await axiosClient.post('/auth/refresh');

        // Replay the original request — browser sends the new cookie automatically
        return axiosClient(originalRequest);
      } catch {
        // Refresh failed — signal logout
        window.dispatchEvent(new CustomEvent('auth:unauthorized'));
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
