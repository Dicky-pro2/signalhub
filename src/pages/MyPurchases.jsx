import { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

export default function MyPurchases() {
  const { darkMode } = useTheme();
  const { user } = useAuth();
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchPurchases();
  }, []);

  const fetchPurchases = async () => {
    // Mock data - replace with actual API call
    setTimeout(() => {
      setPurchases([
        { id: 1, pair: 'BTC/USD', market: 'crypto', provider: 'CryptoKing', amount: 4.99, date: '2024-01-15', status: 'active', pnl: '+12.4%', entry: '68,420', tp: '70,000', sl: '67,000', analysis: 'Bitcoin showing strong bullish momentum...' },
        { id: 2, pair: 'EUR/USD', market: 'forex', provider: 'ForexMaster', amount: 2.99, date: '2024-01-14', status: 'closed', pnl: '+5.2%', entry: '1.0892', tp: '1.0950', sl: '1.0850', analysis: 'EUR gaining strength...' },
        { id: 3, pair: 'NVDA', market: 'stocks', provider: 'AIInvestor', amount: 4.99, date: '2024-01-13', status: 'closed', pnl: '+18.7%', entry: '892.64', tp: '920', sl: '870', analysis: 'AI sector strength...' },
        { id: 4, pair: 'SOL/USD', market: 'crypto', provider: 'SolanaBull', amount: 3.49, date: '2024-01-12', status: 'active', pnl: '-2.1%', entry: '162.18', tp: '175', sl: '155', analysis: 'Solana showing relative strength...' },
      ]);
      setLoading(false);
    }, 500);
  };

  const filteredPurchases = filter === 'all' 
    ? purchases 
    : purchases.filter(p => p.status === filter);

  const totalSpent = purchases.reduce((sum, p) => sum + p.amount, 0);
  const avgPnl = purchases.filter(p => p.pnl).reduce((sum, p) => {
    const num = parseFloat(p.pnl);
    return sum + (isNaN(num) ? 0 : num);
  }, 0) / purchases.filter(p => p.pnl).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          My Purchases
        </h1>
        <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
          View all your signal purchase history
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className={`rounded-xl p-4 ${darkMode ? 'bg-gray-800' : 'bg-white shadow-lg'}`}>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total Spent</p>
          <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            ${totalSpent.toFixed(2)}
          </p>
        </div>
        <div className={`rounded-xl p-4 ${darkMode ? 'bg-gray-800' : 'bg-white shadow-lg'}`}>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total Purchases</p>
          <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            {purchases.length}
          </p>
        </div>
        <div className={`rounded-xl p-4 ${darkMode ? 'bg-gray-800' : 'bg-white shadow-lg'}`}>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Active Signals</p>
          <p className={`text-2xl font-bold text-green-500`}>
            {purchases.filter(p => p.status === 'active').length}
          </p>
        </div>
        <div className={`rounded-xl p-4 ${darkMode ? 'bg-gray-800' : 'bg-white shadow-lg'}`}>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Avg P&L</p>
          <p className={`text-2xl font-bold ${avgPnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {avgPnl >= 0 ? '+' : ''}{avgPnl.toFixed(1)}%
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-gray-700 pb-2">
        {['all', 'active', 'closed'].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 rounded-lg transition capitalize ${
              filter === tab
                ? 'bg-orange-500 text-white'
                : darkMode
                ? 'text-gray-400 hover:text-white'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            {tab === 'all' ? 'All' : tab === 'active' ? 'Active' : 'Closed'}
            {tab !== 'all' && (
              <span className="ml-2 text-xs">
                ({purchases.filter(p => p.status === tab).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Purchases List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : filteredPurchases.length === 0 ? (
        <div className={`text-center py-12 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white shadow-lg'}`}>
          <div className="text-6xl mb-4">📦</div>
          <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            No purchases found
          </p>
          <a href="/marketplace" className="text-orange-500 hover:underline mt-2 inline-block">
            Browse Marketplace →
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredPurchases.map((purchase) => (
            <div key={purchase.id} className={`rounded-xl p-5 ${darkMode ? 'bg-gray-800' : 'bg-white shadow-lg'}`}>
              <div className="flex flex-wrap justify-between items-start gap-4">
                {/* Left side - Signal Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      {purchase.pair}
                    </h3>
                    <span className={`text-xs px-2 py-1 rounded ${
                      purchase.market === 'crypto' ? 'bg-orange-500/20 text-orange-500' :
                      purchase.market === 'forex' ? 'bg-green-500/20 text-green-500' :
                      'bg-blue-500/20 text-blue-500'
                    }`}>
                      {purchase.market}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded ${
                      purchase.status === 'active' 
                        ? 'bg-green-500/20 text-green-500'
                        : 'bg-gray-500/20 text-gray-400'
                    }`}>
                      {purchase.status}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                    <div>
                      <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Provider</p>
                      <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        {purchase.provider}
                      </p>
                    </div>
                    <div>
                      <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Entry</p>
                      <p className={`font-mono ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        {purchase.entry}
                      </p>
                    </div>
                    <div>
                      <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>TP / SL</p>
                      <p className={`font-mono ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        {purchase.tp} / {purchase.sl}
                      </p>
                    </div>
                    <div>
                      <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>P&L</p>
                      <p className={`font-semibold ${purchase.pnl?.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                        {purchase.pnl || '—'}
                      </p>
                    </div>
                  </div>

                  {/* Full Analysis (collapsible) */}
                  <details className="mt-2">
                    <summary className={`text-sm cursor-pointer ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'}`}>
                      📋 View Full Analysis
                    </summary>
                    <div className={`mt-2 p-3 rounded-lg text-sm ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      {purchase.analysis}
                    </div>
                  </details>
                </div>

                {/* Right side - Purchase Details */}
                <div className="text-right">
                  <p className="text-orange-500 font-bold text-xl">${purchase.amount}</p>
                  <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'} mt-1`}>
                    {purchase.date}
                  </p>
                  <button className="mt-3 text-orange-500 text-sm hover:underline">
                    View Signal →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}