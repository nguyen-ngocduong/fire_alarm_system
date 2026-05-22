import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { DEVICE_ID } from '../../utils/constants';
import useSensorData from '../../hooks/useSensorData';
import AlertContext from '../../context/AlertContext';
import StatusBanner from '../../components/sensor/StatusBanner';
import WarningList from '../../components/sensor/WarningList';
import SensorGrid from '../../components/sensor/SensorGrid';
import Icon from '../../components/common/Icon';
import ParticleBackground from '../../components/common/ParticleBackground';
import { formatTimestamp } from '../../utils/dateUtils';
import { getWarningList, getSystemStatus } from '../../utils/sensorUtils';

const DashboardPage = () => {
  const { data: realData, isLoading, error, lastUpdated } = useSensorData(DEVICE_ID);
  const { updateAlertStatus, updateWarnings } = useContext(AlertContext);
  const [simulationMode, setSimulationMode] = useState(null); // null, 'safe', 'warning', 'danger'

  const mockSafe = {
    temperature: 28.5,
    humidity: 62.0,
    lpg: 220.0,
    smoke: 45.0,
    rawGas: 450.0,
    flame: false,
    irFlame: 1024,
    status: 'NORMAL'
  };

  const mockWarning = {
    temperature: 38.0,
    humidity: 58.0,
    lpg: 880.0,
    smoke: 140.0,
    rawGas: 1350.0,
    flame: false,
    irFlame: 2800,
    status: 'GAS_LEAK_ALERT'
  };

  const mockDanger = {
    temperature: 48.5,
    humidity: 40.0,
    lpg: 1200.0,
    smoke: 280.0,
    rawGas: 1800.0,
    flame: true,
    irFlame: 4200,
    status: 'FLAME_DETECTED'
  };

  const data = simulationMode === 'safe'
    ? mockSafe
    : simulationMode === 'warning'
    ? mockWarning
    : simulationMode === 'danger'
    ? mockDanger
    : realData;

  // Cập nhật alert context khi có dữ liệu mới
  useEffect(() => {
    if (data) {
      updateAlertStatus(data);
      const warnings = getWarningList(data);
      updateWarnings(warnings);
    }
  }, [data, updateAlertStatus, updateWarnings]);

  // Xác định trạng thái của ParticleBackground
  const activePreset = getSystemStatus(data);

  return (
    <div className="space-y-6 relative min-h-[calc(100vh-8rem)]">
      {/* Particle background */}
      <ParticleBackground preset={activePreset} />

      {/* Page content wrapper with relative z-10 to stay on top of the particles */}
      <div className="relative z-10 space-y-6">
        {/* Page header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
              <Icon category="navigation" name="dashboard" size="xl" alt="Dashboard" className="filter brightness-0 invert" />
              Dashboard
            </h1>
            <p className="text-gray-400">
              Giám sát thời gian thực - Thiết bị: <strong className="text-gray-200">{DEVICE_ID}</strong>
              {simulationMode && <span className="ml-2 text-warning font-semibold">(Đang mô phỏng: {simulationMode.toUpperCase()})</span>}
            </p>
          </div>
        </div>

        {isLoading && !data ? (
          <div className="space-y-6">
            <div className="skeleton h-16 rounded-lg" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="skeleton h-40 rounded-lg" />
              ))}
            </div>
          </div>
        ) : error && !data ? (
          <div className="card text-center py-12 border-danger/30 bg-red-950/20 shadow-[0_0_25px_rgba(239,68,68,0.15)] ring-1 ring-danger/25">
            <span className="text-6xl mb-4 block">⚠️</span>
            <h2 className="text-xl font-semibold text-white mb-2">
              Không thể kết nối
            </h2>
            <p className="text-text-secondary mb-4">
              Mất kết nối với server. Đang thử lại...
            </p>
          </div>
        ) : (
          <>
            {/* Status banner */}
            <StatusBanner sensorData={data} />

            {/* Warning list */}
            <WarningList sensorData={data} />

            {/* Sensor grid */}
            <SensorGrid sensorData={data} />

            {/* Last updated & Quick link */}
            <div className="card flex flex-col md:flex-row items-center justify-between gap-4 border-white/5 bg-slate-900/60">
              <div className="flex items-center gap-2 text-sm text-text-secondary">
                <Icon category="status" name="sync" size="sm" alt="Update" className="filter brightness-0 invert opacity-75 animate-pulse" />
                <span>
                  Cập nhật lúc:{' '}
                  <strong className="text-white">
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
          </>
        )}
      </div>

      {/* Simulation controller floating panel */}
      <div className="fixed bottom-6 right-6 z-50 bg-slate-950/80 backdrop-blur-md border border-white/10 rounded-xl p-4 shadow-2xl max-w-xs transition-all duration-300 hover:border-primary/40">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-xs font-bold tracking-wider text-primary uppercase font-tech">
            ⚡ Trình mô phỏng (Sim)
          </h4>
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
        </div>
        <p className="text-[10px] text-text-muted mb-3">
          Nhấp để chuyển nhanh trạng thái kiểm tra hoạt ảnh và tiêu đề.
        </p>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setSimulationMode('safe')}
            className={`px-2 py-1.5 rounded text-[10px] font-bold border transition-all ${
              simulationMode === 'safe'
                ? 'bg-safe/20 border-safe text-safe shadow-[0_0_10px_rgba(16,185,129,0.2)]'
                : 'bg-slate-900 border-white/5 text-text-secondary hover:border-safe/40'
            }`}
          >
            🛡️ Safe (Bình thường)
          </button>
          <button
            onClick={() => setSimulationMode('warning')}
            className={`px-2 py-1.5 rounded text-[10px] font-bold border transition-all ${
              simulationMode === 'warning'
                ? 'bg-warning/20 border-warning text-warning shadow-[0_0_10px_rgba(245,158,11,0.2)]'
                : 'bg-slate-900 border-white/5 text-text-secondary hover:border-warning/40'
            }`}
          >
            ⚠️ Warning (Cảnh báo)
          </button>
          <button
            onClick={() => setSimulationMode('danger')}
            className={`px-2 py-1.5 rounded text-[10px] font-bold border transition-all ${
              simulationMode === 'danger'
                ? 'bg-danger/20 border-danger text-danger shadow-[0_0_10px_rgba(239,68,68,0.2)]'
                : 'bg-slate-900 border-white/5 text-text-secondary hover:border-danger/40'
            }`}
          >
            🔥 Danger (Có lửa)
          </button>
          <button
            onClick={() => setSimulationMode(null)}
            className={`px-2 py-1.5 rounded text-[10px] font-bold border transition-all ${
              simulationMode === null
                ? 'bg-primary/20 border-primary text-primary shadow-[0_0_10px_rgba(59,130,246,0.2)]'
                : 'bg-slate-900 border-white/5 text-text-secondary hover:border-primary/40'
            }`}
          >
            🔌 Real (Dữ liệu thật)
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
