import { useState, useEffect } from 'react';
import { testConnection } from '../../api/sensorApi';
import { CONNECTION_CHECK_INTERVAL } from '../../utils/constants';

const ConnectionStatus = () => {
  const [status, setStatus] = useState('checking'); // 'connected', 'disconnected', 'checking'

  useEffect(() => {
    const checkConnection = async () => {
      try {
        await testConnection();
        setStatus('connected');
      } catch (error) {
        console.error('Connection check failed:', error);
        setStatus('disconnected');
      }
    };

    // Check ngay lần đầu
    checkConnection();

    // Poll định kỳ
    const interval = setInterval(checkConnection, CONNECTION_CHECK_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  const statusConfig = {
    connected: {
      icon: '🟢',
      text: 'Đã kết nối',
      color: 'text-safe',
    },
    disconnected: {
      icon: '🔴',
      text: 'Mất kết nối',
      color: 'text-danger',
    },
    checking: {
      icon: '🟡',
      text: 'Đang kiểm tra...',
      color: 'text-warning',
    },
  };

  const config = statusConfig[status];

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-950/40 border border-white/5 shadow-inner">
      <span className={status === 'checking' ? 'animate-pulse' : ''}>
        {config.icon}
      </span>
      <span className={`text-sm font-medium ${config.color}`}>
        Firebase: {config.text}
      </span>
    </div>
  );
};

export default ConnectionStatus;
