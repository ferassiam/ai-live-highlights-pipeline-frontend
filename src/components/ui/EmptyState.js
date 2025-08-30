import React from 'react';
import { cn } from '../../utils/cn';

export function EmptyState({ title = 'Nothing here yet', description, icon: Icon, children, className }) {
  return (
    <div className={cn('text-center py-16 px-6 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm', className)}>
      {Icon && (
        <div className="mx-auto mb-4 h-12 w-12 text-slate-400 dark:text-slate-500">
          <Icon className="h-12 w-12" />
        </div>
      )}
      <h3 className="mt-2 text-sm font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
      {description && (
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{description}</p>
      )}
      {children && <div className="mt-6 flex items-center justify-center gap-2">{children}</div>}
    </div>
  );
}

export default EmptyState;
