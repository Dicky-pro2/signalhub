// src/pages/NotFoundPage.jsx
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Icon from '../components/Icon';
import { Icons } from '../components/Icons';

export default function NotFoundPage() {
  const { user } = useAuth();
  const { darkMode } = useTheme();

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center px-4 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-md w-full text-center">
        {/* 404 Number */}
        <div className="mb-6">
          <h1 className="text-8xl font-bold tracking-tighter">
            <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
              4
            </span>
            <span className={darkMode ? 'text-gray-700' : 'text-gray-300'}>0</span>
            <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
              4
            </span>
          </h1>
        </div>

        {/* Broken Signal SVG */}
        <div className="mb-6">
          <svg width="120" height="60" viewBox="0 0 200 60" className="mx-auto">
            <defs>
              <linearGradient id="signalGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style={{ stopColor: '#f97316' }} />
                <stop offset="100%" style={{ stopColor: '#ea580c' }} />
              </linearGradient>
            </defs>
            {/* Signal bars */}
            <rect x="10" y="30" width="8" height="20" rx="2" fill="url(#signalGrad)" />
            <rect x="25" y="20" width="8" height="30" rx="2" fill="url(#signalGrad)" opacity="0.7" />
            <rect x="40" y="10" width="8" height="40" rx="2" fill="url(#signalGrad)" opacity="0.4" />
            {/* Broken signal - X mark */}
            <line x1="65" y1="15" x2="85" y2="35" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" />
            <line x1="85" y1="15" x2="65" y2="35" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" />
            {/* Greyed out continuing bars */}
            <rect x="100" y="30" width="8" height="20" rx="2" fill={darkMode ? '#374151' : '#d1d5db'} />
            <rect x="115" y="20" width="8" height="30" rx="2" fill={darkMode ? '#374151' : '#d1d5db'} />
            <rect x="130" y="10" width="8" height="40" rx="2" fill={darkMode ? '#374151' : '#d1d5db'} />
          </svg>
        </div>

        {/* Message */}
        <h2 className={`text-xl font-medium mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Signal Lost
        </h2>
        <p className={`text-sm mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          The page you're looking for doesn't exist or has been moved.
        </p>

        {/* Search Bar */}
        <div className="relative mb-6">
          <Icon icon={Icons.Search} size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search marketplace for signals..."
            className={`w-full pl-9 pr-4 py-2 text-sm border rounded-lg focus:outline-none focus:border-orange-500 ${
              darkMode 
                ? 'bg-gray-800 border-gray-700 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 justify-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition"
          >
            <Icon icon={Icons.Home} size={14} />
            Home
          </Link>
          <Link
            to="/marketplace"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium border rounded-lg transition ${
              darkMode 
                ? 'border-gray-600 hover:bg-gray-800 text-gray-300' 
                : 'border-gray-300 hover:bg-gray-50 text-gray-700'
            }`"
          >
            <Icon icon={Icons.Store} size={14} />
            Marketplace
          </Link>
          {user && (
            <Link
              to={user.role === 'provider' ? '/provider' : user.role === 'admin' ? '/admin' : '/dashboard'}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium border rounded-lg transition ${
                darkMode 
                  ? 'border-gray-600 hover:bg-gray-800 text-gray-300' 
                  : 'border-gray-300 hover:bg-gray-50 text-gray-700'
              }`"
            >
              <Icon icon={Icons.Dashboard} size={14} />
              Dashboard
            </Link>
          )}
        </div>

        {/* Help Link */}
        <div className="mt-6">
          <Link
            to="/support"
            className={`text-xs ${darkMode ? 'text-gray-500 hover:text-gray-400' : 'text-gray-400 hover:text-gray-500'}`}
          >
            Need help? Contact support →
          </Link>
        </div>
      </div>
    </div>
  );
}