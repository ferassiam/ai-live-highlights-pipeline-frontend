import React from 'react';
import { cn } from '../../utils/cn';

// Supported visual variants
const badgeVariants = {
  default: 'bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300',
  primary: 'bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300',
  secondary: 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200',
  success: 'bg-success-100 text-success-800 dark:bg-success-900/30 dark:text-success-300',
  danger: 'bg-danger-100 text-danger-800 dark:bg-danger-900/30 dark:text-danger-300',
  warning: 'bg-warning-100 text-warning-800 dark:bg-warning-900/30 dark:text-warning-300',
  info: 'bg-info-100 text-info-800 dark:bg-info-900/30 dark:text-info-300',
  outline: 'border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300',
};

// Optional mapping from a semantic status prop to a visual variant
const statusToVariant = {
  live: 'success',
  processing: 'warning',
  failed: 'danger',
  paused: 'secondary',
  scheduled: 'secondary',
  completed: 'success',
};

export const Badge = React.forwardRef(
  (
    {
      className,
      variant = 'default',
      status, // optional semantic status
      dot = false, // optional leading dot indicator
      size = 'sm', // 'xs' | 'sm' | 'md'
      pill = true,
      children,
      ...props
    },
    ref
  ) => {
    const effectiveVariant = status ? statusToVariant[status] || variant : variant;
    const sizeClasses = {
      xs: 'px-1.5 py-0.5 text-[10px]',
      sm: 'px-2.5 py-0.5 text-xs',
      md: 'px-3 py-1 text-sm',
    };

    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center font-medium transition-colors',
          pill ? 'rounded-full' : 'rounded-md',
          sizeClasses[size],
          badgeVariants[effectiveVariant] || badgeVariants.default,
          className
        )}
        {...props}
      >
        {dot && (
          <span
            className={cn(
              'mr-1.5 inline-block h-1.5 w-1.5 rounded-full',
              effectiveVariant === 'success' && 'bg-success-500',
              effectiveVariant === 'warning' && 'bg-warning-500',
              effectiveVariant === 'danger' && 'bg-danger-500',
              effectiveVariant === 'secondary' && 'bg-gray-400',
              effectiveVariant === 'info' && 'bg-info-500',
              effectiveVariant === 'primary' && 'bg-primary-500'
            )}
          />
        )}
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';