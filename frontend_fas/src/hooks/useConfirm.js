import { useState, useCallback } from 'react';

/**
 * Hook để hiển thị confirm dialog
 */
const useConfirm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState({
    title: '',
    message: '',
    onConfirm: null,
    onCancel: null,
  });

  const confirm = useCallback((title, message) => {
    return new Promise((resolve) => {
      setConfig({
        title,
        message,
        onConfirm: () => {
          setIsOpen(false);
          resolve(true);
        },
        onCancel: () => {
          setIsOpen(false);
          resolve(false);
        },
      });
      setIsOpen(true);
    });
  }, []);

  const handleConfirm = useCallback(() => {
    if (config.onConfirm) {
      config.onConfirm();
    }
  }, [config]);

  const handleCancel = useCallback(() => {
    if (config.onCancel) {
      config.onCancel();
    }
  }, [config]);

  return {
    isOpen,
    config,
    confirm,
    handleConfirm,
    handleCancel,
  };
};

export default useConfirm;
