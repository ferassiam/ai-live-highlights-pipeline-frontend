import React from 'react';
import { cn } from '../../utils/cn';

export function ActionBar({ children, className, sticky = false }) {
  return (
    <div
      className={cn(
        'flex flex-wrap items-center justify-end gap-2',
        sticky && 'sticky top-0 z-30 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-slate-900/50 bg-white/90 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-700 py-3',
        !sticky && 'py-2',
        className,
      )}
    >
      {children}
    </div>
  );
}

export default ActionBar;
