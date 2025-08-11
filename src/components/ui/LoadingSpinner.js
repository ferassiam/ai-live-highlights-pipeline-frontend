import React from 'react';
import { cn } from '../../utils/cn';

/**
 * Loading spinner and skeleton components for sports operations UI
 * Provides consistent loading states across the application
 */
export const LoadingSpinner = ({ size = 'md', className, ...props }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12',
  };

  return (
    <div
      className={cn(
        'animate-spin rounded-full border-2 border-surface-700 border-t-primary-500',
        '[data-theme="light"] &:border-surface-300 [data-theme="light"] &:border-t-primary-500',
        sizeClasses[size],
        className
      )}
      {...props}
    />
  );
};

export const LoadingPage = ({ message = 'Loading...' }) => (
  <div className="min-h-screen flex items-center justify-center bg-surface-950 [data-theme='light'] &:bg-surface-50">
    <div className="text-center space-y-4">
      <LoadingSpinner size="xl" />
      <p className="text-muted font-medium">{message}</p>
    </div>
  </div>
);

/**
 * Skeleton loading components for different content types
 */
export const Skeleton = ({ className, ...props }) => (
  <div
    className={cn('skeleton', className)}
    {...props}
  />
);

export const SkeletonText = ({ lines = 1, className }) => (
  <div className={cn('space-y-2', className)}>
    {Array.from({ length: lines }).map((_, i) => (
      <div
        key={i}
        className={cn(
          'skeleton-text',
          i === lines - 1 && lines > 1 && 'w-3/4' // Last line shorter
        )}
      />
    ))}
  </div>
);

export const SkeletonCard = ({ className }) => (
  <div className={cn('card p-6 space-y-4', className)}>
    <div className="flex items-center justify-between">
      <div className="skeleton h-5 w-32"></div>
      <div className="skeleton h-8 w-8 rounded"></div>
    </div>
    <div className="skeleton h-8 w-20"></div>
    <SkeletonText lines={2} />
  </div>
);

export const SkeletonTable = ({ rows = 5, columns = 4, className }) => (
  <div className={cn('card', className)}>
    <div className="card-header">
      <div className="skeleton h-5 w-40"></div>
    </div>
    <div className="card-content p-0">
      <div className="divide-y divide-subtle">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="p-4 flex items-center gap-4">
            {Array.from({ length: columns }).map((_, colIndex) => (
              <div
                key={colIndex}
                className={cn(
                  'skeleton h-4',
                  colIndex === 0 ? 'w-24' : 'flex-1'
                )}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  </div>
);

export const SkeletonList = ({ items = 5, className }) => (
  <div className={cn('space-y-3', className)}>
    {Array.from({ length: items }).map((_, i) => (
      <div key={i} className="flex items-center gap-3 p-3 card">
        <div className="skeleton-avatar"></div>
        <div className="flex-1 space-y-2">
          <div className="skeleton h-4 w-3/4"></div>
          <div className="skeleton h-3 w-1/2"></div>
        </div>
        <div className="skeleton h-8 w-16 rounded-md"></div>
      </div>
    ))}
  </div>
);