import Button from '../common/Button';

const LIMIT_PRESETS = [10, 20, 50, 100, 200];

const LatestRecordsControls = ({ limit, onLimitChange, onFetch, isLoading }) => {
  return (
    <div className="card" style={{ background: 'linear-gradient(135deg, #fed7aa 0%, #fdba74 100%)' }}>
      <h3 className="text-sm font-semibold text-text-secondary mb-3">
        Số lượng bản ghi
      </h3>
      
      {/* Quick limit buttons */}
      <div className="flex flex-wrap gap-2 mb-4">
        {LIMIT_PRESETS.map((preset) => (
          <button
            key={preset}
            onClick={() => onLimitChange(preset)}
            className={`
              px-4 py-2 rounded-lg font-medium text-sm transition-colors
              ${
                limit === preset
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-text-secondary hover:bg-gray-200'
              }
            `}
          >
            {preset} bản ghi
          </button>
        ))}
      </div>

      {/* Custom limit input */}
      <div className="flex gap-3 items-end">
        <div className="flex-1">
          <label className="block text-sm font-medium text-text-secondary mb-1">
            Hoặc nhập số lượng tùy chỉnh
          </label>
          <input
            type="number"
            min="1"
            max="1000"
            value={limit}
            onChange={(e) => onLimitChange(parseInt(e.target.value) || 10)}
            className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Nhập số lượng..."
          />
        </div>
        <Button
          variant="primary"
          onClick={onFetch}
          loading={isLoading}
        >
          📋 Tải dữ liệu
        </Button>
      </div>
    </div>
  );
};

export default LatestRecordsControls;
