import Badge from '../common/Badge';
import { formatDateTime } from '../../utils/dateUtils';

const LatestRecordsTable = ({ records }) => {
  if (!records || records.length === 0) {
    return (
      <div className="text-center py-8 text-text-secondary">
        Không có dữ liệu
      </div>
    );
  }

  const getStatusVariant = (status) => {
    const statusUpper = status?.toUpperCase();
    if (statusUpper === 'NORMAL') return 'safe';
    if (statusUpper === 'FLAME_DETECTED') return 'danger';
    if (statusUpper === 'HIGH_TEMP_FIRE' || statusUpper === 'GAS_LEAK_ALERT') return 'warning';
    return 'normal';
  };

  const getStatusLabel = (status) => {
    const statusUpper = status?.toUpperCase();
    switch (statusUpper) {
      case 'NORMAL': return 'Bình thường';
      case 'FLAME_DETECTED': return 'Phát hiện lửa';
      case 'HIGH_TEMP_FIRE': return 'Nhiệt độ cao';
      case 'GAS_LEAK_ALERT': return 'Rò rỉ khí gas';
      case 'ALERT': return 'Cảnh báo';
      default: return status;
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-3 px-4 font-semibold text-text-secondary">#</th>
            <th className="text-left py-3 px-4 font-semibold text-text-secondary">Thời gian</th>
            <th className="text-right py-3 px-4 font-semibold text-text-secondary">Nhiệt độ (°C)</th>
            <th className="text-right py-3 px-4 font-semibold text-text-secondary">Độ ẩm (%)</th>
            <th className="text-right py-3 px-4 font-semibold text-text-secondary">LPG (ppm)</th>
            <th className="text-right py-3 px-4 font-semibold text-text-secondary">Khói (ppm)</th>
            <th className="text-right py-3 px-4 font-semibold text-text-secondary">Raw Gas</th>
            <th className="text-right py-3 px-4 font-semibold text-text-secondary">IR Flame</th>
            <th className="text-center py-3 px-4 font-semibold text-text-secondary">Lửa</th>
            <th className="text-center py-3 px-4 font-semibold text-text-secondary">Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record, index) => (
            <tr 
              key={record.id || index} 
              className={`
                border-b border-border last:border-0
                ${record.alert ? 'bg-danger/5' : ''}
                hover:bg-background-secondary transition-colors
              `}
            >
              <td className="py-3 px-4 text-text-secondary font-mono">
                {index + 1}
              </td>
              <td className="py-3 px-4 text-text-primary font-mono whitespace-nowrap">
                {formatDateTime(record.timestamp)}
              </td>
              <td className="py-3 px-4 text-right font-mono text-text-primary">
                {record.temperature?.toFixed(1) || '-'}
              </td>
              <td className="py-3 px-4 text-right font-mono text-text-primary">
                {record.humidity?.toFixed(1) || '-'}
              </td>
              <td className="py-3 px-4 text-right font-mono text-text-primary">
                {record.lpg || '-'}
              </td>
              <td className="py-3 px-4 text-right font-mono text-text-primary">
                {record.smoke || '-'}
              </td>
              <td className="py-3 px-4 text-right font-mono text-text-primary">
                {record.raw_gas || record.rawGas || '-'}
              </td>
              <td className="py-3 px-4 text-right font-mono text-text-primary">
                {record.ir_flame || record.irFlame || '-'}
              </td>
              <td className="py-3 px-4 text-center">
                {record.flame ? (
                  <span className="text-danger text-lg">🔥</span>
                ) : (
                  <span className="text-safe text-lg">✓</span>
                )}
              </td>
              <td className="py-3 px-4 text-center">
                <Badge variant={getStatusVariant(record.status)}>
                  {getStatusLabel(record.status)}
                </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LatestRecordsTable;
