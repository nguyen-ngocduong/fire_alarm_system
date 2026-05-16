import { format, formatDistanceToNow, differenceInHours } from 'date-fns';
import { vi } from 'date-fns/locale';

/**
 * Format timestamp thành chuỗi hiển thị
 * @param {string|number|Date} timestamp 
 * @param {string} formatStr - Format string (default: 'dd/MM/yyyy HH:mm:ss')
 */
export const formatTimestamp = (timestamp, formatStr = 'dd/MM/yyyy HH:mm:ss') => {
  if (!timestamp) return '';
  
  try {
    const date = new Date(timestamp);
    return format(date, formatStr, { locale: vi });
  } catch (error) {
    console.error('Error formatting timestamp:', error);
    return '';
  }
};

/**
 * Format datetime (alias cho formatTimestamp)
 * @param {string|number|Date} timestamp 
 */
export const formatDateTime = (timestamp) => {
  return formatTimestamp(timestamp, 'dd/MM/yyyy HH:mm:ss');
};

/**
 * Format timestamp cho trục X của biểu đồ
 * @param {string|number|Date} timestamp 
 * @param {number} hoursDiff - Khoảng thời gian của biểu đồ (giờ)
 */
export const formatChartTimestamp = (timestamp, hoursDiff) => {
  if (!timestamp) return '';
  
  try {
    // Nếu timestamp là string dạng "HH:mm:ss", trả về luôn
    if (typeof timestamp === 'string' && timestamp.match(/^\d{2}:\d{2}:\d{2}$/)) {
      // Nếu khoảng thời gian <= 12h, hiển thị HH:mm:ss
      if (hoursDiff <= 12) {
        return timestamp;
      }
      // Nếu > 12h, chỉ hiển thị HH:mm
      return timestamp.substring(0, 5);
    }
    
    // Nếu là Date object hoặc ISO string
    const date = new Date(timestamp);
    // Nếu khoảng thời gian <= 12h, hiển thị HH:mm:ss
    if (hoursDiff <= 12) {
      return format(date, 'HH:mm:ss', { locale: vi });
    }
    // Nếu > 12h, hiển thị dd/MM HH:mm
    return format(date, 'dd/MM HH:mm', { locale: vi });
  } catch (error) {
    console.error('Error formatting chart timestamp:', error);
    return '';
  }
};

/**
 * Format thời gian tương đối (vd: "2 phút trước")
 * @param {string|number|Date} timestamp 
 */
export const formatRelativeTime = (timestamp) => {
  if (!timestamp) return '';
  
  try {
    const date = new Date(timestamp);
    return formatDistanceToNow(date, { addSuffix: true, locale: vi });
  } catch (error) {
    console.error('Error formatting relative time:', error);
    return '';
  }
};

/**
 * Tính khoảng thời gian giữa hai timestamp (giờ)
 * @param {string|number|Date} start 
 * @param {string|number|Date} end 
 */
export const getHoursDifference = (start, end) => {
  try {
    const startDate = new Date(start);
    const endDate = new Date(end);
    return differenceInHours(endDate, startDate);
  } catch (error) {
    console.error('Error calculating hours difference:', error);
    return 0;
  }
};

/**
 * Lấy timestamp từ X giờ trước
 * @param {number} hours 
 */
export const getTimestampHoursAgo = (hours) => {
  const now = new Date();
  const past = new Date(now.getTime() - hours * 60 * 60 * 1000);
  return past.toISOString();
};

/**
 * Lấy timestamp hiện tại
 */
export const getCurrentTimestamp = () => {
  return new Date().toISOString();
};

/**
 * Format cooldown time (mm:ss)
 * @param {number} seconds 
 */
export const formatCooldownTime = (seconds) => {
  if (seconds <= 0) return '00:00';
  
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

/**
 * Parse ISO string thành Date object
 * @param {string} isoString 
 */
export const parseISOString = (isoString) => {
  try {
    return new Date(isoString);
  } catch (error) {
    console.error('Error parsing ISO string:', error);
    return null;
  }
};

/**
 * Kiểm tra xem timestamp có hợp lệ không
 * @param {string|number|Date} timestamp 
 */
export const isValidTimestamp = (timestamp) => {
  try {
    const date = new Date(timestamp);
    return !isNaN(date.getTime());
  } catch (error) {
    return false;
  }
};
