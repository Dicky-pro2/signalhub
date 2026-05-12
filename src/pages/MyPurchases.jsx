import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../config/supabase";

export default function MyPurchases() {
  const { darkMode } = useTheme();
  const { user } = useAuth();
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const location = useLocation();

  useEffect(() => {
    if (!user) return;
    fetchPurchases();

    window.addEventListener("focus", fetchPurchases);
    return () => window.removeEventListener("focus", fetchPurchases);
  }, [user, location.key]);

  const fetchPurchases = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("subscriptions")
        .select("*") // <-- simplified, no joins
        .eq("customer_id", user.id)
        .order("created_at", { ascending: false });

      console.log("data:", data, "error:", error); // <-- check this in console
      if (error) throw error;
      setPurchases(data || []);
    } catch (err) {
      console.error("Failed to fetch purchases:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredPurchases =
    filter === "all" ? purchases : purchases.filter((p) => p.status === filter);

  const totalSpent = purchases.reduce((sum, p) => sum + (p.amount || 0), 0);
  const activeCount = purchases.filter((p) => p.status === "active").length;

  const text = darkMode ? "text-white" : "text-gray-800";
  const subtext = darkMode ? "text-gray-400" : "text-gray-500";
  const card = `rounded-xl p-4 ${darkMode ? "bg-gray-800" : "bg-white shadow-lg"}`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className={`text-2xl font-bold ${text}`}>My Purchases</h1>
        <p className={subtext}>View all your signal purchase history</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className={card}>
          <p className={`text-sm ${subtext}`}>Total Spent</p>
          <p className={`text-2xl font-bold ${text}`}>
            ${totalSpent.toFixed(2)}
          </p>
        </div>
        <div className={card}>
          <p className={`text-sm ${subtext}`}>Total Purchases</p>
          <p className={`text-2xl font-bold ${text}`}>{purchases.length}</p>
        </div>
        <div className={card}>
          <p className={`text-sm ${subtext}`}>Active Signals</p>
          <p className="text-2xl font-bold text-green-500">{activeCount}</p>
        </div>
        <div className={card}>
          <p className={`text-sm ${subtext}`}>Closed Signals</p>
          <p className={`text-2xl font-bold ${text}`}>
            {
              purchases.filter(
                (p) => p.status === "cancelled" || p.status === "expired",
              ).length
            }
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div
        className={`flex gap-2 border-b pb-2 ${darkMode ? "border-gray-700" : "border-gray-200"}`}
      >
        {["all", "active", "cancelled", "expired"].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 rounded-lg transition capitalize ${
              filter === tab
                ? "bg-orange-500 text-white"
                : darkMode
                  ? "text-gray-400 hover:text-white"
                  : "text-gray-600 hover:text-gray-800"
            }`}
          >
            {tab === "all" ? "All" : tab}
            {tab !== "all" && (
              <span className="ml-2 text-xs">
                ({purchases.filter((p) => p.status === tab).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Purchases List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filteredPurchases.length === 0 ? (
        <div
          className={`text-center py-12 rounded-xl ${darkMode ? "bg-gray-800" : "bg-white shadow-lg"}`}
        >
          <div className="text-6xl mb-4">📦</div>
          <p className={`text-lg ${subtext}`}>No purchases found</p>
          <Link
            to="/marketplace"
            className="text-orange-500 hover:underline mt-2 inline-block"
          >
            Browse Marketplace →
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredPurchases.map((purchase) => {
            const signal = purchase.signals;
            const provider = purchase.profiles;

            return (
              <div
                key={purchase.id}
                className={`rounded-xl p-5 ${darkMode ? "bg-gray-800" : "bg-white shadow-lg"}`}
              >
                <div className="flex flex-wrap justify-between items-start gap-4">
                  {/* Left side */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3 flex-wrap">
                      <h3 className={`text-lg font-bold ${text}`}>
                        {signal?.asset || "Unknown Asset"}
                      </h3>
                      {signal?.signal_type && (
                        <span
                          className={`text-xs px-2 py-1 rounded ${
                            signal.signal_type === "buy"
                              ? "bg-green-500/20 text-green-500"
                              : "bg-red-500/20 text-red-500"
                          }`}
                        >
                          {signal.signal_type.toUpperCase()}
                        </span>
                      )}
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          purchase.status === "active"
                            ? "bg-green-500/20 text-green-500"
                            : "bg-gray-500/20 text-gray-400"
                        }`}
                      >
                        {purchase.status}
                      </span>
                      {signal?.result && (
                        <span
                          className={`text-xs px-2 py-1 rounded ${
                            signal.result === "win"
                              ? "bg-green-500/20 text-green-500"
                              : signal.result === "loss"
                                ? "bg-red-500/20 text-red-500"
                                : "bg-yellow-500/20 text-yellow-500"
                          }`}
                        >
                          {signal.result.toUpperCase()}
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                      <div>
                        <p className={subtext}>Provider</p>
                        <p className={`font-medium ${text}`}>
                          {provider?.full_name || "Unknown"}
                        </p>
                      </div>
                      <div>
                        <p className={subtext}>Entry</p>
                        <p className={`font-mono ${text}`}>
                          {signal?.entry_price || "—"}
                        </p>
                      </div>
                      <div>
                        <p className={subtext}>TP / SL</p>
                        <p className={`font-mono ${text}`}>
                          {signal?.target_price || "—"} /{" "}
                          {signal?.stop_loss || "—"}
                        </p>
                      </div>
                      <div>
                        <p className={subtext}>Timeframe</p>
                        <p className={`font-medium ${text}`}>
                          {signal?.timeframe || "—"}
                        </p>
                      </div>
                    </div>

                    {/* Full Analysis */}
                    {signal?.description && (
                      <details className="mt-2">
                        <summary
                          className={`text-sm cursor-pointer ${darkMode ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-gray-700"}`}
                        >
                          📋 View Full Analysis
                        </summary>
                        <div
                          className={`mt-2 p-3 rounded-lg text-sm ${darkMode ? "bg-gray-700" : "bg-gray-50"}`}
                        >
                          {signal.description}
                        </div>
                      </details>
                    )}
                  </div>

                  {/* Right side */}
                  <div className="text-right">
                    <p className="text-orange-500 font-bold text-xl">
                      {purchase.amount === 0
                        ? "Free"
                        : `$${purchase.amount?.toFixed(2)}`}
                    </p>
                    <p className={`text-xs ${subtext} mt-1`}>
                      {new Date(purchase.created_at).toLocaleDateString()}
                    </p>
                    {purchase.expires_at && (
                      <p className={`text-xs ${subtext} mt-1`}>
                        Expires:{" "}
                        {new Date(purchase.expires_at).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
