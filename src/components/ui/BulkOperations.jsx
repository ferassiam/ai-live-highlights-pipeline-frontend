import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckIcon,
  XMarkIcon,
  ShareIcon,
  TrashIcon,
  DocumentDuplicateIcon,
  TagIcon,
  CalendarIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';
import { Button } from './Button.jsx';
import { Select } from './Select.jsx';
import { Badge } from './Badge.jsx';
import { cn } from '../../utils/cn.jsx';

export const BulkOperationsBar = ({ 
  selectedItems = [], 
  onClearSelection,
  onBulkAction,
  availableActions = ['publish', 'delete', 'assign', 'schedule'],
  className 
}) => {
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduleDate, setScheduleDate] = useState('');
  const [assignee, setAssignee] = useState('');

  const actionConfigs = {
    publish: {
      label: 'Publish',
      icon: ShareIcon,
      variant: 'success',
      description: 'Publish selected content immediately'
    },
    delete: {
      label: 'Delete',
      icon: TrashIcon,
      variant: 'danger',
      description: 'Permanently delete selected content'
    },
    assign: {
      label: 'Assign',
      icon: UserGroupIcon,
      variant: 'primary',
      description: 'Assign content to team member'
    },
    schedule: {
      label: 'Schedule',
      icon: CalendarIcon,
      variant: 'warning',
      description: 'Schedule content for future publication'
    },
    duplicate: {
      label: 'Duplicate',
      icon: DocumentDuplicateIcon,
      variant: 'secondary',
      description: 'Create copies of selected content'
    },
    tag: {
      label: 'Tag',
      icon: TagIcon,
      variant: 'secondary',
      description: 'Add tags to selected content'
    }
  };

  const handleBulkAction = (action, options = {}) => {
    if (onBulkAction) {
      onBulkAction(action, selectedItems, options);
    }
  };

  const handleScheduleSubmit = () => {
    if (scheduleDate) {
      handleBulkAction('schedule', { date: scheduleDate });
      setShowScheduleModal(false);
      setScheduleDate('');
    }
  };

  const handleAssignSubmit = () => {
    if (assignee) {
      handleBulkAction('assign', { assignee });
      setAssignee('');
    }
  };

  if (selectedItems.length === 0) {
    return null;
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className={cn(
          'fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50',
          'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg',
          'px-6 py-4 min-w-[400px]',
          className
        )}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center">
                <CheckIcon className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <span className="text-sm font-medium text-slate-900 dark:text-white">
                {selectedItems.length} item{selectedItems.length === 1 ? '' : 's'} selected
              </span>
            </div>

            <div className="flex items-center space-x-2">
              {availableActions.map(action => {
                const config = actionConfigs[action];
                if (!config) return null;

                const ActionIcon = config.icon;

                return (
                  <Button
                    key={action}
                    variant={config.variant}
                    size="sm"
                    onClick={() => {
                      if (action === 'schedule') {
                        setShowScheduleModal(true);
                      } else if (action === 'delete') {
                        if (window.confirm(`Are you sure you want to delete ${selectedItems.length} item(s)?`)) {
                          handleBulkAction(action);
                        }
                      } else {
                        handleBulkAction(action);
                      }
                    }}
                    leftIcon={<ActionIcon className="h-4 w-4" />}
                    title={config.description}
                  >
                    {config.label}
                  </Button>
                );
              })}
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={onClearSelection}
            leftIcon={<XMarkIcon className="h-4 w-4" />}
          >
            Clear
          </Button>
        </div>
      </motion.div>

      {/* Schedule Modal */}
      <AnimatePresence>
        {showScheduleModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={() => setShowScheduleModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                Schedule Content
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Publication Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    value={scheduleDate}
                    onChange={(e) => setScheduleDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>

                <div className="flex items-center justify-end space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowScheduleModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handleScheduleSubmit}
                    disabled={!scheduleDate}
                  >
                    Schedule
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export const ContentSelectionCheckbox = ({ 
  contentId, 
  isSelected, 
  onSelectionChange,
  className 
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={cn('relative', className)}
    >
      <input
        type="checkbox"
        checked={isSelected}
        onChange={(e) => onSelectionChange && onSelectionChange(contentId, e.target.checked)}
        className="w-4 h-4 text-emerald-600 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 rounded focus:ring-emerald-500 focus:ring-2"
      />
      {isSelected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
        >
          <CheckIcon className="h-3 w-3 text-white" />
        </motion.div>
      )}
    </motion.div>
  );
};

export default BulkOperationsBar;