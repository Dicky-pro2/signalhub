import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { supabase } from "../config/supabase";

export default function WithdrawFunds() {
  const { user } = useAuth();
  const { darkMode } = useTheme();
  const navigate = useNavigate();

  const [wallet, setWallet] = useState(null);
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [selectedMethod, setSelectedMethod] = useState("bank");
  const [selectedCrypto, setSelectedCrypto] = useState("USDT");
  const [bankDetails, setBankDetails] = useState({
    accountName: "",
    accountNumber: "",
    bankName: "",
    routingNumber: "",
  });
  const [cryptoAddress, setCryptoAddress] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!user) return;
    fetchData();
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch wallet
      const { data: walletData } = await supabase
        .from('wallets')
        .select('*')
        .eq('user_id', user.id)
        .single();

      // Fetch withdrawal history
      const { data: withdrawalData } = await supabase
        .from('withdrawals')
        .select('*')
        .eq('provider_id', user.id)
        .order('created_at', { ascending: false });

      setWallet(walletData);
      setWithdrawals(withdrawalData || []);
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const balance = wallet?.balance || 0;
  const totalWithdrawn = wallet?.total_withdrawn || 0;
  const pendingAmount = withdrawals
    .filter(w => w.status === 'pending')
    .reduce((sum, w) => sum + w.amount, 0);
  const availableBalance = balance - pendingAmount;

  const handleAmountChange = (e) => {
    const value = e.target.value;
    setWithdrawAmount(value);
    if (parseFloat(value) > availableBalance) {
      setError(`Maximum withdrawal is $${availableBalance.toFixed(2)}`);
    } else {
      setError('');
    }
  };

  const handleWithdraw = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const amount = parseFloat(withdrawAmount);

    if (amount < 50) {
      setError('Minimum withdrawal amount is $50');
      return;
    }
    if (amount > availableBalance) {
      setError(`Maximum withdrawal is $${availableBalance.toFixed(2)}`);
      return;
    }
    if (selectedMethod === 'bank') {
      if (!bankDetails.accountName || !bankDetails.accountNumber || !bankDetails.bankName) {
        setError('Please fill in all bank details');
        return;
      }
    }
    if (selectedMethod === 'crypto' && !cryptoAddress) {
      setError('Please enter your crypto wallet address');
      return;
    }

    setSubmitting(true);
    try {
      // Create withdrawal request
      const { error: withdrawError } = await supabase
        .from('withdrawals')
        .insert({
          provider_id: user.id,
          amount,
          status: 'pending',
          bank_name: selectedMethod === 'bank' ? bankDetails.bankName : selectedCrypto,
          account_number: selectedMethod === 'bank' ? bankDetails.accountNumber : cryptoAddress,
          account_name: selectedMethod === 'bank' ? bankDetails.accountName : `${selectedCrypto} Wallet`,
        });

      if (withdrawError) throw withdrawError;

      // Create transaction record
      await supabase.from('transactions').insert({
        user_id: user.id,
        type: 'withdrawal',
        amount,
        status: 'pending',
        reference: `WDR-${Date.now()}`,
        description: `Withdrawal via ${selectedMethod === 'bank' ? 'Bank Transfer' : selectedCrypto}`,
      });

      // Send notification
      await supabase.from('notifications').insert({
        user_id: user.id,
        title: 'Withdrawal Request Submitted',
        message: `Your withdrawal of $${amount.toFixed(2)} is being processed.`,
        type: 'info',
      });

      setSuccess(`Withdrawal request of $${amount.toFixed(2)} submitted successfully!`);
      setWithdrawAmount('');
      setBankDetails({ accountName: '', accountNumber: '', bankName: '', routingNumber: '' });
      setCryptoAddress('');
      fetchData();

      setTimeout(() => navigate('/provider/earnings'), 2000);
    } catch (err) {
      setError(err.message || 'Failed to submit withdrawal request');
    } finally {
      setSubmitting(false);
    }
  };

  const withdrawalMethods = [
    { id: 'bank', name: 'Bank Transfer', icon: '🏦', processingTime: '1-3 business days', fee: '$0' },
    { id: 'crypto', name: 'Cryptocurrency', icon: '₿', processingTime: 'Instant - 1 hour', fee: '1%' },
    { id: 'paypal', name: 'PayPal', icon: '💳', processingTime: '24 hours', fee: '2%', comingSoon: true },
  ];

  const cryptoOptions = [
    { value: 'USDT', label: 'Tether (USDT) - TRC20', network: 'TRC20' },
    { value: 'USDC', label: 'USD Coin (USDC) - ERC20', network: 'ERC20' },
    { value: 'BTC', label: 'Bitcoin (BTC)', network: 'Bitcoin' },
    { value: 'ETH', label: 'Ethereum (ETH)', network: 'ERC20' },
    { value: 'SOL', label: 'Solana (SOL)', network: 'Solana' },
  ];

  const text = darkMode ? 'text-white' : 'text-gray-800';
  const subtext = darkMode ? 'text-gray-400' : 'text-gray-500';
  const card = `rounded-xl p-4 ${darkMode ? 'bg-gray-800' : 'bg-white shadow-lg'}`;
  const input = `w-full px-4 py-2 rounded-lg border focus:outline-none focus:border-orange-500 ${
    darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'
  }`;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className={`text-2xl font-bold ${text}`}>Withdraw Funds</h1>
        <p className={subtext}>Withdraw your earnings to your bank or crypto wallet</p>
      </div>

      {/* Balance Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className={card}>
          <p className={`text-sm ${subtext}`}>Total Earnings</p>
          <p className={`text-2xl font-bold ${text}`}>${(wallet?.total_earned || 0).toFixed(2)}</p>
        </div>
        <div className={card}>
          <p className={`text-sm ${subtext}`}>Pending Withdrawals</p>
          <p className="text-2xl font-bold text-yellow-500">${pendingAmount.toFixed(2)}</p>
          <p className={`text-xs ${subtext}`}>Processing</p>
        </div>
        <div className="rounded-xl p-4 bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30">
          <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Available for Withdrawal</p>
          <p className="text-3xl font-bold text-orange-500">${availableBalance.toFixed(2)}</p>
        </div>
      </div>

      {success && (
        <div className="bg-green-500/20 border border-green-500 text-green-500 px-4 py-3 rounded-lg">
          {success}
        </div>
      )}

      {/* Withdrawal Form */}
      <div className={`rounded-xl p-6 ${darkMode ? 'bg-gray-800' : 'bg-white shadow-lg'}`}>
        <form onSubmit={handleWithdraw} className="space-y-6">

          {/* Step 1: Method */}
          <div>
            <h2 className={`text-lg font-bold mb-4 ${text}`}>Step 1: Select Withdrawal Method</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {withdrawalMethods.map((method) => (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => !method.comingSoon && setSelectedMethod(method.id)}
                  disabled={method.comingSoon}
                  className={`p-4 rounded-xl border-2 transition text-left ${
                    selectedMethod === method.id
                      ? 'border-orange-500 bg-orange-500/10'
                      : method.comingSoon
                      ? 'border-gray-700 opacity-50 cursor-not-allowed'
                      : darkMode
                      ? 'border-gray-700 hover:border-orange-500'
                      : 'border-gray-200 hover:border-orange-500'
                  }`}
                >
                  <div className="text-3xl mb-2">{method.icon}</div>
                  <div className={`font-semibold ${text}`}>{method.name}</div>
                  <div className={`text-xs mt-1 ${subtext}`}>⏱️ {method.processingTime}</div>
                  <div className={`text-xs ${subtext}`}>Fee: {method.fee}</div>
                  {method.comingSoon && <div className="text-xs text-orange-500 mt-1">Coming Soon</div>}
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Amount */}
          <div>
            <h2 className={`text-lg font-bold mb-4 ${text}`}>Step 2: Enter Amount</h2>
            <div className="max-w-md">
              <label className={`block mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Withdrawal Amount (USD)
              </label>
              <div className="flex gap-3">
                <input
                  type="number"
                  value={withdrawAmount}
                  onChange={handleAmountChange}
                  placeholder="Enter amount"
                  step="10"
                  min="50"
                  max={availableBalance}
                  className={`flex-1 px-4 py-3 rounded-lg border text-lg focus:outline-none focus:border-orange-500 ${
                    darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'
                  }`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setWithdrawAmount(availableBalance.toString())}
                  className={`px-4 py-2 rounded-lg transition ${
                    darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                  }`}
                >
                  Max
                </button>
              </div>
              <div className="flex justify-between mt-2">
                <p className={`text-xs ${subtext}`}>Min: $50 | Max: ${selectedMethod === 'crypto' ? '10,000' : '5,000'}</p>
                <p className={`text-xs ${subtext}`}>Available: ${availableBalance.toFixed(2)}</p>
              </div>
            </div>
          </div>

          {/* Step 3: Bank Details */}
          {selectedMethod === 'bank' && (
            <div>
              <h2 className={`text-lg font-bold mb-4 ${text}`}>Step 3: Bank Account Details</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className={`block mb-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Account Holder Name</label>
                  <input type="text" value={bankDetails.accountName} onChange={(e) => setBankDetails({ ...bankDetails, accountName: e.target.value })} placeholder="John Doe" className={input} required />
                </div>
                <div>
                  <label className={`block mb-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Account Number</label>
                  <input type="text" value={bankDetails.accountNumber} onChange={(e) => setBankDetails({ ...bankDetails, accountNumber: e.target.value })} placeholder="1234567890" className={input} required />
                </div>
                <div>
                  <label className={`block mb-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Bank Name</label>
                  <input type="text" value={bankDetails.bankName} onChange={(e) => setBankDetails({ ...bankDetails, bankName: e.target.value })} placeholder="Access Bank" className={input} required />
                </div>
                <div>
                  <label className={`block mb-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Routing Number (optional)</label>
                  <input type="text" value={bankDetails.routingNumber} onChange={(e) => setBankDetails({ ...bankDetails, routingNumber: e.target.value })} placeholder="021000021" className={input} />
                </div>
              </div>
              <div className={`mt-4 p-3 rounded-lg text-xs ${darkMode ? 'bg-yellow-500/10 text-yellow-400' : 'bg-yellow-50 text-yellow-600'}`}>
                ⚠️ Bank transfers take 1-3 business days. Please ensure your account details are correct.
              </div>
            </div>
          )}

          {/* Step 3: Crypto Details */}
          {selectedMethod === 'crypto' && (
            <div>
              <h2 className={`text-lg font-bold mb-4 ${text}`}>Step 3: Cryptocurrency Wallet</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className={`block mb-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Select Cryptocurrency</label>
                  <select value={selectedCrypto} onChange={(e) => setSelectedCrypto(e.target.value)} className={input}>
                    {cryptoOptions.map((crypto) => (
                      <option key={crypto.value} value={crypto.value}>{crypto.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={`block mb-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Wallet Address</label>
                  <input type="text" value={cryptoAddress} onChange={(e) => setCryptoAddress(e.target.value)} placeholder={`Enter your ${selectedCrypto} wallet address`} className={input} required />
                </div>
              </div>
              <div className={`mt-4 p-3 rounded-lg text-xs ${darkMode ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
                <p className="font-semibold mb-1">📌 Network: {cryptoOptions.find(c => c.value === selectedCrypto)?.network}</p>
                <p>⚠️ Send only {selectedCrypto} to this address. Wrong network = permanent loss.</p>
              </div>
            </div>
          )}

          {/* Fee Summary */}
          {withdrawAmount && parseFloat(withdrawAmount) >= 50 && (
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <h3 className={`font-semibold mb-2 ${text}`}>Withdrawal Summary</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className={subtext}>Withdrawal Amount:</span>
                  <span className="text-orange-500 font-semibold">${parseFloat(withdrawAmount).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className={subtext}>Processing Fee:</span>
                  <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                    {selectedMethod === 'crypto' ? `1% ($${(parseFloat(withdrawAmount) * 0.01).toFixed(2)})` : '$0'}
                  </span>
                </div>
                <div className={`flex justify-between pt-2 border-t ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                  <span className={`font-semibold ${text}`}>You Will Receive:</span>
                  <span className="text-green-500 font-bold">
                    ${selectedMethod === 'crypto'
                      ? (parseFloat(withdrawAmount) * 0.99).toFixed(2)
                      : parseFloat(withdrawAmount).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-400 px-4 py-2 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={submitting || !withdrawAmount || parseFloat(withdrawAmount) < 50 || parseFloat(withdrawAmount) > availableBalance}
              className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50"
            >
              {submitting ? 'Processing...' : `Withdraw $${withdrawAmount || '0'}`}
            </button>
            <button
              type="button"
              onClick={() => navigate('/provider/earnings')}
              className={`px-6 py-3 rounded-lg transition ${
                darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              }`}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      {/* Withdrawal History */}
      <div className={`rounded-xl p-6 ${darkMode ? 'bg-gray-800' : 'bg-white shadow-lg'}`}>
        <h2 className={`text-lg font-bold mb-4 ${text}`}>Recent Withdrawals</h2>

        {withdrawals.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-4xl mb-3">📭</p>
            <p className={subtext}>No withdrawals yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={subtext}>
                <tr className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <th className="text-left py-2">Date</th>
                  <th className="text-left py-2">Method</th>
                  <th className="text-left py-2">Amount</th>
                  <th className="text-left py-2">Account</th>
                  <th className="text-left py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {withdrawals.map((w) => (
                  <tr key={w.id} className={`border-b ${darkMode ? 'border-gray-700/50' : 'border-gray-100'}`}>
                    <td className={`py-3 text-sm ${subtext}`}>
                      {new Date(w.created_at).toLocaleDateString()}
                    </td>
                    <td className={`py-3 ${text}`}>{w.bank_name}</td>
                    <td className="py-3 text-green-500">${w.amount?.toFixed(2)}</td>
                    <td className={`py-3 text-sm font-mono ${subtext}`}>
                      {w.account_number?.slice(0, 6)}...
                    </td>
                    <td className="py-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        w.status === 'approved'
                          ? 'bg-green-500/20 text-green-500'
                          : w.status === 'pending'
                          ? 'bg-yellow-500/20 text-yellow-500'
                          : 'bg-red-500/20 text-red-500'
                      }`}>
                        {w.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* FAQ */}
      <div className={`rounded-xl p-6 ${darkMode ? 'bg-gray-800' : 'bg-white shadow-lg'}`}>
        <h2 className={`text-lg font-bold mb-4 ${text}`}>Frequently Asked Questions</h2>
        <div className="space-y-3">
          {[
            { q: 'How long do withdrawals take?', a: 'Bank transfers: 1-3 business days. Cryptocurrency: Instant to 1 hour.' },
            { q: 'What are the fees?', a: 'Bank transfers: Free. Cryptocurrency: 1% fee. PayPal: 2% fee (coming soon).' },
            { q: 'Why is my balance pending?', a: 'Earnings from signal sales are held for 7 days to protect buyers and ensure quality signals.' },
          ].map((faq, i) => (
            <div key={i}>
              <h3 className={`font-semibold ${text}`}>{faq.q}</h3>
              <p className={`text-sm mt-1 ${subtext}`}>{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}