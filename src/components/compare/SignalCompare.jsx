// src/components/compare/SignalCompare.jsx
import { useState } from 'react';
import Icon from '../Icon';
import { Icons } from '../Icons';

export default function SignalCompare({ signals, onBuy, darkMode }) {
  const [selectedSignals, setSelectedSignals] = useState([]);
  const [showCompare, setShowCompare] = useState(false);

  const addToCompare = (signal) => {
    if (selectedSignals.find(s => s.id === signal.id)) {
      setSelectedSignals(selectedSignals.filter(s => s.id !== signal.id));
    } else if (selectedSignals.length < 3) {
      setSelectedSignals([...selectedSignals, signal]);
    } else {
      alert('You can compare up to 3 signals at a time');
    }
  };

  const removeFromCompare = (signalId) => {
    setSelectedSignals(selectedSignals.filter(s => s.id !== signalId));
  };

  const clearCompare = () => {
    setSelectedSignals([]);
    setShowCompare(false);
  };

  return (
    <>
      {/* Compare Button (floating) */}
      {selectedSignals.length > 0 && (
        <button
          onClick={() => setShowCompare(true)}
          className="fixed bottom-6 right-6 z-40 bg-orange-500 hover:bg-orange-600 text-white px-4 py-3 rounded-full shadow-lg flex items-center gap-2 animate-bounce"
        >
          <Icon icon={Ions.Compare} size={18} />
          Compare ({selectedSignals.length})
        </button>
      )}

      {/* Compare Modal */}
      {showCompare && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className={`max-w-6xl w-full rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} p-6`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className={`text-xl font-bold flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                <Icon icon={Icons.Compare} size={20} />
                Compare Signals
              </h2>
              <button onClick={clearCompare} className="text-gray-500">
                <Icon icon={Icons.Close} size={20} />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <th className="p-3 text-left">Feature</th>
                    {selectedSignals.map(signal => (
                      <th key={signal.id} className="p-3 text-center min-w-[200px]">
                        <div className="flex justify-between items-center">
                          <span className="font-bold">{signal.pair}</span>
                          <button
                            onClick={() => removeFromCompare(signal.id)}
                            className="text-red-500 hover:text-red-400"
                          >
                            <Icon icon={Icons.Close} size={14} />
                          </button>
                        </div>
                        <span className="text-xs text-gray-500">{signal.provider_name}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                    <td className="p-3 font-medium">Market</td>
                    {selectedSignals.map(signal => (
                      <td key={signal.id} className="p-3 text-center capitalize">{signal.market}</td>
                    ))}
                  </tr>
                  <tr className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                    <td className="p-3 font-medium">Price</td>
                    {selectedSignals.map(signal => (
                      <td key={signal.id} className="p-3 text-center text-orange-500 font-bold">${signal.price}</td>
                    ))}
                  </tr>
                  <tr className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                    <td className="p-3 font-medium">Entry</td>
                    {selectedSignals.map(signal => (
                      <td key={signal.id} className="p-3 text-center font-mono">{signal.entry}</td>
                    ))}
                  </tr>
                  <tr className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                    <td className="p-3 font-medium">Take Profit (TP)</td>
                    {selectedSignals.map(signal => (
                      <td key={signal.id} className="p-3 text-center text-green-500">{signal.tp}</td>
                    ))}
                  </tr>
                  <tr className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                    <td className="p-3 font-medium">Stop Loss (SL)</td>
                    {selectedSignals.map(signal => (
                      <td key={signal.id} className="p-3 text-center text-red-500">{signal.sl}</td>
                    ))}
                  </tr>
                  <tr className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                    <td className="p-3 font-medium">Provider Rating</td>
                    {selectedSignals.map(signal => (
                      <td key={signal.id} className="p-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Icon icon={Icons.Star} size={14} color="#eab308" />
                          {signal.provider_rating}
                        </div>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-medium">Action</td>
                    {selectedSignals.map(signal => (
                      <td key={signal.id} className="p-3 text-center">
                        <button
                          onClick={() => onBuy(signal)}
                          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-1 rounded-lg text-sm"
                        >
                          Buy Now
                        </button>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                onClick={clearCompare}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}