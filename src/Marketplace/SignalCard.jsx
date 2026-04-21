import { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import Icon from '../Icon';
import { Icons } from '../Icons';

export default function SignalCard({ signal, onBuy, purchased, fullAnalysis }) {
  const { darkMode } = useTheme();
  const [revealed, setRevealed] = useState(purchased);

  const getMarketIcon = (market) => {
    switch(market) {
      case 'forex': return Icons.ExchangeAlt;
      case 'crypto': return Icons.Bitcoin;
      case 'stocks': return Icons.ChartBar;
      default: return Icons.Chart;
    }
  };

  const getMarketColor = (market) => {
    switch(market) {
      case 'forex': return 'text-green-500';
      case 'crypto': return 'text-orange-500';
      case 'stocks': return 'text-blue-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className={`rounded-xl border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white shadow-lg border-gray-200'} transition-all duration-300`}>
      <div className="p-5">
        {/* Header */}
        <div className="flex justify-between items-start mb-3">
          <div>
            <div className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded ${getMarketColor(signal.market)} bg-opacity-20`}>
              <Icon icon={getMarketIcon(signal.market)} size={12} />
              <span>{signal.market.toUpperCase()}</span>
            </div>
            <p className={`font-bold text-lg mt-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              {signal.pair}
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-orange-500">${signal.price}</p>
            <p className="text-xs text-gray-500">per signal</p>
          </div>
        </div>

        {/* Provider Info */}
        <div className="flex items-center justify-between mb-4 text-sm">
          <div className="flex items-center gap-2">
            <Icon icon={Icons.User} size={14} />
            <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Provider:</span>
            <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              {signal.provider_name}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Icon icon={Icons.Star} size={14} color="#eab308" />
            <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
              {signal.provider_rating}
            </span>
          </div>
        </div>

        {/* Signal Preview */}
        <div className={`rounded-lg p-3 mb-4 ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
          <div className="grid grid-cols-3 gap-2 text-center text-sm">
            <div>
              <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Entry</p>
              <p className={`font-mono font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                {signal.entry}
              </p>
            </div>
            <div>
              <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>TP</p>
              <p className="font-mono font-semibold text-green-500">{signal.tp}</p>
            </div>
            <div>
              <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>SL</p>
              <p className="font-mono font-semibold text-red-500">{signal.sl}</p>
            </div>
          </div>
        </div>

        {/* Buy Button */}
        <button
          onClick={() => onBuy(signal)}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded-lg transition flex items-center justify-center gap-2"
        >
          <Icon icon={Icons.Dollar} size={16} color="white" />
          Buy Signal - ${signal.price}
        </button>

        {/* Stats Footer */}
        <div className={`flex justify-between mt-3 pt-3 border-t text-xs ${darkMode ? 'border-gray-700 text-gray-500' : 'border-gray-100 text-gray-400'}`}>
          <div className="flex items-center gap-1">
            <Icon icon={Icons.TrendingUp} size={12} />
            <span>24h volume: 142 buys</span>
          </div>
          <div className="flex items-center gap-1">
            <Icon icon={Icons.Star} size={12} />
            <span>89% liked</span>
          </div>
        </div>
      </div>
    </div>
  );
}