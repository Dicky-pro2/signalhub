import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';

export default function ProviderEarnings() {
  const { darkMode } = useTheme();
  const [period, setPeriod] = useState('monthly');

  const earningsData = {
    totalEarnings: 1247.89,
    pendingPayout: 423.67,
    platformFees: 311.97,
    thisMonth: 342.50,
    lastMonth: 289.30,
    
    history: [
      { id: 1, date: '2024-01-15', signal: 'BTC/USD', purchases: 23, amount: 114.77, fee: 28.69, net: 86.08 },
      { id: 2, date: '2024-01-14', signal: 'ETH/USD', purchases: 18, amount: 71.82, fee: 17.96, net: 53.86 },
      { id: 3, date: '2024-01-13', signal: 'EUR/USD', purchases: 31, amount: 92.69, fee: 23.17, net: 69.52 },
      { id: 4, date: '2024-01-12', signal: 'SOL/USD', purchases: 14, amount: 48.86, fee: 12.22, net: 36.64 },
      { id: 5, date: '2024-01-11', signal: 'NVDA', purchases: 12, amount: 59.88, fee: 14.97, net: 44.91 },
    ],
    
    weeklyData: [42.50, 67.80, 89.30, 54.20, 78.50, 12.20, 0],
  };

  const handleWithdraw = () => {
    alert(`Withdrawal request submitted for $${earningsData.pendingPayout.toFixed(2)}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          Earnings
        </h1>
        <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
          Track your signal revenue and payouts
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className={`rounded-xl p-4 ${darkMode ? 'bg-gray-800' : 'bg-white shadow-lg'}`}>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total Earnings</p>
          <p className={`text-2xl font-bold text-orange-500`}>
            ${earningsData.totalEarnings.toFixed(2)}
          </p>
        </div>
        <div className={`rounded-xl p-4 ${darkMode ? 'bg-gray-800' : 'bg-white shadow-lg'}`}>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Pending Payout</p>
          <p className={`text-2xl font-bold text-green-500`}>
            ${earningsData.pendingPayout.toFixed(2)}
          </p>
        </div>
        <div className={`rounded-xl p-4 ${darkMode ? 'bg-gray-800' : 'bg-white shadow-lg'}`}>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Platform Fees (20%)</p>
          <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            ${earningsData.platformFees.toFixed(2)}
          </p>
        </div>
        <div className={`rounded-xl p-4 ${darkMode ? 'bg-gray-800' : 'bg-white shadow-lg'}`}>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>This Month</p>
          <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            ${earningsData.thisMonth.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Withdraw Card */}
      <div className={`rounded-xl p-6 ${darkMode ? 'bg-gradient-to-r from-orange-600/20 to-red-600/20 border border-orange-500/30' : 'bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200'}`}>
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div>
            <h3 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              Available for Withdrawal
            </h3>
            <p className={`text-3xl font-bold text-orange-500 mt-1`}>
              ${earningsData.pendingPayout.toFixed(2)}
            </p>
          </div>
          <button
            onClick={handleWithdraw}
            disabled={earningsData.pendingPayout < 50}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition disabled:opacity-50"
          >
            Withdraw Funds
          </button>
        </div>
        <p className={`text-xs mt-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Minimum withdrawal: $50. Withdrawals are processed within 1-3 business days.
        </p>
      </div>

      {/* Earnings Chart */}
      <div className={`rounded-xl p-6 ${darkMode ? 'bg-gray-800' : 'bg-white shadow-lg'}`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            Earnings Overview
          </h2>
          <div className="flex gap-2">
            {['weekly', 'monthly', 'yearly'].map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1 rounded-lg text-sm transition ${
                  period === p
                    ? 'bg-orange-500 text-white'
                    : darkMode
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </button>
            ))}
          </div>
        </div>
        
        <div className="h-64 flex items-end gap-2">
          {earningsData.weeklyData.map((value, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center gap-2">
              <div 
                className="w-full bg-orange-500 rounded-t transition-all duration-300 hover:bg-orange-600"
                style={{ height: `${(value / 100) * 200}px` }}
              />
              <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][idx]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Earnings History Table */}
      <div className={`rounded-xl p-6 ${darkMode ? 'bg-gray-800' : 'bg-white shadow-lg'}`}>
        <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          Earnings History
        </h2>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
              <tr className="border-b border-gray-700">
                <th className="text-left py-2">Date</th>
                <th className="text-left py-2">Signal</th>
                <th className="text-left py-2">Purchases</th>
                <th className="text-left py-2">Gross</th>
                <th className="text-left py-2">Fee (20%)</th>
                <th className="text-left py-2">Net</th>
               </tr>
            </thead>
            <tbody>
              {earningsData.history.map((item) => (
                <tr key={item.id} className="border-b border-gray-700/50">
                  <td className={`py-3 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {item.date}
                   </td>
                  <td className={`py-3 font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    {item.signal}
                   </td>
                  <td className="py-3">{item.purchases}</td>
                  <td className="py-3 text-green-500">${item.amount.toFixed(2)}</td>
                  <td className="py-3 text-red-500">${item.fee.toFixed(2)}</td>
                  <td className="py-3 font-semibold text-orange-500">${item.net.toFixed(2)}</td>
                 </tr>
              ))}
            </tbody>
           </table>
        </div>
      </div>
    </div>
  );
}