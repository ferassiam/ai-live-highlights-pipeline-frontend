import React from 'react';
import { cn } from '../../utils/cn';

/**
 * Form input components for sports operations UI
 * Consistent styling with proper focus states and accessibility
 */
export const Input = React.forwardRef(({ 
  className, 
  type = 'text',
  error,
  helpText,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  ...props 
}, ref) => {
  const inputId = props.id || `input-${Math.random().toString(36).substr(2, 9)}`;
  const errorId = error ? `${inputId}-error` : undefined;
  const helpId = helpText ? `${inputId}-help` : undefined;

  return (
    <div className="relative">
      {LeftIcon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <LeftIcon className="h-4 w-4 text-muted" />
        </div>
      )}
      <input
        ref={ref}
        type={type}
        id={inputId}
        className={cn(
          'form-input',
          LeftIcon && 'pl-10',
          RightIcon && 'pr-10',
          error && 'border-danger-500 focus:border-danger-500 focus:ring-danger-500',
          className
        )}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={cn(errorId, helpId).trim() || undefined}
        {...props}
      />
      {RightIcon && (
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <RightIcon className="h-4 w-4 text-muted" />
        </div>
      )}
      {error && (
        <p id={errorId} className="mt-1 text-sm text-danger-600 [data-theme='dark'] &:text-danger-400">
          {error}
        </p>
      )}
      {helpText && !error && (
        <p id={helpId} className="mt-1 text-sm text-muted">
          {helpText}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export const Label = React.forwardRef(({ 
  className, 
  required,
  ...props 
}, ref) => (
  <label
    ref={ref}
    className={cn('form-label', className)}
    {...props}
  >
    {props.children}
    {required && <span className="text-danger-500 ml-1">*</span>}
    }
  </label>
));

Label.displayName = 'Label';

export const FormField = ({ 
  label, 
  error, 
  helpText,
  required,
  children, 
  className 
}) => {
  const fieldId = `field-${Math.random().toString(36).substr(2, 9)}`;
  
  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <Label htmlFor={fieldId} required={required}>
          {label}
        </Label>
      )}
      {React.cloneElement(children, { 
        id: fieldId,
        error,
        helpText: !error ? helpText : undefined
      })}
    </div>
  );
};