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
  // Map status to variant if status is provided
  const statusVariants = {
    live: 'live',
    scheduled: 'scheduled', 
    processing: 'processing',
    failed: 'failed',
    paused: 'paused',
    completed: 'completed'
  };

  const effectiveVariant = status ? statusVariants[status] || variant : variant;

  const variantClasses = {
    default: 'bg-surface-200 text-surface-700 border-surface-300 [data-theme="dark"] &:bg-surface-800 [data-theme="dark"] &:text-surface-300 [data-theme="dark"] &:border-surface-700',
    live: 'status-live',
    scheduled: 'status-scheduled',
    processing: 'status-processing', 
    failed: 'status-failed',
    paused: 'status-paused',
    completed: 'status-completed',
    primary: 'bg-primary-100 text-primary-800 border-primary-200 [data-theme="dark"] &:bg-primary-950 [data-theme="dark"] &:text-primary-400 [data-theme="dark"] &:border-primary-800',
    secondary: 'bg-secondary-100 text-secondary-800 border-secondary-200 [data-theme="dark"] &:bg-secondary-950 [data-theme="dark"] &:text-secondary-400 [data-theme="dark"] &:border-secondary-800',
    success: 'bg-success-100 text-success-800 border-success-200 [data-theme="dark"] &:bg-success-950 [data-theme="dark"] &:text-success-400 [data-theme="dark"] &:border-success-800',
    warning: 'bg-warning-100 text-warning-800 border-warning-200 [data-theme="dark"] &:bg-warning-950 [data-theme="dark"] &:text-warning-400 [data-theme="dark"] &:border-warning-800',
    danger: 'bg-danger-100 text-danger-800 border-danger-200 [data-theme="dark"] &:bg-danger-950 [data-theme="dark"] &:text-danger-400 [data-theme="dark"] &:border-danger-800',
    info: 'bg-info-100 text-info-800 border-info-200 [data-theme="dark"] &:bg-info-950 [data-theme="dark"] &:text-info-400 [data-theme="dark"] &:border-info-800',
  };

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