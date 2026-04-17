import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

export default function Watchlist() {
  const { darkMode } = useTheme();
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWatchlist();
  }, []);

  const fetchWatchlist = async () => {
    // Mock data - replace with API call
    setTimeout(() => {
      setWatchlist([
        { id: 1, pair: 'BTC/USD', market: 'crypto', price: 68420, change: '+2.7%', provider: 'CryptoKing', signalPrice: 4.99, addedAt: '2024-01-15' },
        { id: 2, pair: 'ETH/USD', market: 'crypto', price: 3845, change: '+5.57%', provider: 'EtherWhale', signalPrice: 3.99, addedAt: '2024-01-14' },
        { id: 3, pair: 'EUR/USD', market: 'forex', price: 1.0892, change: '+0.42%', provider: 'ForexMaster', signalPrice: 2.99, addedAt: '2024-01-13' },
        { id: 4, pair: 'NVDA', market: 'stocks', price: 892.64, change: '+3.42%', provider: 'AIInvestor', signalPrice: 4.99, addedAt: '2024-01-12' },
      ]);
      setLoading(false);
    }, 500);
  };

  const removeFromWatchlist = (id) => {
    setWatchlist(watchlist.filter(item => item.id !== id));
  };

  const getMarketColor = (market) => {
    switch(market) {
      case 'forex': return 'bg-green-500/20 text-green-500';
      case 'crypto': return 'bg-orange-500/20 text-orange-500';
      case 'stocks': return 'bg-blue-500/20 text-blue-500';
      default: return 'bg-gray-500/20 text-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          My Watchlist
        </h1>
        <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
          Track your favorite signals and get notified of updates
        </p>
      </div>

      {/* Watchlist Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className={`rounded-xl p-4 ${darkMode ? 'bg-gray-800' : 'bg-white shadow-lg'}`}>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total Tracked</p>
          <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            {watchlist.length}
          </p>
        </div>
        <div className={`rounded-xl p-4 ${darkMode ? 'bg-gray-800' : 'bg-white shadow-lg'}`}>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Avg Change</p>
          <p className={`text-2xl font-bold text-green-500`}>
            +3.2%
          </p>
        </div>
        <div className={`rounded-xl p-4 ${darkMode ? 'bg-gray-800' : 'bg-white shadow-lg'}`}>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Potential Savings</p>
          <p className={`text-2xl font-bold text-orange-500`}>
            $12.96
          </p>
        </div>
      </div>

      {/* Watchlist Table */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : watchlist.length === 0 ? (
        <div className={`text-center py-12 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white shadow-lg'}`}>
          <div className="text-6xl mb-4">👁️</div>
          <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Your watchlist is empty
          </p>
          <Link to="/marketplace" className="text-orange-500 hover:underline mt-2 inline-block">
            Browse Marketplace →
          </Link>
        </div>
      ) : (
        <div className={`rounded-xl overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white shadow-lg'}`}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={darkMode ? 'bg-gray-700' : 'bg-gray-50'}>
                <tr>
                  <th className="text-left px-4 py-3">Pair</th>
                  <th className="text-left px-4 py-3">Market</th>
                  <th className="text-left px-4 py-3">Price</th>
                  <th className="text-left px-4 py-3">24h Change</th>
                  <th className="text-left px-4 py-3">Provider</th>
                  <th className="text-left px-4 py-3">Signal Price</th>
                  <th className="text-left px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {watchlist.map((item) => (
                  <tr key={item.id} className="border-b border-gray-700/50">
                    <td className={`px-4 py-3 font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      {item.pair}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded ${getMarketColor(item.market)}`}>
                        {item.market}
                      </span>
                    </td>
                    <td className={`px-4 py-3 font-mono ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      ${typeof item.price === 'number' ? item.price.toLocaleString() : item.price}
                    </td>
                    <td className={`px-4 py-3 font-semibold ${item.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                      {item.change}
                    </td>
                    <td className="px-4 py-3">{item.provider}</td>
                    <td className="px-4 py-3 text-orange-500 font-semibold">${item.signalPrice}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <Link
                          to={`/marketplace?signal=${item.id}`}
                          className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded text-sm transition"
                        >
                          Buy
                        </Link>
                        <button
                          onClick={() => removeFromWatchlist(item.id)}
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
        <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          Price Alerts
        </h2>
        <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Set alerts for your watchlist items
        </p>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className={`block mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Select Pair
            </label>
            <select className={`w-full px-3 py-2 rounded-lg border ${
              darkMode 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-800'
            }`}>
              <option>BTC/USD</option>
              <option>ETH/USD</option>
              <option>EUR/USD</option>
            </select>
          </div>
          <div>
            <label className={`block mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Alert Price
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Enter price"
                className={`flex-1 px-3 py-2 rounded-lg border ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-800'
                }`}
              />
              <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition">
                Set Alert
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}