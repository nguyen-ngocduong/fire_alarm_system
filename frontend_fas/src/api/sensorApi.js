import axiosInstance from './axiosInstance';

/**
 * Lấy dữ liệu cảm biến realtime
 * @param {string} deviceId 
 */
export const getSensorData = (deviceId) => {
  return axiosInstance.get(`/sensors/${deviceId}`);
};

/**
 * Kiểm tra kết nối Firebase
 */
export const testConnection = () => {
  return axiosInstance.get('/sensors/test-connection');
};
