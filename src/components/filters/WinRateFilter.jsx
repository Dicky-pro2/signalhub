// src/components/filters/WinRateFilter.jsx
import { useState, useEffect } from 'react';
import Icon from '../Icon';
import { Icons } from '../Icons';

export default function WinRateFilter({ winRate = 0, onWinRateChange, darkMode }) {
  const [localWinRate, setLocalWinRate] = useState(winRate);

  useEffect(() => {
    setLocalWinRate(winRate);
  }, [winRate]);

  const handleChange = (e) => {
    const value = parseInt(e.target.value);
    setLocalWinRate(value);
    onWinRateChange(value);
  };

  // Preset buttons
  const presets = [
    { label: 'Any', value: 0 },
    { label: '50%+', value: 50 },
    { label: '60%+', value: 60 },
    { label: '70%+', value: 70 },
    { label: '80%+', value: 80 },
    { label: '90%+', value: 90 },
  ];

  return (
    <div className="space-y-3">
      <label className={`block text-sm font-medium flex items-center gap-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
        <Icon icon={Icons.TrendingUp} size={16} />
        Minimum Win Rate: {localWinRate}%
      </label>
      
      <input
        type="range"
        min="0"
        max="100"
        step="5"
        value={localWinRate}
        onChange={handleChange}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
      />
      
      <div className="flex flex-wrap gap-2 mt-2">
        {presets.map((preset) => (
          <button
            key={preset.value}
            onClick={() => {
              setLocalWinRate(preset.value);
              onWinRateChange(preset.value);
            }}
            className={`px-3 py-1 text-xs rounded-full transition ${
              localWinRate === preset.value
                ? 'bg-orange-500 text-white'
                : darkMode
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {preset.label}
          </button>
        ))}
      </div>
    </div>
  );
}