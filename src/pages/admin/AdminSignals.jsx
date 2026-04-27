// src/pages/admin/AdminSignals.jsx
import { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import Icon from '../../components/Icon';
import { Icons } from '../../components/Icons';

export default function AdminSignals() {
  const { darkMode } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const [signals, setSignals] = useState([
    { id: 1, pair: 'BTC/USD', market: 'crypto', provider: 'CryptoKing', price: 4.99, purchases: 156, status: 'active', createdAt: '2024-01-15', flagged: false },
    { id: 2, pair: 'ETH/USD', market: 'crypto', provider: 'EtherWhale', price: 3.99, purchases: 98, status: 'active', createdAt: '2024-01-14', flagged: false },
    { id: 3, pair: 'EUR/USD', market: 'forex', provider: 'ForexMaster', price: 2.99, purchases: 234, status: 'active', createdAt: '2024-01-13', flagged: false },
    { id: 4, pair: 'DOGE/USD', market: 'crypto', provider: 'MemeMaster', price: 19.99, purchases: 12, status: 'flagged', createdAt: '2024-01-12', flagged: true, flagReason: 'Price too high' },
    { id: 5, pair: 'NVDA', market: 'stocks', provider: 'AIInvestor', price: 4.99, purchases: 67, status: 'active', createdAt: '2024-01-11', flagged: false },
  ]);

  const stats = {
    total: signals.length,
    active: signals.filter(s => s.status === 'active').length,
    flagged: signals.filter(s => s.status === 'flagged').length,
    totalPurchases: signals.reduce((sum, s) => sum + s.purchases, 0),
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

  const clearFlag = (id) => {
    setSignals(signals.map(s => 
      s.id === id ? { ...s, status: 'active', flagged: false, flagReason: null } : s
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className={`text-xl font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Signals
        </h1>
        <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Manage all trading signals on the platform
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className={`border rounded-md p-3 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total Signals</p>
          <p className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{stats.total}</p>
        </div>
        <div className={`border rounded-md p-3 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Active</p>
          <p className={`text-xl font-semibold text-green-500`}>{stats.active}</p>
        </div>
        <div className={`border rounded-md p-3 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Flagged</p>
          <p className={`text-xl font-semibold text-red-500`}>{stats.flagged}</p>
        </div>
        <div className={`border rounded-md p-3 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total Purchases</p>
          <p className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{stats.totalPurchases}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Icon icon={Icons.Search} size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by pair or provider..."
            className={`w-full pl-9 pr-3 py-1.5 text-sm border rounded-md focus:outline-none focus:border-orange-500 ${
              darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'
            }`}
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className={`px-3 py-1.5 text-sm border rounded-md focus:outline-none focus:border-orange-500 ${
            darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'
          }`}
        >
          <option value="all">All signals</option>
          <option value="active">Active</option>
          <option value="flagged">Flagged</option>
        </select>
      </div>

      {/* Signals Table */}
      <div className={`border rounded-md overflow-hidden ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className={darkMode ? 'bg-gray-800' : 'bg-gray-50'}>
              <tr className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <th className="text-left px-4 py-3 font-medium">Pair</th>
                <th className="text-left px-4 py-3 font-medium">Market</th>
                <th className="text-left px-4 py-3 font-medium">Provider</th>
                <th className="text-left px-4 py-3 font-medium">Price</th>
                <th className="text-left px-4 py-3 font-medium">Purchases</th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
                <th className="text-left px-4 py-3 font-medium">Created</th>
                <th className="text-left px-4 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {filteredSignals.map((signal) => (
                <tr key={signal.id} className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                  <td className={`px-4 py-3 font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{signal.pair}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      signal.market === 'crypto' ? 'bg-orange-500/10 text-orange-500' :
                      signal.market === 'forex' ? 'bg-green-500/10 text-green-500' :
                      'bg-blue-500/10 text-blue-500'
                    }`}>
                      {signal.market}
                    </span>
                  </td>
                  <td className={`px-4 py-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{signal.provider}</td>
                  <td className="px-4 py-3 text-orange-500">${signal.price}</td>
                  <td className={`px-4 py-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{signal.purchases}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      signal.status === 'active' ? 'bg-green-500/10 text-green-500' :
                      'bg-red-500/10 text-red-500'
                    }`}>
                      {signal.status}
                    </span>
                  </td>
                  <td className={`px-4 py-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{signal.createdAt}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      {signal.flagged ? (
                        <button onClick={() => clearFlag(signal.id)} className="text-green-500 text-xs hover:underline">Clear flag</button>
                      ) : (
                        <button onClick={() => flagSignal(signal.id)} className="text-yellow-500 text-xs hover:underline">Flag</button>
                      )}
                      <button onClick={() => removeSignal(signal.id)} className="text-red-500 text-xs hover:underline">Delete</button>
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