const CHART_MODES = [
  {
    id: 'recent-hours',
    label: '📊 Biểu đồ theo giờ gần nhất',
    description: 'Xem biểu đồ dữ liệu theo số giờ gần nhất (1h, 6h, 12h, 24h, 48h)',
    icon: '⏰',
    bgColor: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)', // Xanh dương
    borderColor: '#3b82f6',
  },
  {
    id: 'date-range',
    label: '📅 Biểu đồ theo khoảng thời gian',
    description: 'Chọn khoảng thời gian cụ thể để xem biểu đồ',
    icon: '📆',
    bgColor: 'linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%)', // Tím
    borderColor: '#a855f7',
  },
  {
    id: 'latest-records',
    label: '📋 Bản ghi gần nhất',
    description: 'Xem N bản ghi gần nhất dưới dạng bảng dữ liệu',
    icon: '📝',
    bgColor: 'linear-gradient(135deg, #fed7aa 0%, #fdba74 100%)', // Cam
    borderColor: '#f97316',
  },
];

const ChartModeSelector = ({ selectedMode, onModeChange }) => {
  return (
    <div className="card" style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)' }}>
      <h3 className="text-lg font-semibold text-text-primary mb-4">
        Chọn chế độ xem dữ liệu
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {CHART_MODES.map((mode) => (
          <button
            key={mode.id}
            onClick={() => onModeChange(mode.id)}
            className={`
              p-4 rounded-lg border-2 transition-all text-left
              ${
                selectedMode === mode.id
                  ? 'shadow-lg scale-105'
                  : 'hover:scale-102 hover:shadow-md'
              }
            `}
            style={{
              background: mode.bgColor,
              borderColor: selectedMode === mode.id ? mode.borderColor : 'transparent',
            }}
          >
            <div className="flex items-start gap-3">
              <span className="text-3xl">{mode.icon}</span>
              <div className="flex-1">
                <h4 className="font-semibold text-text-primary mb-1">
                  {mode.label}
                </h4>
                <p className="text-sm text-text-secondary">
                  {mode.description}
                </p>
              </div>
            </div>
            {selectedMode === mode.id && (
              <div className="mt-3 flex items-center gap-2 text-sm font-bold" style={{ color: mode.borderColor }}>
                <span>✓</span>
                <span>Đang chọn</span>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ChartModeSelector;
