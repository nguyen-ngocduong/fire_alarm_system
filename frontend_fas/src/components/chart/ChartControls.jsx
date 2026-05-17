import { TIME_RANGES } from '../../utils/constants';

const ChartControls = ({ 
  selectedRange, 
  onRangeChange, 
  customFrom, 
  customTo, 
  onCustomChange,
  hideQuickRange = false,
  hideCustomRange = false,
}) => {
  return (
    <div className="card mb-4" style={{ background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)' }}>
      <h3 className="text-sm font-semibold text-text-secondary mb-3">Khoảng thời gian</h3>
      
      {/* Quick range buttons */}
      {!hideQuickRange && (
        <div className="flex flex-wrap gap-2 mb-4">
          {TIME_RANGES.map((range) => (
            <button
              key={range.value}
              onClick={() => onRangeChange(range.value)}
              className={`
                px-4 py-2 rounded-lg font-medium text-sm transition-colors
                ${
                  selectedRange === range.value
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-text-secondary hover:bg-gray-200'
                }
              `}
            >
              {range.label}
            </button>
          ))}
        </div>
      )}

      {/* Custom date range */}
      {!hideCustomRange && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Từ
            </label>
            <input
              type="datetime-local"
              value={customFrom}
              onChange={(e) => onCustomChange('from', e.target.value)}
              className="w-full px-4 py-2.5 bg-white text-gray-900 border border-gray-300 rounded-lg 
                         focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                         transition-all duration-200 cursor-pointer
                         hover:border-primary hover:shadow-sm"
              style={{
                colorScheme: 'light',
              }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Đến
            </label>
            <input
              type="datetime-local"
              value={customTo}
              onChange={(e) => onCustomChange('to', e.target.value)}
              className="w-full px-4 py-2.5 bg-white text-gray-900 border border-gray-300 rounded-lg 
                         focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                         transition-all duration-200 cursor-pointer
                         hover:border-primary hover:shadow-sm"
              style={{
                colorScheme: 'light',
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ChartControls;
