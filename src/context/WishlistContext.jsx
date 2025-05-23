import { createContext, useState, useContext, useEffect } from 'react';
import { toast } from 'react-toastify';

// Create context
const WishlistContext = createContext();

// Create provider component
export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);

  // Load wishlist from localStorage on initial render
  useEffect(() => {
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedWishlist) {
      setWishlistItems(JSON.parse(savedWishlist));
    }
  }, []);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  // Add product to wishlist
  const addToWishlist = (product) => {
    if (isInWishlist(product.id)) {
      toast.info(`${product.name} is already in your wishlist`);
      return;
    }
    
    setWishlistItems([...wishlistItems, product]);
    toast.success(`Added ${product.name} to your wishlist!`);
  };

  // Remove product from wishlist
  const removeFromWishlist = (productId) => {
    const updatedWishlist = wishlistItems.filter(item => item.id !== productId);
    setWishlistItems(updatedWishlist);
    toast.error("Item removed from wishlist");
  };

  // Check if product is in wishlist
  const isInWishlist = (productId) => {
    return wishlistItems.some(item => item.id === productId);
  };

  // Clear entire wishlist
  const clearWishlist = () => {
    setWishlistItems([]);
    toast.info("Wishlist has been cleared");
  };

  return (
    <WishlistContext.Provider value={{ wishlistItems, addToWishlist, removeFromWishlist, isInWishlist, clearWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

// Custom hook to use the wishlist context
export const useWishlist = () => {
  return useContext(WishlistContext);
};