import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from './components/ApperIcon';
import { NotificationsProvider } from './context/NotificationsContext';
import { WishlistProvider } from './context/WishlistContext';
import Home from './pages/Home';
import Women from './pages/Women';
import Men from './pages/Men';
import Accessories from './pages/Accessories';
import NotFound from './pages/NotFound';
import Wishlist from './pages/Wishlist';
import Checkout from './pages/Checkout';
import Notifications from './pages/Notifications';

const App = () => {
  const [darkMode, setDarkMode] = useState(() => {
    // Check for saved theme preference or use system preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme === 'dark';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    // Apply theme to document
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  return (
    <NotificationsProvider>
      <WishlistProvider>
        {/* Theme toggle button */}
        <motion.button
          onClick={toggleDarkMode}
          className="fixed right-4 top-4 z-50 rounded-full bg-white p-2 shadow-soft dark:bg-surface-800"
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <ApperIcon 
            name={darkMode ? "Sun" : "Moon"} 
            className="h-5 w-5 text-surface-800 dark:text-surface-100" 
          />
        </motion.button>

        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/women" element={<Women />} />
            <Route path="/men" element={<Men />} />
            <Route path="/accessories" element={<Accessories />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AnimatePresence>

        <ToastContainer
          position="bottom-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme={darkMode ? "dark" : "light"}
          toastClassName="rounded-lg"
        />
      </WishlistProvider>
    </NotificationsProvider>
  );
};

export default App;