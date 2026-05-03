import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../config/supabase';

export default function VerifyEmail() {
  const [status, setStatus] = useState('verifying'); // verifying, success, error
  const navigate = useNavigate();

  useEffect(() => {
    // Supabase handles the token from the URL automatically
    supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') {
        setStatus('success');
        setTimeout(() => navigate('/signin', {
          state: { message: 'Email confirmed! You can now sign in.' }
        }), 2000);
      } else {
        setStatus('error');
      }
    });
  }, []);

  if (status === 'verifying') {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-gray-950">
        <div className="max-w-md w-full p-8 rounded-2xl bg-gray-900 border border-gray-800 text-center">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2 text-white">Verifying your email...</h2>
          <p className="text-sm text-gray-400">Please wait while we confirm your email address</p>
        </div>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-gray-950">
        <div className="max-w-md w-full p-8 rounded-2xl bg-gray-900 border border-gray-800 text-center">
          <div className="text-5xl mb-4">✅</div>
          <h2 className="text-xl font-bold mb-2 text-white">Email Verified!</h2>
          <p className="text-sm text-gray-400 mb-6">
            Your email has been confirmed. Redirecting you to sign in...
          </p>
          <Link
            to="/signin"
            className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg transition font-semibold"
          >
            Sign In Now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-950">
      <div className="max-w-md w-full p-8 rounded-2xl bg-gray-900 border border-gray-800 text-center">
        <div className="text-5xl mb-4">❌</div>
        <h2 className="text-xl font-bold mb-2 text-white">Verification Failed</h2>
        <p className="text-sm text-gray-400 mb-6">
          The verification link is invalid or has expired.
        </p>
        <Link
          to="/signin"
          className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg transition font-semibold"
        >
          Back to Sign In
        </Link>
      </div>
    </div>
  );
}