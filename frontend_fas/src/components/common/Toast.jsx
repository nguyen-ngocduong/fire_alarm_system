const Toast = ({ type, message, onClose }) => {
  const typeConfig = {
    success: {
      icon: '✓',
      bgColor: 'bg-safe',
      textColor: 'text-white',
    },
    error: {
      icon: '✕',
      bgColor: 'bg-danger',
      textColor: 'text-white',
    },
    warning: {
      icon: '⚠',
      bgColor: 'bg-warning',
      textColor: 'text-white',
    },
    info: {
      icon: 'ℹ',
      bgColor: 'bg-primary',
      textColor: 'text-white',
    },
  };

  const config = typeConfig[type] || typeConfig.info;

  return (
    <div
      className={`
        ${config.bgColor} ${config.textColor}
        px-4 py-3 rounded-lg shadow-lg
        flex items-center gap-3 min-w-[300px] max-w-md
        animate-slide-in
      `}
      role="alert"
    >
      <span className="text-xl font-bold">{config.icon}</span>
      <p className="flex-1 text-sm font-medium">{message}</p>
      <button
        onClick={onClose}
        className="text-white hover:opacity-80 transition-opacity"
        aria-label="Đóng"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};

export const ToastContainer = ({ toasts, removeToast }) => {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          type={toast.type}
          message={toast.message}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
};

export default Toast;
