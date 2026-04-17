import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const { darkMode } = useTheme();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const userData = await signIn(email, password);
      console.log('Login successful, role:', userData.role); // Debug log
      
      // Redirect based on role
      if (userData.role === 'provider') {
        navigate('/provider');
      } else if (userData.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  // Quick login for demo purposes
  const quickLogin = (role) => {
    let demoEmail = '';
    if (role === 'customer') demoEmail = 'customer@demo.com';
    if (role === 'provider') demoEmail = 'provider@signalhub.com';
    if (role === 'admin') demoEmail = 'admin@signalhub.com';
    
    setEmail(demoEmail);
    setPassword('password');
    // Auto submit after a short delay
    setTimeout(() => {
      handleSubmit(new Event('submit'));
    }, 100);
  };

  return (
    <div className={`min-h-screen flex items-center justify-center py-12 px-4 ${darkMode ? 'bg-gray-900' : 'bg-orange-50'}`}>
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="text-3xl font-bold">
            <span className={darkMode ? 'text-white' : 'text-gray-800'}>Signal</span>
            <span className="text-orange-500">Hub</span>
          </Link>
          <h2 className={`text-2xl font-bold mt-6 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            Welcome Back
          </h2>
          <p className={`mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Sign in to access your dashboard
          </p>
        </div>

        {/* Form */}
        <div className={`rounded-xl shadow-xl p-8 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-400 px-4 py-2 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className={`block mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:border-orange-500 ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-800'
                }`}
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label className={`block mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:border-orange-500 ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-800'
                }`}
                placeholder="••••••••"
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded border-gray-600" />
                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Remember me
                </span>
              </label>
              <a href="#" className={`text-sm text-orange-500 hover:underline`}>
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded-lg transition disabled:opacity-50"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          {/* Demo Quick Login Buttons */}
          <div className="mt-6">
            <p className={`text-center text-sm mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Demo Quick Login:
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => quickLogin('customer')}
                className="text-xs bg-gray-700 hover:bg-gray-600 text-white px-2 py-1 rounded transition"
              >
                📊 Customer
              </button>
              <button
                onClick={() => quickLogin('provider')}
                className="text-xs bg-orange-600 hover:bg-orange-500 text-white px-2 py-1 rounded transition"
              >
                💰 Provider
              </button>
              <button
                onClick={() => quickLogin('admin')}
                className="text-xs bg-purple-600 hover:bg-purple-500 text-white px-2 py-1 rounded transition"
              >
                👑 Admin
              </button>
            </div>
          </div>

          <p className={`text-center mt-6 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Don't have an account?{' '}
            <Link to="/signup" className="text-orange-500 hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}