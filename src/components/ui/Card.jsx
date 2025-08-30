import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn.jsx';

export const Card = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
  'border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200',
      className
    )}
    {...props}
  />
));

Card.displayName = 'Card';

export const CardHeader = React.forwardRef(({ 
  className, 
  actions, 
  divided,
  children,
  ...props 
}, ref) => (
  <div
    ref={ref}
    className={cn(
      'p-6',
      divided && 'border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50',
      actions ? 'flex items-center justify-between' : 'flex flex-col space-y-1.5',
      className
    )}
    {...props}
  >
    <div className={actions ? 'flex-1' : ''}>
      {children}
    </div>
    {actions && (
      <div className="flex items-center space-x-2">
        {actions}
      </div>
    )}
  </div>
));

CardHeader.displayName = 'CardHeader';

export const CardTitle = React.forwardRef(({ className, children, ...props }, ref) => (
  <h3
    ref={ref}
  className={cn('text-lg font-semibold leading-tight text-slate-900 dark:text-white', className)}
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
  className={cn('text-sm text-slate-600 dark:text-slate-400', className)}
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

export const CardFooter = React.forwardRef(({ 
  className, 
  divided,
  justify = 'start',
  children,
  ...props 
}, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex items-center p-6 pt-0',
      divided && 'border-t border-slate-200 dark:border-slate-700 bg-slate-50/30 dark:bg-slate-800/30',
      justify === 'end' && 'justify-end',
      justify === 'center' && 'justify-center',
      justify === 'between' && 'justify-between',
      className
    )}
    {...props}
  >
    {children}
  </div>
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