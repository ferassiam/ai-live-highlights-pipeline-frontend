import React from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { cn } from '../../utils/cn';

const selectSizes = {
  sm: 'h-8 px-3 py-1.5 text-sm',
  default: 'h-10 px-4 py-2.5 text-sm pr-10',
  lg: 'h-12 px-4 py-3 text-base pr-10'
};

/**
 * Select component for sports operations UI
 * Supports both controlled and option-based usage patterns
 */
export const Select = React.forwardRef(({ 
  className, 
  children,
  error,
  label,
  value,
  onChange,
  options = [],
  placeholder,
  disabled,
  leftIcon = null,
  ...props 
}, ref) => {
  const handleChange = (e) => {
    if (onChange) {
      // Parse value as number if it's numeric, otherwise keep as string
      const newValue = isNaN(e.target.value) ? e.target.value : Number(e.target.value);
      onChange(newValue);
    }
  };

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-dark-300">
          {label}
        </label>
      )}
      <select
        className={cn(
          'flex h-10 w-full rounded-md border border-gray-300 dark:border-dark-600',
          'bg-white dark:bg-dark-800 px-3 py-2 text-sm',
          'text-gray-900 dark:text-white',
          'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
          'disabled:cursor-not-allowed disabled:opacity-50',
          error && 'border-danger-500 focus:border-danger-500 focus:ring-danger-500',
          className
        )}
        ref={ref}
        value={value}
        onChange={handleChange}
        disabled={disabled}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
        {children}
      </select>
      {error && (
        <p className="text-sm text-danger-600 dark:text-danger-400">{error}</p>
      )}
    </div>
  );
});

Select.displayName = 'Select';