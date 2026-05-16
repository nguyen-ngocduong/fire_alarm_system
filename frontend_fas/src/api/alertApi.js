import axiosInstance from './axiosInstance';

/**
 * Bắt đầu lắng nghe thiết bị
 * @param {string} deviceId 
 */
export const startListening = (deviceId) => {
  return axiosInstance.post(`/alerts/listen/${deviceId}`);
};

/**
 * Dừng lắng nghe thiết bị
 * @param {string} deviceId 
 */
export const stopListening = (deviceId) => {
  return axiosInstance.delete(`/alerts/listen/${deviceId}`);
};

/**
 * Lấy danh sách thiết bị đang được lắng nghe
 */
export const getActiveDevices = () => {
  return axiosInstance.get('/alerts/active-devices');
};

/**
 * Reset cooldown cho thiết bị
 * @param {string} deviceId 
 */
export const resetCooldown = (deviceId) => {
  return axiosInstance.post(`/alerts/reset-cooldown/${deviceId}`);
};

/**
 * Gửi email test
 * @param {string} email - Email nhận test
 */
export const sendTestEmail = (email) => {
  return axiosInstance.post('/alerts/test-email', null, {
    params: { email }
  });
};

/**
 * Lấy danh sách cảnh báo
 */
export const getAlerts = () => {
  return axiosInstance.get('/alerts/list');
};
