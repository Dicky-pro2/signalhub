// src/components/filters/AdvancedSearch.jsx
import { useState } from 'react';
import Icon from '../Icon';
import { Icons } from '../Icons';

export default function AdvancedSearch({ onSearch, darkMode }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('all');

  const handleSearch = () => {
    onSearch({ term: searchTerm, type: searchType });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    onSearch({ term: '', type: searchType });
  };

  const searchTypes = [
    { value: 'all', label: 'All', icon: Icons.Search },
    { value: 'pair', label: 'Pair', icon: Icons.Chart },
    { value: 'provider', label: 'Provider', icon: Icons.User },
    { value: 'market', label: 'Market', icon: Icons.Store },
  ];

  return (
    <div className="space-y-3">
      <label className={`block text-sm font-medium flex items-center gap-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
        <Icon icon={Icons.Search} size={16} />
        Search Signals
      </label>
      
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Icon 
            icon={Icons.Search} 
            size={16} 
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" 
          />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Search by pair, provider, or market..."
            className={`w-full pl-10 pr-10 py-2 rounded-lg border focus:outline-none focus:border-orange-500 ${
              darkMode 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-800'
            }`}
          />
          {searchTerm && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <Icon icon={Icons.Close} size={14} />
            </button>
          )}
        </div>
        
        <button
          onClick={handleSearch}
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition"
        >
          Search
        </button>
      </div>
      
      {/* Search type quick filters */}
      <div className="flex gap-2">
        {searchTypes.map((type) => (
          <button
            key={type.value}
            onClick={() => {
              setSearchType(type.value);
              if (searchTerm) handleSearch();
            }}
            className={`flex items-center gap-1 px-3 py-1 text-xs rounded-full transition ${
              searchType === type.value
                ? 'bg-orange-500 text-white'
                : darkMode
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Icon icon={type.icon} size={10} />
            {type.label}
          </button>
        ))}
      </div>
    </div>
  );
}