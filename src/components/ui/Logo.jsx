import React from 'react';
import { motion } from 'framer-motion';
import { SparklesIcon } from '@heroicons/react/24/outline';
import { cn } from '../../utils/cn.jsx';

export const Logo = ({ size = 'default', showText = true, className }) => {
  const sizeClasses = {
    sm: 'h-6 w-6',
    default: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  const textSizeClasses = {
    sm: 'text-base',
    default: 'text-lg',
    lg: 'text-2xl',
  };

  return (
    <div className={cn('flex items-center', className)}>
      <motion.div
        className={cn(
          'bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center shadow-lg',
          sizeClasses[size]
        )}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <SparklesIcon className={cn('text-white', size === 'sm' ? 'h-3 w-3' : size === 'lg' ? 'h-7 w-7' : 'h-5 w-5')} />
      </motion.div>
      {showText && (
        <div className="ml-3">
          <h1 className={cn('font-bold text-gray-900 dark:text-white', textSizeClasses[size])}>
            Live Highlights
          </h1>
          {size !== 'sm' && (
            <p className="text-xs text-gray-500 dark:text-slate-400">Pipeline Dashboard</p>
          )}
        </div>
      )}
    </div>
  );
};