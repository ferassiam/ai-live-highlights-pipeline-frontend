import React from 'react';
import { cn } from '../../utils/cn';

/**
 * Status indicator with dot and optional label
 * Optimized for sports operations status display
 */
export const StatusIndicator = React.forwardRef(({ 
  status = 'unknown',
  label,
  showLabel = true,
  size = 'sm',
  animated = true,
  className,
  ...props 
}, ref) => {
  const statusConfig = {
    live: {
      color: 'bg-success-500',
      textColor: 'text-success-600 [data-theme="dark"] &:text-success-400',
      label: 'Live'
    },
    scheduled: {
      color: 'bg-secondary-500', 
      textColor: 'text-secondary-600 [data-theme="dark"] &:text-secondary-400',
      label: 'Scheduled'
    },
    processing: {
      color: 'bg-warning-500',
      textColor: 'text-warning-600 [data-theme="dark"] &:text-warning-400', 
      label: 'Processing'
    },
    failed: {
      color: 'bg-danger-500',
      textColor: 'text-danger-600 [data-theme="dark"] &:text-danger-400',
      label: 'Failed'
    },
    paused: {
      color: 'bg-surface-500',
      textColor: 'text-surface-600 [data-theme="dark"] &:text-surface-400',
      label: 'Paused'
    },
    completed: {
      color: 'bg-surface-500',
      textColor: 'text-surface-600 [data-theme="dark"] &:text-surface-400',
      label: 'Completed'
    },
    offline: {
      color: 'bg-surface-400',
      textColor: 'text-surface-500 [data-theme="dark"] &:text-surface-500',
      label: 'Offline'
    },
    unknown: {
      color: 'bg-surface-400',
      textColor: 'text-surface-500 [data-theme="dark"] &:text-surface-500',
      label: 'Unknown'
    }
  };

  const config = statusConfig[status] || statusConfig.unknown;
  const displayLabel = label || config.label;

  const dotSizes = {
    xs: 'w-1.5 h-1.5',
    sm: 'w-2 h-2', 
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3'
  };

  const shouldAnimate = animated && (status === 'live' || status === 'processing');

  return (
    <div
      ref={ref}
      className={cn('inline-flex items-center gap-2', className)}
      {...props}
    >
      <span 
        className={cn(
          'rounded-full',
          dotSizes[size],
          config.color,
          shouldAnimate && 'animate-pulse-subtle'
        )}
      />
      {showLabel && (
        <span className={cn('text-sm font-medium', config.textColor)}>
          {displayLabel}
        </span>
      )}
    </div>
  );
});

StatusIndicator.displayName = 'StatusIndicator';