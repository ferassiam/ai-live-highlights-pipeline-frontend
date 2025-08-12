import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpIcon, ArrowDownIcon, MinusIcon } from '@heroicons/react/24/outline';
import { cn } from '../../utils/cn';

// Professional metrics card for sports operations dashboards
export const MetricsCard = React.forwardRef(({ 
  title, 
  value, 
  change,
  changeLabel,
  unit = '',
  subtitle,
  icon: Icon, 
  color = 'default',
  size = 'default',
  variant = 'default',
  loading = false,
  className = '',
  showTrend = true,
  sparklineData = null,
  status = null,
  onClick,
  ...props
}, ref) => {
  // Size variants for different dashboard contexts
  const sizeClasses = {
    sm: 'p-4',
    default: 'p-6',
    lg: 'p-8'
  };

  const titleSizeClasses = {
    sm: 'text-xs',
    default: 'text-sm',
    lg: 'text-base'
  };

  const valueSizeClasses = {
    sm: 'text-xl',
    default: 'text-3xl',
    lg: 'text-4xl'
  };

  // Professional color schemes for operations
  const colorSchemes = {
    default: {
  icon: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
  card: 'bg-slate-50 border-stone-200 dark:bg-slate-900 dark:border-stone-600'
    },
    primary: {
  icon: 'bg-primary-50 text-primary-600 dark:bg-primary-950 dark:text-primary-400',
  card: 'bg-slate-50 border-stone-200 dark:bg-slate-900 dark:border-stone-600'
    },
    success: {
  icon: 'bg-success-50 text-success-600 dark:bg-success-950 dark:text-success-400',
  card: 'bg-slate-50 border-stone-200 dark:bg-slate-900 dark:border-stone-600'
    },
    warning: {
  icon: 'bg-warning-50 text-warning-600 dark:bg-warning-950 dark:text-warning-400',
  card: 'bg-slate-50 border-stone-200 dark:bg-slate-900 dark:border-stone-600'
    },
    danger: {
  icon: 'bg-danger-50 text-danger-600 dark:bg-danger-950 dark:text-danger-400',
  card: 'bg-slate-50 border-stone-200 dark:bg-slate-900 dark:border-stone-600'
    }
  };

  // Trend analysis and formatting
  const getTrendInfo = (change) => {
    if (typeof change !== 'number' || isNaN(change)) {
      return { type: 'neutral', icon: MinusIcon, color: 'text-slate-500' };
    }
    
    if (change > 0) {
      return { 
        type: 'positive', 
        icon: ArrowUpIcon, 
  color: 'text-success-600 dark:text-success-400' 
      };
    } else if (change < 0) {
      return { 
        type: 'negative', 
        icon: ArrowDownIcon, 
  color: 'text-danger-600 dark:text-danger-400' 
      };
    }
    
    return { type: 'neutral', icon: MinusIcon, color: 'text-slate-500' };
  };

  const formatValue = (val) => {
    if (loading) return '---';
    if (typeof val === 'number') {
      // Format large numbers with proper separators
      return val.toLocaleString();
    }
    return val || '---';
  };

  const formatChange = (change) => {
    if (typeof change !== 'number' || isNaN(change)) return '';
    const sign = change > 0 ? '+' : '';
    return `${sign}${change.toFixed(1)}%`;
  };

  const scheme = colorSchemes[color] || colorSchemes.default;
  const trend = getTrendInfo(change);

  const cardContent = (
    <div className={cn(
      'relative overflow-hidden rounded-lg border shadow-subtle hover:shadow-elevation transition-all duration-200',
      scheme.card,
      sizeClasses[size],
  onClick && 'cursor-pointer hover:border-stone-300 dark:hover:border-stone-500',
      className
    )}>
      {/* Loading overlay */}
      {loading && (
  <div className="absolute inset-0 bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-10">
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary-500 border-r-transparent" />
        </div>
      )}

      {/* Header with icon and status */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          {Icon && (
            <div className={cn(
              'rounded-lg p-2 flex-shrink-0',
              scheme.icon
            )}>
              <Icon className="h-5 w-5" aria-hidden="true" />
            </div>
          )}
          
          <div className="min-w-0 flex-1">
            <h3 className={cn(
              'font-subheading text-slate-700 dark:text-slate-300 tracking-tight truncate',
              titleSizeClasses[size]
            )}>
              {title}
            </h3>
            {subtitle && (
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {status && (
          <div className="flex-shrink-0">
            {status}
          </div>
        )}
      </div>

      {/* Main value */}
      <div className="mt-4">
        <div className="flex items-baseline gap-2">
          <span className={cn(
            'font-bold text-slate-900 dark:text-slate-100 tracking-tight tabular-nums',
            valueSizeClasses[size]
          )}>
            {formatValue(value)}
          </span>
          {unit && (
            <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">
              {unit}
            </span>
          )}
        </div>

        {/* Trend indicator */}
        {showTrend && (change !== undefined && change !== null) && (
          <div className="flex items-center gap-2 mt-2">
            <div className={cn(
              'flex items-center gap-1 text-sm font-medium',
              trend.color
            )}>
              <trend.icon className="h-3 w-3" aria-hidden="true" />
              <span className="tabular-nums">
                {formatChange(change)}
              </span>
            </div>
            {changeLabel && (
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {changeLabel}
              </span>
            )}
          </div>
        )}

        {/* Simple sparkline placeholder */}
        {sparklineData && sparklineData.length > 0 && (
          <div className="mt-3 h-8 flex items-end gap-0.5" aria-hidden="true">
            {sparklineData.slice(-12).map((point, index) => (
              <div
                key={index}
                className="bg-primary-200 dark:bg-primary-800 rounded-sm flex-1 transition-all duration-300"
                style={{ 
                  height: `${Math.max(2, (point / Math.max(...sparklineData)) * 100)}%` 
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Screen reader content */}
      <div className="sr-only">
        <span>Metric: {title}</span>
        <span>Value: {formatValue(value)} {unit}</span>
        {change !== undefined && change !== null && (
          <span>Change: {formatChange(change)} {changeLabel}</span>
        )}
      </div>
    </div>
  );

  if (onClick) {
    return (
      <motion.button
        ref={ref}
        onClick={onClick}
        className="w-full text-left"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        transition={{ duration: 0.15, ease: 'easeOut' }}
        {...props}
      >
        {cardContent}
      </motion.button>
    );
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      {...props}
    >
      {cardContent}
    </motion.div>
  );
});

MetricsCard.displayName = 'MetricsCard';

export default MetricsCard;