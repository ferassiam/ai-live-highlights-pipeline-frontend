import React from 'react';
import { cn } from '../../utils/cn';

export function Table({ columns = [], rows = [], className, empty, dense = false }) {
  return (
    <div className={cn('overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm', className)}>
      <div className="overflow-x-auto">
        <table className={cn('min-w-full divide-y divide-slate-200 dark:divide-slate-700', dense && 'text-sm')}>
          <thead className="bg-slate-50 dark:bg-slate-700/50">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  scope="col"
                  className={cn('px-4 py-3 text-left font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap', col.headerClassName)}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
            {rows.length === 0 && (
              <tr>
                <td colSpan={columns.length}>
                  {empty || (
                    <div className="py-10 text-center text-slate-500 dark:text-slate-400">No data available</div>
                  )}
                </td>
              </tr>
            )}
            {rows.map((row, idx) => (
              <tr key={row.id || idx} className="hover:bg-slate-50 dark:hover:bg-slate-700/60 transition-colors">
                {columns.map((col) => (
                  <td key={col.key} className={cn('px-4 py-3 align-middle text-slate-700 dark:text-slate-200', col.cellClassName)}>
                    {typeof col.render === 'function' ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Table;
