import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn.jsx';

export const ProfessionalMetricCard = ({ 
  title, 
  value, 
  subtitle,
  trend,
  icon: Icon, 
  color = 'emerald',
  loading = false,
  className = '',
  onClick,
  delay = 0
}) => {
  const colorClasses = {
    emerald: {
      icon: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400',
      trend: 'text-emerald-600 dark:text-emerald-400',
    },
    blue: {
      icon: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
      trend: 'text-blue-600 dark:text-blue-400',
    },
    purple: {
      icon: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
      trend: 'text-purple-600 dark:text-purple-400',
    },
    orange: {
      icon: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
      trend: 'text-orange-600 dark:text-orange-400',
    },
    red: {
      icon: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
      trend: 'text-red-600 dark:text-red-400',
    },
    slate: {
      icon: 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400',
      trend: 'text-slate-600 dark:text-slate-400',
    },
  };

  const colors = colorClasses[color] || colorClasses.emerald;

  const cardContent = (
    <div className={cn(
      'relative overflow-hidden bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-200',
      className
    )}>
      {loading && (
        <div className="absolute inset-0 bg-white/50 dark:bg-slate-800/50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-emerald-600 border-r-transparent"></div>
        </div>
      )}
      
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
            {title}
          </p>
          <p className="text-3xl font-bold text-slate-900 dark:text-white tabular-nums">
            {loading ? '...' : value}
          </p>
          {subtitle && (
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {subtitle}
            </p>
          )}
          {trend && !loading && (
            <div className={cn('flex items-center mt-2 text-sm', colors.trend)}>
              <span className="font-medium">{trend.value}</span>
              <span className="ml-1 text-slate-500 dark:text-slate-400">{trend.label}</span>
            </div>
          )}
        </div>
        
        {Icon && (
          <div className={cn('w-12 h-12 rounded-lg flex items-center justify-center', colors.icon)}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
      
      {/* Subtle accent line */}
      <div className={cn('absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r', 
        color === 'emerald' ? 'from-emerald-500 to-emerald-600' :
        color === 'blue' ? 'from-blue-500 to-blue-600' :
        color === 'purple' ? 'from-purple-500 to-purple-600' :
        color === 'orange' ? 'from-orange-500 to-orange-600' :
        color === 'red' ? 'from-red-500 to-red-600' :
        'from-slate-500 to-slate-600'
      )} />
    </div>
  );

  if (onClick) {
    return (
      <motion.button
        onClick={onClick}
        className="w-full text-left"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {cardContent}
      </motion.button>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      {cardContent}
    </motion.div>
  );
};

export default ProfessionalMetricCard;