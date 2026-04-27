// src/components/trending/TrendingSignals.jsx
import { useState, useEffect } from 'react';
import Icon from '../Icon';
import { Icons } from '../Icons';

export default function TrendingSignals({ signals, onSelectSignal, darkMode }) {
  const [trendingSignals, setTrendingSignals] = useState([]);
  const [timeframe, setTimeframe] = useState('week');

  useEffect(() => {
    calculateTrending();
  }, [signals, timeframe]);

  const calculateTrending = () => {
    // Calculate trending based on purchase volume and recency
    const trending = [...signals]
      .map(signal => ({
        ...signal,
        trendingScore: (signal.purchases || 0) * 0.7 + (signal.likes || 0) * 0.3
      }))
      .sort((a, b) => b.trendingScore - a.trendingScore)
      .slice(0, 5);
    
    setTrendingSignals(trending);
  };

  const getTrendingIcon = (index) => {
    if (index === 0) return <Icon icon={Icons.Crown} size={20} color="#eab308" />;
    if (index === 1) return <Icon icon={Icons.Medal} size={18} color="#9ca3af" />;
    if (index === 2) return <Icon icon={Icons.Medal} size={16} color="#cd7f32" />;
    return <Icon icon={Icons.TrendingUp} size={14} color="#f97316" />;
  };

  return (
    <div className={`rounded-xl p-4 ${darkMode ? 'bg-gray-800' : 'bg-white shadow-lg'}`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className={`font-bold flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          <Icon icon={Icons.Fire} size={18} color="#f97316" />
          🔥 Trending Signals
        </h3>
        <div className="flex gap-1">
          {['day', 'week', 'month'].map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-2 py-1 text-xs rounded transition ${
                timeframe === tf
                  ? 'bg-orange-500 text-white'
                  : darkMode
                  ? 'bg-gray-700 text-gray-400'
                  : 'bg-gray-100 text-gray-500'
              }`}
            >
              {tf === 'day' ? 'Today' : tf === 'week' ? 'This Week' : 'This Month'}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {trendingSignals.map((signal, index) => (
          <button
            key={signal.id}
            onClick={() => onSelectSignal(signal)}
            className="w-full text-left"
          >
            <div className={`flex items-center gap-3 p-2 rounded-lg transition hover:bg-orange-500/10 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}>
              <div className="w-8 text-center">
                {getTrendingIcon(index)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    {signal.pair}
                  </span>
                  <span className={`text-xs px-1.5 py-0.5 rounded ${
                    signal.market === 'crypto' ? 'bg-orange-500/20 text-orange-500' :
                    signal.market === 'forex' ? 'bg-green-500/20 text-green-500' :
                    'bg-blue-500/20 text-blue-500'
                  }`}>
                    {signal.market}
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs text-gray-500">{signal.provider_name}</span>
                  <div className="flex items-center gap-1">
                    <Icon icon={Icons.Star} size={10} color="#eab308" />
                    <span className="text-xs text-gray-500">{signal.provider_rating}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-orange-500 font-bold text-sm">${signal.price}</div>
                <div className="flex items-center gap-1 text-xs text-green-500">
                  <Icon icon={Icons.TrendingUp} size={10} />
                  <span>+{Math.floor(Math.random() * 50) + 10}%</span>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}