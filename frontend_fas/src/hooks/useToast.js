import { useState, useCallback } from 'react';

let toastId = 0;

/**
 * Hook để hiển thị toast notifications
 */
const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((type, message, duration = 4000) => {
    const id = toastId++;
    const toast = { id, type, message };

    setToasts((prev) => [...prev, toast]);

    // Tự động xóa toast sau duration
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return {
    toasts,
    showToast,
    removeToast,
  };
};

export default useToast;
