import React from 'react';
import { cn } from '../../utils/cn.jsx';

export function PageHeader({
  title,
  description,
  icon: Icon,
  actions,
  className,
}) {
  return (
    <div className={cn('flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4', className)}>
      <div className="min-w-0 flex-1">
        <h1 className="text-2xl font-heading font-bold text-slate-900 dark:text-slate-100 tracking-tight flex items-center">
          {Icon && <Icon className="h-7 w-7 mr-3 text-slate-700 dark:text-slate-300" />}
          {title}
        </h1>
        {description && (
          <p className="text-sm text-slate-600 dark:text-slate-400 font-medium mt-1">
            {description}
          </p>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-2 flex-shrink-0">
          {actions}
        </div>
      )}
    </div>
  );
}

export default PageHeader;
