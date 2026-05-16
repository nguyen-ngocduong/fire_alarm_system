import { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DEVICE_ID } from '../../utils/constants';
import useSensorData from '../../hooks/useSensorData';
import AlertContext from '../../context/AlertContext';
import StatusBanner from '../../components/sensor/StatusBanner';
import WarningList from '../../components/sensor/WarningList';
import SensorGrid from '../../components/sensor/SensorGrid';
import Icon from '../../components/common/Icon';
import { formatTimestamp } from '../../utils/dateUtils';
import { getWarningList } from '../../utils/sensorUtils';
import { backgrounds } from '../../assets/backgrounds';

const DashboardPage = () => {
  const { data, isLoading, error, lastUpdated } = useSensorData(DEVICE_ID);
  const { updateAlertStatus, updateWarnings } = useContext(AlertContext);

  // Cập nhật alert context khi có dữ liệu mới
  useEffect(() => {
    if (data) {
      updateAlertStatus(data);
      const warnings = getWarningList(data);
      updateWarnings(warnings);
    }
  }, [data, updateAlertStatus, updateWarnings]);

  if (isLoading && !data) {
    return (
      <div className="space-y-6">
        <div className="skeleton h-16 rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="skeleton h-40 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="card text-center py-12" style={{ background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)' }}>
        <span className="text-6xl mb-4 block">⚠️</span>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Không thể kết nối
        </h2>
        <p className="text-gray-700 mb-4">
          Mất kết nối với server. Đang thử lại...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 relative">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
            <Icon category="navigation" name="dashboard" size="xl" alt="Dashboard" className="filter brightness-0 invert" />
            Dashboard
          </h1>
          <p className="text-gray-400">
            Giám sát thời gian thực - Thiết bị: <strong className="text-gray-200">{DEVICE_ID}</strong>
          </p>
        </div>
      </div>

      {/* Status banner */}
      <StatusBanner sensorData={data} />

      {/* Warning list */}
      <WarningList sensorData={data} />

      {/* Sensor grid */}
      <SensorGrid sensorData={data} />

      {/* Last updated & Quick link */}
      <div className="card flex flex-col md:flex-row items-center justify-between gap-4" style={{ background: 'linear-gradient(135deg, #e0e7ff 0%, #ddd6fe 100%)' }}>
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <Icon category="status" name="sync" size="sm" alt="Update" />
          <span>
            Cập nhật lúc:{' '}
            <strong className="text-gray-900">
              {lastUpdated ? formatTimestamp(lastUpdated, 'HH:mm:ss') : '--:--:--'}
            </strong>
          </span>
        </div>
        <Link
          to="/chart"
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
        >
          <Icon category="navigation" name="chart" size="sm" alt="Chart" className="filter brightness-0 invert" />
          <span>Xem lịch sử biểu đồ</span>
        </Link>
      </div>
    </div>
  );
};

export default DashboardPage;
