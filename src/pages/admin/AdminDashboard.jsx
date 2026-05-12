import { useState, useEffect } from "react";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../config/supabase";
import Icon from "../../components/Icon";
import { Icons } from "../../components/Icons";

export default function AdminDashboard() {
  const { darkMode } = useTheme();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProviders: 0,
    pendingProviders: 0,
    totalSignals: 0,
    activeSignals: 0,
    totalVolume: 0,
    platformFees: 0,
    totalPayouts: 0,
  });
  const [pendingProvidersList, setPendingProvidersList] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [flaggedSignals, setFlaggedSignals] = useState([]);
  const [weeklyData, setWeeklyData] = useState([0, 0, 0, 0, 0, 0, 0]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch all profiles
      const { data: profiles } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      // Fetch all signals
      const { data: signals } = await supabase
        .from('signals')
        .select('*, profiles!provider_id(full_name, email)')
        .order('created_at', { ascending: false });

      // Fetch all transactions
      const { data: transactions } = await supabase
        .from('transactions')
        .select('*, profiles!user_id(full_name, email)')
        .order('created_at', { ascending: false });

      // Fetch all withdrawals
      const { data: withdrawals } = await supabase
        .from('withdrawals')
        .select('*, profiles!provider_id(full_name, email)')
        .order('created_at', { ascending: false });

      const totalUsers = profiles?.filter(p => p.role === 'customer').length || 0;
      const totalProviders = profiles?.filter(p => p.role === 'provider').length || 0;
      const pendingProviders = profiles?.filter(p => p.role === 'provider' && !p.is_verified).length || 0;
      const totalSignals = signals?.length || 0;
      const activeSignals = signals?.filter(s => s.status === 'active').length || 0;

      const totalVolume = transactions
        ?.filter(t => t.status === 'success')
        .reduce((sum, t) => sum + (t.amount || 0), 0) || 0;

      const platformFees = totalVolume * 0.1;

      const totalPayouts = withdrawals
        ?.filter(w => w.status === 'approved')
        .reduce((sum, w) => sum + (w.amount || 0), 0) || 0;

      // Weekly revenue data
      const now = new Date();
      const weekly = Array.from({ length: 7 }, (_, i) => {
        const day = new Date(now);
        day.setDate(now.getDate() - (6 - i));
        const dayStart = new Date(day.setHours(0, 0, 0, 0));
        const dayEnd = new Date(day.setHours(23, 59, 59, 999));
        return transactions
          ?.filter(t => {
            const d = new Date(t.created_at);
            return d >= dayStart && d <= dayEnd && t.status === 'success';
          })
          .reduce((sum, t) => sum + (t.amount || 0), 0) || 0;
      });

      setWeeklyData(weekly);
      setStats({ totalUsers, totalProviders, pendingProviders, totalSignals, activeSignals, totalVolume, platformFees, totalPayouts });
      setPendingProvidersList(profiles?.filter(p => p.role === 'provider' && !p.is_verified) || []);
      setRecentTransactions(transactions?.slice(0, 10) || []);
      setAllUsers(profiles || []);
      setFlaggedSignals(signals?.filter(s => s.status === 'flagged') || []);
    } catch (err) {
      console.error('Admin dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  const approveProvider = async (id) => {
    try {
      await supabase
        .from('profiles')
        .update({ is_verified: true })
        .eq('id', id);

      await supabase.from('notifications').insert({
        user_id: id,
        title: 'Provider Application Approved!',
        message: 'Congratulations! Your provider application has been approved. You can now create and sell signals.',
        type: 'success',
      });

      setPendingProvidersList(pendingProvidersList.filter(p => p.id !== id));
      setStats(prev => ({
        ...prev,
        pendingProviders: prev.pendingProviders - 1,
      }));
    } catch (err) {
      console.error('Approve error:', err);
    }
  };

  const rejectProvider = async (id) => {
    try {
      await supabase
        .from('profiles')
        .update({ role: 'customer' })
        .eq('id', id);

      await supabase.from('notifications').insert({
        user_id: id,
        title: 'Provider Application Rejected',
        message: 'Unfortunately your provider application was not approved at this time.',
        type: 'info',
      });

      setPendingProvidersList(pendingProvidersList.filter(p => p.id !== id));
      setStats(prev => ({ ...prev, pendingProviders: prev.pendingProviders - 1 }));
    } catch (err) {
      console.error('Reject error:', err);
    }
  };

  const removeSignal = async (id) => {
    try {
      await supabase.from('signals').update({ status: 'removed' }).eq('id', id);
      setFlaggedSignals(flaggedSignals.filter(s => s.id !== id));
    } catch (err) {
      console.error('Remove signal error:', err);
    }
  };

  const updateUserStatus = async (id, status) => {
    try {
      await supabase.from('profiles').update({ status }).eq('id', id);
      setAllUsers(allUsers.map(u => u.id === id ? { ...u, status } : u));
    } catch (err) {
      console.error('Update user error:', err);
    }
  };

  const approveWithdrawal = async (id, providerId, amount) => {
    try {
      await supabase.from('withdrawals').update({ status: 'approved' }).eq('id', id);
      await supabase.from('wallets')
        .update({ total_withdrawn: supabase.raw(`total_withdrawn + ${amount}`) })
        .eq('user_id', providerId);
      await supabase.from('notifications').insert({
        user_id: providerId,
        title: 'Withdrawal Approved',
        message: `Your withdrawal of $${amount} has been approved and is being processed.`,
        type: 'success',
      });
      fetchDashboardData();
    } catch (err) {
      console.error('Approve withdrawal error:', err);
    }
  };

  const maxValue = Math.max(...weeklyData, 1);

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
        <h1 className={`text-2xl font-bold flex items-center gap-2 ${text}`}>
          <Icon icon={Icons.Dashboard} size={24} />
          Admin Dashboard
        </h1>
        <p className={subtext}>
          Welcome back, {user?.user_metadata?.full_name || 'Admin'}! Here's your platform overview
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className={card}>
          <div className="flex items-center justify-between mb-2">
            <span className={`text-sm ${subtext}`}>Total Users</span>
            <Icon icon={Icons.Users} size={20} color="#3b82f6" />
          </div>
          <p className={`text-2xl font-bold ${text}`}>{stats.totalUsers.toLocaleString()}</p>
          <p className={`text-xs ${subtext} mt-1`}>Customers on platform</p>
        </div>

        <div className={card}>
          <div className="flex items-center justify-between mb-2">
            <span className={`text-sm ${subtext}`}>Providers</span>
            <Icon icon={Icons.Verified} size={20} color="#f97316" />
          </div>
          <p className={`text-2xl font-bold ${text}`}>{stats.totalProviders}</p>
          <p className={`text-xs ${subtext} mt-1`}>{stats.pendingProviders} pending approval</p>
        </div>

        <div className={card}>
          <div className="flex items-center justify-between mb-2">
            <span className={`text-sm ${subtext}`}>Total Volume</span>
            <Icon icon={Icons.Money} size={20} color="#22c55e" />
          </div>
          <p className={`text-2xl font-bold ${text}`}>${stats.totalVolume.toFixed(2)}</p>
          <p className={`text-xs text-green-500 mt-1`}>All time transactions</p>
        </div>

        <div className={card}>
          <div className="flex items-center justify-between mb-2">
            <span className={`text-sm ${subtext}`}>Platform Fees</span>
            <Icon icon={Icons.Payment} size={20} color="#f97316" />
          </div>
          <p className="text-2xl font-bold text-orange-500">${stats.platformFees.toFixed(2)}</p>
          <p className={`text-xs ${subtext} mt-1`}>From {stats.totalSignals} signals</p>
        </div>
      </div>

      {/* Tabs */}
      <div className={`flex flex-wrap gap-2 border-b pb-2 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        {[
          { id: 'overview', label: 'Overview', icon: Icons.Dashboard },
          { id: 'providers', label: 'Providers', icon: Icons.Verified },
          { id: 'signals', label: 'Signals', icon: Icons.Chart },
          { id: 'users', label: 'Users', icon: Icons.Users },
          { id: 'transactions', label: 'Transactions', icon: Icons.Payment },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
              activeTab === tab.id
                ? 'bg-orange-500 text-white'
                : darkMode
                ? 'text-gray-400 hover:text-white hover:bg-gray-800'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
            }`}
          >
            <Icon icon={tab.icon} size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Revenue Chart */}
          <div className={`rounded-xl p-6 ${darkMode ? 'bg-gray-800' : 'bg-white shadow-lg'}`}>
            <h2 className={`text-lg font-bold mb-4 ${text}`}>Weekly Revenue</h2>
            <div className="h-48 flex items-end gap-2">
              {weeklyData.map((value, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                  <div
                    className="w-full bg-gradient-to-t from-orange-500 to-red-500 rounded-t transition-all duration-500"
                    style={{ height: `${Math.max((value / maxValue) * 180, value > 0 ? 4 : 0)}px` }}
                  />
                  <span className={`text-xs ${subtext}`}>
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][idx]}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 text-center">
              <p className={`text-sm ${subtext}`}>
                Total this week:{' '}
                <span className="text-orange-500 font-bold">
                  ${weeklyData.reduce((a, b) => a + b, 0).toFixed(2)}
                </span>
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className={`${card} text-center`}>
              <Icon icon={Icons.UserPlus} size={32} color="#f97316" className="mx-auto mb-2" />
              <h3 className={`font-semibold ${text}`}>Pending Approvals</h3>
              <p className="text-2xl font-bold text-orange-500 my-2">{stats.pendingProviders}</p>
              <button onClick={() => setActiveTab('providers')} className="text-sm text-orange-500 hover:underline">
                Review Now →
              </button>
            </div>
            <div className={`${card} text-center`}>
              <Icon icon={Icons.Warning} size={32} color="#eab308" className="mx-auto mb-2" />
              <h3 className={`font-semibold ${text}`}>Flagged Signals</h3>
              <p className="text-2xl font-bold text-yellow-500 my-2">{flaggedSignals.length}</p>
              <button onClick={() => setActiveTab('signals')} className="text-sm text-orange-500 hover:underline">
                Review Now →
              </button>
            </div>
            <div className={`${card} text-center`}>
              <Icon icon={Icons.Withdraw} size={32} color="#22c55e" className="mx-auto mb-2" />
              <h3 className={`font-semibold ${text}`}>Pending Payouts</h3>
              <p className="text-2xl font-bold text-green-500 my-2">${stats.totalPayouts.toFixed(2)}</p>
              <button onClick={() => setActiveTab('transactions')} className="text-sm text-orange-500 hover:underline">
                Process →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Providers Tab */}
      {activeTab === 'providers' && (
        <div className={`rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white shadow-lg'} p-6`}>
          <h2 className={`text-lg font-bold mb-4 ${text}`}>Pending Provider Applications</h2>

          {pendingProvidersList.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-4xl mb-3">✅</p>
              <p className={subtext}>No pending applications</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingProvidersList.map((provider) => (
                <div key={provider.id} className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <div className="flex flex-wrap justify-between items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {provider.full_name?.charAt(0) || 'P'}
                        </div>
                        <div>
                          <h3 className={`font-semibold ${text}`}>{provider.full_name}</h3>
                          <p className={`text-xs ${subtext}`}>{provider.email}</p>
                        </div>
                      </div>
                      <p className={`text-sm mt-2 ${subtext}`}>
                        {provider.bio || 'No bio provided'}
                      </p>
                      <p className={`text-xs ${subtext} mt-1`}>
                        Joined: {new Date(provider.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => approveProvider(provider.id)}
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-1.5 rounded-lg transition text-sm flex items-center gap-1"
                      >
                        <Icon icon={Icons.Success} size={14} />
                        Approve
                      </button>
                      <button
                        onClick={() => rejectProvider(provider.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-lg transition text-sm flex items-center gap-1"
                      >
                        <Icon icon={Icons.Delete} size={14} />
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Signals Tab */}
      {activeTab === 'signals' && (
        <div className={`rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white shadow-lg'} p-6`}>
          <h2 className={`text-lg font-bold mb-4 ${text}`}>⚠️ Flagged Signals</h2>

          {flaggedSignals.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-4xl mb-3">✅</p>
              <p className={subtext}>No flagged signals</p>
            </div>
          ) : (
            <div className="space-y-4">
              {flaggedSignals.map((signal) => (
                <div key={signal.id} className={`p-4 rounded-lg border ${darkMode ? 'border-red-500/30 bg-red-500/10' : 'border-red-200 bg-red-50'}`}>
                  <div className="flex flex-wrap justify-between items-start gap-4">
                    <div>
                      <h3 className={`font-semibold ${text}`}>
                        {signal.asset} — {signal.profiles?.full_name}
                      </h3>
                      <p className={`text-sm ${subtext}`}>Price: ${signal.price}</p>
                      <p className={`text-xs ${subtext} mt-1`}>
                        {new Date(signal.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => removeSignal(signal.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg transition text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className={`rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white shadow-lg'} overflow-hidden`}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={darkMode ? 'bg-gray-700' : 'bg-gray-50'}>
                <tr className={subtext}>
                  <th className="text-left px-4 py-3">User</th>
                  <th className="text-left px-4 py-3">Role</th>
                  <th className="text-left px-4 py-3">Status</th>
                  <th className="text-left px-4 py-3">Joined</th>
                  <th className="text-left px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {allUsers.map((u) => (
                  <tr key={u.id} className={`border-b ${darkMode ? 'border-gray-700/50' : 'border-gray-100'}`}>
                    <td className="px-4 py-3">
                      <div>
                        <p className={`font-medium ${text}`}>{u.full_name}</p>
                        <p className={`text-xs ${subtext}`}>{u.email}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        u.role === 'provider'
                          ? 'bg-orange-500/20 text-orange-500'
                          : u.role === 'admin'
                          ? 'bg-purple-500/20 text-purple-500'
                          : 'bg-blue-500/20 text-blue-500'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        u.status === 'active' || !u.status
                          ? 'bg-green-500/20 text-green-500'
                          : 'bg-red-500/20 text-red-500'
                      }`}>
                        {u.status || 'active'}
                      </span>
                    </td>
                    <td className={`px-4 py-3 text-sm ${subtext}`}>
                      {new Date(u.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => updateUserStatus(u.id, u.status === 'suspended' ? 'active' : 'suspended')}
                          className={`text-xs px-2 py-1 rounded transition ${
                            u.status === 'suspended'
                              ? 'text-green-500 hover:bg-green-500/10'
                              : 'text-red-500 hover:bg-red-500/10'
                          }`}
                        >
                          {u.status === 'suspended' ? 'Activate' : 'Suspend'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Transactions Tab */}
      {activeTab === 'transactions' && (
        <div className={`rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white shadow-lg'} overflow-hidden`}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={darkMode ? 'bg-gray-700' : 'bg-gray-50'}>
                <tr className={subtext}>
                  <th className="text-left px-4 py-3">User</th>
                  <th className="text-left px-4 py-3">Type</th>
                  <th className="text-left px-4 py-3">Amount</th>
                  <th className="text-left px-4 py-3">Status</th>
                  <th className="text-left px-4 py-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.map((tx) => (
                  <tr key={tx.id} className={`border-b ${darkMode ? 'border-gray-700/50' : 'border-gray-100'}`}>
                    <td className={`px-4 py-3 font-medium ${text}`}>
                      {tx.profiles?.full_name || 'Unknown'}
                    </td>
                    <td className={`px-4 py-3 capitalize ${subtext}`}>{tx.type}</td>
                    <td className={`px-4 py-3 font-semibold ${
                      tx.type === 'deposit' ? 'text-green-500'
                      : tx.type === 'withdrawal' ? 'text-red-500'
                      : 'text-orange-500'
                    }`}>
                      {tx.type === 'deposit' ? '+' : '-'}${tx.amount?.toFixed(2)}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        tx.status === 'success'
                          ? 'bg-green-500/20 text-green-500'
                          : tx.status === 'pending'
                          ? 'bg-yellow-500/20 text-yellow-500'
                          : 'bg-blue-500/20 text-blue-500'
                      }`}>
                        {tx.status}
                      </span>
                    </td>
                    <td className={`px-4 py-3 text-sm ${subtext}`}>
                      {new Date(tx.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}