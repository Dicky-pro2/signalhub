// src/pages/admin/ProviderDetails.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import Icon from '../../components/Icon';
import { Icons } from '../../components/Icons';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export default function ProviderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [chartType, setChartType] = useState('line');

  // Mock data - replace with API call
  useEffect(() => {
    setTimeout(() => {
      const providersData = {
        1: {
          id: 1,
          name: 'CryptoKing',
          email: 'crypto@example.com',
          status: 'active',
          verified: true,
          joined: '2024-01-10',
          signals: 156,
          earnings: 3420.00,
          rating: 4.9,
          winRate: 84,
          totalSubscribers: 234,
          totalPurchases: 1876,
          bio: 'Professional crypto trader with 7 years of experience. Specializing in Bitcoin and Ethereum analysis.',
          experience: '7 years',
          location: 'Singapore',
          website: 'https://cryptoking.com',
          twitter: '@cryptoking',
          telegram: 'cryptoking_official',
          recentSignals: [
            { id: 1, pair: 'BTC/USD', price: 4.99, purchases: 45, date: '2024-01-15', status: 'active' },
            { id: 2, pair: 'ETH/USD', price: 3.99, purchases: 38, date: '2024-01-14', status: 'active' },
            { id: 3, pair: 'SOL/USD', price: 3.49, purchases: 29, date: '2024-01-13', status: 'active' },
          ],
          monthlyData: [
            { month: 'Jan', earnings: 320, signals: 12, subscribers: 45 },
            { month: 'Feb', earnings: 450, signals: 18, subscribers: 62 },
            { month: 'Mar', earnings: 380, signals: 15, subscribers: 78 },
            { month: 'Apr', earnings: 520, signals: 22, subscribers: 95 },
            { month: 'May', earnings: 610, signals: 28, subscribers: 112 },
            { month: 'Jun', earnings: 680, signals: 32, subscribers: 134 },
            { month: 'Jul', earnings: 750, signals: 35, subscribers: 156 },
            { month: 'Aug', earnings: 820, signals: 38, subscribers: 178 },
            { month: 'Sep', earnings: 890, signals: 42, subscribers: 195 },
            { month: 'Oct', earnings: 950, signals: 45, subscribers: 210 },
            { month: 'Nov', earnings: 1020, signals: 48, subscribers: 223 },
            { month: 'Dec', earnings: 1140, signals: 52, subscribers: 234 },
          ],
        },
        2: {
          id: 2,
          name: 'AIInvestor',
          email: 'ai@example.com',
          status: 'active',
          verified: true,
          joined: '2024-01-11',
          signals: 89,
          earnings: 2100.50,
          rating: 4.95,
          winRate: 91,
          totalSubscribers: 187,
          totalPurchases: 1245,
          bio: 'AI-powered trading signals using machine learning algorithms. High accuracy rate.',
          experience: '5 years',
          location: 'USA',
          website: 'https://aiinvestor.io',
          twitter: '@aiinvestor',
          telegram: 'ai_investor',
          recentSignals: [
            { id: 4, pair: 'NVDA', price: 4.99, purchases: 52, date: '2024-01-15', status: 'active' },
            { id: 5, pair: 'AAPL', price: 3.49, purchases: 41, date: '2024-01-14', status: 'active' },
          ],
          monthlyData: [
            { month: 'Jan', earnings: 180, signals: 6, subscribers: 28 },
            { month: 'Feb', earnings: 220, signals: 8, subscribers: 35 },
            { month: 'Mar', earnings: 280, signals: 10, subscribers: 45 },
            { month: 'Apr', earnings: 340, signals: 12, subscribers: 58 },
            { month: 'May', earnings: 410, signals: 15, subscribers: 72 },
            { month: 'Jun', earnings: 380, signals: 14, subscribers: 85 },
            { month: 'Jul', earnings: 450, signals: 16, subscribers: 98 },
            { month: 'Aug', earnings: 490, signals: 18, subscribers: 112 },
            { month: 'Sep', earnings: 520, signals: 19, subscribers: 128 },
            { month: 'Oct', earnings: 560, signals: 21, subscribers: 145 },
            { month: 'Nov', earnings: 590, signals: 22, subscribers: 162 },
            { month: 'Dec', earnings: 620, signals: 24, subscribers: 187 },
          ],
        },
        3: {
          id: 3,
          name: 'LondonTrader',
          email: 'london@example.com',
          status: 'pending',
          verified: false,
          joined: '2024-01-14',
          signals: 0,
          earnings: 0,
          rating: 0,
          winRate: 0,
          totalSubscribers: 0,
          totalPurchases: 0,
          bio: 'Forex specialist focusing on GBP pairs and European markets.',
          experience: '4 years',
          location: 'London, UK',
          website: '',
          twitter: '@londontrader',
          telegram: '',
          recentSignals: [],
          monthlyData: [
            { month: 'Jan', earnings: 0, signals: 0, subscribers: 0 },
            { month: 'Feb', earnings: 0, signals: 0, subscribers: 0 },
            { month: 'Mar', earnings: 0, signals: 0, subscribers: 0 },
            { month: 'Apr', earnings: 0, signals: 0, subscribers: 0 },
            { month: 'May', earnings: 0, signals: 0, subscribers: 0 },
            { month: 'Jun', earnings: 0, signals: 0, subscribers: 0 },
            { month: 'Jul', earnings: 0, signals: 0, subscribers: 0 },
            { month: 'Aug', earnings: 0, signals: 0, subscribers: 0 },
            { month: 'Sep', earnings: 0, signals: 0, subscribers: 0 },
            { month: 'Oct', earnings: 0, signals: 0, subscribers: 0 },
            { month: 'Nov', earnings: 0, signals: 0, subscribers: 0 },
            { month: 'Dec', earnings: 0, signals: 0, subscribers: 0 },
          ],
        },
        4: {
          id: 4,
          name: 'SolanaBull',
          email: 'solana@example.com',
          status: 'active',
          verified: true,
          joined: '2024-01-09',
          signals: 67,
          earnings: 1450.75,
          rating: 4.85,
          winRate: 88,
          totalSubscribers: 156,
          totalPurchases: 890,
          bio: 'Solana ecosystem expert. Providing signals for SOL and related tokens.',
          experience: '3 years',
          location: 'Switzerland',
          website: 'https://solanabull.com',
          twitter: '@solanabull',
          telegram: 'solana_bull',
          recentSignals: [
            { id: 6, pair: 'SOL/USD', price: 3.49, purchases: 34, date: '2024-01-15', status: 'active' },
            { id: 7, pair: 'BONK/USD', price: 2.49, purchases: 23, date: '2024-01-14', status: 'active' },
          ],
          monthlyData: [
            { month: 'Jan', earnings: 120, signals: 5, subscribers: 22 },
            { month: 'Feb', earnings: 150, signals: 6, subscribers: 31 },
            { month: 'Mar', earnings: 180, signals: 7, subscribers: 42 },
            { month: 'Apr', earnings: 210, signals: 8, subscribers: 54 },
            { month: 'May', earnings: 240, signals: 9, subscribers: 68 },
            { month: 'Jun', earnings: 270, signals: 10, subscribers: 82 },
            { month: 'Jul', earnings: 300, signals: 11, subscribers: 96 },
            { month: 'Aug', earnings: 280, signals: 10, subscribers: 108 },
            { month: 'Sep', earnings: 310, signals: 12, subscribers: 122 },
            { month: 'Oct', earnings: 340, signals: 13, subscribers: 135 },
            { month: 'Nov', earnings: 370, signals: 14, subscribers: 148 },
            { month: 'Dec', earnings: 400, signals: 15, subscribers: 156 },
          ],
        },
        5: {
          id: 5,
          name: 'NewTrader',
          email: 'new@example.com',
          status: 'pending',
          verified: false,
          joined: '2024-01-15',
          signals: 0,
          earnings: 0,
          rating: 0,
          winRate: 0,
          totalSubscribers: 0,
          totalPurchases: 0,
          bio: 'New trader with a passion for technical analysis.',
          experience: '2 years',
          location: 'Australia',
          website: '',
          twitter: '',
          telegram: '',
          recentSignals: [],
          monthlyData: [
            { month: 'Jan', earnings: 0, signals: 0, subscribers: 0 },
            { month: 'Feb', earnings: 0, signals: 0, subscribers: 0 },
            { month: 'Mar', earnings: 0, signals: 0, subscribers: 0 },
            { month: 'Apr', earnings: 0, signals: 0, subscribers: 0 },
            { month: 'May', earnings: 0, signals: 0, subscribers: 0 },
            { month: 'Jun', earnings: 0, signals: 0, subscribers: 0 },
            { month: 'Jul', earnings: 0, signals: 0, subscribers: 0 },
            { month: 'Aug', earnings: 0, signals: 0, subscribers: 0 },
            { month: 'Sep', earnings: 0, signals: 0, subscribers: 0 },
            { month: 'Oct', earnings: 0, signals: 0, subscribers: 0 },
            { month: 'Nov', earnings: 0, signals: 0, subscribers: 0 },
            { month: 'Dec', earnings: 0, signals: 0, subscribers: 0 },
          ],
        },
      };
      setProvider(providersData[id]);
      setLoading(false);
    }, 500);
  }, [id]);

  const approveProvider = () => {
    setProvider({ ...provider, status: 'active', verified: true });
    alert('Provider approved successfully!');
  };

  const rejectProvider = () => {
    navigate('/admin/providers');
  };

  const suspendProvider = () => {
    setProvider({ ...provider, status: 'suspended' });
    alert('Provider suspended');
  };

  const activateProvider = () => {
    setProvider({ ...provider, status: 'active' });
    alert('Provider activated');
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className={`p-2 border rounded shadow-lg ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <p className="text-sm font-medium">{label}</p>
          {payload.map((p, idx) => (
            <p key={idx} className="text-xs" style={{ color: p.color }}>
              {p.name}: {p.name === 'Earnings' ? `$${p.value}` : p.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="text-center py-12">
        <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Provider not found</p>
        <Link to="/admin/providers" className="text-orange-500 text-sm mt-2 inline-block">Back to Providers</Link>
      </div>
    );
  }

  const totalEarnings = provider.monthlyData.reduce((sum, d) => sum + d.earnings, 0);
  const totalSignals = provider.monthlyData.reduce((sum, d) => sum + d.signals, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Link to="/admin/providers" className="text-orange-500 hover:underline text-sm">
              ← Back
            </Link>
            <h1 className={`text-xl font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Provider Details
            </h1>
          </div>
          <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            View and manage provider information
          </p>
        </div>
        <div className="flex gap-2">
          {provider.status === 'pending' ? (
            <>
              <button
                onClick={approveProvider}
                className="px-4 py-1.5 bg-green-500 text-white text-sm rounded-md hover:bg-green-600 transition"
              >
                Approve
              </button>
              <button
                onClick={rejectProvider}
                className="px-4 py-1.5 bg-red-500 text-white text-sm rounded-md hover:bg-red-600 transition"
              >
                Reject
              </button>
            </>
          ) : provider.status === 'active' ? (
            <button
              onClick={suspendProvider}
              className="px-4 py-1.5 bg-yellow-500 text-white text-sm rounded-md hover:bg-yellow-600 transition"
            >
              Suspend
            </button>
          ) : (
            <button
              onClick={activateProvider}
              className="px-4 py-1.5 bg-green-500 text-white text-sm rounded-md hover:bg-green-600 transition"
            >
              Activate
            </button>
          )}
        </div>
      </div>

      {/* Provider Info Card */}
      <div className={`border rounded-md p-4 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="flex items-start gap-4">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold ${
            darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-700'
          }`}>
            {provider.name.charAt(0)}
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap justify-between items-start gap-2">
              <div>
                <h2 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {provider.name}
                </h2>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {provider.email}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  provider.status === 'active' ? 'bg-green-500/10 text-green-500' :
                  provider.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500' :
                  'bg-red-500/10 text-red-500'
                }`}>
                  {provider.status}
                </span>
                {provider.verified && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500">
                    Verified
                  </span>
                )}
              </div>
            </div>
            <p className={`text-sm mt-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {provider.bio}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className={`border rounded-md p-3 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total Signals</p>
          <p className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{provider.signals}</p>
        </div>
        <div className={`border rounded-md p-3 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total Earnings</p>
          <p className={`text-xl font-semibold text-orange-500`}>${provider.earnings.toFixed(2)}</p>
        </div>
        <div className={`border rounded-md p-3 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Win Rate</p>
          <p className={`text-xl font-semibold text-green-500`}>{provider.winRate}%</p>
        </div>
        <div className={`border rounded-md p-3 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Rating</p>
          <div className="flex items-center gap-1">
            <Icon icon={Icons.Star} size={16} color="#eab308" />
            <p className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{provider.rating || '—'}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-6 border-b border-gray-200 dark:border-gray-700">
        {['overview', 'signals', 'earnings', 'documents'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2 text-sm capitalize transition ${
              activeTab === tab
                ? 'text-orange-500 border-b-2 border-orange-500'
                : darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="grid md:grid-cols-2 gap-4">
          <div className={`border rounded-md p-4 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <h3 className={`text-sm font-medium mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Personal Information
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Full Name</span>
                <span className={darkMode ? 'text-white' : 'text-gray-900'}>{provider.name}</span>
              </div>
              <div className="flex justify-between">
                <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Email</span>
                <span className={darkMode ? 'text-white' : 'text-gray-900'}>{provider.email}</span>
              </div>
              <div className="flex justify-between">
                <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Experience</span>
                <span className={darkMode ? 'text-white' : 'text-gray-900'}>{provider.experience}</span>
              </div>
              <div className="flex justify-between">
                <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Location</span>
                <span className={darkMode ? 'text-white' : 'text-gray-900'}>{provider.location}</span>
              </div>
              <div className="flex justify-between">
                <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Joined</span>
                <span className={darkMode ? 'text-white' : 'text-gray-900'}>{provider.joined}</span>
              </div>
            </div>
          </div>

          <div className={`border rounded-md p-4 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <h3 className={`text-sm font-medium mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Social Links
            </h3>
            <div className="space-y-2 text-sm">
              {provider.website && (
                <div className="flex justify-between">
                  <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Website</span>
                  <a href={provider.website} target="_blank" rel="noopener noreferrer" className="text-orange-500 hover:underline">
                    {provider.website}
                  </a>
                </div>
              )}
              {provider.twitter && (
                <div className="flex justify-between">
                  <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Twitter</span>
                  <a href={`https://twitter.com/${provider.twitter}`} target="_blank" rel="noopener noreferrer" className="text-orange-500 hover:underline">
                    @{provider.twitter}
                  </a>
                </div>
              )}
              {provider.telegram && (
                <div className="flex justify-between">
                  <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Telegram</span>
                  <span className={darkMode ? 'text-white' : 'text-gray-900'}>{provider.telegram}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Signals Tab */}
      {activeTab === 'signals' && (
        <div className={`border rounded-md overflow-hidden ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className={darkMode ? 'bg-gray-800' : 'bg-gray-50'}>
                <tr className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <th className="text-left px-4 py-3 font-medium">Pair</th>
                  <th className="text-left px-4 py-3 font-medium">Price</th>
                  <th className="text-left px-4 py-3 font-medium">Purchases</th>
                  <th className="text-left px-4 py-3 font-medium">Date</th>
                  <th className="text-left px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {provider.recentSignals.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-8 text-gray-500">
                      No signals yet
                     </td>
                   </tr>
                ) : (
                  provider.recentSignals.map((signal) => (
                    <tr key={signal.id} className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                      <td className={`px-4 py-3 font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{signal.pair}</td>
                      <td className="px-4 py-3 text-orange-500">${signal.price}</td>
                      <td className={`px-4 py-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{signal.purchases}</td>
                      <td className={`px-4 py-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{signal.date}</td>
                      <td className="px-4 py-3">
                        <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/10 text-green-500">
                          {signal.status}
                        </span>
                       </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Earnings Tab with Professional Line Chart */}
      {activeTab === 'earnings' && (
        <div className="space-y-4">
          {/* Chart Type Toggle */}
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setChartType('line')}
              className={`px-3 py-1 text-xs rounded ${chartType === 'line' ? 'bg-orange-500 text-white' : darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}
            >
              Line Chart
            </button>
            <button
              onClick={() => setChartType('area')}
              className={`px-3 py-1 text-xs rounded ${chartType === 'area' ? 'bg-orange-500 text-white' : darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}
            >
              Area Chart
            </button>
          </div>

          {/* Main Earnings Chart */}
          <div className={`border rounded-md p-4 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <h3 className={`text-sm font-medium mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Earnings Overview (Monthly)
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              {chartType === 'line' ? (
                <LineChart data={provider.monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} />
                  <XAxis dataKey="month" stroke={darkMode ? '#9ca3af' : '#6b7280'} />
                  <YAxis stroke={darkMode ? '#9ca3af' : '#6b7280'} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="earnings" 
                    name="Earnings" 
                    stroke="#f97316" 
                    strokeWidth={2} 
                    dot={{ r: 4, fill: "#f97316" }}
                    activeDot={{ r: 6 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="signals" 
                    name="Signals" 
                    stroke="#22c55e" 
                    strokeWidth={2} 
                    dot={{ r: 3 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="subscribers" 
                    name="Subscribers" 
                    stroke="#3b82f6" 
                    strokeWidth={2} 
                    dot={{ r: 3 }}
                  />
                </LineChart>
              ) : (
                <AreaChart data={provider.monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} />
                  <XAxis dataKey="month" stroke={darkMode ? '#9ca3af' : '#6b7280'} />
                  <YAxis stroke={darkMode ? '#9ca3af' : '#6b7280'} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="earnings" 
                    name="Earnings" 
                    stroke="#f97316" 
                    fill="#f97316" 
                    fillOpacity={0.2}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="signals" 
                    name="Signals" 
                    stroke="#22c55e" 
                    fill="#22c55e" 
                    fillOpacity={0.2}
                  />
                </AreaChart>
              )}
            </ResponsiveContainer>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className={`border rounded-md p-3 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total Earnings (YTD)</p>
              <p className={`text-lg font-semibold text-orange-500`}>${totalEarnings.toFixed(2)}</p>
            </div>
            <div className={`border rounded-md p-3 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total Signals (YTD)</p>
              <p className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{totalSignals}</p>
            </div>
            <div className={`border rounded-md p-3 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Best Month</p>
              <p className={`text-lg font-semibold text-green-500`}>
                ${Math.max(...provider.monthlyData.map(d => d.earnings)).toFixed(2)}
              </p>
            </div>
          </div>

          {/* Monthly Data Table */}
          <div className={`border rounded-md overflow-hidden ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className={darkMode ? 'bg-gray-800' : 'bg-gray-50'}>
                  <tr className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <th className="text-left px-4 py-3 font-medium">Month</th>
                    <th className="text-left px-4 py-3 font-medium">Earnings</th>
                    <th className="text-left px-4 py-3 font-medium">Signals</th>
                    <th className="text-left px-4 py-3 font-medium">Subscribers</th>
                   </tr>
                </thead>
                <tbody>
                  {provider.monthlyData.map((data, idx) => (
                    <tr key={idx} className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                      <td className={`px-4 py-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{data.month}</td>
                      <td className="px-4 py-3 text-orange-500">${data.earnings.toFixed(2)}</td>
                      <td className={`px-4 py-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{data.signals}</td>
                      <td className={`px-4 py-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{data.subscribers}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Documents Tab */}
      {activeTab === 'documents' && (
        <div className={`border rounded-md p-4 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <h3 className={`text-sm font-medium mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Verification Documents
          </h3>
          {provider.status === 'pending' ? (
            <div className="text-center py-8">
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>No documents uploaded yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex justify-between items-center p-3 border rounded-md">
                <div className="flex items-center gap-2">
                  <Icon icon={Icons.File} size={16} />
                  <span>ID Verification.pdf</span>
                </div>
                <button className="text-orange-500 text-sm hover:underline">View</button>
              </div>
              <div className="flex justify-between items-center p-3 border rounded-md">
                <div className="flex items-center gap-2">
                  <Icon icon={Icons.File} size={16} />
                  <span>Address Proof.pdf</span>
                </div>
                <button className="text-orange-500 text-sm hover:underline">View</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}