// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081/api/v1';
export const DEVICE_ID = import.meta.env.VITE_DEVICE_ID || 'esp32_fire';
export const POLLING_INTERVAL = parseInt(import.meta.env.VITE_POLLING_INTERVAL) || 5000;
export const CONNECTION_CHECK_INTERVAL = parseInt(import.meta.env.VITE_CONNECTION_CHECK_INTERVAL) || 30000;

// Sensor thresholds
export const SENSOR_THRESHOLDS = {
  temperature: {
    warning: 40,
    danger: 45,
    unit: '°C',
    icon: '🌡️',
    name: 'Nhiệt độ',
  },
  humidity: {
    warning: null,
    danger: null,
    unit: '%',
    icon: '💧',
    name: 'Độ ẩm',
  },
  lpg: {
    warning: 800,
    danger: 1000,
    unit: 'ppm',
    icon: '⚡',
    name: 'LPG',
  },
  smoke: {
    warning: 100,
    danger: 200,
    unit: 'ppm',
    icon: '💨',
    name: 'Khói',
  },
  rawGas: {
    warning: 1200,
    danger: 1500,
    unit: 'ppm',
    icon: '🌫️',
    name: 'Raw Gas',
  },
  flame: {
    warning: null,
    danger: null,
    unit: '',
    icon: '🔥',
    name: 'Flame Sensor',
    isBoolean: true,
  },
  irFlame: {
    warning: 2500,
    danger: 3500,
    unit: '',
    icon: '👁️',
    name: 'IR Flame',
  },
};

// Status mapping
export const STATUS_MAP = {
  NORMAL: {
    label: 'Bình thường',
    variant: 'safe',
    color: 'var(--color-safe)',
  },
  HIGH_TEMP_FIRE: {
    label: 'Nhiệt độ cao',
    variant: 'warning',
    color: 'var(--color-warning)',
  },
  GAS_LEAK_ALERT: {
    label: 'Rò rỉ khí gas',
    variant: 'warning',
    color: 'var(--color-warning)',
  },
  FLAME_DETECTED: {
    label: 'Phát hiện lửa',
    variant: 'danger',
    color: 'var(--color-danger)',
  },
  ALERT: {
    label: 'Cảnh báo',
    variant: 'danger',
    color: 'var(--color-danger)',
  },
};

// User roles
export const USER_ROLES = {
  USER: 'USER',
  ADMIN: 'ADMIN',
};

// Time range presets for chart
export const TIME_RANGES = [
  { label: '1 giờ', value: '1h', hours: 1 },
  { label: '6 giờ', value: '6h', hours: 6 },
  { label: '12 giờ', value: '12h', hours: 12 },
  { label: '24 giờ', value: '24h', hours: 24 },
  { label: '48 giờ', value: '48h', hours: 48 },
];

// Chart colors
export const CHART_COLORS = {
  temperature: '#EF4444',
  humidity: '#3B82F6',
  lpg: '#F97316',
  smoke: '#6B7280',
  rawGas: '#8B5CF6',
  flame: '#DC2626',
  irFlame: '#FBBF24',
};

// Toast types
export const TOAST_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
};

// Local storage keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'fas_access_token',
  REFRESH_TOKEN: 'fas_refresh_token',
  USER_INFO: 'fas_user_info',
};

// Navigation items
export const NAV_ITEMS = {
  USER: [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/chart', label: 'Biểu đồ', icon: '📈' },
    { path: '/alerts', label: 'Cảnh báo', icon: '🔔' },
    { path: '/profile', label: 'Hồ sơ', icon: '👤' },
  ],
  ADMIN: [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/chart', label: 'Biểu đồ', icon: '📈' },
    { path: '/alerts', label: 'Cảnh báo', icon: '🔔' },
    { path: '/users', label: 'Người dùng', icon: '👥' },
    { path: '/profile', label: 'Hồ sơ', icon: '👤' },
  ],
};

// Error messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.',
  UNAUTHORIZED: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.',
  FORBIDDEN: 'Bạn không có quyền thực hiện thao tác này.',
  NOT_FOUND: 'Không tìm thấy dữ liệu.',
  SERVER_ERROR: 'Có lỗi xảy ra trên server. Vui lòng thử lại sau.',
  VALIDATION_ERROR: 'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.',
};
