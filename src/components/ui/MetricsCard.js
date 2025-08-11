import React from 'react';
import { TrendingUpIcon, TrendingDownIcon } from '@heroicons/react/24/outline';
import { cn } from '../../utils/cn';
import { Card, CardContent } from './Card';

/**
 * Metrics card for displaying KPIs in sports operations dashboard
 * Shows big numbers with trend indicators and optional sparkline placeholder
 */
export function MetricsCard({ 
  title, 
  value, 
  change,
  changeType,
  icon: Icon, 
  color = 'primary',
  loading = false,
  className = '',
  onClick,
  subtitle,
  ...props
}) {
  const colorClasses = {
    primary: 'text-primary-600 [data-theme="dark"] &:text-primary-400',
    secondary: 'text-secondary-600 [data-theme="dark"] &:text-secondary-400',
    success: 'text-success-600 [data-theme="dark"] &:text-success-400',
    warning: 'text-warning-600 [data-theme="dark"] &:text-warning-400',
    danger: 'text-danger-600 [data-theme="dark"] &:text-danger-400',
    info: 'text-info-600 [data-theme="dark"] &:text-info-400',
  };

  const getTrendIcon = () => {
    if (changeType === 'positive' || (change && change > 0)) {
      return <TrendingUpIcon className="w-4 h-4 text-success-500" />;
    }
    if (changeType === 'negative' || (change && change < 0)) {
      return <TrendingDownIcon className="w-4 h-4 text-danger-500" />;
    }
    return null;
  };

  const formatChange = (change) => {
    if (typeof change === 'number') {
      const sign = change > 0 ? '+' : '';
      return `${sign}${change}%`;
    }
    return change;
  };

  const CardComponent = onClick ? 'button' : 'div';

  return (
    <CardComponent
      onClick={onClick}
      className={cn(
        onClick && 'transition-all duration-150 hover:shadow-elevated focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-surface-950 [data-theme="light"] &:focus:ring-offset-surface-50',
        className
      )}
      {...props}
    >
      <Card className="h-full">
        <CardContent className="p-6">
          {loading ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="skeleton h-4 w-20"></div>
                <div className="skeleton h-6 w-6 rounded"></div>
              </div>
              <div className="skeleton h-8 w-16"></div>
              <div className="skeleton h-3 w-24"></div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted truncate">
                  {title}
                </p>
                {Icon && (
                  <div className={cn('p-2 rounded-md bg-surface-800 [data-theme="light"] &:bg-surface-100', colorClasses[color])}>
                    <Icon className="w-5 h-5" />
                  </div>
                )}
              </div>
              
              <div className="space-y-1">
                <p className="text-2xl font-semibold tracking-tight text-surface-50 [data-theme='light'] &:text-surface-950 tabular-nums">
                  {value}
                </p>
                {subtitle && (
                  <p className="text-xs text-subtle">
                    {subtitle}
                  </p>
                )}
              </div>

              {(change !== undefined && change !== null) && (
                <div className="flex items-center gap-1">
                  {getTrendIcon()}
                  <span className={cn(
                    'text-sm font-medium tabular-nums',
                    changeType === 'positive' || (change && change > 0) ? 'text-success-600 [data-theme="dark"] &:text-success-400' :
                    changeType === 'negative' || (change && change < 0) ? 'text-danger-600 [data-theme="dark"] &:text-danger-400' :
                    'text-muted'
                  )}>
                    {formatChange(change)}
                  </span>
                  <span className="text-xs text-subtle">vs last period</span>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </CardComponent>
  );
}

export default MetricsCard;