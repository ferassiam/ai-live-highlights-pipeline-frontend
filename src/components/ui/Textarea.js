import React from 'react';
import { cn } from '../../utils/cn';

export const Textarea = React.forwardRef(({ 
  className,
  error,
  ...props 
}, ref) => {
  return (
    <textarea
      className={cn(
        'flex min-h-[80px] w-full rounded-md border border-gray-300 dark:border-dark-600',
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

Textarea.displayName = 'Textarea';