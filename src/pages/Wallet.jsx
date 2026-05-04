import { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../config/supabase';

export default function Wallet() {
  const { darkMode } = useTheme();
  const { user } = useAuth();
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [depositAmount, setDepositAmount] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [depositing, setDepositing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!user) return;
    fetchWalletData();
  }, [user]);

  // Load Paystack script dynamically
  useEffect(() => {
    if (document.getElementById('paystack-script')) return;
    const script = document.createElement('script');
    script.id = 'paystack-script';
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.async = true;
    document.head.appendChild(script);
  }, []);

  const fetchWalletData = async () => {
    setLoading(true);
    try {
      const { data: walletData } = await supabase
        .from('wallets')
        .select('*')
        .eq('user_id', user.id)
        .single();

      const { data: txData } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      setWallet(walletData);
      setTransactions(txData || []);
    } catch (err) {
      console.error('Wallet fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const verifyAndCredit = async (reference, amount, devMode = false) => {
    try {
      const { data, error } = await supabase.functions.invoke('verify-payment', {
        body: { reference, userId: user.id, amount, devMode },
      });

      if (error) throw new Error(error.message);
      if (!data?.success) throw new Error('Verification failed');

      setSuccess(`$${amount.toFixed(2)} added to your wallet!`);
      setDepositAmount('');
      fetchWalletData();
    } catch (err) {
      setError(err.message || 'Payment received but verification failed. Contact support.');
    } finally {
      setDepositing(false);
    }
  };

  const handlePaystackDeposit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const amount = parseFloat(depositAmount);
    if (!amount || amount < 10) {
      setError('Minimum deposit is $10');
      return;
    }

    setDepositing(true);

    // If Paystack not loaded, use dev mode
    if (!window.PaystackPop) {
      verifyAndCredit(`DEV-${Date.now()}`, amount, true);
      return;
    }

    try {
      const handler = window.PaystackPop.setup({
        key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
        email: user.email,
        amount: Math.round(amount * 100),
        currency: 'NGN',
        ref: `DEP-${Date.now()}-${user.id.slice(0, 8)}`,
        callback: function(response) {
          verifyAndCredit(response.reference, amount);
        },
        onClose: function() {
          setDepositing(false);
        },
      });
      handler.openIframe();
    } catch (err) {
      setError('Failed to open payment. Please try again.');
      setDepositing(false);
    }
  };

  const text = darkMode ? 'text-white' : 'text-gray-800';
  const subtext = darkMode ? 'text-gray-400' : 'text-gray-500';
  const card = `rounded-xl p-4 sm:p-6 ${darkMode ? 'bg-gray-800' : 'bg-white shadow-lg'}`;

  const totalSpent = transactions
    .filter(t => t.type === 'subscription' && t.status === 'success')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalDeposited = transactions
    .filter(t => t.type === 'deposit' && t.status === 'success')
    .reduce((sum, t) => sum + t.amount, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div>
        <h1 className={`text-xl sm:text-2xl font-bold ${text}`}>Wallet</h1>
        <p className={`text-sm ${subtext}`}>Manage your funds and transaction history</p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-500/10 border border-green-500/50 text-green-400 px-4 py-3 rounded-lg text-sm">
          {success}
        </div>
      )}

      {/* Balance Card */}
      <div className={`rounded-xl p-4 sm:p-6 ${
        darkMode
          ? 'bg-gradient-to-r from-orange-600/20 to-red-600/20 border border-orange-500/30'
          : 'bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200'
      }`}>
        <div className="text-center">
          <p className={`text-sm ${subtext}`}>Current Balance</p>
          <p className="text-4xl sm:text-5xl font-bold text-orange-500 mt-2">
            ${(wallet?.balance || 0).toFixed(2)}
          </p>

          <div className="grid grid-cols-2 gap-3 mt-4 sm:mt-6 max-w-xs sm:max-w-sm mx-auto">
            <div className={`rounded-lg p-2 sm:p-3 ${darkMode ? 'bg-gray-800/50' : 'bg-white/70'}`}>
              <p className={`text-xs ${subtext}`}>Total Spent</p>
              <p className={`font-bold text-sm sm:text-base ${text}`}>${totalSpent.toFixed(2)}</p>
            </div>
            <div className={`rounded-lg p-2 sm:p-3 ${darkMode ? 'bg-gray-800/50' : 'bg-white/70'}`}>
              <p className={`text-xs ${subtext}`}>Total Deposited</p>
              <p className={`font-bold text-sm sm:text-base ${text}`}>${totalDeposited.toFixed(2)}</p>
            </div>
          </div>

          <div className="flex gap-3 justify-center mt-4 sm:mt-6">
            <button
              onClick={() => setActiveTab('deposit')}
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 sm:px-6 py-2 rounded-lg transition text-sm sm:text-base"
            >
              + Deposit
            </button>
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 sm:px-6 py-2 rounded-lg transition text-sm sm:text-base ${
                darkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
              }`}
            >
              History
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className={`flex gap-2 border-b pb-2 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        {['overview', 'deposit'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 sm:px-4 py-2 rounded-lg transition text-sm capitalize ${
              activeTab === tab
                ? 'bg-orange-500 text-white'
                : darkMode
                ? 'text-gray-400 hover:text-white'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            {tab === 'overview' ? '📋 Overview' : '💳 Deposit'}
          </button>
        ))}
      </div>

      {/* Deposit Tab */}
      {activeTab === 'deposit' && (
        <div className={card}>
          <h2 className={`text-lg sm:text-xl font-bold mb-4 ${text}`}>Add Funds</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Deposit Methods */}
            <div>
              <h3 className={`font-semibold mb-3 text-sm sm:text-base ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Deposit Methods
              </h3>
              <div className="space-y-2">
                <div className={`p-3 rounded-lg border ${darkMode ? 'border-orange-500 bg-orange-500/10' : 'border-orange-500 bg-orange-50'}`}>
                  <div className="flex items-center gap-3">
                    <span className="text-xl sm:text-2xl">💳</span>
                    <div className="flex-1 min-w-0">
                      <p className={`font-medium text-sm sm:text-base ${text}`}>Paystack</p>
                      <p className={`text-xs ${subtext}`}>Card, Bank Transfer, USSD</p>
                    </div>
                    <span className="text-xs bg-green-500/20 text-green-500 px-2 py-1 rounded-full whitespace-nowrap">
                      Active
                    </span>
                  </div>
                </div>
                <div className={`p-3 rounded-lg border opacity-50 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <div className="flex items-center gap-3">
                    <span className="text-xl sm:text-2xl">₿</span>
                    <div>
                      <p className={`font-medium text-sm sm:text-base ${text}`}>Cryptocurrency</p>
                      <p className={`text-xs ${subtext}`}>Coming soon</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Deposit Form */}
            <div>
              <form onSubmit={handlePaystackDeposit}>
                <label className={`block mb-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Amount (USD)
                </label>

                <div className="grid grid-cols-4 gap-2 mb-3">
                  {[10, 25, 50, 100].map(amt => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setDepositAmount(String(amt))}
                      className={`py-1.5 rounded-lg text-xs sm:text-sm transition ${
                        depositAmount === String(amt)
                          ? 'bg-orange-500 text-white'
                          : darkMode
                          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      ${amt}
                    </button>
                  ))}
                </div>

                <div className="flex gap-2 sm:gap-3">
                  <input
                    type="number"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    placeholder="Custom amount"
                    min="10"
                    step="1"
                    required
                    className={`flex-1 px-3 sm:px-4 py-2 rounded-lg border focus:outline-none focus:border-orange-500 text-sm ${
                      darkMode
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300 text-gray-800'
                    }`}
                  />
                  <button
                    type="submit"
                    disabled={depositing || !depositAmount || parseFloat(depositAmount) < 10}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-3 sm:px-6 py-2 rounded-lg transition disabled:opacity-50 whitespace-nowrap text-sm"
                  >
                    {depositing ? 'Processing...' : 'Deposit'}
                  </button>
                </div>
                <p className={`text-xs mt-2 ${subtext}`}>
                  Minimum deposit: $10. Powered by Paystack.
                </p>
              </form>

              <div className={`mt-4 p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <p className={`text-xs ${subtext}`}>
                  🔒 Secure payments powered by Paystack. Your financial information is never stored on our servers.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Transaction History */}
      {activeTab === 'overview' && (
        <div className={card}>
          <h2 className={`text-lg sm:text-xl font-bold mb-4 ${text}`}>Transaction History</h2>

          {transactions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-4xl mb-3">📭</p>
              <p className={subtext}>No transactions yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <div className="min-w-full px-4 sm:px-0">
                <table className="w-full">
                  <thead className={subtext}>
                    <tr className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                      <th className="text-left py-2 text-xs sm:text-sm pr-4">Date</th>
                      <th className="text-left py-2 text-xs sm:text-sm pr-4">Description</th>
                      <th className="text-left py-2 text-xs sm:text-sm pr-4">Amount</th>
                      <th className="text-left py-2 text-xs sm:text-sm">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((tx) => (
                      <tr
                        key={tx.id}
                        className={`border-b ${darkMode ? 'border-gray-700/50' : 'border-gray-100'}`}
                      >
                        <td className={`py-3 text-xs sm:text-sm pr-4 whitespace-nowrap ${subtext}`}>
                          {new Date(tx.created_at).toLocaleDateString()}
                        </td>
                        <td className={`py-3 text-xs sm:text-sm pr-4 max-w-[140px] sm:max-w-none truncate ${text}`}>
                          {tx.description}
                        </td>
                        <td className={`py-3 text-xs sm:text-sm font-semibold pr-4 whitespace-nowrap ${
                          tx.type === 'deposit' ? 'text-green-500' : 'text-red-500'
                        }`}>
                          {tx.type === 'deposit' ? '+' : '-'}${tx.amount?.toFixed(2)}
                        </td>
                        <td className="py-3">
                          <span className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ${
                            tx.status === 'success'
                              ? 'bg-green-500/20 text-green-500'
                              : tx.status === 'pending'
                              ? 'bg-yellow-500/20 text-yellow-500'
                              : 'bg-red-500/20 text-red-500'
                          }`}>
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
      )}
    </div>
  );
}