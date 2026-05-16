import axiosInstance from './axiosInstance';

/**
 * Lấy dữ liệu biểu đồ theo số giờ gần nhất
 * @param {number} hours - Số giờ gần nhất (1, 6, 12, 24, 48)
 */
export const getChartData = (hours = 1) => {
  return axiosInstance.get('/history/chart', { 
    params: { hours } 
  });
};

/**
 * Lấy dữ liệu biểu đồ theo khoảng thời gian
 * @param {string} from - Thời gian bắt đầu (ISO format)
 * @param {string} to - Thời gian kết thúc (ISO format)
 */
export const getChartDataRange = (from, to) => {
  return axiosInstance.get('/history/chart/range', { 
    params: { from, to } 
  });
};

/**
 * Lấy N bản ghi gần nhất
 * @param {number} limit - Số bản ghi giới hạn
 */
export const getLatestRecords = (limit = 10) => {
  return axiosInstance.get('/history/latest', { 
    params: { limit } 
  });
};
