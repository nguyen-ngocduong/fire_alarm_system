import Tilt from 'react-parallax-tilt';
import Badge from '../common/Badge';
import Icon from '../common/Icon';
import {
  getSensorStatus,
  getSensorColor,
  getSensorPercentage,
  getSensorInfo,
} from '../../utils/sensorUtils';

const SensorCard = ({ sensorType, value }) => {
  const status = getSensorStatus(sensorType, value);
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

  // Map sensor types to subtle glow border colors
  const sensorGlowMap = {
    normal: 'rgba(16, 185, 129, 0.15)',
    warning: 'rgba(245, 158, 11, 0.25)',
    danger: 'rgba(239, 68, 68, 0.35)',
  };

  // Xử lý giá trị Boolean cho flame sensor
  const displayValue = info.isBoolean 
    ? (value ? 'PHÁT HIỆN' : 'KHÔNG') 
    : (value !== null && value !== undefined ? value.toFixed(1) : '--');

  const displayStatus = info.isBoolean
    ? (value ? 'danger' : 'normal')
    : status;

  const glowColor = sensorGlowMap[displayStatus] || sensorGlowMap.normal;

  return (
    <Tilt
      tiltMaxAngleX={10}
      tiltMaxAngleY={10}
      scale={1.02}
      transitionSpeed={1500}
      glareEnable={true}
      glareMaxOpacity={0.12}
      glareColor={getSensorColor(displayStatus)}
      glarePosition="all"
      glareBorderRadius="16px"
      className="h-full"
    >
      <div
        className="card card-hover border-t-4 transition-all duration-300 h-full cursor-pointer"
        style={{ 
          borderTopColor: getSensorColor(displayStatus),
          boxShadow: `0 8px 32px 0 rgba(0, 0, 0, 0.3), 0 0 15px ${glowColor}`,
          background: 'rgba(15, 23, 42, 0.6)'
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div 
              className="p-2 rounded-lg bg-slate-950/40 border border-white/5"
              style={{ boxShadow: `inset 0 0 10px ${glowColor}` }}
            >
              <Icon 
                category="sensor" 
                name={sensorIconMap[sensorType] || 'temperature'} 
                size="lg" 
                alt={info.name}
                animate={displayStatus !== 'normal'}
                className="filter brightness-110"
                style={{ filter: `drop-shadow(0 0 5px ${getSensorColor(displayStatus)})` }}
              />
            </div>
            <h3 className="text-sm font-semibold text-text-secondary">{info.name}</h3>
          </div>
          <Badge variant={statusVariants[displayStatus]}>
            {statusLabels[displayStatus]}
          </Badge>
        </div>

        {/* Value */}
        <div className="mb-4">
          <p className={`sensor-value ${info.isBoolean ? 'text-2xl' : 'text-3xl'} font-bold text-text-primary tracking-wide`}>
            {displayValue}
          </p>
          {!info.isBoolean && <p className="text-xs text-text-muted mt-1">{info.unit}</p>}
        </div>

        {/* Progress bar - chỉ hiển thị cho sensor số */}
        {!info.isBoolean && percentage > 0 && (
          <div className="w-full bg-slate-950/60 rounded-full h-1.5 overflow-hidden border border-white/5">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(percentage, 100)}%`,
                backgroundColor: getSensorColor(displayStatus),
                boxShadow: `0 0 8px ${getSensorColor(displayStatus)}`,
              }}
            />
          </div>
        )}
      </div>
    </Tilt>
  );
};

export default SensorCard;
