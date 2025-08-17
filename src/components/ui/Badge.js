import React from 'react';
import { cn } from '../../utils/cn';

const badgeVariants = {
  default: 'bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300',
  secondary: 'bg-gray-100 text-gray-800 dark:bg-dark-700 dark:text-dark-200',
  success: 'bg-success-100 text-success-800 dark:bg-success-900/30 dark:text-success-300',
  danger: 'bg-danger-100 text-danger-800 dark:bg-danger-900/30 dark:text-danger-300',
  warning: 'bg-warning-100 text-warning-800 dark:bg-warning-900/30 dark:text-warning-300',
  outline: 'border border-gray-200 dark:border-dark-600 text-gray-700 dark:text-dark-300',
};

export const Badge = React.forwardRef(({ 
  className, 
  variant = 'default', 
  ...props 
}, ref) => {
  return (
    <span
      ref={ref}
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors',
        badgeVariants[variant],
        className
      )}
      {...props}
    />
  );
});

Badge.displayName = 'Badge';

// Status-specific badge components for better developer experience
export const LiveBadge = React.forwardRef(({ children = 'Live', ...props }, ref) => (
  <Badge ref={ref} variant="live" dot {...props}>
    {children}
  </Badge>
));

LiveBadge.displayName = 'LiveBadge';

export const ScheduledBadge = React.forwardRef(({ children = 'Scheduled', ...props }, ref) => (
  <Badge ref={ref} variant="scheduled" {...props}>
    {children}
  </Badge>
));

ScheduledBadge.displayName = 'ScheduledBadge';

export const ProcessingBadge = React.forwardRef(({ children = 'Processing', ...props }, ref) => (
  <Badge ref={ref} variant="processing" dot {...props}>
    {children}
  </Badge>
));

ProcessingBadge.displayName = 'ProcessingBadge';

export const FailedBadge = React.forwardRef(({ children = 'Failed', ...props }, ref) => (
  <Badge ref={ref} variant="failed" {...props}>
    {children}
  </Badge>
));

FailedBadge.displayName = 'FailedBadge';

export const CompletedBadge = React.forwardRef(({ children = 'Completed', ...props }, ref) => (
  <Badge ref={ref} variant="completed" {...props}>
    {children}
  </Badge>
));

CompletedBadge.displayName = 'CompletedBadge';