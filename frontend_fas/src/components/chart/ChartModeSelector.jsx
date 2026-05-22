const CHART_MODES = [
  {
    id: 'recent-hours',
    label: '📊 Biểu đồ theo giờ gần nhất',
    description: 'Xem biểu đồ dữ liệu theo số giờ gần nhất (1h, 6h, 12h, 24h, 48h)',
    icon: '⏰',
    bgColor: 'rgba(59, 130, 246, 0.04)',
    borderColor: 'rgba(59, 130, 246, 0.8)',
    activeBg: 'rgba(59, 130, 246, 0.15)',
    glowClass: 'shadow-[0_0_20px_rgba(59,130,246,0.2)] border-blue-500/50',
    textColor: 'text-blue-400',
  },
  {
    id: 'date-range',
    label: '📅 Biểu đồ theo khoảng thời gian',
    description: 'Chọn khoảng thời gian cụ thể để xem biểu đồ',
    icon: '📆',
    bgColor: 'rgba(168, 85, 247, 0.04)',
    borderColor: 'rgba(168, 85, 247, 0.8)',
    activeBg: 'rgba(168, 85, 247, 0.15)',
    glowClass: 'shadow-[0_0_20px_rgba(168,85,247,0.2)] border-purple-500/50',
    textColor: 'text-purple-400',
  },
  {
    id: 'latest-records',
    label: '📋 Bản ghi gần nhất',
    description: 'Xem N bản ghi gần nhất dưới dạng bảng dữ liệu',
    icon: '📝',
    bgColor: 'rgba(249, 115, 22, 0.04)',
    borderColor: 'rgba(249, 115, 22, 0.8)',
    activeBg: 'rgba(249, 115, 22, 0.15)',
    glowClass: 'shadow-[0_0_20px_rgba(249,115,22,0.2)] border-orange-500/50',
    textColor: 'text-orange-400',
  },
];

const ChartModeSelector = ({ selectedMode, onModeChange }) => {
  return (
    <div className="card border-white/5 bg-slate-900/60">
      <h3 className="text-lg font-semibold text-text-primary mb-4">
        Chọn chế độ xem dữ liệu
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {CHART_MODES.map((mode) => (
          <button
            key={mode.id}
            onClick={() => onModeChange(mode.id)}
            className={`
              p-4 rounded-lg border transition-all text-left backdrop-blur-sm
              ${
                selectedMode === mode.id
                  ? `scale-105 ${mode.glowClass}`
                  : 'border-white/5 hover:scale-[1.02] hover:border-white/10 hover:bg-white/5'
              }
            `}
            style={{
              background: selectedMode === mode.id ? mode.activeBg : mode.bgColor,
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
              <div className={`mt-3 flex items-center gap-2 text-sm font-bold ${mode.textColor}`}>
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
