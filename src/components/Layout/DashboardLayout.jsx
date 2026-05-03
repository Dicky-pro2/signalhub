import { useState } from "react";
import { Link, useLocation, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { Icons } from "../Icons";
import Icon from "../Icon";

export default function DashboardLayout() {
  const { user, signOut } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const role = user?.user_metadata?.role;

  const getNavigation = () => {
    if (role === "admin") {
      return [
        { name: "Dashboard", href: "/admin", icon: Icons.Dashboard },
        { name: "Users", href: "/admin/users", icon: Icons.Users },
        { name: "Providers", href: "/admin/providers", icon: Icons.Verified },
        { name: "Signals", href: "/admin/signals", icon: Icons.Chart },
        { name: "Transactions", href: "/admin/transactions", icon: Icons.Payment },
        { name: "Reports", href: "/admin/reports", icon: Icons.Reports },
        { name: "Settings", href: "/admin/settings", icon: Icons.Settings },
      ];
    } else if (role === "provider") {
      return [
        { name: "Dashboard", href: "/provider", icon: Icons.Dashboard },
        { name: "My Signals", href: "/provider/signals", icon: Icons.Chart },
        { name: "Create Signal", href: "/provider/create-signal", icon: Icons.Add },
        { name: "Earnings", href: "/provider/earnings", icon: Icons.Money },
        { name: "Withdraw", href: "/provider/withdraw", icon: Icons.Withdraw },
        { name: "Reviews", href: "/provider/reviews", icon: Icons.Reviews },
        { name: "Analytics", href: "/provider/analytics", icon: Icons.Analytics },
        { name: "Notifications", href: "/provider/notifications", icon: Icons.Notifications },
        { name: "Settings", href: "/provider/settings", icon: Icons.Settings },
      ];
    } else {
      return [
        { name: "Dashboard", href: "/dashboard", icon: Icons.Dashboard },
        { name: "Marketplace", href: "/marketplace", icon: Icons.Search },
        { name: "My Purchases", href: "/dashboard/purchases", icon: Icons.History },
        { name: "Watchlist", href: "/dashboard/watchlist", icon: Icons.Star },
        { name: "Wallet", href: "/dashboard/wallet", icon: Icons.Wallet },
        { name: "Notifications", href: "/dashboard/notifications", icon: Icons.Notifications },
        { name: "Settings", href: "/dashboard/settings", icon: Icons.Settings },
      ];
    }
  };

  const navigation = getNavigation();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <div className={`min-h-screen ${darkMode ? "dark bg-gray-900" : "bg-orange-50"}`}>
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-30 w-64 h-full transition-transform duration-300 ${
          darkMode
            ? "bg-gray-800 border-r border-gray-700"
            : "bg-white border-r border-orange-200"
        } ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-gray-700">
            <Link to="/" className="text-2xl font-bold flex items-center gap-2">
              <img src="/signalhub-logo.png" alt="SignalHub Logo" className="w-10 h-10" />
              <div>
                <span className={darkMode ? "text-white" : "text-gray-800"}>Signal</span>
                <span className="text-orange-500">Hub</span>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {navigation.map((item) => {
              const isActive =
                item.href === "/dashboard" ||
                item.href === "/provider" ||
                item.href === "/admin"
                  ? location.pathname === item.href
                  : location.pathname.startsWith(item.href);

              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-2 rounded-lg transition ${
                    isActive
                      ? darkMode
                        ? "bg-orange-500/20 text-orange-400"
                        : "bg-orange-100 text-orange-600"
                      : darkMode
                        ? "text-gray-300 hover:bg-gray-700 hover:text-white"
                        : "text-gray-600 hover:bg-orange-50 hover:text-orange-600"
                  }`}
                >
                  <Icon icon={item.icon} size={18} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* User info */}
          <div className={`p-4 border-t ${darkMode ? "border-gray-700" : "border-orange-100"}`}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                {user?.user_metadata?.full_name?.charAt(0) || user?.email?.charAt(0) || "U"}
              </div>
              <div className="flex-1">
                <p className={`text-sm font-medium ${darkMode ? "text-white" : "text-gray-800"}`}>
                  {user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User"}
                </p>
                <p className={`text-xs capitalize ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                  {role || "customer"}
                </p>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition ${
                darkMode
                  ? "text-red-400 hover:bg-red-500/20"
                  : "text-red-600 hover:bg-red-50"
              }`}
            >
              <Icon icon={Icons.Logout} size={16} />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:ml-64">
        {/* Top navbar */}
        <nav
          className={`sticky top-0 z-10 ${darkMode ? "bg-gray-800/95" : "bg-white/95"} backdrop-blur border-b ${darkMode ? "border-gray-700" : "border-orange-100"}`}
        >
          <div className="px-4 py-3 flex justify-between items-center">
            <button
              onClick={() => setSidebarOpen(true)}
              className={`lg:hidden p-2 rounded-lg ${darkMode ? "hover:bg-gray-700" : "hover:bg-orange-100"}`}
            >
              <Icon icon={Icons.Menu} size={20} />
            </button>

            <div className="flex items-center gap-4">
              {/* Theme toggle */}
              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-lg transition ${darkMode ? "hover:bg-gray-700" : "hover:bg-orange-100"}`}
              >
                {darkMode ? <Icon icon={Icons.Sun} size={18} /> : <Icon icon={Icons.Moon} size={18} />}
              </button>

              {/* Notifications - fixed to use role variable */}
              <Link
                to={role === "provider" ? "/provider/notifications" : role === "admin" ? "/admin" : "/dashboard/notifications"}
                className={`p-2 rounded-lg transition relative ${darkMode ? "hover:bg-gray-700" : "hover:bg-orange-100"}`}
              >
                <Icon icon={Icons.Notifications} size={18} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </Link>
            </div>
          </div>
        </nav>

        {/* Page content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}