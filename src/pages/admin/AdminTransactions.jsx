// src/pages/admin/AdminTransactions.jsx
import { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import Icon from '../../components/Icon';
import { Icons } from '../../components/Icons';

export default function AdminTransactions() {
  const { darkMode } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const [transactions, setTransactions] = useState([
    { id: 1, user: 'Marcus T.', type: 'deposit', amount: 50.00, status: 'completed', date: '2024-01-15', method: 'card' },
    { id: 2, user: 'CryptoKing', type: 'payout', amount: 342.50, status: 'pending', date: '2024-01-15', method: 'bank' },
    { id: 3, user: 'Sarah K.', type: 'purchase', amount: 4.99, status: 'completed', date: '2024-01-14', method: 'wallet' },
    { id: 4, user: 'AIInvestor', type: 'payout', amount: 210.00, status: 'completed', date: '2024-01-14', method: 'crypto' },
    { id: 5, user: 'John D.', type: 'deposit', amount: 100.00, status: 'completed', date: '2024-01-13', method: 'crypto' },
    { id: 6, user: 'LondonTrader', type: 'payout', amount: 89.50, status: 'pending', date: '2024-01-13', method: 'bank' },
  ]);

  const stats = {
    totalAmount: transactions.reduce((sum, t) => sum + t.amount, 0),
    deposits: transactions.filter(t => t.type === 'deposit').reduce((sum, t) => sum + t.amount, 0),
    payouts: transactions.filter(t => t.type === 'payout').reduce((sum, t) => sum + t.amount, 0),
    purchases: transactions.filter(t => t.type === 'purchase').reduce((sum, t) => sum + t.amount, 0),
    pending: transactions.filter(t => t.status === 'pending').length,
  };

  const filteredTransactions = transactions.filter(tx => {
    const matchesSearch = tx.user.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || tx.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Transactions
        </h1>
        <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          View and manage all platform transactions
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className={`rounded-xl p-4 ${darkMode ? 'bg-gray-800' : 'bg-white shadow-lg'}`}>
          <div className="flex items-center justify-between mb-2">
            <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total Volume</span>
            <Icon icon={Icons.Dollar} size={18} className="text-orange-500" />
          </div>
          <p className={`text-2xl font-bold text-orange-500`}>${stats.totalAmount.toFixed(2)}</p>
        </div>
        <div className={`rounded-xl p-4 ${darkMode ? 'bg-gray-800' : 'bg-white shadow-lg'}`}>
          <div className="flex items-center justify-between mb-2">
            <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Deposits</span>
            <Icon icon={Icons.Download} size={18} className="text-green-500" />
          </div>
          <p className={`text-2xl font-bold text-green-500`}>${stats.deposits.toFixed(2)}</p>
        </div>
        <div className={`rounded-xl p-4 ${darkMode ? 'bg-gray-800' : 'bg-white shadow-lg'}`}>
          <div className="flex items-center justify-between mb-2">
            <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Payouts</span>
            <Icon icon={Icons.Upload} size={18} className="text-red-500" />
          </div>
          <p className={`text-2xl font-bold text-red-500`}>${stats.payouts.toFixed(2)}</p>
        </div>
        <div className={`rounded-xl p-4 ${darkMode ? 'bg-gray-800' : 'bg-white shadow-lg'}`}>
          <div className="flex items-center justify-between mb-2">
            <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Purchases</span>
            <Icon icon={Icons.ShoppingCart} size={18} className="text-blue-500" />
          </div>
          <p className={`text-2xl font-bold text-blue-500`}>${stats.purchases.toFixed(2)}</p>
        </div>
        <div className={`rounded-xl p-4 ${darkMode ? 'bg-gray-800' : 'bg-white shadow-lg'}`}>
          <div className="flex items-center justify-between mb-2">
            <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Pending</span>
            <Icon icon={Icons.Clock} size={18} className="text-yellow-500" />
          </div>
          <p className={`text-2xl font-bold text-yellow-500`}>{stats.pending}</p>
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
            placeholder="Search by user..."
            className={`w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:border-orange-500 ${
              darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'
            }`}
          />
        </div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className={`px-4 py-2 rounded-lg border focus:outline-none focus:border-orange-500 ${
            darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'
          }`}
        >
          <option value="all">All Types</option>
          <option value="deposit">Deposits</option>
          <option value="payout">Payouts</option>
          <option value="purchase">Purchases</option>
        </select>
      </div>

      {/* Transactions Table */}
      <div className={`rounded-xl overflow-hidden border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={darkMode ? 'bg-gray-800' : 'bg-gray-50'}>
              <tr className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <th className="text-left px-6 py-4 font-medium">ID</th>
                <th className="text-left px-6 py-4 font-medium">User</th>
                <th className="text-left px-6 py-4 font-medium">Type</th>
                <th className="text-left px-6 py-4 font-medium">Amount</th>
                <th className="text-left px-6 py-4 font-medium">Method</th>
                <th className="text-left px-6 py-4 font-medium">Status</th>
                <th className="text-left px-6 py-4 font-medium">Date</th>
                <th className="text-left px-6 py-4 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((tx) => (
                <tr key={tx.id} className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                  <td className={`px-6 py-4 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>#{tx.id}</td>
                  <td className={`px-6 py-4 font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{tx.user}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${
                      tx.type === 'deposit' ? 'bg-green-500/10 text-green-500' :
                      tx.type === 'payout' ? 'bg-orange-500/10 text-orange-500' :
                      'bg-blue-500/10 text-blue-500'
                    }`}>
                      {tx.type === 'deposit' && <Icon icon={Icons.Download} size={12} />}
                      {tx.type === 'payout' && <Icon icon={Icons.Upload} size={12} />}
                      {tx.type === 'purchase' && <Icon icon={Icons.ShoppingCart} size={12} />}
                      {tx.type}
                    </span>
                  </td>
                  <td className={`px-6 py-4 font-medium ${
                    tx.type === 'deposit' ? 'text-green-500' : 
                    tx.type === 'payout' ? 'text-orange-500' : 'text-blue-500'
                  }`}>
                    {tx.type === 'deposit' ? '+' : '-'}${tx.amount.toFixed(2)}
                  </td>
                  <td className={`px-6 py-4 text-sm capitalize ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{tx.method}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${
                      tx.status === 'completed' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'
                    }`}>
                      {tx.status === 'completed' && <Icon icon={Icons.CheckCircle} size={12} />}
                      {tx.status === 'pending' && <Icon icon={Icons.Clock} size={12} />}
                      {tx.status}
                    </span>
                  </td>
                  <td className={`px-6 py-4 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{tx.date}</td>
                  <td className="px-6 py-4">
                    {tx.status === 'pending' && (
                      <button className="text-green-500 text-sm hover:underline">Approve</button>
                    )}
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