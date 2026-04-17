import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

export default function Footer() {
  const { darkMode } = useTheme();

  return (
    <footer className={`${darkMode ? 'bg-gray-900 border-t border-gray-800' : 'bg-white border-t border-orange-100'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <Link to="/" className="text-2xl font-bold inline-block mb-4">
              <span className={darkMode ? 'text-white' : 'text-gray-800'}>Signal</span>
              <span className="text-orange-500">Hub</span>
            </Link>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Make trading accessible to everyone. Expert signals at affordable prices.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className={`font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/marketplace" className={`text-sm ${darkMode ? 'text-gray-400 hover:text-orange-400' : 'text-gray-500 hover:text-orange-500'} transition`}>Marketplace</Link></li>
              <li><Link to="/dashboard" className={`text-sm ${darkMode ? 'text-gray-400 hover:text-orange-400' : 'text-gray-500 hover:text-orange-500'} transition`}>Dashboard</Link></li>
              <li><Link to="/signup" className={`text-sm ${darkMode ? 'text-gray-400 hover:text-orange-400' : 'text-gray-500 hover:text-orange-500'} transition`}>Become a Provider</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className={`font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Resources</h3>
            <ul className="space-y-2">
              <li><a href="#" className={`text-sm ${darkMode ? 'text-gray-400 hover:text-orange-400' : 'text-gray-500 hover:text-orange-500'} transition`}>Help Center</a></li>
              <li><a href="#" className={`text-sm ${darkMode ? 'text-gray-400 hover:text-orange-400' : 'text-gray-500 hover:text-orange-500'} transition`}>Terms of Service</a></li>
              <li><a href="#" className={`text-sm ${darkMode ? 'text-gray-400 hover:text-orange-400' : 'text-gray-500 hover:text-orange-500'} transition`}>Privacy Policy</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className={`font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Contact</h3>
            <ul className="space-y-2">
              <li className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>📧 support@signalhub.com</li>
              <li className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>🐦 @signalhub</li>
              <li className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>💬 24/7 Support</li>
            </ul>
          </div>
        </div>

        <div className={`mt-8 pt-8 text-center text-sm ${darkMode ? 'text-gray-500 border-t border-gray-800' : 'text-gray-400 border-t border-orange-100'}`}>
          <p>© 2024 Signal Hub. All rights reserved. Not financial advice. Trading involves risk.</p>
        </div>
      </div>
    </footer>
  );
}