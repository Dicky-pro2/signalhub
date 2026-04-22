import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import Icon from "../components/Icon";
import { Icons } from "../components/Icons";
import PerformanceChart from "./PerformanceChart";

export default function ProviderDashboard() {
  const { user } = useAuth();
  const { darkMode } = useTheme();
  const navigate = useNavigate();
  const [period, setPeriod] = useState("weekly");

  const stats = {
    totalSignals: 47,
    activeSignals: 12,
    totalEarnings: 1247.89,
    thisWeekEarnings: 342.5,
    avgRating: 4.85,
    winRate: 82,
    totalSubscribers: 156,
    pendingPayout: 423.67,
  };

  const recentSignals = [
    {
      id: 1,
      pair: "BTC/USD",
      market: "crypto",
      price: 4.99,
      purchases: 23,
      revenue: 114.77,
      status: "active",
      createdAt: "2024-01-15",
    },
    {
      id: 2,
      pair: "ETH/USD",
      market: "crypto",
      price: 3.99,
      purchases: 18,
      revenue: 71.82,
      status: "active",
      createdAt: "2024-01-14",
    },
    {
      id: 3,
      pair: "EUR/USD",
      market: "forex",
      price: 2.99,
      purchases: 31,
      revenue: 92.69,
      status: "active",
      createdAt: "2024-01-13",
    },
    {
      id: 4,
      pair: "NVDA",
      market: "stocks",
      price: 4.99,
      purchases: 12,
      revenue: 59.88,
      status: "closed",
      createdAt: "2024-01-10",
    },
  ];

  const performanceData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    earnings: [42.5, 67.8, 89.3, 54.2, 78.5, 12.2, 0],
  };

  const topReviews = [
    {
      id: 1,
      user: "Marcus T.",
      rating: 5,
      comment: "Best signals on the platform. Consistent profits!",
      date: "2024-01-14",
    },
    {
      id: 2,
      user: "Sarah K.",
      rating: 5,
      comment: "Very detailed analysis. Worth every penny.",
      date: "2024-01-13",
    },
    {
      id: 3,
      user: "David L.",
      rating: 4,
      comment: "Good signals, would appreciate more entries.",
      date: "2024-01-12",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1
            className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-800"}`}
          >
            Provider Dashboard
          </h1>
          <p className={darkMode ? "text-gray-400" : "text-gray-500"}>
            Welcome back, {user?.full_name || "Expert Trader"}! 📈
          </p>
        </div>
        <Link
          to="/provider/create-signal"
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition flex items-center gap-2"
        >
          ✏️ Create New Signal
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div
          className={`rounded-xl p-4 ${darkMode ? "bg-gray-800" : "bg-white shadow-lg"}`}
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl"><Icon icon={Icons.Chart} size={24} color="#f97316" /></span>
            <span
              className={`text-xs px-2 py-1 rounded-full bg-orange-500/20 text-orange-500`}
            >
              Signals
            </span>
          </div>
          <p
            className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-800"}`}
          >
            {stats.totalSignals}
          </p>
          <p
            className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
          >
            Total signals posted
          </p>
        </div>

        <div
          className={`rounded-xl p-4 ${darkMode ? "bg-gray-800" : "bg-white shadow-lg"}`}
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl"><Icon icon={Icons.Dollar} size={24} color="#10b981" /></span>
            <span
              className={`text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-500`}
            >
              Earnings
            </span>
          </div>
          <p
            className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-800"}`}
          >
            ${stats.totalEarnings.toFixed(2)}
          </p>
          <p
            className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
          >
            +${stats.thisWeekEarnings.toFixed(2)} this week
          </p>
        </div>

        <div
          className={`rounded-xl p-4 ${darkMode ? "bg-gray-800" : "bg-white shadow-lg"}`}
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl"><Icon icon={Icons.Star} size={24} color="#fbbf24" /></span>
            <span
              className={`text-xs px-2 py-1 rounded-full bg-yellow-500/20 text-yellow-500`}
            >
              Rating
            </span>
          </div>
          <p
            className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-800"}`}
          >
            {stats.avgRating}
          </p>
          <p
            className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
          >
            Average rating (5 stars)
          </p>
        </div>

        <div
          className={`rounded-xl p-4 ${darkMode ? "bg-gray-800" : "bg-white shadow-lg"}`}
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl"><Icon icon={Icons.Target} size={24} color="#8b5cf6" /></span>
            <span
              className={`text-xs px-2 py-1 rounded-full bg-purple-500/20 text-purple-500`}
            >
              Win Rate
            </span>
          </div>
          <p
            className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-800"}`}
          >
            {stats.winRate}%
          </p>
          <p
            className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
          >
            Last 30 days
          </p>
        </div>
      </div>

     <PerformanceChart />

      

      {/* Recent Signals */}
      <div
        className={`rounded-xl ${darkMode ? "bg-gray-800" : "bg-white shadow-lg"} p-6`}
      >
        <div className="flex justify-between items-center mb-4">
          <h2
            className={`text-xl font-bold ${darkMode ? "text-white" : "text-gray-800"}`}
          >
            Recent Signals
          </h2>
          <Link
            to="/provider/signals"
            className="text-orange-500 text-sm hover:underline"
          >
            Manage all →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={darkMode ? "text-gray-400" : "text-gray-500"}>
              <tr className="border-b border-gray-700">
                <th className="text-left py-2">Pair</th>
                <th className="text-left py-2">Market</th>
                <th className="text-left py-2">Price</th>
                <th className="text-left py-2">Purchases</th>
                <th className="text-left py-2">Revenue</th>
                <th className="text-left py-2">Status</th>
                <th className="text-left py-2"></th>
              </tr>
            </thead>
            <tbody>
              {recentSignals.map((signal) => (
                <tr key={signal.id} className="border-b border-gray-700/50">
                  <td
                    className={`py-3 font-medium ${darkMode ? "text-white" : "text-gray-800"}`}
                  >
                    {signal.pair}
                  </td>
                  <td>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        signal.market === "crypto"
                          ? "bg-orange-500/20 text-orange-500"
                          : signal.market === "forex"
                            ? "bg-green-500/20 text-green-500"
                            : "bg-blue-500/20 text-blue-500"
                      }`}
                    >
                      {signal.market}
                    </span>
                  </td>
                  <td className={darkMode ? "text-gray-300" : "text-gray-600"}>
                    ${signal.price}
                  </td>
                  <td className={darkMode ? "text-gray-300" : "text-gray-600"}>
                    {signal.purchases}
                  </td>
                  <td className="text-green-500">
                    ${signal.revenue.toFixed(2)}
                  </td>
                  <td>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        signal.status === "active"
                          ? "bg-green-500/20 text-green-500"
                          : "bg-gray-500/20 text-gray-400"
                      }`}
                    >
                      {signal.status}
                    </span>
                  </td>
                  <td>
                    <button className="text-orange-500 text-sm hover:underline">
                      Edit →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reviews & Pending Payout */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Recent Reviews */}
        <div
          className={`rounded-xl ${darkMode ? "bg-gray-800" : "bg-white shadow-lg"} p-6`}
        >
          <h2
            className={`text-xl font-bold mb-4 ${darkMode ? "text-white" : "text-gray-800"}`}
          >
            Recent Reviews
          </h2>
          <div className="space-y-4">
            {topReviews.map((review) => (
              <div
                key={review.id}
                className={`pb-3 border-b ${darkMode ? "border-gray-700" : "border-gray-100"}`}
              >
                <div className="flex justify-between items-start mb-1">
                  <p
                    className={`font-medium ${darkMode ? "text-white" : "text-gray-800"}`}
                  >
                    {review.user}
                  </p>
                  <div className="flex text-yellow-500">
                    {"★".repeat(review.rating)}
                    {"☆".repeat(5 - review.rating)}
                  </div>
                </div>
                <p
                  className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  "{review.comment}"
                </p>
                <p
                  className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-400"} mt-1`}
                >
                  {review.date}
                </p>
              </div>
            ))}
          </div>
          <Link
            to="/provider/reviews"
            className="text-orange-500 text-sm mt-4 inline-block hover:underline"
          >
            View all reviews →
          </Link>
        </div>

        {/* Pending Payout & Quick Stats */}
        <div
          className={`rounded-xl ${darkMode ? "bg-gray-800" : "bg-white shadow-lg"} p-6`}
        >
          <h2
            className={`text-xl font-bold mb-4 ${darkMode ? "text-white" : "text-gray-800"}`}
          >
            Pending Payout
          </h2>
          <div className="text-center mb-6">
            <p className={`text-4xl font-bold text-orange-500`}>
              ${stats.pendingPayout.toFixed(2)}
            </p>
            <p
              className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"} mt-1`}
            >
              Available for withdrawal
            </p>
            <button
              type="button"
              onClick={() => navigate("/provider/withdraw")}
              className="mt-4 bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition"
            >
              Withdraw Funds →
            </button>
          </div>

          <div
            className={`pt-4 border-t ${darkMode ? "border-gray-700" : "border-gray-100"}`}
          >
            <div className="flex justify-between mb-2">
              <span className={darkMode ? "text-gray-400" : "text-gray-500"}>
                Total Subscribers
              </span>
              <span
                className={`font-semibold ${darkMode ? "text-white" : "text-gray-800"}`}
              >
                {stats.totalSubscribers}
              </span>
            </div>
            <div className="flex justify-between">
              <span className={darkMode ? "text-gray-400" : "text-gray-500"}>
                Platform Fee (20%)
              </span>
              <span
                className={`font-semibold ${darkMode ? "text-white" : "text-gray-800"}`}
              >
                ${(stats.totalEarnings * 0.25).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
