import { useState, useEffect } from "react";
import { signalsAPI, providersAPI } from "../services/cocobase";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import Icon from "../components/Icon";
import { Icons } from "../components/Icons";

export default function MarketplacePage() {
  const { user } = useAuth();
  const { darkMode } = useTheme();
  const [signals, setSignals] = useState([]);
  const [filteredSignals, setFilteredSignals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMarket, setSelectedMarket] = useState("all");
  const [selectedPair, setSelectedPair] = useState("all");
  const [sortBy, setSortBy] = useState("latest");
  const [topProviders, setTopProviders] = useState([]);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [selectedSignal, setSelectedSignal] = useState(null);
  const [buying, setBuying] = useState(false);

  useEffect(() => {
    fetchSignals();
    fetchTopProviders();
  }, []);

  useEffect(() => {
    filterSignals();
  }, [signals, selectedMarket, selectedPair, sortBy]);

  const fetchSignals = async () => {
    try {
      const res = await signalsAPI.getAll();
      setSignals(res.data.signals);
      setFilteredSignals(res.data.signals);
    } catch (error) {
      console.error("Failed to fetch signals:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTopProviders = async () => {
    try {
      const res = await providersAPI.getTopRated();
      setTopProviders(res.data.providers);
    } catch (error) {
      console.error("Failed to fetch providers:", error);
    }
  };

  const filterSignals = () => {
    let filtered = [...signals];

    if (selectedMarket !== "all") {
      filtered = filtered.filter((s) => s.market === selectedMarket);
    }

    if (selectedPair !== "all") {
      filtered = filtered.filter((s) => s.pair === selectedPair);
    }

    switch (sortBy) {
      case "price_low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price_high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        filtered.sort((a, b) => b.provider_rating - a.provider_rating);
        break;
      case "latest":
      default:
        filtered.sort((a, b) => b.id - a.id);
        break;
    }

    setFilteredSignals(filtered);
  };

  const handleBuyClick = (signal) => {
    if (!user) {
      alert("Please sign in to purchase signals");
      return;
    }
    setSelectedSignal(signal);
    setShowBuyModal(true);
  };

  const handleConfirmPurchase = async () => {
    setBuying(true);
    try {
      const res = await signalsAPI.buySignal(selectedSignal.id, user.id);
      alert("Signal purchased successfully! Full analysis has been revealed.");
      setShowBuyModal(false);
      fetchSignals();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Purchase failed. Insufficient balance?",
      );
    } finally {
      setBuying(false);
      setSelectedSignal(null);
    }
  };

  const getUniquePairs = () => {
    const pairs = signals.map((s) => s.pair);
    return ["all", ...new Set(pairs)];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className={darkMode ? "text-gray-400" : "text-gray-500"}>
            Loading signals...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1
          className={`text-2xl font-bold flex items-center gap-2 ${darkMode ? "text-white" : "text-gray-800"}`}
        >
          <Icon icon={Icons.Store} size={24} />
          Signal Marketplace
        </h1>
        <p className={darkMode ? "text-gray-400" : "text-gray-500"}>
          Buy verified signals from top-rated traders
        </p>
      </div>

      {/* Top Providers Banner */}
      {topProviders.length > 0 && (
        <div
          className={`rounded-xl p-4 ${darkMode ? "bg-gradient-to-r from-orange-600/20 to-red-600/20 border border-orange-500/30" : "bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200"}`}
        >
          <h3
            className={`font-semibold mb-3 flex items-center gap-2 ${darkMode ? "text-white" : "text-gray-800"}`}
          >
            <Icon icon={Icons.Trophy} size={18} color="#eab308" />
            Top Rated Providers This Week
          </h3>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {topProviders.map((provider) => (
              <div
                key={provider.id}
                className={`rounded-lg px-4 py-2 min-w-[160px] ${darkMode ? "bg-gray-800/80" : "bg-white shadow-sm"}`}
              >
                <p
                  className={`font-medium ${darkMode ? "text-white" : "text-gray-800"}`}
                >
                  {provider.full_name}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <Icon icon={Icons.Star} size={12} color="#eab308" />
                  <span className="text-yellow-400 text-sm">
                    {provider.rating.toFixed(1)}
                  </span>
                  <span className="text-green-400 text-xs">
                    {provider.win_rate}% win rate
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filters Bar */}
      <div
        className={`rounded-xl p-4 ${darkMode ? "bg-gray-800" : "bg-white shadow-lg"}`}
      >
        <div className="grid md:grid-cols-4 gap-4">
          {/* Market Filter */}
          <div>
            <label
              className={`block text-sm mb-2 flex items-center gap-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}
            >
              <Icon icon={Icons.Chart} size={14} />
              Market
            </label>
            <select
              value={selectedMarket}
              onChange={(e) => setSelectedMarket(e.target.value)}
              className={`w-full px-3 py-2 rounded-lg border ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300 text-gray-800"
              } focus:outline-none focus:border-orange-500`}
            >
              <option value="all">All Markets</option>
              <option value="forex"><Icon icon={Icons.Exchange} size={16} /> Forex</option>
              <option value="crypto"><Icon icon={Icons.Bitcoin} size={16} /> Crypto</option>
              <option value="stocks"><Icon icon={Icons.Chart} size={16} /> Stocks</option>
            </select>
          </div>

          {/* Pair Filter */}
          <div>
            <label
              className={`block text-sm mb-2 flex items-center gap-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}
            >
              <Icon icon={Icons.Exchange} size={14} />
              Trading Pair
            </label>
            <select
              value={selectedPair}
              onChange={(e) => setSelectedPair(e.target.value)}
              className={`w-full px-3 py-2 rounded-lg border ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300 text-gray-800"
              } focus:outline-none focus:border-orange-500`}
            >
              {getUniquePairs().map((pair) => (
                <option key={pair} value={pair}>
                  {pair === "all" ? "All Pairs" : pair}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label
              className={`block text-sm mb-2 flex items-center gap-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}
            >
              <Icon icon={Icons.Sort} size={14} />
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={`w-full px-3 py-2 rounded-lg border ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300 text-gray-800"
              } focus:outline-none focus:border-orange-500`}
            >
              <option value="latest">Latest First</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>

          {/* Results Count */}
          <div className="flex items-end">
            <p
              className={`text-sm flex items-center gap-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}
            >
              <Icon icon={Icons.Info} size={14} />
              {filteredSignals.length} signals found
            </p>
          </div>
        </div>
      </div>

      {/* Signals Grid */}
      {filteredSignals.length === 0 ? (
        <div
          className={`text-center py-12 rounded-xl ${darkMode ? "bg-gray-800" : "bg-white shadow-lg"}`}
        >
          <Icon
            icon={Icons.Search}
            size={60}
            color={darkMode ? "#6b7280" : "#9ca3af"}
            className="mx-auto mb-4"
          />
          <p
            className={`text-lg ${darkMode ? "text-gray-400" : "text-gray-500"}`}
          >
            No signals found for the selected filters.
          </p>
          <button
            onClick={() => {
              setSelectedMarket("all");
              setSelectedPair("all");
              setSortBy("latest");
            }}
            className="mt-4 text-orange-500 hover:underline inline-flex items-center gap-1"
          >
            <Icon icon={Icons.Close} size={14} />
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSignals.map((signal) => (
            <SignalCard
              key={signal.id}
              signal={signal}
              darkMode={darkMode}
              onBuy={() => handleBuyClick(signal)}
            />
          ))}
        </div>
      )}

      {/* Buy Modal */}
      {showBuyModal && selectedSignal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div
            className={`max-w-md w-full rounded-xl ${darkMode ? "bg-gray-800" : "bg-white"} p-6`}
          >
            <div className="flex justify-between items-center mb-4">
              <h2
                className={`text-xl font-bold flex items-center gap-2 ${darkMode ? "text-white" : "text-gray-800"}`}
              >
                <Icon icon={Icons.ShoppingCart} size={20} />
                Confirm Purchase
              </h2>
              <button
                onClick={() => setShowBuyModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <Icon icon={Icons.Close} size={20} />
              </button>
            </div>

            <div
              className={`p-4 rounded-lg mb-4 ${darkMode ? "bg-gray-700" : "bg-gray-50"}`}
            >
              <div className="flex justify-between mb-2">
                <span className={darkMode ? "text-gray-400" : "text-gray-500"}>
                  Signal:
                </span>
                <span
                  className={`font-semibold flex items-center gap-1 ${darkMode ? "text-white" : "text-gray-800"}`}
                >
                  <Icon icon={Icons.Chart} size={12} />
                  {selectedSignal.pair}
                </span>
              </div>
              <div className="flex justify-between mb-2">
                <span className={darkMode ? "text-gray-400" : "text-gray-500"}>
                  Provider:
                </span>
                <span
                  className={`font-semibold flex items-center gap-1 ${darkMode ? "text-white" : "text-gray-800"}`}
                >
                  <Icon icon={Icons.User} size={12} />
                  {selectedSignal.provider_name}
                </span>
              </div>
              <div className="flex justify-between mb-2">
                <span className={darkMode ? "text-gray-400" : "text-gray-500"}>
                  Price:
                </span>
                <span className="text-orange-500 font-bold flex items-center gap-1">
                  <Icon icon={Icons.Dollar} size={12} />${selectedSignal.price}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-600">
                <span className={darkMode ? "text-gray-400" : "text-gray-500"}>
                  Wallet Balance:
                </span>
                <span className="text-green-500 font-bold flex items-center gap-1">
                  <Icon icon={Icons.Wallet} size={12} />
                  $47.50
                </span>
              </div>
            </div>

            <div
              className={`text-sm mb-4 p-3 rounded-lg flex items-center gap-2 ${darkMode ? "bg-yellow-500/10 text-yellow-400" : "bg-yellow-50 text-yellow-600"}`}
            >
              <Icon icon={Icons.Flash} size={14} />
              Upon purchase, the full analysis will be revealed immediately.
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleConfirmPurchase}
                disabled={buying}
                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {buying ? (
                  <>
                    <Icon icon={Icons.Settings} size={16} spin={true} />
                    Processing...
                  </>
                ) : (
                  <>
                    <Icon icon={Icons.Check} size={16} />
                    Confirm - ${selectedSignal.price}
                  </>
                )}
              </button>
              <button
                onClick={() => setShowBuyModal(false)}
                className={`px-4 py-2 rounded-lg transition flex items-center gap-1 ${
                  darkMode
                    ? "bg-gray-700 hover:bg-gray-600 text-gray-300"
                    : "bg-gray-200 hover:bg-gray-300 text-gray-700"
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

// Signal Card Component
function SignalCard({ signal, darkMode, onBuy }) {
  const [purchased, setPurchased] = useState(false);
  const [fullAnalysis, setFullAnalysis] = useState(null);

  const getMarketColor = (market) => {
    switch (market) {
      case "forex":
        return "bg-green-500/20 text-green-500";
      case "crypto":
        return "bg-orange-500/20 text-orange-500";
      case "stocks":
        return "bg-blue-500/20 text-blue-500";
      default:
        return "bg-gray-500/20 text-gray-500";
    }
  };

  const getMarketIcon = (market) => {
    switch (market) {
      case "forex":
        return Icons.Exchange;
      case "crypto":
        return Icons.Bitcoin;
      case "stocks":
        return Icons.ChartBar;
      default:
        return Icons.Chart;
    }
  };

  const handleLocalBuy = () => {
    onBuy();
    if (window.confirm("Demo: Reveal full analysis?")) {
      setFullAnalysis(
        signal.analysis_full ||
          "This is the detailed analysis including technical indicators, support/resistance levels, and risk management tips for this trade setup.",
      );
      setPurchased(true);
    }
  };

  if (purchased && fullAnalysis) {
    return (
      <div
        className={`rounded-xl border-2 border-green-500/50 overflow-hidden ${darkMode ? "bg-gray-800" : "bg-white shadow-lg"}`}
      >
        <div className="p-5">
          <div className="flex justify-between items-start mb-3">
            <div>
              <span
                className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded ${getMarketColor(signal.market)}`}
              >
                <Icon icon={getMarketIcon(signal.market)} size={12} />
                {signal.market.toUpperCase()}
              </span>
              <p
                className={`font-bold text-lg mt-2 ${darkMode ? "text-white" : "text-gray-800"}`}
              >
                {signal.pair}
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-green-500">
                ${signal.price}
              </p>
              <p className="text-xs text-gray-500 flex items-center justify-end gap-1">
                <Icon icon={Icons.Check} size={10} /> purchased
              </p>
            </div>
          </div>

          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 mb-4">
            <p className="text-green-400 text-sm font-semibold mb-2 flex items-center gap-1">
              <Icon icon={Icons.Info} size={14} />
              Full Analysis Revealed:
            </p>
            <p
              className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-700"}`}
            >
              {fullAnalysis}
            </p>
          </div>

          <div className="text-center text-green-400 text-sm font-semibold py-2 flex items-center justify-center gap-1">
            <Icon icon={Icons.Check} size={14} />
            Signal Purchased - Analysis Available Above
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`rounded-xl border ${darkMode ? "bg-gray-800 border-gray-700 hover:border-orange-500/50" : "bg-white shadow-lg border-gray-200 hover:shadow-xl"} transition-all duration-300 overflow-hidden`}
    >
      <div className="p-5">
        {/* Header */}
        <div className="flex justify-between items-start mb-3">
          <div>
            <span
              className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded ${getMarketColor(signal.market)}`}
            >
              <Icon icon={getMarketIcon(signal.market)} size={12} />
              {signal.market.toUpperCase()}
            </span>
            <p
              className={`font-bold text-lg mt-2 ${darkMode ? "text-white" : "text-gray-800"}`}
            >
              {signal.pair}
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-orange-500">
              ${signal.price}
            </p>
            <p className="text-xs text-gray-500">per signal</p>
          </div>
        </div>

        {/* Provider Info */}
        <div className="flex items-center justify-between mb-4 text-sm">
          <div className="flex items-center gap-2">
            <Icon icon={Icons.User} size={12} />
            <span className={darkMode ? "text-gray-400" : "text-gray-500"}>
              Provider:
            </span>
            <span
              className={`font-medium ${darkMode ? "text-white" : "text-gray-800"}`}
            >
              {signal.provider_name}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Icon icon={Icons.Star} size={12} color="#eab308" />
            <span className={darkMode ? "text-gray-300" : "text-gray-700"}>
              {signal.provider_rating}
            </span>
          </div>
        </div>

        {/* Signal Preview (Entry, TP, SL) */}
        <div
          className={`rounded-lg p-3 mb-4 ${darkMode ? "bg-gray-700/50" : "bg-gray-50"}`}
        >
          <div className="grid grid-cols-3 gap-2 text-center text-sm">
            <div>
              <p className={darkMode ? "text-gray-400" : "text-gray-500"}>
                Entry
              </p>
              <p
                className={`font-mono font-semibold ${darkMode ? "text-white" : "text-gray-800"}`}
              >
                {signal.entry}
              </p>
            </div>
            <div>
              <p className={darkMode ? "text-gray-400" : "text-gray-500"}>TP</p>
              <p className="font-mono font-semibold text-green-500">
                {signal.tp}
              </p>
            </div>
            <div>
              <p className={darkMode ? "text-gray-400" : "text-gray-500"}>SL</p>
              <p className="font-mono font-semibold text-red-500">
                {signal.sl}
              </p>
            </div>
          </div>
        </div>

        {/* Preview Badge */}
        <div
          className={`text-center mb-4 text-xs flex items-center justify-center gap-1 ${darkMode ? "text-gray-500" : "text-gray-400"}`}
        >
          <Icon icon={Icons.Lock} size={10} />
          Full analysis revealed after purchase
        </div>

        {/* Buy Button */}
        <button
          onClick={handleLocalBuy}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded-lg transition transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
        >
          <Icon icon={Icons.Dollar} size={16} color="white" />
          Buy Signal - ${signal.price}
        </button>

        {/* Stats Footer */}
        <div
          className={`flex justify-between mt-3 pt-3 border-t text-xs ${darkMode ? "border-gray-700 text-gray-500" : "border-gray-100 text-gray-400"}`}
        >
          <span className="flex items-center gap-1">
            <Icon icon={Icons.Chart} size={10} />
            24h volume: 142 buys
          </span>
          <span className="flex items-center gap-1">
            <Icon icon={Icons.Star} size={10} color="#eab308" />
            89% liked
          </span>
        </div>
      </div>
    </div>
  );
}
