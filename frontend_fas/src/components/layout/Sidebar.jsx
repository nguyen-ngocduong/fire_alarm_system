import { NavLink } from 'react-router-dom';
import { NAV_ITEMS } from '../../utils/constants';
import useAuth from '../../hooks/useAuth';
import Icon from '../common/Icon';
import logo from '../../assets/logo/fire-alarm-logo.png';

const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const navItems = user?.role === 'ADMIN' ? NAV_ITEMS.ADMIN : NAV_ITEMS.USER;

  // Map icon names to icon categories
  const getIconProps = (path) => {
    const iconMap = {
      '/dashboard': { category: 'navigation', name: 'dashboard' },
      '/chart': { category: 'navigation', name: 'chart' },
      '/alerts': { category: 'alert', name: 'bell' },
      '/users': { category: 'user', name: 'userGroup' },
      '/profile': { category: 'navigation', name: 'profile' },
    };
    return iconMap[path] || { category: 'navigation', name: 'dashboard' };
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 border-r border-border z-50
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 md:static
        `}
        style={{
          background: 'linear-gradient(180deg, #1e3a8a 0%, #1e40af 50%, #3b82f6 100%)',
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 p-6 border-b border-white/20">
          <img src={logo} alt="Fire Alarm Logo" className="w-12 h-12 object-contain" />
          <div>
            <h1 className="text-lg font-bold text-white">Fire Alarm</h1>
            <p className="text-xs text-blue-200">System</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4">
          <ul className="space-y-2">
            {navItems.map((item) => {
              const iconProps = getIconProps(item.path);
              return (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-white/20 text-white shadow-lg backdrop-blur-sm'
                          : 'text-blue-100 hover:bg-white/10'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <Icon 
                          {...iconProps} 
                          size="lg" 
                          alt={item.label}
                          className={isActive ? 'filter brightness-0 invert' : 'opacity-90'}
                        />
                        <span className="font-medium">{item.label}</span>
                      </>
                    )}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User info at bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/20 bg-black/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 text-white flex items-center justify-center font-bold backdrop-blur-sm">
              {user?.username?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {user?.username}
              </p>
              <p className="text-xs text-blue-200">{user?.role}</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
