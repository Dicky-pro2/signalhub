import { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../config/supabase';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      setSubmitted(true);
    } catch (err) {
      setError(err.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-gray-950">
        <div className="max-w-md w-full p-8 rounded-2xl bg-gray-900 border border-gray-800 text-center">
          <div className="text-5xl mb-4">📬</div>
          <h2 className="text-xl font-bold mb-2 text-white">Check Your Email</h2>
          <p className="text-sm text-gray-400 mb-6">
            We sent a reset link to <span className="text-orange-500">{email}</span>. 
            Click the link in your inbox to reset your password.
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

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-950">
      <div className="max-w-md w-full">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="text-3xl font-bold">
            <span className="text-white">Signal</span>
            <span className="text-orange-500">Hub</span>
          </div>
          <h2 className="text-2xl font-bold mt-6 text-white">Reset Password</h2>
          <p className="mt-2 text-gray-400">Enter your email to receive a reset link</p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition"
                placeholder="you@example.com"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>

          <p className="text-center mt-6 text-gray-400 text-sm">
            <Link to="/signin" className="text-orange-500 hover:underline">← Back to Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}