import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';
import { Badge } from './Badge';

export const StatusIndicator = ({ 
  status, 
  animated = true, 
  showText = true,
  className 
}) => {
  const getStatusConfig = (status) => {
    const configs = {
      running: {
        variant: 'success',
        text: 'Running',
        dotColor: 'bg-success-500',
      },
      stopped: {
        variant: 'secondary',
        text: 'Stopped',
        dotColor: 'bg-gray-400 dark:bg-dark-500',
      },
      error: {
        variant: 'danger',
        text: 'Error',
        dotColor: 'bg-danger-500',
      },
      warning: {
        variant: 'warning',
        text: 'Warning',
        dotColor: 'bg-warning-500',
      },
      pending: {
        variant: 'warning',
        text: 'Pending',
        dotColor: 'bg-warning-500',
      },
      healthy: {
        variant: 'success',
        text: 'Healthy',
        dotColor: 'bg-success-500',
      },
      degraded: {
        variant: 'warning',
        text: 'Degraded',
        dotColor: 'bg-warning-500',
      },
      unhealthy: {
        variant: 'danger',
        text: 'Unhealthy',
        dotColor: 'bg-danger-500',
      },
    };

    return configs[status?.toLowerCase()] || configs.stopped;
  };

  const config = getStatusConfig(status);

  if (showText) {
    return (
      <Badge variant={config.variant} className={cn('flex items-center gap-1.5', className)}>
        <motion.div
          className={cn('h-2 w-2 rounded-full', config.dotColor)}
          animate={animated && status === 'running' ? { scale: [1, 1.2, 1] } : {}}
          transition={{ duration: 2, repeat: Infinity }}
        />
        {config.text}
      </Badge>
    );
  }

  return (
    <motion.div
      className={cn('h-3 w-3 rounded-full', config.dotColor, className)}
      animate={animated && status === 'running' ? { scale: [1, 1.2, 1] } : {}}
      transition={{ duration: 2, repeat: Infinity }}
    />
  );
};