// src/pages/VerifyEmail.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import Icon from '../components/Icon';
import { Icons } from '../components/Icons';

export default function VerifyEmail() {
  const { token } = useParams();
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const [status, setStatus] = useState('verifying'); // verifying, success, error
  const [resendLoading, setResendLoading] = useState(false);

  useEffect(() => {
    // Simulate verification - replace with actual API call
    setTimeout(() => {
      if (token === 'valid-token') {
        setStatus('success');
      } else {
        setStatus('error');
      }
    }, 1500);
  }, [token]);

  const handleResend = async () => {
    setResendLoading(true);
    // Simulate API call
    setTimeout(() => {
      alert('Verification email resent!');
      setResendLoading(false);
    }, 1000);
  };

  if (status === 'verifying') {
    return (
      <div className={`min-h-screen flex items-center justify-center px-4 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className={`max-w-md w-full p-8 rounded-xl text-center ${darkMode ? 'bg-gray-800' : 'bg-white shadow-lg'}`}>
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <h2 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Verifying your email...
          </h2>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Please wait while we confirm your email address
          </p>
        </div>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className={`min-h-screen flex items-center justify-center px-4 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className={`max-w-md w-full p-8 rounded-xl text-center ${darkMode ? 'bg-gray-800' : 'bg-white shadow-lg'}`}>
          <Icon icon={Icons.Success} size={48} className="mx-auto mb-4 text-green-500" />
          <h2 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Email Verified!
          </h2>
          <p className={`text-sm mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Your email has been successfully verified.
          </p>
          <Link
            to="/signin"
            className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition"
          >
            Sign In Now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className={`max-w-md w-full p-8 rounded-xl text-center ${darkMode ? 'bg-gray-800' : 'bg-white shadow-lg'}`}>
        <Icon icon={Icons.Alert} size={48} className="mx-auto mb-4 text-red-500" />
        <h2 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Verification Failed
        </h2>
        <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          The verification link is invalid or has expired.
        </p>
        <button
          onClick={handleResend}
          disabled={resendLoading}
          className="text-orange-500 text-sm hover:underline"
        >
          {resendLoading ? 'Sending...' : 'Resend verification email'}
        </button>
      </div>
    </div>
  );
}