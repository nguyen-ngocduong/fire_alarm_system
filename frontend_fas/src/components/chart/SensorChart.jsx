import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { formatChartTimestamp } from '../../utils/dateUtils';
import { getChartColor, getSensorUnit, translateStatus } from '../../utils/sensorUtils';

const CustomTooltip = ({ active, payload, label, hoursDiff }) => {
  if (!active || !payload?.length) return null;

  const point = payload[0]?.payload;

  return (
    <div className="chart-tooltip">
      <p className="tooltip-time">{formatChartTimestamp(label, hoursDiff)}</p>
      {payload.map((p) => (
        <p key={p.dataKey} style={{ color: p.color }}>
          {p.name}: {p.value} {getSensorUnit(p.dataKey)}
        </p>
      ))}
      {point?.status && (
        <p className={`tooltip-status status-${point.status}`}>
          {translateStatus(point.status)}
        </p>
      )}
    </div>
  );
};

const SensorChart = ({ data, activeSeries, hoursDiff }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg">
        <p className="text-text-muted">Không có dữ liệu để hiển thị</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
        <XAxis
          dataKey="timestamp"
          tickFormatter={(value) => formatChartTimestamp(value, hoursDiff)}
          stroke="#6B7280"
          style={{ fontSize: '12px' }}
        />
        <YAxis stroke="#6B7280" style={{ fontSize: '12px' }} />
        <Tooltip content={<CustomTooltip hoursDiff={hoursDiff} />} />
        <Legend />

        {activeSeries.temperature && (
          <Line
            type="monotone"
            dataKey="temperature"
            stroke={getChartColor('temperature')}
            name="Nhiệt độ"
            dot={false}
            strokeWidth={2}
          />
        )}
        {activeSeries.humidity && (
          <Line
            type="monotone"
            dataKey="humidity"
            stroke={getChartColor('humidity')}
            name="Độ ẩm"
            dot={false}
            strokeWidth={2}
          />
        )}
        {activeSeries.lpg && (
          <Line
            type="monotone"
            dataKey="lpg"
            stroke={getChartColor('lpg')}
            name="LPG"
            dot={false}
            strokeWidth={2}
          />
        )}
        {activeSeries.smoke && (
          <Line
            type="monotone"
            dataKey="smoke"
            stroke={getChartColor('smoke')}
            name="Khói"
            dot={false}
            strokeWidth={2}
          />
        )}
        {activeSeries.rawGas && (
          <Line
            type="monotone"
            dataKey="rawGas"
            stroke={getChartColor('rawGas')}
            name="Raw Gas"
            dot={false}
            strokeWidth={2}
          />
        )}
        {activeSeries.irFlame && (
          <Line
            type="monotone"
            dataKey="irFlame"
            stroke={getChartColor('irFlame')}
            name="IR Flame"
            dot={false}
            strokeWidth={2}
          />
        )}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default SensorChart;
