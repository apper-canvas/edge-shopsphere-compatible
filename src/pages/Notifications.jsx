import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { useNotifications } from '../context/NotificationsContext';
import ApperIcon from '../components/ApperIcon';
import { format } from 'date-fns';

const Notifications = () => {
  const { 
    notifications, 
    markAsRead, 
    markAllAsRead, 
    removeNotification, 
    clearAllNotifications 
  } = useNotifications();

  const [activeFilter, setActiveFilter] = useState('all');
  const [showConfirmClear, setShowConfirmClear] = useState(false);

  // Filter notifications based on selected filter
  const filteredNotifications = notifications.filter(notification => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'unread') return !notification.isRead;
    return notification.type === activeFilter;
  });

  // Get notification icon based on type
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'promotional': return 'Tag';
      case 'system': return 'Bell';
      case 'order': return 'Package';
      default: return 'Info';
    }
  };

  // Format timestamp to readable date
  const formatDate = (timestamp) => {
    try {
      return format(new Date(timestamp), 'MMM d, yyyy • h:mm a');
    } catch (error) {
      return 'Unknown date';
    }
  };

  // Handle marking notification as read
  const handleMarkAsRead = (id) => {
    markAsRead(id);
    toast.success('Notification marked as read');
  };

  // Handle marking all notifications as read
  const handleMarkAllAsRead = () => {
    if (notifications.some(n => !n.isRead)) {
      markAllAsRead();
      toast.success('All notifications marked as read');
    } else {
      toast.info('No unread notifications');
    }
  };

  // Handle removing a notification
  const handleRemoveNotification = (id) => {
    removeNotification(id);
    toast.success('Notification removed');
  };

  // Handle clearing all notifications
  const handleClearAll = () => {
    clearAllNotifications();
    setShowConfirmClear(false);
    toast.success('All notifications cleared');
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.05 } 
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-surface-50 py-8 dark:bg-surface-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold md:text-3xl">Notifications</h1>
            <p className="mt-1 text-surface-500">Stay updated with the latest information</p>
          </div>
          <Link to="/" className="flex items-center gap-1 text-primary hover:text-primary-dark">
            <ApperIcon name="ArrowLeft" className="h-4 w-4" />
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-2">
          {['all', 'unread', 'promotional', 'system', 'order'].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`rounded-full px-4 py-1.5 text-sm ${
                activeFilter === filter
                  ? 'bg-primary text-white'
                  : 'bg-white text-surface-600 hover:bg-surface-100 dark:bg-surface-800 dark:text-surface-300 dark:hover:bg-surface-700'
              }`}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="mb-6 flex flex-wrap gap-4">
          <button
            onClick={handleMarkAllAsRead}
            className="flex items-center gap-1 rounded-lg bg-white px-3 py-2 text-sm hover:bg-surface-100 dark:bg-surface-800 dark:hover:bg-surface-700"
          >
            <ApperIcon name="CheckCircle" className="h-4 w-4" />
            <span>Mark all as read</span>
          </button>
          <button
            onClick={() => setShowConfirmClear(true)}
            className="flex items-center gap-1 rounded-lg bg-white px-3 py-2 text-sm text-red-500 hover:bg-red-50 dark:bg-surface-800 dark:hover:bg-red-900/20"
          >
            <ApperIcon name="Trash2" className="h-4 w-4" />
            <span>Clear all</span>
          </button>
        </div>

        {/* Notifications List */}
        {filteredNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg bg-white py-12 text-center dark:bg-surface-800">
            <ApperIcon name="BellOff" className="h-12 w-12 text-surface-400" />
            <h3 className="mt-4 text-lg font-medium">No notifications</h3>
            <p className="mt-1 text-surface-500">You don't have any notifications yet</p>
          </div>
        ) : (
          <motion.div 
            className="space-y-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {filteredNotifications.map((notification) => (
              <motion.div
                key={notification.id}
                variants={itemVariants}
                className={`relative rounded-lg bg-white p-4 shadow-sm transition-all dark:bg-surface-800 ${
                  !notification.isRead ? 'border-l-4 border-primary' : ''
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`rounded-full p-2 ${
                    notification.type === 'promotional' ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400' :
                    notification.type === 'system' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' :
                    'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                  }`}>
                    <ApperIcon name={getNotificationIcon(notification.type)} className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{notification.title}</h3>
                    <p className="text-surface-600 dark:text-surface-300">{notification.message}</p>
                    <p className="mt-1 text-sm text-surface-500">{formatDate(notification.timestamp)}</p>
                  </div>
                  <div className="flex gap-2">
                    {!notification.isRead && (
                      <button
                        onClick={() => handleMarkAsRead(notification.id)}
                        className="rounded p-1 text-surface-400 hover:bg-surface-100 hover:text-primary dark:hover:bg-surface-700"
                        title="Mark as read"
                      >
                        <ApperIcon name="CheckCircle" className="h-5 w-5" />
                      </button>
                    )}
                    <button
                      onClick={() => handleRemoveNotification(notification.id)}
                      className="rounded p-1 text-surface-400 hover:bg-surface-100 hover:text-red-500 dark:hover:bg-surface-700"
                      title="Remove notification"
                    >
                      <ApperIcon name="X" className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Confirmation Modal */}
        {showConfirmClear && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <motion.div 
              className="w-full max-w-md rounded-lg bg-white p-6 dark:bg-surface-800"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <h3 className="text-lg font-medium">Clear all notifications?</h3>
              <p className="mt-2 text-surface-500">This action cannot be undone.</p>
              <div className="mt-4 flex justify-end gap-3">
                <button 
                  onClick={() => setShowConfirmClear(false)}
                  className="rounded-lg border border-surface-300 px-4 py-2 hover:bg-surface-100 dark:border-surface-600 dark:hover:bg-surface-700"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleClearAll}
                  className="rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600"
                >
                  Clear All
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;