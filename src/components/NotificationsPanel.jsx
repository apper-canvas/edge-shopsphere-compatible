import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useNotifications } from '../context/NotificationsContext';
import ApperIcon from './ApperIcon';
import { format, formatDistanceToNow } from 'date-fns';

const NotificationsPanel = ({ isOpen, onClose }) => {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const panelRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Get notification icon based on type
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'promotional': return 'Tag';
      case 'system': return 'Bell';
      case 'order': return 'Package';
      default: return 'Info';
    }
  };

  // Format timestamp to relative time
  const formatTime = (timestamp) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch (error) {
      return 'recently';
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      ref={panelRef}
      className="absolute right-4 top-16 z-50 w-80 rounded-lg bg-white p-4 shadow-lg dark:bg-surface-800"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-center justify-between border-b border-surface-200 pb-2 dark:border-surface-700">
        <h3 className="font-semibold">Notifications</h3>
        {unreadCount > 0 && (
          <span className="rounded-full bg-primary px-2 py-0.5 text-xs text-white">
            {unreadCount} new
          </span>
        )}
      </div>
      
      <div className="mt-2 max-h-80 overflow-y-auto scrollbar-hide">
        {notifications.length === 0 ? (
          <div className="py-4 text-center text-surface-500">
            <ApperIcon name="BellOff" className="mx-auto h-8 w-8 opacity-40" />
            <p className="mt-2">No notifications yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.slice(0, 5).map((notification) => (
              <div 
                key={notification.id}
                className={`rounded-lg p-3 ${notification.isRead ? 'bg-surface-50 dark:bg-surface-800' : 'bg-surface-100 dark:bg-surface-700'}`}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="flex items-start gap-3">
                  <ApperIcon name={getNotificationIcon(notification.type)} className="mt-0.5 h-5 w-5 text-primary" />
                  <div>
                    <h4 className="text-sm font-medium">{notification.title}</h4>
                    <p className="text-sm">{notification.message}</p>
                    <p className="mt-1 text-xs text-surface-500">{formatTime(notification.timestamp)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="mt-3 flex justify-between border-t border-surface-200 pt-2 dark:border-surface-700">
        <button onClick={markAllAsRead} className="text-xs text-primary hover:text-primary-dark">Mark all as read</button>
        <Link to="/notifications" onClick={onClose} className="text-xs text-primary hover:text-primary-dark">View all</Link>
      </div>
    </motion.div>
  );
};

export default NotificationsPanel;