import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';
import { getAccessToken, getRefreshToken, setTokens, clearTokens } from '../utils/tokenUtils';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - tự động đính kèm token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - tự động refresh token khi hết hạn
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Nếu lỗi 401 và chưa retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = getRefreshToken();
        
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        // Gọi API refresh token
        const { data } = await axios.post(
          `${API_BASE_URL}/auth/refresh-token`,
          { refreshToken }
        );

        // Backend trả về "token" không phải "accessToken"
        const newAccessToken = data.token || data.accessToken;

        // Lưu token mới
        setTokens(newAccessToken, data.refreshToken || refreshToken);

        // Retry request gốc với token mới
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Nếu refresh token thất bại, xóa tokens và redirect về login
        clearTokens();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
