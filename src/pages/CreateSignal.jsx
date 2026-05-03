import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { supabase } from '../config/supabase';

export default function CreateSignal() {
  const { user } = useAuth();
  const { darkMode } = useTheme();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    market: 'forex',
    pair: '',
    signal_type: 'buy',
    entry: '',
    tp: '',
    sl: '',
    timeframe: '1H',
    price: '2.99',
    is_free: false,
    analysis: '',
    title: '',
  });

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
      const { error } = await supabase.from('signals').insert({
        provider_id: user.id,
        title: formData.title || `${formData.pair} ${formData.signal_type.toUpperCase()} Signal`,
        description: formData.analysis,
        asset: formData.pair,
        signal_type: formData.signal_type,
        entry_price: parseFloat(formData.entry),
        target_price: parseFloat(formData.tp),
        stop_loss: parseFloat(formData.sl),
        price: formData.is_free ? 0 : parseFloat(formData.price),
        is_free: formData.is_free,
        timeframe: formData.timeframe,
        status: 'active',
      });

      if (error) throw error;

      setSuccess('Signal published successfully!');
      setTimeout(() => navigate('/provider/signals'), 1500);
    } catch (err) {
      setError(err.message || 'Failed to create signal');
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

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          Create New Signal
        </h1>
        <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
          Share your analysis with thousands of traders
        </p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg mb-4 text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-500/10 border border-green-500/50 text-green-400 px-4 py-3 rounded-lg mb-4 text-sm">
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
          <p className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            Leave blank to auto-generate from pair and type
          </p>
        </div>

        {/* Market Selection */}
        <div>
          <label className={label}>Market</label>
          <div className="grid grid-cols-3 gap-3">
            {markets.map((market) => (
              <button
                key={market.value}
                type="button"
                onClick={() => setFormData({ ...formData, market: market.value, pair: '' })}
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
            name="pair"
            value={formData.pair}
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
              name="entry"
              value={formData.entry}
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
              name="tp"
              value={formData.tp}
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
              name="sl"
              value={formData.sl}
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
          <p className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            Recommended: $2.99 - $9.99 for best conversion
          </p>
        </div>

        {/* Full Analysis */}
        <div>
          <label className={label}>Full Analysis</label>
          <textarea
            name="analysis"
            value={formData.analysis}
            onChange={handleChange}
            rows="6"
            placeholder="Provide detailed analysis including:
- Technical reasons for entry
- Key support/resistance levels
- Market sentiment
- Risk management tips
- Timeframe for the trade"
            required
            className={input}
          />
          <p className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
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
            {loading ? 'Publishing...' : 'Publish Signal'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/provider')}
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