import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { supabase } from '../config/supabase';
import Icon from '../components/Icon';
import { Icons } from '../components/Icons';

export default function MarketplacePage() {
  const { user } = useAuth();
  const { darkMode } = useTheme();
  const [signals, setSignals] = useState([]);
  const [filteredSignals, setFilteredSignals] = useState([]);
  const [displayedSignals, setDisplayedSignals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMarket, setSelectedMarket] = useState('all');
  const [sortBy, setSortBy] = useState('latest');
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [selectedSignal, setSelectedSignal] = useState(null);
  const [buying, setBuying] = useState(false);
  const [buyError, setBuyError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 50 });
  const [signalType, setSignalType] = useState('all');
  const ITEMS_PER_PAGE = 9;

  useEffect(() => {
    fetchSignals();
  }, []);

  useEffect(() => {
    filterAndSort();
  }, [signals, selectedMarket, sortBy, searchQuery, priceRange, signalType]);

  const fetchSignals = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('signals')
        .select('*, profiles!provider_id(id, full_name, avatar_url)')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSignals(data || []);
    } catch (err) {
      console.error('Failed to fetch signals:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSort = () => {
    let filtered = [...signals];

    // Market filter
    if (selectedMarket !== 'all') {
      filtered = filtered.filter(s => {
        const asset = s.asset?.toLowerCase();
        if (selectedMarket === 'crypto') return asset?.includes('btc') || asset?.includes('eth') || asset?.includes('sol') || asset?.includes('bnb') || asset?.includes('doge') || asset?.includes('xrp');
        if (selectedMarket === 'forex') return asset?.includes('/') && !asset?.includes('usd/') || ['eur', 'gbp', 'jpy', 'aud', 'cad', 'nzd'].some(c => asset?.includes(c));
        if (selectedMarket === 'stocks') return ['aapl', 'nvda', 'tsla', 'msft', 'amzn', 'googl'].some(c => asset?.includes(c));
        return true;
      });
    }

    // Signal type filter
    if (signalType !== 'all') {
      filtered = filtered.filter(s => s.signal_type === signalType);
    }

    // Price range filter
    filtered = filtered.filter(s => {
      const price = s.is_free ? 0 : s.price;
      return price >= priceRange.min && price <= priceRange.max;
    });

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(s =>
        s.asset?.toLowerCase().includes(query) ||
        s.title?.toLowerCase().includes(query) ||
        s.profiles?.full_name?.toLowerCase().includes(query)
      );
    }

    // Sort
    switch (sortBy) {
      case 'price_low':
        filtered.sort((a, b) => (a.is_free ? 0 : a.price) - (b.is_free ? 0 : b.price));
        break;
      case 'price_high':
        filtered.sort((a, b) => (b.is_free ? 0 : b.price) - (a.is_free ? 0 : a.price));
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        break;
      default:
        filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }

    setFilteredSignals(filtered);
    setDisplayedSignals(filtered.slice(0, ITEMS_PER_PAGE));
    setHasMore(filtered.length > ITEMS_PER_PAGE);
    setCurrentPage(1);
  };

  const loadMore = () => {
    const nextPage = currentPage + 1;
    const end = nextPage * ITEMS_PER_PAGE;
    setDisplayedSignals(filteredSignals.slice(0, end));
    setHasMore(end < filteredSignals.length);
    setCurrentPage(nextPage);
  };

  const resetFilters = () => {
    setSelectedMarket('all');
    setSortBy('latest');
    setSearchQuery('');
    setPriceRange({ min: 0, max: 50 });
    setSignalType('all');
  };

  const handleBuyClick = (signal) => {
    if (!user) {
      alert('Please sign in to purchase signals');
      return;
    }
    setBuyError('');
    setSelectedSignal(signal);
    setShowBuyModal(true);
  };

  const handleConfirmPurchase = async () => {
    setBuying(true);
    setBuyError('');
    try {
      // Check wallet balance
      const { data: wallet } = await supabase
        .from('wallets')
        .select('balance')
        .eq('user_id', user.id)
        .single();

      const price = selectedSignal.is_free ? 0 : selectedSignal.price;

      if (!selectedSignal.is_free && wallet.balance < price) {
        setBuyError('Insufficient balance. Please top up your wallet.');
        setBuying(false);
        return;
      }

      // Create subscription
      const { error: subError } = await supabase
        .from('subscriptions')
        .insert({
          customer_id: user.id,
          provider_id: selectedSignal.provider_id,
          amount: price,
          status: 'active',
        });
      if (subError) throw subError;

      // Create transaction record
      await supabase.from('transactions').insert({
        user_id: user.id,
        type: 'subscription',
        amount: price,
        status: 'success',
        description: `Purchased signal: ${selectedSignal.title || selectedSignal.asset}`,
        reference: `SIG-${Date.now()}`,
      });

      // Deduct from wallet if not free
      if (!selectedSignal.is_free) {
        await supabase
          .from('wallets')
          .update({ balance: wallet.balance - price })
          .eq('user_id', user.id);

        // Add to provider wallet (90% after 10% platform fee)
        const providerEarning = price * 0.9;
        const { data: providerWallet } = await supabase
          .from('wallets')
          .select('balance, total_earned')
          .eq('user_id', selectedSignal.provider_id)
          .single();

        await supabase
          .from('wallets')
          .update({
            balance: (providerWallet?.balance || 0) + providerEarning,
            total_earned: (providerWallet?.total_earned || 0) + providerEarning,
          })
          .eq('user_id', selectedSignal.provider_id);
      }

      // Send notification to user
      await supabase.from('notifications').insert({
        user_id: user.id,
        title: 'Signal Purchased!',
        message: `You have successfully purchased the ${selectedSignal.asset} signal.`,
        type: 'success',
      });

      setShowBuyModal(false);
      setSelectedSignal(null);
      alert('Signal purchased successfully! Full analysis is now available.');
      fetchSignals();
    } catch (err) {
      setBuyError(err.message || 'Purchase failed. Please try again.');
    } finally {
      setBuying(false);
    }
  };

  const text = darkMode ? 'text-white' : 'text-gray-800';
  const subtext = darkMode ? 'text-gray-400' : 'text-gray-500';
  const filterCard = `rounded-xl p-4 ${darkMode ? 'bg-gray-800' : 'bg-white shadow-lg'}`;
  const selectClass = `w-full px-3 py-2 text-sm rounded-lg border focus:outline-none focus:border-orange-500 ${
    darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'
  }`;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className={subtext}>Loading signals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className={`text-xl sm:text-2xl font-bold flex items-center gap-2 ${text}`}>
            <Icon icon={Icons.Store} size={20} />
            Signal Marketplace
          </h1>
          <p className={`text-xs sm:text-sm ${subtext}`}>
            Buy verified signals from top-rated traders
          </p>
        </div>
        <button
          onClick={() => setShowMobileFilters(!showMobileFilters)}
          className="lg:hidden flex items-center gap-2 px-3 py-2 rounded-lg text-sm bg-orange-500 text-white"
        >
          <Icon icon={Icons.Sliders} size={14} />
          Filters
        </button>
      </div>

      {/* Search Bar */}
      <div className={`rounded-xl p-3 sm:p-4 ${darkMode ? 'bg-gray-800' : 'bg-white shadow-lg'}`}>
        <div className="relative">
          <Icon icon={Icons.Search} size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by asset, title, or provider..."
            className={`w-full pl-9 pr-3 py-2 text-sm rounded-lg border focus:outline-none focus:border-orange-500 ${
              darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'
            }`}
          />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Filters Sidebar */}
        <div className={`${showMobileFilters ? 'block' : 'hidden'} lg:block lg:w-72 flex-shrink-0 space-y-4`}>

          {/* Mobile close */}
          <div className="flex justify-between items-center lg:hidden">
            <h3 className={`font-semibold ${text}`}>Filters</h3>
            <button onClick={() => setShowMobileFilters(false)}>
              <Icon icon={Icons.Close} size={20} className={subtext} />
            </button>
          </div>

          {/* Market Filter */}
          <div className={filterCard}>
            <label className={`block text-sm mb-2 flex items-center gap-1 ${subtext}`}>
              <Icon icon={Icons.Chart} size={14} />
              Market
            </label>
            <select value={selectedMarket} onChange={(e) => setSelectedMarket(e.target.value)} className={selectClass}>
              <option value="all">🌍 All Markets</option>
              <option value="forex">💱 Forex</option>
              <option value="crypto">₿ Crypto</option>
              <option value="stocks">📈 Stocks</option>
            </select>
          </div>

          {/* Signal Type */}
          <div className={filterCard}>
            <label className={`block text-sm mb-2 flex items-center gap-1 ${subtext}`}>
              <Icon icon={Icons.ExchangeAlt} size={14} />
              Signal Type
            </label>
            <select value={signalType} onChange={(e) => setSignalType(e.target.value)} className={selectClass}>
              <option value="all">All Types</option>
              <option value="buy">📈 Buy</option>
              <option value="sell">📉 Sell</option>
            </select>
          </div>

          {/* Price Range */}
          <div className={filterCard}>
            <label className={`block text-sm mb-3 flex items-center gap-1 ${subtext}`}>
              <Icon icon={Icons.Dollar} size={14} />
              Price Range: ${priceRange.min} - ${priceRange.max}
            </label>
            <input
              type="range"
              min="0"
              max="50"
              value={priceRange.max}
              onChange={(e) => setPriceRange({ ...priceRange, max: parseInt(e.target.value) })}
              className="w-full accent-orange-500"
            />
            <div className={`flex justify-between text-xs mt-1 ${subtext}`}>
              <span>Free</span>
              <span>$50</span>
            </div>
          </div>

          {/* Sort By */}
          <div className={filterCard}>
            <label className={`block text-sm mb-2 flex items-center gap-1 ${subtext}`}>
              <Icon icon={Icons.Sort} size={14} />
              Sort By
            </label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className={selectClass}>
              <option value="latest">🕐 Latest First</option>
              <option value="oldest">🕐 Oldest First</option>
              <option value="price_low">💰 Price: Low to High</option>
              <option value="price_high">💰 Price: High to Low</option>
            </select>
          </div>

          {/* Reset */}
          <button
            onClick={resetFilters}
            className="w-full bg-gray-500 hover:bg-gray-600 text-white py-2 rounded-lg text-sm flex items-center justify-center gap-2"
          >
            <Icon icon={Icons.Reset} size={14} />
            Reset Filters
          </button>
        </div>

        {/* Signals Grid */}
        <div className="flex-1 space-y-4">
          <p className={`text-sm flex items-center gap-1 ${subtext}`}>
            <Icon icon={Icons.Info} size={12} />
            {filteredSignals.length} signals found
          </p>

          {displayedSignals.length === 0 ? (
            <div className={`text-center py-12 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white shadow-lg'}`}>
              <p className="text-4xl mb-4">📭</p>
              <p className={subtext}>No signals found for the selected filters.</p>
              <button onClick={resetFilters} className="mt-4 text-orange-500 hover:underline text-sm">
                Clear filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {displayedSignals.map(signal => (
                  <SignalCard
                    key={signal.id}
                    signal={signal}
                    darkMode={darkMode}
                    onBuy={() => handleBuyClick(signal)}
                    user={user}
                  />
                ))}
              </div>

              {hasMore && (
                <div className="flex justify-center py-4">
                  <button
                    onClick={loadMore}
                    className={`px-6 py-2 rounded-lg text-sm flex items-center gap-2 ${
                      darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                  >
                    <Icon icon={Icons.ChevronDown} size={14} />
                    Load More
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Buy Modal */}
      {showBuyModal && selectedSignal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className={`max-w-md w-full rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} p-6`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className={`text-xl font-bold flex items-center gap-2 ${text}`}>
                <Icon icon={Icons.ShoppingCart} size={18} />
                Confirm Purchase
              </h2>
              <button onClick={() => setShowBuyModal(false)}>
                <Icon icon={Icons.Close} size={18} className={subtext} />
              </button>
            </div>

            {buyError && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg mb-4 text-sm">
                {buyError}
              </div>
            )}

            <div className={`p-4 rounded-lg mb-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <div className="flex justify-between mb-2 text-sm">
                <span className={subtext}>Signal:</span>
                <span className={`font-semibold ${text}`}>{selectedSignal.title || selectedSignal.asset}</span>
              </div>
              <div className="flex justify-between mb-2 text-sm">
                <span className={subtext}>Asset:</span>
                <span className={`font-semibold ${text}`}>{selectedSignal.asset}</span>
              </div>
              <div className="flex justify-between mb-2 text-sm">
                <span className={subtext}>Type:</span>
                <span className={`font-semibold capitalize ${selectedSignal.signal_type === 'buy' ? 'text-green-500' : 'text-red-500'}`}>
                  {selectedSignal.signal_type}
                </span>
              </div>
              <div className="flex justify-between mb-2 text-sm">
                <span className={subtext}>Provider:</span>
                <span className={`font-semibold ${text}`}>{selectedSignal.profiles?.full_name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className={subtext}>Price:</span>
                <span className="text-orange-500 font-bold">
                  {selectedSignal.is_free ? 'Free' : `$${selectedSignal.price}`}
                </span>
              </div>
            </div>

            <div className={`text-xs mb-4 p-3 rounded-lg flex items-center gap-2 ${darkMode ? 'bg-yellow-500/10 text-yellow-400' : 'bg-yellow-50 text-yellow-600'}`}>
              <Icon icon={Icons.Flash} size={12} />
              Full analysis revealed immediately after purchase.
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleConfirmPurchase}
                disabled={buying}
                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
              >
                {buying ? 'Processing...' : (
                  <>
                    <Icon icon={Icons.Check} size={14} />
                    Confirm — {selectedSignal.is_free ? 'Free' : `$${selectedSignal.price}`}
                  </>
                )}
              </button>
              <button
                onClick={() => setShowBuyModal(false)}
                className={`px-4 py-2 rounded-lg transition text-sm ${
                  darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                }`}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Signal Card Component
function SignalCard({ signal, darkMode, onBuy, user }) {
  const text = darkMode ? 'text-white' : 'text-gray-800';
  const subtext = darkMode ? 'text-gray-400' : 'text-gray-500';

  const getMarketColor = (asset) => {
    const a = asset?.toLowerCase();
    if (['btc', 'eth', 'sol', 'bnb', 'doge', 'xrp'].some(c => a?.includes(c))) return 'bg-orange-500/20 text-orange-500';
    if (['aapl', 'nvda', 'tsla', 'msft', 'amzn', 'googl'].some(c => a?.includes(c))) return 'bg-blue-500/20 text-blue-500';
    return 'bg-green-500/20 text-green-500';
  };

  return (
    <div className={`rounded-xl border transition-all duration-300 overflow-hidden ${
      darkMode ? 'bg-gray-800 border-gray-700 hover:border-orange-500/50' : 'bg-white shadow-lg border-gray-200 hover:shadow-xl'
    }`}>
      <div className="p-4">
        {/* Header */}
        <div className="flex justify-between items-start mb-3">
          <div>
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold rounded ${getMarketColor(signal.asset)}`}>
              <Icon icon={Icons.Chart} size={10} />
              {signal.asset}
            </span>
            <p className={`font-bold text-base mt-1 ${text}`}>
              {signal.title || signal.asset}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xl font-bold text-orange-500">
              {signal.is_free ? 'Free' : `$${signal.price}`}
            </p>
            <p className={`text-xs ${subtext}`}>per signal</p>
          </div>
        </div>

        {/* Provider */}
        <div className="flex items-center justify-between mb-3 text-xs">
          <div className="flex items-center gap-1">
            <Icon icon={Icons.User} size={10} />
            <span className={subtext}>Provider:</span>
            <span className={`font-medium ${text}`}>{signal.profiles?.full_name || 'Unknown'}</span>
          </div>
          <span className={`px-2 py-0.5 rounded-full text-xs ${
            signal.signal_type === 'buy' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'
          }`}>
            {signal.signal_type?.toUpperCase()}
          </span>
        </div>

        {/* Entry, TP, SL */}
        <div className={`rounded-lg p-2 mb-3 ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
          <div className="grid grid-cols-3 gap-1 text-center text-xs">
            <div>
              <p className={subtext}>Entry</p>
              <p className={`font-mono font-semibold ${text}`}>{signal.entry_price || '—'}</p>
            </div>
            <div>
              <p className={subtext}>TP</p>
              <p className="font-mono font-semibold text-green-500">{signal.target_price || '—'}</p>
            </div>
            <div>
              <p className={subtext}>SL</p>
              <p className="font-mono font-semibold text-red-500">{signal.stop_loss || '—'}</p>
            </div>
          </div>
        </div>

        {/* Timeframe */}
        {signal.timeframe && (
          <div className={`text-xs mb-3 flex items-center gap-1 ${subtext}`}>
            <Icon icon={Icons.Clock} size={10} />
            Timeframe: {signal.timeframe}
          </div>
        )}

        <div className={`text-center mb-3 text-xs flex items-center justify-center gap-1 ${subtext}`}>
          <Icon icon={Icons.Lock} size={10} />
          Full analysis after purchase
        </div>

        <button
          onClick={onBuy}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded-lg transition text-sm flex items-center justify-center gap-1"
        >
          <Icon icon={Icons.Dollar} size={12} color="white" />
          {signal.is_free ? 'Get Free' : `Buy — $${signal.price}`}
        </button>

        <div className={`flex justify-between mt-2 pt-2 border-t text-xs ${
          darkMode ? 'border-gray-700 text-gray-500' : 'border-gray-100 text-gray-400'
        }`}>
          <span>{new Date(signal.created_at).toLocaleDateString()}</span>
          <span className={`capitalize ${signal.status === 'active' ? 'text-green-500' : 'text-gray-400'}`}>
            {signal.status}
          </span>
        </div>
      </div>
    </div>
  );
}