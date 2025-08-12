import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

const buttonVariants = {
  // Professional sports operator button variants
  primary: [
    'bg-primary-500 text-white border border-primary-600',
    'hover:bg-primary-600 active:bg-primary-700',
    'focus:ring-2 focus:ring-primary-500/20'
  ].join(' '),
  
  secondary: [
    'bg-slate-100 text-slate-900 border border-stone-200',
    'hover:bg-slate-200 active:bg-slate-300',
  'dark:bg-slate-800 dark:text-slate-100 dark:border-stone-600',
  'dark:hover:bg-slate-700 dark:active:bg-slate-600',
    'focus:ring-2 focus:ring-primary-500/20'
  ].join(' '),
  
  subtle: [
    'bg-transparent text-slate-700 border border-transparent',
    'hover:bg-slate-100 active:bg-slate-200',
  'dark:text-slate-300',
  'dark:hover:bg-slate-800 dark:active:bg-slate-700',
    'focus:ring-2 focus:ring-primary-500/20'
  ].join(' '),
  
  destructive: [
    'bg-danger-500 text-white border border-danger-600',
    'hover:bg-danger-600 active:bg-danger-700',
    'focus:ring-2 focus:ring-danger-500/20'
  ].join(' '),
  
  ghost: [
    'bg-transparent text-slate-600 border border-transparent',
    'hover:bg-slate-100 hover:text-slate-900',
  'dark:text-slate-400',
  'dark:hover:bg-slate-800 dark:hover:text-slate-100',
    'focus:ring-2 focus:ring-primary-500/20'
  ].join(' '),
  
  success: [
    'bg-success-600 text-white border border-success-600',
    'hover:bg-success-700 active:bg-success-800',
    'focus:ring-2 focus:ring-success-500/20'
  ].join(' '),
  
  warning: [
    'bg-warning-500 text-white border border-warning-600',
    'hover:bg-warning-600 active:bg-warning-700',
    'focus:ring-2 focus:ring-warning-500/20'
  ].join(' '),
  
  // For backward compatibility
  default: [
    'bg-primary-500 text-white border border-primary-600',
    'hover:bg-primary-600 active:bg-primary-700',
    'focus:ring-2 focus:ring-primary-500/20'
  ].join(' '),
  
  outline: [
    'bg-slate-100 text-slate-900 border border-stone-200',
    'hover:bg-slate-200 active:bg-slate-300',
  'dark:bg-slate-800 dark:text-slate-100 dark:border-stone-600',
  'dark:hover:bg-slate-700 dark:active:bg-slate-600',
    'focus:ring-2 focus:ring-primary-500/20'
  ].join(' '),
};

const sizeVariants = {
  sm: 'px-3 py-1.5 text-xs rounded-md',
  default: 'px-4 py-2 text-sm rounded-lg', // Default to medium
  md: 'px-4 py-2 text-sm rounded-lg',
  lg: 'px-6 py-3 text-base rounded-lg',
  xl: 'px-8 py-4 text-lg rounded-lg',
};

export const Button = React.forwardRef(({
  className,
  variant = 'primary', // Changed default to primary for professional look
  size = 'md',
  disabled = false,
  loading = false,
  leftIcon = null,
  rightIcon = null,
  children,
  ...props
}, ref) => {
  const baseClasses = [
    // Core button structure
    'inline-flex items-center justify-center gap-2',
    'font-subheading tracking-tight transition-all duration-200',
    'focus:outline-none focus:ring-offset-2',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    'shadow-subtle hover:shadow-elevation active:scale-[0.98]',
    // Theme-aware focus ring offset
  'focus:ring-offset-slate-50 dark:focus:ring-offset-slate-950'
  ].join(' ');

  return (
    <motion.button
      ref={ref}
      className={cn(
        baseClasses,
        buttonVariants[variant],
        sizeVariants[size],
        className
      )}
      disabled={disabled || loading}
      whileHover={{ scale: disabled || loading ? 1 : 1.01 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      transition={{ duration: 0.15, ease: 'easeOut' }}
      {...props}
    >
      {/* Left icon or loading spinner */}
      {loading ? (
        <div 
          className="animate-spin rounded-full h-4 w-4 border-2 border-current border-r-transparent" 
          aria-hidden="true"
        />
      ) : leftIcon && (
        <span className="w-4 h-4 flex-shrink-0" aria-hidden="true">
          {leftIcon}
        </span>
      )}
      
      {/* Button content */}
      <span className={loading ? 'opacity-70' : ''}>
        {children}
      </span>
      
      {/* Right icon */}
      {rightIcon && !loading && (
        <span className="w-4 h-4 flex-shrink-0" aria-hidden="true">
          {rightIcon}
        </span>
      )}
    </motion.button>
  );
});

Button.displayName = 'Button';