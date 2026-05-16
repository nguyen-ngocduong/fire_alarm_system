import { getAllSensorTypes, getSensorInfo, getChartColor } from '../../utils/sensorUtils';

const SeriesToggle = ({ activeSeries, onToggle }) => {
  const sensorTypes = getAllSensorTypes();

  return (
    <div className="card mb-4" style={{ background: 'linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%)' }}>
      <h3 className="text-sm font-semibold text-gray-700 mb-3">Hiển thị cảm biến</h3>
      <div className="flex flex-wrap gap-2">
        {sensorTypes.map((type) => {
          const info = getSensorInfo(type);
          const color = getChartColor(type);
          const isActive = activeSeries[type];

          return (
            <button
              key={type}
              onClick={() => onToggle(type)}
              className={`
                flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-sm transition-all
                ${isActive ? 'bg-white border-2 shadow-sm text-gray-900' : 'bg-gray-100 text-gray-600'}
              `}
              style={isActive ? { borderColor: color } : {}}
            >
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: isActive ? color : '#9CA3AF' }}
              />
              <span>{info.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SeriesToggle;
