// src/pages/SignInPage.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Icon from '../components/Icon';
import { Icons } from '../components/Icons';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [show2FA, setShow2FA] = useState(false);
  const [twoFACode, setTwoFACode] = useState('');
  const [tempUserData, setTempUserData] = useState(null);
  const [rememberMe, setRememberMe] = useState(false);
  const { signIn } = useAuth();
  const { darkMode } = useTheme();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const role = userData.user_metadata?.role;
      
      // Check if user has 2FA enabled
      const twoFAEnabled = localStorage.getItem(`twoFA_${email}`) === 'true';
      
      if (twoFAEnabled) {
        setTempUserData(userData);
        setShow2FA(true);
        setLoading(false);
      } else {
        if (role === 'provider') {
          navigate('/provider');
        } else if (role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (err) {
      setError(err.message || 'Invalid email or password');
      setLoading(false);
    }
  };

  const handle2FAVerify = async () => {
    if (twoFACode.length !== 6) {
      setError('Please enter a valid 6-digit code');
      return;
    }

    setLoading(true);
    
    setTimeout(() => {
      if (twoFACode.length === 6) {
        setShow2FA(false);
        
        if (tempUserData?.role === 'provider') {
          navigate('/provider');
        } else if (tempUserData?.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      } else {
        setError('Invalid 2FA code');
        setLoading(false);
      }
    }, 1000);
  };

  const quickLogin = (role, demoEmail, has2FA = false) => {
    setEmail(demoEmail);
    setPassword('password');
    
    if (has2FA) {
      localStorage.setItem(`twoFA_${demoEmail}`, 'true');
    }
    
    setTimeout(() => {
      handleSubmit(new Event('submit'));
    }, 100);
  };

  return (
    <>
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
              <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-2 rounded-lg mb-6 text-sm flex items-center gap-2">
                <Icon icon={Icons.Alert} size={14} />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Field */}
              <div>
                <label className={`block mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Icon icon={Icons.User} size={16} className="text-gray-400" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:border-orange-500 ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-800'
                    }`}
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>

              {/* Password Field with Show/Hide Toggle */}
              <div>
                <label className={`block mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Icon icon={Icons.Lock} size={16} className="text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full pl-10 pr-12 py-2 rounded-lg border focus:outline-none focus:border-orange-500 ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-800'
                    }`}
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <Icon icon={Icons.EyeOff} size={16} className="text-gray-400 hover:text-orange-500 transition cursor-pointer" />
                    ) : (
                      <Icon icon={Icons.Eye} size={16} className="text-gray-400 hover:text-orange-500 transition cursor-pointer" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-600 text-orange-500 focus:ring-orange-500 cursor-pointer" 
                  />
                  <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Remember me
                  </span>
                </label>
                <Link to="/forgot-password" className={`text-sm text-orange-500 hover:underline`}>
                  Forgot password?
                </Link>
              </div>

              {/* Sign In Button */}
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
                  onClick={() => quickLogin('customer', 'customer@test.com')}
                  className="text-xs bg-blue-600 hover:bg-blue-500 text-white px-2 py-1 rounded transition"
                >
                  📊 Customer
                </button>
                <button
                  onClick={() => quickLogin('provider', 'provider@signalhub.com')}
                  className="text-xs bg-orange-600 hover:bg-orange-500 text-white px-2 py-1 rounded transition"
                >
                  💰 Provider
                </button>
                <button
                  onClick={() => quickLogin('admin', 'admin@signalhub.com')}
                  className="text-xs bg-purple-600 hover:bg-purple-500 text-white px-2 py-1 rounded transition"
                >
                  👑 Admin
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <button
                  onClick={() => quickLogin('2fa', '2fa@test.com', true)}
                  className="text-xs bg-green-600 hover:bg-green-500 text-white px-2 py-1 rounded transition"
                >
                  🔐 Test 2FA Account
                </button>
              </div>
            </div>

            {/* Sign Up Link */}
            <p className={`text-center mt-6 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Don't have an account?{' '}
              <Link to="/signup" className="text-orange-500 hover:underline">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* 2FA Modal */}
      {show2FA && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className={`max-w-md w-full rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} p-6`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className={`text-xl font-bold flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                <Icon icon={Icons.ShieldAlt} size={20} />
                Two-Factor Authentication
              </h2>
              <button 
                onClick={() => {
                  setShow2FA(false);
                  setLoading(false);
                }} 
                className="text-gray-500 hover:text-gray-700"
              >
                <Icon icon={Icons.Close} size={20} />
              </button>
            </div>
            
            <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Please enter the 6-digit verification code from your authenticator app.
            </p>
            
            <input
              type="text"
              value={twoFACode}
              onChange={(e) => setTwoFACode(e.target.value)}
              placeholder="000000"
              maxLength={6}
              className={`w-full text-center text-2xl tracking-wider py-3 rounded-lg border focus:outline-none focus:border-orange-500 mb-4 ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-800'
              }`}
              autoFocus
            />
            
            {error && (
              <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-2 rounded-lg mb-4 text-sm">
                {error}
              </div>
            )}
            
            <button
              onClick={handle2FAVerify}
              disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded-lg transition disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Verify & Sign In'}
            </button>
            
            <div className="text-center mt-4">
              <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                Lost access to your authenticator? <button className="text-orange-500 hover:underline">Contact support</button>
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}