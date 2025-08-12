import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

// Professional card variants for sports operations
const cardVariants = {
  default: [
    'bg-slate-50 border border-stone-200',
  'dark:bg-slate-900 dark:border-stone-600',
    'shadow-subtle hover:shadow-elevation',
    'transition-all duration-200'
  ].join(' '),
  
  elevated: [
    'bg-slate-50 border border-stone-200',
  'dark:bg-slate-900 dark:border-stone-600',
    'shadow-elevation hover:shadow-elevated',
    'transition-all duration-200'
  ].join(' '),
  
  interactive: [
    'bg-slate-50 border border-stone-200',
  'dark:bg-slate-900 dark:border-stone-600',
    'shadow-subtle hover:shadow-elevation hover:border-stone-300',
  'dark:hover:border-stone-500',
    'cursor-pointer transition-all duration-200'
  ].join(' '),
  
  flat: [
    'bg-slate-50 border border-stone-200',
  'dark:bg-slate-900 dark:border-stone-600'
  ].join(' ')
};

// Reserved for future density control
// const densityVariants = {
//   compact: 'p-4',
//   default: 'p-6',
//   spacious: 'p-8'
// };

export const Card = React.forwardRef(({ 
  className, 
  variant = 'default',
  density = 'default',
  interactive = false,
  ...props 
}, ref) => {
  const selectedVariant = interactive ? 'interactive' : variant;
  
  return (
    <motion.div
      ref={ref}
      className={cn(
        'rounded-lg overflow-hidden',
        cardVariants[selectedVariant],
        className
      )}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      {...props}
    />
  );
});

Card.displayName = 'Card';

export const CardHeader = React.forwardRef(({ 
  className, 
  density = 'default',
  divided = false,
  actions = null,
  ...props 
}, ref) => {
  const densityClasses = {
    compact: 'px-4 py-3',
    default: 'px-6 py-4',
    spacious: 'px-8 py-6'
  };

  return (
    <div
      ref={ref}
      className={cn(
        'flex items-start justify-between',
        densityClasses[density],
        divided && [
          'border-b border-stone-200 bg-slate-50/50 backdrop-blur-sm',
          'dark:border-stone-600 dark:bg-slate-800/50'
        ],
        className
      )}
      {...props}
    >
      <div className="flex flex-col space-y-1.5 min-w-0 flex-1">
        {props.children}
      </div>
      {actions && (
        <div className="flex items-center gap-2 ml-4">
          {actions}
        </div>
      )}
    </div>
  );
});

CardHeader.displayName = 'CardHeader';

export const CardTitle = React.forwardRef(({ className, level = 3, ...props }, ref) => {
  const Component = `h${level}`;
  
  return (
    <Component
      ref={ref}
      className={cn(
  'font-heading tracking-tight text-slate-900 dark:text-slate-100',
        level === 1 && 'text-2xl',
        level === 2 && 'text-xl', 
        level === 3 && 'text-lg',
        level === 4 && 'text-base',
        level === 5 && 'text-sm font-subheading',
        level === 6 && 'text-xs font-subheading uppercase tracking-wider',
        className
      )}
      {...props}
    />
  );
});

CardTitle.displayName = 'CardTitle';

export const CardSubtitle = React.forwardRef(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(
  'text-sm text-slate-600 tracking-tight dark:text-slate-400',
      className
    )}
    {...props}
  />
));

CardSubtitle.displayName = 'CardSubtitle';

export const CardDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(
  'text-sm text-slate-600 leading-relaxed dark:text-slate-400',
      className
    )}
    {...props}
  />
));

CardDescription.displayName = 'CardDescription';

export const CardContent = React.forwardRef(({ 
  className, 
  density = 'default',
  noPadding = false,
  ...props 
}, ref) => {
  const densityClasses = {
    compact: 'px-4 pb-3',
    default: 'px-6 pb-4', 
    spacious: 'px-8 pb-6'
  };

  return (
    <div 
      ref={ref} 
      className={cn(
        !noPadding && densityClasses[density],
        className
      )} 
      {...props} 
    />
  );
});

CardContent.displayName = 'CardContent';

export const CardFooter = React.forwardRef(({ 
  className, 
  density = 'default',
  divided = false,
  justify = 'start',
  ...props 
}, ref) => {
  const densityClasses = {
    compact: 'px-4 py-3',
    default: 'px-6 py-4',
    spacious: 'px-8 py-6'
  };

  const justifyClasses = {
    start: 'justify-start',
    center: 'justify-center', 
    end: 'justify-end',
    between: 'justify-between'
  };

  return (
    <div
      ref={ref}
      className={cn(
        'flex items-center gap-3',
        densityClasses[density],
        justifyClasses[justify],
        divided && [
          'border-t border-stone-200 bg-slate-50/30',
          'dark:border-stone-600 dark:bg-slate-800/30'
        ],
        className
      )}
      {...props}
    />
  );
});

CardFooter.displayName = 'CardFooter';