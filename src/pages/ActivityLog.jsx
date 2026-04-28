// src/pages/ActivityLog.jsx
import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import Icon from '../components/Icon';
import { Icons } from '../components/Icons';

export default function ActivityLog() {
  const { darkMode } = useTheme();
  const [filter, setFilter] = useState('all');

  const activities = [
    { id: 1, type: 'login', action: 'Logged in', ip: '192.168.1.1', device: 'Chrome on Windows', date: '2024-01-15 09:30:00', status: 'success' },
    { id: 2, type: 'purchase', action: 'Purchased BTC/USD signal', amount: '$4.99', date: '2024-01-15 10:15:00', status: 'success' },
    { id: 3, type: 'withdrawal', action: 'Requested withdrawal', amount: '$150.00', date: '2024-01-14 14:20:00', status: 'pending' },
    { id: 4, type: 'login', action: 'Failed login attempt', ip: '192.168.1.1', device: 'Unknown', date: '2024-01-14 08:45:00', status: 'failed' },
    { id: 5, type: 'settings', action: 'Changed password', date: '2024-01-13 16:00:00', status: 'success' },
    { id: 6, type: 'profile', action: 'Updated profile information', date: '2024-01-12 11:30:00', status: 'success' },
  ];

  const filteredActivities = filter === 'all' 
    ? activities 
    : activities.filter(a => a.type === filter);

  const getTypeIcon = (type) => {
    switch(type) {
      case 'login': return Icons.User;
      case 'purchase': return Icons.ShoppingCart;
      case 'withdrawal': return Icons.Withdraw;
      case 'settings': return Icons.Settings;
      default: return Icons.Info;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'success': return 'text-green-500';
      case 'failed': return 'text-red-500';
      case 'pending': return 'text-yellow-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Activity Log
        </h1>
        <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          View all your account activity
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 dark:border-gray-700 pb-2">
        {['all', 'login', 'purchase', 'withdrawal', 'settings'].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 text-sm capitalize rounded-lg transition ${
              filter === tab
                ? 'bg-orange-500 text-white'
                : darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Activity List */}
      <div className="space-y-3">
        {filteredActivities.map((activity) => (
          <div key={activity.id} className={`p-4 rounded-lg border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <Icon icon={getTypeIcon(activity.type)} size={16} className="text-orange-500" />
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap justify-between items-start gap-2">
                  <div>
                    <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {activity.action}
                    </p>
                    {activity.amount && (
                      <p className="text-sm text-orange-500">{activity.amount}</p>
                    )}
                    {activity.ip && (
                      <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                        IP: {activity.ip} • {activity.device}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                      {activity.date}
                    </p>
                    <p className={`text-xs font-medium ${getStatusColor(activity.status)}`}>
                      {activity.status}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}