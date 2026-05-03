import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { supabase } from '../config/supabase';

export default function ProviderAnalytics() {
  const { user } = useAuth();
  const { darkMode } = useTheme();
  const [period, setPeriod] = useState('30d');
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState({
    totalSubscribers: 0,
    uniqueBuyers: 0,
    avgRating: 0,
    totalSignals: 0,
    topPerforming: [],
    chartData: [],
    winRate: 0,
  });

  useEffect(() => {
    if (!user) return;
    fetchAnalytics();
  }, [user, period]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const now = new Date();
      const daysMap = { '7d': 7, '30d': 30, '90d': 90, 'all': 3650 };
      const days = daysMap[period];
      const startDate = new Date(now);
      startDate.setDate(now.getDate() - days);

      // Fetch subscriptions in period
      const { data: subs } = await supabase
        .from('subscriptions')
        .select('*, signals(id, asset, title, price, result, signal_type)')
        .eq('provider_id', user.id)
        .gte('created_at', startDate.toISOString());

      // Fetch all signals
      const { data: signals } = await supabase
        .from('signals')
        .select('*')
        .eq('provider_id', user.id);

      // Fetch reviews
      const { data: reviews } = await supabase
        .from('reviews')
        .select('rating')
        .eq('provider_id', user.id);

      // Unique buyers
      const uniqueBuyers = new Set(subs?.map(s => s.customer_id)).size;

      // Average rating
      const avgRating = reviews?.length
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;

      // Win rate
      const closedSignals = signals?.filter(s => s.result) || [];
      const wins = closedSignals.filter(s => s.result === 'win').length;
      const winRate = closedSignals.length
        ? Math.round((wins / closedSignals.length) * 100)
        : 0;

      // Top performing signals
      const signalMap = {};
      subs?.forEach(sub => {
        const asset = sub.signals?.asset || 'Unknown';
        if (!signalMap[asset]) {
          signalMap[asset] = { asset, purchases: 0, revenue: 0 };
        }
        signalMap[asset].purchases += 1;
        signalMap[asset].revenue += (sub.amount || 0) * 0.9;
      });

      const topPerforming = Object.values(signalMap)
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);

      // Chart data — daily purchases over period
      const chartDays = Math.min(days, 30);
      const chartData = Array.from({ length: chartDays }, (_, i) => {
        const day = new Date(now);
        day.setDate(now.getDate() - (chartDays - 1 - i));
        const dayStart = new Date(day.setHours(0, 0, 0, 0));
        const dayEnd = new Date(day.setHours(23, 59, 59, 999));

        const count = subs?.filter(s => {
          const d = new Date(s.created_at);
          return d >= dayStart && d <= dayEnd;
        }).length || 0;

        return { label: i + 1, value: count };
      });

      setAnalytics({
        totalSubscribers: subs?.length || 0,
        uniqueBuyers,
        avgRating: parseFloat(avgRating.toFixed(2)),
        totalSignals: signals?.length || 0,
        topPerforming,
        chartData,
        winRate,
      });
    } catch (err) {
      console.error('Analytics error:', err);
    } finally {
      setLoading(false);
    }
  };

  const maxChartValue = Math.max(...analytics.chartData.map(d => d.value), 1);

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
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className={`text-2xl font-bold ${text}`}>Analytics</h1>
          <p className={subtext}>Deep insights into your signal performance</p>
        </div>
        <div className="flex gap-2">
          {['7d', '30d', '90d', 'all'].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1 rounded-lg text-sm transition ${
                period === p
                  ? 'bg-orange-500 text-white'
                  : darkMode
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {p === 'all' ? 'All Time' : p}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className={card}>
          <p className={`text-sm ${subtext}`}>Total Sales</p>
          <p className={`text-2xl font-bold ${text}`}>{analytics.totalSubscribers}</p>
        </div>
        <div className={card}>
          <p className={`text-sm ${subtext}`}>Unique Buyers</p>
          <p className={`text-2xl font-bold ${text}`}>{analytics.uniqueBuyers}</p>
        </div>
        <div className={card}>
          <p className={`text-sm ${subtext}`}>Win Rate</p>
          <p className="text-2xl font-bold text-green-500">{analytics.winRate}%</p>
        </div>
        <div className={card}>
          <p className={`text-sm ${subtext}`}>Avg Rating</p>
          <div className="flex items-center gap-2">
            <span className={`text-2xl font-bold ${text}`}>
              {analytics.avgRating || 'N/A'}
            </span>
            {analytics.avgRating > 0 && <span className="text-yellow-400 text-xl">★</span>}
          </div>
        </div>
      </div>

      {/* Performance Chart */}
      <div className={`rounded-xl p-6 ${darkMode ? 'bg-gray-800' : 'bg-white shadow-lg'}`}>
        <h2 className={`text-xl font-bold mb-4 ${text}`}>Daily Sales</h2>
        {analytics.chartData.every(d => d.value === 0) ? (
          <div className="h-64 flex items-center justify-center">
            <p className={subtext}>No sales data for this period yet</p>
          </div>
        ) : (
          <div className="h-64 flex items-end gap-1">
            {analytics.chartData.map((item, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full bg-orange-500 rounded-t transition-all duration-300 hover:bg-orange-600 relative group"
                  style={{
                    height: `${Math.max((item.value / maxChartValue) * 200, item.value > 0 ? 4 : 0)}px`
                  }}
                >
                  {item.value > 0 && (
                    <div className={`absolute -top-7 left-1/2 -translate-x-1/2 text-xs px-1.5 py-0.5 rounded hidden group-hover:block whitespace-nowrap z-10 ${
                      darkMode ? 'bg-gray-700 text-white' : 'bg-gray-800 text-white'
                    }`}>
                      {item.value} sales
                    </div>
                  )}
                </div>
                <span className={`text-xs ${subtext}`}>{item.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Top Performing Signals */}
      <div className={`rounded-xl p-6 ${darkMode ? 'bg-gray-800' : 'bg-white shadow-lg'}`}>
        <h2 className={`text-xl font-bold mb-4 ${text}`}>Top Performing Signals</h2>

        {analytics.topPerforming.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-4xl mb-3">📊</p>
            <p className={subtext}>No signal performance data yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={subtext}>
                <tr className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <th className="text-left py-2">Asset</th>
                  <th className="text-left py-2">Purchases</th>
                  <th className="text-left py-2">Revenue</th>
                  <th className="text-left py-2">Share</th>
                </tr>
              </thead>
              <tbody>
                {analytics.topPerforming.map((item, idx) => {
                  const totalRevenue = analytics.topPerforming.reduce((sum, s) => sum + s.revenue, 0);
                  const share = totalRevenue > 0 ? (item.revenue / totalRevenue) * 100 : 0;

                  return (
                    <tr
                      key={idx}
                      className={`border-b ${darkMode ? 'border-gray-700/50' : 'border-gray-100'}`}
                    >
                      <td className={`py-3 font-bold ${text}`}>{item.asset}</td>
                      <td className={`py-3 ${subtext}`}>{item.purchases}</td>
                      <td className="py-3 text-green-500">${item.revenue.toFixed(2)}</td>
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <div className={`w-20 rounded-full h-2 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                            <div
                              className="bg-orange-500 rounded-full h-2"
                              style={{ width: `${share}%` }}
                            />
                          </div>
                          <span className="text-orange-500 text-sm">{share.toFixed(0)}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Insights & Recommendations */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className={`rounded-xl p-6 ${darkMode ? 'bg-gray-800' : 'bg-white shadow-lg'}`}>
          <h3 className={`font-bold mb-3 ${text}`}>📈 Growth Insights</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex justify-between">
              <span className={subtext}>Total Signals Posted:</span>
              <span className="text-orange-500">{analytics.totalSignals}</span>
            </li>
            <li className="flex justify-between">
              <span className={subtext}>Avg Sales per Signal:</span>
              <span className="text-green-500">
                {analytics.totalSignals > 0
                  ? (analytics.totalSubscribers / analytics.totalSignals).toFixed(1)
                  : '0'}
              </span>
            </li>
            <li className="flex justify-between">
              <span className={subtext}>Win Rate:</span>
              <span className={analytics.winRate >= 60 ? 'text-green-500' : 'text-red-500'}>
                {analytics.winRate}%
              </span>
            </li>
            <li className="flex justify-between">
              <span className={subtext}>Avg Rating:</span>
              <span className="text-yellow-400">
                {analytics.avgRating > 0 ? `${analytics.avgRating} ★` : 'No reviews yet'}
              </span>
            </li>
          </ul>
        </div>

        <div className={`rounded-xl p-6 ${darkMode ? 'bg-gray-800' : 'bg-white shadow-lg'}`}>
          <h3 className={`font-bold mb-3 ${text}`}>🎯 Recommendations</h3>
          <ul className="space-y-2 text-sm">
            {analytics.winRate < 60 && (
              <li className="flex items-center gap-2">
                <span>⚠️</span>
                <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                  Focus on improving win rate — currently below 60%
                </span>
              </li>
            )}
            {analytics.avgRating < 4 && analytics.avgRating > 0 && (
              <li className="flex items-center gap-2">
                <span>⭐</span>
                <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                  Work on improving signal quality to boost ratings
                </span>
              </li>
            )}
            {analytics.totalSignals < 5 && (
              <li className="flex items-center gap-2">
                <span>✓</span>
                <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                  Post more signals to attract more buyers
                </span>
              </li>
            )}
            <li className="flex items-center gap-2">
              <span>✓</span>
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                Add detailed analysis to increase conversions
              </span>
            </li>
            <li className="flex items-center gap-2">
              <span>✓</span>
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                Price signals between $2.99 - $9.99 for best results
              </span>
            </li>
            <li className="flex items-center gap-2">
              <span>✓</span>
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                Post during market open hours for more visibility
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}