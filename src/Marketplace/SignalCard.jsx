import { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';

export default function SignalCard({ signal, onBuy, purchased, fullAnalysis }) {
  const { darkMode } = useTheme();
  const [revealed, setRevealed] = useState(purchased);

  const getMarketColor = (market) => {
    switch(market) {
      case 'forex': return 'bg-green-500/20 text-green-500';
      case 'crypto': return 'bg-orange-500/20 text-orange-500';
      case 'stocks': return 'bg-blue-500/20 text-blue-500';
      default: return 'bg-gray-500/20 text-gray-500';
    }
  };

  const getMarketIcon = (market) => {
    switch(market) {
      case 'forex': return '💱';
      case 'crypto': return '₿';
      case 'stocks': return '📈';
      default: return '📊';
    }
  };

  if (revealed && fullAnalysis) {
    return (
      <div className={`rounded-xl border-2 border-green-500/50 overflow-hidden transition-all ${darkMode ? 'bg-gray-800' : 'bg-white shadow-lg'}`}>
        <div className="p-5">
          <div className="flex justify-between items-start mb-3">
            <div>
              <span className={`inline-block px-2 py-1 text-xs font-semibold rounded ${getMarketColor(signal.market)}`}>
                {getMarketIcon(signal.market)} {signal.market.toUpperCase()}
              </span>
              <p className={`font-bold text-lg mt-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                {signal.pair}
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-green-500">${signal.price}</p>
              <p className="text-xs text-gray-500">purchased ✓</p>
            </div>
          </div>

          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 mb-4">
            <p className="text-green-400 text-sm font-semibold mb-2">📋 Full Analysis:</p>
            <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              {fullAnalysis}
            </p>
          </div>

          <div className="text-center text-green-400 text-sm font-semibold py-2">
            ✓ Signal Purchased - Analysis Available Above
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-xl border ${darkMode ? 'bg-gray-800 border-gray-700 hover:border-orange-500/50' : 'bg-white shadow-lg border-gray-200 hover:shadow-xl'} transition-all duration-300 overflow-hidden group`}>
      <div className="p-5">
        {/* Header */}
        <div className="flex justify-between items-start mb-3">
          <div>
            <span className={`inline-block px-2 py-1 text-xs font-semibold rounded ${getMarketColor(signal.market)}`}>
              {getMarketIcon(signal.market)} {signal.market.toUpperCase()}
            </span>
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
            <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Provider:</span>
            <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              {signal.provider_name}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-yellow-400">★</span>
            <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
              {signal.provider_rating}
            </span>
          </div>
        </div>

        {/* Signal Preview (Entry, TP, SL) */}
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
              <p className="font-mono font-semibold text-green-500">
                {signal.tp}
              </p>
            </div>
            <div>
              <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>SL</p>
              <p className="font-mono font-semibold text-red-500">
                {signal.sl}
              </p>
            </div>
          </div>
        </div>

        {/* Preview Badge */}
        <div className={`text-center mb-4 text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
          🔒 Full analysis revealed after purchase
        </div>

        {/* Buy Button */}
        <button
          onClick={() => onBuy(signal)}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded-lg transition transform hover:scale-[1.02] active:scale-[0.98]"
        >
          Buy Signal - ${signal.price}
        </button>

        {/* Stats Footer */}
        <div className={`flex justify-between mt-3 pt-3 border-t text-xs ${darkMode ? 'border-gray-700 text-gray-500' : 'border-gray-100 text-gray-400'}`}>
          <span>📊 24h volume: {signal.volume || '142'} buys</span>
          <span>⭐ {signal.likeRate || '89'}% liked</span>
        </div>
      </div>
    </div>
  );
}