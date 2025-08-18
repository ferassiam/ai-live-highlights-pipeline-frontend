import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn.jsx';

export function MetricsCard({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  color = 'default',
  size = 'default',
  variant = 'default',
  loading = false,
  className = '',
  onClick
}) {
  const colorClasses = {
    primary: 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300',
    success: 'bg-success-50 dark:bg-success-900/20 text-success-700 dark:text-success-300',
    warning: 'bg-warning-50 dark:bg-warning-900/20 text-warning-700 dark:text-warning-300',
    danger: 'bg-danger-50 dark:bg-danger-900/20 text-danger-700 dark:text-danger-300',
  gray: 'bg-gray-50 dark:bg-slate-800 text-gray-700 dark:text-slate-300'
  };

  const changeColorClasses = {
    positive: 'text-success-600 dark:text-success-400',
    negative: 'text-danger-600 dark:text-danger-400',
  neutral: 'text-gray-500 dark:text-slate-400'
  };

  const getChangeType = (change) => {
    if (change > 0) return 'positive';
    if (change < 0) return 'negative';
    return 'neutral';
  };

  const formatChange = (change) => {
    const sign = change > 0 ? '+' : '';
    return `${sign}${change}%`;
  };

  const cardContent = (
  <div className={cn('relative overflow-hidden rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-5 shadow-sm', className)}>
      {loading && (
  <div className="absolute inset-0 bg-white/50 dark:bg-slate-800/50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
        </div>
      )}
      
      <dt>
        <div className={cn('absolute rounded-md p-3', colorClasses[color])}>
          {Icon && <Icon className="h-6 w-6" aria-hidden="true" />}
        </div>
  <p className="ml-16 truncate text-sm font-medium text-gray-500 dark:text-slate-400">
          {title}
        </p>
      </dt>
      <dd className="ml-16 flex items-baseline pb-2">
        <p className="text-2xl font-semibold text-gray-900 dark:text-white">
          {loading ? '...' : value}
        </p>
        {change !== undefined && change !== null && !loading && (
          <p className={cn('ml-2 flex items-baseline text-sm font-semibold', changeColorClasses[getChangeType(change)])}>
            <span className="sr-only"> {change > 0 ? 'Increased' : 'Decreased'} by </span>
            {formatChange(change)}
          </p>
        )}
      </dd>
    </div>
  );

  if (onClick) {
    return (
      <motion.button
        onClick={onClick}
        className="w-full text-left"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
      >
        {cardContent}
      </motion.button>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {cardContent}
    </motion.div>
  );
}

MetricsCard.displayName = 'MetricsCard';

export default MetricsCard;