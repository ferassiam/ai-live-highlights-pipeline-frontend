import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

// Professional logo for sports operations - simple wordmark without AI imagery
export const Logo = ({ 
  size = 'default', 
  showText = true, 
  showSubtitle = true,
  variant = 'default',
  className 
}) => {
  const sizeClasses = {
    xs: 'h-4 w-4',
    sm: 'h-6 w-6', 
    default: 'h-8 w-8',
    lg: 'h-10 w-10',
    xl: 'h-12 w-12'
  };

  const textSizeClasses = {
    xs: 'text-sm',
    sm: 'text-base',
    default: 'text-lg',
    lg: 'text-xl',
    xl: 'text-2xl'
  };

  const subtitleSizeClasses = {
    xs: 'text-[10px]',
    sm: 'text-xs',
    default: 'text-xs',
    lg: 'text-sm',
    xl: 'text-sm'
  };

  // Professional logo mark - geometric shape representing broadcast/operations
  const LogoMark = () => (
    <motion.div
      className={cn(
        'relative flex items-center justify-center rounded-md',
        variant === 'minimal' 
          ? 'bg-slate-100 dark:bg-slate-800' 
          : 'bg-primary-500 dark:bg-primary-600',
        sizeClasses[size]
      )}
      whileHover={variant !== 'minimal' ? { scale: 1.02 } : {}}
      transition={{ duration: 0.15 }}
    >
      {/* Professional geometric logo - represents signal/broadcast */}
      <svg 
        className={cn(
          variant === 'minimal' 
            ? 'text-slate-600 dark:text-slate-400' 
            : 'text-white',
          size === 'xs' ? 'h-2.5 w-2.5' :
          size === 'sm' ? 'h-3.5 w-3.5' :
          size === 'default' ? 'h-5 w-5' :
          size === 'lg' ? 'h-6 w-6' :
          'h-7 w-7'
        )}
        viewBox="0 0 24 24" 
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z" 
              opacity="0.3"/>
        <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5zm0 3.18L18 8.82v8.05c0 3.67-2.5 6.5-6 7.32-3.5-.82-6-3.65-6-7.32V8.82L12 5.18z"/>
        <circle cx="12" cy="12" r="3" fill="currentColor"/>
      </svg>
    </motion.div>
  );

  return (
    <div className={cn('flex items-center', className)}>
      <LogoMark />
      
      {showText && (
        <div className="ml-3 min-w-0">
          <div className={cn(
            'font-heading font-bold text-slate-900 dark:text-slate-100 tracking-tight',
            textSizeClasses[size]
          )}>
            Live Highlights
          </div>
          
          {showSubtitle && size !== 'xs' && size !== 'sm' && (
            <div className={cn(
              'font-medium text-slate-600 dark:text-slate-400 tracking-tight leading-tight',
              subtitleSizeClasses[size]
            )}>
              Sports Operations
            </div>
          )}
        </div>
      )}
    </div>
  );
};