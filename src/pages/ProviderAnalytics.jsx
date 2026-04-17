import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';

export default function ProviderAnalytics() {
  const { darkMode } = useTheme();
  const [period, setPeriod] = useState('30d');

  const analytics = {
    total_views: 2847,
    unique_buyers: 156,
    conversion_rate: 18.5,
    avg_rating: 4.85,
    
    top_performing: [
      { pair: 'BTC/USD', purchases: 67, revenue: 334.33, winRate: 84 },
      { pair: 'ETH/USD', purchases: 52, revenue: 207.48, winRate: 79 },
      { pair: 'SOL/USD', purchases: 41, revenue: 143.09, winRate: 88 },
    ],
    
    daily_data: [12, 18, 23, 15, 28, 32, 25, 20, 22, 30, 35, 28, 24, 31, 29, 34, 38, 42, 36, 31, 33, 37, 41, 39, 35, 38, 42, 40, 36, 33],
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            Analytics
          </h1>
          <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
            Deep insights into your signal performance
          </p>
        </div>
        
        <div className="flex gap-2">
          {['7d', '30d', '90d', 'all'].map((p) => (
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
              {p === 'all' ? 'All Time' : p}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className={`rounded-xl p-4 ${darkMode ? 'bg-gray-800' : 'bg-white shadow-lg'}`}>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total Views</p>
          <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            {analytics.total_views.toLocaleString()}
          </p>
        </div>
        <div className={`rounded-xl p-4 ${darkMode ? 'bg-gray-800' : 'bg-white shadow-lg'}`}>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Unique Buyers</p>
          <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            {analytics.unique_buyers}
          </p>
        </div>
        <div className={`rounded-xl p-4 ${darkMode ? 'bg-gray-800' : 'bg-white shadow-lg'}`}>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Conversion Rate</p>
          <p className={`text-2xl font-bold text-green-500`}>
            {analytics.conversion_rate}%
          </p>
        </div>
        <div className={`rounded-xl p-4 ${darkMode ? 'bg-gray-800' : 'bg-white shadow-lg'}`}>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Avg Rating</p>
          <div className="flex items-center gap-2">
            <span className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              {analytics.avg_rating}
            </span>
            <span className="text-yellow-400 text-xl">★</span>
          </div>
        </div>
      </div>

      {/* Performance Chart */}
      <div className={`rounded-xl p-6 ${darkMode ? 'bg-gray-800' : 'bg-white shadow-lg'}`}>
        <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          Daily Performance
        </h2>
        <div className="h-64 flex items-end gap-1">
          {analytics.daily_data.slice(0, 30).map((value, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center gap-1">
              <div 
                className="w-full bg-orange-500 rounded-t transition-all duration-300 hover:bg-orange-600"
                style={{ height: `${(value / 50) * 200}px` }}
              />
              <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                {idx + 1}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Top Performing Signals */}
      <div className={`rounded-xl p-6 ${darkMode ? 'bg-gray-800' : 'bg-white shadow-lg'}`}>
        <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          Top Performing Signals
        </h2>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
              <tr className="border-b border-gray-700">
                <th className="text-left py-2">Pair</th>
                <th className="text-left py-2">Purchases</th>
                <th className="text-left py-2">Revenue</th>
                <th className="text-left py-2">Win Rate</th>
                <th className="text-left py-2">Trend</th>
               </tr>
            </thead>
            <tbody>
              {analytics.top_performing.map((item, idx) => (
                <tr key={idx} className="border-b border-gray-700/50">
                  <td className={`py-3 font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    {item.pair}
                   </td>
                  <td className="py-3">{item.purchases}</td>
                  <td className="py-3 text-green-500">${item.revenue.toFixed(2)}</td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-gray-700 rounded-full h-2">
                        <div className="bg-green-500 rounded-full h-2" style={{ width: `${item.winRate}%` }}></div>
                      </div>
                      <span className="text-green-500 text-sm">{item.winRate}%</span>
                    </div>
                  </td>
                  <td className="py-3">
                    <span className="text-green-500">↑ +{(item.winRate / 10).toFixed(1)}%</span>
                  </td>
                 </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Insights */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className={`rounded-xl p-6 ${darkMode ? 'bg-gray-800' : 'bg-white shadow-lg'}`}>
          <h3 className={`font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            📈 Growth Insights
          </h3>
          <ul className="space-y-2 text-sm">
            <li className="flex justify-between">
              <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Best Time to Post:</span>
              <span className="text-green-500">Monday 9 AM - 11 AM UTC</span>
            </li>
            <li className="flex justify-between">
              <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Best Performing Market:</span>
              <span className="text-orange-500">Cryptocurrency</span>
            </li>
            <li className="flex justify-between">
              <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Optimal Signal Price:</span>
              <span className="text-orange-500">$3.99 - $4.99</span>
            </li>
          </ul>
        </div>
        
        <div className={`rounded-xl p-6 ${darkMode ? 'bg-gray-800' : 'bg-white shadow-lg'}`}>
          <h3 className={`font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            🎯 Recommendations
          </h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <span>✓</span>
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Add more crypto signals - high demand</span>
            </li>
            <li className="flex items-center gap-2">
              <span>✓</span>
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Post during Asian session for forex</span>
            </li>
            <li className="flex items-center gap-2">
              <span>✓</span>
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Include chart screenshots for better conversion</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}