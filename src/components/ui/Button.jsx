import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn.jsx';

const buttonVariants = {
  default: 'bg-brand-600 text-white hover:bg-brand-700 focus:ring-brand-500',
  primary: 'bg-brand-600 text-white hover:bg-brand-700 focus:ring-brand-500',
  secondary: 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white border border-neutral-300 dark:border-neutral-600 hover:bg-neutral-50 dark:hover:bg-neutral-700 focus:ring-brand-500',
  outline: 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white border border-neutral-300 dark:border-neutral-600 hover:bg-neutral-50 dark:hover:bg-neutral-700 focus:ring-brand-500',
  success: 'bg-success-600 text-white hover:bg-success-700 focus:ring-success-500',
  danger: 'bg-danger-600 text-white hover:bg-danger-700 focus:ring-danger-500',
  destructive: 'bg-danger-600 text-white hover:bg-danger-700 focus:ring-danger-500',
  warning: 'bg-warning-600 text-white hover:bg-warning-700 focus:ring-warning-500',
  ghost: 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 focus:ring-brand-500',
  link: 'text-brand-600 dark:text-brand-400 underline-offset-4 hover:underline focus:ring-brand-500',
};

const sizeVariants = {
  sm: 'px-3 py-1.5 text-xs',
  default: 'px-4 py-2 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
  xl: 'px-8 py-4 text-lg',
};

export const Button = React.forwardRef(({
  className,
  variant = 'default',
  size = 'default',
  disabled = false,
  loading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  children,
  ...props
}, ref) => {
  return (
  <button
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center font-medium transition-colors duration-150',
  'focus:outline-none focus:ring-1 focus:ring-offset-1 dark:focus:ring-offset-neutral-800',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        buttonVariants[variant],
        sizeVariants[size],
        (leftIcon || rightIcon) && 'gap-2',
        fullWidth && 'w-full',
        className
      )}
      disabled={disabled || loading}
      aria-busy={loading ? 'true' : undefined}
      {...props}
    >
      {loading ? (
        <span className="relative inline-flex items-center">
          <span className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
          <span className="sr-only">Loading</span>
        </span>
      ) : (
        <>
          {leftIcon ? <span className="inline-flex items-center">{leftIcon}</span> : null}
          <span className="inline-flex items-center">{children}</span>
          {rightIcon ? <span className="inline-flex items-center">{rightIcon}</span> : null}
        </>
      )}
  </button>
  );
});

Button.displayName = 'Button';