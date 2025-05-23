import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useNotifications } from '../context/NotificationsContext';
import { useWishlist } from '../context/WishlistContext';
import ApperIcon from '../components/ApperIcon';
import NotificationsPanel from '../components/NotificationsPanel';
import { saleProducts } from '../data/saleProducts';

const Sale = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [pricerange, setPriceRange] = useState([0, 200]);
  const [filteredProducts, setFilteredProducts] = useState(saleProducts);
  const [cart, setCart] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  
  const { unreadCount } = useNotifications();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const categories = ['all', ...new Set(saleProducts.map(product => product.category))];

  useEffect(() => {
    let filtered = saleProducts.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      const matchesPrice = product.price >= pricerange[0] && product.price <= pricerange[1];
      return matchesSearch && matchesCategory && matchesPrice;
    });
    setFilteredProducts(filtered);
  }, [searchQuery, selectedCategory, pricerange]);

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
      toast.success(`Updated ${product.name} quantity in cart!`);
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
      toast.success(`Added ${product.name} to cart!`);
    }
  };

  const toggleWishlist = (product) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
      toast.info(`Removed ${product.name} from wishlist`);
    } else {
      addToWishlist(product);
      toast.success(`Added ${product.name} to wishlist!`);
    }
  };

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-900">
      {/* Header */}
      <header className="bg-white shadow-sm dark:bg-surface-900">
        <div className="container mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <motion.div 
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-white"
                whileHover={{ rotate: 5, scale: 1.05 }}
              >
                <ApperIcon name="ShoppingBag" className="h-6 w-6" />
              </motion.div>
              <h1 className="ml-2 text-xl font-bold">ShopSphere</h1>
            </Link>
            
            {/* Search Bar */}
            <div className="relative w-full max-w-md">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-surface-400">
                <ApperIcon name="Search" className="h-4 w-4" />
              </div>
              <input
                type="text"
                placeholder="Search sale products..."
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
                {unreadCount > 0 && (
                  <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">{unreadCount}</span>
                )}
              </button>
              
              <Link to="/checkout" className="flex items-center gap-1 text-sm hover:text-primary">
                <ApperIcon name="ShoppingCart" className="h-5 w-5" />
                <span className="hidden md:block">Cart</span>
                {cart.length > 0 && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-white">
                    {cart.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                )}
              </Link>
            </div>
          </div>
          
          {/* Navigation */}
          <nav className="mt-4 hidden overflow-x-auto md:block">
            <ul className="flex space-x-8">
              {[
                { name: "Home", path: "/" },
                { name: "Women", path: "/women" },
                { name: "Men", path: "/men" },
                { name: "Accessories", path: "/accessories" },
                { name: "Sale", path: "/sale", active: true }
              ].map((item) => (
                <li key={item.name}>
                  <Link 
                    to={item.path}
                    className={`relative py-2 text-sm font-medium hover:text-primary ${
                      item.active ? 'text-primary border-b-2 border-primary' : ''
                    }`}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>
      
      {/* Notifications Panel */}
      {showNotifications && <NotificationsPanel isOpen={showNotifications} onClose={() => setShowNotifications(false)} />}

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-red-50 to-pink-50 dark:from-surface-900 dark:to-surface-800">
        <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center"
            {...fadeIn}
          >
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              <span className="text-red-600">MEGA SALE</span>
            </h1>
            <p className="mt-4 text-lg text-surface-600 dark:text-surface-300">
              Up to 70% off on selected items. Limited time offer!
            </p>
            <div className="mt-6 flex justify-center">
              <div className="rounded-full bg-red-500 px-6 py-2 text-white font-bold text-xl animate-pulse">
                🔥 HOT DEALS 🔥
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Filters Sidebar */}
          <motion.div 
            className="lg:col-span-1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="rounded-lg bg-white p-6 shadow-soft dark:bg-surface-800">
              <h3 className="mb-4 text-lg font-semibold">Filters</h3>
              
              {/* Category Filter */}
              <div className="mb-6">
                <h4 className="mb-3 font-medium">Category</h4>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <label key={category} className="flex items-center">
                      <input
                        type="radio"
                        name="category"
                        value={category}
                        checked={selectedCategory === category}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="mr-2 text-primary focus:ring-primary"
                      />
                      <span className="text-sm capitalize">{category}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              {/* Price Range Filter */}
              <div className="mb-6">
                <h4 className="mb-3 font-medium">Price Range</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span>${pricerange[0]}</span>
                    <span>${pricerange[1]}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={pricerange[1]}
                    onChange={(e) => setPriceRange([pricerange[0], parseInt(e.target.value)])}
                    className="w-full accent-primary"
                  />
                  <div className="flex gap-2">
                    <input
                      type="number"
                      min="0"
                      max="200"
                      value={pricerange[0]}
                      onChange={(e) => setPriceRange([parseInt(e.target.value), pricerange[1]])}
                      className="w-full rounded border border-surface-200 px-2 py-1 text-sm focus:border-primary focus:outline-none dark:border-surface-700 dark:bg-surface-700"
                      placeholder="Min"
                    />
                    <input
                      type="number"
                      min="0"
                      max="200"
                      value={pricerange[1]}
                      onChange={(e) => setPriceRange([pricerange[0], parseInt(e.target.value)])}
                      className="w-full rounded border border-surface-200 px-2 py-1 text-sm focus:border-primary focus:outline-none dark:border-surface-700 dark:bg-surface-700"
                      placeholder="Max"
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold">Sale Products ({filteredProducts.length})</h2>
              <div className="flex items-center gap-2 text-sm text-surface-500">
                <ApperIcon name="Zap" className="h-4 w-4 text-red-500" />
                <span>Limited time offers</span>
              </div>
            </div>
            
            {filteredProducts.length === 0 ? (
              <motion.div 
                className="text-center py-12"
                {...fadeIn}
              >
                <ApperIcon name="Search" className="h-16 w-16 mx-auto mb-4 text-surface-300" />
                <h3 className="text-xl font-semibold mb-2">No products found</h3>
                <p className="text-surface-500">Try adjusting your search or filter criteria</p>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    className="group relative overflow-hidden rounded-lg bg-white shadow-soft dark:bg-surface-800"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                  >
                    {/* Discount Badge */}
                    <div className="absolute top-2 left-2 z-10 rounded-full bg-red-500 px-2 py-1 text-xs font-bold text-white">
                      -{product.discount}%
                    </div>
                    
                    {/* Wishlist Button */}
                    <button
                      onClick={() => toggleWishlist(product)}
                      className="absolute right-2 top-2 z-10 rounded-full bg-white/80 p-2 shadow-md backdrop-blur-sm transition-colors hover:bg-white dark:bg-surface-800/80 dark:hover:bg-surface-800"
                    >
                      <ApperIcon 
                        name="Heart" 
                        className={`h-4 w-4 ${isInWishlist(product.id) ? 'text-red-500 fill-current' : 'text-surface-600'}`}
                      />
                    </button>
                    
                    {/* Product Image */}
                    <div className="aspect-square overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                    </div>
                    
                    {/* Product Info */}
                    <div className="p-4">
                      <div className="mb-2">
                        <span className="text-xs text-surface-500 uppercase tracking-wide">{product.category}</span>
                      </div>
                      
                      <h3 className="mb-2 font-semibold text-surface-900 dark:text-white">
                        {product.name}
                      </h3>
                      
                      <p className="mb-3 text-sm text-surface-600 dark:text-surface-300">
                        {product.description}
                      </p>
                      
                      {/* Rating */}
                      <div className="mb-3 flex items-center gap-1">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <ApperIcon
                              key={i}
                              name="Star"
                              className={`h-3 w-3 ${
                                i < Math.floor(product.rating)
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-surface-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-surface-500">({product.reviews})</span>
                      </div>
                      
                      {/* Price */}
                      <div className="mb-4 flex items-center gap-2">
                        <span className="text-lg font-bold text-red-600">${product.price}</span>
                        <span className="text-sm text-surface-500 line-through">${product.originalPrice}</span>
                      </div>
                      
                      {/* Add to Cart Button */}
                      <button
                        onClick={() => addToCart(product)}
                        className="w-full rounded-lg bg-primary px-4 py-2 font-medium text-white transition-colors hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sale Benefits Section */}
      <section className="bg-white py-12 dark:bg-surface-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-8"
            {...fadeIn}
          >
            <h2 className="text-2xl font-bold md:text-3xl">Why Shop Our Sale?</h2>
            <p className="mt-2 text-surface-500">Unbeatable deals with guaranteed quality</p>
          </motion.div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {[
              { icon: "Tag", title: "Massive Discounts", description: "Save up to 70% on premium products" },
              { icon: "Clock", title: "Limited Time", description: "Exclusive deals for a short period only" },
              { icon: "ShieldCheck", title: "Quality Guaranteed", description: "Same high-quality products at lower prices" }
            ].map((benefit, index) => (
              <motion.div 
                key={index}
                className="text-center p-6 rounded-lg bg-surface-50 dark:bg-surface-700"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div className="mb-4 flex justify-center">
                  <div className="rounded-full bg-red-500/10 p-3 text-red-600">
                    <ApperIcon name={benefit.icon} className="h-6 w-6" />
                  </div>
                </div>
                <h3 className="mb-2 font-semibold">{benefit.title}</h3>
                <p className="text-sm text-surface-500">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Sale Timer Section */}
      <section className="bg-red-50 py-8 dark:bg-surface-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center"
            {...fadeIn}
          >
            <h2 className="text-xl font-bold text-red-600 mb-4">⏰ Sale Ends Soon!</h2>
            <p className="text-surface-600 dark:text-surface-300 mb-6">
              Don't miss out on these incredible deals. Shop now before it's too late!
            </p>
            <div className="flex justify-center">
              <Link 
                to="/checkout"
                className="rounded-lg bg-red-500 px-8 py-3 font-medium text-white transition-colors hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Shop Sale Now
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Sale;