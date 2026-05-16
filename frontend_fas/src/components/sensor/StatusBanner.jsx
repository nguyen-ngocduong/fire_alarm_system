import { hasAnyAlert, isDangerStatus } from '../../utils/sensorUtils';

const StatusBanner = ({ sensorData }) => {
  if (!sensorData) return null;

  const hasAlert = hasAnyAlert(sensorData);
  const isDanger = isDangerStatus(sensorData.status);

  if (!hasAlert) {
    return (
      <div className="bg-safe text-white px-6 py-4 rounded-lg mb-6">
        <div className="flex items-center justify-center gap-3">
          <span className="text-2xl">✓</span>
          <p className="text-lg font-semibold">Hệ thống AN TOÀN</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`
        text-white px-6 py-4 rounded-lg mb-6
        ${isDanger ? 'animate-danger-pulse' : 'bg-warning'}
      `}
    >
      <div className="flex items-center justify-center gap-3">
        <span className="text-2xl animate-bounce">⚠️</span>
        <p className="text-lg font-semibold">
          {isDanger ? 'PHÁT HIỆN NGUY HIỂM!' : 'CẢNH BÁO!'}
        </p>
      </div>
    </div>
  );
};

export default StatusBanner;
