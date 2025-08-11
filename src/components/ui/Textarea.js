import React from 'react';
import { cn } from '../../utils/cn';

/**
 * Textarea component for sports operations UI
 * Consistent with Input styling and behavior
 */
export const Textarea = React.forwardRef(({ 
  className,
  error,
  helpText,
  rows = 3,
  ...props 
}, ref) => {
  const textareaId = props.id || `textarea-${Math.random().toString(36).substr(2, 9)}`;
  const errorId = error ? `${textareaId}-error` : undefined;
  const helpId = helpText ? `${textareaId}-help` : undefined;

  return (
    <div>
      <textarea
        ref={ref}
        id={textareaId}
        rows={rows}
        className={cn(
          'form-textarea',
          error && 'border-danger-500 focus:border-danger-500 focus:ring-danger-500',
          className
        )}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={cn(errorId, helpId).trim() || undefined}
        {...props}
      />
      {error && (
        <p id={errorId} className="mt-1 text-sm text-danger-600 [data-theme='dark'] &:text-danger-400">
          {error}
        </p>
      )}
      {helpText && !error && (
        <p id={helpId} className="mt-1 text-sm text-muted">
          {helpText}
        </p>
      )}
    </div>
  );
});

Textarea.displayName = 'Textarea';