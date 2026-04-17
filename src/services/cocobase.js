// This is a mock service - replace with your actual Cocobase endpoints
const API_URL = import.meta.env.VITE_API_URL || 'https://your-cocobase-instance.com/api';

// Mock signals data
const mockSignals = [
  { id: 1, pair: 'BTC/USD', market: 'crypto', price: 4.99, provider_name: 'CryptoKing', provider_rating: 4.9, entry: '68,420', tp: '70,000', sl: '67,000', analysis_full: 'Bitcoin is showing strong bullish momentum after breaking key resistance at $68k. The next target is $70k with support at $67k. RSI indicates room for upside. Recommended stop loss at $66,500 for safety.' },
  { id: 2, pair: 'ETH/USD', market: 'crypto', price: 3.99, provider_name: 'EtherWhale', provider_rating: 4.8, entry: '3,845', tp: '4,000', sl: '3,750', analysis_full: 'Ethereum is consolidating above $3,800. The 50 EMA is providing strong support. Target $4,000 with a tight stop at $3,750. Volume is increasing suggesting accumulation.' },
  { id: 3, pair: 'EUR/USD', market: 'forex', price: 2.99, provider_name: 'ForexMaster', provider_rating: 4.8, entry: '1.0892', tp: '1.0950', sl: '1.0850', analysis_full: 'EUR/USD is in an uptrend on the 4H chart. Price broke above the descending trendline. Target 1.0950 with stop at 1.0850. Watch for US economic data.' },
  { id: 4, pair: 'GBP/JPY', market: 'forex', price: 3.49, provider_name: 'LondonTrader', provider_rating: 4.9, entry: '191.45', tp: '193.00', sl: '190.00', analysis_full: 'GBP/JPY showing strong bullish divergence on RSI. Break above 192 confirms further upside. Target 193 with stop at 190.' },
  { id: 5, pair: 'NVDA', market: 'stocks', price: 4.99, provider_name: 'AIInvestor', provider_rating: 4.95, entry: '892.64', tp: '920', sl: '870', analysis_full: 'NVDA continues to lead the AI sector. Strong institutional buying. Break above $900 targets $920. Support at $870.' },
  { id: 6, pair: 'TSLA', market: 'stocks', price: 3.99, provider_name: 'MuskWatcher', provider_rating: 4.2, entry: '175.48', tp: '185', sl: '170', analysis_full: 'TSLA forming a cup and handle pattern. Breakout above $180 confirms. Target $185 with stop at $170.' },
  { id: 7, pair: 'SOL/USD', market: 'crypto', price: 3.49, provider_name: 'SolanaBull', provider_rating: 4.85, entry: '162.18', tp: '175', sl: '155', analysis_full: 'Solana showing relative strength. Breaking above $165 confirms bullish momentum. Target $175 with stop at $155.' },
  { id: 8, pair: 'AAPL', market: 'stocks', price: 3.49, provider_name: 'TechTrader', provider_rating: 4.7, entry: '187.32', tp: '195', sl: '183', analysis_full: 'Apple holding above key moving averages. Services revenue growth supporting price. Target $195 with stop at $183.' },
  { id: 9, pair: 'AUD/USD', market: 'forex', price: 2.49, provider_name: 'AussieShark', provider_rating: 4.6, entry: '0.6584', tp: '0.6650', sl: '0.6540', analysis_full: 'AUD/USD benefiting from commodity prices. Break above 0.6600 targets 0.6650. Support at 0.6540.' },
];

export const authAPI = {
  signUp: async (email, password, fullName) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: {
            user: { id: '1', email, full_name: fullName, role: 'customer' },
            token: 'mock-token-123'
          }
        });
      }, 500);
    });
  },
  
  signIn: async (email, password) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let role = 'customer';
        if (email === 'admin@signalhub.com') role = 'admin';
        if (email === 'provider@signalhub.com') role = 'provider';
        
        resolve({
          data: {
            user: { id: '1', email, full_name: email.split('@')[0], role: role },
            token: 'mock-token-123'
          }
        });
      }, 500);
    });
  },
  
  getCurrentUser: async () => {
    return new Promise((resolve) => {
      resolve({
        data: {
          user: JSON.parse(localStorage.getItem('user') || '{}')
        }
      });
    });
  },
};

export const signalsAPI = {
  getAll: async (filters = {}) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: { signals: mockSignals }
        });
      }, 300);
    });
  },
  
  getById: async (id) => {
    const signal = mockSignals.find(s => s.id === parseInt(id));
    return new Promise((resolve) => {
      resolve({ data: { signal } });
    });
  },
  
  buySignal: async (signalId, userId) => {
    const signal = mockSignals.find(s => s.id === signalId);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: { analysis_full: signal.analysis_full }
        });
      }, 500);
    });
  },
};

export const providersAPI = {
  getTopRated: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: {
            providers: [
              { id: 1, full_name: 'CryptoKing', rating: 4.9, win_rate: 84 },
              { id: 2, full_name: 'AIInvestor', rating: 4.95, win_rate: 91 },
              { id: 3, full_name: 'LondonTrader', rating: 4.8, win_rate: 82 },
              { id: 4, full_name: 'SolanaBull', rating: 4.85, win_rate: 88 },
              { id: 5, full_name: 'ForexMaster', rating: 4.8, win_rate: 78 },
            ]
          }
        });
      }, 300);
    });
  },
};

export default { authAPI, signalsAPI, providersAPI };