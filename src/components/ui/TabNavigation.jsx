import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

// Professional tab navigation for sports operations
export const TabNavigation = React.forwardRef(({ 
  tabs = [], 
  activeTab, 
  onTabChange, 
  orientation = 'horizontal',
  size = 'default',
  variant = 'line',
  sticky = false,
  className = '',
  tabClassName = '',
  ...props
}, ref) => {
  const [focusedTab, setFocusedTab] = useState(null);
  const tabRefs = useRef({});
  const isHorizontal = orientation === 'horizontal';

  // Size variants
  const sizeClasses = {
    sm: isHorizontal ? 'py-2 px-3 text-xs' : 'py-1.5 px-2 text-xs',
    default: isHorizontal ? 'py-3 px-4 text-sm' : 'py-2 px-3 text-sm',
    lg: isHorizontal ? 'py-4 px-6 text-base' : 'py-3 px-4 text-base'
  };

  // Tab variants  
  const variantClasses = {
    line: {
      container: isHorizontal 
        ? 'border-b border-stone-200 dark:border-stone-600' 
        : 'space-y-1',
      active: isHorizontal
  ? 'border-b-2 border-primary-500 text-primary-700 dark:text-primary-300'
  : 'bg-primary-50 dark:bg-primary-950 text-primary-700 dark:text-primary-300',
      inactive: isHorizontal
  ? 'border-b-2 border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:border-stone-300 dark:hover:border-stone-500'
  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800'
    },
    pills: {
  container: isHorizontal ? 'flex gap-1' : 'space-y-1',
      active: 'bg-primary-500 text-white shadow-sm',
  inactive: 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800'
    },
    segments: {
      container: isHorizontal 
        ? 'inline-flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1' 
        : 'bg-slate-100 dark:bg-slate-800 rounded-lg p-1 space-y-1',
      active: 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm',
      inactive: 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
    }
  };

  // Keyboard navigation
  const handleKeyDown = (event, tabId) => {
    const tabIds = tabs.filter(tab => !tab.disabled).map(tab => tab.id);
    const currentIndex = tabIds.indexOf(tabId);
    
    let nextIndex = currentIndex;
    
    switch (event.key) {
      case 'ArrowLeft':
      case 'ArrowUp':
        event.preventDefault();
        nextIndex = currentIndex > 0 ? currentIndex - 1 : tabIds.length - 1;
        break;
      case 'ArrowRight':
      case 'ArrowDown':
        event.preventDefault();
        nextIndex = currentIndex < tabIds.length - 1 ? currentIndex + 1 : 0;
        break;
      case 'Home':
        event.preventDefault();
        nextIndex = 0;
        break;
      case 'End':
        event.preventDefault();
        nextIndex = tabIds.length - 1;
        break;
      default:
        return;
    }

    const nextTabId = tabIds[nextIndex];
    setFocusedTab(nextTabId);
    tabRefs.current[nextTabId]?.focus();
  };

  // Auto-focus management
  useEffect(() => {
    if (focusedTab && tabRefs.current[focusedTab]) {
      tabRefs.current[focusedTab].focus();
    }
  }, [focusedTab]);

  const currentVariant = variantClasses[variant] || variantClasses.line;

  return (
    <div 
      ref={ref} 
      className={cn(
  sticky && 'sticky top-0 z-10 bg-slate-50 dark:bg-slate-950',
        className
      )}
      {...props}
    >
      <nav 
        className={cn(
          'flex',
          isHorizontal ? 'overflow-x-auto scrollbar-hide' : 'flex-col',
          currentVariant.container
        )}
        role="tablist"
        aria-label="Navigation tabs"
        aria-orientation={orientation}
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const isFocused = focusedTab === tab.id;
          
          return (
            <motion.button
              key={tab.id}
              ref={(el) => {
                if (el) tabRefs.current[tab.id] = el;
              }}
              onClick={() => {
                if (!tab.disabled) {
                  onTabChange(tab.id);
                  setFocusedTab(tab.id);
                }
              }}
              onKeyDown={(e) => handleKeyDown(e, tab.id)}
              onFocus={() => setFocusedTab(tab.id)}
              onBlur={() => {
                if (focusedTab === tab.id) {
                  setFocusedTab(null);
                }
              }}
              disabled={tab.disabled}
              role="tab"
              aria-selected={isActive}
              aria-controls={`tabpanel-${tab.id}`}
              tabIndex={isActive || isFocused ? 0 : -1}
              className={cn(
                'group relative transition-all duration-200',
                'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
                'focus:ring-offset-slate-50 dark:focus:ring-offset-slate-950',
                variant === 'pills' || variant === 'segments' ? 'rounded-lg' : '',
                isHorizontal ? 'flex-shrink-0 whitespace-nowrap' : 'w-full text-left',
                sizeClasses[size],
                isActive ? currentVariant.active : currentVariant.inactive,
                tab.disabled && 'cursor-not-allowed opacity-50',
                !tab.disabled && 'cursor-pointer',
                tabClassName
              )}
              whileHover={
                tab.disabled ? {} : { scale: 1.01 }
              }
              whileTap={
                tab.disabled ? {} : { scale: 0.99 }
              }
              transition={{ duration: 0.15, ease: 'easeOut' }}
            >
              <div className="flex items-center gap-2">
                {/* Icon */}
                {tab.icon && (
                  <tab.icon
                    className={cn(
                      'h-4 w-4 flex-shrink-0',
                      isActive 
                        ? 'text-current' 
                        : 'text-slate-500 dark:text-slate-400 group-hover:text-current'
                    )}
                    aria-hidden="true"
                  />
                )}
                
                {/* Label */}
                <span className="font-subheading tracking-tight">
                  {tab.name}
                </span>
                
                {/* Badge/Count */}
                {tab.count !== undefined && (
                  <span className={cn(
                    'inline-flex items-center justify-center px-1.5 py-0.5 rounded-full text-xs font-medium tabular-nums',
                    isActive
                      ? 'bg-primary-600 text-white dark:bg-primary-400 dark:text-primary-950'
                      : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                  )}>
                    {tab.count}
                  </span>
                )}

                {/* Alert dot */}
                {tab.alert && (
                  <div className={cn(
                    'w-2 h-2 rounded-full flex-shrink-0',
                    tab.alert === 'danger' 
                      ? 'bg-danger-500' 
                      : tab.alert === 'warning' 
                      ? 'bg-warning-500' 
                      : 'bg-info-500'
                  )} aria-hidden="true" />
                )}

                {/* Badge text */}
                {tab.badge && (
                  <span className={cn(
                    'inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium',
                    isActive
                      ? 'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200'
                      : 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                  )}>
                    {tab.badge}
                  </span>
                )}
              </div>

              {/* Screen reader content */}
              <span className="sr-only">
                {isActive ? 'Current tab: ' : 'Tab: '}
                {tab.name}
                {tab.count !== undefined && ` (${tab.count})`}
                {tab.alert && ' - Has alerts'}
                {tab.disabled && ' - Disabled'}
              </span>
            </motion.button>
          );
        })}
      </nav>
    </div>
  );
});

TabNavigation.displayName = 'TabNavigation';

export default TabNavigation;