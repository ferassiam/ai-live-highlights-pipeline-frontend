import { cn } from '../../utils/cn.jsx';

export function LoadingSpinner({ className, message, size = 'md', ...props }) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-2" {...props}>
      <div
        className={cn(
          'animate-spin rounded-full border-2 border-current border-r-transparent',
          sizeClasses[size],
          className
        )}
      />
      {message && (
        <p className="text-sm text-gray-600 dark:text-gray-400">{message}</p>
      )}
    </div>
  );
}

export function LoadingPage({ message = "Loading..." }) {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <LoadingSpinner size="lg" message={message} />
    </div>
  );
}

export default LoadingSpinner;