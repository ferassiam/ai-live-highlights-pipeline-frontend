import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn.jsx';
import { EmptyState } from './EmptyState.jsx';

export const DataTable = ({ 
  columns = [], 
  data = [], 
  loading = false,
  emptyState,
  className,
  dense = false,
  striped = false,
  hoverable = true,
  sortable = false,
  onSort,
  sortColumn,
  sortDirection = 'asc'
}) => {
  const handleSort = (column) => {
    if (!sortable || !onSort || !column.sortable) return;
    
    const newDirection = sortColumn === column.key && sortDirection === 'asc' ? 'desc' : 'asc';
    onSort(column.key, newDirection);
  };

  if (loading) {
    return (
      <div className={cn('overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800', className)}>
        <div className="animate-pulse">
          <div className="bg-slate-50 dark:bg-slate-700/50 h-12" />
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="border-t border-slate-200 dark:border-slate-700 h-16 bg-white dark:bg-slate-800" />
          ))}
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return emptyState || (
      <EmptyState 
        title="No data available"
        description="No records found matching your criteria"
        className={className}
      />
    );
  }

  return (
    <div className={cn('overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm', className)}>
      <div className="overflow-x-auto">
        <table className="data-table">
          <thead className="data-table-header">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  scope="col"
                  className={cn(
                    'data-table-header-cell',
                    sortable && column.sortable && 'cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700/50 select-none',
                    dense && 'py-2',
                    column.headerClassName
                  )}
                  onClick={() => handleSort(column)}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.header}</span>
                    {sortable && column.sortable && (
                      <div className="flex flex-col">
                        <svg className={cn('w-3 h-3', sortColumn === column.key && sortDirection === 'asc' ? 'text-emerald-600' : 'text-slate-400')} fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                        </svg>
                        <svg className={cn('w-3 h-3 -mt-1', sortColumn === column.key && sortDirection === 'desc' ? 'text-emerald-600' : 'text-slate-400')} fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
            {data.map((row, rowIndex) => (
              <tr
                key={row.id || rowIndex}
                className={cn(
                  'data-table-row',
                  striped && rowIndex % 2 === 1 && 'bg-slate-50/50 dark:bg-slate-700/25',
                  hoverable && 'hover:bg-slate-50 dark:hover:bg-slate-700/50'
                )}
              >
                {columns.map((column) => (
                  <td 
                    key={column.key} 
                    className={cn(
                      'data-table-cell',
                      dense && 'py-2',
                      column.cellClassName
                    )}
                  >
                    {typeof column.render === 'function' 
                      ? column.render(row[column.key], row, rowIndex) 
                      : row[column.key]
                    }
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;