import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { supabase } from '../config/supabase';

export default function Watchlist() {
  const { user } = useAuth();
  const { darkMode } = useTheme();
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alertPair, setAlertPair] = useState('');
  const [alertPrice, setAlertPrice] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!user) return;
    fetchWatchlist();
  }, [user]);

  const fetchWatchlist = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('watchlist')
        .select(`
          *,
          profiles!provider_id(id, full_name, avatar_url, bio)
        `)
        .eq('customer_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setWatchlist(data || []);
      if (data?.length > 0) setAlertPair(data[0].profiles?.full_name || '');
    } catch (err) {
      console.error('Watchlist fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const removeFromWatchlist = async (id, providerId) => {
    try {
      await supabase
        .from('watchlist')
        .delete()
        .eq('id', id)
        .eq('customer_id', user.id);

      setWatchlist(watchlist.filter(item => item.id !== id));
    } catch (err) {
      console.error('Remove error:', err);
    }
  };

  const handleSetAlert = async (e) => {
    e.preventDefault();
    if (!alertPrice) return;

    try {
      await supabase.from('notifications').insert({
        user_id: user.id,
        title: 'Price Alert Set',
        message: `You'll be notified when ${alertPair} reaches $${alertPrice}`,
        type: 'info',
      });
      setSuccess('Price alert set successfully!');
      setAlertPrice('');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Alert error:', err);
    }
  };

  const getMarketColor = (asset) => {
    const a = asset?.toLowerCase();
    if (['btc', 'eth', 'sol', 'bnb', 'doge', 'xrp'].some(c => a?.includes(c)))
      return 'bg-orange-500/20 text-orange-500';
    if (['aapl', 'nvda', 'tsla', 'msft', 'amzn', 'googl'].some(c => a?.includes(c)))
      return 'bg-blue-500/20 text-blue-500';
    return 'bg-green-500/20 text-green-500';
  };

  const text = darkMode ? 'text-white' : 'text-gray-800';
  const subtext = darkMode ? 'text-gray-400' : 'text-gray-500';
  const card = `rounded-xl p-4 ${darkMode ? 'bg-gray-800' : 'bg-white shadow-lg'}`;
  const input = `w-full px-3 py-2 rounded-lg border focus:outline-none focus:border-orange-500 ${
    darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'
  }`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className={`text-2xl font-bold ${text}`}>My Watchlist</h1>
        <p className={subtext}>Track your favorite providers and get notified of updates</p>
      </div>

      {success && (
        <div className="bg-green-500/10 border border-green-500/50 text-green-400 px-4 py-3 rounded-lg text-sm">
          {success}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className={card}>
          <p className={`text-sm ${subtext}`}>Total Tracked</p>
          <p className={`text-2xl font-bold ${text}`}>{watchlist.length}</p>
        </div>
        <div className={card}>
          <p className={`text-sm ${subtext}`}>Providers</p>
          <p className="text-2xl font-bold text-orange-500">{watchlist.length}</p>
        </div>
        <div className={card}>
          <p className={`text-sm ${subtext}`}>Added This Week</p>
          <p className={`text-2xl font-bold ${text}`}>
            {watchlist.filter(w => {
              const added = new Date(w.created_at);
              const weekAgo = new Date();
              weekAgo.setDate(weekAgo.getDate() - 7);
              return added >= weekAgo;
            }).length}
          </p>
        </div>
      </div>

      {/* Watchlist */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : watchlist.length === 0 ? (
        <div className={`text-center py-12 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white shadow-lg'}`}>
          <div className="text-6xl mb-4">👁️</div>
          <p className={`text-lg ${subtext}`}>Your watchlist is empty</p>
          <Link to="/marketplace" className="text-orange-500 hover:underline mt-2 inline-block">
            Browse Marketplace →
          </Link>
        </div>
      ) : (
        <div className={`rounded-xl overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white shadow-lg'}`}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={darkMode ? 'bg-gray-700' : 'bg-gray-50'}>
                <tr className={subtext}>
                  <th className="text-left px-4 py-3">Provider</th>
                  <th className="text-left px-4 py-3">Bio</th>
                  <th className="text-left px-4 py-3">Added</th>
                  <th className="text-left px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {watchlist.map((item) => (
                  <tr
                    key={item.id}
                    className={`border-b ${darkMode ? 'border-gray-700/50' : 'border-gray-100'}`}
                  >
                    <td className={`px-4 py-3 font-bold ${text}`}>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {item.profiles?.full_name?.charAt(0) || 'P'}
                        </div>
                        {item.profiles?.full_name || 'Unknown Provider'}
                      </div>
                    </td>
                    <td className={`px-4 py-3 text-sm ${subtext} max-w-xs truncate`}>
                      {item.profiles?.bio || 'No bio available'}
                    </td>
                    <td className={`px-4 py-3 text-sm ${subtext}`}>
                      {new Date(item.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <Link
                          to="/marketplace"
                          className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded text-sm transition"
                        >
                          View Signals
                        </Link>
                        <button
                          onClick={() => removeFromWatchlist(item.id, item.provider_id)}
                          className="text-red-500 hover:text-red-400 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Price Alert Section */}
      <div className={`rounded-xl p-6 ${darkMode ? 'bg-gray-800' : 'bg-white shadow-lg'}`}>
        <h2 className={`text-xl font-bold mb-2 ${text}`}>Price Alerts</h2>
        <p className={`text-sm mb-4 ${subtext}`}>Set alerts for your watchlist providers</p>

        {watchlist.length === 0 ? (
          <p className={`text-sm ${subtext}`}>Add providers to your watchlist to set alerts.</p>
        ) : (
          <form onSubmit={handleSetAlert} className="grid md:grid-cols-2 gap-4">
            <div>
              <label className={`block mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Select Provider
              </label>
              <select
                value={alertPair}
                onChange={(e) => setAlertPair(e.target.value)}
                className={input}
              >
                {watchlist.map(item => (
                  <option key={item.id} value={item.profiles?.full_name}>
                    {item.profiles?.full_name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={`block mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Alert Price ($)
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={alertPrice}
                  onChange={(e) => setAlertPrice(e.target.value)}
                  placeholder="Enter price"
                  step="any"
                  className={`flex-1 px-3 py-2 rounded-lg border focus:outline-none focus:border-orange-500 ${
                    darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'
                  }`}
                  required
                />
                <button
                  type="submit"
                  className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition"
                >
                  Set Alert
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}