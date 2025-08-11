import React from 'react';
import { cn } from '../../utils/cn';

/**
 * Card component system for sports operations UI
 * Provides consistent elevation and spacing patterns
 */
export const Card = React.forwardRef(({ 
  className, 
  elevated = false,
  dense = false,
  ...props 
}, ref) => (
  <div
    ref={ref}
    className={cn(
      elevated ? 'card-elevated' : 'card',
      className
    )}
    {...props}
  />
));

Card.displayName = 'Card';

export const CardHeader = React.forwardRef(({ 
  className, 
  dense = false,
  ...props 
}, ref) => (
  <div
    ref={ref}
    className={cn(
      'card-header',
      dense && 'py-3',
      className
    )}
    {...props}
  />
));

CardHeader.displayName = 'CardHeader';

export const CardTitle = React.forwardRef(({ 
  className, 
  children, 
  ...props 
}, ref) => (
  <h3
    ref={ref}
    className={cn(
      'text-lg font-semibold tracking-tight text-surface-50',
      '[data-theme="light"] &:text-surface-950',
      className
    )}
    {...props}
  >
    {children}
  </h3>
));

CardTitle.displayName = 'CardTitle';

export const CardSubtitle = React.forwardRef(({ 
  className, 
  ...props 
}, ref) => (
  <p
    ref={ref}
    className={cn(
      'text-sm text-muted mt-1',
      className
    )}
    {...props}
  />
));

CardSubtitle.displayName = 'CardSubtitle';

export const CardContent = React.forwardRef(({ 
  className, 
  dense = false,
  ...props 
}, ref) => (
  <div 
    ref={ref} 
    className={cn(
      'card-content',
      dense && 'p-4',
      className
    )} 
    {...props} 
  />
));

CardContent.displayName = 'CardContent';

export const CardFooter = React.forwardRef(({ 
  className, 
  dense = false,
  ...props 
}, ref) => (
  <div
    ref={ref}
    className={cn(
      'card-footer',
      dense && 'py-3',
      className
    )}
    {...props}
  />
));

CardFooter.displayName = 'CardFooter';

export const CardActions = React.forwardRef(({ 
  className, 
  ...props 
}, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex items-center gap-2',
      className
    )}
    {...props}
  />
));

CardActions.displayName = 'CardActions';