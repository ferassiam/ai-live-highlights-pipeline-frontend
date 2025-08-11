import React from 'react';
import { cn } from '../../utils/cn';

/**
 * Tab navigation component for sports operations UI
 * Supports keyboard navigation, badges, and sticky positioning
 */
export function TabNavigation({ 
  tabs, 
  activeTab, 
  onTabChange, 
  orientation = 'horizontal',
  sticky = false,
  className = '',
  tabClassName = '',
  size = 'md'
}) {
  const isHorizontal = orientation === 'horizontal';

  const handleKeyDown = (event, tabId) => {
    const currentIndex = tabs.findIndex(tab => tab.id === tabId);
    let nextIndex = currentIndex;

    switch (event.key) {
      case 'ArrowLeft':
      case 'ArrowUp':
        event.preventDefault();
        nextIndex = currentIndex > 0 ? currentIndex - 1 : tabs.length - 1;
        break;
      case 'ArrowRight':
      case 'ArrowDown':
        event.preventDefault();
        nextIndex = currentIndex < tabs.length - 1 ? currentIndex + 1 : 0;
        break;
      case 'Home':
        event.preventDefault();
        nextIndex = 0;
        break;
      case 'End':
        event.preventDefault();
        nextIndex = tabs.length - 1;
        break;
      default:
        return;
    }

    const nextTab = tabs[nextIndex];
    if (nextTab && !nextTab.disabled) {
      onTabChange(nextTab.id);
    }
  };

  const sizeClasses = {
    sm: isHorizontal ? 'py-2 px-3 text-sm' : 'py-2 px-3 text-sm',
    md: isHorizontal ? 'py-3 px-4 text-sm' : 'py-2 px-3 text-sm',
    lg: isHorizontal ? 'py-4 px-6 text-base' : 'py-3 px-4 text-base'
  };

  return (
    <div className={cn(
      sticky && 'sticky top-0 z-10 bg-surface-950 [data-theme="light"] &:bg-surface-50',
      className
    )}>
      <nav 
        className={cn(
          isHorizontal 
            ? 'flex border-b border-stone-700 [data-theme="light"] &:border-stone-200' 
            : 'space-y-1',
          'overflow-x-auto'
        )}
        role="tablist"
        aria-orientation={orientation}
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const isDisabled = tab.disabled;
          
          return (
            <button
              key={tab.id}
              role="tab"
              tabIndex={isActive ? 0 : -1}
              aria-selected={isActive}
              aria-disabled={isDisabled}
              onClick={() => !isDisabled && onTabChange(tab.id)}
              onKeyDown={(e) => handleKeyDown(e, tab.id)}
              disabled={isDisabled}
              className={cn(
                'group relative flex items-center gap-2 font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-surface-950 [data-theme="light"] &:focus:ring-offset-surface-50',
                sizeClasses[size],
                isHorizontal 
                  ? cn(
                      'border-b-2 whitespace-nowrap',
                      isActive
                        ? 'border-primary-500 text-primary-600 [data-theme="dark"] &:text-primary-400'
                        : 'border-transparent text-muted hover:text-surface-200 [data-theme="light"] &:hover:text-surface-700 hover:border-stone-600 [data-theme="light"] &:hover:border-stone-300',
                      isDisabled && 'cursor-not-allowed opacity-50'
                    )
                  : cn(
                      'w-full text-left rounded-md',
                      isActive
                        ? 'bg-primary-100 [data-theme="dark"] &:bg-primary-950 text-primary-700 [data-theme="dark"] &:text-primary-300'
                        : 'text-muted hover:text-surface-200 [data-theme="light"] &:hover:text-surface-700 hover:bg-surface-800 [data-theme="light"] &:hover:bg-surface-100',
                      isDisabled && 'cursor-not-allowed opacity-50'
                    ),
                tabClassName
              )}
            >
              {tab.icon && (
                <tab.icon
                  className={cn(
                    'w-4 h-4 flex-shrink-0',
                    isActive
                      ? 'text-primary-600 [data-theme="dark"] &:text-primary-400'
                      : 'text-muted group-hover:text-surface-300 [data-theme="light"] &:group-hover:text-surface-600'
                  )}
                />
              )}
              
              <span className="flex-1 truncate">
                {tab.name}
              </span>
              
              {(tab.badge || tab.count !== undefined) && (
                <span className={cn(
                  'inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-medium min-w-[1.25rem] h-5',
                  isActive
                    ? 'bg-primary-200 [data-theme="dark"] &:bg-primary-800 text-primary-800 [data-theme="dark"] &:text-primary-200'
                    : 'bg-surface-700 [data-theme="light"] &:bg-surface-200 text-surface-300 [data-theme="light"] &:text-surface-600'
                )}>
                  {tab.badge || tab.count}
                </span>
              )}
              
              {tab.alert && (
                <span className="w-2 h-2 bg-danger-500 rounded-full animate-pulse-subtle" />
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
}

export default TabNavigation;