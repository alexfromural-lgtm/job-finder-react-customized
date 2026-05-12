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
        // Call refresh directly (no interceptor loop — guarded by _retry above)
        const res = await axiosClient.post<{ accessToken: string }>('/auth/refresh');
        const newToken = res.data.accessToken;

        // Persist and broadcast so AuthContext can sync its state
        localStorage.setItem('accessToken', newToken);
        window.dispatchEvent(new CustomEvent('auth:tokenRefreshed', { detail: newToken }));

        // Replay the original request with the fresh token
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axiosClient(originalRequest);
      } catch {
        // Refresh failed — clear everything and signal logout
        localStorage.removeItem('accessToken');
        window.dispatchEvent(new CustomEvent('auth:unauthorized'));
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
