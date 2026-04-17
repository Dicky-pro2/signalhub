import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

export default function Wallet() {
  const { darkMode } = useTheme();
  const { user } = useAuth();
  const [balance, setBalance] = useState(47.50);
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);

  const transactions = [
    { id: 1, type: 'deposit', amount: 50.00, status: 'completed', date: '2024-01-10', description: 'Added funds via card' },
    { id: 2, type: 'purchase', amount: -4.99, status: 'completed', date: '2024-01-11', description: 'BTC/USD signal' },
    { id: 3, type: 'purchase', amount: -2.99, status: 'completed', date: '2024-01-12', description: 'EUR/USD signal' },
    { id: 4, type: 'deposit', amount: 20.00, status: 'completed', date: '2024-01-13', description: 'Added funds via crypto' },
    { id: 5, type: 'purchase', amount: -3.49, status: 'completed', date: '2024-01-14', description: 'SOL/USD signal' },
  ];

  const handleDeposit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Integrate with Stripe or crypto payment here
    setTimeout(() => {
      setBalance(balance + parseFloat(depositAmount));
      setDepositAmount('');
      setLoading(false);
      alert(`$${depositAmount} added successfully!`);
    }, 1000);
  };

  const handleWithdraw = async (e) => {
    e.preventDefault();
    if (parseFloat(withdrawAmount) > balance) {
      alert('Insufficient balance');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setBalance(balance - parseFloat(withdrawAmount));
      setWithdrawAmount('');
      setLoading(false);
      alert(`Withdrawal request submitted for $${withdrawAmount}`);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          Wallet
        </h1>
        <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
          Manage your funds and transaction history
        </p>
      </div>

      {/* Balance Card */}
      <div className={`rounded-xl p-6 ${darkMode ? 'bg-gradient-to-r from-orange-600/20 to-red-600/20 border border-orange-500/30' : 'bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200'}`}>
        <div className="text-center">
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Current Balance</p>
          <p className="text-5xl font-bold text-orange-500 mt-2">${balance.toFixed(2)}</p>
          <div className="flex gap-3 justify-center mt-6">
            <button
              onClick={() => setActiveTab('deposit')}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition"
            >
              + Deposit
            </button>
            <button
              onClick={() => setActiveTab('withdraw')}
              className={`px-6 py-2 rounded-lg transition ${
                darkMode 
                  ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
              }`}
            >
              Withdraw
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-700 pb-2">
        {['overview', 'deposit', 'withdraw'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg transition capitalize ${
              activeTab === tab
                ? 'bg-orange-500 text-white'
                : darkMode
                ? 'text-gray-400 hover:text-white'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            {tab === 'overview' ? '📋 Overview' : tab === 'deposit' ? '💳 Deposit' : '💸 Withdraw'}
          </button>
        ))}
      </div>

      {/* Deposit Form */}
      {activeTab === 'deposit' && (
        <div className={`rounded-xl p-6 ${darkMode ? 'bg-gray-800' : 'bg-white shadow-lg'}`}>
          <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            Add Funds
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Deposit Methods */}
            <div>
              <h3 className={`font-semibold mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Deposit Methods
              </h3>
              <div className="space-y-2">
                <button className={`w-full p-3 rounded-lg border text-left flex items-center gap-3 ${darkMode ? 'border-gray-700 hover:border-orange-500' : 'border-gray-200 hover:border-orange-500'}`}>
                  <span className="text-2xl">💳</span>
                  <div>
                    <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>Credit/Debit Card</p>
                    <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Visa, Mastercard, Amex</p>
                  </div>
                </button>
                <button className={`w-full p-3 rounded-lg border text-left flex items-center gap-3 ${darkMode ? 'border-gray-700 hover:border-orange-500' : 'border-gray-200 hover:border-orange-500'}`}>
                  <span className="text-2xl">₿</span>
                  <div>
                    <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>Cryptocurrency</p>
                    <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>BTC, ETH, USDC, SOL</p>
                  </div>
                </button>
                <button className={`w-full p-3 rounded-lg border text-left flex items-center gap-3 ${darkMode ? 'border-gray-700 hover:border-orange-500' : 'border-gray-200 hover:border-orange-500'}`}>
                  <span className="text-2xl">🏦</span>
                  <div>
                    <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>Bank Transfer</p>
                    <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>SEPA, Wire Transfer</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Deposit Form */}
            <div>
              <form onSubmit={handleDeposit}>
                <label className={`block mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Amount (USD)
                </label>
                <div className="flex gap-3">
                  <input
                    type="number"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    placeholder="Min $10"
                    min="10"
                    step="10"
                    required
                    className={`flex-1 px-4 py-2 rounded-lg border focus:outline-none focus:border-orange-500 ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-800'
                    }`}
                  />
                  <button
                    type="submit"
                    disabled={loading || !depositAmount || parseFloat(depositAmount) < 10}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition disabled:opacity-50"
                  >
                    {loading ? 'Processing...' : 'Deposit'}
                  </button>
                </div>
                <p className={`text-xs mt-2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                  Minimum deposit: $10. Maximum: $10,000 per transaction.
                </p>
              </form>

              <div className={`mt-6 p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  🔒 Secure payments powered by Stripe. Your financial information is never stored on our servers.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Withdraw Form */}
      {activeTab === 'withdraw' && (
        <div className={`rounded-xl p-6 ${darkMode ? 'bg-gray-800' : 'bg-white shadow-lg'}`}>
          <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            Withdraw Funds
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className={`font-semibold mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Withdrawal Methods
              </h3>
              <div className="space-y-2">
                <button className={`w-full p-3 rounded-lg border text-left flex items-center gap-3 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <span className="text-2xl">🏦</span>
                  <div>
                    <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>Bank Account</p>
                    <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>1-3 business days</p>
                  </div>
                </button>
                <button className={`w-full p-3 rounded-lg border text-left flex items-center gap-3 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <span className="text-2xl">₿</span>
                  <div>
                    <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>Cryptocurrency</p>
                    <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Instant - 1 hour</p>
                  </div>
                </button>
              </div>
            </div>

            <div>
              <form onSubmit={handleWithdraw}>
                <label className={`block mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Amount (USD)
                </label>
                <div className="flex gap-3">
                  <input
                    type="number"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    placeholder={`Max $${balance}`}
                    max={balance}
                    step="10"
                    required
                    className={`flex-1 px-4 py-2 rounded-lg border focus:outline-none focus:border-orange-500 ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-800'
                    }`}
                  />
                  <button
                    type="submit"
                    disabled={loading || !withdrawAmount || parseFloat(withdrawAmount) > balance || parseFloat(withdrawAmount) < 10}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition disabled:opacity-50"
                  >
                    {loading ? 'Processing...' : 'Withdraw'}
                  </button>
                </div>
                <p className={`text-xs mt-2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                  Minimum withdrawal: $10. Maximum: $5,000 per transaction.
                </p>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Transaction History */}
      {activeTab === 'overview' && (
        <div className={`rounded-xl p-6 ${darkMode ? 'bg-gray-800' : 'bg-white shadow-lg'}`}>
          <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            Transaction History
          </h2>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-2">Date</th>
                  <th className="text-left py-2">Description</th>
                  <th className="text-left py-2">Amount</th>
                  <th className="text-left py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx.id} className="border-b border-gray-700/50">
                    <td className={`py-3 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {tx.date}
                    </td>
                    <td className={`py-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      {tx.description}
                    </td>
                    <td className={`py-3 font-semibold ${tx.amount > 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {tx.amount > 0 ? '+' : ''}{tx.amount.toFixed(2)}
                    </td>
                    <td className="py-3">
                      <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-500">
                        {tx.status}
                      </span>
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