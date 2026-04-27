// src/components/AdminLoginModal.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function AdminLoginModal({ isOpen, onClose }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const { darkMode } = useTheme();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const userData = await signIn(email, password);
      if (userData.role === 'admin') {
        onClose();
        navigate('/admin');
      } else {
        setError('Admin access required');
      }
    } catch (err) {
      setError('Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className={`w-80 rounded-lg border ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
        <form onSubmit={handleSubmit} className="p-5 space-y-3">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium">Admin Access</h3>
            <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-500">×</button>
          </div>
          
          {error && <p className="text-red-500 text-xs">{error}</p>}
          
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@signalhub.com"
            className={`w-full px-3 py-1.5 text-sm border rounded-md focus:outline-none focus:border-orange-500 ${
              darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
            }`}
            required
          />
          
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className={`w-full px-3 py-1.5 text-sm border rounded-md focus:outline-none focus:border-orange-500 ${
              darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
            }`}
            required
          />
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 text-white text-sm py-1.5 rounded-md hover:bg-orange-600 transition"
          >
            {loading ? '...' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}