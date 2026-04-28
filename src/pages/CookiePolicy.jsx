// src/pages/CookiePolicy.jsx
import { useTheme } from '../context/ThemeContext';

export default function CookiePolicy() {
  const { darkMode } = useTheme();

  return (
    <div className={`min-h-screen py-12 px-4 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-3xl mx-auto">
        <h1 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Cookie Policy
        </h1>
        <div className={`prose ${darkMode ? 'prose-invert' : ''} space-y-4`}>
          <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
            Last updated: {new Date().toLocaleDateString()}
          </p>
          <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
            Signal Hub uses cookies to enhance your trading experience. This policy explains what cookies we use and why.
          </p>
          <h2 className={`text-lg font-semibold mt-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            Essential Cookies
          </h2>
          <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
            These cookies are necessary for the platform to function properly, including login sessions and wallet operations.
          </p>
          <h2 className={`text-lg font-semibold mt-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            Analytics Cookies
          </h2>
          <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
            We use analytics cookies to understand how traders use our platform and improve our services.
          </p>
          <h2 className={`text-lg font-semibold mt-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            Managing Cookies
          </h2>
          <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
            You can manage your cookie preferences in your browser settings or use the banner at the bottom of our site.
          </p>
          <p className={darkMode ? 'text-gray-300' : 'text-gray-600'} className="mt-4">
            For questions about our cookie usage, contact support@signalhub.com
          </p>
        </div>
      </div>
    </div>
  );
}