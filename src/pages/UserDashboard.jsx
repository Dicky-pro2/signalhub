import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function UserDashboard() {
  const { user } = useAuth();
  const { darkMode } = useTheme();
  const [stats, setStats] = useState({
    balance: 47.50,
    totalPurchases: 23,
    activeSignals: 3,
    totalSpent: 68.77,
    winRate: 74,
  });

  const recentPurchases = [
    { id: 1, pair: 'BTC/USD', provider: 'CryptoKing', amount: 4.99, date: '2024-01-15', status: 'active', pnl: '+12.4%' },
    { id: 2, pair: 'EUR/USD', provider: 'ForexMaster', amount: 2.99, date: '2024-01-14', status: 'closed', pnl: '+5.2%' },
    { id: 3, pair: 'NVDA', provider: 'AIInvestor', amount: 4.99, date: '2024-01-13', status: 'closed', pnl: '+18.7%' },
    { id: 4, pair: 'SOL/USD', provider: 'SolanaBull', amount: 3.49, date: '2024-01-12', status: 'active', pnl: '-2.1%' },
  ];

  const recommendedSignals = [
    { id: 1, pair: 'ETH/USD', market: 'crypto', price: 3.99, provider: 'EtherWhale', winRate: '79%', rating: 4.8 },
    { id: 2, pair: 'GBP/JPY', market: 'forex', price: 3.49, provider: 'LondonTrader', winRate: '82%', rating: 4.9 },
    { id: 3, pair: 'TSLA', market: 'stocks', price: 3.99, provider: 'MuskWatcher', winRate: '69%', rating: 4.2 },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div>
        <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          Welcome back, {user?.full_name?.split(' ')[0] || 'Trader'}! 👋
        </h1>
        <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
          Here's what's happening with your trading today
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className={`rounded-xl p-4 ${darkMode ? 'bg-gray-800' : 'bg-white shadow-lg'}`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl">💰</span>
            <span className={`text-xs px-2 py-1 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-orange-100'} text-orange-500`}>
              Wallet
            </span>
          </div>
          <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            ${stats.balance.toFixed(2)}
          </p>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Available balance</p>
          <Link to="/dashboard/wallet" className="text-orange-500 text-sm mt-2 inline-block hover:underline">
            Add funds →
          </Link>
        </div>

        <div className={`rounded-xl p-4 ${darkMode ? 'bg-gray-800' : 'bg-white shadow-lg'}`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl">📦</span>
            <span className={`text-xs px-2 py-1 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-orange-100'} text-orange-500`}>
              Purchases
            </span>
          </div>
          <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            {stats.totalPurchases}
          </p>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total signals bought</p>
        </div>

        <div className={`rounded-xl p-4 ${darkMode ? 'bg-gray-800' : 'bg-white shadow-lg'}`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl">📈</span>
            <span className={`text-xs px-2 py-1 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-orange-100'} text-orange-500`}>
              Active
            </span>
          </div>
          <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            {stats.activeSignals}
          </p>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Active signals</p>
        </div>

        <div className={`rounded-xl p-4 ${darkMode ? 'bg-gray-800' : 'bg-white shadow-lg'}`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl">💸</span>
            <span className={`text-xs px-2 py-1 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-orange-100'} text-orange-500`}>
              Spent
            </span>
          </div>
          <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            ${stats.totalSpent.toFixed(2)}
          </p>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total spent</p>
        </div>

        <div className={`rounded-xl p-4 ${darkMode ? 'bg-gray-800' : 'bg-white shadow-lg'}`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl">🎯</span>
            <span className={`text-xs px-2 py-1 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-orange-100'} text-orange-500`}>
              Win Rate
            </span>
          </div>
          <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            {stats.winRate}%
          </p>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Your trading success</p>
        </div>
      </div>

      {/* Recent Purchases */}
      <div className={`rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white shadow-lg'} p-6`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            Recent Purchases
          </h2>
          <Link to="/dashboard/purchases" className="text-orange-500 text-sm hover:underline">
            View all →
          </Link>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
              <tr className="border-b border-gray-700">
                <th className="text-left py-2">Pair</th>
                <th className="text-left py-2">Provider</th>
                <th className="text-left py-2">Amount</th>
                <th className="text-left py-2">Date</th>
                <th className="text-left py-2">Status</th>
                <th className="text-left py-2">P&L</th>
                <th className="text-left py-2"></th>
               </tr>
            </thead>
            <tbody>
              {recentPurchases.map((purchase) => (
                <tr key={purchase.id} className="border-b border-gray-700/50">
                  <td className={`py-3 font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    {purchase.pair}
                  </td>
                  <td className={darkMode ? 'text-gray-300' : 'text-gray-600'}>{purchase.provider}</td>
                  <td className={darkMode ? 'text-gray-300' : 'text-gray-600'}>${purchase.amount}</td>
                  <td className={darkMode ? 'text-gray-300' : 'text-gray-600'}>{purchase.date}</td>
                  <td>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      purchase.status === 'active' 
                        ? 'bg-green-500/20 text-green-500'
                        : 'bg-gray-500/20 text-gray-400'
                    }`}>
                      {purchase.status}
                    </span>
                  </td>
                  <td className={purchase.pnl.startsWith('+') ? 'text-green-500' : 'text-red-500'}>
                    {purchase.pnl}
                  </td>
                  <td>
                    <button className="text-orange-500 text-sm hover:underline">
                      View →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recommended Signals */}
      <div>
        <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          🔥 Recommended For You
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          {recommendedSignals.map((signal) => (
            <div key={signal.id} className={`rounded-xl p-4 ${darkMode ? 'bg-gray-800' : 'bg-white shadow-lg'}`}>
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    {signal.pair}
                  </p>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    signal.market === 'crypto' ? 'bg-orange-500/20 text-orange-500' :
                    signal.market === 'forex' ? 'bg-green-500/20 text-green-500' :
                    'bg-blue-500/20 text-blue-500'
                  }`}>
                    {signal.market}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-orange-500 font-bold">${signal.price}</p>
                  <p className="text-xs text-gray-500">per signal</p>
                </div>
              </div>
              
              <div className="flex justify-between items-center text-sm mb-3">
                <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
                  {signal.provider}
                </span>
                <span className="text-yellow-500">★ {signal.rating}</span>
              </div>
              
              <button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg transition">
                Buy Now
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}