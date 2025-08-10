import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

const buttonVariants = {
  default: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500',
  primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500',
  secondary: 'bg-white dark:bg-dark-800 text-gray-900 dark:text-white border border-gray-300 dark:border-dark-600 hover:bg-gray-50 dark:hover:bg-dark-700 focus:ring-primary-500',
  outline: 'bg-white dark:bg-dark-800 text-gray-900 dark:text-white border border-gray-300 dark:border-dark-600 hover:bg-gray-50 dark:hover:bg-dark-700 focus:ring-primary-500',
  success: 'bg-success-600 text-white hover:bg-success-700 focus:ring-success-500',
  danger: 'bg-danger-600 text-white hover:bg-danger-700 focus:ring-danger-500',
  warning: 'bg-warning-600 text-white hover:bg-warning-700 focus:ring-warning-500',
  ghost: 'text-gray-700 dark:text-dark-300 hover:bg-gray-100 dark:hover:bg-dark-700 focus:ring-primary-500',
  link: 'text-primary-600 dark:text-primary-400 underline-offset-4 hover:underline focus:ring-primary-500',
};

const sizeVariants = {
  sm: 'px-3 py-1.5 text-xs',
  default: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
  xl: 'px-8 py-4 text-lg',
};

export const Button = React.forwardRef(({
  className,
  variant = 'default',
  size = 'default',
  disabled = false,
  loading = false,
  children,
  ...props
}, ref) => {
  return (
    <motion.button
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center rounded-md font-medium transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-dark-800',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'shadow-sm hover:shadow-md',
        buttonVariants[variant],
        sizeVariants[size],
        className
      )}
      disabled={disabled || loading}
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      {...props}
    >
      {loading && (
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
      )}
      {children}
    </motion.button>
  );
});

Button.displayName = 'Button';