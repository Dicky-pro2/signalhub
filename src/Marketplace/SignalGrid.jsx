import { useTheme } from '../../context/ThemeContext';
import SignalCard from './SignalCard';

export default function SignalGrid({ signals, onBuy, purchasedSignals }) {
  const { darkMode } = useTheme();

  if (!signals || signals.length === 0) {
    return (
      <div className={`text-center py-12 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white shadow-lg'}`}>
        <div className="text-6xl mb-4">🔍</div>
        <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          No signals found matching your criteria.
        </p>
        <p className={`text-sm mt-2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
          Try adjusting your filters or check back later for new signals.
        </p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {signals.map(signal => (
        <SignalCard
          key={signal.id}
          signal={signal}
          onBuy={onBuy}
          purchased={purchasedSignals?.includes(signal.id)}
          fullAnalysis={signal.purchasedAnalysis}
        />
      ))}
    </div>
  );
}