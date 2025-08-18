import React from 'react';
import { cn } from '../../utils/cn';

export const Skeleton = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'animate-pulse rounded-md bg-slate-200',
  'dark:bg-slate-700',
      className
    )}
    {...props}
  />
));

Skeleton.displayName = 'Skeleton';

// Skeleton variants for common UI patterns
export const SkeletonText = React.forwardRef(({ 
  className, 
  lines = 1, 
  lastLineWidth = 'full',
  ...props 
}, ref) => {
  const widths = {
    full: 'w-full',
    '3/4': 'w-3/4',
    '2/3': 'w-2/3', 
    '1/2': 'w-1/2',
    '1/3': 'w-1/3',
    '1/4': 'w-1/4'
  };

  return (
    <div ref={ref} className={cn('space-y-2', className)} {...props}>
      {Array.from({ length: lines }, (_, i) => (
        <Skeleton 
          key={i} 
          className={cn(
            'h-4',
            i === lines - 1 ? widths[lastLineWidth] : 'w-full'
          )} 
        />
      ))}
    </div>
  );
});

SkeletonText.displayName = 'SkeletonText';

export const SkeletonCard = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('space-y-4', className)} {...props}>
    {/* Card header skeleton */}
    <div className="space-y-2">
      <Skeleton className="h-5 w-1/3" />
      <Skeleton className="h-4 w-1/2" />
    </div>
    {/* Card content skeleton */}
    <div className="space-y-2">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
    </div>
    {/* Card footer skeleton */}
    <div className="flex gap-2">
      <Skeleton className="h-8 w-20" />
      <Skeleton className="h-8 w-16" />
    </div>
  </div>
));

SkeletonCard.displayName = 'SkeletonCard';

export const SkeletonTable = React.forwardRef(({ 
  className, 
  rows = 5, 
  columns = 4,
  ...props 
}, ref) => (
  <div ref={ref} className={cn('space-y-3', className)} {...props}>
    {/* Table header skeleton */}
    <div className="flex gap-4">
      {Array.from({ length: columns }, (_, i) => (
        <Skeleton key={i} className="h-4 flex-1" />
      ))}
    </div>
    {/* Table rows skeleton */}
    {Array.from({ length: rows }, (_, rowIndex) => (
      <div key={rowIndex} className="flex gap-4">
        {Array.from({ length: columns }, (_, colIndex) => (
          <Skeleton key={colIndex} className="h-8 flex-1" />
        ))}
      </div>
    ))}
  </div>
));

SkeletonTable.displayName = 'SkeletonTable';

export const SkeletonMetric = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('space-y-2', className)} {...props}>
    {/* Large metric value */}
    <Skeleton className="h-8 w-24" />
    {/* Metric label */}
    <Skeleton className="h-4 w-16" />
    {/* Trend indicator */}
    <Skeleton className="h-3 w-12" />
  </div>
));

SkeletonMetric.displayName = 'SkeletonMetric';

export const SkeletonList = React.forwardRef(({ 
  className, 
  items = 5,
  showAvatar = false,
  ...props 
}, ref) => (
  <div ref={ref} className={cn('space-y-3', className)} {...props}>
    {Array.from({ length: items }, (_, i) => (
      <div key={i} className="flex items-center gap-3">
        {showAvatar && <Skeleton className="h-10 w-10 rounded-full" />}
        <div className="flex-1 space-y-1">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
    ))}
  </div>
));

SkeletonList.displayName = 'SkeletonList';