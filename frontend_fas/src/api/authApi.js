import axiosInstance from './axiosInstance';

/**
 * Đăng ký tài khoản mới
 * @param {object} data - { username, email, password }
 */
export const register = (data) => {
  return axiosInstance.post('/auth/register', data);
};

/**
 * Đăng nhập
 * @param {object} data - { username, password }
 */
export const signIn = (data) => {
  return axiosInstance.post('/auth/signin', data);
};

/**
 * Refresh access token
 * @param {string} refreshToken 
 */
export const refreshToken = (refreshToken) => {
  return axiosInstance.post('/auth/refresh-token', { refreshToken });
};

/**
 * Đăng xuất (nếu backend có endpoint)
 */
export const logout = () => {
  // Backend có thể không có endpoint logout
  // Chỉ cần xóa token ở client
  return Promise.resolve();
};
