import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useState } from 'react';

export default function Navbar() {
  const { user, signOut } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
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

  return (
    <nav className={`sticky top-0 z-50 ${darkMode ? 'bg-gray-900/95 border-b border-gray-800' : 'bg-white/95 border-b border-orange-100'} backdrop-blur`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold">
            <span className={darkMode ? 'text-white' : 'text-gray-800'}>Signal</span>
            <span className="text-orange-500">Hub</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/marketplace" className={`${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-orange-500'} transition`}>
              Marketplace
            </Link>
            
            {user ? (
              <>
                <Link to={getDashboardLink()} className={`${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-orange-500'} transition`}>
                  Dashboard
                </Link>
                <button
                  onClick={handleSignOut}
                  className={`${darkMode ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-700'} transition`}
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link to="/signin" className={`${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-orange-500'} transition`}>
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition"
                >
                  Sign Up
                </Link>
              </>
            )}

            {/* Theme Toggle */}
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-orange-100'} transition`}
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-orange-100'} transition`}
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-orange-100'}`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className={`md:hidden py-4 border-t ${darkMode ? 'border-gray-800' : 'border-orange-100'}`}>
            <div className="flex flex-col space-y-3">
              <Link
                to="/marketplace"
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2 rounded-lg ${darkMode ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-orange-50 text-gray-600'}`}
              >
                Marketplace
              </Link>
              
              {user ? (
                <>
                  <Link
                    to={getDashboardLink()}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-3 py-2 rounded-lg ${darkMode ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-orange-50 text-gray-600'}`}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className={`text-left px-3 py-2 rounded-lg ${darkMode ? 'hover:bg-gray-800 text-red-400' : 'hover:bg-orange-50 text-red-600'}`}
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/signin"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-3 py-2 rounded-lg ${darkMode ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-orange-50 text-gray-600'}`}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-3 py-2 rounded-lg bg-orange-500 text-white text-center"
                  >
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