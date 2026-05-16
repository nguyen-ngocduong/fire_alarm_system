import Badge from '../common/Badge';
import Icon from '../common/Icon';
import {
  getSensorStatus,
  getSensorColor,
  getSensorBgColor,
  getSensorPercentage,
  getSensorInfo,
  formatSensorValue,
} from '../../utils/sensorUtils';

const SensorCard = ({ sensorType, value }) => {
  const status = getSensorStatus(sensorType, value);
  const color = getSensorColor(status);
  const bgColor = getSensorBgColor(status);
  const percentage = getSensorPercentage(sensorType, value);
  const info = getSensorInfo(sensorType);

  const statusLabels = {
    normal: 'NORMAL',
    warning: 'WARNING',
    danger: 'DANGER',
  };

  const statusVariants = {
    normal: 'safe',
    warning: 'warning',
    danger: 'danger',
  };

  // Map sensor types to icon names
  const sensorIconMap = {
    temperature: 'temperature',
    humidity: 'humidity',
    lpg: 'gas',
    smoke: 'smoke',
    rawGas: 'gas',
    flame: 'flame',
    irFlame: 'infrared',
  };

  // Map sensor types to background colors
  const sensorBgMap = {
    temperature: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', // Yellow gradient
    humidity: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)', // Blue gradient
    lpg: 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)', // Pink gradient
    smoke: 'linear-gradient(135deg, #e5e7eb 0%, #d1d5db 100%)', // Gray gradient
    rawGas: 'linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%)', // Purple gradient
    flame: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)', // Red gradient
    irFlame: 'linear-gradient(135deg, #fed7aa 0%, #fdba74 100%)', // Orange gradient
  };

  // Xử lý giá trị Boolean cho flame sensor
  const displayValue = info.isBoolean 
    ? (value ? 'PHÁT HIỆN' : 'KHÔNG') 
    : (value !== null && value !== undefined ? value.toFixed(1) : '--');

  const displayStatus = info.isBoolean
    ? (value ? 'danger' : 'normal')
    : status;

  return (
    <div
      className="card card-hover"
      style={{ 
        borderLeft: `4px solid ${getSensorColor(displayStatus)}`,
        background: sensorBgMap[sensorType] || 'white'
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Icon 
            category="sensor" 
            name={sensorIconMap[sensorType] || 'temperature'} 
            size="xl" 
            alt={info.name}
            style={{ filter: `drop-shadow(0 0 4px ${getSensorColor(displayStatus)})` }}
          />
          <h3 className="text-sm font-semibold text-gray-700">{info.name}</h3>
        </div>
        <Badge variant={statusVariants[displayStatus]}>
          {statusLabels[displayStatus]}
        </Badge>
      </div>

      {/* Value */}
      <div className="mb-3">
        <p className={`sensor-value ${info.isBoolean ? 'text-2xl' : 'text-3xl'} font-bold text-gray-900`}>
          {displayValue}
        </p>
        {!info.isBoolean && <p className="text-sm text-gray-600">{info.unit}</p>}
      </div>

      {/* Progress bar - chỉ hiển thị cho sensor số */}
      {!info.isBoolean && percentage > 0 && (
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${Math.min(percentage, 100)}%`,
              backgroundColor: getSensorColor(displayStatus),
            }}
          />
        </div>
      )}
    </div>
  );
};

export default SensorCard;
