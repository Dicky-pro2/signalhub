// src/pages/admin/AdminTransactions.jsx
import { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import Icon from '../../components/Icon';
import { Icons } from '../../components/Icons';

export default function AdminTransactions() {
  const { darkMode } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const [transactions, setTransactions] = useState([
    { id: 1, user: 'Marcus T.', type: 'deposit', amount: 50.00, status: 'completed', date: '2024-01-15', method: 'card' },
    { id: 2, user: 'CryptoKing', type: 'payout', amount: 342.50, status: 'pending', date: '2024-01-15', method: 'bank' },
    { id: 3, user: 'Sarah K.', type: 'purchase', amount: 4.99, status: 'completed', date: '2024-01-14', method: 'wallet' },
    { id: 4, user: 'AIInvestor', type: 'payout', amount: 210.00, status: 'completed', date: '2024-01-14', method: 'crypto' },
    { id: 5, user: 'John D.', type: 'deposit', amount: 100.00, status: 'completed', date: '2024-01-13', method: 'crypto' },
    { id: 6, user: 'LondonTrader', type: 'payout', amount: 89.50, status: 'pending', date: '2024-01-13', method: 'bank' },
  ]);

  const stats = {
    total: transactions.length,
    totalAmount: transactions.reduce((sum, t) => sum + t.amount, 0),
    deposits: transactions.filter(t => t.type === 'deposit').reduce((sum, t) => sum + t.amount, 0),
    payouts: transactions.filter(t => t.type === 'payout').reduce((sum, t) => sum + t.amount, 0),
    purchases: transactions.filter(t => t.type === 'purchase').reduce((sum, t) => sum + t.amount, 0),
    pending: transactions.filter(t => t.status === 'pending').length,
  };

  const filteredTransactions = transactions.filter(tx => {
    const matchesSearch = tx.user.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || tx.type === filterType;
    const matchesStatus = filterStatus === 'all' || tx.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const updateTransactionStatus = (id, newStatus) => {
    setTransactions(transactions.map(tx => 
      tx.id === id ? { ...tx, status: newStatus } : tx
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className={`text-xl font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Transactions
        </h1>
        <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          View and manage all platform transactions
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className={`border rounded-md p-3 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total</p>
          <p className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>${stats.totalAmount.toFixed(2)}</p>
        </div>
        <div className={`border rounded-md p-3 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Deposits</p>
          <p className={`text-xl font-semibold text-green-500`}>${stats.deposits.toFixed(2)}</p>
        </div>
        <div className={`border rounded-md p-3 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Payouts</p>
          <p className={`text-xl font-semibold text-red-500`}>${stats.payouts.toFixed(2)}</p>
        </div>
        <div className={`border rounded-md p-3 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Purchases</p>
          <p className={`text-xl font-semibold text-blue-500`}>${stats.purchases.toFixed(2)}</p>
        </div>
        <div className={`border rounded-md p-3 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Platform Fee</p>
          <p className={`text-xl font-semibold text-orange-500`}>${(stats.totalAmount * 0.2).toFixed(2)}</p>
        </div>
        <div className={`border rounded-md p-3 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Pending</p>
          <p className={`text-xl font-semibold text-yellow-500`}>{stats.pending}</p>
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
            placeholder="Search by user..."
            className={`w-full pl-9 pr-3 py-1.5 text-sm border rounded-md focus:outline-none focus:border-orange-500 ${
              darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'
            }`}
          />
        </div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className={`px-3 py-1.5 text-sm border rounded-md focus:outline-none focus:border-orange-500 ${
            darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'
          }`}
        >
          <option value="all">All types</option>
          <option value="deposit">Deposits</option>
          <option value="payout">Payouts</option>
          <option value="purchase">Purchases</option>
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className={`px-3 py-1.5 text-sm border rounded-md focus:outline-none focus:border-orange-500 ${
            darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'
          }`}
        >
          <option value="all">All status</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
        </select>
      </div>

      {/* Transactions Table */}
      <div className={`border rounded-md overflow-hidden ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className={darkMode ? 'bg-gray-800' : 'bg-gray-50'}>
              <tr className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <th className="text-left px-4 py-3 font-medium">ID</th>
                <th className="text-left px-4 py-3 font-medium">User</th>
                <th className="text-left px-4 py-3 font-medium">Type</th>
                <th className="text-left px-4 py-3 font-medium">Amount</th>
                <th className="text-left px-4 py-3 font-medium">Method</th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
                <th className="text-left px-4 py-3 font-medium">Date</th>
                <th className="text-left px-4 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((tx) => (
                <tr key={tx.id} className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                  <td className={`px-4 py-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>#{tx.id}</td>
                  <td className={`px-4 py-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{tx.user}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      tx.type === 'deposit' ? 'bg-green-500/10 text-green-500' :
                      tx.type === 'payout' ? 'bg-orange-500/10 text-orange-500' :
                      'bg-blue-500/10 text-blue-500'
                    }`}>
                      {tx.type}
                    </span>
                  </td>
                  <td className={`px-4 py-3 font-medium ${
                    tx.type === 'deposit' ? 'text-green-500' : 
                    tx.type === 'payout' ? 'text-orange-500' : 'text-blue-500'
                  }`}>
                    {tx.type === 'deposit' ? '+' : '-'}${tx.amount.toFixed(2)}
                  </td>
                  <td className={`px-4 py-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'} capitalize`}>{tx.method}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      tx.status === 'completed' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'
                    }`}>
                      {tx.status}
                    </span>
                  </td>
                  <td className={`px-4 py-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{tx.date}</td>
                  <td className="px-4 py-3">
                    {tx.status === 'pending' && (
                      <button
                        onClick={() => updateTransactionStatus(tx.id, 'completed')}
                        className="text-green-500 text-xs hover:underline"
                      >
                        Approve
                      </button>
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