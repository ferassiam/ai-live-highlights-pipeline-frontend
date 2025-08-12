import React, { useState, useEffect, useCallback } from 'react';
import { cn } from '../../utils/cn';

const textareaSizes = {
  sm: 'min-h-[60px] px-3 py-2 text-sm',
  default: 'min-h-[100px] px-4 py-2.5 text-sm',
  lg: 'min-h-[120px] px-4 py-3 text-base'
};

export const Textarea = React.forwardRef(({ 
  className,
  error = false,
  success = false,
  size = 'default',
  resize = true,
  autoResize = false,
  maxRows = null,
  showCharCount = false,
  maxLength = null,
  ...props 
}, ref) => {
  const [charCount, setCharCount] = useState(0);

  const baseClasses = [
    'block w-full rounded-lg border transition-all duration-200',
    'font-medium tracking-tight leading-relaxed',
    'focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-slate-50',
    'disabled:cursor-not-allowed disabled:opacity-50',
  'dark:focus:ring-offset-slate-950',
    !resize && 'resize-none',
    autoResize && 'resize-none overflow-hidden'
  ];

  const stateClasses = error 
    ? [
        'border-danger-300 text-danger-900 placeholder:text-danger-500',
        'focus:border-danger-500 focus:ring-danger-500/20',
        'bg-danger-50',
  'dark:border-danger-700 dark:text-danger-100',
  'dark:placeholder:text-danger-400 dark:bg-danger-950/50'
      ]
    : success
    ? [
        'border-success-300 text-success-900 placeholder:text-success-500',
        'focus:border-success-500 focus:ring-success-500/20',
        'bg-success-50',
  'dark:border-success-700 dark:text-success-100',
  'dark:placeholder:text-success-400 dark:bg-success-950/50'
      ]
    : [
        'border-stone-200 text-slate-900 placeholder:text-slate-500',
        'focus:border-primary-500 focus:ring-primary-500/20',
        'bg-slate-50 focus:bg-white',
  'dark:border-stone-600 dark:text-slate-100',
  'dark:placeholder:text-slate-400',
  'dark:bg-slate-900 dark:focus:bg-slate-800'
      ];

  // Auto-resize functionality
  const handleAutoResize = useCallback((element) => {
    if (!autoResize || !element) return;
    element.style.height = 'auto';
    const scrollHeight = element.scrollHeight;

    if (maxRows) {
      const lineHeight = parseInt(getComputedStyle(element).lineHeight);
      const maxHeight = lineHeight * maxRows;
      element.style.height = Math.min(scrollHeight, maxHeight) + 'px';
      element.style.overflowY = scrollHeight > maxHeight ? 'auto' : 'hidden';
    } else {
      element.style.height = scrollHeight + 'px';
    }
  }, [autoResize, maxRows]);

  // Handle input changes
  const handleChange = (e) => {
    if (showCharCount || maxLength) {
      setCharCount(e.target.value.length);
    }
    
    handleAutoResize(e.target);
    
    if (props.onChange) {
      props.onChange(e);
    }
  };

  // Initialize character count
  useEffect(() => {
    if ((showCharCount || maxLength) && props.value) {
      setCharCount(props.value.length);
    }
  }, [props.value, showCharCount, maxLength]);

  // Initialize auto-resize
  useEffect(() => {
    if (autoResize && ref?.current) {
      handleAutoResize(ref.current);
    }
  }, [autoResize, props.value, handleAutoResize, ref]);

  return (
    <div className="space-y-1">
      <textarea
        className={cn(
          baseClasses,
          stateClasses,
          textareaSizes[size],
          className
        )}
        ref={ref}
        maxLength={maxLength}
        onChange={handleChange}
        {...props}
      />
      
      {(showCharCount || maxLength) && (
        <div className="flex justify-between items-center text-xs">
          {showCharCount && (
            <span className={cn(
              'text-slate-500',
              'dark:text-slate-400',
              maxLength && charCount > maxLength * 0.8 && 'text-warning-600',
              maxLength && charCount >= maxLength && 'text-danger-600'
            )}>
              {charCount}{maxLength && `/${maxLength}`} characters
            </span>
          )}
          {maxLength && charCount >= maxLength && (
            <span className="text-danger-600 dark:text-danger-400">
              Character limit reached
            </span>
          )}
        </div>
      )}
    </div>
  );
});

Textarea.displayName = 'Textarea';