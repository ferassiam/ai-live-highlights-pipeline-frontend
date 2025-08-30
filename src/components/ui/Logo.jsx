import React from 'react';
import { motion } from 'framer-motion';
import { TvIcon, BoltIcon } from '@heroicons/react/24/outline';
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
          'bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 rounded-xl flex items-center justify-center shadow-lg relative overflow-hidden',
          sizeClasses[size]
        )}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
        <TvIcon className={cn('text-white z-10', size === 'sm' ? 'h-3 w-3' : size === 'lg' ? 'h-7 w-7' : size === 'xl' ? 'h-9 w-9' : 'h-5 w-5')} />
        <BoltIcon className={cn('text-yellow-300 absolute top-1 right-1 z-10', size === 'sm' ? 'h-2 w-2' : size === 'lg' ? 'h-3 w-3' : size === 'xl' ? 'h-4 w-4' : 'h-2.5 w-2.5')} />
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
          'bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 rounded-xl flex items-center justify-center shadow-lg relative overflow-hidden',
          sizeClasses[size]
        )}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
        <TvIcon className={cn('text-white z-10', size === 'sm' ? 'h-3 w-3' : size === 'lg' ? 'h-7 w-7' : size === 'xl' ? 'h-9 w-9' : 'h-5 w-5')} />
        <BoltIcon className={cn('text-yellow-300 absolute top-1 right-1 z-10', size === 'sm' ? 'h-2 w-2' : size === 'lg' ? 'h-3 w-3' : size === 'xl' ? 'h-4 w-4' : 'h-2.5 w-2.5')} />
      </motion.div>
      {showText && (
        <div className="ml-3">
          <h1 className={cn('font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-400', textSizeClasses[size])}>
            MediaKind Sports
          </h1>
          {size !== 'sm' && variant === 'full' && (
            <p className={cn('font-medium text-slate-600 dark:text-slate-400', size === 'xl' ? 'text-sm' : 'text-xs')}>
              Live Highlights Operations
            </p>
          )}
        </div>
      )}
    </motion.div>
  );
};