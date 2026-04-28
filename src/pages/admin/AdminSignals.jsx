// src/pages/admin/AdminSignals.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import Icon from '../../components/Icon';
import { Icons } from '../../components/Icons';

export default function AdminSignals() {
  const { darkMode } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const [signals, setSignals] = useState([
    { id: 1, pair: 'BTC/USD', market: 'crypto', provider: 'CryptoKing', price: 4.99, purchases: 156, status: 'active', createdAt: '2024-01-15' },
    { id: 2, pair: 'ETH/USD', market: 'crypto', provider: 'EtherWhale', price: 3.99, purchases: 98, status: 'active', createdAt: '2024-01-14' },
    { id: 3, pair: 'EUR/USD', market: 'forex', provider: 'ForexMaster', price: 2.99, purchases: 234, status: 'active', createdAt: '2024-01-13' },
    { id: 4, pair: 'DOGE/USD', market: 'crypto', provider: 'MemeMaster', price: 19.99, purchases: 12, status: 'flagged', createdAt: '2024-01-12' },
    { id: 5, pair: 'NVDA', market: 'stocks', provider: 'AIInvestor', price: 4.99, purchases: 67, status: 'active', createdAt: '2024-01-11' },
  ]);

  const stats = {
    total: signals.length,
    active: signals.filter(s => s.status === 'active').length,
    flagged: signals.filter(s => s.status === 'flagged').length,
    totalPurchases: signals.reduce((sum, s) => sum + s.purchases, 0),
    totalRevenue: signals.reduce((sum, s) => sum + (s.price * s.purchases), 0),
  };

  const filteredSignals = signals.filter(signal => {
    const matchesSearch = signal.pair.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          signal.provider.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || signal.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const removeSignal = (id) => {
    if (window.confirm('Remove this signal?')) {
      setSignals(signals.filter(s => s.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Signals
        </h1>
        <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Manage all trading signals on the platform
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className={`rounded-xl p-4 ${darkMode ? 'bg-gray-800' : 'bg-white shadow-lg'}`}>
          <div className="flex items-center justify-between mb-2">
            <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total Signals</span>
            <Icon icon={Icons.Chart} size={18} className="text-orange-500" />
          </div>
          <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{stats.total}</p>
        </div>
        <div className={`rounded-xl p-4 ${darkMode ? 'bg-gray-800' : 'bg-white shadow-lg'}`}>
          <div className="flex items-center justify-between mb-2">
            <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Active</span>
            <Icon icon={Icons.CheckCircle} size={18} className="text-green-500" />
          </div>
          <p className={`text-2xl font-bold text-green-500`}>{stats.active}</p>
        </div>
        <div className={`rounded-xl p-4 ${darkMode ? 'bg-gray-800' : 'bg-white shadow-lg'}`}>
          <div className="flex items-center justify-between mb-2">
            <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Flagged</span>
            <Icon icon={Icons.AlertTriangle} size={18} className="text-red-500" />
          </div>
          <p className={`text-2xl font-bold text-red-500`}>{stats.flagged}</p>
        </div>
        <div className={`rounded-xl p-4 ${darkMode ? 'bg-gray-800' : 'bg-white shadow-lg'}`}>
          <div className="flex items-center justify-between mb-2">
            <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total Purchases</span>
            <Icon icon={Icons.ShoppingCart} size={18} className="text-blue-500" />
          </div>
          <p className={`text-2xl font-bold text-blue-500`}>{stats.totalPurchases}</p>
        </div>
        <div className={`rounded-xl p-4 ${darkMode ? 'bg-gray-800' : 'bg-white shadow-lg'}`}>
          <div className="flex items-center justify-between mb-2">
            <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Revenue</span>
            <Icon icon={Icons.Dollar} size={18} className="text-green-500" />
          </div>
          <p className={`text-2xl font-bold text-green-500`}>${stats.totalRevenue.toFixed(2)}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Icon icon={Icons.Search} size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by pair or provider..."
            className={`w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:border-orange-500 ${
              darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'
            }`}
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className={`px-4 py-2 rounded-lg border focus:outline-none focus:border-orange-500 ${
            darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'
          }`}
        >
          <option value="all">All Signals</option>
          <option value="active">Active</option>
          <option value="flagged">Flagged</option>
        </select>
      </div>

      {/* Signals Table */}
      <div className={`rounded-xl overflow-hidden border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={darkMode ? 'bg-gray-800' : 'bg-gray-50'}>
              <tr className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <th className="text-left px-6 py-4 font-medium">Pair</th>
                <th className="text-left px-6 py-4 font-medium">Market</th>
                <th className="text-left px-6 py-4 font-medium">Provider</th>
                <th className="text-left px-6 py-4 font-medium">Price</th>
                <th className="text-left px-6 py-4 font-medium">Purchases</th>
                <th className="text-left px-6 py-4 font-medium">Status</th>
                <th className="text-left px-6 py-4 font-medium">Created</th>
                <th className="text-left px-6 py-4 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {filteredSignals.map((signal) => (
                <tr key={signal.id} className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                  <td className={`px-6 py-4 font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{signal.pair}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${
                      signal.market === 'crypto' ? 'bg-orange-500/10 text-orange-500' :
                      signal.market === 'forex' ? 'bg-green-500/10 text-green-500' :
                      'bg-blue-500/10 text-blue-500'
                    }`}>
                      {signal.market === 'crypto' && <Icon icon={Icons.Bitcoin} size={12} />}
                      {signal.market === 'forex' && <Icon icon={Icons.ExchangeAlt} size={12} />}
                      {signal.market === 'stocks' && <Icon icon={Icons.ChartBar} size={12} />}
                      {signal.market}
                    </span>
                  </td>
                  <td className={`px-6 py-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{signal.provider}</td>
                  <td className="px-6 py-4 text-orange-500 font-medium">${signal.price}</td>
                  <td className={`px-6 py-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{signal.purchases}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${
                      signal.status === 'active' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                    }`}>
                      {signal.status === 'active' && <Icon icon={Icons.CheckCircle} size={12} />}
                      {signal.status === 'flagged' && <Icon icon={Icons.AlertTriangle} size={12} />}
                      {signal.status}
                    </span>
                  </td>
                  <td className={`px-6 py-4 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{signal.createdAt}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-3">
                      {signal.status === 'flagged' && (
                        <button className="text-green-500 text-sm hover:underline">Clear Flag</button>
                      )}
                      <button onClick={() => removeSignal(signal.id)} className="text-red-500 text-sm hover:underline">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}