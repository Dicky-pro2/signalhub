import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';

export default function LandingPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('forex');

  // Mock top signals data (replace with real API later)
  const topSignals = {
    forex: [
      { pair: 'EUR/USD', price: '1.0892', change: '+0.42%', provider: 'ForexMaster', winRate: '78%', signalPrice: '$2.99' },
      { pair: 'GBP/JPY', price: '191.45', change: '+1.23%', provider: 'LondonTrader', winRate: '82%', signalPrice: '$3.49' },
      { pair: 'AUD/USD', price: '0.6584', change: '-0.18%', provider: 'AussieShark', winRate: '71%', signalPrice: '$2.49' },
      { pair: 'USD/CAD', price: '1.3742', change: '+0.31%', provider: 'OilTrader', winRate: '76%', signalPrice: '$2.99' },
      { pair: 'NZD/USD', price: '0.5942', change: '+0.15%', provider: 'KiwiPro', winRate: '74%', signalPrice: '$2.79' },
    ],
    crypto: [
      { pair: 'BTC/USD', price: '$68,420', change: '+2.7%', provider: 'CryptoKing', winRate: '84%', signalPrice: '$4.99' },
      { pair: 'ETH/USD', price: '$3,845', change: '+5.57%', provider: 'EtherWhale', winRate: '79%', signalPrice: '$3.99' },
      { pair: 'SOL/USD', price: '$162.18', change: '+14.44%', provider: 'SolanaBull', winRate: '88%', signalPrice: '$3.49' },
      { pair: 'DOGE/USD', price: '$0.158', change: '-1.32%', provider: 'MemeMaster', winRate: '65%', signalPrice: '$1.99' },
      { pair: 'BNB/USD', price: '$582.50', change: '+3.21%', provider: 'BinancePro', winRate: '81%', signalPrice: '$3.99' },
    ],
    stocks: [
      { pair: 'AAPL', price: '$187.32', change: '+1.25%', provider: 'TechTrader', winRate: '76%', signalPrice: '$3.49' },
      { pair: 'NVDA', price: '$892.64', change: '+3.42%', provider: 'AIInvestor', winRate: '91%', signalPrice: '$4.99' },
      { pair: 'TSLA', price: '$175.48', change: '-0.85%', provider: 'MuskWatcher', winRate: '69%', signalPrice: '$3.99' },
      { pair: 'MSFT', price: '$420.15', change: '+0.92%', provider: 'CloudExpert', winRate: '82%', signalPrice: '$3.49' },
      { pair: 'AMZN', price: '$178.22', change: '+1.08%', provider: 'EcomPro', winRate: '77%', signalPrice: '$3.29' },
    ],
  };

  const topProviders = [
    { name: 'CryptoKing', market: 'Crypto', winRate: '84%', rating: 4.9, totalSignals: 342, earnings: '$12,847' },
    { name: 'AIInvestor', market: 'Stocks', winRate: '91%', rating: 4.95, totalSignals: 156, earnings: '$8,234' },
    { name: 'LondonTrader', market: 'Forex', winRate: '82%', rating: 4.8, totalSignals: 423, earnings: '$15,632' },
    { name: 'SolanaBull', market: 'Crypto', winRate: '88%', rating: 4.85, totalSignals: 98, earnings: '$4,567' },
    { name: 'ForexMaster', market: 'Forex', winRate: '78%', rating: 4.7, totalSignals: 567, earnings: '$18,923' },
  ];

  const testimonials = [
    { name: 'Marcus T.', role: 'Part-time Trader', text: 'Went from losing money to consistent profits. Best $3 I spend every day.', rating: 5, avatar: 'MT' },
    { name: 'Sarah K.', role: 'Full-time Mom', text: 'I don\'t have time to analyze charts. Signal Hub does it for me. Life changer!', rating: 5, avatar: 'SK' },
    { name: 'David L.', role: 'Student', text: 'Cheaper than any mentorship and actually works. My portfolio is up 34% this month.', rating: 5, avatar: 'DL' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/10 to-transparent"></div>
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 rounded-full px-4 py-2 mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-sm text-blue-300">Live Signals Available Now</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Trade Smarter,{' '}
            <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
              Not Harder
            </span>
          </h1>
          
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Get expert trading signals for Forex, Crypto & Stocks at prices anyone can afford. 
            No $1000 mentorships. No expensive VIP groups. Just profitable signals.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {!user ? (
              <>
                <Link
                  to="/signup"
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold px-8 py-3 rounded-lg transition shadow-lg shadow-blue-500/25"
                >
                  Start Trading Now →
                </Link>
                <Link
                  to="/signin"
                  className="border border-gray-700 hover:border-blue-500 text-gray-300 hover:text-white font-semibold px-8 py-3 rounded-lg transition"
                >
                  Sign In
                </Link>
              </>
            ) : (
              <Link
                to="/marketplace"
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition shadow-lg shadow-blue-500/25"
              >
                Go to Marketplace →
              </Link>
            )}
          </div>
          
          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 pt-8 border-t border-gray-800">
            <div>
              <div className="text-3xl font-bold text-blue-500">500+</div>
              <div className="text-gray-400 text-sm mt-1">Active Signals</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-500">89%</div>
              <div className="text-gray-400 text-sm mt-1">Avg Win Rate</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-500">50+</div>
              <div className="text-gray-400 text-sm mt-1">Expert Providers</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-500">$2.99</div>
              <div className="text-gray-400 text-sm mt-1">Starting Price</div>
            </div>
          </div>
        </div>
      </div>

      {/* Market Data Table Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Top Performing Signals Right Now
          </h2>
          <p className="text-gray-400 text-lg">
            Real-time signals from our highest-rated providers
          </p>
        </div>

        {/* Market Tabs */}
        <div className="flex justify-center gap-2 mb-8">
          {['forex', 'crypto', 'stocks'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-lg font-semibold transition capitalize ${
                activeTab === tab
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
              }`}
            >
              {tab === 'forex' ? '💱 Forex' : tab === 'crypto' ? '₿ Crypto' : '📈 Stocks'}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800/50">
                <tr className="border-b border-gray-800">
                  <th className="text-left px-6 py-4 text-gray-400 font-semibold">Pair</th>
                  <th className="text-left px-6 py-4 text-gray-400 font-semibold">Price</th>
                  <th className="text-left px-6 py-4 text-gray-400 font-semibold">Provider</th>
                  <th className="text-left px-6 py-4 text-gray-400 font-semibold">Win Rate</th>
                  <th className="text-left px-6 py-4 text-gray-400 font-semibold">Signal Price</th>
                  <th className="text-left px-6 py-4 text-gray-400 font-semibold"></th>
                </tr>
              </thead>
              <tbody>
                {topSignals[activeTab].map((signal, idx) => (
                  <tr key={idx} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition">
                    <td className="px-6 py-4">
                      <span className="text-white font-medium">{signal.pair}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-white">{signal.price}</span>
                      <span className={`ml-2 text-sm ${signal.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                        {signal.change}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-300">{signal.provider}</span>
                      <div className="text-xs text-yellow-500">★ {signal.winRate} win rate</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-700 rounded-full h-2">
                          <div className="bg-green-500 rounded-full h-2" style={{ width: signal.winRate }}></div>
                        </div>
                        <span className="text-green-400 text-sm">{signal.winRate}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-blue-400 font-semibold">{signal.signalPrice}</span>
                    </td>
                    <td className="px-6 py-4">
                      <button className="text-sm bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white px-4 py-1 rounded transition">
                        Buy
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="text-center mt-6">
          <p className="text-gray-500 text-sm">† 500+ more signals available. Prices vary by provider.</p>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Why Traders Choose Signal Hub
          </h2>
          <p className="text-gray-400 text-lg">
            Everything you need to succeed, without breaking the bank
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-xl p-6 hover:border-blue-500/50 transition">
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">💰</span>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Pay Per Signal</h3>
            <p className="text-gray-400">
              Only pay for what you use. Signals starting as low as $2.99. No subscriptions, no hidden fees.
            </p>
          </div>
          
          <div className="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-xl p-6 hover:border-blue-500/50 transition">
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">⭐</span>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Verified Experts</h3>
            <p className="text-gray-400">
              Every provider is vetted and ranked by real performance. No fake gurus, just proven traders.
            </p>
          </div>
          
          <div className="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-xl p-6 hover:border-blue-500/50 transition">
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">📊</span>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">3 Markets, 1 Platform</h3>
            <p className="text-gray-400">
              Forex, Crypto & Stocks. All in one place. All verified by real traders with trackable results.
            </p>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-gray-900/30 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Get started in 4 simple steps
            </h2>
            <p className="text-gray-400 text-lg">
              From signup to your first profitable trade in minutes
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg shadow-blue-500/25">
                1
              </div>
              <h3 className="text-white font-semibold mb-2">Create Account</h3>
              <p className="text-gray-400 text-sm">Sign up for free in under 30 seconds</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg shadow-purple-500/25">
                2
              </div>
              <h3 className="text-white font-semibold mb-2">Add Funds</h3>
              <p className="text-gray-400 text-sm">Deposit as little as $10 to your wallet</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg shadow-green-500/25">
                3
              </div>
              <h3 className="text-white font-semibold mb-2">Browse Signals</h3>
              <p className="text-gray-400 text-sm">Find signals from top-rated providers</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg shadow-orange-500/25">
                4
              </div>
              <h3 className="text-white font-semibold mb-2">Buy & Trade</h3>
              <p className="text-gray-400 text-sm">Purchase signal and execute the trade</p>
            </div>
          </div>
        </div>
      </div>

      {/* Top Providers Leaderboard */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            🏆 Top Rated Providers
          </h2>
          <p className="text-gray-400 text-lg">
            Join thousands of traders who trust our experts
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topProviders.map((provider, idx) => (
            <div key={idx} className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 hover:border-blue-500/50 transition">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-2xl">🥇</span>
                    <h3 className="text-white font-bold text-lg">{provider.name}</h3>
                  </div>
                  <span className="text-xs px-2 py-1 bg-gray-800 rounded text-gray-400">{provider.market}</span>
                </div>
                <div className="text-right">
                  <div className="text-yellow-400 text-lg">★ {provider.rating}</div>
                  <div className="text-green-400 text-sm">{provider.winRate} win rate</div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4 pt-4 border-t border-gray-800">
                <div>
                  <p className="text-gray-500 text-xs">Total Signals</p>
                  <p className="text-white font-semibold">{provider.totalSignals}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Total Earnings</p>
                  <p className="text-green-400 font-semibold">{provider.earnings}</p>
                </div>
              </div>
              
              <button className="w-full bg-gray-800 hover:bg-gray-700 text-white py-2 rounded-lg transition text-sm">
                View Signals →
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials */}
      <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Trusted by 10,000+ Traders
            </h2>
            <p className="text-gray-400 text-lg">
              Real results from real people
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, idx) => (
              <div key={idx} className="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="text-white font-semibold">{testimonial.name}</p>
                    <p className="text-gray-500 text-sm">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400">★</span>
                  ))}
                </div>
                <p className="text-gray-300 italic">"{testimonial.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Partners/Clients */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <p className="text-center text-gray-500 text-sm mb-8">TRUSTED BY TRADERS WORLDWIDE</p>
        <div className="flex flex-wrap justify-center items-center gap-12 opacity-50">
          <span className="text-gray-400 text-xl font-bold">TRADINGVIEW</span>
          <span className="text-gray-400 text-xl font-bold">MT4</span>
          <span className="text-gray-400 text-xl font-bold">BINANCE</span>
          <span className="text-gray-400 text-xl font-bold">COINBASE</span>
          <span className="text-gray-400 text-xl font-bold">METATRADER</span>
        </div>
      </div>

      {/* Final CTA */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-2xl p-12 backdrop-blur">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to start trading smarter?
          </h2>
          <p className="text-gray-300 text-lg mb-8">
            Join thousands of traders who are already profiting with Signal Hub
          </p>
          {!user ? (
            <Link
              to="/signup"
              className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8 py-3 rounded-lg transition shadow-lg shadow-blue-500/25"
            >
              Create Free Account →
            </Link>
          ) : (
            <Link
              to="/marketplace"
              className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8 py-3 rounded-lg transition shadow-lg shadow-blue-500/25"
            >
              Browse Marketplace →
            </Link>
          )}
          <p className="text-gray-500 text-xs mt-6">
            *This platform is for educational purposes. Trading involves risk. Past performance does not guarantee future results.
          </p>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="border-t border-gray-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500 text-sm">
          <p>© 2024 Signal Hub. All rights reserved. Not financial advice.</p>
          <p className="mt-2">Make trading accessible to everyone</p>
        </div>
      </footer>
    </div>
  );
}