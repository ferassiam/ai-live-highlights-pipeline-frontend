import React from 'react';
import { cn } from '../../utils/cn';

const inputSizes = {
  sm: 'h-8 px-3 py-1.5 text-sm',
  default: 'h-10 px-4 py-2.5 text-sm',
  lg: 'h-12 px-4 py-3 text-base'
};

export const Input = React.forwardRef(({ 
  className, 
  type = 'text',
  size = 'default',
  error = false,
  success = false,
  leftIcon = null,
  rightIcon = null,
  ...props 
}, ref) => {
  const baseClasses = [
    'block w-full rounded-lg border transition-all duration-200',
    'font-medium tracking-tight',
    'focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-slate-50',
    'disabled:cursor-not-allowed disabled:opacity-50',
  'dark:focus:ring-offset-slate-950'
  ];

  const stateClasses = error 
    ? [
        'border-danger-300 text-danger-900 placeholder:text-danger-500',
        'focus:border-danger-500 focus:ring-danger-500/20',
        'bg-danger-50',
  'dark:border-danger-700 dark:text-danger-100',
  'dark:placeholder:text-danger-400 dark:bg-danger-950/50'
      ]
    : success
    ? [
        'border-success-300 text-success-900 placeholder:text-success-500',
        'focus:border-success-500 focus:ring-success-500/20',
        'bg-success-50',
  'dark:border-success-700 dark:text-success-100',
  'dark:placeholder:text-success-400 dark:bg-success-950/50'
      ]
    : [
        'border-stone-200 text-slate-900 placeholder:text-slate-500',
        'focus:border-primary-500 focus:ring-primary-500/20',
        'bg-slate-50 focus:bg-white',
  'dark:border-stone-600 dark:text-slate-100',
  'dark:placeholder:text-slate-400',
  'dark:bg-slate-900 dark:focus:bg-slate-800'
      ];

  const iconPaddingClasses = leftIcon && rightIcon 
    ? 'pl-10 pr-10'
    : leftIcon 
    ? 'pl-10'
    : rightIcon
    ? 'pr-10'
    : '';

  return (
    <div className="relative">
      {leftIcon && (
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <span className="w-4 h-4 text-slate-500 dark:text-slate-400">
            {leftIcon}
          </span>
        </div>
      )}
      
      <input
        type={type}
        className={cn(
          baseClasses,
          stateClasses,
          inputSizes[size],
          iconPaddingClasses,
          className
        )}
        ref={ref}
        {...props}
      />
      
      {rightIcon && (
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <span className="w-4 h-4 text-slate-500 dark:text-slate-400">
            {rightIcon}
          </span>
        </div>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export const Label = React.forwardRef(({ className, htmlFor, required, ...props }, ref) => (
  <label
    ref={ref}
    htmlFor={htmlFor}
    className={cn(
      'block text-sm font-subheading text-slate-700 mb-2 tracking-tight',
      'dark:text-slate-300',
      'peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
      className
    )}
    {...props}
  >
    {props.children}
    {required && <span className="text-danger-500 ml-1" aria-label="required">*</span>}
  </label>
));

Label.displayName = 'Label';

export const HelpText = React.forwardRef(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(
      'text-xs text-slate-500 mt-1 tracking-tight',
      'dark:text-slate-400',
      className
    )}
    {...props}
  />
));

HelpText.displayName = 'HelpText';

export const ErrorText = React.forwardRef(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(
      'text-xs text-danger-600 mt-1 tracking-tight',
      'dark:text-danger-400',
      className
    )}
    role="alert"
    {...props}
  />
));

ErrorText.displayName = 'ErrorText';

export const FormField = React.forwardRef(({ 
  label, 
  error, 
  helpText, 
  children, 
  required, 
  className,
  ...props 
}, ref) => {
  const fieldId = props.id || `field-${Math.random().toString(36).substr(2, 9)}`;
  const helpId = helpText ? `${fieldId}-help` : undefined;
  const errorId = error ? `${fieldId}-error` : undefined;

  return (
    <div ref={ref} className={cn('space-y-2', className)}>
      {label && (
        <Label htmlFor={fieldId} required={required}>
          {label}
        </Label>
      )}
      
      {React.cloneElement(children, {
        id: fieldId,
        'aria-describedby': [helpId, errorId].filter(Boolean).join(' ') || undefined,
        'aria-invalid': error ? 'true' : 'false',
        error: !!error
      })}
      
      {helpText && (
        <HelpText id={helpId}>
          {helpText}
        </HelpText>
      )}
      
      {error && (
        <ErrorText id={errorId}>
          {error}
        </ErrorText>
      )}
    </div>
  );
});

FormField.displayName = 'FormField';