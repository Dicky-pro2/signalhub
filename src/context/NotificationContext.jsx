import { createContext, useContext, useState, useEffect } from 'react';

const NotificationContext = createContext();

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);

  // Load notifications from localStorage or API
  useEffect(() => {
    // In production, fetch from API
    const savedNotifications = localStorage.getItem('notifications');
    if (savedNotifications) {
      const parsed = JSON.parse(savedNotifications);
      setNotifications(parsed);
      setUnreadCount(parsed.filter(n => !n.read).length);
    } else {
      // Mock data
      const mockNotifications = [
        { id: 1, type: 'purchase', title: 'New Signal Purchase', message: 'Someone bought your BTC/USD signal', time: '5 minutes ago', read: false },
        { id: 2, type: 'review', title: 'New Review', message: 'Marcus T. left a 5-star review on your ETH/USD signal', time: '2 hours ago', read: false },
        { id: 3, type: 'payout', title: 'Withdrawal Processed', message: 'Your withdrawal of $150.00 has been sent to your bank', time: '1 day ago', read: true },
        { id: 4, type: 'signal', title: 'Signal Update', message: 'Your EUR/USD signal was marked as profitable', time: '2 days ago', read: true },
        { id: 5, type: 'system', title: 'Provider Verification', message: 'Your provider application has been approved!', time: '3 days ago', read: true },
      ];
      setNotifications(mockNotifications);
      setUnreadCount(mockNotifications.filter(n => !n.read).length);
    }
  }, []);

  const updateUnreadCount = (count) => {
    setUnreadCount(count);
  };

  const markAsRead = (id) => {
    const updated = notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    );
    setNotifications(updated);
    setUnreadCount(updated.filter(n => !n.read).length);
    localStorage.setItem('notifications', JSON.stringify(updated));
  };

  const markAllAsRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    setNotifications(updated);
    setUnreadCount(0);
    localStorage.setItem('notifications', JSON.stringify(updated));
  };

  const deleteNotification = (id) => {
    const updated = notifications.filter(n => n.id !== id);
    setNotifications(updated);
    setUnreadCount(updated.filter(n => !n.read).length);
    localStorage.setItem('notifications', JSON.stringify(updated));
  };

  const addNotification = (notification) => {
    const newNotification = {
      id: Date.now(),
      read: false,
      time: 'Just now',
      ...notification
    };
    const updated = [newNotification, ...notifications];
    setNotifications(updated);
    setUnreadCount(updated.filter(n => !n.read).length);
    localStorage.setItem('notifications', JSON.stringify(updated));
  };

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      markAsRead,
      markAllAsRead,
      deleteNotification,
      addNotification,
      updateUnreadCount
    }}>
      {children}
    </NotificationContext.Provider>
  );
};