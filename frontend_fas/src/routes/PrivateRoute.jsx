import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Spinner from '../components/common/Spinner';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <Spinner size="xl" />
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
