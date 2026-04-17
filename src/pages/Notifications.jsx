import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';

export default function Notifications() {
  const { darkMode } = useTheme();
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'purchase', title: 'New Signal Purchase', message: 'Someone bought your BTC/USD signal', time: '5 minutes ago', read: false },
    { id: 2, type: 'review', title: 'New Review', message: 'Marcus T. left a 5-star review on your ETH/USD signal', time: '2 hours ago', read: false },
    { id: 3, type: 'payout', title: 'Withdrawal Processed', message: 'Your withdrawal of $150.00 has been sent to your bank', time: '1 day ago', read: true },
    { id: 4, type: 'signal', title: 'Signal Update', message: 'Your EUR/USD signal was marked as profitable', time: '2 days ago', read: true },
    { id: 5, type: 'system', title: 'Provider Verification', message: 'Your provider application has been approved!', time: '3 days ago', read: true },
  ]);

  const markAsRead = (id) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const getIcon = (type) => {
    switch(type) {
      case 'purchase': return '💰';
      case 'review': return '⭐';
      case 'payout': return '💸';
      case 'signal': return '📈';
      default: return '🔔';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            Notifications
          </h1>
          <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
            Stay updated with your account activity
          </p>
        </div>
        
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="text-orange-500 hover:text-orange-400 text-sm"
          >
            Mark all as read
          </button>
        )}
      </div>

      {/* Unread Badge */}
      {unreadCount > 0 && (
        <div className={`rounded-xl p-3 ${darkMode ? 'bg-orange-500/20 border border-orange-500/30' : 'bg-orange-50 border border-orange-200'}`}>
          <p className="text-orange-500 text-sm">
            You have {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
          </p>
        </div>
      )}

      {/* Notifications List */}
      {notifications.length === 0 ? (
        <div className={`text-center py-12 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white shadow-lg'}`}>
          <div className="text-6xl mb-4">🔔</div>
          <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
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
              className={`rounded-xl p-4 transition ${
                !notification.read
                  ? darkMode
                    ? 'bg-orange-500/10 border border-orange-500/30'
                    : 'bg-orange-50 border border-orange-200'
                  : darkMode
                  ? 'bg-gray-800'
                  : 'bg-white shadow-sm'
              }`}
            >
              <div className="flex gap-4">
                <div className="text-2xl">{getIcon(notification.type)}</div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        {notification.title}
                      </h3>
                      <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {notification.message}
                      </p>
                      <p className={`text-xs mt-2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                        {notification.time}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {!notification.read && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="text-orange-500 text-xs hover:underline"
                        >
                          Mark read
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotification(notification.id)}
                        className="text-red-500 text-xs hover:underline"
                      >
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