import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

// Professional status configurations for sports operations
const statusConfigs = {
  // Primary operational statuses
  live: {
    dotColor: 'bg-success-500',
    ringColor: 'ring-success-500/20',
    text: 'Live',
    accessible: true,
    animationType: 'pulse'
  },
  scheduled: {
    dotColor: 'bg-secondary-500',
    ringColor: 'ring-secondary-500/20',
    text: 'Scheduled',
    accessible: true,
    animationType: 'none'
  },
  processing: {
    dotColor: 'bg-warning-500',
    ringColor: 'ring-warning-500/20',
    text: 'Processing',
    accessible: true,
    animationType: 'spin'
  },
  completed: {
    dotColor: 'bg-info-500',
    ringColor: 'ring-info-500/20',
    text: 'Completed',
    accessible: true,
    animationType: 'none'
  },
  failed: {
    dotColor: 'bg-danger-500',
    ringColor: 'ring-danger-500/20',
    text: 'Failed',
    accessible: true,
    animationType: 'none'
  },
  paused: {
    dotColor: 'bg-slate-400',
    ringColor: 'ring-slate-400/20',
    text: 'Paused',
    accessible: true,
    animationType: 'none'
  },
  
  // System health statuses
  healthy: {
    dotColor: 'bg-success-500',
    ringColor: 'ring-success-500/20',
    text: 'Healthy',
    accessible: true,
    animationType: 'pulse'
  },
  degraded: {
    dotColor: 'bg-warning-500',
    ringColor: 'ring-warning-500/20',
    text: 'Degraded',
    accessible: true,
    animationType: 'pulse'
  },
  unhealthy: {
    dotColor: 'bg-danger-500',
    ringColor: 'ring-danger-500/20',
    text: 'Unhealthy',
    accessible: true,
    animationType: 'pulse'
  },

  // Legacy support
  running: {
    dotColor: 'bg-success-500',
    ringColor: 'ring-success-500/20',
    text: 'Running',
    accessible: true,
    animationType: 'pulse'
  },
  stopped: {
    dotColor: 'bg-slate-400',
    ringColor: 'ring-slate-400/20',
    text: 'Stopped',
    accessible: true,
    animationType: 'none'
  },
  error: {
    dotColor: 'bg-danger-500',
    ringColor: 'ring-danger-500/20',
    text: 'Error',
    accessible: true,
    animationType: 'none'
  },
  warning: {
    dotColor: 'bg-warning-500',
    ringColor: 'ring-warning-500/20',
    text: 'Warning',
    accessible: true,
    animationType: 'none'
  },
  pending: {
    dotColor: 'bg-warning-500',
    ringColor: 'ring-warning-500/20',
    text: 'Pending',
    accessible: true,
    animationType: 'spin'
  }
};

const animations = {
  pulse: {
    scale: [1, 1.15, 1],
    transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' }
  },
  spin: {
    rotate: 360,
    transition: { duration: 1, repeat: Infinity, ease: 'linear' }
  },
  none: {}
};

export const StatusIndicator = React.forwardRef(({ 
  status, 
  animated = true, 
  showText = true,
  showRing = false,
  size = 'default',
  className,
  ...props 
}, ref) => {
  const config = statusConfigs[status?.toLowerCase()] || statusConfigs.stopped;
  
  const sizeClasses = {
    sm: 'h-1.5 w-1.5',
    default: 'h-2 w-2', 
    lg: 'h-3 w-3',
    xl: 'h-4 w-4'
  };

  const textSizeClasses = {
    sm: 'text-xs',
    default: 'text-sm',
    lg: 'text-base',
    xl: 'text-lg'
  };

  // Animation based on status
  const animationProps = animated && config.animationType !== 'none' 
    ? animations[config.animationType] 
    : {};

  // Dot only component
  const DotIndicator = () => (
    <motion.div
      ref={ref}
      className={cn(
        'rounded-full flex-shrink-0',
        config.dotColor,
        sizeClasses[size],
        showRing && `ring-2 ${config.ringColor}`,
  'dark:ring-opacity-40',
        className
      )}
      animate={animationProps}
      aria-hidden={!config.accessible}
      {...props}
    />
  );

  // Text with dot component
  if (showText) {
    return (
      <div
        ref={ref}
        className={cn(
          'inline-flex items-center gap-2',
          textSizeClasses[size],
          'text-slate-700 dark:text-slate-300',
          'font-subheading tracking-tight',
          className
        )}
        {...props}
      >
        <DotIndicator />
        <span>{config.text}</span>
        {config.accessible && (
          <span className="sr-only">Status: {config.text}</span>
        )}
      </div>
    );
  }

  return <DotIndicator />;
});

StatusIndicator.displayName = 'StatusIndicator';

// Specific status indicator components for better developer experience
export const LiveIndicator = React.forwardRef((props, ref) => (
  <StatusIndicator ref={ref} status="live" animated showRing {...props} />
));

LiveIndicator.displayName = 'LiveIndicator';

export const ProcessingIndicator = React.forwardRef((props, ref) => (
  <StatusIndicator ref={ref} status="processing" animated {...props} />
));

ProcessingIndicator.displayName = 'ProcessingIndicator';

export const HealthIndicator = React.forwardRef(({ health, ...props }, ref) => (
  <StatusIndicator 
    ref={ref} 
    status={health || 'healthy'} 
    animated={health !== 'healthy'}
    showRing={health === 'degraded' || health === 'unhealthy'}
    {...props} 
  />
));

HealthIndicator.displayName = 'HealthIndicator';