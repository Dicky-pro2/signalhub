import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { supabase } from '../config/supabase';

export default function UserDashboard() {
  const { user } = useAuth();
  const { darkMode } = useTheme();
  const [stats, setStats] = useState({
    balance: 0,
    totalPurchases: 0,
    activeSignals: 0,
    totalSpent: 0,
    winRate: 0,
  });
  const [recentPurchases, setRecentPurchases] = useState([]);
  const [recommendedSignals, setRecommendedSignals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch wallet balance
      const { data: wallet } = await supabase
        .from('wallets')
        .select('balance')
        .eq('user_id', user.id)
        .single();

      // Fetch subscriptions (purchases)
      const { data: subscriptions } = await supabase
        .from('subscriptions')
        .select('*, profiles!provider_id(full_name, avatar_url)')
        .eq('customer_id', user.id)
        .order('created_at', { ascending: false });

      // Fetch total spent from transactions
      const { data: transactions } = await supabase
        .from('transactions')
        .select('amount')
        .eq('user_id', user.id)
        .eq('type', 'subscription')
        .eq('status', 'success');

      const totalSpent = transactions?.reduce((sum, t) => sum + t.amount, 0) || 0;
      const activeSignals = subscriptions?.filter(s => s.status === 'active').length || 0;

      // Fetch recent signals from subscriptions
      const { data: recentSubs } = await supabase
        .from('subscriptions')
        .select(`
          *,
          profiles!provider_id(full_name)
        `)
        .eq('customer_id', user.id)
        .order('created_at', { ascending: false })
        .limit(4);

      // Fetch recommended signals from marketplace
      const { data: signals } = await supabase
        .from('signals')
        .select('*, profiles!provider_id(full_name, avatar_url)')
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(3);

      // Fetch reviews to compute win rate
      const { data: reviews } = await supabase
        .from('reviews')
        .select('rating')
        .in('provider_id', subscriptions?.map(s => s.provider_id) || []);

      const avgRating = reviews?.length
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;
      const winRate = Math.round((avgRating / 5) * 100);

      setStats({
        balance: wallet?.balance || 0,
        totalPurchases: subscriptions?.length || 0,
        activeSignals,
        totalSpent,
        winRate,
      });

      setRecentPurchases(recentSubs || []);
      setRecommendedSignals(signals || []);
    } catch (err) {
      console.error('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const card = `rounded-xl p-4 ${darkMode ? 'bg-gray-800' : 'bg-white shadow-lg'}`;
  const text = darkMode ? 'text-white' : 'text-gray-800';
  const subtext = darkMode ? 'text-gray-400' : 'text-gray-500';

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div>
        <h1 className={`text-2xl font-bold ${text}`}>
          Welcome back, {user?.user_metadata?.full_name?.split(' ')[0] || 'Trader'}! 👋
        </h1>
        <p className={subtext}>Here's what's happening with your trading today</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className={card}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl">💰</span>
            <span className={`text-xs px-2 py-1 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-orange-100'} text-orange-500`}>
              Wallet
            </span>
          </div>
          <p className={`text-2xl font-bold ${text}`}>${stats.balance.toFixed(2)}</p>
          <p className={`text-sm ${subtext}`}>Available balance</p>
          <Link to="/dashboard/wallet" className="text-orange-500 text-sm mt-2 inline-block hover:underline">
            Add funds →
          </Link>
        </div>

        <div className={card}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl">📦</span>
            <span className={`text-xs px-2 py-1 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-orange-100'} text-orange-500`}>
              Purchases
            </span>
          </div>
          <p className={`text-2xl font-bold ${text}`}>{stats.totalPurchases}</p>
          <p className={`text-sm ${subtext}`}>Total signals bought</p>
        </div>

        <div className={card}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl">📈</span>
            <span className={`text-xs px-2 py-1 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-orange-100'} text-orange-500`}>
              Active
            </span>
          </div>
          <p className={`text-2xl font-bold ${text}`}>{stats.activeSignals}</p>
          <p className={`text-sm ${subtext}`}>Active signals</p>
        </div>

        <div className={card}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl">💸</span>
            <span className={`text-xs px-2 py-1 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-orange-100'} text-orange-500`}>
              Spent
            </span>
          </div>
          <p className={`text-2xl font-bold ${text}`}>${stats.totalSpent.toFixed(2)}</p>
          <p className={`text-sm ${subtext}`}>Total spent</p>
        </div>

        <div className={card}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl">🎯</span>
            <span className={`text-xs px-2 py-1 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-orange-100'} text-orange-500`}>
              Win Rate
            </span>
          </div>
          <p className={`text-2xl font-bold ${text}`}>{stats.winRate}%</p>
          <p className={`text-sm ${subtext}`}>Your trading success</p>
        </div>
      </div>

      {/* Recent Purchases */}
      <div className={`rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white shadow-lg'} p-6`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className={`text-xl font-bold ${text}`}>Recent Purchases</h2>
          <Link to="/dashboard/purchases" className="text-orange-500 text-sm hover:underline">
            View all →
          </Link>
        </div>

        {recentPurchases.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-4xl mb-3">📭</p>
            <p className={subtext}>No purchases yet</p>
            <Link to="/marketplace" className="text-orange-500 text-sm hover:underline mt-2 inline-block">
              Browse marketplace →
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={subtext}>
                <tr className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <th className="text-left py-2">Provider</th>
                  <th className="text-left py-2">Amount</th>
                  <th className="text-left py-2">Date</th>
                  <th className="text-left py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentPurchases.map((purchase) => (
                  <tr key={purchase.id} className={`border-b ${darkMode ? 'border-gray-700/50' : 'border-gray-100'}`}>
                    <td className={`py-3 font-medium ${text}`}>
                      {purchase.profiles?.full_name || 'Unknown Provider'}
                    </td>
                    <td className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                      ${purchase.amount?.toFixed(2)}
                    </td>
                    <td className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                      {new Date(purchase.created_at).toLocaleDateString()}
                    </td>
                    <td>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        purchase.status === 'active'
                          ? 'bg-green-500/20 text-green-500'
                          : 'bg-gray-500/20 text-gray-400'
                      }`}>
                        {purchase.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Recommended Signals */}
      <div>
        <h2 className={`text-xl font-bold mb-4 ${text}`}>🔥 Recommended For You</h2>
        {recommendedSignals.length === 0 ? (
          <div className={`rounded-xl p-8 text-center ${darkMode ? 'bg-gray-800' : 'bg-white shadow-lg'}`}>
            <p className="text-4xl mb-3">📡</p>
            <p className={subtext}>No signals available yet</p>
            <Link to="/marketplace" className="text-orange-500 text-sm hover:underline mt-2 inline-block">
              Browse marketplace →
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-4">
            {recommendedSignals.map((signal) => (
              <div key={signal.id} className={`rounded-xl p-4 ${darkMode ? 'bg-gray-800' : 'bg-white shadow-lg'}`}>
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className={`font-bold text-lg ${text}`}>{signal.asset}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      signal.signal_type === 'buy'
                        ? 'bg-green-500/20 text-green-500'
                        : 'bg-red-500/20 text-red-500'
                    }`}>
                      {signal.signal_type?.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-orange-500 font-bold">
                      {signal.is_free ? 'Free' : `$${signal.price}`}
                    </p>
                    <p className={`text-xs ${subtext}`}>per signal</p>
                  </div>
                </div>

                <div className="flex justify-between items-center text-sm mb-3">
                  <span className={subtext}>
                    {signal.profiles?.full_name || 'Unknown'}
                  </span>
                  <span className={`text-xs ${subtext}`}>{signal.timeframe}</span>
                </div>

                <Link
                  to="/marketplace"
                  className="w-full block text-center bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg transition text-sm"
                >
                  View Signal
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}