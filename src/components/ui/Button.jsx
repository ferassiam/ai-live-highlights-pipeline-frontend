import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn.jsx';

const buttonVariants = {
  default: 'bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-500 shadow-sm hover:shadow-md',
  primary: 'bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-500 shadow-sm hover:shadow-md',
  secondary: 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 focus:ring-emerald-500 shadow-sm',
  outline: 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 focus:ring-emerald-500 shadow-sm',
  success: 'bg-success-600 text-white hover:bg-success-700 focus:ring-success-500',
  danger: 'bg-danger-600 text-white hover:bg-danger-700 focus:ring-danger-500',
  destructive: 'bg-danger-600 text-white hover:bg-danger-700 focus:ring-danger-500',
  warning: 'bg-warning-600 text-white hover:bg-warning-700 focus:ring-warning-500',
  ghost: 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 focus:ring-emerald-500',
  link: 'text-emerald-600 dark:text-emerald-400 underline-offset-4 hover:underline focus:ring-emerald-500',
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
        'inline-flex items-center justify-center font-medium transition-all duration-200 rounded-md',
  'focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-800',
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