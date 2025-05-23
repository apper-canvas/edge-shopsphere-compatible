import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [step, setStep] = useState(1);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState('');
  
  // Get cart data from location state or redirect if no data
  const { cart = [], cartTotal = 0, shippingCost = 5.99, taxAmount = 0, orderTotal = 0 } = location.state || {};
  
  // Check if cart is empty and redirect if needed
  useEffect(() => {
    if (!location.state || cart.length === 0) {
      toast.error("Your cart is empty. Please add items before checkout.");
      navigate('/');
    }
  }, [cart, location.state, navigate]);

  // Initialize form data
  const [formData, setFormData] = useState({
    // Shipping Info
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    // Payment Info
    paymentMethod: 'credit',
    cardName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    savePaymentInfo: false
  });

  // Form validation
  const [errors, setErrors] = useState({});
  
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // Clear error when field is updated
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  // Validate form fields based on current step
  const validateForm = () => {
    const newErrors = {};
    
    if (step === 1) {
      // Validate shipping info
      if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
      if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Email is invalid';
      }
      if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
      if (!formData.address.trim()) newErrors.address = 'Address is required';
      if (!formData.city.trim()) newErrors.city = 'City is required';
      if (!formData.state.trim()) newErrors.state = 'State is required';
      if (!formData.zipCode.trim()) newErrors.zipCode = 'ZIP code is required';
    } else if (step === 2) {
      // Validate payment info
      if (formData.paymentMethod === 'credit') {
        if (!formData.cardName.trim()) newErrors.cardName = 'Name on card is required';
        if (!formData.cardNumber.trim()) {
          newErrors.cardNumber = 'Card number is required';
        } else if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, ''))) {
          newErrors.cardNumber = 'Card number must be 16 digits';
        }
        if (!formData.expiryDate.trim()) {
          newErrors.expiryDate = 'Expiry date is required';
        } else if (!/^\d{2}\/\d{2}$/.test(formData.expiryDate)) {
          newErrors.expiryDate = 'Use MM/YY format';
        }
        if (!formData.cvv.trim()) {
          newErrors.cvv = 'CVV is required';
        } else if (!/^\d{3,4}$/.test(formData.cvv)) {
          newErrors.cvv = 'CVV must be 3-4 digits';
        }
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle step navigation
  const handleNext = () => {
    if (validateForm()) {
      setStep(step + 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePrevious = () => {
    setStep(step - 1);
    window.scrollTo(0, 0);
  };

  // Handle order placement
  const placeOrder = () => {
    // In a real app, you would send order data to your backend
    const generatedOrderId = 'ORD-' + Math.floor(100000 + Math.random() * 900000);
    setOrderId(generatedOrderId);
    setOrderPlaced(true);
    
    // Show success toast
    toast.success("Order placed successfully!");
    
    // In a real application, you would clear the cart here
    // For demo purposes, we'll just show the confirmation
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 100);
  };

  // Handle "Continue Shopping" after order placed
  const continueShopping = () => {
    navigate('/');
  };

  // Generate steps display
  const renderStepIndicator = () => (
    <div className="mb-8 flex justify-center">
      <div className="flex w-full max-w-md items-center">
        <div className={`flex-1 border-b-2 ${step >= 1 ? 'border-primary' : 'border-surface-300 dark:border-surface-700'}`}>
          <div className="flex flex-col items-center">
            <div className={`flex h-8 w-8 items-center justify-center rounded-full ${
              step >= 1 ? 'bg-primary text-white' : 'bg-surface-200 text-surface-600 dark:bg-surface-700 dark:text-surface-300'
            }`}>
              {step > 1 ? <ApperIcon name="Check" className="h-4 w-4" /> : "1"}
            </div>
            <span className="mt-1 text-xs font-medium">Shipping</span>
          </div>
        </div>
        
        <div className={`flex-1 border-b-2 ${step >= 2 ? 'border-primary' : 'border-surface-300 dark:border-surface-700'}`}>
          <div className="flex flex-col items-center">
            <div className={`flex h-8 w-8 items-center justify-center rounded-full ${
              step >= 2 ? 'bg-primary text-white' : 'bg-surface-200 text-surface-600 dark:bg-surface-700 dark:text-surface-300'
            }`}>
              {step > 2 ? <ApperIcon name="Check" className="h-4 w-4" /> : "2"}
            </div>
            <span className="mt-1 text-xs font-medium">Payment</span>
          </div>
        </div>
        
        <div className="flex-1">
          <div className="flex flex-col items-center">
            <div className={`flex h-8 w-8 items-center justify-center rounded-full ${
              step >= 3 ? 'bg-primary text-white' : 'bg-surface-200 text-surface-600 dark:bg-surface-700 dark:text-surface-300'
            }`}>
              {orderPlaced ? <ApperIcon name="Check" className="h-4 w-4" /> : "3"}
            </div>
            <span className="mt-1 text-xs font-medium">Review</span>
          </div>
        </div>
      </div>
    </div>
  );

  // Render order confirmation screen
  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-surface-50 py-12 dark:bg-surface-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto max-w-3xl"
          >
            <div className="rounded-2xl bg-white p-8 shadow-card dark:bg-surface-800">
              <div className="mb-6 flex flex-col items-center justify-center text-center">
                <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                  <ApperIcon name="CheckCircle" className="h-10 w-10 text-green-600 dark:text-green-400" />
                </div>
                <h1 className="text-2xl font-bold sm:text-3xl">Order Confirmed!</h1>
                <p className="mt-2 text-surface-600 dark:text-surface-300">
                  Thank you for your purchase. Your order has been received.
                </p>
              </div>
              
              <div className="mb-6 rounded-lg bg-surface-50 p-4 dark:bg-surface-900">
                <div className="flex flex-wrap justify-between gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-surface-500">Order Number</h4>
                    <p className="font-medium">{orderId}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-surface-500">Date</h4>
                    <p className="font-medium">{new Date().toLocaleDateString()}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-surface-500">Total</h4>
                    <p className="font-medium">${orderTotal.toFixed(2)}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-surface-500">Payment Method</h4>
                    <p className="font-medium">
                      {formData.paymentMethod === 'credit' ? 'Credit Card' : 'PayPal'}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="mb-4 text-lg font-medium">Order Summary</h3>
                <div className="space-y-3">
                  {cart.map(item => (
                    <div key={item.id} className="flex items-center gap-4">
                      <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md bg-surface-100 dark:bg-surface-800">
                        <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{item.name}</h4>
                        <div className="flex justify-between">
                          <span className="text-sm text-surface-500">Qty: {item.quantity}</span>
                          <span>${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mt-8 flex justify-center">
                <button 
                  onClick={continueShopping}
                  className="btn btn-primary min-w-[200px]"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-50 py-12 dark:bg-surface-900">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8">
            <h1 className="text-center text-2xl font-bold sm:text-3xl">Checkout</h1>
          </div>
          
          {/* Steps indicator */}
          {renderStepIndicator()}
          
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Form Section */}
            <div className="lg:col-span-2">
              <div className="rounded-2xl bg-white p-6 shadow-card dark:bg-surface-800">
                {step === 1 && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                  >
                    <h2 className="text-xl font-semibold">Shipping Information</h2>
                    
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label htmlFor="firstName" className="mb-1 block text-sm font-medium">First Name *</label>
                        <input
                          type="text"
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          className={`input ${errors.firstName ? 'border-red-500' : ''}`}
                        />
                        {errors.firstName && <p className="mt-1 text-xs text-red-500">{errors.firstName}</p>}
                      </div>
                      
                      <div>
                        <label htmlFor="lastName" className="mb-1 block text-sm font-medium">Last Name *</label>
                        <input
                          type="text"
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          className={`input ${errors.lastName ? 'border-red-500' : ''}`}
                        />
                        {errors.lastName && <p className="mt-1 text-xs text-red-500">{errors.lastName}</p>}
                      </div>
                      
                      <div>
                        <label htmlFor="email" className="mb-1 block text-sm font-medium">Email *</label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className={`input ${errors.email ? 'border-red-500' : ''}`}
                        />
                        {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                      </div>
                      
                      <div>
                        <label htmlFor="phone" className="mb-1 block text-sm font-medium">Phone *</label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className={`input ${errors.phone ? 'border-red-500' : ''}`}
                        />
                        {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
                      </div>
                      
                      <div className="sm:col-span-2">
                        <label htmlFor="address" className="mb-1 block text-sm font-medium">Address *</label>
                        <input
                          type="text"
                          id="address"
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          className={`input ${errors.address ? 'border-red-500' : ''}`}
                        />
                        {errors.address && <p className="mt-1 text-xs text-red-500">{errors.address}</p>}
                      </div>
                      
                      <div>
                        <label htmlFor="city" className="mb-1 block text-sm font-medium">City *</label>
                        <input
                          type="text"
                          id="city"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          className={`input ${errors.city ? 'border-red-500' : ''}`}
                        />
                        {errors.city && <p className="mt-1 text-xs text-red-500">{errors.city}</p>}
                      </div>
                      
                      <div>
                        <label htmlFor="state" className="mb-1 block text-sm font-medium">State *</label>
                        <input
                          type="text"
                          id="state"
                          name="state"
                          value={formData.state}
                          onChange={handleChange}
                          className={`input ${errors.state ? 'border-red-500' : ''}`}
                        />
                        {errors.state && <p className="mt-1 text-xs text-red-500">{errors.state}</p>}
                      </div>
                      
                      <div>
                        <label htmlFor="zipCode" className="mb-1 block text-sm font-medium">ZIP Code *</label>
                        <input
                          type="text"
                          id="zipCode"
                          name="zipCode"
                          value={formData.zipCode}
                          onChange={handleChange}
                          className={`input ${errors.zipCode ? 'border-red-500' : ''}`}
                        />
                        {errors.zipCode && <p className="mt-1 text-xs text-red-500">{errors.zipCode}</p>}
                      </div>
                      
                      <div>
                        <label htmlFor="country" className="mb-1 block text-sm font-medium">Country *</label>
                        <select
                          id="country"
                          name="country"
                          value={formData.country}
                          onChange={handleChange}
                          className="input"
                        >
                          <option value="United States">United States</option>
                          <option value="Canada">Canada</option>
                          <option value="United Kingdom">United Kingdom</option>
                          <option value="Australia">Australia</option>
                        </select>
                      </div>
                    </div>
                  </motion.div>
                )}
                
                {step === 2 && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                  >
                    <h2 className="text-xl font-semibold">Payment Method</h2>
                    
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <input
                          type="radio"
                          id="credit"
                          name="paymentMethod"
                          value="credit"
                          checked={formData.paymentMethod === 'credit'}
                          onChange={handleChange}
                          className="h-4 w-4 accent-primary"
                        />
                        <label htmlFor="credit" className="flex items-center gap-2">
                          <span>Credit Card</span>
                          <div className="flex">
                            <ApperIcon name="CreditCard" className="h-5 w-5 text-surface-600" />
                          </div>
                        </label>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <input
                          type="radio"
                          id="paypal"
                          name="paymentMethod"
                          value="paypal"
                          checked={formData.paymentMethod === 'paypal'}
                          onChange={handleChange}
                          className="h-4 w-4 accent-primary"
                        />
                        <label htmlFor="paypal" className="flex items-center gap-2">
                          <span>PayPal</span>
                          <ApperIcon name="Paypal" className="h-5 w-5 text-blue-500" />
                        </label>
                      </div>
                    </div>
                    
                    {formData.paymentMethod === 'credit' && (
                      <div className="mt-4 space-y-4 rounded-lg border border-surface-200 p-4 dark:border-surface-700">
                        <div>
                          <label htmlFor="cardName" className="mb-1 block text-sm font-medium">Name on Card *</label>
                          <input
                            type="text"
                            id="cardName"
                            name="cardName"
                            value={formData.cardName}
                            onChange={handleChange}
                            className={`input ${errors.cardName ? 'border-red-500' : ''}`}
                          />
                          {errors.cardName && <p className="mt-1 text-xs text-red-500">{errors.cardName}</p>}
                        </div>
                        
                        <div>
                          <label htmlFor="cardNumber" className="mb-1 block text-sm font-medium">Card Number *</label>
                          <input
                            type="text"
                            id="cardNumber"
                            name="cardNumber"
                            value={formData.cardNumber}
                            onChange={handleChange}
                            placeholder="XXXX XXXX XXXX XXXX"
                            className={`input ${errors.cardNumber ? 'border-red-500' : ''}`}
                          />
                          {errors.cardNumber && <p className="mt-1 text-xs text-red-500">{errors.cardNumber}</p>}
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="expiryDate" className="mb-1 block text-sm font-medium">Expiry Date *</label>
                            <input
                              type="text"
                              id="expiryDate"
                              name="expiryDate"
                              value={formData.expiryDate}
                              onChange={handleChange}
                              placeholder="MM/YY"
                              className={`input ${errors.expiryDate ? 'border-red-500' : ''}`}
                            />
                            {errors.expiryDate && <p className="mt-1 text-xs text-red-500">{errors.expiryDate}</p>}
                          </div>
                          
                          <div>
                            <label htmlFor="cvv" className="mb-1 block text-sm font-medium">CVV *</label>
                            <input
                              type="text"
                              id="cvv"
                              name="cvv"
                              value={formData.cvv}
                              onChange={handleChange}
                              placeholder="XXX"
                              className={`input ${errors.cvv ? 'border-red-500' : ''}`}
                            />
                            {errors.cvv && <p className="mt-1 text-xs text-red-500">{errors.cvv}</p>}
                          </div>
                        </div>
                        
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="savePaymentInfo"
                            name="savePaymentInfo"
                            checked={formData.savePaymentInfo}
                            onChange={handleChange}
                            className="h-4 w-4 rounded accent-primary"
                          />
                          <label htmlFor="savePaymentInfo" className="ml-2 text-sm">
                            Save payment information for future purchases
                          </label>
                        </div>
                      </div>
                    )}
                    
                    {formData.paymentMethod === 'paypal' && (
                      <div className="mt-4 rounded-lg border border-surface-200 p-4 text-center dark:border-surface-700">
                        <p className="text-sm">
                          You will be redirected to PayPal to complete your payment securely.
                        </p>
                      </div>
                    )}
                  </motion.div>
                )}
                
                {step === 3 && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                  >
                    <h2 className="text-xl font-semibold">Order Review</h2>
                    
                    <div className="space-y-4">
                      <div className="rounded-lg bg-surface-50 p-4 dark:bg-surface-900">
                        <h3 className="mb-2 font-medium">Shipping Information</h3>
                        <div className="grid grid-cols-1 gap-y-1 text-sm sm:grid-cols-2">
                          <div>
                            <span className="text-surface-500">Name:</span> {formData.firstName} {formData.lastName}
                          </div>
                          <div>
                            <span className="text-surface-500">Email:</span> {formData.email}
                          </div>
                          <div>
                            <span className="text-surface-500">Phone:</span> {formData.phone}
                          </div>
                          <div>
                            <span className="text-surface-500">Address:</span> {formData.address}
                          </div>
                          <div>
                            <span className="text-surface-500">City:</span> {formData.city}
                          </div>
                          <div>
                            <span className="text-surface-500">State:</span> {formData.state}
                          </div>
                          <div>
                            <span className="text-surface-500">ZIP Code:</span> {formData.zipCode}
                          </div>
                          <div>
                            <span className="text-surface-500">Country:</span> {formData.country}
                          </div>
                        </div>
                      </div>
                      
                      <div className="rounded-lg bg-surface-50 p-4 dark:bg-surface-900">
                        <h3 className="mb-2 font-medium">Payment Method</h3>
                        <p className="text-sm">
                          {formData.paymentMethod === 'credit' 
                            ? `Credit Card ending in ${formData.cardNumber.slice(-4)}` 
                            : 'PayPal'}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
                
                <div className="mt-8 flex justify-between">
                  {step > 1 && (
                    <button onClick={handlePrevious} className="btn btn-outline">
                      <ApperIcon name="ChevronLeft" className="mr-1 h-4 w-4" />
                      Back
                    </button>
                  )}
                  
                  {step < 3 ? (
                    <button onClick={handleNext} className="btn btn-primary ml-auto">
                      Continue
                      <ApperIcon name="ChevronRight" className="ml-1 h-4 w-4" />
                    </button>
                  ) : (
                    <button onClick={placeOrder} className="btn btn-primary ml-auto">
                      Place Order
                      <ApperIcon name="Check" className="ml-1 h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
            
            {/* Order Summary Section */}
            <div className="lg:col-span-1">
              <div className="rounded-2xl bg-white p-6 shadow-card dark:bg-surface-800">
                <h2 className="mb-4 text-xl font-semibold">Order Summary</h2>
                
                <div className="max-h-[300px] overflow-y-auto space-y-3">
                  {cart.map(item => (
                    <div key={item.id} className="flex items-center gap-3">
                      <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md bg-surface-100 dark:bg-surface-800">
                        <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium">{item.name}</h4>
                        <div className="flex justify-between">
                          <span className="text-xs text-surface-500">Qty: {item.quantity}</span>
                          <span className="text-sm">${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 space-y-2 border-t border-surface-200 pt-4 dark:border-surface-700">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span>${shippingCost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax</span>
                    <span>${taxAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between border-t border-surface-200 pt-2 text-lg font-bold dark:border-surface-700">
                    <span>Total</span>
                    <span>${orderTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;