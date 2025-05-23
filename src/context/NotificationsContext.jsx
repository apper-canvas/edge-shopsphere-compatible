import { createContext, useState, useContext, useEffect } from 'react';

// Create notification context
const NotificationsContext = createContext();

// Sample initial notifications for demo purposes
const initialNotifications = [
  {
    id: 1,
    type: 'promotional',
    title: 'Special Offer',
    message: 'Get 20% off on all accessories today!',
    isRead: false,
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() // 2 hours ago
  },
  {
    id: 2,
    type: 'system',
    title: 'Account Updated',
    message: 'Your account information has been successfully updated.',
    isRead: true,
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() // 1 day ago
  },
  {
    id: 3,
    type: 'order',
    title: 'Order Shipped',
    message: 'Your order #12345 has been shipped and is on its way!',
    isRead: false,
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString() // 12 hours ago
  }
];

export const NotificationsProvider = ({ children }) => {
  // Initialize state from localStorage if available
  const [notifications, setNotifications] = useState(() => {
    const savedNotifications = localStorage.getItem('notifications');
    return savedNotifications ? JSON.parse(savedNotifications) : initialNotifications;
  });

  // Save notifications to localStorage when they change
  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Add a new notification
  const addNotification = (notification) => {
    const newNotification = {
      id: Date.now(),
      isRead: false,
      timestamp: new Date().toISOString(),
      ...notification
    };
    setNotifications(prevNotifications => [newNotification, ...prevNotifications]);
    return newNotification.id;
  };

  // Mark a notification as read
  const markAsRead = (id) => {
    setNotifications(prevNotifications => 
      prevNotifications.map(notification => 
        notification.id === id ? { ...notification, isRead: true } : notification
      )
    );
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(prevNotifications => 
      prevNotifications.map(notification => ({ ...notification, isRead: true }))
    );
  };

  // Remove a notification
  const removeNotification = (id) => {
    setNotifications(prevNotifications => 
      prevNotifications.filter(notification => notification.id !== id)
    );
  };

  // Clear all notifications
  const clearAllNotifications = () => {
    setNotifications([]);
  };

  // Get unread count
  const unreadCount = notifications.filter(notification => !notification.isRead).length;

  return (
    <NotificationsContext.Provider value={{
      notifications,
      unreadCount,
      addNotification,
      markAsRead,
      markAllAsRead,
      removeNotification,
      clearAllNotifications
    }}>
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationsContext);