const ChartSummary = ({ totalPoints, alertCount, timeLabel }) => {
  return (
    <div className="card mb-4 border-primary" style={{ background: 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)' }}>
      <div className="flex flex-wrap items-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <span className="text-xl">📊</span>
          <span className="text-text-secondary">
            <strong className="text-primary">{totalPoints || 0}</strong> điểm dữ liệu
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xl">🚨</span>
          <span className="text-text-secondary">
            <strong className="text-danger">{alertCount || 0}</strong> lần cảnh báo
          </span>
        </div>
        {timeLabel && (
          <div className="flex items-center gap-2">
            <span className="text-xl">🕐</span>
            <span className="text-text-secondary">{timeLabel}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChartSummary;
