import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

export function TabNavigation({ 
  tabs, 
  activeTab, 
  onTabChange, 
  orientation = 'horizontal',
  className = '',
  tabClassName = ''
}) {
  const isHorizontal = orientation === 'horizontal';

  return (
    <div className={cn(className)}>
      <nav 
        className={cn(
          isHorizontal 
            ? 'flex space-x-8 border-b border-gray-200 dark:border-dark-700' 
            : 'space-y-1'
        )}
        aria-label="Tabs"
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            disabled={tab.disabled}
            className={cn(
              'group relative',
              isHorizontal 
                ? cn(
                    'py-4 px-1 text-center border-b-2 font-medium text-sm focus:outline-none transition-colors',
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                      : 'border-transparent text-gray-500 dark:text-dark-400 hover:text-gray-700 dark:hover:text-dark-200 hover:border-gray-300 dark:hover:border-dark-500',
                    tab.disabled && 'cursor-not-allowed opacity-50'
                  )
                : cn(
                    'text-left w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors focus:outline-none',
                    activeTab === tab.id
                      ? 'bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300'
                      : 'text-gray-600 dark:text-dark-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-dark-700',
                    tab.disabled && 'cursor-not-allowed opacity-50'
                  ),
              tabClassName
            )}
          >
            <motion.div
              className="flex items-center"
              whileHover={tab.disabled ? {} : { scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            >
              {tab.icon && (
                <tab.icon
                  className={cn(
                    isHorizontal ? 'mr-2 h-5 w-5' : 'mr-3 h-5 w-5',
                    activeTab === tab.id
                      ? 'text-primary-600 dark:text-primary-400'
                      : 'text-gray-400 dark:text-dark-500 group-hover:text-gray-500 dark:group-hover:text-dark-300'
                  )}
                />
              )}
              <span className={cn(isHorizontal ? 'whitespace-nowrap' : '')}>
                {tab.name}
              </span>
              {tab.badge && (
                <span className={cn(
                  'ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
                  activeTab === tab.id
                    ? 'bg-primary-100 dark:bg-primary-800 text-primary-800 dark:text-primary-200'
                    : 'bg-gray-100 dark:bg-dark-600 text-gray-600 dark:text-dark-300'
                )}>
                  {tab.badge}
                </span>
              )}
            </motion.div>
          </button>
        ))}
      </nav>
    </div>
  );
}

export default TabNavigation;