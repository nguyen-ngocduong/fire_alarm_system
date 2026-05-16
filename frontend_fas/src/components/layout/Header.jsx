import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ConnectionStatus from './ConnectionStatus';
import AlertBell from './AlertBell';
import Icon from '../common/Icon';
import useAuth from '../../hooks/useAuth';
import logo from '../../assets/logo/fire-alarm-logo.png';

const Header = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="border-b border-white/10 px-4 py-3 sticky top-0 z-30" style={{ background: '#0f172a' }}>
      <div className="flex items-center justify-between">
        {/* Left: Logo (desktop) or Menu button (mobile) */}
        <div className="flex items-center gap-3">
          {/* Menu button for mobile */}
          <button
            onClick={onMenuClick}
            className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Menu"
          >
            <Icon category="navigation" name="menu" size="lg" alt="Menu" className="filter brightness-0 invert" />
          </button>

          {/* Logo - visible on desktop */}
          <div className="hidden md:flex items-center gap-2">
            <img src={logo} alt="Fire Alarm Logo" className="w-8 h-8 object-contain" />
            <div>
              <h1 className="text-sm font-bold text-white leading-tight">Fire Alarm</h1>
              <p className="text-xs text-gray-300 leading-tight">System</p>
            </div>
          </div>
        </div>

        {/* Center: Connection status */}
        <div className="flex-1 flex justify-center md:justify-start md:ml-4">
          <ConnectionStatus />
        </div>

        {/* Right: Alert bell + User menu */}
        <div className="flex items-center gap-3">
          <AlertBell />

          {/* User menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">
                {user?.username?.charAt(0).toUpperCase()}
              </div>
              <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown menu */}
            {showUserMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowUserMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg border z-50 py-1" style={{ background: '#444444', borderColor: '#555555' }}>
                  <div className="px-4 py-2 border-b" style={{ borderColor: '#555555' }}>
                    <p className="text-sm font-medium text-white">{user?.username}</p>
                    <p className="text-xs text-gray-300">{user?.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      navigate('/profile');
                      setShowUserMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-white/10 transition-colors flex items-center gap-2"
                  >
                    <Icon category="navigation" name="profile" size="sm" alt="Profile" className="filter brightness-0 invert" />
                    Hồ sơ cá nhân
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/20 transition-colors flex items-center gap-2"
                  >
                    <Icon category="navigation" name="logout" size="sm" alt="Logout" className="filter brightness-0 invert" />
                    Đăng xuất
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
