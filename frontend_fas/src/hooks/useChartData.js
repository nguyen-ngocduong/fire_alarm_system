import { useState, useCallback } from 'react';
import { getChartData, getChartDataRange, getLatestRecords } from '../api/historyApi';

/**
 * Hook để fetch dữ liệu biểu đồ
 */
const useChartData = () => {
  const [data, setData] = useState(null);
  const [latestRecords, setLatestRecords] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetch dữ liệu theo số giờ gần nhất
   * @param {number} hours - Số giờ (1, 6, 12, 24, 48)
   */
  const fetchChartDataByHours = useCallback(async (hours) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getChartData(hours);
      const chartData = {
        totalPoints: response.data.totalPoints,
        alertCount: response.data.alertCount,
        timeLabel: response.data.rangeLabel,
        chartPoints: response.data.data.map(point => ({
          time: point.time,
          timestamp: point.time, // Backend trả về HH:mm:ss
          temperature: point.temperature,
          humidity: point.humidity,
          lpg: point.lpg,
          smoke: point.smoke,
          rawGas: point.raw_gas,
          irFlame: point.ir_flame,
          alert: point.alert,
          flame: point.flame,
          status: point.status,
        })),
      };
      setData(chartData);
      return chartData;
    } catch (err) {
      console.error('Error fetching chart data:', err);
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Fetch dữ liệu theo khoảng thời gian
   * @param {string} from - ISO datetime string
   * @param {string} to - ISO datetime string
   */
  const fetchChartDataByRange = useCallback(async (from, to) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getChartDataRange(from, to);
      const chartData = {
        totalPoints: response.data.totalPoints,
        alertCount: response.data.alertCount,
        timeLabel: response.data.rangeLabel,
        chartPoints: response.data.data.map(point => ({
          time: point.time,
          timestamp: point.time,
          temperature: point.temperature,
          humidity: point.humidity,
          lpg: point.lpg,
          smoke: point.smoke,
          rawGas: point.raw_gas,
          irFlame: point.ir_flame,
          alert: point.alert,
          flame: point.flame,
          status: point.status,
        })),
      };
      setData(chartData);
      return chartData;
    } catch (err) {
      console.error('Error fetching chart data range:', err);
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Fetch N bản ghi gần nhất
   * @param {number} limit - Số bản ghi
   */
  const fetchLatestRecords = useCallback(async (limit) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getLatestRecords(limit);
      setLatestRecords(response.data);
      return response.data;
    } catch (err) {
      console.error('Error fetching latest records:', err);
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearData = useCallback(() => {
    setData(null);
    setLatestRecords(null);
    setError(null);
  }, []);

  return {
    data,
    latestRecords,
    isLoading,
    error,
    fetchChartDataByHours,
    fetchChartDataByRange,
    fetchLatestRecords,
    clearData,
  };
};

export default useChartData;
