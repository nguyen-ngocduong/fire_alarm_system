import {
  AreaChart,
  Area,
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
      <div className="flex items-center justify-center h-96 bg-slate-950/40 border border-white/5 rounded-lg">
        <p className="text-text-muted">Không có dữ liệu để hiển thị</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={400}>
      <AreaChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <defs>
          <filter id="neonGlow" height="200%" width="200%" x="-50%" y="-50%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <linearGradient id="gradient-temperature" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={getChartColor('temperature')} stopOpacity={0.4} />
            <stop offset="95%" stopColor={getChartColor('temperature')} stopOpacity={0.0} />
          </linearGradient>
          <linearGradient id="gradient-humidity" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={getChartColor('humidity')} stopOpacity={0.4} />
            <stop offset="95%" stopColor={getChartColor('humidity')} stopOpacity={0.0} />
          </linearGradient>
          <linearGradient id="gradient-lpg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={getChartColor('lpg')} stopOpacity={0.4} />
            <stop offset="95%" stopColor={getChartColor('lpg')} stopOpacity={0.0} />
          </linearGradient>
          <linearGradient id="gradient-smoke" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={getChartColor('smoke')} stopOpacity={0.4} />
            <stop offset="95%" stopColor={getChartColor('smoke')} stopOpacity={0.0} />
          </linearGradient>
          <linearGradient id="gradient-rawGas" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={getChartColor('rawGas')} stopOpacity={0.4} />
            <stop offset="95%" stopColor={getChartColor('rawGas')} stopOpacity={0.0} />
          </linearGradient>
          <linearGradient id="gradient-irFlame" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={getChartColor('irFlame')} stopOpacity={0.4} />
            <stop offset="95%" stopColor={getChartColor('irFlame')} stopOpacity={0.0} />
          </linearGradient>
        </defs>

        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
        <XAxis
          dataKey="timestamp"
          tickFormatter={(value) => formatChartTimestamp(value, hoursDiff)}
          stroke="rgba(255, 255, 255, 0.15)"
          tick={{ fill: 'var(--color-text-secondary)', fontSize: '11px' }}
        />
        <YAxis 
          stroke="rgba(255, 255, 255, 0.15)" 
          tick={{ fill: 'var(--color-text-secondary)', fontSize: '11px' }} 
        />
        <Tooltip content={<CustomTooltip hoursDiff={hoursDiff} />} />
        <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }} />

        {activeSeries.temperature && (
          <>
            <Area
              type="monotone"
              dataKey="temperature"
              stroke="none"
              fill="url(#gradient-temperature)"
              name="Nhiệt độ"
              dot={false}
              legendType="line"
            />
            <Area
              type="monotone"
              dataKey="temperature"
              stroke={getChartColor('temperature')}
              fill="none"
              strokeWidth={2.5}
              dot={false}
              filter="url(#neonGlow)"
              legendType="none"
            />
          </>
        )}
        {activeSeries.humidity && (
          <>
            <Area
              type="monotone"
              dataKey="humidity"
              stroke="none"
              fill="url(#gradient-humidity)"
              name="Độ ẩm"
              dot={false}
              legendType="line"
            />
            <Area
              type="monotone"
              dataKey="humidity"
              stroke={getChartColor('humidity')}
              fill="none"
              strokeWidth={2.5}
              dot={false}
              filter="url(#neonGlow)"
              legendType="none"
            />
          </>
        )}
        {activeSeries.lpg && (
          <>
            <Area
              type="monotone"
              dataKey="lpg"
              stroke="none"
              fill="url(#gradient-lpg)"
              name="LPG"
              dot={false}
              legendType="line"
            />
            <Area
              type="monotone"
              dataKey="lpg"
              stroke={getChartColor('lpg')}
              fill="none"
              strokeWidth={2.5}
              dot={false}
              filter="url(#neonGlow)"
              legendType="none"
            />
          </>
        )}
        {activeSeries.smoke && (
          <>
            <Area
              type="monotone"
              dataKey="smoke"
              stroke="none"
              fill="url(#gradient-smoke)"
              name="Khói"
              dot={false}
              legendType="line"
            />
            <Area
              type="monotone"
              dataKey="smoke"
              stroke={getChartColor('smoke')}
              fill="none"
              strokeWidth={2.5}
              dot={false}
              filter="url(#neonGlow)"
              legendType="none"
            />
          </>
        )}
        {activeSeries.rawGas && (
          <>
            <Area
              type="monotone"
              dataKey="rawGas"
              stroke="none"
              fill="url(#gradient-rawGas)"
              name="Raw Gas"
              dot={false}
              legendType="line"
            />
            <Area
              type="monotone"
              dataKey="rawGas"
              stroke={getChartColor('rawGas')}
              fill="none"
              strokeWidth={2.5}
              dot={false}
              filter="url(#neonGlow)"
              legendType="none"
            />
          </>
        )}
        {activeSeries.irFlame && (
          <>
            <Area
              type="monotone"
              dataKey="irFlame"
              stroke="none"
              fill="url(#gradient-irFlame)"
              name="IR Flame"
              dot={false}
              legendType="line"
            />
            <Area
              type="monotone"
              dataKey="irFlame"
              stroke={getChartColor('irFlame')}
              fill="none"
              strokeWidth={2.5}
              dot={false}
              filter="url(#neonGlow)"
              legendType="none"
            />
          </>
        )}
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default SensorChart;
