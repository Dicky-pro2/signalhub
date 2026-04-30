// src/pages/LandingPage.jsx
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import Icon from '../components/Icon';
import { Icons } from '../components/Icons';

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
  
  // Mock live feed data
  const [liveFeed, setLiveFeed] = useState([
    { id: 1, user: 'Trader_Jason', action: 'bought', signal: 'BTC/USD', amount: 4.99, time: 'Just now' },
    { id: 2, user: 'CryptoGirl', action: 'bought', signal: 'ETH/USD', amount: 3.99, time: '12 seconds ago' },
    { id: 3, user: 'ForexKing', action: 'published', signal: 'EUR/USD', price: 2.99, time: '45 seconds ago' },
    { id: 4, user: 'StockMaster', action: 'bought', signal: 'NVDA', amount: 4.99, time: '1 min ago' },
  ]);

  // Simulate live feed updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveFeed(prev => {
        const newActivity = {
          id: Date.now(),
          user: ['TraderMike', 'CryptoWizard', 'ForexPro', 'StockHunter'][Math.floor(Math.random() * 4)],
          action: Math.random() > 0.5 ? 'bought' : 'published',
          signal: ['BTC/USD', 'ETH/USD', 'EUR/USD', 'AAPL', 'SOL/USD'][Math.floor(Math.random() * 5)],
          amount: (Math.random() * 5 + 1).toFixed(2),
          price: (Math.random() * 5 + 1).toFixed(2),
          time: 'Just now'
        };
        return [newActivity, ...prev.slice(0, 9)];
      });
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  // Animate numbers when stats section is visible
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
      if (progress < 1) requestAnimationFrame(animateNumbers);
    };
    requestAnimationFrame(animateNumbers);
  }, [isVisible]);

  const getDashboardLink = () => {
    if (!user) return '/signin';
    if (user.role === 'admin') return '/admin';
    if (user.role === 'provider') return '/provider';
    return '/dashboard';
  };

  const getDashboardButtonText = () => {
    if (!user) return 'Sign In';
    if (user.role === 'admin') return 'Admin Panel';
    if (user.role === 'provider') return 'Provider Dashboard';
    return 'Dashboard';
  };

  // Mock data for tables
  const topSignals = useMemo(() => ({
    forex: [
      { pair: 'EUR/USD', price: '1.0892', change: '+0.42%', provider: 'ForexMaster', winRate: '78%', signalPrice: '$2.99', buyers: 23 },
      { pair: 'GBP/JPY', price: '191.45', change: '+1.23%', provider: 'LondonTrader', winRate: '82%', signalPrice: '$3.49', buyers: 18 },
      { pair: 'AUD/USD', price: '0.6584', change: '-0.18%', provider: 'AussieShark', winRate: '71%', signalPrice: '$2.49', buyers: 31 },
      { pair: 'USD/CAD', price: '1.3742', change: '+0.31%', provider: 'OilTrader', winRate: '76%', signalPrice: '$2.99', buyers: 27 },
      { pair: 'NZD/USD', price: '0.5942', change: '+0.15%', provider: 'KiwiPro', winRate: '74%', signalPrice: '$2.79', buyers: 15 },
    ],
    crypto: [
      { pair: 'BTC/USD', price: '$68,420', change: '+2.7%', provider: 'CryptoKing', winRate: '84%', signalPrice: '$4.99', buyers: 67 },
      { pair: 'ETH/USD', price: '$3,845', change: '+5.57%', provider: 'EtherWhale', winRate: '79%', signalPrice: '$3.99', buyers: 54 },
      { pair: 'SOL/USD', price: '$162.18', change: '+14.44%', provider: 'SolanaBull', winRate: '88%', signalPrice: '$3.49', buyers: 42 },
      { pair: 'DOGE/USD', price: '$0.158', change: '-1.32%', provider: 'MemeMaster', winRate: '65%', signalPrice: '$1.99', buyers: 89 },
      { pair: 'BNB/USD', price: '$582.50', change: '+3.21%', provider: 'BinancePro', winRate: '81%', signalPrice: '$3.99', buyers: 34 },
    ],
    stocks: [
      { pair: 'AAPL', price: '$187.32', change: '+1.25%', provider: 'TechTrader', winRate: '76%', signalPrice: '$3.49', buyers: 45 },
      { pair: 'NVDA', price: '$892.64', change: '+3.42%', provider: 'AIInvestor', winRate: '91%', signalPrice: '$4.99', buyers: 78 },
      { pair: 'TSLA', price: '$175.48', change: '-0.85%', provider: 'MuskWatcher', winRate: '69%', signalPrice: '$3.99', buyers: 23 },
      { pair: 'MSFT', price: '$420.15', change: '+0.92%', provider: 'CloudExpert', winRate: '82%', signalPrice: '$3.49', buyers: 56 },
      { pair: 'AMZN', price: '$178.22', change: '+1.08%', provider: 'EcomPro', winRate: '77%', signalPrice: '$3.29', buyers: 41 },
    ],
  }), []);

  const topProviders = useMemo(() => [
    { name: 'CryptoKing', market: 'Crypto', winRate: '84%', rating: 4.9, totalSignals: 342, earnings: '$12,847', verified: true },
    { name: 'AIInvestor', market: 'Stocks', winRate: '91%', rating: 4.95, totalSignals: 156, earnings: '$8,234', verified: true },
    { name: 'LondonTrader', market: 'Forex', winRate: '82%', rating: 4.8, totalSignals: 423, earnings: '$15,632', verified: true },
    { name: 'SolanaBull', market: 'Crypto', winRate: '88%', rating: 4.85, totalSignals: 98, earnings: '$4,567', verified: false },
    { name: 'ForexMaster', market: 'Forex', winRate: '78%', rating: 4.7, totalSignals: 567, earnings: '$18,923', verified: true },
  ], []);

  const testimonials = useMemo(() => [
    { name: 'Marcus T.', role: 'Part-time Trader', text: 'Went from losing money to consistent profits. Best $3 I spend every day.', rating: 5, avatar: 'MT' },
    { name: 'Sarah K.', role: 'Full-time Mom', text: 'I don\'t have time to analyze charts. Signal Hub does it for me. Life changer!', rating: 5, avatar: 'SK' },
    { name: 'David L.', role: 'Student', text: 'Cheaper than any mentorship and actually works. My portfolio is up 34% this month.', rating: 5, avatar: 'DL' },
  ], []);

  const fadeInUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } } };
  const staggerContainer = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } } };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black">
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-gray-900/95 backdrop-blur border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="text-2xl font-bold flex items-center gap-2">
              <img src="/signalhub-logo.png" alt="Signal Hub Logo" className="w-12 h-12 rounded-md" />
              <span className="text-white">Signal</span>
              <span className="text-orange-500">Hub</span>
            </Link>

            <div className="hidden md:flex items-center gap-3">
              <Link to="/marketplace" className="flex items-center gap-1 text-gray-300 hover:text-white transition">
                <Icon icon={Icons.Search} size={16} />
                Browse Signals
              </Link>
              <Link to="/provider-signup" className="flex items-center gap-1 text-gray-300 hover:text-white transition">
                <Icon icon={Icons.Verified} size={16} />
                Start Selling Signals
              </Link>
              <Link to="/get-verified" className="flex items-center gap-1 text-gray-300 hover:text-white transition">
                <Icon icon={Icons.ShieldAlt} size={16} />
                Get Verified
              </Link>
              
              {user ? (
                <>
                  <Link to={getDashboardLink()} className="flex items-center gap-1 text-gray-300 hover:text-white transition">
                    <Icon icon={Icons.Dashboard} size={16} />
                    {getDashboardButtonText()}
                  </Link>
                  <Link to="/marketplace" className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition flex items-center gap-1">
                    <Icon icon={Icons.TrendingUp} size={16} color="white" />
                    Start Trading
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/signin" className="flex items-center gap-1 text-gray-300 hover:text-white transition">
                    <Icon icon={Icons.User} size={16} />
                    Sign In
                  </Link>
                  <Link to="/signup" className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition flex items-center gap-1">
                    <Icon icon={Icons.UserPlus} size={16} color="white" />
                    Sign Up
                  </Link>
                </>
              )}
            </div>

            <div className="md:hidden">
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 rounded-lg hover:bg-gray-800 transition">
                <Icon icon={Icons.Menu} size={20} color="white" />
              </button>
            </div>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-800">
              <div className="flex flex-col space-y-3">
                <Link to="/marketplace" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-800 text-gray-300">
                  <Icon icon={Icons.Search} size={16} /> Browse Signals
                </Link>
                <Link to="/provider-signup" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-800 text-gray-300">
                  <Icon icon={Icons.Verified} size={16} /> Start Selling Signals
                </Link>
                <Link to="/get-verified" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-800 text-gray-300">
                  <Icon icon={Icons.ShieldAlt} size={16} /> Get Verified
                </Link>
                {user ? (
                  <>
                    <Link to={getDashboardLink()} onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-800 text-gray-300">
                      <Icon icon={Icons.Dashboard} size={16} /> {getDashboardButtonText()}
                    </Link>
                    <Link to="/marketplace" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-orange-500 text-white text-center">
                      <Icon icon={Icons.TrendingUp} size={16} color="white" /> Start Trading
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/signin" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-800 text-gray-300">
                      <Icon icon={Icons.User} size={16} /> Sign In
                    </Link>
                    <Link to="/signup" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-orange-500 text-white text-center">
                      <Icon icon={Icons.UserPlus} size={16} color="white" /> Sign Up
                    </Link>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section with Strong Messaging */}
      <div className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 text-center">
          <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/30 rounded-full px-4 py-2 mb-8">
            <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" /><span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" /></span>
            <span className="text-sm text-orange-300">🔥 Live Signals Available Now</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Buy verified forex & crypto signals{' '}
            <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
              from top traders
            </span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join 10,000+ traders who get profitable signals daily. No expensive mentorships. Pay per signal, keep 80% of profits.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {!user ? (
              <>
                <Link to="/signup" className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-semibold px-8 py-3 rounded-lg transition shadow-lg shadow-orange-500/25">
                  <Icon icon={Icons.UserPlus} size={18} color="white" /> Start Trading Now
                </Link>
                <Link to="/signin" className="inline-flex items-center gap-2 border border-gray-700 hover:border-orange-500 text-gray-300 hover:text-white font-semibold px-8 py-3 rounded-lg transition">
                  <Icon icon={Icons.User} size={18} /> Sign In
                </Link>
              </>
            ) : (
              <>
                <Link to="/marketplace" className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-semibold px-8 py-3 rounded-lg transition shadow-lg shadow-orange-500/25">
                  <Icon icon={Icons.TrendingUp} size={18} color="white" /> Browse Signals
                </Link>
                <Link to="/provider-signup" className="inline-flex items-center gap-2 border border-gray-700 hover:border-orange-500 text-gray-300 hover:text-white font-semibold px-8 py-3 rounded-lg transition">
                  <Icon icon={Icons.Verified} size={18} /> Start Selling Signals
                </Link>
              </>
            )}
          </div>

          {/* Stats Row */}
          <div id="stats-section" className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 pt-8 border-t border-gray-800">
            <div className="text-center"><div className="text-3xl font-bold text-orange-500">{animatedNumbers.signals}+</div><div className="text-gray-400 text-sm mt-1">Active Signals</div></div>
            <div className="text-center"><div className="text-3xl font-bold text-orange-500">{animatedNumbers.winRate}%</div><div className="text-gray-400 text-sm mt-1">Avg Win Rate</div></div>
            <div className="text-center"><div className="text-3xl font-bold text-orange-500">{animatedNumbers.providers}+</div><div className="text-gray-400 text-sm mt-1">Expert Providers</div></div>
            <div className="text-center"><div className="text-3xl font-bold text-orange-500">${(animatedNumbers.price / 100).toFixed(2)}</div><div className="text-gray-400 text-sm mt-1">Starting Price</div></div>
          </div>
        </div>
      </div>

      {/* Live Activity Feed - Makes platform feel alive */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-xl p-3 overflow-hidden">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0"><div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div></div>
            <p className="text-xs text-gray-400 font-mono">📡 LIVE ACTIVITY FEED</p>
          </div>
          <div className="mt-2 flex flex-wrap gap-3 overflow-x-auto pb-1">
            {liveFeed.map((item) => (
              <div key={item.id} className="text-xs bg-gray-900/70 rounded-full px-3 py-1 whitespace-nowrap">
                <span className="text-orange-400">{item.user}</span> {item.action === 'bought' ? 'bought' : 'published'} 
                <span className="text-white font-mono mx-1">{item.signal}</span>
                {item.amount && <span className="text-green-400">${item.amount}</span>}
                {item.price && <span className="text-blue-400">${item.price}</span>}
                <span className="text-gray-500 ml-1">· {item.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Clear User Flow – How it works + Money Flow */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-6 text-center">
          <div className="bg-gray-800/40 rounded-xl p-6 border border-gray-700">
            <Icon icon={Icons.ShoppingCart} size={32} className="mx-auto mb-3 text-orange-500" />
            <h3 className="text-white font-semibold text-lg">1. Buy Signals</h3>
            <p className="text-gray-400 text-sm mt-2">Choose from 500+ signals, pay as low as $2.99. Full analysis revealed instantly.</p>
          </div>
          <div className="bg-gray-800/40 rounded-xl p-6 border border-gray-700">
            <Icon icon={Icons.Verified} size={32} className="mx-auto mb-3 text-orange-500" />
            <h3 className="text-white font-semibold text-lg">2. Sell Signals</h3>
            <p className="text-gray-400 text-sm mt-2">Become a provider, share your analysis, earn 80% of each sale.</p>
          </div>
          <div className="bg-gray-800/40 rounded-xl p-6 border border-gray-700">
            <Icon icon={Icons.Dollar} size={32} className="mx-auto mb-3 text-orange-500" />
            <h3 className="text-white font-semibold text-lg">3. Get Paid</h3>
            <p className="text-gray-400 text-sm mt-2">Withdraw earnings weekly via bank, crypto, or PayPal. No hidden fees.</p>
          </div>
        </div>
      </div>

      {/* Top Performing Signals Table (with activity indicators) */}
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={fadeInUp} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Top Performing Signals Right Now</h2>
          <p className="text-gray-400">Real-time signals from our highest-rated providers</p>
        </div>
        <div className="flex justify-center gap-2 mb-8">
          {['forex', 'crypto', 'stocks'].map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-6 py-2 rounded-lg font-semibold transition capitalize ${activeTab === tab ? 'bg-orange-600 text-white shadow-lg' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>
              {tab === 'forex' ? '💱 Forex' : tab === 'crypto' ? '₿ Crypto' : '📈 Stocks'}
            </button>
          ))}
        </div>
        <div className="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800/50"><tr className="border-b border-gray-800">
                <th className="text-left px-6 py-4 text-gray-400 font-semibold">Pair</th><th className="text-left px-6 py-4 text-gray-400 font-semibold">Price</th><th className="text-left px-6 py-4 text-gray-400 font-semibold">Provider</th>
                <th className="text-left px-6 py-4 text-gray-400 font-semibold">Win Rate</th><th className="text-left px-6 py-4 text-gray-400 font-semibold">Signal Price</th><th className="text-left px-6 py-4 text-gray-400 font-semibold">Activity</th><th></th>
              </tr></thead>
              <tbody>
                {topSignals[activeTab].map((signal, idx) => (
                  <tr key={idx} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition">
                    <td className="px-6 py-4"><span className="text-white font-medium">{signal.pair}</span></td>
                    <td className="px-6 py-4"><span className="text-white">{signal.price}</span><span className={`ml-2 text-sm ${signal.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>{signal.change}</span></td>
                    <td className="px-6 py-4"><span className="text-gray-300">{signal.provider}</span><div className="text-xs text-yellow-500">★ {signal.winRate} win rate</div></td>
                    <td className="px-6 py-4"><div className="flex items-center gap-2"><div className="w-20 bg-gray-700 rounded-full h-2"><div className="bg-green-500 rounded-full h-2" style={{ width: signal.winRate }} /></div><span className="text-green-400 text-sm">{signal.winRate}</span></div></td>
                    <td className="px-6 py-4"><span className="text-orange-400 font-semibold">{signal.signalPrice}</span></td>
                    <td className="px-6 py-4"><span className="text-xs text-gray-400">📊 {signal.buyers} users bought today</span></td>
                    <td className="px-6 py-4"><Link to={user ? "/marketplace" : "/signup"} className="text-sm bg-orange-600/20 hover:bg-orange-600 text-orange-400 hover:text-white px-4 py-1 rounded transition inline-block">Buy</Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="text-center mt-6"><p className="text-gray-500 text-sm">† 500+ more signals available. Prices vary by provider.</p></div>
      </motion.div>

      {/* Trust Elements: Verified Trader Profiles with stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12"><h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Top Verified Traders</h2><p className="text-gray-400">Real performance, real transparency</p></div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topProviders.map((provider, idx) => (
            <div key={idx} className="bg-gray-800/50 border border-gray-700 rounded-xl p-5 hover:border-orange-500/50 transition">
              <div className="flex justify-between items-start"><div><div className="flex items-center gap-2"><span className="text-2xl">{idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : '📊'}</span><h3 className="text-white font-bold text-lg">{provider.name}</h3></div><span className="text-xs px-2 py-1 bg-gray-800 rounded text-gray-400">{provider.market}</span></div><div className="text-right"><div className="flex items-center gap-1"><Icon icon={Icons.Star} size={14} color="#eab308" /> {provider.rating}</div><div className="text-green-400 text-sm">{provider.winRate} win rate</div></div></div>
              <div className="grid grid-cols-2 gap-3 mt-4 pt-3 border-t border-gray-700"><div><p className="text-gray-500 text-xs">Total Signals</p><p className="text-white font-semibold">{provider.totalSignals}</p></div><div><p className="text-gray-500 text-xs">Total Earnings</p><p className="text-green-400 font-semibold">{provider.earnings}</p></div></div>
              {provider.verified && <div className="mt-2 flex items-center gap-1 text-xs text-blue-400"><Icon icon={Icons.Verified} size={12} /> Verified Trader</div>}
              <Link to="/marketplace" className="mt-3 block text-center bg-gray-700 hover:bg-gray-600 text-white py-1.5 rounded-lg text-sm transition">View Signals →</Link>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials */}
      <div className="bg-gradient-to-r from-orange-600/10 to-red-600/10 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div className="text-center mb-12"><h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Trusted by 10,000+ Traders</h2><p className="text-gray-400">Real results from real people</p></div>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div key={i} className="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4"><div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold">{t.avatar}</div><div><p className="text-white font-semibold">{t.name}</p><p className="text-gray-500 text-sm">{t.role}</p></div></div>
              <div className="flex mb-3">{[...Array(t.rating)].map((_, i) => <Icon key={i} icon={Icons.Star} size={16} color="#eab308" />)}</div>
              <p className="text-gray-300 italic">"{t.text}"</p>
            </div>
          ))}
        </div>
        </div>
      </div>

      {/* Monetization / Waitlist CTA */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="bg-gradient-to-r from-orange-600/20 to-red-600/20 border border-orange-500/30 rounded-2xl p-8 backdrop-blur">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">🚀 Want to build a platform like Signal Hub?</h2>
          <p className="text-gray-300 mb-4">I help businesses create custom signal marketplaces, trading communities, and fintech dashboards. Starting at $50–$200.</p>
          <Link to="/contact" className="inline-block bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-lg transition">Get a Quote →</Link>
          <div className="mt-6 pt-4 border-t border-orange-500/30"><p className="text-sm text-gray-400">Join the waitlist for early access to premium features →</p><Link to="/waitlist" className="text-orange-400 hover:underline text-sm">Notify me</Link></div>
        </div>
      </div>

      <footer className="border-t border-gray-800 py-8"><div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm"><p>© 2025 Signal Hub. All rights reserved. Not financial advice.</p><p className="mt-2">Make trading accessible to everyone</p></div></footer>
    </div>
  );
}