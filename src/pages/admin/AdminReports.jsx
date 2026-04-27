// src/pages/admin/AdminReports.jsx
import { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import Icon from '../../components/Icon';
import { Icons } from '../../components/Icons';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';

export default function AdminReports() {
  const { darkMode } = useTheme();
  const [dateRange, setDateRange] = useState('month');
  const [chartType, setChartType] = useState('line'); // line, area, bar

  // Revenue data
  const revenueData = [
    { name: 'Jan', revenue: 12500, profit: 2500 },
    { name: 'Feb', revenue: 14800, profit: 2960 },
    { name: 'Mar', revenue: 16200, profit: 3240 },
    { name: 'Apr', revenue: 18900, profit: 3780 },
    { name: 'May', revenue: 21500, profit: 4300 },
    { name: 'Jun', revenue: 24700, profit: 4940 },
  ];

  // User growth data
  const userData = [
    { name: 'Jan', customers: 450, providers: 12 },
    { name: 'Feb', customers: 580, providers: 18 },
    { name: 'Mar', customers: 720, providers: 25 },
    { name: 'Apr', customers: 890, providers: 32 },
    { name: 'May', customers: 1050, providers: 40 },
    { name: 'Jun', customers: 1247, providers: 48 },
  ];

  // Signal data
  const signalData = [
    { name: 'Jan', signals: 120, purchases: 850 },
    { name: 'Feb', signals: 180, purchases: 1250 },
    { name: 'Mar', signals: 245, purchases: 1890 },
    { name: 'Apr', signals: 320, purchases: 2450 },
    { name: 'May', signals: 420, purchases: 3100 },
    { name: 'Jun', signals: 523, purchases: 4120 },
  ];

  // Market distribution pie chart data
  const marketDistribution = [
    { name: 'Crypto', value: 45, color: '#f97316' },
    { name: 'Forex', value: 32, color: '#22c55e' },
    { name: 'Stocks', value: 23, color: '#3b82f6' },
  ];

  // Revenue distribution pie chart
  const revenueDistribution = [
    { name: 'Signal Sales', value: 68, color: '#f97316' },
    { name: 'Platform Fees', value: 20, color: '#8b5cf6' },
    { name: 'Premium Features', value: 12, color: '#06b6d4' },
  ];

  // Provider performance data
  const topProviders = [
    { name: 'CryptoKing', signals: 156, revenue: 3420, rating: 4.9 },
    { name: 'AIInvestor', signals: 89, revenue: 2100, rating: 4.95 },
    { name: 'LondonTrader', signals: 67, revenue: 1850, rating: 4.8 },
    { name: 'SolanaBull', signals: 54, revenue: 1450, rating: 4.85 },
    { name: 'ForexMaster', signals: 48, revenue: 1250, rating: 4.75 },
  ];

  const chartColors = {
    revenue: '#f97316',
    profit: '#22c55e',
    customers: '#3b82f6',
    providers: '#8b5cf6',
    signals: '#f97316',
    purchases: '#06b6d4',
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className={`p-2 border rounded shadow-lg ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <p className="text-sm font-medium">{label}</p>
          {payload.map((p, idx) => (
            <p key={idx} className="text-xs" style={{ color: p.color }}>
              {p.name}: {typeof p.value === 'number' ? p.value.toLocaleString() : p.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const downloadReport = (format) => {
    alert(`Downloading ${format} report...`);
  };

  // Calculate totals
  const totalRevenue = revenueData.reduce((sum, d) => sum + d.revenue, 0);
  const totalProfit = revenueData.reduce((sum, d) => sum + d.profit, 0);
  const totalUsers = userData[userData.length - 1].customers + userData[userData.length - 1].providers;
  const totalSignals = signalData[signalData.length - 1].signals;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className={`text-xl font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Reports & Analytics
          </h1>
          <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Platform performance metrics and insights
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => downloadReport('csv')}
            className={`px-3 py-1.5 text-sm border rounded-md ${darkMode ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-50'}`}
          >
            Export CSV
          </button>
          <button
            onClick={() => downloadReport('pdf')}
            className={`px-3 py-1.5 text-sm border rounded-md ${darkMode ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-50'}`}
          >
            Export PDF
          </button>
        </div>
      </div>

      {/* Date Range Tabs */}
      <div className="flex flex-wrap gap-1 border-b border-gray-200 dark:border-gray-700">
        {['day', 'week', 'month', 'quarter', 'year'].map((range) => (
          <button
            key={range}
            onClick={() => setDateRange(range)}
            className={`px-4 py-2 text-sm capitalize transition ${
              dateRange === range
                ? 'text-orange-500 border-b-2 border-orange-500'
                : darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {range}
          </button>
        ))}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className={`border rounded-md p-3 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total Revenue</p>
          <p className={`text-xl font-semibold text-orange-500`}>${totalRevenue.toLocaleString()}</p>
          <p className={`text-xs mt-1 text-green-500`}>+23.5% vs last month</p>
        </div>
        <div className={`border rounded-md p-3 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Platform Profit</p>
          <p className={`text-xl font-semibold text-green-500`}>${totalProfit.toLocaleString()}</p>
          <p className={`text-xs mt-1 text-green-500`}>+18.2% vs last month</p>
        </div>
        <div className={`border rounded-md p-3 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total Users</p>
          <p className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{totalUsers.toLocaleString()}</p>
          <p className={`text-xs mt-1 text-green-500`}>+156 this month</p>
        </div>
        <div className={`border rounded-md p-3 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total Signals</p>
          <p className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{totalSignals}</p>
          <p className={`text-xs mt-1 text-green-500`}>+103 this month</p>
        </div>
      </div>

      {/* Revenue Chart with Chart Type Toggle */}
      <div className={`border rounded-md p-4 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Revenue Overview
          </h2>
          <div className="flex gap-1">
            <button
              onClick={() => setChartType('line')}
              className={`px-2 py-1 text-xs rounded ${chartType === 'line' ? 'bg-orange-500 text-white' : darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}
            >
              Line
            </button>
            <button
              onClick={() => setChartType('area')}
              className={`px-2 py-1 text-xs rounded ${chartType === 'area' ? 'bg-orange-500 text-white' : darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}
            >
              Area
            </button>
            <button
              onClick={() => setChartType('bar')}
              className={`px-2 py-1 text-xs rounded ${chartType === 'bar' ? 'bg-orange-500 text-white' : darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}
            >
              Bar
            </button>
          </div>
        </div>
        
        <ResponsiveContainer width="100%" height={300}>
          {chartType === 'line' && (
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} />
              <XAxis dataKey="name" stroke={darkMode ? '#9ca3af' : '#6b7280'} />
              <YAxis stroke={darkMode ? '#9ca3af' : '#6b7280'} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke={chartColors.revenue} strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="profit" stroke={chartColors.profit} strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          )}
          {chartType === 'area' && (
            <AreaChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} />
              <XAxis dataKey="name" stroke={darkMode ? '#9ca3af' : '#6b7280'} />
              <YAxis stroke={darkMode ? '#9ca3af' : '#6b7280'} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Area type="monotone" dataKey="revenue" stackId="1" stroke={chartColors.revenue} fill={chartColors.revenue} fillOpacity={0.3} />
              <Area type="monotone" dataKey="profit" stackId="2" stroke={chartColors.profit} fill={chartColors.profit} fillOpacity={0.3} />
            </AreaChart>
          )}
          {chartType === 'bar' && (
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} />
              <XAxis dataKey="name" stroke={darkMode ? '#9ca3af' : '#6b7280'} />
              <YAxis stroke={darkMode ? '#9ca3af' : '#6b7280'} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="revenue" fill={chartColors.revenue} radius={[4, 4, 0, 0]} />
              <Bar dataKey="profit" fill={chartColors.profit} radius={[4, 4, 0, 0]} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Two Column Charts - Line Charts */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* User Growth Line Chart */}
        <div className={`border rounded-md p-4 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <h2 className={`text-sm font-medium mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            User Growth
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={userData}>
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} />
              <XAxis dataKey="name" stroke={darkMode ? '#9ca3af' : '#6b7280'} />
              <YAxis stroke={darkMode ? '#9ca3af' : '#6b7280'} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line type="monotone" dataKey="customers" stroke={chartColors.customers} strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="providers" stroke={chartColors.providers} strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
          <div className="mt-3 text-center">
            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Total: {userData[userData.length - 1].customers} customers, {userData[userData.length - 1].providers} providers
            </p>
          </div>
        </div>

        {/* Signals & Purchases Line Chart */}
        <div className={`border rounded-md p-4 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <h2 className={`text-sm font-medium mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Signals & Purchases
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={signalData}>
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} />
              <XAxis dataKey="name" stroke={darkMode ? '#9ca3af' : '#6b7280'} />
              <YAxis stroke={darkMode ? '#9ca3af' : '#6b7280'} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line type="monotone" dataKey="signals" stroke={chartColors.signals} strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="purchases" stroke={chartColors.purchases} strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
          <div className="mt-3 text-center">
            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Conversion Rate: {((signalData[signalData.length - 1].purchases / signalData[signalData.length - 1].signals) * 100).toFixed(1)}%
            </p>
          </div>
        </div>
      </div>

      {/* Pie Charts Row */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Market Distribution Pie Chart */}
        <div className={`border rounded-md p-4 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <h2 className={`text-sm font-medium mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Market Distribution
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={marketDistribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {marketDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-3 text-center">
            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Crypto leads with 45% of all signals
            </p>
          </div>
        </div>

        {/* Revenue Distribution Pie Chart */}
        <div className={`border rounded-md p-4 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <h2 className={`text-sm font-medium mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Revenue Distribution
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={revenueDistribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {revenueDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-3 text-center">
            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Signal sales generate 68% of total revenue
            </p>
          </div>
        </div>
      </div>

      {/* Top Providers Bar Chart */}
      <div className={`border rounded-md p-4 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <h2 className={`text-sm font-medium mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Top Performing Providers
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={topProviders} layout="vertical" margin={{ left: 80 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} />
            <XAxis type="number" stroke={darkMode ? '#9ca3af' : '#6b7280'} />
            <YAxis type="category" dataKey="name" stroke={darkMode ? '#9ca3af' : '#6b7280'} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="signals" fill={chartColors.signals} radius={[0, 4, 4, 0]} />
            <Bar dataKey="revenue" fill={chartColors.revenue} radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Quick Stats Footer */}
      <div className={`border rounded-md p-4 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <h2 className={`text-sm font-medium mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Key Metrics
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div>
            <p className={`text-2xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>89%</p>
            <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Avg Win Rate</p>
          </div>
          <div>
            <p className={`text-2xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>4.85</p>
            <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Provider Rating</p>
          </div>
          <div>
            <p className={`text-2xl font-semibold text-green-500`}>+23.5%</p>
            <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Monthly Growth</p>
          </div>
          <div>
            <p className={`text-2xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>2.3k</p>
            <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Active Traders</p>
          </div>
        </div>
      </div>
    </div>
  );
}