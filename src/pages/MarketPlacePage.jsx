import { useState, useEffect } from 'react';
import { signalsAPI, providersAPI } from '../services/cocobase';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Icon from '../components/Icon';
import { Icons } from '../components/Icons';
import PriceRangeFilter from '../components/filters/PriceRangeFilter';
import WinRateFilter from '../components/filters/WinRateFilter';
import AdvancedSearch from '../components/filters/AdvancedSearch';
import SaveFilters from '../components/filters/SaveFilters';
import TrendingSignals from '../components/trending/TrendingSignals';
import SignalCompare from '../components/compare/SignalCompare';
import SignalRating from '../components/ratings/SignalRating';

export default function MarketplacePage() {
  const { user } = useAuth();
  const { darkMode } = useTheme();
  const [signals, setSignals] = useState([]);
  const [filteredSignals, setFilteredSignals] = useState([]);
  const [displayedSignals, setDisplayedSignals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMarket, setSelectedMarket] = useState('all');
  const [selectedPair, setSelectedPair] = useState('all');
  const [sortBy, setSortBy] = useState('latest');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 50 });
  const [minWinRate, setMinWinRate] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('all');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [topProviders, setTopProviders] = useState([]);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [selectedSignal, setSelectedSignal] = useState(null);
  const [buying, setBuying] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const ITEMS_PER_PAGE = 9;
  const [trendingSignals, setTrendingSignals] = useState([]);

  useEffect(() => {
    fetchSignals();
    fetchTopProviders();
    calculateTrendingSignals();
  }, []);

  useEffect(() => {
    filterSignals();
  }, [signals, selectedMarket, selectedPair, sortBy, priceRange, minWinRate, searchQuery, searchType]);

  useEffect(() => {
    setCurrentPage(1);
    setHasMore(true);
    updateDisplayedSignals();
  }, [filteredSignals]);

  const updateDisplayedSignals = () => {
    const end = currentPage * ITEMS_PER_PAGE;
    const newDisplayed = filteredSignals.slice(0, end);
    setDisplayedSignals(newDisplayed);
    setHasMore(end < filteredSignals.length);
  };

  const loadMoreSignals = () => {
    if (!hasMore) return;
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    const end = nextPage * ITEMS_PER_PAGE;
    setDisplayedSignals(filteredSignals.slice(0, end));
    setHasMore(end < filteredSignals.length);
  };

  const fetchSignals = async () => {
    try {
      const res = await signalsAPI.getAll();
      const signalsWithExtras = res.data.signals.map(s => ({
        ...s,
        purchases: Math.floor(Math.random() * 100) + 10,
        likes: Math.floor(Math.random() * 200) + 50,
        winRate: s.winRate || `${Math.floor(Math.random() * 30) + 60}%`
      }));
      setSignals(signalsWithExtras);
      setFilteredSignals(signalsWithExtras);
      setDisplayedSignals(signalsWithExtras.slice(0, ITEMS_PER_PAGE));
    } catch (error) {
      console.error('Failed to fetch signals:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTopProviders = async () => {
    try {
      const res = await providersAPI.getTopRated();
      setTopProviders(res.data.providers);
    } catch (error) {
      console.error('Failed to fetch providers:', error);
    }
  };

  const calculateTrendingSignals = () => {
    const trending = [...signals]
      .sort((a, b) => (b.purchases || 0) - (a.purchases || 0))
      .slice(0, 5);
    setTrendingSignals(trending);
  };

  const filterSignals = () => {
    let filtered = [...signals];

    if (selectedMarket !== 'all') {
      filtered = filtered.filter(s => s.market === selectedMarket);
    }

    if (selectedPair !== 'all') {
      filtered = filtered.filter(s => s.pair === selectedPair);
    }

    filtered = filtered.filter(s => s.price >= priceRange.min && s.price <= priceRange.max);

    filtered = filtered.filter(s => {
      const winRateNum = parseInt(s.winRate);
      return winRateNum >= minWinRate;
    });

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(s => {
        if (searchType === 'pair') return s.pair.toLowerCase().includes(query);
        if (searchType === 'provider') return s.provider_name.toLowerCase().includes(query);
        if (searchType === 'market') return s.market.toLowerCase().includes(query);
        return s.pair.toLowerCase().includes(query) ||
          s.provider_name.toLowerCase().includes(query) ||
          s.market.toLowerCase().includes(query);
      });
    }

    switch (sortBy) {
      case 'price_low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price_high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.provider_rating - a.provider_rating);
        break;
      default:
        filtered.sort((a, b) => b.id - a.id);
        break;
    }

    setFilteredSignals(filtered);
    calculateTrendingSignals();
  };

  const handlePriceChange = (range) => setPriceRange(range);
  const handleWinRateChange = (rate) => setMinWinRate(rate);
  
  const handleSearch = ({ term, type }) => {
    setSearchQuery(term);
    setSearchType(type);
  };

  const handleLoadFilter = (filters) => {
    setSelectedMarket(filters.selectedMarket);
    setSelectedPair(filters.selectedPair);
    setPriceRange(filters.priceRange);
    setMinWinRate(filters.minWinRate);
    setSortBy(filters.sortBy);
  };

  const resetFilters = () => {
    setSelectedMarket('all');
    setSelectedPair('all');
    setPriceRange({ min: 0, max: 50 });
    setMinWinRate(0);
    setSearchQuery('');
    setSearchType('all');
    setSortBy('latest');
  };

  const handleBuyClick = (signal) => {
    if (!user) {
      alert('Please sign in to purchase signals');
      return;
    }
    setSelectedSignal(signal);
    setShowBuyModal(true);
  };

  const handleConfirmPurchase = async () => {
    setBuying(true);
    try {
      await signalsAPI.buySignal(selectedSignal.id, user.id);
      alert('Signal purchased successfully! Full analysis has been revealed.');
      setShowBuyModal(false);
      fetchSignals();
    } catch (error) {
      alert(error.response?.data?.message || 'Purchase failed. Insufficient balance?');
    } finally {
      setBuying(false);
      setSelectedSignal(null);
    }
  };

  const getUniquePairs = () => {
    const pairs = signals.map(s => s.pair);
    return ['all', ...new Set(pairs)];
  };

  const handleTrendingSelect = (signal) => {
    const element = document.getElementById(`signal-${signal.id}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      element.classList.add('ring-2', 'ring-orange-500');
      setTimeout(() => {
        element.classList.remove('ring-2', 'ring-orange-500');
      }, 2000);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Loading signals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header - Responsive */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className={`text-xl sm:text-2xl font-bold flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            <Icon icon={Icons.Store} size={20} />
            Signal Marketplace
          </h1>
          <p className={`text-xs sm:text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Buy verified signals from top-rated traders
          </p>
        </div>
        
        <div className="flex gap-2 w-full sm:w-auto">
          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="lg:hidden flex items-center gap-2 px-3 py-2 rounded-lg text-sm bg-orange-500 text-white"
          >
            <Icon icon={Icons.Sliders} size={14} />
            Filters
          </button>
          
          <SaveFilters
            currentFilters={{ selectedMarket, selectedPair, priceRange, minWinRate, sortBy }}
            onLoadFilter={handleLoadFilter}
            darkMode={darkMode}
          />
        </div>
      </div>

      {/* Search Bar - Responsive */}
      <div className={`rounded-xl p-3 sm:p-4 ${darkMode ? 'bg-gray-800' : 'bg-white shadow-lg'}`}>
        <div className="relative">
          <Icon icon={Icons.Search} size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by pair, provider, or market..."
            className={`w-full pl-9 pr-3 py-2 text-sm rounded-lg border focus:outline-none focus:border-orange-500 ${
              darkMode 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-800'
            }`}
          />
        </div>
      </div>

      {/* Responsive Layout - Stack on mobile, grid on desktop */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Filters Sidebar - Hidden on mobile unless toggled */}
        <div className={`${showMobileFilters ? 'block' : 'hidden'} lg:block lg:w-80 flex-shrink-0 space-y-4`}>
          {/* Quick Filters Row for Mobile */}
          <div className="block lg:hidden">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold">Filters</h3>
              <button onClick={() => setShowMobileFilters(false)} className="text-gray-500">
                <Icon icon={Icons.Close} size={20} />
              </button>
            </div>
          </div>

          {/* Price Range Filter */}
          <div className={`rounded-xl p-3 sm:p-4 ${darkMode ? 'bg-gray-800' : 'bg-white shadow-lg'}`}>
            <PriceRangeFilter
              minPrice={priceRange.min}
              maxPrice={priceRange.max}
              onPriceChange={handlePriceChange}
              darkMode={darkMode}
            />
          </div>

          {/* Win Rate Filter */}
          <div className={`rounded-xl p-3 sm:p-4 ${darkMode ? 'bg-gray-800' : 'bg-white shadow-lg'}`}>
            <WinRateFilter
              winRate={minWinRate}
              onWinRateChange={handleWinRateChange}
              darkMode={darkMode}
            />
          </div>

          {/* Market Filter */}
          <div className={`rounded-xl p-3 sm:p-4 ${darkMode ? 'bg-gray-800' : 'bg-white shadow-lg'}`}>
            <label className={`block text-xs sm:text-sm mb-2 flex items-center gap-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              <Icon icon={Icons.Chart} size={14} />
              Market
            </label>
            <select
              value={selectedMarket}
              onChange={(e) => setSelectedMarket(e.target.value)}
              className={`w-full px-2 py-1.5 sm:px-3 sm:py-2 text-sm rounded-lg border ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-800'
              } focus:outline-none focus:border-orange-500`}
            >
              <option value="all">🌍 All Markets</option>
              <option value="forex">💱 Forex</option>
              <option value="crypto">₿ Crypto</option>
              <option value="stocks">📈 Stocks</option>
            </select>
          </div>

          {/* Pair Filter */}
          <div className={`rounded-xl p-3 sm:p-4 ${darkMode ? 'bg-gray-800' : 'bg-white shadow-lg'}`}>
            <label className={`block text-xs sm:text-sm mb-2 flex items-center gap-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              <Icon icon={Icons.ExchangeAlt} size={14} />
              Trading Pair
            </label>
            <select
              value={selectedPair}
              onChange={(e) => setSelectedPair(e.target.value)}
              className={`w-full px-2 py-1.5 sm:px-3 sm:py-2 text-sm rounded-lg border ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-800'
              } focus:outline-none focus:border-orange-500`}
            >
              {getUniquePairs().map(pair => (
                <option key={pair} value={pair}>
                  {pair === 'all' ? '🔀 All Pairs' : pair}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div className={`rounded-xl p-3 sm:p-4 ${darkMode ? 'bg-gray-800' : 'bg-white shadow-lg'}`}>
            <label className={`block text-xs sm:text-sm mb-2 flex items-center gap-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              <Icon icon={Icons.Sort} size={14} />
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={`w-full px-2 py-1.5 sm:px-3 sm:py-2 text-sm rounded-lg border ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-800'
              } focus:outline-none focus:border-orange-500`}
            >
              <option value="latest">🕐 Latest First</option>
              <option value="price_low">💰 Price: Low to High</option>
              <option value="price_high">💰 Price: High to Low</option>
              <option value="rating">⭐ Highest Rated</option>
            </select>
          </div>

          {/* Reset Button */}
          <button
            onClick={resetFilters}
            className="w-full bg-gray-500 hover:bg-gray-600 text-white py-2 rounded-lg text-sm flex items-center justify-center gap-2"
          >
            <Icon icon={Icons.Reset} size={14} />
            Reset All Filters
          </button>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 space-y-6">
          {/* Trending Signals - Horizontal scroll on mobile */}
          <TrendingSignals
            signals={trendingSignals}
            onSelectSignal={handleTrendingSelect}
            darkMode={darkMode}
          />

          {/* Top Providers Banner - Horizontal scroll on mobile */}
          {topProviders.length > 0 && (
            <div className={`rounded-xl p-3 sm:p-4 ${darkMode ? 'bg-gradient-to-r from-orange-600/20 to-red-600/20 border border-orange-500/30' : 'bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200'}`}>
              <h3 className={`font-semibold mb-2 sm:mb-3 flex items-center gap-2 text-sm sm:text-base ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                <Icon icon={Icons.Trophy} size={16} color="#eab308" />
                Top Rated Providers This Week
              </h3>
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
                {topProviders.map(provider => (
                  <div key={provider.id} className={`rounded-lg px-3 py-1.5 sm:px-4 sm:py-2 min-w-[140px] sm:min-w-[160px] ${darkMode ? 'bg-gray-800/80' : 'bg-white shadow-sm'}`}>
                    <p className={`font-medium text-sm ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      {provider.full_name}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Icon icon={Icons.Star} size={10} color="#eab308" />
                      <span className="text-yellow-400 text-xs">{provider.rating.toFixed(1)}</span>
                      <span className="text-green-400 text-xs">{provider.win_rate}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Results Count */}
          <div className="flex justify-between items-center">
            <p className={`text-xs sm:text-sm flex items-center gap-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              <Icon icon={Icons.Info} size={12} />
              {filteredSignals.length} signals found
            </p>
          </div>

          {/* Signals Grid - Responsive grid */}
          {displayedSignals.length === 0 ? (
            <div className={`text-center py-12 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white shadow-lg'}`}>
              <Icon icon={Icons.Search} size={40} color={darkMode ? '#6b7280' : '#9ca3af'} className="mx-auto mb-4" />
              <p className={`text-base ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                No signals found for the selected filters.
              </p>
              <button
                onClick={resetFilters}
                className="mt-4 text-orange-500 hover:underline inline-flex items-center gap-1 text-sm"
              >
                <Icon icon={Icons.Close} size={14} />
                Clear filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {displayedSignals.map(signal => (
                  <div key={signal.id} id={`signal-${signal.id}`}>
                    <SignalCard 
                      signal={signal} 
                      darkMode={darkMode}
                      onBuy={() => handleBuyClick(signal)}
                      user={user}
                    />
                  </div>
                ))}
              </div>
              
              {/* Load More Button */}
              {hasMore && (
                <div className="flex justify-center py-4">
                  <button
                    onClick={loadMoreSignals}
                    className={`px-4 sm:px-6 py-2 rounded-lg text-sm flex items-center gap-2 ${
                      darkMode 
                        ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                  >
                    <Icon icon={Icons.ChevronDown} size={14} />
                    Load More Signals
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Signal Compare Component */}
      <SignalCompare
        signals={filteredSignals}
        onBuy={handleBuyClick}
        darkMode={darkMode}
      />

      {/* Buy Modal - Responsive */}
      {showBuyModal && selectedSignal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className={`max-w-md w-full rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} p-4 sm:p-6`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className={`text-lg sm:text-xl font-bold flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                <Icon icon={Icons.ShoppingCart} size={18} />
                Confirm Purchase
              </h2>
              <button onClick={() => setShowBuyModal(false)} className="text-gray-500">
                <Icon icon={Icons.Close} size={18} />
              </button>
            </div>
            
            <div className={`p-3 sm:p-4 rounded-lg mb-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <div className="flex justify-between mb-2 text-sm">
                <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Signal:</span>
                <span className={`font-semibold flex items-center gap-1 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  <Icon icon={Icons.Chart} size={12} />
                  {selectedSignal.pair}
                </span>
              </div>
              <div className="flex justify-between mb-2 text-sm">
                <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Provider:</span>
                <span className={`font-semibold flex items-center gap-1 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  <Icon icon={Icons.User} size={12} />
                  {selectedSignal.provider_name}
                </span>
              </div>
              <div className="flex justify-between mb-2 text-sm">
                <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Price:</span>
                <span className="text-orange-500 font-bold flex items-center gap-1">
                  <Icon icon={Icons.Dollar} size={12} />
                  ${selectedSignal.price}
                </span>
              </div>
            </div>

            <div className={`text-xs sm:text-sm mb-4 p-2 sm:p-3 rounded-lg flex items-center gap-2 ${darkMode ? 'bg-yellow-500/10 text-yellow-400' : 'bg-yellow-50 text-yellow-600'}`}>
              <Icon icon={Icons.Flash} size={12} />
              Full analysis revealed immediately after purchase.
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleConfirmPurchase}
                disabled={buying}
                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
              >
                {buying ? (
                  <>
                    <Icon icon={Icons.Settings} size={14} spin={true} />
                    Processing...
                  </>
                ) : (
                  <>
                    <Icon icon={Icons.Check} size={14} />
                    Confirm - ${selectedSignal.price}
                  </>
                )}
              </button>
              <button
                onClick={() => setShowBuyModal(false)}
                className={`px-4 py-2 rounded-lg transition flex items-center justify-center gap-1 text-sm ${
                  darkMode 
                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                }`}
              >
                <Icon icon={Icons.Close} size={14} />
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Responsive Signal Card Component
function SignalCard({ signal, darkMode, onBuy, user }) {
  const [purchased, setPurchased] = useState(false);
  const [fullAnalysis, setFullAnalysis] = useState(null);

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
      case 'forex': return Icons.ExchangeAlt;
      case 'crypto': return Icons.Bitcoin;
      case 'stocks': return Icons.ChartBar;
      default: return Icons.Chart;
    }
  };

  const handleLocalBuy = () => {
    onBuy();
    if (window.confirm('Demo: Reveal full analysis?')) {
      setFullAnalysis(signal.analysis_full || 'Detailed analysis including technical indicators, support/resistance levels, and risk management tips for this trade setup.');
      setPurchased(true);
    }
  };

  if (purchased && fullAnalysis) {
    return (
      <div className={`rounded-xl border-2 border-green-500/50 overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white shadow-lg'}`}>
        <div className="p-4">
          <div className="flex justify-between items-start mb-3">
            <div>
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold rounded ${getMarketColor(signal.market)}`}>
                <Icon icon={getMarketIcon(signal.market)} size={10} />
                {signal.market.toUpperCase()}
              </span>
              <p className={`font-bold text-base mt-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                {signal.pair}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold text-green-500">${signal.price}</p>
              <p className="text-xs text-gray-500 flex items-center justify-end gap-1">
                <Icon icon={Icons.Check} size={8} /> purchased
              </p>
            </div>
          </div>

          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 mb-3">
            <p className="text-green-400 text-xs font-semibold mb-1 flex items-center gap-1">
              <Icon icon={Icons.Info} size={12} />
              Full Analysis:
            </p>
            <p className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              {fullAnalysis}
            </p>
          </div>

          <div className="text-center text-green-400 text-xs font-semibold py-1 flex items-center justify-center gap-1">
            <Icon icon={Icons.Check} size={12} />
            Purchased
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-xl border ${darkMode ? 'bg-gray-800 border-gray-700 hover:border-orange-500/50' : 'bg-white shadow-lg border-gray-200 hover:shadow-xl'} transition-all duration-300 overflow-hidden`}>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 text-xs font-semibold rounded ${getMarketColor(signal.market)}`}>
              <Icon icon={getMarketIcon(signal.market)} size={10} />
              {signal.market.toUpperCase()}
            </span>
            <p className={`font-bold text-base mt-1 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              {signal.pair}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xl font-bold text-orange-500">${signal.price}</p>
            <p className="text-xs text-gray-500">per signal</p>
          </div>
        </div>

        <div className="flex items-center justify-between mb-3 text-xs">
          <div className="flex items-center gap-1">
            <Icon icon={Icons.User} size={10} />
            <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Provider:</span>
            <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              {signal.provider_name}
            </span>
          </div>
          <div className="flex items-center gap-0.5">
            <Icon icon={Icons.Star} size={10} color="#eab308" />
            <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
              {signal.provider_rating}
            </span>
          </div>
        </div>

        <div className={`rounded-lg p-2 mb-3 ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
          <div className="grid grid-cols-3 gap-1 text-center text-xs">
            <div>
              <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Entry</p>
              <p className={`font-mono font-semibold text-xs ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                {signal.entry}
              </p>
            </div>
            <div>
              <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>TP</p>
              <p className="font-mono font-semibold text-green-500 text-xs">
                {signal.tp}
              </p>
            </div>
            <div>
              <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>SL</p>
              <p className="font-mono font-semibold text-red-500 text-xs">
                {signal.sl}
              </p>
            </div>
          </div>
        </div>

        {signal.purchases > 50 && (
          <div className="absolute top-2 right-2">
            <div className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
              <Icon icon={Icons.Fire} size={8} />
              Hot
            </div>
          </div>
        )}

        <div className={`text-center mb-3 text-[10px] flex items-center justify-center gap-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
          <Icon icon={Icons.Lock} size={8} />
          Full analysis after purchase
        </div>

        <button
          onClick={handleLocalBuy}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-1.5 rounded-lg transition text-sm flex items-center justify-center gap-1"
        >
          <Icon icon={Icons.Dollar} size={12} color="white" />
          Buy - ${signal.price}
        </button>

        <div className={`flex justify-between mt-2 pt-2 border-t text-[10px] ${darkMode ? 'border-gray-700 text-gray-500' : 'border-gray-100 text-gray-400'}`}>
          <span className="flex items-center gap-0.5">
            <Icon icon={Icons.Chart} size={8} />
            {signal.purchases || 42} buys
          </span>
          <span className="flex items-center gap-0.5">
            <Icon icon={Icons.Star} size={8} color="#eab308" />
            {signal.likes || 89}% liked
          </span>
        </div>
      </div>
    </div>
  );
}