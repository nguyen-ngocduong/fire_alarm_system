import { useContext } from 'react';
import AlertContext from '../../context/AlertContext';

const AlertBell = () => {
  const { hasActiveAlert, alertCount } = useContext(AlertContext);

  return (
    <div className="relative">
      <button
        className={`
          p-2 rounded-lg transition-all
          ${hasActiveAlert ? 'bg-danger text-white animate-shake' : 'bg-gray-100 text-text-secondary hover:bg-gray-200'}
        `}
        aria-label="Cảnh báo"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
      </button>
      
      {hasActiveAlert && alertCount > 0 && (
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-danger text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
          {alertCount > 9 ? '9+' : alertCount}
        </span>
      )}
    </div>
  );
};

export default AlertBell;
