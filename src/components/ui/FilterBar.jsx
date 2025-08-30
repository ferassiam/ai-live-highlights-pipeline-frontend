import React from 'react';
import { motion } from 'framer-motion';
import { FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Button } from './Button.jsx';
import { Select } from './Select.jsx';
import { Input } from './Input.jsx';
import { cn } from '../../utils/cn.jsx';

export const FilterBar = ({ 
  filters = [],
  values = {},
  onChange,
  onClear,
  className,
  title = "Filters"
}) => {
  const hasActiveFilters = Object.values(values).some(value => 
    value !== '' && value !== null && value !== undefined
  );

  const handleFilterChange = (key, value) => {
    if (onChange) {
      onChange(key, value);
    }
  };

  const handleClearAll = () => {
    if (onClear) {
      onClear();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-6 shadow-sm',
        className
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <FunnelIcon className="h-5 w-5 text-slate-500 dark:text-slate-400" />
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h3>
          {hasActiveFilters && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300">
              Active
            </span>
          )}
        </div>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearAll}
            leftIcon={<XMarkIcon className="h-4 w-4" />}
          >
            Clear All
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filters.map((filter) => {
          const value = values[filter.key] || '';
          
          return (
            <div key={filter.key}>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                {filter.label}
              </label>
              
              {filter.type === 'select' ? (
                <Select
                  value={value}
                  onChange={(newValue) => handleFilterChange(filter.key, newValue)}
                  options={filter.options || []}
                  placeholder={filter.placeholder}
                />
              ) : filter.type === 'date' ? (
                <Input
                  type="date"
                  value={value}
                  onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                  placeholder={filter.placeholder}
                />
              ) : filter.type === 'datetime-local' ? (
                <Input
                  type="datetime-local"
                  value={value}
                  onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                  placeholder={filter.placeholder}
                />
              ) : filter.type === 'number' ? (
                <Input
                  type="number"
                  value={value}
                  onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                  placeholder={filter.placeholder}
                  min={filter.min}
                  max={filter.max}
                />
              ) : (
                <Input
                  type="text"
                  value={value}
                  onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                  placeholder={filter.placeholder}
                />
              )}
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default FilterBar;