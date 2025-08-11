import React from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { cn } from '../../utils/cn';

/**
 * Select component for sports operations UI
 * Supports both controlled and option-based usage patterns
 */
export const Select = React.forwardRef(({ 
  className, 
  children,
  error,
  helpText,
  label,
  value,
  onChange,
  options = [],
  placeholder,
  disabled,
  ...props 
}, ref) => {
  const selectId = props.id || `select-${Math.random().toString(36).substr(2, 9)}`;
  const errorId = error ? `${selectId}-error` : undefined;
  const helpId = helpText ? `${selectId}-help` : undefined;

  const handleChange = (e) => {
    if (onChange) {
      // Parse value as number if it's numeric, otherwise keep as string
      const newValue = isNaN(e.target.value) ? e.target.value : Number(e.target.value);
      onChange(newValue);
    }
  };

  return (
    <div className="space-y-2">
      {label && (
        <label htmlFor={selectId} className="form-label">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          ref={ref}
          id={selectId}
          className={cn(
            'form-select appearance-none pr-10',
            error && 'border-danger-500 focus:border-danger-500 focus:ring-danger-500',
            className
          )}
          value={value}
          onChange={handleChange}
          disabled={disabled}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={cn(errorId, helpId).trim() || undefined}
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
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <ChevronDownIcon className="h-4 w-4 text-muted" />
        </div>
      </div>
      {error && (
        <p id={errorId} className="text-sm text-danger-600 [data-theme='dark'] &:text-danger-400">
          {error}
        </p>
      )}
      {helpText && !error && (
        <p id={helpId} className="text-sm text-muted">
          {helpText}
        </p>
      )}
    </div>
  );
});

Select.displayName = 'Select';