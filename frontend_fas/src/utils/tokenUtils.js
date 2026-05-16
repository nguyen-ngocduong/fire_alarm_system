import { STORAGE_KEYS } from './constants';

/**
 * Lưu access token và refresh token vào localStorage
 */
export const setTokens = (accessToken, refreshToken) => {
  if (accessToken) {
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
  }
  if (refreshToken) {
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
  }
};

/**
 * Lấy access token từ localStorage
 */
export const getAccessToken = () => {
  return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
};

/**
 * Lấy refresh token từ localStorage
 */
export const getRefreshToken = () => {
  return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
};

/**
 * Xóa tất cả tokens khỏi localStorage
 */
export const clearTokens = () => {
  localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.USER_INFO);
};

/**
 * Kiểm tra xem có token hay không
 */
export const hasToken = () => {
  return !!getAccessToken();
};

/**
 * Lưu thông tin user vào localStorage
 */
export const setUserInfo = (userInfo) => {
  if (userInfo) {
    localStorage.setItem(STORAGE_KEYS.USER_INFO, JSON.stringify(userInfo));
  }
};

/**
 * Lấy thông tin user từ localStorage
 */
export const getUserInfo = () => {
  const userInfo = localStorage.getItem(STORAGE_KEYS.USER_INFO);
  return userInfo ? JSON.parse(userInfo) : null;
};

/**
 * Decode JWT token để lấy payload
 */
export const decodeToken = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

/**
 * Kiểm tra xem token có hết hạn chưa
 */
export const isTokenExpired = (token) => {
  if (!token) return true;
  
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return true;
  
  const currentTime = Date.now() / 1000;
  return decoded.exp < currentTime;
};

/**
 * Lấy user ID từ access token
 */
export const getUserIdFromToken = (token) => {
  const decoded = decodeToken(token);
  return decoded?.sub || decoded?.userId || null;
};
