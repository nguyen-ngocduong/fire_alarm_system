import { Routes, Route, Navigate } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import AdminRoute from './AdminRoute';
import AppLayout from '../components/layout/AppLayout';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import DashboardPage from '../pages/dashboard/DashboardPage';
import ChartPage from '../pages/chart/ChartPage';
import AlertManagementPage from '../pages/alerts/AlertManagementPage';
import UserManagementPage from '../pages/users/UserManagementPage';
import ProfilePage from '../pages/profile/ProfilePage';
import NotFoundPage from '../pages/NotFoundPage';
import PageTransition from '../components/common/PageTransition';

const AppRouter = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<PageTransition><LoginPage /></PageTransition>} />
      <Route path="/register" element={<PageTransition><RegisterPage /></PageTransition>} />

      {/* Private routes */}
      <Route
        path="/"
        element={
          <PrivateRoute>
            <AppLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<PageTransition><DashboardPage /></PageTransition>} />
        <Route path="chart" element={<PageTransition><ChartPage /></PageTransition>} />
        <Route path="alerts" element={<PageTransition><AlertManagementPage /></PageTransition>} />
        <Route path="profile" element={<PageTransition><ProfilePage /></PageTransition>} />
        
        {/* Admin only routes */}
        <Route
          path="users"
          element={
            <AdminRoute>
              <PageTransition>
                <UserManagementPage />
              </PageTransition>
            </AdminRoute>
          }
        />
      </Route>

      {/* 404 */}
      <Route path="*" element={<PageTransition><NotFoundPage /></PageTransition>} />
    </Routes>
  );
};

export default AppRouter;
