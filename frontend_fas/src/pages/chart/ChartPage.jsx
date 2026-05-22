import { useState, useEffect } from 'react';
import { TIME_RANGES } from '../../utils/constants';
import useChartData from '../../hooks/useChartData';
import ChartModeSelector from '../../components/chart/ChartModeSelector';
import ChartControls from '../../components/chart/ChartControls';
import ChartSummary from '../../components/chart/ChartSummary';
import SeriesToggle from '../../components/chart/SeriesToggle';
import SensorChart from '../../components/chart/SensorChart';
import LatestRecordsControls from '../../components/chart/LatestRecordsControls';
import LatestRecordsTable from '../../components/chart/LatestRecordsTable';
import Spinner from '../../components/common/Spinner';
import EmptyState from '../../components/common/EmptyState';
import Icon from '../../components/common/Icon';

const ChartPage = () => {
  const { 
    data, 
    latestRecords, 
    isLoading, 
    fetchChartDataByHours, 
    fetchChartDataByRange,
    fetchLatestRecords 
  } = useChartData();
  
  // Mode selection
  const [chartMode, setChartMode] = useState('recent-hours');
  
  // Mode 1: Recent hours
  const [selectedRange, setSelectedRange] = useState('24h');
  
  // Mode 2: Date range
  const [customFrom, setCustomFrom] = useState('');
  const [customTo, setCustomTo] = useState('');
  
  // Mode 3: Latest records
  const [recordLimit, setRecordLimit] = useState(10);
  
  // Chart series toggle
  const [activeSeries, setActiveSeries] = useState({
    temperature: true,
    humidity: true,
    lpg: false,
    smoke: true,
    rawGas: false,
    irFlame: false,
  });

  // Fetch data khi thay đổi mode hoặc range (chỉ cho mode recent-hours)
  useEffect(() => {
    if (chartMode === 'recent-hours') {
      const range = TIME_RANGES.find((r) => r.value === selectedRange);
      if (range) {
        fetchChartDataByHours(range.hours);
      }
    }
  }, [chartMode, selectedRange, fetchChartDataByHours]);

  const handleModeChange = (mode) => {
    setChartMode(mode);
  };

  const handleRangeChange = (range) => {
    setSelectedRange(range);
  };

  const handleCustomChange = (field, value) => {
    if (field === 'from') {
      setCustomFrom(value);
    } else {
      setCustomTo(value);
    }

    // Nếu cả hai field đều có giá trị, fetch data
    const from = field === 'from' ? value : customFrom;
    const to = field === 'to' ? value : customTo;

    if (from && to) {
      // Chuyển sang ISO format cho backend (yyyy-MM-dd'T'HH:mm:ss)
      const fromISO = new Date(from).toISOString().slice(0, 19);
      const toISO = new Date(to).toISOString().slice(0, 19);
      fetchChartDataByRange(fromISO, toISO);
    }
  };

  const handleLimitChange = (limit) => {
    setRecordLimit(limit);
  };

  const handleFetchLatestRecords = () => {
    fetchLatestRecords(recordLimit);
  };

  const handleToggleSeries = (sensorType) => {
    setActiveSeries((prev) => ({
      ...prev,
      [sensorType]: !prev[sensorType],
    }));
  };

  // Lấy hoursDiff từ selectedRange hoặc mặc định 24h
  const hoursDiff = selectedRange 
    ? TIME_RANGES.find((r) => r.value === selectedRange)?.hours || 24
    : 24;

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
          <Icon category="navigation" name="chart" size="xl" alt="Chart" className="filter brightness-0 invert" />
          Biểu đồ lịch sử
        </h1>
        <p className="text-gray-400">
          Xem dữ liệu cảm biến theo nhiều cách khác nhau
        </p>
      </div>

      {/* Mode selector */}
      <ChartModeSelector selectedMode={chartMode} onModeChange={handleModeChange} />

      {/* Mode 1: Recent hours chart */}
      {chartMode === 'recent-hours' && (
        <>
          <ChartControls
            selectedRange={selectedRange}
            onRangeChange={handleRangeChange}
            customFrom=""
            customTo=""
            onCustomChange={() => {}}
            hideCustomRange
          />

          {data && (
            <ChartSummary
              totalPoints={data.totalPoints}
              alertCount={data.alertCount}
              timeLabel={data.timeLabel}
            />
          )}

          <SeriesToggle activeSeries={activeSeries} onToggle={handleToggleSeries} />

          <div className="card border-white/5 bg-slate-900/60">
            {isLoading ? (
              <div className="flex items-center justify-center h-96">
                <Spinner size="lg" />
              </div>
            ) : data?.chartPoints?.length > 0 ? (
              <SensorChart
                data={data.chartPoints}
                activeSeries={activeSeries}
                hoursDiff={hoursDiff}
              />
            ) : (
              <EmptyState
                icon="📊"
                title="Không có dữ liệu"
                message="Không có dữ liệu trong khoảng thời gian này. Thử chọn khoảng rộng hơn."
              />
            )}
          </div>
        </>
      )}

      {/* Mode 2: Date range chart */}
      {chartMode === 'date-range' && (
        <>
          <ChartControls
            selectedRange=""
            onRangeChange={() => {}}
            customFrom={customFrom}
            customTo={customTo}
            onCustomChange={handleCustomChange}
            hideQuickRange
          />

          {data && (
            <ChartSummary
              totalPoints={data.totalPoints}
              alertCount={data.alertCount}
              timeLabel={data.timeLabel}
            />
          )}

          <SeriesToggle activeSeries={activeSeries} onToggle={handleToggleSeries} />

          <div className="card border-white/5 bg-slate-900/60">
            {isLoading ? (
              <div className="flex items-center justify-center h-96">
                <Spinner size="lg" />
              </div>
            ) : data?.chartPoints?.length > 0 ? (
              <SensorChart
                data={data.chartPoints}
                activeSeries={activeSeries}
                hoursDiff={hoursDiff}
              />
            ) : (
              <EmptyState
                icon="📊"
                title="Chưa chọn khoảng thời gian"
                message="Vui lòng chọn thời gian bắt đầu và kết thúc để xem biểu đồ."
              />
            )}
          </div>
        </>
      )}

      {/* Mode 3: Latest records table */}
      {chartMode === 'latest-records' && (
        <>
          <LatestRecordsControls
            limit={recordLimit}
            onLimitChange={handleLimitChange}
            onFetch={handleFetchLatestRecords}
            isLoading={isLoading}
          />

          {latestRecords && (
            <div className="card border-white/5 bg-slate-900/60">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-white">
                  📋 {latestRecords.length} bản ghi gần nhất
                </h3>
                <p className="text-sm text-text-secondary">
                  Dữ liệu được sắp xếp từ mới nhất đến cũ nhất
                </p>
              </div>
              <LatestRecordsTable records={latestRecords} />
            </div>
          )}

          {isLoading && (
            <div className="card border-white/5 bg-slate-900/60">
              <div className="flex items-center justify-center h-64">
                <Spinner size="lg" />
              </div>
            </div>
          )}

          {!isLoading && !latestRecords && (
            <div className="card border-white/5 bg-slate-900/60">
              <EmptyState
                icon="📋"
                title="Chưa tải dữ liệu"
                message="Chọn số lượng bản ghi và nhấn 'Tải dữ liệu' để xem."
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ChartPage;
