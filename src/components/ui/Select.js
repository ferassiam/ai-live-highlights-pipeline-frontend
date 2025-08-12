import React from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { cn } from '../../utils/cn';

const selectSizes = {
  sm: 'h-8 px-3 py-1.5 text-sm',
  default: 'h-10 px-4 py-2.5 text-sm pr-10',
  lg: 'h-12 px-4 py-3 text-base pr-10'
};

export const Select = React.forwardRef(({ 
  className, 
  children,
  error = false,
  success = false,
  size = 'default',
  value,
  onChange,
  options = [],
  placeholder,
  disabled,
  leftIcon = null,
  ...props 
}, ref) => {
  const baseClasses = [
    'block w-full rounded-lg border transition-all duration-200',
    'font-medium tracking-tight appearance-none cursor-pointer',
    'focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-slate-50',
    'disabled:cursor-not-allowed disabled:opacity-50',
  'dark:focus:ring-offset-slate-950'
  ];

  const stateClasses = error 
    ? [
        'border-danger-300 text-danger-900',
        'focus:border-danger-500 focus:ring-danger-500/20',
        'bg-danger-50',
  'dark:border-danger-700 dark:text-danger-100',
  'dark:bg-danger-950/50'
      ]
    : success
    ? [
        'border-success-300 text-success-900',
        'focus:border-success-500 focus:ring-success-500/20',
        'bg-success-50',
  'dark:border-success-700 dark:text-success-100',
  'dark:bg-success-950/50'
      ]
    : [
        'border-stone-200 text-slate-900',
        'focus:border-primary-500 focus:ring-primary-500/20',
        'bg-slate-50 focus:bg-white',
  'dark:border-stone-600 dark:text-slate-100',
  'dark:bg-slate-900 dark:focus:bg-slate-800'
      ];

  const handleChange = (e) => {
    if (onChange) {
      // Parse value as number if it's numeric, otherwise keep as string
      const newValue = isNaN(e.target.value) ? e.target.value : Number(e.target.value);
      onChange(newValue);
    }
  };

  return (
    <div className="relative">
      {leftIcon && (
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <span className="w-4 h-4 text-slate-500 dark:text-slate-400">
            {leftIcon}
          </span>
        </div>
      )}
      
      <select
        className={cn(
          baseClasses,
          stateClasses,
          selectSizes[size],
          leftIcon && 'pl-10',
          className
        )}
        ref={ref}
        value={value}
        onChange={handleChange}
        disabled={disabled}
        {...props}
      >
        {placeholder && (
          <option value="" disabled hidden>
            {placeholder}
          </option>
        )}
        {options.map((option, index) => (
          <option 
            key={option.value || index} 
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
        {children}
      </select>

      {/* Custom dropdown arrow */}
      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
        <ChevronDownIcon 
          className="w-4 h-4 text-slate-500 dark:text-slate-400" 
          aria-hidden="true" 
        />
      </div>
    </div>
  );
});

Select.displayName = 'Select';