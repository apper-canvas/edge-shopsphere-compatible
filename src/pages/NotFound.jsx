import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ApperIcon from '../components/ApperIcon';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-surface-50 px-4 text-center dark:bg-surface-900">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-full bg-primary/10 text-primary dark:bg-primary/20">
          <ApperIcon name="FileQuestion" className="h-16 w-16" />
        </div>
        
        <h1 className="mt-6 text-4xl font-bold tracking-tight text-surface-900 dark:text-white">
          Page Not Found
        </h1>
        
        <p className="mt-4 text-lg text-surface-600 dark:text-surface-300">
          Sorry, we couldn't find the page you're looking for. It might have been moved or doesn't exist.
        </p>
        
        <div className="mt-8 flex flex-col space-y-3 sm:flex-row sm:space-x-3 sm:space-y-0">
          <motion.button
            onClick={() => navigate('/')}
            className="flex items-center justify-center rounded-lg bg-primary px-6 py-3 font-medium text-white shadow-md hover:bg-primary-dark"
            whileTap={{ scale: 0.95 }}
          >
            <ApperIcon name="Home" className="mr-2 h-5 w-5" />
            Go to Homepage
          </motion.button>
          
          <motion.button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center rounded-lg border border-surface-300 bg-white px-6 py-3 font-medium text-surface-800 shadow-sm hover:bg-surface-50 dark:border-surface-700 dark:bg-surface-800 dark:text-white dark:hover:bg-surface-700"
            whileTap={{ scale: 0.95 }}
          >
            <ApperIcon name="ArrowLeft" className="mr-2 h-5 w-5" />
            Go Back
          </motion.button>
        </div>
        
        <div className="mt-12 flex justify-center space-x-6 text-surface-500">
          <a href="#" className="flex items-center hover:text-primary">
            <ApperIcon name="LifeBuoy" className="mr-2 h-5 w-5" />
            Help
          </a>
          <a href="#" className="flex items-center hover:text-primary">
            <ApperIcon name="Mail" className="mr-2 h-5 w-5" />
            Contact Us
          </a>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;