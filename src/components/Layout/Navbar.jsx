import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNotifications } from '../context/NotificationContext';
import { useState } from 'react';
import { Icons } from './Icons';
import Icon from './Icon';

export default function Navbar() {
  const { user, signOut } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = () => {
    signOut();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const getDashboardLink = () => {
    if (!user) return '/signin';
    if (user.role === 'admin') return '/admin';
    if (user.role === 'provider') return '/provider';
    return '/dashboard';
  };

  const getNotificationLink = () => {
    if (!user) return '/signin';
    if (user.role === 'provider') return '/provider/notifications';
    return '/dashboard/notifications';
  };

  return (
    <nav className={`sticky top-0 z-50 ${darkMode ? 'bg-gray-900/95 border-b border-gray-800' : 'bg-white/95 border-b border-gray-200'} backdrop-blur`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold flex items-center gap-2">
            <img src="/signalhub-logo.png" alt="SignalHub Logo" className="w-10 h-10 rounded-l-xl" />
            <span className={darkMode ? 'text-white' : 'text-gray-800'}>Signal</span>
            <span className="text-orange-500">Hub</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/marketplace" className={`flex items-center gap-1 ${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-orange-500'} transition`}>
              <Icon icon={Icons.Search} size={16} />
              Marketplace
            </Link>
            
            {user ? (
              <>
                <Link to={getDashboardLink()} className={`flex items-center gap-1 ${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-orange-500'} transition`}>
                  <Icon icon={Icons.Dashboard} size={16} />
                  Dashboard
                </Link>
                
                {/* Notifications Bell with Live Counter */}
                <Link to={getNotificationLink()} className="relative">
                  <div className={`p-2 rounded-lg transition ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}>
                    <Icon icon={Icons.Notifications} size={18} />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center animate-pulse">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </div>
                </Link>
                
                <button
                  onClick={handleSignOut}
                  className={`flex items-center gap-1 ${darkMode ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-700'} transition`}
                >
                  <Icon icon={Icons.Logout} size={16} />
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link to="/signin" className={`flex items-center gap-1 ${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-orange-500'} transition`}>
                  <Icon icon={Icons.User} size={16} />
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition flex items-center gap-1"
                >
                  <Icon icon={Icons.UserPlus} size={16} color="white" />
                  Sign Up
                </Link>
              </>
            )}

            {/* Theme Toggle */}
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'} transition`}
            >
              {darkMode ? <Icon icon={Icons.Sun} size={18} /> : <Icon icon={Icons.Moon} size={18} />}
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'} transition`}
            >
              {darkMode ? <Icon icon={Icons.Sun} size={18} /> : <Icon icon={Icons.Moon} size={18} />}
            </button>
            <Link to={getNotificationLink()} className="relative">
              <div className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}>
                <Icon icon={Icons.Notifications} size={18} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </div>
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
            >
              <Icon icon={Icons.Menu} size={20} />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className={`md:hidden py-4 border-t ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
            <div className="flex flex-col space-y-3">
              <Link
                to="/marketplace"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg ${darkMode ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-50 text-gray-600'}`}
              >
                <Icon icon={Icons.Search} size={16} />
                Marketplace
              </Link>
              
              {user ? (
                <>
                  <Link
                    to={getDashboardLink()}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg ${darkMode ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-50 text-gray-600'}`}
                  >
                    <Icon icon={Icons.Dashboard} size={16} />
                    Dashboard
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg ${darkMode ? 'hover:bg-gray-800 text-red-400' : 'hover:bg-gray-50 text-red-600'}`}
                  >
                    <Icon icon={Icons.Logout} size={16} />
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/signin"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg ${darkMode ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-50 text-gray-600'}`}
                  >
                    <Icon icon={Icons.User} size={16} />
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-orange-500 text-white justify-center"
                  >
                    <Icon icon={Icons.UserPlus} size={16} color="white" />
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}