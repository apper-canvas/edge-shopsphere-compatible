import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useWishlist } from '../context/WishlistContext';
import { useNotifications } from '../context/NotificationsContext';
import ApperIcon from '../components/ApperIcon';
import NotificationsPanel from '../components/NotificationsPanel';
import { accessoriesProducts } from '../data/accessoriesProducts';

const categories = ["All", "Bags", "Jewelry", "Sunglasses", "Tech", "Watches", "Scarves", "Belts"];
const brands = ["All", "LuxeCraft", "SunStyle", "SilverGlow", "AudioTech", "UrbanTrail", "TimeFlow", "SilkArt", "GoldenTouch", "RetroVision", "ClassicLeather", "FitTech", "WarmLux", "DiamondLux", "UrbanCarry", "TimeMaster", "ChargeTech", "GlamVision", "FlexStyle"];

const Accessories = () => {
  const navigate = useNavigate();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { unreadCount } = useNotifications();
  const [products, setProducts] = useState(accessoriesProducts);
  const [filteredProducts, setFilteredProducts] = useState(accessoriesProducts);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeBrand, setActiveBrand] = useState("All");
  const [pricerange, setPricerange] = useState([0, 300]);
  const [showInStock, setShowInStock] = useState(false);

  // Apply filters when changed
  useEffect(() => {
    let result = [...products];

    // Search filter
    if (searchQuery.trim()) {
      result = result.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (activeCategory !== "All") {
      result = result.filter(product => product.category === activeCategory);
    }

    // Brand filter
    if (activeBrand !== "All") {
      result = result.filter(product => product.brand === activeBrand);
    }

    // Price range filter
    result = result.filter(product => {
      return product.price >= pricerange[0] && product.price <= pricerange[1];
    });

    // In-stock filter
    if (showInStock) {
      result = result.filter(product => product.inStock);
    }

    setFilteredProducts(result);
  }, [activeCategory, activeBrand, pricerange, showInStock, products, searchQuery]);

  // Add to cart function
  const addToCart = (product) => {
    if (!product.inStock) {
      toast.error("Sorry, this item is currently out of stock");
      return;
    }

    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + 1 } 
          : item
      ));
      toast.info(`Increased ${product.name} quantity in your cart`);
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
      toast.success(`Added ${product.name} to your cart!`);
    }
  };

  // Toggle wishlist function
  const toggleWishlist = (product) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  // Remove from cart function
  const removeFromCart = (productId) => {
    const updatedCart = cart.filter(item => item.id !== productId);
    setCart(updatedCart);
    toast.error("Item removed from cart");
  };

  // Update quantity function
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    
    setCart(cart.map(item => 
      item.id === productId 
        ? { ...item, quantity: newQuantity } 
        : item
    ));
  };

  // Calculate cart total
  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const shippingCost = 5.99;
  const taxAmount = cartTotal * 0.08;
  const orderTotal = cartTotal + shippingCost + taxAmount;

  // Handle checkout
  const handleCheckout = () => {
    navigate('/checkout', { state: { cart, cartTotal, shippingCost, taxAmount, orderTotal } });
    setIsCartOpen(false);
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
                placeholder="Search accessories..."
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
              
              <button 
                onClick={() => setShowNotifications(!showNotifications)} 
                className="hidden items-center gap-1 text-sm hover:text-primary md:flex relative"
              >
                <ApperIcon name="Bell" className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">{unreadCount}</span>
                )}
              </button>
              
              <button 
                onClick={() => setIsCartOpen(true)}
                className="flex items-center gap-1 text-sm hover:text-primary"
              >
                <ApperIcon name="ShoppingCart" className="h-5 w-5" />
                <span className="rounded-full bg-primary px-2 py-0.5 text-xs text-white">{cart.length}</span>
              </button>
            </div>
          </div>
          
          {/* Navigation */}
          <nav className="mt-4 hidden overflow-x-auto md:block">
            <ul className="flex space-x-8">
              <li><Link to="/" className="py-2 text-sm font-medium hover:text-primary">Home</Link></li>
              <li><Link to="/women" className="py-2 text-sm font-medium hover:text-primary">Women</Link></li>
              <li><Link to="/men" className="py-2 text-sm font-medium hover:text-primary">Men</Link></li>
              <li><span className="py-2 text-sm font-medium text-primary border-b-2 border-primary">Accessories</span></li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Notifications Panel */}
      {showNotifications && <NotificationsPanel isOpen={showNotifications} onClose={() => setShowNotifications(false)} />}

      {/* Mobile Nav and Cart Toggle */}
      <div className="fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 transform items-center gap-2 md:hidden">
        <motion.button
          onClick={() => setIsCartOpen(true)}
          className="flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-white shadow-lg"
          whileTap={{ scale: 0.95 }}
        >
          <ApperIcon name="ShoppingCart" className="h-5 w-5" />
          <span className="font-medium">{cart.length}</span>
        </motion.button>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <motion.h1 
            className="text-3xl font-bold text-surface-900 dark:text-white md:text-4xl"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Accessories Collection
          </motion.h1>
          <p className="mt-2 text-surface-600 dark:text-surface-300">
            Complete your look with our premium accessories
          </p>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-5">
          {/* Filters Sidebar */}
          <div className="sticky top-4 hidden h-fit flex-col gap-4 md:flex md:col-span-1">
            <div className="card space-y-4">
              <h3 className="text-lg font-semibold">Filters</h3>
              
              {/* Category Filter */}
              <div className="space-y-2">
                <h4 className="font-medium">Category</h4>
                <div className="flex flex-wrap gap-2">
                  {categories.map(category => (
                    <button
                      key={category}
                      onClick={() => setActiveCategory(category)}
                      className={`rounded-full px-3 py-1 text-sm transition-colors ${
                        activeCategory === category
                          ? 'bg-primary text-white'
                          : 'bg-surface-100 text-surface-800 hover:bg-surface-200 dark:bg-surface-800 dark:text-surface-100 dark:hover:bg-surface-700'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Brand Filter */}
              <div className="space-y-2">
                <h4 className="font-medium">Brand</h4>
                <div className="max-h-32 overflow-y-auto">
                  <div className="flex flex-wrap gap-2">
                    {brands.map(brand => (
                      <button
                        key={brand}
                        onClick={() => setActiveBrand(brand)}
                        className={`rounded-full px-3 py-1 text-sm transition-colors ${
                          activeBrand === brand
                            ? 'bg-primary text-white'
                            : 'bg-surface-100 text-surface-800 hover:bg-surface-200 dark:bg-surface-800 dark:text-surface-100 dark:hover:bg-surface-700'
                        }`}
                      >
                        {brand}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Price Range Filter */}
              <div className="space-y-3">
                <h4 className="font-medium">Price Range</h4>
                <div className="flex justify-between">
                  <span>${pricerange[0]}</span>
                  <span>${pricerange[1]}</span>
                </div>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max="300"
                    step="10"
                    value={pricerange[0]}
                    onChange={(e) => setPricerange([parseInt(e.target.value), pricerange[1]])}
                    className="w-full accent-primary"
                  />
                  <input
                    type="range"
                    min="0"
                    max="300"
                    step="10"
                    value={pricerange[1]}
                    onChange={(e) => setPricerange([pricerange[0], parseInt(e.target.value)])}
                    className="w-full accent-primary"
                  />
                </div>
              </div>
              
              {/* In Stock Filter */}
              <div className="flex items-center">
                <input
                  id="instock"
                  type="checkbox"
                  checked={showInStock}
                  onChange={() => setShowInStock(!showInStock)}
                  className="h-4 w-4 rounded border-surface-300 accent-primary"
                />
                <label htmlFor="instock" className="ml-2 text-sm">
                  In Stock Only
                </label>
              </div>
            </div>
            
            {/* Cart Preview */}
            <div className="card">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Your Cart</h3>
                <span className="rounded-full bg-primary px-2 py-0.5 text-xs text-white">
                  {cart.length}
                </span>
              </div>
              
              {cart.length > 0 ? (
                <div className="mt-2 space-y-2">
                  {cart.slice(0, 2).map(item => (
                    <div key={item.id} className="flex items-center justify-between text-sm">
                      <span className="truncate">{item.name}</span>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                  {cart.length > 2 && (
                    <div className="text-sm text-surface-500">
                      +{cart.length - 2} more items
                    </div>
                  )}
                  <div className="mt-2 border-t border-surface-200 pt-2 dark:border-surface-700">
                    <div className="flex items-center justify-between font-medium">
                      <span>Total:</span>
                      <span>${cartTotal.toFixed(2)}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => setIsCartOpen(true)}
                    className="btn btn-primary w-full"
                  >
                    View Cart
                  </button>
                </div>
              ) : (
                <div className="mt-2 text-center text-sm text-surface-500">
                  Your cart is empty
                </div>
              )}
            </div>
          </div>

          {/* Product Grid */}
          <div className="md:col-span-3 lg:col-span-4">
            {/* Mobile Filters */}
            <div className="mb-4 flex items-center justify-between gap-4 overflow-x-auto p-2 md:hidden">
              <div className="flex gap-2">
                <select 
                  onChange={(e) => setActiveCategory(e.target.value)}
                  className="rounded-lg border border-surface-200 px-3 py-1 text-sm dark:border-surface-700 dark:bg-surface-800"
                  value={activeCategory}
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                
                <select 
                  onChange={(e) => setActiveBrand(e.target.value)}
                  className="rounded-lg border border-surface-200 px-3 py-1 text-sm dark:border-surface-700 dark:bg-surface-800"
                  value={activeBrand}
                >
                  {brands.map(brand => (
                    <option key={brand} value={brand}>{brand}</option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-center">
                <input
                  id="mobileInstock"
                  type="checkbox"
                  checked={showInStock}
                  onChange={() => setShowInStock(!showInStock)}
                  className="h-4 w-4 rounded border-surface-300 accent-primary"
                />
                <label htmlFor="mobileInstock" className="ml-2 text-sm">
                  In Stock
                </label>
              </div>
            </div>
            
            {/* Results Count */}
            <div className="mb-4">
              <h2 className="text-xl font-semibold md:text-2xl">
                {filteredProducts.length} 
                {filteredProducts.length === 1 ? ' Product' : ' Products'} Found
              </h2>
            </div>
            
            {/* Products Grid */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredProducts.map(product => (
                  <motion.div 
                    key={product.id}
                    className="card group overflow-hidden transition-all hover:shadow-lg"
                    whileHover={{ y: -5 }}
                  >
                    {/* Product Image */}
                    <div className="relative aspect-square overflow-hidden rounded-lg bg-surface-100 dark:bg-surface-800">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      
                      {!product.inStock && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                          <span className="rounded-full bg-white px-3 py-1 text-sm font-medium text-red-500">
                            Out of Stock
                          </span>
                        </div>
                      )}
                      
                      {/* Quick view button */}
                      <button
                        onClick={() => setSelectedProduct(product)}
                        className="absolute bottom-2 left-2 rounded-full bg-white/90 p-2 text-surface-800 opacity-0 transition-opacity group-hover:opacity-100 dark:bg-surface-800/90 dark:text-white"
                      >
                        <ApperIcon name="Eye" className="h-4 w-4" />
                      </button>

                      {/* Wishlist button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWishlist(product);
                        }}
                        className="absolute bottom-2 left-10 rounded-full bg-white/90 p-2 text-surface-800 opacity-0 transition-opacity group-hover:opacity-100 dark:bg-surface-800/90 dark:text-white"
                      >
                        <ApperIcon name={isInWishlist(product.id) ? "HeartOff" : "Heart"} className={`h-4 w-4 ${isInWishlist(product.id) ? "text-red-500" : ""}`} />
                      </button>
                      
                      {/* Quick add button */}
                      {product.inStock && (
                        <button
                          onClick={() => addToCart(product)}
                          className="absolute bottom-2 right-2 rounded-full bg-primary p-2 text-white opacity-0 transition-opacity group-hover:opacity-100"
                          aria-label="Add to cart"
                        >
                          <ApperIcon name="Plus" className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                    
                    {/* Product Info */}
                    <div className="mt-3 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-surface-500">{product.brand}</span>
                        <div className="flex items-center gap-0.5">
                          <ApperIcon name="Star" className="h-3 w-3 fill-amber-400 text-amber-400" />
                          <span className="text-xs">{product.rating}</span>
                        </div>
                      </div>
                      
                      <h3 className="font-medium">{product.name}</h3>
                      
                      <div className="flex items-center justify-between">
                        <span className="font-semibold">${product.price.toFixed(2)}</span>
                        
                        {/* Category tag */}
                        <span className="rounded-full bg-surface-100 px-2 py-0.5 text-xs dark:bg-surface-800">
                          {product.category}
                        </span>
                      </div>
                      
                      {/* Size options if available */}
                      {product.sizes && product.sizes.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-1">
                          {product.sizes.slice(0, 5).map(size => (
                            <span key={size} className="rounded-md border border-surface-200 px-1.5 py-0.5 text-xs dark:border-surface-700">
                              {size}
                            </span>
                          ))}
                          {product.sizes.length > 5 && (
                            <span className="rounded-md border border-surface-200 px-1.5 py-0.5 text-xs dark:border-surface-700">
                              +{product.sizes.length - 5}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="flex h-40 flex-col items-center justify-center rounded-lg border border-dashed border-surface-300 text-center dark:border-surface-700">
                <ApperIcon name="SearchX" className="mb-2 h-8 w-8 text-surface-400" />
                <h3 className="text-lg font-medium">No accessories found</h3>
                <p className="text-sm text-surface-500">Try adjusting your filters or search terms</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Product Quick View Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative max-h-[90vh] w-full max-w-3xl overflow-auto rounded-xl bg-white p-6 shadow-xl dark:bg-surface-800"
          >
            <button 
              onClick={() => setSelectedProduct(null)}
              className="absolute right-4 top-4 rounded-full p-1 text-surface-500 hover:bg-surface-100 hover:text-surface-800 dark:hover:bg-surface-700 dark:hover:text-surface-100"
            >
              <ApperIcon name="X" className="h-5 w-5" />
            </button>
            
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="overflow-hidden rounded-lg bg-surface-100 dark:bg-surface-800">
                <img 
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="h-full w-full object-cover"
                />
              </div>
              
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-surface-100 px-2 py-0.5 text-xs font-medium dark:bg-surface-700">
                      {selectedProduct.category}
                    </span>
                    <span className="text-sm text-surface-500">{selectedProduct.brand}</span>
                  </div>
                  <h2 className="mt-1 text-xl font-semibold md:text-2xl">{selectedProduct.name}</h2>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    <ApperIcon name="Star" className="h-4 w-4 fill-amber-400 text-amber-400" />
                    <span className="ml-1 font-medium">{selectedProduct.rating}</span>
                  </div>
                  <span className="text-sm text-surface-500">Based on customer reviews</span>
                </div>
                
                <div>
                  <span className="text-2xl font-bold">${selectedProduct.price.toFixed(2)}</span>
                  {selectedProduct.inStock ? (
                    <span className="ml-2 text-sm text-green-600">In Stock</span>
                  ) : (
                    <span className="ml-2 text-sm text-red-500">Out of Stock</span>
                  )}
                </div>
                
                <p className="text-surface-600 dark:text-surface-300">
                  {selectedProduct.description}
                </p>
                
                {selectedProduct.sizes && selectedProduct.sizes.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="font-medium">Available Options</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedProduct.sizes.map(size => (
                        <button 
                          key={size}
                          className="rounded-md border border-surface-200 px-3 py-1 hover:border-primary hover:bg-primary/5 dark:border-surface-700"
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => {
                      addToCart(selectedProduct);
                      setSelectedProduct(null);
                    }}
                    disabled={!selectedProduct.inStock}
                    className="btn btn-primary flex-1 disabled:bg-surface-300 dark:disabled:bg-surface-700"
                  >
                    <ApperIcon name="ShoppingCart" className="mr-2 h-4 w-4" />
                    Add to Cart
                  </button>
                  
                  <button 
                    onClick={() => toggleWishlist(selectedProduct)}
                    className="btn btn-outline"
                  >
                    <ApperIcon 
                      name={isInWishlist(selectedProduct.id) ? "HeartOff" : "Heart"} 
                      className={`h-4 w-4 ${isInWishlist(selectedProduct.id) ? "text-red-500" : ""}`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Shopping Cart Sidebar */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/50">
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="h-full w-full max-w-md overflow-auto bg-white p-6 shadow-xl dark:bg-surface-900"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Your Shopping Cart</h2>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="rounded-full p-1 text-surface-500 hover:bg-surface-100 hover:text-surface-800 dark:hover:bg-surface-800 dark:hover:text-surface-100"
              >
                <ApperIcon name="X" className="h-5 w-5" />
              </button>
            </div>
            
            {cart.length > 0 ? (
              <>
                <div className="mt-6 space-y-4">
                  {cart.map(item => (
                    <div key={item.id} className="flex gap-4 rounded-lg border border-surface-200 p-3 dark:border-surface-700">
                      <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md bg-surface-100 dark:bg-surface-800">
                        <img 
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      
                      <div className="flex flex-1 flex-col">
                        <div className="flex justify-between">
                          <h3 className="font-medium">{item.name}</h3>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-surface-400 hover:text-red-500"
                          >
                            <ApperIcon name="Trash2" className="h-4 w-4" />
                          </button>
                        </div>
                        
                        <span className="text-sm text-surface-500">{item.brand}</span>
                        
                        <div className="mt-auto flex items-center justify-between">
                          <div className="flex items-center rounded-lg border border-surface-200 dark:border-surface-700">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="px-2 py-1 text-surface-500 hover:text-surface-800 dark:hover:text-white"
                            >
                              <ApperIcon name="Minus" className="h-3 w-3" />
                            </button>
                            <span className="w-8 text-center text-sm">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="px-2 py-1 text-surface-500 hover:text-surface-800 dark:hover:text-white"
                            >
                              <ApperIcon name="Plus" className="h-3 w-3" />
                            </button>
                          </div>
                          
                          <span className="font-medium">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 space-y-2 border-t border-surface-200 pt-4 dark:border-surface-700">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>${shippingCost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>${taxAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between border-t border-surface-200 pt-2 text-lg font-bold dark:border-surface-700">
                    <span>Total</span>
                    <span>${orderTotal.toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="mt-6">
                  <button 
                    className="btn btn-primary w-full"
                    onClick={handleCheckout}
                  >
                    Proceed to Checkout
                  </button>
                  <button 
                    className="mt-2 w-full text-center text-sm text-surface-500 hover:text-surface-800 dark:hover:text-white"
                    onClick={() => setIsCartOpen(false)}
                  >
                    Continue Shopping
                  </button>
                </div>
              </>
            ) : (
              <div className="flex h-60 flex-col items-center justify-center">
                <div className="rounded-full bg-surface-100 p-4 dark:bg-surface-800">
                  <ApperIcon name="ShoppingCart" className="h-8 w-8 text-surface-400" />
                </div>
                <h3 className="mt-4 text-lg font-medium">Your cart is empty</h3>
                <p className="mt-1 text-sm text-surface-500">Looks like you haven't added any accessories yet</p>
                <button 
                  onClick={() => setIsCartOpen(false)} 
                  className="btn btn-primary mt-4"
                >
                  Start Shopping
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Accessories;