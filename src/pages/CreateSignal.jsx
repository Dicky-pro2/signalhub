import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

export default function CreateSignal() {
  const { darkMode } = useTheme();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    market: 'forex',
    pair: '',
    entry: '',
    tp: '',
    sl: '',
    price: '2.99',
    analysis: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // API call to Cocobase to create signal
    setTimeout(() => {
      setLoading(false);
      navigate('/provider/signals');
    }, 1500);
  };

  const markets = [
    { value: 'forex', label: '💱 Forex', pairs: ['EUR/USD', 'GBP/USD', 'USD/JPY', 'AUD/USD', 'USD/CAD', 'NZD/USD'] },
    { value: 'crypto', label: '₿ Crypto', pairs: ['BTC/USD', 'ETH/USD', 'SOL/USD', 'BNB/USD', 'DOGE/USD', 'XRP/USD'] },
    { value: 'stocks', label: '📈 Stocks', pairs: ['AAPL', 'NVDA', 'TSLA', 'MSFT', 'AMZN', 'GOOGL'] },
  ];

  const selectedMarket = markets.find(m => m.value === formData.market);

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

      <form onSubmit={handleSubmit} className={`rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white shadow-lg'} p-6 space-y-5`}>
        {/* Market Selection */}
        <div>
          <label className={`block mb-2 font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Market
          </label>
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
          <label className={`block mb-2 font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Trading Pair
          </label>
          <select
            name="pair"
            value={formData.pair}
            onChange={handleChange}
            required
            className={`w-full px-4 py-2 rounded-lg border ${
              darkMode 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-800'
            } focus:outline-none focus:border-orange-500`}
          >
            <option value="">Select pair</option>
            {selectedMarket?.pairs.map((pair) => (
              <option key={pair} value={pair}>{pair}</option>
            ))}
          </select>
        </div>

        {/* Entry, TP, SL */}
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className={`block mb-2 font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Entry Price
            </label>
            <input
              type="text"
              name="entry"
              value={formData.entry}
              onChange={handleChange}
              placeholder="e.g., 1.0892"
              required
              className={`w-full px-4 py-2 rounded-lg border ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-800'
              } focus:outline-none focus:border-orange-500`}
            />
          </div>
          <div>
            <label className={`block mb-2 font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Take Profit (TP)
            </label>
            <input
              type="text"
              name="tp"
              value={formData.tp}
              onChange={handleChange}
              placeholder="e.g., 1.0950"
              required
              className={`w-full px-4 py-2 rounded-lg border ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-800'
              } focus:outline-none focus:border-orange-500`}
            />
          </div>
          <div>
            <label className={`block mb-2 font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Stop Loss (SL)
            </label>
            <input
              type="text"
              name="sl"
              value={formData.sl}
              onChange={handleChange}
              placeholder="e.g., 1.0850"
              required
              className={`w-full px-4 py-2 rounded-lg border ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-800'
              } focus:outline-none focus:border-orange-500`}
            />
          </div>
        </div>

        {/* Signal Price */}
        <div>
          <label className={`block mb-2 font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Signal Price ($)
          </label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            step="0.01"
            min="0.99"
            max="49.99"
            required
            className={`w-40 px-4 py-2 rounded-lg border ${
              darkMode 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-800'
            } focus:outline-none focus:border-orange-500`}
          />
          <p className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            Recommended: $2.99 - $9.99 for best conversion
          </p>
        </div>

        {/* Full Analysis */}
        <div>
          <label className={`block mb-2 font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Full Analysis
          </label>
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
            className={`w-full px-4 py-2 rounded-lg border ${
              darkMode 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-800'
            } focus:outline-none focus:border-orange-500`}
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
            {loading ? 'Creating Signal...' : 'Publish Signal'}
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