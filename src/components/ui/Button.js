import React from 'react';
import { cn } from '../../utils/cn';

/**
 * Professional button component for sports operations UI
 * Supports multiple variants, sizes, and states with consistent styling
 */
export const Button = React.forwardRef(({
  className,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  children,
  ...props
}, ref) => {
  const baseClasses = 'btn';
  const sizeClasses = {
    sm: 'btn-sm',
    md: 'btn-md', 
    lg: 'btn-lg'
  };
  const variantClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    subtle: 'btn-subtle',
    destructive: 'btn-destructive',
    ghost: 'btn-ghost'
  };

  return (
    <button
      ref={ref}
      className={cn(
        baseClasses,
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent mr-2" />
      )}
      {LeftIcon && !loading && (
        <LeftIcon className="w-4 h-4 mr-2" />
      )}
      {children}
      {RightIcon && !loading && (
        <RightIcon className="w-4 h-4 ml-2" />
      )}
    </button>
  );
});

Button.displayName = 'Button';