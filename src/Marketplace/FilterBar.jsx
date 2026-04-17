import { useTheme } from '../../context/ThemeContext';

export default function FilterBar({ selectedMarket, onMarketChange, selectedPair, onPairChange, pairs, sortBy, onSortChange }) {
  const { darkMode } = useTheme();

  const markets = [
    { id: 'all', label: 'All Markets', icon: '🌍' },
    { id: 'forex', label: 'Forex', icon: '💱' },
    { id: 'crypto', label: 'Crypto', icon: '₿' },
    { id: 'stocks', label: 'Stocks', icon: '📈' },
  ];

  const sortOptions = [
    { value: 'latest', label: 'Latest First' },
    { value: 'price_low', label: 'Price: Low to High' },
    { value: 'price_high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' },
  ];

  return (
    <div className={`rounded-xl p-4 ${darkMode ? 'bg-gray-800' : 'bg-white shadow-lg'}`}>
      <div className="grid md:grid-cols-4 gap-4">
        {/* Market Filter */}
        <div>
          <label className={`block text-sm mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Market
          </label>
          <div className="flex flex-wrap gap-2">
            {markets.map(market => (
              <button
                key={market.id}
                onClick={() => onMarketChange(market.id)}
                className={`px-3 py-1.5 rounded-lg text-sm transition flex items-center gap-1 ${
                  selectedMarket === market.id
                    ? 'bg-orange-500 text-white'
                    : darkMode
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <span>{market.icon}</span>
                <span className="hidden sm:inline">{market.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Pair Filter */}
        <div>
          <label className={`block text-sm mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Trading Pair
          </label>
          <select
            value={selectedPair}
            onChange={(e) => onPairChange(e.target.value)}
            className={`w-full px-3 py-1.5 rounded-lg border ${
              darkMode 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-800'
            } focus:outline-none focus:border-orange-500`}
          >
            <option value="all">All Pairs</option>
            {pairs.map(pair => (
              <option key={pair} value={pair}>{pair}</option>
            ))}
          </select>
        </div>

        {/* Sort By */}
        <div>
          <label className={`block text-sm mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Sort By
          </label>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className={`w-full px-3 py-1.5 rounded-lg border ${
              darkMode 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-800'
            } focus:outline-none focus:border-orange-500`}
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>

        {/* Results Count */}
        <div className="flex items-end">
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {/* Results count will be passed from parent */}
          </p>
        </div>
      </div>
    </div>
  );
}