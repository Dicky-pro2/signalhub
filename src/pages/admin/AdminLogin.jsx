// src/pages/AdminLogin.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import Icon from "../../components/Icon";
import { Icons } from "../../components/Icons";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const { darkMode } = useTheme();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const userData = await signIn(email, password);

      if (userData.role !== "admin") {
        setError("Admin access required");
        setLoading(false);
        return;
      }

      navigate("/admin");
    } catch (err) {
      setError("Invalid credentials");
      setLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center px-4 ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}
    >
      <div className="w-full max-w-sm">
        {/* Logo - simple, no floating badges */}
        <div className="text-center mb-8">
          <Link
            to="/"
            className="text-xl font-medium inline-flex items-center gap-1"
          >
            <span className={darkMode ? "text-white" : "text-gray-900"}>
              Signal
            </span>
            <span className="text-orange-500">Hub</span>
          </Link>
          <p
            className={`text-sm mt-2 ${darkMode ? "text-gray-500" : "text-gray-400"}`}
          >
            Admin access
          </p>
        </div>

        {/* Simple card - no shadows, just border */}
        <div
          className={`border rounded-lg ${darkMode ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"}`}
        >
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {error && (
              <div className="text-red-500 text-sm text-center">{error}</div>
            )}

            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@signalhub.com"
                className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:border-orange-500 ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300 text-gray-800"
                }`}
                required
              />
            </div>

            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:border-orange-500 ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300 text-gray-800"
                }`}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium py-2 rounded-md transition disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>

            <div className="text-center pt-2">
              <Link
                to="/"
                className="text-xs text-gray-500 hover:text-orange-500"
              >
                ← Back to main site
              </Link>
            </div>
          </form>
        </div>

        {/* Simple footer - no extra elements */}
        <p
          className={`text-center text-xs mt-6 ${darkMode ? "text-gray-600" : "text-gray-400"}`}
        >
          Secure admin area
        </p>
      </div>
    </div>
  );
}
