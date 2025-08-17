import React from 'react';
import { cn } from '../../utils/cn';

const inputSizes = {
  sm: 'h-8 px-3 py-1.5 text-sm',
  default: 'h-10 px-4 py-2.5 text-sm',
  lg: 'h-12 px-4 py-3 text-base'
};

/**
 * Form input components for sports operations UI
 * Consistent styling with proper focus states and accessibility
 */
export const Input = React.forwardRef(({ 
  className, 
  type = 'text',
  error,
  ...props 
}, ref) => {
  return (
    <input
      type={type}
      className={cn(
        'flex h-10 w-full rounded-md border border-gray-300 dark:border-dark-600',
        'bg-white dark:bg-dark-800 px-3 py-2 text-sm',
        'text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-dark-400',
        'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
        'disabled:cursor-not-allowed disabled:opacity-50',
        error && 'border-danger-500 focus:border-danger-500 focus:ring-danger-500',
        className
      )}
      ref={ref}
      {...props}
    />
  );
});

Input.displayName = 'Input';

export const Label = React.forwardRef(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={cn(
      'text-sm font-medium leading-none text-gray-700 dark:text-dark-300',
      'peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
      className
    )}
    {...props}
  />
));

Label.displayName = 'Label';

export const FormField = ({ label, error, children, required, className }) => (
  <div className={cn('space-y-2', className)}>
    {label && (
      <Label>
        {label}
        {required && <span className="text-danger-500 ml-1">*</span>}
        }
      </Label>
    )}
    {children}
    {error && (
      <p className="text-sm text-danger-600 dark:text-danger-400">{error}</p>
    )}
  </div>
);