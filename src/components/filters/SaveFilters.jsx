// src/components/filters/SaveFilters.jsx
import { useState, useEffect } from 'react';
import Icon from '../Icon';
import { Icons } from '../Icons';

export default function SaveFilters({ currentFilters, onLoadFilter, darkMode }) {
  const [savedFilters, setSavedFilters] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [filterName, setFilterName] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  // Load saved filters from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('signalHubFilters');
    if (saved) {
      setSavedFilters(JSON.parse(saved));
    }
  }, []);

  const saveCurrentFilter = () => {
    if (!filterName.trim()) return;

    const newFilter = {
      id: Date.now(),
      name: filterName,
      createdAt: new Date().toISOString(),
      filters: { ...currentFilters }
    };

    const updated = [...savedFilters, newFilter];
    setSavedFilters(updated);
    localStorage.setItem('signalHubFilters', JSON.stringify(updated));
    setFilterName('');
    setShowModal(false);
  };

  const loadFilter = (filter) => {
    onLoadFilter(filter.filters);
    setShowDropdown(false);
  };

  const deleteFilter = (id) => {
    const updated = savedFilters.filter(f => f.id !== id);
    setSavedFilters(updated);
    localStorage.setItem('signalHubFilters', JSON.stringify(updated));
  };

  const getFilterSummary = (filters) => {
    const parts = [];
    if (filters.selectedMarket && filters.selectedMarket !== 'all') parts.push(filters.selectedMarket);
    if (filters.minWinRate > 0) parts.push(`${filters.minWinRate}%+`);
    if (filters.priceRange?.min > 0 || filters.priceRange?.max < 50) {
      parts.push(`$${filters.priceRange.min}-$${filters.priceRange.max}`);
    }
    return parts.join(', ') || 'All signals';
  };

  return (
    <>
      {/* Save Filter Button */}
      <div className="relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition ${
            darkMode 
              ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
          }`}
        >
          <Icon icon={Icons.Bookmark} size={14} />
          Saved Filters ({savedFilters.length})
          <Icon icon={Icons.ChevronDown} size={12} />
        </button>

        {/* Dropdown Menu */}
        {showDropdown && (
          <div className={`absolute right-0 mt-2 w-72 rounded-lg shadow-lg z-10 ${darkMode ? 'bg-gray-800' : 'bg-white'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="p-3 border-b border-gray-700">
              <button
                onClick={() => {
                  setShowDropdown(false);
                  setShowModal(true);
                }}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg text-sm flex items-center justify-center gap-2"
              >
                <Icon icon={Icons.Add} size={14} />
                Save Current Filters
              </button>
            </div>
            
            <div className="max-h-64 overflow-y-auto">
              {savedFilters.length === 0 ? (
                <div className="p-4 text-center text-gray-500 text-sm">
                  No saved filters yet
                </div>
              ) : (
                savedFilters.map((filter) => (
                  <div
                    key={filter.id}
                    className={`flex justify-between items-center p-3 border-b ${darkMode ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-100 hover:bg-gray-50'}`}
                  >
                    <button
                      onClick={() => loadFilter(filter)}
                      className="flex-1 text-left"
                    >
                      <div className="text-sm font-medium">{filter.name}</div>
                      <div className="text-xs text-gray-500 mt-1">{getFilterSummary(filter.filters)}</div>
                    </button>
                    <button
                      onClick={() => deleteFilter(filter.id)}
                      className="text-red-500 hover:text-red-400 p-1"
                    >
                      <Icon icon={Icons.Delete} size={14} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Save Filter Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className={`max-w-md w-full rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} p-6`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className={`text-xl font-bold flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                <Icon icon={Icons.Bookmark} size={20} />
                Save Current Filters
              </h2>
              <button onClick={() => setShowModal(false)} className="text-gray-500">
                <Icon icon={Icons.Close} size={20} />
              </button>
            </div>
            
            <input
              type="text"
              value={filterName}
              onChange={(e) => setFilterName(e.target.value)}
              placeholder="e.g., 'Top Crypto Under $5'"
              className={`w-full px-4 py-2 rounded-lg border mb-4 focus:outline-none focus:border-orange-500 ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-800'
              }`}
              autoFocus
            />
            
            <div className="flex gap-3">
              <button
                onClick={saveCurrentFilter}
                disabled={!filterName.trim()}
                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg disabled:opacity-50"
              >
                Save
              </button>
              <button
                onClick={() => setShowModal(false)}
                className={`flex-1 py-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}