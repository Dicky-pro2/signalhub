import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import Icon from "../../components/Icon";
import { Icons } from "../../components/Icons";

export default function AdminDashboard() {
  const { darkMode } = useTheme();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(false);

  // Mock data - replace with API calls
  const [stats, setStats] = useState({
    totalUsers: 1247,
    totalProviders: 48,
    pendingProviders: 7,
    totalSignals: 523,
    activeSignals: 187,
    totalVolume: 28473.5,
    platformFees: 5694.7,
    totalPayouts: 22778.8,
    monthlyGrowth: 23.5,
  });

  const [pendingProvidersList, setPendingProvidersList] = useState([
    {
      id: 1,
      name: "John Smith",
      email: "john@example.com",
      experience: "5 years forex trading",
      submittedAt: "2024-01-14",
      winRate: "76%",
      documents: true,
    },
    {
      id: 2,
      name: "Emma Wilson",
      email: "emma@example.com",
      experience: "3 years crypto trading",
      submittedAt: "2024-01-14",
      winRate: "82%",
      documents: true,
    },
    {
      id: 3,
      name: "Michael Chen",
      email: "michael@example.com",
      experience: "8 years stocks",
      submittedAt: "2024-01-13",
      winRate: "71%",
      documents: false,
    },
    {
      id: 4,
      name: "Sarah Johnson",
      email: "sarah@example.com",
      experience: "4 years forex and crypto",
      submittedAt: "2024-01-12",
      winRate: "88%",
      documents: true,
    },
  ]);

  const [flaggedSignals, setFlaggedSignals] = useState([
    {
      id: 1,
      pair: "DOGE/USD",
      provider: "MemeMaster",
      price: 19.99,
      reports: 3,
      reason: "Price too high",
      status: "pending",
      createdAt: "2024-01-15",
    },
    {
      id: 2,
      pair: "SHIB/USD",
      provider: "ShillKing",
      price: 49.99,
      reports: 5,
      reason: "Suspicious analysis",
      status: "pending",
      createdAt: "2024-01-14",
    },
    {
      id: 3,
      pair: "PEPE/USD",
      provider: "FrogTrader",
      price: 29.99,
      reports: 2,
      reason: "Misleading entry",
      status: "reviewing",
      createdAt: "2024-01-13",
    },
  ]);

  const [recentTransactions, setRecentTransactions] = useState([
    {
      id: 1,
      user: "Marcus T.",
      type: "deposit",
      amount: 50.0,
      status: "completed",
      date: "2024-01-15",
    },
    {
      id: 2,
      user: "Sarah K.",
      type: "purchase",
      amount: 4.99,
      status: "completed",
      date: "2024-01-15",
    },
    {
      id: 3,
      user: "David L.",
      type: "withdrawal",
      amount: 150.0,
      status: "pending",
      date: "2024-01-14",
    },
    {
      id: 4,
      user: "CryptoKing",
      type: "payout",
      amount: 342.5,
      status: "processing",
      date: "2024-01-14",
    },
    {
      id: 5,
      user: "AIInvestor",
      type: "withdrawal",
      amount: 200.0,
      status: "completed",
      date: "2024-01-13",
    },
  ]);

  const [allUsers, setAllUsers] = useState([
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      role: "customer",
      status: "active",
      joined: "2024-01-01",
      spent: 47.5,
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      role: "provider",
      status: "active",
      joined: "2024-01-02",
      earned: 1247.89,
    },
    {
      id: 3,
      name: "Bob Johnson",
      email: "bob@example.com",
      role: "customer",
      status: "suspended",
      joined: "2024-01-03",
      spent: 12.99,
    },
    {
      id: 4,
      name: "Alice Brown",
      email: "alice@example.com",
      role: "provider",
      status: "pending",
      joined: "2024-01-04",
      earned: 0,
    },
  ]);

  // Actions
  const approveProvider = (id) => {
    setPendingProvidersList(pendingProvidersList.filter((p) => p.id !== id));
    setStats({
      ...stats,
      pendingProviders: stats.pendingProviders - 1,
      totalProviders: stats.totalProviders + 1,
    });
  };

  const rejectProvider = (id) => {
    setPendingProvidersList(pendingProvidersList.filter((p) => p.id !== id));
    setStats({ ...stats, pendingProviders: stats.pendingProviders - 1 });
  };

  const removeSignal = (id) => {
    setFlaggedSignals(flaggedSignals.filter((s) => s.id !== id));
  };

  const updateUserStatus = (id, status) => {
    setAllUsers(allUsers.map((u) => (u.id === id ? { ...u, status } : u)));
  };

  // Chart data
  const weeklyData = [1250, 1890, 2100, 1780, 2450, 2980, 2670];
  const maxValue = Math.max(...weeklyData);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1
          className={`text-2xl font-bold flex items-center gap-2 ${darkMode ? "text-white" : "text-gray-800"}`}
        >
          <Icon icon={Icons.Dashboard} size={24} />
          Admin Dashboard
        </h1>
        <p className={darkMode ? "text-gray-400" : "text-gray-500"}>
          Welcome back, {user?.full_name || "Admin"}! Here's your platform
          overview
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-xl p-4 ${darkMode ? "bg-gray-800" : "bg-white shadow-lg"}`}
        >
          <div className="flex items-center justify-between mb-2">
            <span
              className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
            >
              Total Users
            </span>
            <Icon icon={Icons.Users} size={20} color="#3b82f6" />
          </div>
          <p
            className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-800"}`}
          >
            {stats.totalUsers.toLocaleString()}
          </p>
          <p
            className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-400"} mt-1`}
          >
            +{Math.floor(stats.totalUsers * 0.12)} this month
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`rounded-xl p-4 ${darkMode ? "bg-gray-800" : "bg-white shadow-lg"}`}
        >
          <div className="flex items-center justify-between mb-2">
            <span
              className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
            >
              Providers
            </span>
            <Icon icon={Icons.Verified} size={20} color="#f97316" />
          </div>
          <p
            className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-800"}`}
          >
            {stats.totalProviders}
          </p>
          <p
            className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-400"} mt-1`}
          >
            {stats.pendingProviders} pending approval
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`rounded-xl p-4 ${darkMode ? "bg-gray-800" : "bg-white shadow-lg"}`}
        >
          <div className="flex items-center justify-between mb-2">
            <span
              className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
            >
              Total Volume
            </span>
            <Icon icon={Icons.Money} size={20} color="#22c55e" />
          </div>
          <p
            className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-800"}`}
          >
            ${stats.totalVolume.toLocaleString()}
          </p>
          <p className={`text-xs text-green-500 mt-1`}>
            +{stats.monthlyGrowth}% growth
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={`rounded-xl p-4 ${darkMode ? "bg-gray-800" : "bg-white shadow-lg"}`}
        >
          <div className="flex items-center justify-between mb-2">
            <span
              className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
            >
              Platform Fees
            </span>
            <Icon icon={Icons.Payment} size={20} color="#f97316" />
          </div>
          <p className={`text-2xl font-bold text-orange-500`}>
            ${stats.platformFees.toLocaleString()}
          </p>
          <p
            className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-400"} mt-1`}
          >
            From {stats.totalSignals} signals
          </p>
        </motion.div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-gray-700 pb-2">
        {[
          { id: "overview", label: "Overview", icon: Icons.Dashboard },
          { id: "providers", label: "Providers", icon: Icons.Verified },
          { id: "signals", label: "Signals", icon: Icons.Chart },
          { id: "users", label: "Users", icon: Icons.Users },
          { id: "transactions", label: "Transactions", icon: Icons.Payment },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
              activeTab === tab.id
                ? "bg-orange-500 text-white"
                : darkMode
                  ? "text-gray-400 hover:text-white hover:bg-gray-800"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
            }`}
          >
            <Icon icon={tab.icon} size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Revenue Chart */}
          <div
            className={`rounded-xl p-6 ${darkMode ? "bg-gray-800" : "bg-white shadow-lg"}`}
          >
            <h2
              className={`text-lg font-bold mb-4 ${darkMode ? "text-white" : "text-gray-800"}`}
            >
              Weekly Revenue
            </h2>
            <div className="h-48 flex items-end gap-2">
              {weeklyData.map((value, idx) => (
                <div
                  key={idx}
                  className="flex-1 flex flex-col items-center gap-2"
                >
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(value / maxValue) * 100}%` }}
                    transition={{ duration: 0.8, delay: idx * 0.1 }}
                    className="w-full bg-gradient-to-t from-orange-500 to-red-500 rounded-t"
                    style={{ height: `${(value / maxValue) * 100}%` }}
                  />
                  <span
                    className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                  >
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][idx]}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 text-center">
              <p
                className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
              >
                Total this week:{" "}
                <span className="text-orange-500 font-bold">$15,820</span>
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-3 gap-4">
            <div
              className={`rounded-xl p-4 ${darkMode ? "bg-gray-800" : "bg-white shadow-lg"} text-center`}
            >
              <Icon
                icon={Icons.UserPlus}
                size={32}
                color="#f97316"
                className="mx-auto mb-2"
              />
              <h3
                className={`font-semibold ${darkMode ? "text-white" : "text-gray-800"}`}
              >
                Pending Approvals
              </h3>
              <p className={`text-2xl font-bold text-orange-500 my-2`}>
                {stats.pendingProviders}
              </p>
              <button
                onClick={() => setActiveTab("providers")}
                className="text-sm text-orange-500 hover:underline"
              >
                Review Now →
              </button>
            </div>
            <div
              className={`rounded-xl p-4 ${darkMode ? "bg-gray-800" : "bg-white shadow-lg"} text-center`}
            >
              <Icon
                icon={Icons.Warning}
                size={32}
                color="#eab308"
                className="mx-auto mb-2"
              />
              <h3
                className={`font-semibold ${darkMode ? "text-white" : "text-gray-800"}`}
              >
                Flagged Signals
              </h3>
              <p className={`text-2xl font-bold text-yellow-500 my-2`}>
                {flaggedSignals.length}
              </p>
              <button
                onClick={() => setActiveTab("signals")}
                className="text-sm text-orange-500 hover:underline"
              >
                Review Now →
              </button>
            </div>
            <div
              className={`rounded-xl p-4 ${darkMode ? "bg-gray-800" : "bg-white shadow-lg"} text-center`}
            >
              <Icon
                icon={Icons.Withdraw}
                size={32}
                color="#22c55e"
                className="mx-auto mb-2"
              />
              <h3
                className={`font-semibold ${darkMode ? "text-white" : "text-gray-800"}`}
              >
                Pending Payouts
              </h3>
              <p className={`text-2xl font-bold text-green-500 my-2`}>$4,231</p>
              <button className="text-sm text-orange-500 hover:underline">
                Process →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Providers Tab */}
      {activeTab === "providers" && (
        <div
          className={`rounded-xl ${darkMode ? "bg-gray-800" : "bg-white shadow-lg"} p-6`}
        >
          <h2
            className={`text-lg font-bold mb-4 ${darkMode ? "text-white" : "text-gray-800"}`}
          >
            Pending Provider Applications
          </h2>

          {pendingProvidersList.length === 0 ? (
            <div className="text-center py-8">
              <Icon
                icon={Icons.Verified}
                size={48}
                color="#22c55e"
                className="mx-auto mb-3"
              />
              <p className={darkMode ? "text-gray-400" : "text-gray-500"}>
                No pending applications
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingProvidersList.map((provider) => (
                <div
                  key={provider.id}
                  className={`p-4 rounded-lg ${darkMode ? "bg-gray-700" : "bg-gray-50"}`}
                >
                  <div className="flex flex-wrap justify-between items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3
                          className={`font-semibold ${darkMode ? "text-white" : "text-gray-800"}`}
                        >
                          {provider.name}
                        </h3>
                        {!provider.documents && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-500">
                            Missing Docs
                          </span>
                        )}
                      </div>
                      <p
                        className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                      >
                        {provider.email}
                      </p>
                      <p
                        className={`text-sm mt-2 ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                      >
                        📊 Experience: {provider.experience}
                      </p>
                      <p
                        className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                      >
                        🎯 Reported win rate: {provider.winRate}
                      </p>
                      <p
                        className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-400"} mt-2`}
                      >
                        Submitted: {provider.submittedAt}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => approveProvider(provider.id)}
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-1.5 rounded-lg transition text-sm flex items-center gap-1"
                      >
                        <Icon icon={Icons.Success} size={14} />
                        Approve
                      </button>
                      <button
                        onClick={() => rejectProvider(provider.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-lg transition text-sm flex items-center gap-1"
                      >
                        <Icon icon={Icons.Delete} size={14} />
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Signals Tab */}
      {activeTab === "signals" && (
        <div
          className={`rounded-xl ${darkMode ? "bg-gray-800" : "bg-white shadow-lg"} p-6`}
        >
          <h2
            className={`text-lg font-bold mb-4 ${darkMode ? "text-white" : "text-gray-800"}`}
          >
            ⚠️ Flagged Signals
          </h2>

          {flaggedSignals.length === 0 ? (
            <div className="text-center py-8">
              <Icon
                icon={Icons.Success}
                size={48}
                color="#22c55e"
                className="mx-auto mb-3"
              />
              <p className={darkMode ? "text-gray-400" : "text-gray-500"}>
                No flagged signals
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {flaggedSignals.map((signal) => (
                <div
                  key={signal.id}
                  className={`p-4 rounded-lg border ${darkMode ? "border-red-500/30 bg-red-500/10" : "border-red-200 bg-red-50"}`}
                >
                  <div className="flex flex-wrap justify-between items-start gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3
                          className={`font-semibold ${darkMode ? "text-white" : "text-gray-800"}`}
                        >
                          {signal.pair} - {signal.provider}
                        </h3>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${
                            signal.status === "pending"
                              ? "bg-yellow-500/20 text-yellow-500"
                              : "bg-orange-500/20 text-orange-500"
                          }`}
                        >
                          {signal.status}
                        </span>
                      </div>
                      <p
                        className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                      >
                        Price: ${signal.price} | Reports: {signal.reports}
                      </p>
                      <p
                        className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                      >
                        Reason: {signal.reason}
                      </p>
                      <p
                        className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-400"} mt-2`}
                      >
                        Created: {signal.createdAt}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1.5 rounded-lg transition text-sm">
                        Review
                      </button>
                      <button
                        onClick={() => removeSignal(signal.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg transition text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Users Tab */}
      {activeTab === "users" && (
        <div
          className={`rounded-xl ${darkMode ? "bg-gray-800" : "bg-white shadow-lg"} overflow-hidden`}
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={darkMode ? "bg-gray-700" : "bg-gray-50"}>
                <tr>
                  <th className="text-left px-4 py-3">User</th>
                  <th className="text-left px-4 py-3">Role</th>
                  <th className="text-left px-4 py-3">Status</th>
                  <th className="text-left px-4 py-3">Joined</th>
                  <th className="text-left px-4 py-3">Activity</th>
                  <th className="text-left px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {allUsers.map((user) => (
                  <tr key={user.id} className="border-b border-gray-700/50">
                    <td className="px-4 py-3">
                      <div>
                        <p
                          className={`font-medium ${darkMode ? "text-white" : "text-gray-800"}`}
                        >
                          {user.name}
                        </p>
                        <p
                          className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                        >
                          {user.email}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          user.role === "provider"
                            ? "bg-orange-500/20 text-orange-500"
                            : "bg-blue-500/20 text-blue-500"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          user.status === "active"
                            ? "bg-green-500/20 text-green-500"
                            : user.status === "suspended"
                              ? "bg-red-500/20 text-red-500"
                              : "bg-yellow-500/20 text-yellow-500"
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td
                      className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                    >
                      {user.joined}
                    </td>
                    <td
                      className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                    >
                      {user.role === "provider"
                        ? `$${user.earned} earned`
                        : `$${user.spent} spent`}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            updateUserStatus(
                              user.id,
                              user.status === "active" ? "suspended" : "active",
                            )
                          }
                          className={`text-xs px-2 py-1 rounded transition ${
                            user.status === "active"
                              ? "text-red-500 hover:bg-red-500/10"
                              : "text-green-500 hover:bg-green-500/10"
                          }`}
                        >
                          {user.status === "active" ? "Suspend" : "Activate"}
                        </button>
                        <button className="text-orange-500 text-xs hover:underline">
                          View
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Transactions Tab */}
      {activeTab === "transactions" && (
        <div
          className={`rounded-xl ${darkMode ? "bg-gray-800" : "bg-white shadow-lg"} overflow-hidden`}
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={darkMode ? "bg-gray-700" : "bg-gray-50"}>
                <tr>
                  <th className="text-left px-4 py-3">User</th>
                  <th className="text-left px-4 py-3">Type</th>
                  <th className="text-left px-4 py-3">Amount</th>
                  <th className="text-left px-4 py-3">Status</th>
                  <th className="text-left px-4 py-3">Date</th>
                  <th className="text-left px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.map((tx) => (
                  <tr key={tx.id} className="border-b border-gray-700/50">
                    <td
                      className={`py-3 font-medium ${darkMode ? "text-white" : "text-gray-800"}`}
                    >
                      {tx.user}
                    </td>
                    <td className="py-3 capitalize">{tx.type}</td>
                    <td
                      className={`py-3 font-semibold ${
                        tx.type === "deposit"
                          ? "text-green-500"
                          : tx.type === "withdrawal"
                            ? "text-red-500"
                            : "text-orange-500"
                      }`}
                    >
                      {tx.type === "deposit" ? "+" : "-"}${tx.amount.toFixed(2)}
                    </td>
                    <td className="py-3">
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          tx.status === "completed"
                            ? "bg-green-500/20 text-green-500"
                            : tx.status === "pending"
                              ? "bg-yellow-500/20 text-yellow-500"
                              : "bg-blue-500/20 text-blue-500"
                        }`}
                      >
                        {tx.status}
                      </span>
                    </td>
                    <td
                      className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                    >
                      {tx.date}
                    </td>
                    <td className="py-3">
                      <button className="text-orange-500 text-sm hover:underline">
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
