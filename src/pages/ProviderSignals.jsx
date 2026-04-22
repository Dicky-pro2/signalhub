import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import Icon from '../components/Icon';
import Icons from '../components/Icons';

export default function ProviderSignals() {
  const { darkMode } = useTheme();
  const [signals, setSignals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingSignal, setEditingSignal] = useState(null);

  useEffect(() => {
    fetchSignals();
  }, []);

  const fetchSignals = async () => {
    // Mock data - replace with API call
    setTimeout(() => {
      setSignals([
        { id: 1, pair: 'BTC/USD', market: 'crypto', price: 4.99, purchases: 23, revenue: 114.77, status: 'active', entry: '68,420', tp: '70,000', sl: '67,000', createdAt: '2024-01-15' },
        { id: 2, pair: 'ETH/USD', market: 'crypto', price: 3.99, purchases: 18, revenue: 71.82, status: 'active', entry: '3,845', tp: '4,000', sl: '3,750', createdAt: '2024-01-14' },
        { id: 3, pair: 'EUR/USD', market: 'forex', price: 2.99, purchases: 31, revenue: 92.69, status: 'active', entry: '1.0892', tp: '1.0950', sl: '1.0850', createdAt: '2024-01-13' },
        { id: 4, pair: 'NVDA', market: 'stocks', price: 4.99, purchases: 12, revenue: 59.88, status: 'closed', entry: '892.64', tp: '920', sl: '870', createdAt: '2024-01-10' },
      ]);
      setLoading(false);
    }, 500);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this signal?')) {
      setSignals(signals.filter(s => s.id !== id));
    }
  };

  const handleToggleStatus = (id) => {
    setSignals(signals.map(s => 
      s.id === id ? { ...s, status: s.status === 'active' ? 'closed' : 'active' } : s
    ));
  };

  const totalRevenue = signals.reduce((sum, s) => sum + s.revenue, 0);
  const totalPurchases = signals.reduce((sum, s) => sum + s.purchases, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            My Signals
          </h1>
          <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
            Manage your published signals
          </p>
        </div>
        <Link
          to="/provider/create-signal"
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition flex items-center gap-2"
        >
          ✏️ Create New Signal
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className={`rounded-xl p-4 ${darkMode ? 'bg-gray-800' : 'bg-white shadow-lg'}`}>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total Signals</p>
          <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            {signals.length}
          </p>
        </div>
        <div className={`rounded-xl p-4 ${darkMode ? 'bg-gray-800' : 'bg-white shadow-lg'}`}>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Active Signals</p>
          <p className={`text-2xl font-bold text-green-500`}>
            {signals.filter(s => s.status === 'active').length}
          </p>
        </div>
        <div className={`rounded-xl p-4 ${darkMode ? 'bg-gray-800' : 'bg-white shadow-lg'}`}>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total Purchases</p>
          <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            {totalPurchases}
          </p>
        </div>
        <div className={`rounded-xl p-4 ${darkMode ? 'bg-gray-800' : 'bg-white shadow-lg'}`}>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total Revenue</p>
          <p className={`text-2xl font-bold text-orange-500`}>
            <Icon icon={Icons.Dollar} className="inline" color="orange"/>
            {totalRevenue.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Signals Table */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : signals.length === 0 ? (
        <div className={`text-center py-12 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white shadow-lg'}`}>
          <div className="text-6xl mb-4">
            <Icon icon={Icons.Chart} color={darkMode ? 'gray' : 'orange'} />
          </div>
          <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            You haven't created any signals yet
          </p>
          <Link to="/provider/create-signal" className="text-orange-500 hover:underline mt-2 inline-block">
            Create your first signal →
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
                  <th className="text-left px-4 py-3">Purchases</th>
                  <th className="text-left px-4 py-3">Revenue</th>
                  <th className="text-left px-4 py-3">Status</th>
                  <th className="text-left px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {signals.map((signal) => (
                  <tr key={signal.id} className="border-b border-gray-700/50">
                    <td className={`px-4 py-3 font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      {signal.pair}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded ${
                        signal.market === 'crypto' ? 'bg-orange-500/20 text-orange-500' :
                        signal.market === 'forex' ? 'bg-green-500/20 text-green-500' :
                        'bg-blue-500/20 text-blue-500'
                      }`}>
                        {signal.market}
                      </span>
                    </td>
                    <td className="px-4 py-3">${signal.price}</td>
                    <td className="px-4 py-3">{signal.purchases}</td>
                    <td className="px-4 py-3 text-green-500">${signal.revenue.toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleToggleStatus(signal.id)}
                        className={`px-2 py-1 rounded text-xs ${
                          signal.status === 'active'
                            ? 'bg-green-500/20 text-green-500'
                            : 'bg-gray-500/20 text-gray-400'
                        }`}
                      >
                        {signal.status}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <Link
                          to={`/provider/edit-signal/${signal.id}`}
                          className="text-blue-500 hover:text-blue-400 text-sm"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(signal.id)}
                          className="text-red-500 hover:text-red-400 text-sm"
                        >
                          Delete
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
    </div>
  );
}