// src/components/filters/PriceRangeFilter.jsx
import { useState, useEffect } from 'react';
import Icon from '../Icon';
import { Icons } from '../Icons';

export default function PriceRangeFilter({ minPrice = 0, maxPrice = 50, onPriceChange, darkMode }) {
  const [localMin, setLocalMin] = useState(minPrice);
  const [localMax, setLocalMax] = useState(maxPrice);

  useEffect(() => {
    setLocalMin(minPrice);
    setLocalMax(maxPrice);
  }, [minPrice, maxPrice]);

  const handleMinChange = (e) => {
    const value = parseInt(e.target.value);
    setLocalMin(value);
    if (value <= localMax) {
      onPriceChange({ min: value, max: localMax });
    }
  };

  const handleMaxChange = (e) => {
    const value = parseInt(e.target.value);
    setLocalMax(value);
    if (value >= localMin) {
      onPriceChange({ min: localMin, max: value });
    }
  };

  return (
    <div className="space-y-3">
      <label className={`block text-sm font-medium flex items-center gap-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
        <Icon icon={Icons.Dollar} size={16} />
        Price Range: ${localMin} - ${localMax}
      </label>
      
      <div className="flex gap-4 items-center">
        {/* Min Price Slider */}
        <div className="flex-1">
          <input
            type="range"
            min="0"
            max="50"
            step="1"
            value={localMin}
            onChange={handleMinChange}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
          />
          <div className="flex justify-between mt-1">
            <span className="text-xs text-gray-500">$0</span>
            <span className="text-xs text-gray-500">$50</span>
          </div>
        </div>
        
        {/* Max Price Slider */}
        <div className="flex-1">
          <input
            type="range"
            min="0"
            max="50"
            step="1"
            value={localMax}
            onChange={handleMaxChange}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
          />
          <div className="flex justify-between mt-1">
            <span className="text-xs text-gray-500">$0</span>
            <span className="text-xs text-gray-500">$50</span>
          </div>
        </div>
      </div>
      
      <div className="flex gap-2 mt-2">
        <div className="flex-1">
          <span className="text-xs text-gray-500">Min: ${localMin}</span>
        </div>
        <div className="flex-1 text-right">
          <span className="text-xs text-gray-500">Max: ${localMax}</span>
        </div>
      </div>
    </div>
  );
}