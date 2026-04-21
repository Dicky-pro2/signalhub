import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';

export default function LandingPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('forex');
  const [animatedNumbers, setAnimatedNumbers] = useState({
    signals: 0,
    winRate: 0,
    providers: 0,
    price: 0
  });
  const [isVisible, setIsVisible] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Only animate numbers when component is in viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    
    const statsSection = document.getElementById('stats-section');
    if (statsSection) observer.observe(statsSection);
    
    return () => observer.disconnect();
  }, []);

  // Optimized number animation - only runs once when visible
  useEffect(() => {
    if (!isVisible) return;
    
    const targets = { signals: 500, winRate: 89, providers: 50, price: 299 };
    const duration = 1500;
    const startTime = performance.now();
    
    const animateNumbers = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      setAnimatedNumbers({
        signals: Math.floor(targets.signals * progress),
        winRate: Math.floor(targets.winRate * progress),
        providers: Math.floor(targets.providers * progress),
        price: Math.floor(targets.price * progress)
      });
      
      if (progress < 1) {
        requestAnimationFrame(animateNumbers);
      }
    };
    
    requestAnimationFrame(animateNumbers);
  }, [isVisible]);

  // Get dashboard link based on user role
  const getDashboardLink = () => {
    if (!user) return '/signin';
    if (user.role === 'admin') return '/admin';
    if (user.role === 'provider') return '/provider';
    return '/dashboard';
  };

  // Get button text based on user role
  const getDashboardButtonText = () => {
    if (!user) return 'Sign In';
    if (user.role === 'admin') return 'Admin Panel';
    if (user.role === 'provider') return 'Provider Dashboard';
    return 'Dashboard';
  };

  // Memoize data to prevent unnecessary re-renders
  const topSignals = useMemo(() => ({
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
  }), []);

  const topProviders = useMemo(() => [
    { name: 'CryptoKing', market: 'Crypto', winRate: '84%', rating: 4.9, totalSignals: 342, earnings: '$12,847' },
    { name: 'AIInvestor', market: 'Stocks', winRate: '91%', rating: 4.95, totalSignals: 156, earnings: '$8,234' },
    { name: 'LondonTrader', market: 'Forex', winRate: '82%', rating: 4.8, totalSignals: 423, earnings: '$15,632' },
    { name: 'SolanaBull', market: 'Crypto', winRate: '88%', rating: 4.85, totalSignals: 98, earnings: '$4,567' },
    { name: 'ForexMaster', market: 'Forex', winRate: '78%', rating: 4.7, totalSignals: 567, earnings: '$18,923' },
  ], []);

  const testimonials = useMemo(() => [
    { name: 'Marcus T.', role: 'Part-time Trader', text: 'Went from losing money to consistent profits. Best $3 I spend every day.', rating: 5, avatar: 'MT' },
    { name: 'Sarah K.', role: 'Full-time Mom', text: 'I don\'t have time to analyze charts. Signal Hub does it for me. Life changer!', rating: 5, avatar: 'SK' },
    { name: 'David L.', role: 'Student', text: 'Cheaper than any mentorship and actually works. My portfolio is up 34% this month.', rating: 5, avatar: 'DL' },
  ], []);

  // Simplified, faster animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black">
      
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-gray-900/95 backdrop-blur border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="text-2xl font-bold">
            <img src="/signalhub-logo.png" alt="Signal Hub Logo" className="w-10 h-10 inline-block mr-2 rounded-l-xl" />
              <span className="text-white">Signal</span>
              <span className="text-orange-500">Hub</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              <Link to="/marketplace" className="text-gray-300 hover:text-white transition">
                Marketplace
              </Link>
              
              {user ? (
                <>
                  <Link to={getDashboardLink()} className="text-gray-300 hover:text-white transition">
                    {getDashboardButtonText()}
                  </Link>
                  <Link
                    to="/marketplace"
                    className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition"
                  >
                    Start Trading
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/signin" className="text-gray-300 hover:text-white transition">
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg hover:bg-gray-800 transition"
              >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-800">
              <div className="flex flex-col space-y-3">
                <Link
                  to="/marketplace"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg hover:bg-gray-800 text-gray-300"
                >
                  Marketplace
                </Link>
                
                {user ? (
                  <>
                    <Link
                      to={getDashboardLink()}
                      onClick={() => setMobileMenuOpen(false)}
                      className="px-3 py-2 rounded-lg hover:bg-gray-800 text-gray-300"
                    >
                      {getDashboardButtonText()}
                    </Link>
                    <Link
                      to="/marketplace"
                      onClick={() => setMobileMenuOpen(false)}
                      className="px-3 py-2 rounded-lg bg-orange-500 text-white text-center"
                    >
                      Start Trading
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to="/signin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="px-3 py-2 rounded-lg hover:bg-gray-800 text-gray-300"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/signup"
                      onClick={() => setMobileMenuOpen(false)}
                      className="px-3 py-2 rounded-lg bg-orange-500 text-white text-center"
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Simplified Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      {/* Hero Section */}
      <div className="relative">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 text-center">
          <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/30 rounded-full px-4 py-2 mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
            </span>
            <span className="text-sm text-orange-300">Live Signals Available Now</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Trade Smarter,{' '}
            <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
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
                  className="inline-block bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-semibold px-8 py-3 rounded-lg transition shadow-lg shadow-orange-500/25"
                >
                  Start Trading Now →
                </Link>
                <Link
                  to="/signin"
                  className="inline-block border border-gray-700 hover:border-orange-500 text-gray-300 hover:text-white font-semibold px-8 py-3 rounded-lg transition"
                >
                  Sign In
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/marketplace"
                  className="inline-block bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-semibold px-8 py-3 rounded-lg transition shadow-lg shadow-orange-500/25"
                >
                  Go to Marketplace →
                </Link>
                <Link
                  to={getDashboardLink()}
                  className="inline-block border border-gray-700 hover:border-orange-500 text-gray-300 hover:text-white font-semibold px-8 py-3 rounded-lg transition"
                >
                  {getDashboardButtonText()}
                </Link>
              </>
            )}
          </div>
          
          {/* Stats Row */}
          <div id="stats-section" className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 pt-8 border-t border-gray-800">
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-500">
                {animatedNumbers.signals}+
              </div>
              <div className="text-gray-400 text-sm mt-1">Active Signals</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-500">
                {animatedNumbers.winRate}%
              </div>
              <div className="text-gray-400 text-sm mt-1">Avg Win Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-500">
                {animatedNumbers.providers}+
              </div>
              <div className="text-gray-400 text-sm mt-1">Expert Providers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-500">
                ${(animatedNumbers.price / 100).toFixed(2)}
              </div>
              <div className="text-gray-400 text-sm mt-1">Starting Price</div>
            </div>
          </div>
        </div>
      </div>

      {/* Rest of your content remains the same */}
      {/* Market Data Table Section */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={fadeInUp}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20"
      >
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
                  ? 'bg-orange-600 text-white shadow-lg shadow-orange-500/25'
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
                          <div 
                            className="bg-green-500 rounded-full h-2 transition-all duration-700"
                            style={{ width: signal.winRate }}
                          />
                        </div>
                        <span className="text-green-400 text-sm">{signal.winRate}</span>
                      </div>
                     </td>
                    <td className="px-6 py-4">
                      <span className="text-orange-400 font-semibold">{signal.signalPrice}</span>
                     </td>
                    <td className="px-6 py-4">
                      <Link
                        to={user ? "/marketplace" : "/signup"}
                        className="text-sm bg-orange-600/20 hover:bg-orange-600 text-orange-400 hover:text-white px-4 py-1 rounded transition inline-block"
                      >
                        Buy
                      </Link>
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
      </motion.div>

      {/* Features Section */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={staggerContainer}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20"
      >
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Why Traders Choose Signal Hub
          </h2>
          <p className="text-gray-400 text-lg">
            Everything you need to succeed, without breaking the bank
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: '💰', title: 'Pay Per Signal', desc: 'Only pay for what you use. Signals starting as low as $2.99. No subscriptions, no hidden fees.' },
            { icon: '⭐', title: 'Verified Experts', desc: 'Every provider is vetted and ranked by real performance. No fake gurus, just proven traders.' },
            { icon: '📊', title: '3 Markets, 1 Platform', desc: 'Forex, Crypto & Stocks. All in one place. All verified by real traders with trackable results.' },
          ].map((feature, idx) => (
            <motion.div
              key={idx}
              variants={fadeInUp}
              className="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-xl p-6 hover:border-orange-500/50 transition-all duration-300"
            >
              <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">{feature.icon}</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

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
            {[
              { step: '1', title: 'Create Account', desc: 'Sign up for free in under 30 seconds', icon: '📝' },
              { step: '2', title: 'Add Funds', desc: 'Deposit as little as $10 to your wallet', icon: '💰' },
              { step: '3', title: 'Browse Signals', desc: 'Find signals from top-rated providers', icon: '🔍' },
              { step: '4', title: 'Buy & Trade', desc: 'Purchase signal and execute the trade', icon: '📈' },
            ].map((step, idx) => (
              <div key={idx} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-600 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg shadow-orange-500/25">
                  {step.step}
                </div>
                <div className="text-3xl mb-2">{step.icon}</div>
                <h3 className="text-white font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-400 text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Providers Leaderboard */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={staggerContainer}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20"
      >
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
            <motion.div
              key={idx}
              variants={fadeInUp}
              className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 hover:border-orange-500/50 transition-all duration-300"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-2xl">
                      {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : '📊'}
                    </span>
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
              
              <Link
                to={user ? "/marketplace" : "/signup"}
                className="block w-full bg-gray-800 hover:bg-gray-700 text-white py-2 rounded-lg transition text-sm text-center"
              >
                View Signals →
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Testimonials */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={staggerContainer}
        className="bg-gradient-to-r from-orange-600/10 to-red-600/10 py-20"
      >
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
              <motion.div
                key={idx}
                variants={fadeInUp}
                className="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-xl p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold">
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
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Partners/Clients */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <p className="text-center text-gray-500 text-sm mb-8">TRUSTED BY TRADERS WORLDWIDE</p>
        <div className="flex flex-wrap justify-center items-center gap-12 opacity-50">
          {['TRADINGVIEW', 'MT4', 'BINANCE', 'COINBASE', 'METATRADER'].map((brand, idx) => (
            <span key={idx} className="text-gray-400 text-xl font-bold cursor-pointer hover:opacity-100 transition-all">
              {brand}
            </span>
          ))}
        </div>
      </div>

      {/* Final CTA */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="bg-gradient-to-r from-orange-600/20 to-red-600/20 border border-orange-500/30 rounded-2xl p-12 backdrop-blur">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to start trading smarter?
          </h2>
          <p className="text-gray-300 text-lg mb-8">
            Join thousands of traders who are already profiting with Signal Hub
          </p>
          {!user ? (
            <Link
              to="/signup"
              className="inline-block bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-semibold px-8 py-3 rounded-lg transition shadow-lg shadow-orange-500/25"
            >
              Create Free Account →
            </Link>
          ) : (
            <Link
              to="/marketplace"
              className="inline-block bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-semibold px-8 py-3 rounded-lg transition shadow-lg shadow-orange-500/25"
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
          <p>© 2026 Signal Hub. All rights reserved. Not financial advice.</p>
          <p className="mt-2">Make trading accessible to everyone</p>
        </div>
      </footer>
    </div>
  );
}