import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

export default function WithdrawFunds() {
  const { user } = useAuth();
  const { darkMode } = useTheme();
  const navigate = useNavigate();

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
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // Mock user balance - replace with actual from API
  const balance = 1247.89;
  const pendingBalance = 423.67;
  const availableBalance = balance - pendingBalance;

  const handleAmountChange = (e) => {
    const value = parseFloat(e.target.value);
    if (value > availableBalance) {
      setError(`Maximum withdrawal is $${availableBalance.toFixed(2)}`);
    } else {
      setError("");
    }
    setWithdrawAmount(e.target.value);
  };

  const handleWithdraw = async (e) => {
    e.preventDefault();

    const amount = parseFloat(withdrawAmount);

    if (amount < 50) {
      setError("Minimum withdrawal amount is $50");
      return;
    }

    if (amount > availableBalance) {
      setError(`Maximum withdrawal amount is $${availableBalance.toFixed(2)}`);
      return;
    }

    if (selectedMethod === "bank") {
      if (
        !bankDetails.accountName ||
        !bankDetails.accountNumber ||
        !bankDetails.bankName
      ) {
        setError("Please fill in all bank details");
        return;
      }
    }

    if (selectedMethod === "crypto") {
      if (!cryptoAddress) {
        setError("Please enter your crypto wallet address");
        return;
      }
    }

    setLoading(true);
    setError("");

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSuccess(
        `Withdrawal request of $${amount.toFixed(2)} submitted successfully!`,
      );
      setTimeout(() => {
        navigate("/provider/earnings");
      }, 2000);
    }, 1500);
  };

  const withdrawalMethods = [
    {
      id: "bank",
      name: "Bank Transfer",
      icon: "🏦",
      processingTime: "1-3 business days",
      fee: "$0",
      minAmount: 50,
      maxAmount: 5000,
    },
    {
      id: "crypto",
      name: "Cryptocurrency",
      icon: "₿",
      processingTime: "Instant - 1 hour",
      fee: "1%",
      minAmount: 50,
      maxAmount: 10000,
    },
    {
      id: "paypal",
      name: "PayPal",
      icon: "💳",
      processingTime: "24 hours",
      fee: "2%",
      minAmount: 50,
      maxAmount: 2000,
      comingSoon: true,
    },
  ];

  const cryptoOptions = [
    {
      value: "USDT",
      label: "Tether (USDT) - TRC20",
      network: "TRC20",
      minAmount: 50,
    },
    {
      value: "USDC",
      label: "USD Coin (USDC) - ERC20",
      network: "ERC20",
      minAmount: 50,
    },
    { value: "BTC", label: "Bitcoin (BTC)", network: "Bitcoin", minAmount: 50 },
    { value: "ETH", label: "Ethereum (ETH)", network: "ERC20", minAmount: 50 },
    { value: "SOL", label: "Solana (SOL)", network: "Solana", minAmount: 50 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1
          className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-800"}`}
        >
          Withdraw Funds
        </h1>
        <p className={darkMode ? "text-gray-400" : "text-gray-500"}>
          Withdraw your earnings to your bank or crypto wallet
        </p>
      </div>

      {/* Balance Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        <div
          className={`rounded-xl p-4 ${darkMode ? "bg-gray-800" : "bg-white shadow-lg"}`}
        >
          <p
            className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
          >
            Total Earnings
          </p>
          <p
            className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-800"}`}
          >
            ${balance.toFixed(2)}
          </p>
        </div>
        <div
          className={`rounded-xl p-4 ${darkMode ? "bg-gray-800" : "bg-white shadow-lg"}`}
        >
          <p
            className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
          >
            Pending Balance
          </p>
          <p className={`text-2xl font-bold text-yellow-500`}>
            ${pendingBalance.toFixed(2)}
          </p>
          <p
            className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-400"}`}
          >
            Processing
          </p>
        </div>
        <div
          className={`rounded-xl p-4 bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30`}
        >
          <p
            className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}
          >
            Available for Withdrawal
          </p>
          <p className={`text-3xl font-bold text-orange-500`}>
            ${availableBalance.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Success Message */}
      {success && (
        <div className="bg-green-500/20 border border-green-500 text-green-500 px-4 py-3 rounded-lg">
          {success}
        </div>
      )}

      {/* Withdrawal Form */}
      <div
        className={`rounded-xl p-6 ${darkMode ? "bg-gray-800" : "bg-white shadow-lg"}`}
      >
        <form onSubmit={handleWithdraw} className="space-y-6">
          {/* Step 1: Select Withdrawal Method */}
          <div>
            <h2
              className={`text-lg font-bold mb-4 ${darkMode ? "text-white" : "text-gray-800"}`}
            >
              Step 1: Select Withdrawal Method
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              {withdrawalMethods.map((method) => (
                <button
                  key={method.id}
                  type="button"
                  onClick={() =>
                    !method.comingSoon && setSelectedMethod(method.id)
                  }
                  disabled={method.comingSoon}
                  className={`p-4 rounded-xl border-2 transition text-left ${
                    selectedMethod === method.id
                      ? "border-orange-500 bg-orange-500/10"
                      : method.comingSoon
                        ? "border-gray-700 opacity-50 cursor-not-allowed"
                        : darkMode
                          ? "border-gray-700 hover:border-orange-500"
                          : "border-gray-200 hover:border-orange-500"
                  }`}
                >
                  <div className="text-3xl mb-2">{method.icon}</div>
                  <div
                    className={`font-semibold ${darkMode ? "text-white" : "text-gray-800"}`}
                  >
                    {method.name}
                  </div>
                  <div
                    className={`text-xs mt-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                  >
                    ⏱️ {method.processingTime}
                  </div>
                  <div
                    className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                  >
                    Fee: {method.fee}
                  </div>
                  {method.comingSoon && (
                    <div className="text-xs text-orange-500 mt-1">
                      Coming Soon
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Enter Amount */}
          <div>
            <h2
              className={`text-lg font-bold mb-4 ${darkMode ? "text-white" : "text-gray-800"}`}
            >
              Step 2: Enter Amount
            </h2>
            <div className="max-w-md">
              <label
                className={`block mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
              >
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
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300 text-gray-800"
                  }`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setWithdrawAmount(availableBalance.toString())}
                  className={`px-4 py-2 rounded-lg transition ${
                    darkMode
                      ? "bg-gray-700 hover:bg-gray-600 text-gray-300"
                      : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                  }`}
                >
                  Max
                </button>
              </div>
              <div className="flex justify-between mt-2">
                <p
                  className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-400"}`}
                >
                  Min: $50 | Max: $
                  {selectedMethod === "crypto" ? "10,000" : "5,000"}
                </p>
                <p
                  className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-400"}`}
                >
                  Available: ${availableBalance.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          {/* Step 3: Bank Details (if bank transfer selected) */}
          {selectedMethod === "bank" && (
            <div>
              <h2
                className={`text-lg font-bold mb-4 ${darkMode ? "text-white" : "text-gray-800"}`}
              >
                Step 3: Bank Account Details
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label
                    className={`block mb-2 text-sm ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                  >
                    Account Holder Name
                  </label>
                  <input
                    type="text"
                    value={bankDetails.accountName}
                    onChange={(e) =>
                      setBankDetails({
                        ...bankDetails,
                        accountName: e.target.value,
                      })
                    }
                    placeholder="John Doe"
                    className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:border-orange-500 ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300 text-gray-800"
                    }`}
                    required
                  />
                </div>
                <div>
                  <label
                    className={`block mb-2 text-sm ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                  >
                    Account Number
                  </label>
                  <input
                    type="text"
                    value={bankDetails.accountNumber}
                    onChange={(e) =>
                      setBankDetails({
                        ...bankDetails,
                        accountNumber: e.target.value,
                      })
                    }
                    placeholder="1234567890"
                    className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:border-orange-500 ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300 text-gray-800"
                    }`}
                    required
                  />
                </div>
                <div>
                  <label
                    className={`block mb-2 text-sm ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                  >
                    Bank Name
                  </label>
                  <input
                    type="text"
                    value={bankDetails.bankName}
                    onChange={(e) =>
                      setBankDetails({
                        ...bankDetails,
                        bankName: e.target.value,
                      })
                    }
                    placeholder="Chase Bank"
                    className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:border-orange-500 ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300 text-gray-800"
                    }`}
                    required
                  />
                </div>
                <div>
                  <label
                    className={`block mb-2 text-sm ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                  >
                    Routing Number (ABA)
                  </label>
                  <input
                    type="text"
                    value={bankDetails.routingNumber}
                    onChange={(e) =>
                      setBankDetails({
                        ...bankDetails,
                        routingNumber: e.target.value,
                      })
                    }
                    placeholder="021000021"
                    className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:border-orange-500 ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300 text-gray-800"
                    }`}
                  />
                </div>
              </div>
              <div
                className={`mt-4 p-3 rounded-lg text-xs ${darkMode ? "bg-yellow-500/10 text-yellow-400" : "bg-yellow-50 text-yellow-600"}`}
              >
                ⚠️ Bank transfers take 1-3 business days to process. Please
                ensure your account details are correct.
              </div>
            </div>
          )}

          {/* Step 3: Crypto Wallet Details */}
          {selectedMethod === "crypto" && (
            <div>
              <h2
                className={`text-lg font-bold mb-4 ${darkMode ? "text-white" : "text-gray-800"}`}
              >
                Step 3: Cryptocurrency Wallet
              </h2>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label
                    className={`block mb-2 text-sm ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                  >
                    Select Cryptocurrency
                  </label>
                  <select
                    value={selectedCrypto}
                    onChange={(e) => setSelectedCrypto(e.target.value)}
                    className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:border-orange-500 ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300 text-gray-800"
                    }`}
                  >
                    {cryptoOptions.map((crypto) => (
                      <option key={crypto.value} value={crypto.value}>
                        {crypto.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    className={`block mb-2 text-sm ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                  >
                    Wallet Address
                  </label>
                  <input
                    type="text"
                    value={cryptoAddress}
                    onChange={(e) => setCryptoAddress(e.target.value)}
                    placeholder={`Enter your ${selectedCrypto} wallet address`}
                    className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:border-orange-500 ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300 text-gray-800"
                    }`}
                    required
                  />
                </div>
              </div>

              {/* Network info */}
              <div
                className={`mt-4 p-3 rounded-lg text-xs ${darkMode ? "bg-blue-500/10 text-blue-400" : "bg-blue-50 text-blue-600"}`}
              >
                <p className="font-semibold mb-1">📌 Network Information:</p>
                <p>
                  Network:{" "}
                  {
                    cryptoOptions.find((c) => c.value === selectedCrypto)
                      ?.network
                  }
                </p>
                <p className="mt-1">
                  ⚠️ Send only {selectedCrypto} to this address. Sending other
                  cryptocurrencies may result in permanent loss.
                </p>
              </div>
            </div>
          )}

          {/* Fee Summary */}
          {withdrawAmount && parseFloat(withdrawAmount) >= 50 && (
            <div
              className={`p-4 rounded-lg ${darkMode ? "bg-gray-700" : "bg-gray-50"}`}
            >
              <h3
                className={`font-semibold mb-2 ${darkMode ? "text-white" : "text-gray-800"}`}
              >
                Withdrawal Summary
              </h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span
                    className={darkMode ? "text-gray-400" : "text-gray-500"}
                  >
                    Withdrawal Amount:
                  </span>
                  <span className="text-orange-500 font-semibold">
                    ${parseFloat(withdrawAmount).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span
                    className={darkMode ? "text-gray-400" : "text-gray-500"}
                  >
                    Processing Fee:
                  </span>
                  <span
                    className={darkMode ? "text-gray-300" : "text-gray-700"}
                  >
                    {selectedMethod === "crypto"
                      ? `1% ($${(parseFloat(withdrawAmount) * 0.01).toFixed(2)})`
                      : "$0"}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-600">
                  <span
                    className={`font-semibold ${darkMode ? "text-white" : "text-gray-800"}`}
                  >
                    You Will Receive:
                  </span>
                  <span className="text-green-500 font-bold">
                    $
                    {selectedMethod === "crypto"
                      ? (parseFloat(withdrawAmount) * 0.99).toFixed(2)
                      : parseFloat(withdrawAmount).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-400 px-4 py-2 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={
                loading ||
                !withdrawAmount ||
                parseFloat(withdrawAmount) < 50 ||
                parseFloat(withdrawAmount) > availableBalance
              }
              className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50"
            >
              {loading
                ? "Processing Withdrawal..."
                : `Withdraw $${withdrawAmount || "0"}`}
            </button>
            <button
              type="button"
              onClick={() => navigate("/provider/earnings")}
              className={`px-6 py-3 rounded-lg transition ${
                darkMode
                  ? "bg-gray-700 hover:bg-gray-600 text-gray-300"
                  : "bg-gray-200 hover:bg-gray-300 text-gray-700"
              }`}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      {/* Withdrawal History */}
      <div
        className={`rounded-xl p-6 ${darkMode ? "bg-gray-800" : "bg-white shadow-lg"}`}
      >
        <h2
          className={`text-lg font-bold mb-4 ${darkMode ? "text-white" : "text-gray-800"}`}
        >
          Recent Withdrawals
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={darkMode ? "text-gray-400" : "text-gray-500"}>
              <tr className="border-b border-gray-700">
                <th className="text-left py-2">Date</th>
                <th className="text-left py-2">Method</th>
                <th className="text-left py-2">Amount</th>
                <th className="text-left py-2">Fee</th>
                <th className="text-left py-2">Status</th>
                <th className="text-left py-2">Transaction ID</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-700/50">
                <td className="py-3 text-sm">2024-01-10</td>
                <td className="py-3">🏦 Bank Transfer</td>
                <td className="py-3 text-green-500">$150.00</td>
                <td className="py-3">$0</td>
                <td className="py-3">
                  <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-500">
                    Completed
                  </span>
                </td>
                <td className="py-3 text-xs font-mono">TRX-123456789</td>
              </tr>
              <tr className="border-b border-gray-700/50">
                <td className="py-3 text-sm">2024-01-05</td>
                <td className="py-3">₿ Bitcoin</td>
                <td className="py-3 text-green-500">$200.00</td>
                <td className="py-3">$2.00</td>
                <td className="py-3">
                  <span className="text-xs px-2 py-1 rounded-full bg-yellow-500/20 text-yellow-500">
                    Processing
                  </span>
                </td>
                <td className="py-3 text-xs font-mono">0x7a3...b9f</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* FAQ Section */}
      <div
        className={`rounded-xl p-6 ${darkMode ? "bg-gray-800" : "bg-white shadow-lg"}`}
      >
        <h2
          className={`text-lg font-bold mb-4 ${darkMode ? "text-white" : "text-gray-800"}`}
        >
          Frequently Asked Questions
        </h2>
        <div className="space-y-3">
          <div>
            <h3
              className={`font-semibold ${darkMode ? "text-white" : "text-gray-800"}`}
            >
              How long do withdrawals take?
            </h3>
            <p
              className={`text-sm mt-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}
            >
              Bank transfers: 1-3 business days. Cryptocurrency: Instant to 1
              hour. PayPal: 24 hours.
            </p>
          </div>
          <div>
            <h3
              className={`font-semibold ${darkMode ? "text-white" : "text-gray-800"}`}
            >
              What are the fees?
            </h3>
            <p
              className={`text-sm mt-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}
            >
              Bank transfers: Free. Cryptocurrency: 1% fee. PayPal: 2% fee
              (coming soon).
            </p>
          </div>
          <div>
            <h3
              className={`font-semibold ${darkMode ? "text-white" : "text-gray-800"}`}
            >
              Why is my balance pending?
            </h3>
            <p
              className={`text-sm mt-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}
            >
              Earnings from signal sales are held for 7 days to protect buyers
              and ensure quality signals.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
