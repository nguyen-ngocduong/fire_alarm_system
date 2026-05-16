import { getWarningList } from '../../utils/sensorUtils';

const WarningList = ({ sensorData }) => {
  if (!sensorData) return null;

  const warnings = getWarningList(sensorData);

  if (warnings.length === 0) return null;

  return (
    <div className="card mb-6 border-l-4 border-warning" style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)' }}>
      <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
        <span>⚠️</span>
        Chi tiết cảnh báo
      </h3>
      <ul className="space-y-2">
        {warnings.map((warning, index) => (
          <li
            key={index}
            className={`
              flex items-start gap-2 p-3 rounded-lg
              ${warning.severity === 'danger' ? 'bg-danger-bg' : 'bg-warning-bg'}
            `}
          >
            <span className="text-lg">•</span>
            <p
              className={`
                text-sm font-medium
                ${warning.severity === 'danger' ? 'text-danger' : 'text-warning'}
              `}
            >
              {warning.message}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WarningList;
