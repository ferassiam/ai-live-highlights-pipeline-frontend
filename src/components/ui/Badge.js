import React from 'react';
import { cn } from '../../utils/cn';

/**
 * Status badge component for sports operations
 * Provides consistent status indication with optional icons
 */
export const Badge = React.forwardRef(({ 
  className, 
  variant = 'default',
  status,
  icon: Icon,
  dot = false,
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
        'inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium border',
        variantClasses[effectiveVariant],
        className
      )}
      {...props}
    >
      {dot && (
        <span className={cn(
          'w-1.5 h-1.5 rounded-full',
          effectiveVariant === 'live' && 'bg-success-500 animate-pulse-subtle',
          effectiveVariant === 'processing' && 'bg-warning-500 animate-pulse-subtle',
          effectiveVariant === 'failed' && 'bg-danger-500',
          effectiveVariant === 'scheduled' && 'bg-secondary-500',
          effectiveVariant === 'paused' && 'bg-surface-500',
          effectiveVariant === 'completed' && 'bg-surface-500'
        )} />
      )}
      {Icon && <Icon className="w-3 h-3" />}
      {props.children}
    </span>
  );
});

Badge.displayName = 'Badge';