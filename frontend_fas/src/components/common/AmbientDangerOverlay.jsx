import { useContext } from 'react';
import AlertContext from '../../context/AlertContext';

const AmbientDangerOverlay = () => {
  const { hasDangerAlert } = useContext(AlertContext);

  if (!hasDangerAlert) return null;

  return <div className="ambient-danger-overlay pointer-events-none fixed inset-0 z-40" />;
};

export default AmbientDangerOverlay;
