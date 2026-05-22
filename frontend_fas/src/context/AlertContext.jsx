import { createContext, useState, useCallback } from 'react';
import { getSystemStatus } from '../utils/sensorUtils';

const AlertContext = createContext();

export const AlertProvider = ({ children }) => {
  const [hasActiveAlert, setHasActiveAlert] = useState(false);
  const [hasDangerAlert, setHasDangerAlert] = useState(false);
  const [alertCount, setAlertCount] = useState(0);
  const [latestWarnings, setLatestWarnings] = useState([]);

  const updateAlertStatus = useCallback((sensorData) => {
    if (!sensorData) {
      setHasActiveAlert(false);
      setHasDangerAlert(false);
      setLatestWarnings([]);
      return;
    }

    const systemStatus = getSystemStatus(sensorData);
    const isActive = systemStatus !== 'safe';
    const isDanger = systemStatus === 'danger';
    
    setHasActiveAlert(isActive);
    setHasDangerAlert(isDanger);
  }, []);

  const updateWarnings = useCallback((warnings) => {
    setLatestWarnings(warnings);
    setAlertCount(warnings.length);
  }, []);

  const clearAlerts = useCallback(() => {
    setHasActiveAlert(false);
    setHasDangerAlert(false);
    setAlertCount(0);
    setLatestWarnings([]);
  }, []);

  const value = {
    hasActiveAlert,
    hasDangerAlert,
    alertCount,
    latestWarnings,
    updateAlertStatus,
    updateWarnings,
    clearAlerts,
  };

  return <AlertContext.Provider value={value}>{children}</AlertContext.Provider>;
};

export default AlertContext;
