import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useWishlist } from '../context/WishlistContext';
import { useNotifications } from '../context/NotificationsContext';
import ApperIcon from '../components/ApperIcon';
import NotificationsPanel from '../components/NotificationsPanel';
import { menProducts, menCategories } from '../data/menProducts';

const Men = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [pricerange, setPricerange] = useState([0, 300]);
  const [filteredProducts, setFilteredProducts] = useState(menProducts);
  const [showNotifications, setShowNotifications] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [showCart, setShowCart] = useState(false);

  const { wishlistItems, addToWishlist, removeFromWishlist } = useWishlist();
  const { addNotification, unreadCount } = useNotifications();

  useEffect(() => {
    const filtered = menProducts.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      return matchesSearch && matchesCategory && product.price >= pricerange[0] && product.price <= pricerange[1];
    });
    setFilteredProducts(filtered);
  }, [searchQuery, selectedCategory, pricerange]);

  const handleWishlistToggle = (product) => {
    const isInWishlist = wishlistItems.some(item => item.id === product.id);
    
    if (isInWishlist) {
      removeFromWishlist(product.id);
      toast.success(`${product.name} removed from wishlist`);
      addNotification({
        type: 'info',
        message: `${product.name} removed from wishlist`,
        timestamp: new Date().toISOString()
      });
    } else {
      addToWishlist(product);
      toast.success(`${product.name} added to wishlist`);
      addNotification({
        type: 'success',
        message: `${product.name} added to wishlist`,
        timestamp: new Date().toISOString()
      });
    }
  };

  const handleAddToCart = (product) => {
    const existingItem = cartItems.find(item => item.id === product.id);
    
    if (existingItem) {
      setCartItems(cartItems.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCartItems([...cartItems, { ...product, quantity: 1 }]);
    }
    
    toast.success(`${product.name} added to cart`);
    addNotification({
      type: 'success',
      message: `${product.name} added to cart`,
      timestamp: new Date().toISOString()
    });
  };

  const getTotalCartItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalCartValue = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const removeFromCart = (productId) => {
    const product = cartItems.find(item => item.id === productId);
    setCartItems(cartItems.filter(item => item.id !== productId));
    toast.info(`${product.name} removed from cart`);
  };

  const updateCartQuantity = (productId, newQuantity) => {
    if (newQuantity === 0) {
      removeFromCart(productId);
      return;
    }
    
    setCartItems(cartItems.map(item => 
      item.id === productId 
        ? { ...item, quantity: newQuantity }
        : item
    ));
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
                placeholder="Search men's products..."
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
                {wishlistItems.length > 0 && (
                  <span className="ml-1 rounded-full bg-primary px-2 py-1 text-xs text-white">
                    {wishlistItems.length}
                  </span>
                )}
              </Link>
              
              <button onClick={() => setShowCart(!showCart)} className="hidden items-center gap-1 text-sm hover:text-primary md:flex relative">
                <ApperIcon name="ShoppingCart" className="h-5 w-5" />
                <span>Cart</span>
                {getTotalCartItems() > 0 && (
                  <span className="ml-1 rounded-full bg-primary px-2 py-1 text-xs text-white">
                    {getTotalCartItems()}
                  </span>
                )}
              </button>
              
              <button onClick={() => setShowNotifications(!showNotifications)} className="hidden items-center gap-1 text-sm hover:text-primary md:flex relative">
                <ApperIcon name="Bell" className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">{unreadCount}</span>
                )}
              </button>
            </div>
          </div>
          
          {/* Navigation */}
          <nav className="mt-4 hidden overflow-x-auto md:block">
            <ul className="flex space-x-8">
              <li><Link to="/" className="py-2 text-sm font-medium hover:text-primary">Home</Link></li>
              <li><Link to="/women" className="py-2 text-sm font-medium hover:text-primary">Women</Link></li>
              <li><span className="py-2 text-sm font-medium text-primary border-b-2 border-primary">Men</span></li>
              <li><a href="#accessories" className="py-2 text-sm font-medium hover:text-primary">Accessories</a></li>
              <li><a href="#sale" className="py-2 text-sm font-medium hover:text-primary">Sale</a></li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Notifications Panel */}
      {showNotifications && <NotificationsPanel isOpen={showNotifications} onClose={() => setShowNotifications(false)} />}

      {/* Shopping Cart Sidebar */}
      {showCart && (
        <div className="fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowCart(false)}></div>
          <div className="relative ml-auto w-80 bg-white shadow-xl dark:bg-surface-800">
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="text-lg font-semibold">Shopping Cart</h3>
                <button onClick={() => setShowCart(false)}>
                  <ApperIcon name="X" className="h-5 w-5" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4">
                {cartItems.length === 0 ? (
                  <p className="text-center text-surface-500">Your cart is empty</p>
                ) : (
                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex items-center gap-3 border-b pb-3">
                        <img src={item.image} alt={item.name} className="h-12 w-12 rounded object-cover" />
                        <div className="flex-1">
                          <h4 className="text-sm font-medium">{item.name}</h4>
                          <p className="text-sm text-surface-500">${item.price}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <button 
                              onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                              className="h-6 w-6 rounded bg-surface-200 text-xs flex items-center justify-center"
                            >
                              -
                            </button>
                            <span className="text-sm">{item.quantity}</span>
                            <button 
                              onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                              className="h-6 w-6 rounded bg-surface-200 text-xs flex items-center justify-center"
                            >
                              +
                            </button>
                            <button 
                              onClick={() => removeFromCart(item.id)}
                              className="ml-auto text-red-500"
                            >
                              <ApperIcon name="Trash2" className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {cartItems.length > 0 && (
                <div className="border-t p-4">
                  <div className="flex justify-between mb-4">
                    <span className="font-semibold">Total: ${getTotalCartValue().toFixed(2)}</span>
                  </div>
                  <Link 
                    to="/checkout" 
                    className="block w-full rounded-lg bg-primary py-2 text-center text-white hover:bg-primary-dark"
                    onClick={() => setShowCart(false)}
                  >
                    Checkout
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-xl p-6 shadow-card dark:bg-surface-800">
              <h3 className="text-lg font-semibold mb-4">Filters</h3>
              
              {/* Category Filter */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">Category</h4>
                <div className="space-y-2">
                  {menCategories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        selectedCategory === category
                          ? 'bg-primary text-white'
                          : 'text-surface-600 hover:bg-surface-100 dark:text-surface-300 dark:hover:bg-surface-700'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Price Range Filter */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">Price Range</h4>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm text-surface-600 dark:text-surface-300">
                    <span>${pricerange[0]}</span>
                    <span>${pricerange[1]}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="300"
                    value={pricerange[0]}
                    onChange={(e) => setPricerange([parseInt(e.target.value), pricerange[1]])}
                    className="w-full"
                  />
                  <input
                    type="range"
                    min="0"
                    max="300"
                    value={pricerange[1]}
                    onChange={(e) => setPricerange([pricerange[0], parseInt(e.target.value)])}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            <div className="mb-6">
              <h2 className="text-2xl font-bold">Men's Collection</h2>
              <p className="text-surface-600 dark:text-surface-300 mt-1">
                {filteredProducts.length} products found
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredProducts.map((product) => {
                const isInWishlist = wishlistItems.some(item => item.id === product.id);
                
                return (
                  <motion.div
                    key={product.id}
                    className="group relative overflow-hidden rounded-xl bg-white shadow-card dark:bg-surface-800"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="aspect-square overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    
                    <div className="p-4">
                      <div className="mb-2">
                        <h3 className="font-semibold text-surface-800 dark:text-surface-100">
                          {product.name}
                        </h3>
                        <p className="text-sm text-surface-500">{product.category}</p>
                      </div>
                      
                      <div className="mb-3">
                        <span className="text-lg font-bold text-primary">${product.price}</span>
                      </div>
                      
                      <p className="text-sm text-surface-600 dark:text-surface-300 mb-4">
                        {product.description}
                      </p>
                      
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAddToCart(product)}
                          className="flex-1 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-dark"
                        >
                          Add to Cart
                        </button>
                        <button
                          onClick={() => handleWishlistToggle(product)}
                          className={`rounded-lg p-2 transition-colors ${
                            isInWishlist
                              ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                              : 'bg-surface-100 text-surface-600 hover:bg-surface-200 dark:bg-surface-700 dark:text-surface-300 dark:hover:bg-surface-600'
                          }`}
                        >
                          <ApperIcon 
                            name="Heart" 
                            className={`h-5 w-5 ${isInWishlist ? 'fill-current' : ''}`} 
                          />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
            
            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <ApperIcon name="Search" className="h-12 w-12 text-surface-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-surface-600 dark:text-surface-300 mb-2">
                  No products found
                </h3>
                <p className="text-surface-500">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Men;