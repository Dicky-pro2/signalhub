// src/pages/admin/AdminProviders.jsx
import { useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import Icon from "../../components/Icon";
import { Icons } from "../../components/Icons";
import { Link } from "react-router-dom";

export default function AdminProviders() {
  const { darkMode } = useTheme();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const [providers, setProviders] = useState([
    {
      id: 1,
      name: "CryptoKing",
      email: "crypto@example.com",
      status: "active",
      verified: true,
      joined: "2024-01-10",
      signals: 156,
      earnings: 3420.0,
      rating: 4.9,
    },
    {
      id: 2,
      name: "AIInvestor",
      email: "ai@example.com",
      status: "active",
      verified: true,
      joined: "2024-01-11",
      signals: 89,
      earnings: 2100.5,
      rating: 4.95,
    },
    {
      id: 3,
      name: "LondonTrader",
      email: "london@example.com",
      status: "pending",
      verified: false,
      joined: "2024-01-14",
      signals: 0,
      earnings: 0,
      rating: 0,
    },
    {
      id: 4,
      name: "SolanaBull",
      email: "solana@example.com",
      status: "active",
      verified: true,
      joined: "2024-01-09",
      signals: 67,
      earnings: 1450.75,
      rating: 4.85,
    },
    {
      id: 5,
      name: "NewTrader",
      email: "new@example.com",
      status: "pending",
      verified: false,
      joined: "2024-01-15",
      signals: 0,
      earnings: 0,
      rating: 0,
    },
  ]);

  const stats = {
    total: providers.length,
    active: providers.filter((p) => p.status === "active").length,
    pending: providers.filter((p) => p.status === "pending").length,
    totalSignals: providers.reduce((sum, p) => sum + p.signals, 0),
    totalEarnings: providers.reduce((sum, p) => sum + p.earnings, 0),
  };

  const filteredProviders = providers.filter((provider) => {
    const matchesSearch =
      provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      provider.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || provider.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const approveProvider = (id) => {
    setProviders(
      providers.map((p) =>
        p.id === id ? { ...p, status: "active", verified: true } : p,
      ),
    );
  };

  const rejectProvider = (id) => {
    if (window.confirm("Reject this provider application?")) {
      setProviders(providers.filter((p) => p.id !== id));
    }
  };

  const suspendProvider = (id) => {
    setProviders(
      providers.map((p) =>
        p.id === id
          ? { ...p, status: p.status === "active" ? "suspended" : "active" }
          : p,
      ),
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1
          className={`text-xl font-medium ${darkMode ? "text-white" : "text-gray-900"}`}
        >
          Providers
        </h1>
        <p
          className={`text-sm mt-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}
        >
          Manage signal providers and their applications
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div
          className={`border rounded-md p-3 ${darkMode ? "border-gray-700" : "border-gray-200"}`}
        >
          <p
            className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}
          >
            Total Providers
          </p>
          <p
            className={`text-xl font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}
          >
            {stats.total}
          </p>
        </div>
        <div
          className={`border rounded-md p-3 ${darkMode ? "border-gray-700" : "border-gray-200"}`}
        >
          <p
            className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}
          >
            Active
          </p>
          <p className={`text-xl font-semibold text-green-500`}>
            {stats.active}
          </p>
        </div>
        <div
          className={`border rounded-md p-3 ${darkMode ? "border-gray-700" : "border-gray-200"}`}
        >
          <p
            className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}
          >
            Pending
          </p>
          <p className={`text-xl font-semibold text-yellow-500`}>
            {stats.pending}
          </p>
        </div>
        <div
          className={`border rounded-md p-3 ${darkMode ? "border-gray-700" : "border-gray-200"}`}
        >
          <p
            className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}
          >
            Total Signals
          </p>
          <p
            className={`text-xl font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}
          >
            {stats.totalSignals}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Icon
            icon={Icons.Search}
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name or email..."
            className={`w-full pl-9 pr-3 py-1.5 text-sm border rounded-md focus:outline-none focus:border-orange-500 ${
              darkMode
                ? "bg-gray-800 border-gray-700 text-white"
                : "bg-white border-gray-300 text-gray-900"
            }`}
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className={`px-3 py-1.5 text-sm border rounded-md focus:outline-none focus:border-orange-500 ${
            darkMode
              ? "bg-gray-800 border-gray-700 text-white"
              : "bg-white border-gray-300 text-gray-900"
          }`}
        >
          <option value="all">All status</option>
          <option value="active">Active</option>
          <option value="pending">Pending</option>
          <option value="suspended">Suspended</option>
        </select>
      </div>

      {/* Providers Table */}
      <div
        className={`border rounded-md overflow-hidden ${darkMode ? "border-gray-700" : "border-gray-200"}`}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className={darkMode ? "bg-gray-800" : "bg-gray-50"}>
              <tr
                className={`border-b ${darkMode ? "border-gray-700" : "border-gray-200"}`}
              >
                <th className="text-left px-4 py-3 font-medium">Provider</th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
                <th className="text-left px-4 py-3 font-medium">Joined</th>
                <th className="text-left px-4 py-3 font-medium">Signals</th>
                <th className="text-left px-4 py-3 font-medium">Earnings</th>
                <th className="text-left px-4 py-3 font-medium">Rating</th>
                <th className="text-left px-4 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {filteredProviders.map((provider) => (
                <tr
                  key={provider.id}
                  className={`border-b ${darkMode ? "border-gray-700" : "border-gray-100"}`}
                >
                  <td className="px-4 py-3">
                    <div>
                      <p className={darkMode ? "text-white" : "text-gray-900"}>
                        {provider.name}
                      </p>
                      <p
                        className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-400"}`}
                      >
                        {provider.email}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        provider.status === "active"
                          ? "bg-green-500/10 text-green-500"
                          : provider.status === "pending"
                            ? "bg-yellow-500/10 text-yellow-500"
                            : "bg-red-500/10 text-red-500"
                      }`}
                    >
                      {provider.status}
                    </span>
                  </td>
                  <td
                    className={`px-4 py-3 ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                  >
                    {provider.joined}
                  </td>
                  <td
                    className={`px-4 py-3 ${darkMode ? "text-white" : "text-gray-900"}`}
                  >
                    {provider.signals}
                  </td>
                  <td className="px-4 py-3 text-orange-500">
                    ${provider.earnings.toFixed(2)}
                  </td>
                  <td className="px-4 py-3">
                    {provider.rating > 0 ? (
                      <div className="flex items-center gap-1">
                        <Icon icon={Icons.Star} size={12} color="#eab308" />
                        <span>{provider.rating}</span>
                      </div>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      {provider.status === "pending" ? (
                        <>
                          <button
                            onClick={() => approveProvider(provider.id)}
                            className="text-green-500 text-xs hover:underline"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => rejectProvider(provider.id)}
                            className="text-red-500 text-xs hover:underline"
                          >
                            Reject
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => suspendProvider(provider.id)}
                            className="text-yellow-500 text-xs hover:underline"
                          >
                            {provider.status === "active"
                              ? "Suspend"
                              : "Activate"}
                          </button>
                          <Link
                            to={`/admin/providers/${provider.id}`}
                            className="text-blue-500 text-xs hover:underline"
                          >
                            View
                          </Link>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
