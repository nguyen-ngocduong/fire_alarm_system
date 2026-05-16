import { useState, useEffect, useCallback, useRef } from 'react';
import { getSensorData } from '../api/sensorApi';
import { POLLING_INTERVAL } from '../utils/constants';

/**
 * Hook để polling dữ liệu cảm biến
 * @param {string} deviceId 
 */
const useSensorData = (deviceId) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const intervalRef = useRef(null);
  const failureCountRef = useRef(0);

  const fetchData = useCallback(async () => {
    try {
      const response = await getSensorData(deviceId);
      console.log('📊 Sensor Data Response:', response.data);
      console.log('🔥 IR Flame value:', response.data.ir_flame);
      console.log('🔥 Flame value:', response.data.flame);
      setData(response.data);
      setError(null);
      setLastUpdated(new Date());
      failureCountRef.current = 0;
    } catch (err) {
      console.error('Error fetching sensor data:', err);
      failureCountRef.current += 1;
      
      // Nếu thất bại 3 lần liên tiếp, hiển thị lỗi
      if (failureCountRef.current >= 3) {
        setError(err);
      }
    } finally {
      setIsLoading(false);
    }
  }, [deviceId]);

  useEffect(() => {
    if (!deviceId) return;

    // Fetch ngay lần đầu
    fetchData();

    // Setup polling
    intervalRef.current = setInterval(fetchData, POLLING_INTERVAL);

    // Cleanup
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [deviceId, fetchData]);

  const refetch = useCallback(() => {
    setIsLoading(true);
    fetchData();
  }, [fetchData]);

  return {
    data,
    isLoading,
    error,
    lastUpdated,
    refetch,
  };
};

export default useSensorData;
