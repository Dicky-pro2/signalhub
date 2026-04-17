import { useState } from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export default function DashboardLayout() {
  const { user, signOut } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const getNavigation = () => {
    if (user?.role === 'admin') {
      return [
        { name: 'Dashboard', href: '/admin', icon: '📊' },
        { name: 'Users', href: '/admin/users', icon: '👥' },
        { name: 'Providers', href: '/admin/providers', icon: '⭐' },
        { name: 'Signals', href: '/admin/signals', icon: '📈' },
        { name: 'Transactions', href: '/admin/transactions', icon: '💰' },
        { name: 'Reports', href: '/admin/reports', icon: '🚩' },
        { name: 'Settings', href: '/admin/settings', icon: '⚙️' },
      ];
    } else if (user?.role === 'provider') {
  return [
    { name: 'Dashboard', href: '/provider', icon: '📊' },
    { name: 'My Signals', href: '/provider/signals', icon: '📈' },
    { name: 'Create Signal', href: '/provider/create-signal', icon: '✏️' },
    { name: 'Earnings', href: '/provider/earnings', icon: '💰' },
    { name: 'Withdraw', href: '/provider/withdraw', icon: '💸' },  // Add this line
    { name: 'Reviews', href: '/provider/reviews', icon: '⭐' },
    { name: 'Analytics', href: '/provider/analytics', icon: '📉' },
    { name: 'Notifications', href: '/provider/notifications', icon: '🔔' },
    { name: 'Settings', href: '/provider/settings', icon: '⚙️' },
  ];
} else {
  return [
    { name: 'Dashboard', href: '/dashboard', icon: '📊' },
    { name: 'Marketplace', href: '/marketplace', icon: '🛒' },
    { name: 'My Purchases', href: '/dashboard/purchases', icon: '📦' },
    { name: 'Watchlist', href: '/dashboard/watchlist', icon: '👁️' },
    { name: 'Wallet', href: '/dashboard/wallet', icon: '💰' },
    { name: 'Notifications', href: '/dashboard/notifications', icon: '🔔' },
    { name: 'Settings', href: '/dashboard/settings', icon: '⚙️' },
  ];
}
  };

  const navigation = getNavigation();

  const handleSignOut = () => {
    signOut();
    navigate('/');
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-orange-50'}`}>
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-30 w-64 h-full transition-transform duration-300 ${
          darkMode ? 'bg-gray-800 border-r border-gray-700' : 'bg-white border-r border-orange-200'
        } ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-gray-700">
            <Link to="/" className="text-2xl font-bold">
              <span className={darkMode ? 'text-white' : 'text-gray-800'}>Signal</span>
              <span className="text-orange-500">Hub</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg transition ${
                  location.pathname === item.href
                    ? darkMode
                      ? 'bg-orange-500/20 text-orange-400'
                      : 'bg-orange-100 text-orange-600'
                    : darkMode
                    ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    : 'text-gray-600 hover:bg-orange-50 hover:text-orange-600'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>

          {/* User info */}
          <div className={`p-4 border-t ${darkMode ? 'border-gray-700' : 'border-orange-100'}`}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                {user?.full_name?.charAt(0) || 'U'}
              </div>
              <div className="flex-1">
                <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  {user?.full_name || 'User'}
                </p>
                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {user?.role || 'customer'}
                </p>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className={`w-full text-left px-4 py-2 rounded-lg text-sm transition ${
                darkMode
                  ? 'text-red-400 hover:bg-red-500/20'
                  : 'text-red-600 hover:bg-red-50'
              }`}
            >
              🚪 Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:ml-64">
        {/* Top navbar */}
        <nav className={`sticky top-0 z-10 ${darkMode ? 'bg-gray-800/95' : 'bg-white/95'} backdrop-blur border-b ${darkMode ? 'border-gray-700' : 'border-orange-100'}`}>
          <div className="px-4 py-3 flex justify-between items-center">
            <button
              onClick={() => setSidebarOpen(true)}
              className={`lg:hidden p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-orange-100'}`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <div className="flex items-center gap-4">
              {/* Theme toggle */}
              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-lg transition ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-orange-100'}`}
              >
                {darkMode ? '☀️' : '🌙'}
              </button>

              {/* Notifications */}
              <button className={`p-2 rounded-lg transition ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-orange-100'}`}>
                🔔
              </button>
            </div>
          </div>
        </nav>

        {/* Page content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}