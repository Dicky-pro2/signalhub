import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { supabase } from '../config/supabase';
import Icon from '../components/Icon';
import Icons from '../components/Icons';

export default function ProviderSignals() {
  const { user } = useAuth();
  const { darkMode } = useTheme();
  const [signals, setSignals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [purchaseCount, setPurchaseCount] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);

  useEffect(() => {
    if (!user) return;
    fetchSignals();
  }, [user]);

  const fetchSignals = async () => {
    setLoading(true);
    setError('');
    try {
      // Fetch signals
      const { data: signalData, error: signalError } = await supabase
        .from('signals')
        .select('*')
        .eq('provider_id', user.id)
        .order('created_at', { ascending: false });

      if (signalError) throw signalError;

      // Fetch subscriptions count for this provider
      const { data: subs, error: subsError } = await supabase
        .from('subscriptions')
        .select('id, amount')
        .eq('provider_id', user.id);

      if (subsError) throw subsError;

      const count = subs?.length || 0;
      const revenue = subs?.reduce((sum, s) => sum + (s.amount * 0.9), 0) || 0;

      setPurchaseCount(count);
      setTotalRevenue(revenue);
      setSignals(signalData || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch signals');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this signal?')) return;
    try {
      const { error } = await supabase
        .from('signals')
        .delete()
        .eq('id', id)
        .eq('provider_id', user.id);

      if (error) throw error;
      setSignals(signals.filter(s => s.id !== id));
    } catch (err) {
      setError(err.message || 'Failed to delete signal');
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'closed' : 'active';
    try {
      const { error } = await supabase
        .from('signals')
        .update({ status: newStatus })
        .eq('id', id)
        .eq('provider_id', user.id);

      if (error) throw error;
      setSignals(signals.map(s =>
        s.id === id ? { ...s, status: newStatus } : s
      ));
    } catch (err) {
      setError(err.message || 'Failed to update signal');
    }
  };

  const text = darkMode ? 'text-white' : 'text-gray-800';
  const subtext = darkMode ? 'text-gray-400' : 'text-gray-500';
  const card = `rounded-xl p-4 ${darkMode ? 'bg-gray-800' : 'bg-white shadow-lg'}`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className={`text-2xl font-bold ${text}`}>My Signals</h1>
          <p className={subtext}>Manage your published signals</p>
        </div>
        <Link
          to="/provider/create-signal"
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition flex items-center gap-2"
        >
          ✏️ Create New Signal
        </Link>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className={card}>
          <p className={`text-sm ${subtext}`}>Total Signals</p>
          <p className={`text-2xl font-bold ${text}`}>{signals.length}</p>
        </div>
        <div className={card}>
          <p className={`text-sm ${subtext}`}>Active Signals</p>
          <p className="text-2xl font-bold text-green-500">
            {signals.filter(s => s.status === 'active').length}
          </p>
        </div>
        <div className={card}>
          <p className={`text-sm ${subtext}`}>Total Purchases</p>
          <p className={`text-2xl font-bold ${text}`}>{purchaseCount}</p>
        </div>
        <div className={card}>
          <p className={`text-sm ${subtext}`}>Total Revenue</p>
          <p className="text-2xl font-bold text-orange-500">
            <Icon icon={Icons.Dollar} className="inline" color="orange" />
            {totalRevenue.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Signals Table */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : signals.length === 0 ? (
        <div className={`text-center py-12 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white shadow-lg'}`}>
          <div className="text-6xl mb-4">
            <Icon icon={Icons.Chart} color={darkMode ? 'gray' : 'orange'} />
          </div>
          <p className={`text-lg ${subtext}`}>You haven't created any signals yet</p>
          <Link to="/provider/create-signal" className="text-orange-500 hover:underline mt-2 inline-block">
            Create your first signal →
          </Link>
        </div>
      ) : (
        <div className={`rounded-xl overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white shadow-lg'}`}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={darkMode ? 'bg-gray-700' : 'bg-gray-50'}>
                <tr className={subtext}>
                  <th className="text-left px-4 py-3">Asset</th>
                  <th className="text-left px-4 py-3">Type</th>
                  <th className="text-left px-4 py-3">Price</th>
                  <th className="text-left px-4 py-3">Timeframe</th>
                  <th className="text-left px-4 py-3">Status</th>
                  <th className="text-left px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {signals.map((signal) => (
                  <tr
                    key={signal.id}
                    className={`border-b ${darkMode ? 'border-gray-700/50' : 'border-gray-100'}`}
                  >
                    <td className={`px-4 py-3 font-medium ${text}`}>
                      {signal.asset}
                      {signal.title && (
                        <p className={`text-xs ${subtext}`}>{signal.title}</p>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded ${
                        signal.signal_type === 'buy'
                          ? 'bg-green-500/20 text-green-500'
                          : 'bg-red-500/20 text-red-500'
                      }`}>
                        {signal.signal_type?.toUpperCase()}
                      </span>
                    </td>
                    <td className={`px-4 py-3 ${subtext}`}>
                      {signal.is_free ? 'Free' : `$${signal.price}`}
                    </td>
                    <td className={`px-4 py-3 ${subtext}`}>
                      {signal.timeframe || '—'}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleToggleStatus(signal.id, signal.status)}
                        className={`px-2 py-1 rounded text-xs transition ${
                          signal.status === 'active'
                            ? 'bg-green-500/20 text-green-500 hover:bg-green-500/30'
                            : 'bg-gray-500/20 text-gray-400 hover:bg-gray-500/30'
                        }`}
                      >
                        {signal.status}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-3">
                        <Link
                          to={`/provider/edit-signal/${signal.id}`}
                          className="text-blue-500 hover:text-blue-400 text-sm"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(signal.id)}
                          className="text-red-500 hover:text-red-400 text-sm"
                        >
                          Delete
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
    </div>
  );
}