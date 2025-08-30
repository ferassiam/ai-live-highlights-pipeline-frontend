import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

export const Card = React.forwardRef(({ className, ...props }, ref) => (
  <motion.div
    ref={ref}
    className={cn(
  'rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm',
      className
    )}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    {...props}
  />
));

Card.displayName = 'Card';

export const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1.5 p-6', className)}
    {...props}
  />
));

CardHeader.displayName = 'CardHeader';

export const CardTitle = React.forwardRef(({ className, children, ...props }, ref) => (
  <h3
    ref={ref}
  className={cn('text-lg font-semibold leading-none tracking-tight text-gray-900 dark:text-white', className)}
    {...props}
  >
    {children}
  </h3>
));

CardTitle.displayName = 'CardTitle';

export const CardSubtitle = React.forwardRef(({ 
  className, 
  children,
  ...props 
}, ref) => (
  <p
    ref={ref}
  className={cn('text-sm text-gray-600 dark:text-slate-400', className)}
    {...props}
  >
    {children}
  </p>
));

CardSubtitle.displayName = 'CardSubtitle';

export const CardContent = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
));

CardContent.displayName = 'CardContent';

export const CardFooter = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center p-6 pt-0', className)}
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