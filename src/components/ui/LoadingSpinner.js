import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

// Professional loading components for sports operations
export const LoadingSpinner = React.forwardRef(({ 
  size = 'default', 
  color = 'primary',
  variant = 'spin',
  label,
  message,
  className,
  ...props 
}, ref) => {
  const sizeClasses = {
    xs: 'h-4 w-4',
    sm: 'h-5 w-5',
    default: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-10 w-10'
  };

  const SpinnerVariant = () => (
    <div ref={ref} className={cn('flex items-center justify-center gap-2', className)} {...props}>
      <svg
        className={cn('animate-spin text-slate-400 dark:text-slate-300', sizeClasses[size])}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        role="status"
        aria-label={label || 'Loading'}
      >
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
      </svg>
  {(label || message) && <span className="text-sm text-slate-600 dark:text-slate-300">{label || message}</span>}
    </div>
  );

  const DotsVariant = () => (
    <div ref={ref} className={cn('flex items-center gap-1', className)} {...props}>
      {[0, 1, 2].map((index) => (
        <motion.div
          // Tailwind note: ensure colors used by 'color' are safelisted if needed
          key={index}
          className={cn(
            'rounded-full',
            size === 'xs' ? 'h-1 w-1' : 
            size === 'sm' ? 'h-1.5 w-1.5' :
            size === 'default' ? 'h-2 w-2' :
            size === 'lg' ? 'h-2.5 w-2.5' :
            'h-3 w-3',
            `bg-${color}-500`
          )}
          animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 0.6, repeat: Infinity, delay: index * 0.2, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );

  const PulseVariant = () => (
    <motion.div
      ref={ref}
      className={cn('rounded-full', sizeClasses[size], `bg-${color}-500`, className)}
      animate={{ scale: [1, 1.1, 1], opacity: [0.7, 1, 0.7] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
      {...props}
    />
  );

  switch (variant) {
    case 'dots':
      return <DotsVariant />;
    case 'pulse':
      return <PulseVariant />;
    default:
      return <SpinnerVariant />;
  }
});

LoadingSpinner.displayName = 'LoadingSpinner';

export const LoadingPage = React.forwardRef(({ 
  message = 'Loading...', 
  description,
  size = 'lg',
  className,
  ...props 
}, ref) => (
  <div 
    ref={ref}
    className={cn(
      'min-h-screen flex items-center justify-center',
  'bg-slate-50 dark:bg-slate-950',
      className
    )}
    {...props}
  >
    <div className="text-center space-y-4">
      <LoadingSpinner size={size} />
      <div className="space-y-2">
        <h2 className="text-lg font-heading text-slate-900 dark:text-slate-100 tracking-tight">
          {message}
        </h2>
        {description && (
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {description}
          </p>
        )}
      </div>
    </div>
  </div>
));

LoadingPage.displayName = 'LoadingPage';

export const LoadingCard = React.forwardRef(({ 
  message = 'Loading...', 
  className,
  ...props 
}, ref) => (
  <div 
    ref={ref}
    className={cn(
  'bg-slate-50 dark:bg-slate-900 border border-stone-200 dark:border-stone-600',
      'rounded-lg p-8 text-center space-y-4',
      className
    )}
    {...props}
  >
    <LoadingSpinner size="lg" />
    <p className="text-sm font-subheading text-slate-600 dark:text-slate-400 tracking-tight">
      {message}
    </p>
  </div>
));

LoadingCard.displayName = 'LoadingCard';

export const LoadingOverlay = React.forwardRef(({ 
  message = 'Loading...', 
  blur = true,
  className,
  ...props 
}, ref) => (
  <div 
    ref={ref}
    className={cn(
      'absolute inset-0 flex items-center justify-center z-50',
  'bg-slate-50/90 dark:bg-slate-950/90',
      blur && 'backdrop-blur-sm',
      className
    )}
    {...props}
  >
    <div className="text-center space-y-3">
      <LoadingSpinner size="lg" />
      <p className="text-sm font-subheading text-slate-700 dark:text-slate-300 tracking-tight">
        {message}
      </p>
    </div>
  </div>
));

LoadingOverlay.displayName = 'LoadingOverlay';