import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import ApperIcon from '../components/ApperIcon';
import MainFeature from '../components/MainFeature';

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm dark:bg-surface-900">
        <div className="container mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            {/* Logo */}
            <div className="flex items-center">
              <motion.div 
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-white"
                whileHover={{ rotate: 5, scale: 1.05 }}
              >
                <ApperIcon name="ShoppingBag" className="h-6 w-6" />
              </motion.div>
              <h1 className="ml-2 text-xl font-bold">ShopSphere</h1>
            </div>
            
            {/* Search Bar */}
            <div className="relative w-full max-w-md">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-surface-400">
                <ApperIcon name="Search" className="h-4 w-4" />
              </div>
              <input
                type="text"
                placeholder="Search for products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-surface-200 bg-surface-50 py-2 pl-10 pr-4 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-surface-700 dark:bg-surface-800"
              />
            </div>
            
            {/* Nav Icons */}
            <div className="flex items-center gap-4">
              <Link to="/wishlist" className="hidden items-center gap-1 text-sm hover:text-primary md:flex">
                <ApperIcon name="Heart" className="h-5 w-5" />
                <span>Wishlist</span>
              </Link>
              
              <button onClick={() => setShowNotifications(!showNotifications)} className="hidden items-center gap-1 text-sm hover:text-primary md:flex relative">
                <ApperIcon name="Bell" className="h-5 w-5" />
                <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">2</span>
              </button>
            </div>
          </div>
          
          {/* Navigation */}
          <nav className="mt-4 hidden overflow-x-auto md:block">
            <ul className="flex space-x-8">
              {["New Arrivals", "Women", "Men", "Accessories", "Sale", "Collections"].map((item) => (
                <li key={item} className={item === "Women" ? "relative" : ""}>
                  <a 
                    href="#" 
                    className="relative py-2 text-sm font-medium hover:text-primary"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>
      
      {/* Notifications Dropdown */}
      {showNotifications && (
        <div className="absolute right-4 top-16 z-50 w-80 rounded-lg bg-white p-4 shadow-lg dark:bg-surface-800">
          <div className="flex items-center justify-between border-b border-surface-200 pb-2 dark:border-surface-700">
            <h3 className="font-semibold">Notifications</h3>
            <span className="rounded-full bg-primary px-2 py-0.5 text-xs text-white">2 new</span>
          </div>
          <div className="mt-2 space-y-3">
            <div className="rounded-lg bg-surface-100 p-3 dark:bg-surface-700">
              <div className="flex items-start gap-3">
                <ApperIcon name="Tag" className="mt-0.5 h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm">Special offer: Get 20% off on all accessories today!</p>
                  <p className="mt-1 text-xs text-surface-500">2 hours ago</p>
                </div>
              </div>
            </div>
            {/* Add more notification items here */}
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-surface-900 dark:to-surface-800">
        <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8 lg:py-20">
          <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2">
            <motion.div 
              className="text-center md:text-left"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
                Discover Our <span className="text-primary">Summer Collection</span>
              </h2>
              <p className="mt-4 text-lg text-surface-600 dark:text-surface-300">
                Explore the latest trends and find your perfect style. Quality products at competitive prices.
              </p>
              <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row md:justify-start">
                <a 
                  href="#products" 
                  className="rounded-lg bg-primary px-6 py-3 text-center font-medium text-white shadow-lg shadow-primary/30 transition-transform hover:translate-y-[-2px]"
                >
                  Shop Now
                </a>
                <a 
                  href="#collections" 
                  className="rounded-lg border border-surface-300 bg-white/80 px-6 py-3 text-center font-medium text-surface-800 shadow-sm transition-colors hover:bg-surface-50 dark:border-surface-700 dark:bg-surface-800/80 dark:text-white dark:hover:bg-surface-700"
                >
                  View Collections
                </a>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative rounded-2xl bg-white p-2 shadow-soft dark:bg-surface-800"
            >
              <img 
                src="https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                alt="Summer Collection" 
                className="h-full w-full rounded-xl object-cover"
              />
              
              {/* Floating discount badge */}
              <div className="absolute -right-4 -top-4 rounded-full bg-accent px-4 py-2 text-sm font-bold text-white shadow-md">
                Up to 40% OFF
              </div>
            </motion.div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute -bottom-16 -left-16 h-40 w-40 rounded-full bg-primary/10"></div>
        <div className="absolute -right-20 top-10 h-60 w-60 rounded-full bg-secondary/10"></div>
      </section>

      {/* Features */}
      <section className="bg-white py-8 dark:bg-surface-900 lg:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {[
              { icon: "Truck", title: "Free Shipping", description: "On orders over $50" },
              { icon: "RotateCcw", title: "Easy Returns", description: "30-day return policy" },
              { icon: "ShieldCheck", title: "Secure Payments", description: "Protected transactions" },
              { icon: "HeadphonesIcon", title: "24/7 Support", description: "Call or email us anytime" }
            ].map((feature, index) => (
              <motion.div 
                key={index}
                className="flex flex-col items-center rounded-xl p-4 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div className="mb-3 rounded-full bg-primary/10 p-3 text-primary dark:bg-primary/20">
                  <ApperIcon name={feature.icon} className="h-6 w-6" />
                </div>
                <h3 className="mb-1 font-semibold">{feature.title}</h3>
                <p className="text-sm text-surface-500">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Products Section */}
      <section id="products" className="bg-surface-50 py-12 dark:bg-surface-900 lg:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="mb-8 text-center"
            {...fadeIn}
          >
            <h2 className="text-2xl font-bold md:text-3xl">Trending Products</h2>
            <p className="mt-2 text-surface-500">Discover our most popular items this season</p>
          </motion.div>

          <MainFeature />
        </div>
      </section>

      {/* Categories Section */}
      <section className="bg-white py-12 dark:bg-surface-800 lg:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="mb-8 text-center"
            {...fadeIn}
          >
            <h2 className="text-2xl font-bold md:text-3xl">Shop by Category</h2>
            <p className="mt-2 text-surface-500">Browse our collections by category</p>
          </motion.div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {[
              { name: "Clothing", image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" },
              { name: "Footwear", image: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" },
              { name: "Accessories", image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" },
              { name: "Electronics", image: "https://images.unsplash.com/photo-1593344484962-796055d4a3a4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" }
            ].map((category, index) => (
              <motion.div
                key={index}
                className="group relative aspect-square overflow-hidden rounded-xl shadow-md"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <img 
                  src={category.image} 
                  alt={category.name}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent">
                  <div className="absolute bottom-0 left-0 w-full p-4">
                    <h3 className="text-lg font-semibold text-white">{category.name}</h3>
                    <p className="text-sm text-white/80">Shop Now</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-surface-800 py-12 text-surface-200 dark:bg-surface-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            <div>
              <div className="flex items-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-white">
                  <ApperIcon name="ShoppingBag" className="h-6 w-6" />
                </div>
                <h3 className="ml-2 text-xl font-bold text-white">ShopSphere</h3>
              </div>
              <p className="mt-4 text-surface-400">Your one-stop destination for all your shopping needs.</p>
              <div className="mt-4 flex space-x-4">
                {["Facebook", "Twitter", "Instagram", "Linkedin"].map((social) => (
                  <a 
                    key={social} 
                    href="#" 
                    className="text-surface-400 transition-colors hover:text-white"
                  >
                    <ApperIcon name={social} className="h-5 w-5" />
                  </a>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="mb-4 font-semibold text-white">Shop</h4>
              <ul className="space-y-2">
                {["New Arrivals", "Bestsellers", "Women", "Men", "Accessories", "Sale"].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-surface-400 hover:text-white">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="mb-4 font-semibold text-white">Help</h4>
              <ul className="space-y-2">
                {["FAQ", "Shipping & Returns", "Contact Us", "Track Order", "Size Guide"].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-surface-400 hover:text-white">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="mb-4 font-semibold text-white">Stay Updated</h4>
              <p className="mb-4 text-surface-400">Subscribe to get special offers, free giveaways, and product launches.</p>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Your email" 
                  className="w-full rounded-l-lg border-y border-l border-surface-700 bg-surface-700 px-3 py-2 text-white placeholder-surface-400 focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <button className="rounded-r-lg bg-primary px-4 text-white hover:bg-primary-dark">
                  <ApperIcon name="Send" className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
          
          <div className="mt-12 border-t border-surface-700 pt-6 text-center text-sm text-surface-400">
            <p>&copy; {new Date().getFullYear()} ShopSphere. All rights reserved.</p>
            <div className="mt-2 flex justify-center space-x-4">
              <a href="#" className="hover:text-white">Privacy Policy</a>
              <a href="#" className="hover:text-white">Terms of Service</a>
              <a href="#" className="hover:text-white">Cookies Settings</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;