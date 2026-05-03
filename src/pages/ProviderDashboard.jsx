import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import Icon from "../components/Icon";
import { Icons } from "../components/Icons";
import PerformanceChart from "./PerformanceChart";
import { supabase } from "../config/supabase";

export default function ProviderDashboard() {
  const { user } = useAuth();
  const { darkMode } = useTheme();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalSignals: 0,
    activeSignals: 0,
    totalEarnings: 0,
    thisWeekEarnings: 0,
    avgRating: 0,
    winRate: 0,
    totalSubscribers: 0,
    pendingPayout: 0,
  });
  const [recentSignals, setRecentSignals] = useState([]);
  const [recentReviews, setRecentReviews] = useState([]);

  useEffect(() => {
    if (!user) return;
    fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch all provider signals
      const { data: signals } = await supabase
        .from('signals')
        .select('*')
        .eq('provider_id', user.id)
        .order('created_at', { ascending: false });

      // Fetch wallet
      const { data: wallet } = await supabase
        .from('wallets')
        .select('*')
        .eq('user_id', user.id)
        .single();

      // Fetch subscriptions (subscribers)
      const { data: subscriptions } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('provider_id', user.id);

      // Fetch this week's transactions
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      const { data: weekTransactions } = await supabase
        .from('transactions')
        .select('amount')
        .eq('user_id', user.id)
        .eq('type', 'subscription')
        .eq('status', 'success')
        .gte('created_at', oneWeekAgo.toISOString());

      const thisWeekEarnings = weekTransactions?.reduce((sum, t) => sum + t.amount, 0) || 0;

      // Fetch pending withdrawals
      const { data: pendingWithdrawals } = await supabase
        .from('withdrawals')
        .select('amount')
        .eq('provider_id', user.id)
        .eq('status', 'pending');

      const pendingPayout = pendingWithdrawals?.reduce((sum, w) => sum + w.amount, 0) || 0;

      // Fetch reviews
      const { data: reviews } = await supabase
        .from('reviews')
        .select('*, profiles!customer_id(full_name)')
        .eq('provider_id', user.id)
        .order('created_at', { ascending: false });

      const avgRating = reviews?.length
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;

      // Win rate from closed signals
      const closedSignals = signals?.filter(s => s.result) || [];
      const winningSignals = closedSignals.filter(s => s.result === 'win');
      const winRate = closedSignals.length
        ? Math.round((winningSignals.length / closedSignals.length) * 100)
        : 0;

      setStats({
        totalSignals: signals?.length || 0,
        activeSignals: signals?.filter(s => s.status === 'active').length || 0,
        totalEarnings: wallet?.total_earned || 0,
        thisWeekEarnings,
        avgRating: parseFloat(avgRating.toFixed(2)),
        winRate,
        totalSubscribers: subscriptions?.length || 0,
        pendingPayout: wallet?.balance || 0,
      });

      setRecentSignals(signals?.slice(0, 4) || []);
      setRecentReviews(reviews?.slice(0, 3) || []);
    } catch (err) {
      console.error('Provider dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  const text = darkMode ? 'text-white' : 'text-gray-800';
  const subtext = darkMode ? 'text-gray-400' : 'text-gray-500';
  const card = `rounded-xl p-4 ${darkMode ? 'bg-gray-800' : 'bg-white shadow-lg'}`;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className={`text-2xl font-bold ${text}`}>Provider Dashboard</h1>
          <p className={subtext}>
            Welcome back, {user?.user_metadata?.full_name || 'Expert Trader'}! 📈
          </p>
        </div>
        <Link
          to="/provider/create-signal"
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition flex items-center gap-2"
        >
          ✏️ Create New Signal
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className={card}>
          <div className="flex items-center gap-2 mb-2">
            <Icon icon={Icons.Chart} size={24} color="#f97316" />
            <span className="text-xs px-2 py-1 rounded-full bg-orange-500/20 text-orange-500">Signals</span>
          </div>
          <p className={`text-2xl font-bold ${text}`}>{stats.totalSignals}</p>
          <p className={`text-sm ${subtext}`}>Total signals posted</p>
        </div>

        <div className={card}>
          <div className="flex items-center gap-2 mb-2">
            <Icon icon={Icons.Dollar} size={24} color="#10b981" />
            <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-500">Earnings</span>
          </div>
          <p className={`text-2xl font-bold ${text}`}>${stats.totalEarnings.toFixed(2)}</p>
          <p className={`text-sm ${subtext}`}>+${stats.thisWeekEarnings.toFixed(2)} this week</p>
        </div>

        <div className={card}>
          <div className="flex items-center gap-2 mb-2">
            <Icon icon={Icons.Star} size={24} color="#fbbf24" />
            <span className="text-xs px-2 py-1 rounded-full bg-yellow-500/20 text-yellow-500">Rating</span>
          </div>
          <p className={`text-2xl font-bold ${text}`}>{stats.avgRating || 'N/A'}</p>
          <p className={`text-sm ${subtext}`}>Average rating (5 stars)</p>
        </div>

        <div className={card}>
          <div className="flex items-center gap-2 mb-2">
            <Icon icon={Icons.Target} size={24} color="#8b5cf6" />
            <span className="text-xs px-2 py-1 rounded-full bg-purple-500/20 text-purple-500">Win Rate</span>
          </div>
          <p className={`text-2xl font-bold ${text}`}>{stats.winRate}%</p>
          <p className={`text-sm ${subtext}`}>Last 30 days</p>
        </div>
      </div>

      <PerformanceChart />

      {/* Recent Signals */}
      <div className={`rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white shadow-lg'} p-6`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className={`text-xl font-bold ${text}`}>Recent Signals</h2>
          <Link to="/provider/signals" className="text-orange-500 text-sm hover:underline">
            Manage all →
          </Link>
        </div>

        {recentSignals.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-4xl mb-3">📡</p>
            <p className={subtext}>No signals created yet</p>
            <Link to="/provider/create-signal" className="text-orange-500 text-sm hover:underline mt-2 inline-block">
              Create your first signal →
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={subtext}>
                <tr className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <th className="text-left py-2">Asset</th>
                  <th className="text-left py-2">Type</th>
                  <th className="text-left py-2">Price</th>
                  <th className="text-left py-2">Timeframe</th>
                  <th className="text-left py-2">Status</th>
                  <th className="text-left py-2"></th>
                </tr>
              </thead>
              <tbody>
                {recentSignals.map((signal) => (
                  <tr key={signal.id} className={`border-b ${darkMode ? 'border-gray-700/50' : 'border-gray-100'}`}>
                    <td className={`py-3 font-medium ${text}`}>{signal.asset}</td>
                    <td>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        signal.signal_type === 'buy'
                          ? 'bg-green-500/20 text-green-500'
                          : 'bg-red-500/20 text-red-500'
                      }`}>
                        {signal.signal_type?.toUpperCase()}
                      </span>
                    </td>
                    <td className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                      {signal.is_free ? 'Free' : `$${signal.price}`}
                    </td>
                    <td className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                      {signal.timeframe || '—'}
                    </td>
                    <td>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        signal.status === 'active'
                          ? 'bg-green-500/20 text-green-500'
                          : 'bg-gray-500/20 text-gray-400'
                      }`}>
                        {signal.status}
                      </span>
                    </td>
                    <td>
                      <Link
                        to={`/provider/edit-signal/${signal.id}`}
                        className="text-orange-500 text-sm hover:underline"
                      >
                        Edit →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Reviews & Pending Payout */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Recent Reviews */}
        <div className={`rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white shadow-lg'} p-6`}>
          <h2 className={`text-xl font-bold mb-4 ${text}`}>Recent Reviews</h2>
          {recentReviews.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-4xl mb-3">⭐</p>
              <p className={subtext}>No reviews yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentReviews.map((review) => (
                <div key={review.id} className={`pb-3 border-b ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                  <div className="flex justify-between items-start mb-1">
                    <p className={`font-medium ${text}`}>
                      {review.profiles?.full_name || 'Anonymous'}
                    </p>
                    <div className="flex text-yellow-500">
                      {'★'.repeat(review.rating)}
                      {'☆'.repeat(5 - review.rating)}
                    </div>
                  </div>
                  <p className={`text-sm ${subtext}`}>"{review.comment}"</p>
                  <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'} mt-1`}>
                    {new Date(review.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
          <Link to="/provider/reviews" className="text-orange-500 text-sm mt-4 inline-block hover:underline">
            View all reviews →
          </Link>
        </div>

        {/* Pending Payout */}
        <div className={`rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white shadow-lg'} p-6`}>
          <h2 className={`text-xl font-bold mb-4 ${text}`}>Pending Payout</h2>
          <div className="text-center mb-6">
            <p className="text-4xl font-bold text-orange-500">
              ${stats.pendingPayout.toFixed(2)}
            </p>
            <p className={`text-sm ${subtext} mt-1`}>Available for withdrawal</p>
            <button
              type="button"
              onClick={() => navigate('/provider/withdraw')}
              className="mt-4 bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition"
            >
              Withdraw Funds →
            </button>
          </div>

          <div className={`pt-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
            <div className="flex justify-between mb-2">
              <span className={subtext}>Total Subscribers</span>
              <span className={`font-semibold ${text}`}>{stats.totalSubscribers}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className={subtext}>Active Signals</span>
              <span className={`font-semibold ${text}`}>{stats.activeSignals}</span>
            </div>
            <div className="flex justify-between">
              <span className={subtext}>Platform Fee (10%)</span>
              <span className={`font-semibold ${text}`}>
                ${(stats.totalEarnings * 0.1).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}