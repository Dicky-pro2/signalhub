import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

export default function AdminDashboard() {
  const { darkMode } = useTheme();
  const [activeTab, setActiveTab] = useState('overview');

  const stats = {
    totalUsers: 1247,
    totalProviders: 48,
    pendingProviders: 7,
    totalSignals: 523,
    activeSignals: 187,
    totalVolume: 28473.50,
    platformFees: 5694.70,
    totalPayouts: 22778.80,
  };

  const pendingProvidersList = [
    { id: 1, name: 'John Smith', email: 'john@example.com', experience: '5 years forex trading', submittedAt: '2024-01-14', winRate: '76%' },
    { id: 2, name: 'Emma Wilson', email: 'emma@example.com', experience: '3 years crypto trading', submittedAt: '2024-01-14', winRate: '82%' },
    { id: 3, name: 'Michael Chen', email: 'michael@example.com', experience: '8 years stocks', submittedAt: '2024-01-13', winRate: '71%' },
  ];

  const flaggedSignals = [
    { id: 1, pair: 'DOGE/USD', provider: 'MemeMaster', price: 19.99, reports: 3, reason: 'Price too high', status: 'pending' },
    { id: 2, pair: 'SHIB/USD', provider: 'ShillKing', price: 49.99, reports: 5, reason: 'Suspicious analysis', status: 'pending' },
  ];

  const recentTransactions = [
    { id: 1, user: 'Marcus T.', type: 'deposit', amount: 50.00, status: 'completed', date: '2024-01-15' },
    { id: 2, user: 'Sarah K.', type: 'purchase', amount: 4.99, status: 'completed', date: '2024-01-15' },
    { id: 3, user: 'David L.', type: 'withdrawal', amount: 150.00, status: 'pending', date: '2024-01-14' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          Admin Dashboard
        </h1>
        <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
          Platform overview & management
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className={`rounded-xl p-4 ${darkMode ? 'bg-gray-800' : 'bg-white shadow-lg'}`}>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">👥</span>
            <span className={`text-xs px-2 py-1 rounded-full bg-blue-500/20 text-blue-500`}>
              Users
            </span>
          </div>
          <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            {stats.totalUsers}
          </p>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Total registered users
          </p>
        </div>

        <div className={`rounded-xl p-4 ${darkMode ? 'bg-gray-800' : 'bg-white shadow-lg'}`}>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">⭐</span>
            <span className={`text-xs px-2 py-1 rounded-full bg-orange-500/20 text-orange-500`}>
              Providers
            </span>
          </div>
          <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            {stats.totalProviders}
          </p>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            +{stats.pendingProviders} pending approval
          </p>
        </div>

        <div className={`rounded-xl p-4 ${darkMode ? 'bg-gray-800' : 'bg-white shadow-lg'}`}>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">📈</span>
            <span className={`text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-500`}>
              Signals
            </span>
          </div>
          <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            {stats.totalSignals}
          </p>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {stats.activeSignals} active
          </p>
        </div>

        <div className={`rounded-xl p-4 ${darkMode ? 'bg-gray-800' : 'bg-white shadow-lg'}`}>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">💰</span>
            <span className={`text-xs px-2 py-1 rounded-full bg-purple-500/20 text-purple-500`}>
              Revenue
            </span>
          </div>
          <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            ${stats.platformFees.toFixed(2)}
          </p>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Platform fees collected
          </p>
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="flex gap-2 border-b border-gray-700 pb-2">
        {['overview', 'providers', 'signals', 'transactions'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg transition capitalize ${
              activeTab === tab
                ? 'bg-orange-500 text-white'
                : darkMode
                ? 'text-gray-400 hover:text-white'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Pending Providers */}
      {activeTab === 'providers' && (
        <div className={`rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white shadow-lg'} p-6`}>
          <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            Pending Provider Applications
          </h2>
          <div className="space-y-4">
            {pendingProvidersList.map((provider) => (
              <div key={provider.id} className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      {provider.name}
                    </h3>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {provider.email}
                    </p>
                    <p className={`text-sm mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      📊 {provider.experience}
                    </p>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      🎯 Reported win rate: {provider.winRate}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded-lg transition text-sm">
                      Approve
                    </button>
                    <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-lg transition text-sm">
                      Reject
                    </button>
                  </div>
                </div>
                <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'} mt-2`}>
                  Submitted: {provider.submittedAt}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Flagged Signals */}
      {activeTab === 'signals' && (
        <div className={`rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white shadow-lg'} p-6`}>
          <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            ⚠️ Flagged Signals
          </h2>
          <div className="space-y-4">
            {flaggedSignals.map((signal) => (
              <div key={signal.id} className={`p-4 rounded-lg border ${darkMode ? 'border-red-500/30 bg-red-500/10' : 'border-red-200 bg-red-50'}`}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      {signal.pair} - {signal.provider}
                    </h3>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Price: ${signal.price} | Reports: {signal.reports}
                    </p>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Reason: {signal.reason}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-1 rounded-lg transition text-sm">
                      Review
                    </button>
                    <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-lg transition text-sm">
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Transactions */}
      {activeTab === 'transactions' && (
        <div className={`rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white shadow-lg'} p-6`}>
          <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            Recent Transactions
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-2">User</th>
                  <th className="text-left py-2">Type</th>
                  <th className="text-left py-2">Amount</th>
                  <th className="text-left py-2">Status</th>
                  <th className="text-left py-2">Date</th>
                  <th className="text-left py-2"></th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.map((tx) => (
                  <tr key={tx.id} className="border-b border-gray-700/50">
                    <td className={`py-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      {tx.user}
                    </td>
                    <td className="capitalize">{tx.type}</td>
                    <td className={tx.type === 'deposit' ? 'text-green-500' : tx.type === 'withdrawal' ? 'text-red-500' : 'text-orange-500'}>
                      {tx.type === 'deposit' ? '+' : '-'}${tx.amount.toFixed(2)}
                    </td>
                    <td>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        tx.status === 'completed' 
                          ? 'bg-green-500/20 text-green-500'
                          : 'bg-yellow-500/20 text-yellow-500'
                      }`}>
                        {tx.status}
                      </span>
                    </td>
                    <td className={darkMode ? 'text-gray-400' : 'text-gray-500'}>{tx.date}</td>
                    <td>
                      <button className="text-orange-500 text-sm hover:underline">
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-4">
        <Link to="/admin/users" className={`rounded-xl p-4 text-center transition ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white shadow-lg hover:shadow-xl'}`}>
          <div className="text-3xl mb-2">👥</div>
          <p className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Manage Users</p>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>View all registered users</p>
        </Link>
        
        <Link to="/admin/providers" className={`rounded-xl p-4 text-center transition ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white shadow-lg hover:shadow-xl'}`}>
          <div className="text-3xl mb-2">⭐</div>
          <p className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Manage Providers</p>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Approve or suspend providers</p>
        </Link>
        
        <Link to="/admin/settings" className={`rounded-xl p-4 text-center transition ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white shadow-lg hover:shadow-xl'}`}>
          <div className="text-3xl mb-2">⚙️</div>
          <p className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Platform Settings</p>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Configure fees, limits, and more</p>
        </Link>
      </div>
    </div>
  );
}