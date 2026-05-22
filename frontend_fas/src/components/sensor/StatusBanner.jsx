import { getSystemStatus } from '../../utils/sensorUtils';
import StatusVisual from './StatusVisual';

const StatusBanner = ({ sensorData }) => {
  if (!sensorData) return null;

  const statusType = getSystemStatus(sensorData);

  const getStatusContent = () => {
    switch (statusType) {
      case 'danger':
        return {
          title: '🚨 HỆ THỐNG ĐÃ PHÁT HIỆN NGỌN LỬA',
          desc: 'Phát hiện khói, khí gas rò rỉ hoặc nhiệt độ cao ở mức báo động! Hệ thống đang kích hoạt cảnh báo khẩn cấp.',
          cardClass: 'border-danger/30 bg-red-950/20 shadow-[0_0_25px_rgba(239,68,68,0.15)] ring-1 ring-danger/25',
          titleClass: 'text-danger animate-pulse',
        };
      case 'warning':
        return {
          title: '⚠️ HỆ THỐNG CẢNH BÁO',
          desc: 'Có thông số cảm biến đã vượt ngưỡng an toàn. Vui lòng kiểm tra chi tiết danh sách cảnh báo bên dưới.',
          cardClass: 'border-warning/30 bg-amber-950/10 shadow-[0_0_25px_rgba(245,158,11,0.1)] ring-1 ring-warning/25',
          titleClass: 'text-warning',
        };
      case 'safe':
      default:
        return {
          title: '🛡️ HỆ THỐNG AN TOÀN',
          desc: 'Tất cả các thông số cảm biến đang ở mức bình thường. Thiết bị giám sát hoạt động ổn định.',
          cardClass: 'border-safe/25 bg-slate-900/60 shadow-[0_0_20px_rgba(16,185,129,0.05)]',
          titleClass: 'text-safe',
        };
    }
  };

  const content = getStatusContent();

  return (
    <div className={`card flex flex-col md:flex-row items-center gap-6 p-6 mb-6 ${content.cardClass}`}>
      <div className="flex-shrink-0">
        <StatusVisual status={statusType} />
      </div>
      <div className="flex-1 text-center md:text-left">
        <h2 className={`text-2xl font-bold mb-2 tracking-wide ${content.titleClass}`}>
          {content.title}
        </h2>
        <p className="text-text-secondary leading-relaxed max-w-2xl">
          {content.desc}
        </p>
      </div>
    </div>
  );
};

export default StatusBanner;
