import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';
import { useWishlist } from '../context/WishlistContext';

const Wishlist = () => {
  const { wishlistItems, removeFromWishlist, clearWishlist } = useWishlist();
  const [cart, setCart] = useState([]);

  // Add to cart function
  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      // Increase quantity if already in cart
      setCart(cart.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + 1 } 
          : item
      ));
      toast.info(`Increased ${product.name} quantity in your cart`);
    } else {
      // Add new item
      setCart([...cart, { ...product, quantity: 1 }]);
      toast.success(`Added ${product.name} to your cart!`);
    }
  };

  // Move all items to cart
  const moveAllToCart = () => {
    if (wishlistItems.length === 0) {
      toast.info("Your wishlist is empty");
      return;
    }

    // Add all wishlist items to cart
    wishlistItems.forEach(item => {
      addToCart(item);
    });
    
    toast.success("All items moved to cart");
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
            
            {/* Nav Links */}
            <div className="flex items-center gap-6">
              <Link to="/" className="text-sm hover:text-primary">Home</Link>
              <Link to="/women" className="text-sm hover:text-primary">Women</Link>
              <Link to="/wishlist" className="text-sm font-medium text-primary">Wishlist</Link>
            </div>
          </div>
        </div>
      </header>

      {/* Wishlist Content */}
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <motion.div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between" {...fadeIn}>
          <div>
            <h1 className="text-2xl font-bold md:text-3xl">My Wishlist</h1>
            <p className="mt-1 text-surface-500">
              {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved for later
            </p>
          </div>
          
          <div className="mt-4 flex flex-wrap gap-3 md:mt-0">
            <button 
              onClick={moveAllToCart}
              disabled={wishlistItems.length === 0}
              className="btn btn-primary flex items-center disabled:opacity-50"
            >
              <ApperIcon name="ShoppingCart" className="mr-2 h-4 w-4" />
              Move All to Cart
            </button>
            
            <button 
              onClick={clearWishlist}
              disabled={wishlistItems.length === 0}
              className="btn btn-outline flex items-center disabled:opacity-50"
            >
              <ApperIcon name="Trash2" className="mr-2 h-4 w-4" />
              Clear Wishlist
            </button>
          </div>
        </motion.div>

        {wishlistItems.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {wishlistItems.map(product => (
              <motion.div 
                key={product.id}
                className="card group overflow-hidden transition-all hover:shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                whileHover={{ y: -5 }}
              >
                <div className="relative aspect-square overflow-hidden rounded-lg bg-surface-100 dark:bg-surface-800">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute right-0 top-0 m-2 flex gap-2">
                    <button onClick={() => removeFromWishlist(product.id)} className="rounded-full bg-white/90 p-2 text-red-500 shadow-md">
                      <ApperIcon name="Trash2" className="h-4 w-4" />
                    </button>
                    <button onClick={() => addToCart(product)} className="rounded-full bg-primary p-2 text-white shadow-md">
                      <ApperIcon name="ShoppingCart" className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="mt-3 space-y-1">
                  <h3 className="font-medium">{product.name}</h3>
                  <p className="font-semibold">${product.price.toFixed(2)}</p>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div className="flex h-60 flex-col items-center justify-center rounded-lg border border-dashed border-surface-300 text-center dark:border-surface-700" {...fadeIn}>
            <ApperIcon name="Heart" className="mb-3 h-12 w-12 text-surface-300 dark:text-surface-700" />
            <h2 className="text-xl font-medium">Your wishlist is empty</h2>
            <p className="mt-1 text-sm text-surface-500">Items added to your wishlist will appear here</p>
            <Link to="/" className="btn btn-primary mt-4">Browse Products</Link>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;