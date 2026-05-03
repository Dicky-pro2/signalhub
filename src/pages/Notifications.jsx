import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useNotifications } from '../context/NotificationContext';
import Icon from '../components/Icon';
import { Icons } from '../components/Icons';

export default function Notifications() {
  const { darkMode } = useTheme();
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification 
  } = useNotifications();

  const getIcon = (type) => {
    switch(type) {
      case 'purchase': return Icons.Dollar;
      case 'review': return Icons.Star;
      case 'payout': return Icons.Withdraw;
      case 'signal': return Icons.Chart;
      case 'system': return Icons.Settings;
      default: return Icons.Notifications;
    }
  };

  const getIconColor = (type) => {
    switch(type) {
      case 'purchase': return '#f97316';
      case 'review': return '#eab308';
      case 'payout': return '#22c55e';
      case 'signal': return '#3b82f6';
      case 'system': return '#8b5cf6';
      default: return '#6b7280';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className={`text-2xl font-bold flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            <Icon icon={Icons.Notifications} size={24} />
            Notifications
          </h1>
          <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
            Stay updated with your account activity
          </p>
        </div>
        
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="text-orange-500 hover:text-orange-400 text-sm flex items-center gap-1"
          >
            <Icon icon={Icons.Check} size={14} />
            Mark all as read
          </button>
        )}
      </div>

      {/* Unread Badge */}
      {unreadCount > 0 && (
        <div className={`rounded-xl p-3 flex items-center gap-2 ${darkMode ? 'bg-orange-500/20 border border-orange-500/30' : 'bg-orange-50 border border-orange-200'}`}>
          <Icon icon={Icons.Notifications} size={18} color="#f97316" />
          <p className="text-orange-500 text-sm">
            You have {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
          </p>
        </div>
      )}

      {/* Notifications List */}
      {notifications.length === 0 ? (
        <div className={`text-center py-12 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white shadow-lg'}`}>
          <Icon icon={Icons.Notifications} size={60} color={darkMode ? '#6b7280' : '#9ca3af'} />
          <p className={`text-lg mt-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            No notifications yet
          </p>
          <p className={`text-sm mt-2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            We'll notify you when something important happens
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`rounded-xl p-4 transition-all duration-300 ${
                !notification.is_read
                  ? darkMode
                    ? 'bg-orange-500/10 border border-orange-500/30'
                    : 'bg-orange-50 border border-orange-200'
                  : darkMode
                  ? 'bg-gray-800 hover:bg-gray-700'
                  : 'bg-white shadow-sm hover:shadow-md'
              }`}
            >
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    !notification.is_read
                      ? 'bg-orange-500/20'
                      : darkMode
                      ? 'bg-gray-700'
                      : 'bg-gray-100'
                  }`}>
                    <Icon 
                      icon={getIcon(notification.type)} 
                      size={20} 
                      color={getIconColor(notification.type)}
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start flex-wrap gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                          {notification.title}
                        </h3>
                        {!notification.is_read && (
                          <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
                        )}
                      </div>
                      <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {notification.message}
                      </p>
                      <div className="flex items-center gap-1 mt-2">
                        <Icon icon={Icons.Time} size={12} color={darkMode ? '#6b7280' : '#9ca3af'} />
                        <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                          {new Date(notification.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {!notification.is_read && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="text-orange-500 text-xs hover:underline flex items-center gap-1"
                        >
                          <Icon icon={Icons.Check} size={12} />
                          Mark read
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotification(notification.id)}
                        className="text-red-500 text-xs hover:underline flex items-center gap-1"
                      >
                        <Icon icon={Icons.Delete} size={12} />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}