import React from 'react';
import { cn } from '../../utils/cn';

// Sports operations status badge variants with high contrast
const badgeVariants = {
  // Primary status badges for sports operations
  live: [
    'bg-success-50 text-success-900 border border-success-200',
  'dark:bg-success-950 dark:text-success-100 dark:border-success-800'
  ].join(' '),
  
  scheduled: [
    'bg-secondary-50 text-secondary-900 border border-secondary-200',
  'dark:bg-secondary-950 dark:text-secondary-100 dark:border-secondary-800'
  ].join(' '),
  
  processing: [
    'bg-warning-50 text-warning-900 border border-warning-200',
  'dark:bg-warning-950 dark:text-warning-100 dark:border-warning-800'
  ].join(' '),
  
  failed: [
    'bg-danger-50 text-danger-900 border border-danger-200',
  'dark:bg-danger-950 dark:text-danger-100 dark:border-danger-800'
  ].join(' '),
  
  paused: [
    'bg-slate-100 text-slate-900 border border-slate-200',
  'dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700'
  ].join(' '),
  
  completed: [
    'bg-info-50 text-info-900 border border-info-200',
  'dark:bg-info-950 dark:text-info-100 dark:border-info-800'
  ].join(' '),
  
  // Generic variants for backward compatibility
  default: [
    'bg-slate-100 text-slate-900 border border-slate-200',
  'dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700'
  ].join(' '),
  
  primary: [
    'bg-primary-50 text-primary-900 border border-primary-200',
  'dark:bg-primary-950 dark:text-primary-100 dark:border-primary-800'
  ].join(' '),
  
  secondary: [
    'bg-slate-100 text-slate-900 border border-slate-200',
  'dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700'
  ].join(' '),
  
  success: [
    'bg-success-50 text-success-900 border border-success-200',
  'dark:bg-success-950 dark:text-success-100 dark:border-success-800'
  ].join(' '),
  
  warning: [
    'bg-warning-50 text-warning-900 border border-warning-200',
  'dark:bg-warning-950 dark:text-warning-100 dark:border-warning-800'
  ].join(' '),
  
  danger: [
    'bg-danger-50 text-danger-900 border border-danger-200',
  'dark:bg-danger-950 dark:text-danger-100 dark:border-danger-800'
  ].join(' '),
  
  info: [
    'bg-info-50 text-info-900 border border-info-200',
  'dark:bg-info-950 dark:text-info-100 dark:border-info-800'
  ].join(' '),
  
  outline: [
    'bg-transparent text-slate-700 border border-stone-200',
  'dark:text-slate-300 dark:border-stone-600'
  ].join(' ')
};

const sizeVariants = {
  sm: 'px-2 py-0.5 text-xs rounded-md',
  default: 'px-2.5 py-1 text-xs rounded-md',
  lg: 'px-3 py-1.5 text-sm rounded-lg'
};

export const Badge = React.forwardRef(({ 
  className, 
  variant = 'default',
  size = 'default',
  icon = null,
  dot = false,
  ...props 
}, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        'inline-flex items-center gap-1.5 font-subheading tracking-tight transition-all duration-200',
        badgeVariants[variant],
        sizeVariants[size],
        className
      )}
      {...props}
    >
      {/* Status dot indicator */}
      {dot && (
        <div 
          className="w-1.5 h-1.5 rounded-full bg-current flex-shrink-0" 
          aria-hidden="true"
        />
      )}
      
      {/* Optional icon */}
      {icon && !dot && (
        <span className="w-3 h-3 flex-shrink-0" aria-hidden="true">
          {icon}
        </span>
      )}
      
      {/* Badge content */}
      <span>
        {props.children}
      </span>
    </div>
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