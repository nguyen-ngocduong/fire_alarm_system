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

const AppRouter = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

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
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="chart" element={<ChartPage />} />
        <Route path="alerts" element={<AlertManagementPage />} />
        <Route path="profile" element={<ProfilePage />} />
        
        {/* Admin only routes */}
        <Route
          path="users"
          element={
            <AdminRoute>
              <UserManagementPage />
            </AdminRoute>
          }
        />
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRouter;
