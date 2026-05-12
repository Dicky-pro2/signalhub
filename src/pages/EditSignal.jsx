import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { supabase } from '../config/supabase';

export default function EditSignal() {
  const { id } = useParams();
  const { user } = useAuth();
  const { darkMode } = useTheme();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    market: 'forex',
    asset: '',
    title: '',
    signal_type: 'buy',
    entry_price: '',
    target_price: '',
    stop_loss: '',
    price: '2.99',
    is_free: false,
    timeframe: '1H',
    description: '',
    status: 'active',
  });

  useEffect(() => {
    if (!user || !id) return;
    fetchSignal();
  }, [user, id]);

  const fetchSignal = async () => {
    setFetching(true);
    try {
      const { data, error } = await supabase
        .from('signals')
        .select('*')
        .eq('id', id)
        .eq('provider_id', user.id)
        .single();

      if (error) throw error;
      if (!data) throw new Error('Signal not found');

      // Detect market from asset
      const asset = data.asset?.toLowerCase();
      let market = 'forex';
      if (['btc', 'eth', 'sol', 'bnb', 'doge', 'xrp'].some(c => asset?.includes(c))) market = 'crypto';
      else if (['aapl', 'nvda', 'tsla', 'msft', 'amzn', 'googl'].some(c => asset?.includes(c))) market = 'stocks';

      setFormData({
        market,
        asset: data.asset || '',
        title: data.title || '',
        signal_type: data.signal_type || 'buy',
        entry_price: data.entry_price || '',
        target_price: data.target_price || '',
        stop_loss: data.stop_loss || '',
        price: data.price || '2.99',
        is_free: data.is_free || false,
        timeframe: data.timeframe || '1H',
        description: data.description || '',
        status: data.status || 'active',
      });
    } catch (err) {
      setError(err.message || 'Failed to load signal');
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const { error } = await supabase
        .from('signals')
        .update({
          title: formData.title || `${formData.asset} ${formData.signal_type.toUpperCase()} Signal`,
          asset: formData.asset,
          signal_type: formData.signal_type,
          entry_price: parseFloat(formData.entry_price),
          target_price: parseFloat(formData.target_price),
          stop_loss: parseFloat(formData.stop_loss),
          price: formData.is_free ? 0 : parseFloat(formData.price),
          is_free: formData.is_free,
          timeframe: formData.timeframe,
          description: formData.description,
          status: formData.status,
        })
        .eq('id', id)
        .eq('provider_id', user.id);

      if (error) throw error;

      setSuccess('Signal updated successfully!');
      setTimeout(() => navigate('/provider/signals'), 1500);
    } catch (err) {
      setError(err.message || 'Failed to update signal');
    } finally {
      setLoading(false);
    }
  };

  const markets = [
    { value: 'forex', label: '💱 Forex', pairs: ['EUR/USD', 'GBP/USD', 'USD/JPY', 'AUD/USD', 'USD/CAD', 'NZD/USD'] },
    { value: 'crypto', label: '₿ Crypto', pairs: ['BTC/USD', 'ETH/USD', 'SOL/USD', 'BNB/USD', 'DOGE/USD', 'XRP/USD'] },
    { value: 'stocks', label: '📈 Stocks', pairs: ['AAPL', 'NVDA', 'TSLA', 'MSFT', 'AMZN', 'GOOGL'] },
  ];

  const timeframes = ['1M', '5M', '15M', '30M', '1H', '4H', '1D', '1W'];
  const selectedMarket = markets.find(m => m.value === formData.market);

  const input = `w-full px-4 py-2 rounded-lg border focus:outline-none focus:border-orange-500 ${
    darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'
  }`;
  const label = `block mb-2 font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`;
  const text = darkMode ? 'text-white' : 'text-gray-800';
  const subtext = darkMode ? 'text-gray-400' : 'text-gray-500';

  if (fetching) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className={`text-2xl font-bold ${text}`}>Edit Signal</h1>
        <p className={subtext}>Update your signal details</p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-500/10 border border-green-500/50 text-green-400 px-4 py-3 rounded-lg text-sm">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className={`rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white shadow-lg'} p-6 space-y-5`}>

        {/* Signal Title */}
        <div>
          <label className={label}>Signal Title (optional)</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g., EUR/USD Bullish Breakout"
            className={input}
          />
        </div>

        {/* Market Selection */}
        <div>
          <label className={label}>Market</label>
          <div className="grid grid-cols-3 gap-3">
            {markets.map((market) => (
              <button
                key={market.value}
                type="button"
                onClick={() => setFormData({ ...formData, market: market.value, asset: '' })}
                className={`px-4 py-2 rounded-lg transition ${
                  formData.market === market.value
                    ? 'bg-orange-500 text-white'
                    : darkMode
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {market.label}
              </button>
            ))}
          </div>
        </div>

        {/* Trading Pair */}
        <div>
          <label className={label}>Trading Pair</label>
          <select
            name="asset"
            value={formData.asset}
            onChange={handleChange}
            required
            className={input}
          >
            <option value="">Select pair</option>
            {selectedMarket?.pairs.map((pair) => (
              <option key={pair} value={pair}>{pair}</option>
            ))}
          </select>
        </div>

        {/* Signal Type & Timeframe */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className={label}>Signal Type</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, signal_type: 'buy' })}
                className={`py-2 rounded-lg font-medium transition ${
                  formData.signal_type === 'buy'
                    ? 'bg-green-500 text-white'
                    : darkMode
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                📈 Buy
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, signal_type: 'sell' })}
                className={`py-2 rounded-lg font-medium transition ${
                  formData.signal_type === 'sell'
                    ? 'bg-red-500 text-white'
                    : darkMode
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                📉 Sell
              </button>
            </div>
          </div>

          <div>
            <label className={label}>Timeframe</label>
            <div className="flex flex-wrap gap-2">
              {timeframes.map((tf) => (
                <button
                  key={tf}
                  type="button"
                  onClick={() => setFormData({ ...formData, timeframe: tf })}
                  className={`px-3 py-1 rounded-lg text-sm transition ${
                    formData.timeframe === tf
                      ? 'bg-orange-500 text-white'
                      : darkMode
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Entry, TP, SL */}
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className={label}>Entry Price</label>
            <input
              type="number"
              name="entry_price"
              value={formData.entry_price}
              onChange={handleChange}
              placeholder="e.g., 1.0892"
              step="any"
              required
              className={input}
            />
          </div>
          <div>
            <label className={label}>Take Profit (TP)</label>
            <input
              type="number"
              name="target_price"
              value={formData.target_price}
              onChange={handleChange}
              placeholder="e.g., 1.0950"
              step="any"
              required
              className={input}
            />
          </div>
          <div>
            <label className={label}>Stop Loss (SL)</label>
            <input
              type="number"
              name="stop_loss"
              value={formData.stop_loss}
              onChange={handleChange}
              placeholder="e.g., 1.0850"
              step="any"
              required
              className={input}
            />
          </div>
        </div>

        {/* Signal Price */}
        <div>
          <label className={label}>Signal Price ($)</label>
          <div className="flex items-center gap-4">
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              step="0.01"
              min="0.99"
              max="49.99"
              disabled={formData.is_free}
              required={!formData.is_free}
              className={`w-40 px-4 py-2 rounded-lg border focus:outline-none focus:border-orange-500 ${
                darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'
              } disabled:opacity-40`}
            />
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="is_free"
                checked={formData.is_free}
                onChange={handleChange}
                className="w-4 h-4 accent-orange-500"
              />
              <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>Make this signal free</span>
            </label>
          </div>
        </div>

        {/* Status */}
        <div>
          <label className={label}>Status</label>
          <div className="grid grid-cols-3 gap-3">
            {['active', 'pending', 'closed'].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setFormData({ ...formData, status: s })}
                className={`py-2 rounded-lg capitalize text-sm font-medium transition ${
                  formData.status === s
                    ? s === 'active'
                      ? 'bg-green-500 text-white'
                      : s === 'pending'
                      ? 'bg-yellow-500 text-white'
                      : 'bg-gray-500 text-white'
                    : darkMode
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Full Analysis */}
        <div>
          <label className={label}>Full Analysis</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="6"
            placeholder="Provide detailed analysis..."
            required
            className={input}
          />
          <p className={`text-xs mt-1 ${subtext}`}>
            This will be revealed to customers after purchase
          </p>
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded-lg transition disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/provider/signals')}
            className={`px-6 py-2 rounded-lg transition ${
              darkMode
                ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
            }`}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}