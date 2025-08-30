import React from 'react';
import { motion } from 'framer-motion';
import { PlayIcon } from '@heroicons/react/24/solid';
import { cn } from '../../utils/cn.jsx';

export const Logo = ({ size = 'default', showText = true, variant = 'full', className }) => {
  const sizeClasses = {
    sm: 'h-6 w-6',
    default: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16',
  };

  const textSizeClasses = {
    sm: 'text-base',
    default: 'text-lg',
    lg: 'text-2xl',
    xl: 'text-3xl',
  };

  if (variant === 'icon') {
    return (
      <motion.div
        className={cn(
          'bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg flex items-center justify-center shadow-lg relative overflow-hidden border border-slate-700',
          sizeClasses[size]
        )}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent" />
        <PlayIcon className={cn('text-emerald-400 z-10', size === 'sm' ? 'h-3 w-3' : size === 'lg' ? 'h-7 w-7' : size === 'xl' ? 'h-9 w-9' : 'h-5 w-5')} />
      </motion.div>
    );
  }

  return (
    <motion.div 
      className={cn('flex items-center', className)}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className={cn(
          'bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg flex items-center justify-center shadow-lg relative overflow-hidden border border-slate-700',
          sizeClasses[size]
        )}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent" />
        <PlayIcon className={cn('text-emerald-400 z-10', size === 'sm' ? 'h-3 w-3' : size === 'lg' ? 'h-7 w-7' : size === 'xl' ? 'h-9 w-9' : 'h-5 w-5')} />
      </motion.div>
      {showText && (
        <div className="ml-3">
          <h1 className={cn('font-bold text-slate-900 dark:text-white', textSizeClasses[size])}>
            MediaKind
          </h1>
          {size !== 'sm' && variant === 'full' && (
            <p className={cn('font-medium text-emerald-600 dark:text-emerald-400', size === 'xl' ? 'text-sm' : 'text-xs')}>
              Sports Operations
            </p>
          )}
        </div>
      )}
    </motion.div>
  );
};