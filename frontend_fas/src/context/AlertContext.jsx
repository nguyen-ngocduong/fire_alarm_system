import { createContext, useState, useCallback } from 'react';

const AlertContext = createContext();

export const AlertProvider = ({ children }) => {
  const [hasActiveAlert, setHasActiveAlert] = useState(false);
  const [alertCount, setAlertCount] = useState(0);
  const [latestWarnings, setLatestWarnings] = useState([]);

  const updateAlertStatus = useCallback((sensorData) => {
    if (!sensorData) {
      setHasActiveAlert(false);
      setLatestWarnings([]);
      return;
    }

    const status = sensorData.status?.toUpperCase();
    const isDanger = status !== 'NORMAL';
    
    setHasActiveAlert(isDanger);
    
    if (isDanger) {
      setAlertCount((prev) => prev + 1);
    }
  }, []);

  const updateWarnings = useCallback((warnings) => {
    setLatestWarnings(warnings);
  }, []);

  const clearAlerts = useCallback(() => {
    setHasActiveAlert(false);
    setAlertCount(0);
    setLatestWarnings([]);
  }, []);

  const value = {
    hasActiveAlert,
    alertCount,
    latestWarnings,
    updateAlertStatus,
    updateWarnings,
    clearAlerts,
  };

  return <AlertContext.Provider value={value}>{children}</AlertContext.Provider>;
};

export default AlertContext;
