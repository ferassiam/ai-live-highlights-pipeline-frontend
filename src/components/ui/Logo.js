import React from 'react';
import { cn } from '../../utils/cn';

/**
 * Professional logo component for sports operations
 * Simple wordmark without AI imagery
 */
export const Logo = ({ size = 'md', showText = true, className, variant = 'full' }) => {
  const sizeClasses = {
    sm: {
      icon: 'h-6 w-6',
      text: 'text-base',
      subtitle: 'text-xs'
    },
    md: {
      icon: 'h-8 w-8', 
      text: 'text-lg',
      subtitle: 'text-xs'
    },
    lg: {
      icon: 'h-10 w-10',
      text: 'text-xl',
      subtitle: 'text-sm'
    }
  };

  const IconComponent = () => (
    <div className={cn(
      'bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center shadow-sm',
      sizeClasses[size].icon
    )}>
      <svg 
        className={cn('text-white', size === 'sm' ? 'h-3 w-3' : size === 'lg' ? 'h-6 w-6' : 'h-5 w-5')} 
        fill="currentColor" 
        viewBox="0 0 24 24"
      >
        <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z"/>
        <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" fill="none"/>
      </svg>
    </div>
  );

  if (variant === 'icon') {
    return <IconComponent />;
  }

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <IconComponent />
      {showText && (
        <div className="flex flex-col">
          <h1 className={cn(
            'font-semibold tracking-tight text-surface-50 [data-theme="light"] &:text-surface-950',
            sizeClasses[size].text
          )}>
            SportsOps
          </h1>
          {size !== 'sm' && (
            <p className={cn(
              'text-muted font-medium tracking-wide',
              sizeClasses[size].subtitle
            )}>
              Live Operations
            </p>
          )}
        </div>
      )}
    </div>
  );
};