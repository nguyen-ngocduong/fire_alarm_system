import { SENSOR_THRESHOLDS, STATUS_MAP } from './constants';

/**
 * Tính toán trạng thái của cảm biến dựa trên giá trị và ngưỡng
 * @param {string} sensorType - Loại cảm biến (temperature, humidity, lpg, smoke, rawGas, flame, irFlame)
 * @param {number|boolean} value - Giá trị hiện tại
 * @returns {string} - 'normal', 'warning', hoặc 'danger'
 */
export const getSensorStatus = (sensorType, value) => {
  const threshold = SENSOR_THRESHOLDS[sensorType];
  
  if (!threshold || value === null || value === undefined) {
    return 'normal';
  }

  // Xử lý Boolean sensor (flame)
  if (threshold.isBoolean) {
    return value === true ? 'danger' : 'normal';
  }
  
  if (threshold.danger !== null && value >= threshold.danger) {
    return 'danger';
  }
  
  if (threshold.warning !== null && value >= threshold.warning) {
    return 'warning';
  }
  
  return 'normal';
};

/**
 * Lấy màu sắc cho cảm biến dựa trên trạng thái
 * @param {string} status - 'normal', 'warning', hoặc 'danger'
 * @returns {string} - Mã màu hex
 */
export const getSensorColor = (status) => {
  const colorMap = {
    normal: '#057A55',
    warning: '#C27803',
    danger: '#C81E1E',
  };
  return colorMap[status] || colorMap.normal;
};

/**
 * Lấy màu nền cho cảm biến dựa trên trạng thái
 * @param {string} status 
 */
export const getSensorBgColor = (status) => {
  const bgColorMap = {
    normal: '#DEF7EC',
    warning: '#FDF6B2',
    danger: '#FDE8E8',
  };
  return bgColorMap[status] || bgColorMap.normal;
};

/**
 * Tính phần trăm giá trị so với ngưỡng nguy hiểm
 * @param {string} sensorType 
 * @param {number} value 
 * @returns {number} - Phần trăm (0-100)
 */
export const getSensorPercentage = (sensorType, value) => {
  const threshold = SENSOR_THRESHOLDS[sensorType];
  
  if (!threshold || !threshold.danger || value === null || value === undefined) {
    return 0;
  }
  
  const percentage = (value / threshold.danger) * 100;
  return Math.min(Math.max(percentage, 0), 100);
};

/**
 * Lấy thông tin cảm biến (icon, tên, đơn vị)
 * @param {string} sensorType 
 */
export const getSensorInfo = (sensorType) => {
  return SENSOR_THRESHOLDS[sensorType] || {
    icon: '📊',
    name: sensorType,
    unit: '',
  };
};

/**
 * Lấy đơn vị đo của cảm biến
 * @param {string} sensorType 
 */
export const getSensorUnit = (sensorType) => {
  const info = getSensorInfo(sensorType);
  return info.unit;
};

/**
 * Format giá trị cảm biến để hiển thị
 * @param {number} value 
 * @param {string} sensorType 
 */
export const formatSensorValue = (value, sensorType) => {
  if (value === null || value === undefined) {
    return '--';
  }
  
  // Làm tròn đến 1 chữ số thập phân
  const formatted = typeof value === 'number' ? value.toFixed(1) : value;
  const unit = getSensorUnit(sensorType);
  
  return unit ? `${formatted} ${unit}` : formatted;
};

/**
 * Kiểm tra xem có cảnh báo nào không
 * @param {object} sensorData - Dữ liệu từ API
 */
export const hasAnyAlert = (sensorData) => {
  if (!sensorData) return false;
  
  const status = sensorData.status?.toUpperCase();
  return status !== 'NORMAL';
};

/**
 * Lấy danh sách các cảnh báo cụ thể
 * @param {object} sensorData 
 * @returns {array} - Mảng các cảnh báo
 */
export const getWarningList = (sensorData) => {
  if (!sensorData) return [];
  
  const warnings = [];
  
  Object.keys(SENSOR_THRESHOLDS).forEach((sensorType) => {
    const value = getSensorValue(sensorData, sensorType);
    const status = getSensorStatus(sensorType, value);
    const threshold = SENSOR_THRESHOLDS[sensorType];
    
    if (status === 'danger' && threshold.danger !== null) {
      warnings.push({
        sensorType,
        message: `${threshold.name} vượt ngưỡng nguy hiểm (${value}${threshold.unit} > ${threshold.danger}${threshold.unit})`,
        severity: 'danger',
      });
    } else if (status === 'warning' && threshold.warning !== null) {
      warnings.push({
        sensorType,
        message: `${threshold.name} vượt ngưỡng cảnh báo (${value}${threshold.unit} > ${threshold.warning}${threshold.unit})`,
        severity: 'warning',
      });
    }
  });
  
  return warnings;
};

/**
 * Translate status từ backend sang tiếng Việt
 * @param {string} status 
 */
export const translateStatus = (status) => {
  if (!status) return 'Không xác định';
  
  const upperStatus = status.toUpperCase();
  return STATUS_MAP[upperStatus]?.label || status;
};

/**
 * Lấy variant cho Badge component
 * @param {string} status 
 */
export const getStatusVariant = (status) => {
  if (!status) return 'normal';
  
  const upperStatus = status.toUpperCase();
  return STATUS_MAP[upperStatus]?.variant || 'normal';
};

/**
 * Kiểm tra xem có phải trạng thái nguy hiểm không
 * @param {string} status 
 */
export const isDangerStatus = (status) => {
  if (!status) return false;
  
  const upperStatus = status.toUpperCase();
  return upperStatus === 'FLAME_DETECTED' || upperStatus === 'ALERT';
};

/**
 * Lấy tất cả các loại cảm biến
 */
export const getAllSensorTypes = () => {
  return Object.keys(SENSOR_THRESHOLDS);
};

/**
 * Map tên field từ backend sang frontend
 * Backend sử dụng snake_case (raw_gas, ir_flame)
 * Frontend sử dụng camelCase (rawGas, irFlame)
 */
export const mapBackendFieldName = (sensorType) => {
  const fieldMap = {
    rawGas: 'raw_gas',
    irFlame: 'ir_flame',
  };
  return fieldMap[sensorType] || sensorType;
};

/**
 * Lấy giá trị sensor từ data, xử lý cả snake_case và camelCase
 */
export const getSensorValue = (sensorData, sensorType) => {
  if (!sensorData) return null;
  
  // Thử lấy trực tiếp (camelCase)
  if (sensorData[sensorType] !== undefined) {
    return sensorData[sensorType];
  }
  
  // Thử lấy với snake_case
  const backendFieldName = mapBackendFieldName(sensorType);
  if (sensorData[backendFieldName] !== undefined) {
    return sensorData[backendFieldName];
  }
  
  return null;
};

/**
 * Lấy màu cho biểu đồ
 * @param {string} sensorType 
 */
export const getChartColor = (sensorType) => {
  const colorMap = {
    temperature: '#EF4444',
    humidity: '#3B82F6',
    lpg: '#F97316',
    smoke: '#6B7280',
    rawGas: '#8B5CF6',
    flame: '#DC2626',
    irFlame: '#FBBF24',
  };
  return colorMap[sensorType] || '#6B7280';
};
