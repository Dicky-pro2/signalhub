import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { supabase } from '../config/supabase';

export default function ProviderEarnings() {
  const { user } = useAuth();
  const { darkMode } = useTheme();
  const [period, setPeriod] = useState('weekly');
  const [loading, setLoading] = useState(true);
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [signals, setSignals] = useState([]);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (!user) return;
    fetchEarningsData();
  }, [user, period]);

  const fetchEarningsData = async () => {
    setLoading(true);
    try {
      // Fetch wallet
      const { data: walletData } = await supabase
        .from('wallets')
        .select('*')
        .eq('user_id', user.id)
        .single();

      // Fetch subscriptions to this provider
      const { data: subs } = await supabase
        .from('subscriptions')
        .select(`
          *,
          signals(id, asset, title, price)
        `)
        .eq('provider_id', user.id)
        .order('created_at', { ascending: false });

      // Fetch all provider signals for reference
      const { data: signalData } = await supabase
        .from('signals')
        .select('*')
        .eq('provider_id', user.id);

      // Build chart data based on period
      const now = new Date();
      let labels = [];
      let days = 7;

      if (period === 'weekly') {
        labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        days = 7;
      } else if (period === 'monthly') {
        labels = Array.from({ length: 4 }, (_, i) => `Week ${i + 1}`);
        days = 28;
      } else {
        labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        days = 365;
      }

      // Calculate earnings per period
      const periodData = labels.map((label, idx) => {
        const start = new Date(now);
        const end = new Date(now);

        if (period === 'weekly') {
          start.setDate(now.getDate() - (6 - idx));
          end.setDate(now.getDate() - (5 - idx));
        } else if (period === 'monthly') {
          start.setDate(now.getDate() - (28 - idx * 7));
          end.setDate(now.getDate() - (21 - idx * 7));
        } else {
          start.setMonth(idx, 1);
          end.setMonth(idx + 1, 0);
        }

        const periodEarnings = subs
          ?.filter(s => {
            const date = new Date(s.created_at);
            return date >= start && date <= end;
          })
          .reduce((sum, s) => sum + (s.amount * 0.9), 0) || 0;

        return { label, value: periodEarnings };
      });

      setChartData(periodData);
      setWallet(walletData);
      setTransactions(subs || []);
      setSignals(signalData || []);
    } catch (err) {
      console.error('Earnings fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Compute stats
  const totalEarnings = wallet?.total_earned || 0;
  const availableBalance = wallet?.balance || 0;
  const platformFees = totalEarnings * 0.1;

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const thisMonthEarnings = transactions
    .filter(t => new Date(t.created_at) >= startOfMonth)
    .reduce((sum, t) => sum + (t.amount * 0.9), 0);

  const maxChartValue = Math.max(...chartData.map(d => d.value), 1);

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
      <div>
        <h1 className={`text-2xl font-bold ${text}`}>Earnings</h1>
        <p className={subtext}>Track your signal revenue and payouts</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className={card}>
          <p className={`text-sm ${subtext}`}>Total Earnings</p>
          <p className="text-2xl font-bold text-orange-500">${totalEarnings.toFixed(2)}</p>
        </div>
        <div className={card}>
          <p className={`text-sm ${subtext}`}>Available Balance</p>
          <p className="text-2xl font-bold text-green-500">${availableBalance.toFixed(2)}</p>
        </div>
        <div className={card}>
          <p className={`text-sm ${subtext}`}>Platform Fees (10%)</p>
          <p className={`text-2xl font-bold ${text}`}>${platformFees.toFixed(2)}</p>
        </div>
        <div className={card}>
          <p className={`text-sm ${subtext}`}>This Month</p>
          <p className={`text-2xl font-bold ${text}`}>${thisMonthEarnings.toFixed(2)}</p>
        </div>
      </div>

      {/* Withdraw Card */}
      <div className={`rounded-xl p-6 ${
        darkMode
          ? 'bg-gradient-to-r from-orange-600/20 to-red-600/20 border border-orange-500/30'
          : 'bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200'
      }`}>
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div>
            <h3 className={`font-bold text-lg ${text}`}>Available for Withdrawal</h3>
            <p className="text-3xl font-bold text-orange-500 mt-1">${availableBalance.toFixed(2)}</p>
          </div>
          <Link
            to="/provider/withdraw"
            className={`bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition ${
              availableBalance < 50 ? 'opacity-50 pointer-events-none' : ''
            }`}
          >
            Withdraw Funds
          </Link>
        </div>
        <p className={`text-xs mt-3 ${subtext}`}>
          Minimum withdrawal: $50. Withdrawals processed within 1-3 business days.
        </p>
      </div>

      {/* Earnings Chart */}
      <div className={`rounded-xl p-6 ${darkMode ? 'bg-gray-800' : 'bg-white shadow-lg'}`}>
        <div className="flex justify-between items-center mb-6">
          <h2 className={`text-xl font-bold ${text}`}>Earnings Overview</h2>
          <div className="flex gap-2">
            {['weekly', 'monthly', 'yearly'].map((p) => (
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
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {chartData.every(d => d.value === 0) ? (
          <div className="h-64 flex items-center justify-center">
            <p className={subtext}>No earnings data for this period yet</p>
          </div>
        ) : (
          <div className="h-64 flex items-end gap-2">
            {chartData.map((item, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                <p className={`text-xs ${subtext}`}>
                  {item.value > 0 ? `$${item.value.toFixed(0)}` : ''}
                </p>
                <div
                  className="w-full bg-orange-500 rounded-t transition-all duration-500 hover:bg-orange-600 relative group"
                  style={{ height: `${Math.max((item.value / maxChartValue) * 200, item.value > 0 ? 4 : 0)}px` }}
                >
                  <div className={`absolute -top-8 left-1/2 -translate-x-1/2 text-xs px-2 py-1 rounded hidden group-hover:block whitespace-nowrap z-10 ${
                    darkMode ? 'bg-gray-700 text-white' : 'bg-gray-800 text-white'
                  }`}>
                    ${item.value.toFixed(2)}
                  </div>
                </div>
                <span className={`text-xs ${subtext}`}>{item.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Earnings History Table */}
      <div className={`rounded-xl p-6 ${darkMode ? 'bg-gray-800' : 'bg-white shadow-lg'}`}>
        <h2 className={`text-xl font-bold mb-4 ${text}`}>Earnings History</h2>

        {transactions.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-4xl mb-3">📭</p>
            <p className={subtext}>No earnings yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={subtext}>
                <tr className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <th className="text-left py-2">Date</th>
                  <th className="text-left py-2">Signal</th>
                  <th className="text-left py-2">Gross</th>
                  <th className="text-left py-2">Fee (10%)</th>
                  <th className="text-left py-2">Net</th>
                  <th className="text-left py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((item) => {
                  const gross = item.amount || 0;
                  const fee = gross * 0.1;
                  const net = gross * 0.9;
                  const signalInfo = item.signals;

                  return (
                    <tr
                      key={item.id}
                      className={`border-b ${darkMode ? 'border-gray-700/50' : 'border-gray-100'}`}
                    >
                      <td className={`py-3 text-sm ${subtext}`}>
                        {new Date(item.created_at).toLocaleDateString()}
                      </td>
                      <td className={`py-3 font-medium ${text}`}>
                        {signalInfo?.asset || signalInfo?.title || 'Unknown Signal'}
                      </td>
                      <td className="py-3 text-green-500">${gross.toFixed(2)}</td>
                      <td className="py-3 text-red-500">${fee.toFixed(2)}</td>
                      <td className="py-3 font-semibold text-orange-500">${net.toFixed(2)}</td>
                      <td className="py-3">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          item.status === 'active'
                            ? 'bg-green-500/20 text-green-500'
                            : 'bg-gray-500/20 text-gray-400'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}