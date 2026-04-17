import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

export default function EditSignal() {
  const { id } = useParams();
  const { darkMode } = useTheme();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    market: 'forex',
    pair: '',
    entry: '',
    tp: '',
    sl: '',
    price: '2.99',
    analysis: '',
  });

  useEffect(() => {
    fetchSignal();
  }, [id]);

  const fetchSignal = async () => {
    // Mock data - replace with API call
    setTimeout(() => {
      setFormData({
        market: 'crypto',
        pair: 'BTC/USD',
        entry: '68,420',
        tp: '70,000',
        sl: '67,000',
        price: '4.99',
        analysis: 'Bitcoin showing strong bullish momentum after breaking key resistance...',
      });
    }, 500);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // API call to update signal
    setTimeout(() => {
      setLoading(false);
      navigate('/provider/signals');
    }, 1000);
  };

  const markets = [
    { value: 'forex', label: '💱 Forex', pairs: ['EUR/USD', 'GBP/USD', 'USD/JPY', 'AUD/USD', 'USD/CAD', 'NZD/USD'] },
    { value: 'crypto', label: '₿ Crypto', pairs: ['BTC/USD', 'ETH/USD', 'SOL/USD', 'BNB/USD', 'DOGE/USD', 'XRP/USD'] },
    { value: 'stocks', label: '📈 Stocks', pairs: ['AAPL', 'NVDA', 'TSLA', 'MSFT', 'AMZN', 'GOOGL'] },
  ];

  const selectedMarket = markets.find(m => m.value === formData.market);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          Edit Signal
        </h1>
        <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
          Update your signal details
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
            required
            className={`w-full px-4 py-2 rounded-lg border ${
              darkMode 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-800'
            } focus:outline-none focus:border-orange-500`}
          />
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