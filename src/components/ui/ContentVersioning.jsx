import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ClockIcon,
  ArrowUturnLeftIcon,
  EyeIcon,
  DocumentDuplicateIcon,
  UserIcon,
  CheckCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';
import { Button } from './Button.jsx';
import { Badge } from './Badge.jsx';
import { cn } from '../../utils/cn.jsx';

export const ContentVersionHistory = ({ 
  contentId, 
  versions = [], 
  onRevert, 
  onCompare,
  onViewVersion,
  className 
}) => {
  const [selectedVersions, setSelectedVersions] = useState([]);
  const [expandedVersion, setExpandedVersion] = useState(null);

  const handleVersionSelect = (versionId) => {
    setSelectedVersions(prev => {
      if (prev.includes(versionId)) {
        return prev.filter(id => id !== versionId);
      } else if (prev.length < 2) {
        return [...prev, versionId];
      } else {
        return [prev[1], versionId];
      }
    });
  };

  const handleRevert = (versionId) => {
    if (window.confirm('Are you sure you want to revert to this version? Current changes will be lost.')) {
      onRevert && onRevert(contentId, versionId);
    }
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  const getChangeType = (change) => {
    if (change.type === 'created') return { color: 'emerald', icon: CheckCircleIcon };
    if (change.type === 'updated') return { color: 'blue', icon: DocumentDuplicateIcon };
    if (change.type === 'approved') return { color: 'emerald', icon: CheckCircleIcon };
    if (change.type === 'rejected') return { color: 'red', icon: XCircleIcon };
    return { color: 'slate', icon: ClockIcon };
  };

  return (
    <div className={cn('bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm', className)}>
      <div className="p-4 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            Version History
          </h3>
          <div className="flex items-center space-x-2">
            {selectedVersions.length === 2 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onCompare && onCompare(selectedVersions[0], selectedVersions[1])}
              >
                Compare Versions
              </Button>
            )}
            <Badge variant="secondary" size="sm">
              {versions.length} versions
            </Badge>
          </div>
        </div>
        {selectedVersions.length > 0 && (
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
            {selectedVersions.length === 1 
              ? 'Select another version to compare'
              : 'Two versions selected for comparison'
            }
          </p>
        )}
      </div>

      <div className="max-h-96 overflow-y-auto">
        {versions.length === 0 ? (
          <div className="p-8 text-center">
            <ClockIcon className="mx-auto h-12 w-12 text-slate-400 dark:text-slate-500" />
            <h4 className="mt-2 text-sm font-medium text-slate-900 dark:text-white">
              No version history
            </h4>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Versions will appear here as content is edited
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-200 dark:divide-slate-700">
            {versions.map((version, index) => {
              const isLatest = index === 0;
              const isSelected = selectedVersions.includes(version.id);
              const isExpanded = expandedVersion === version.id;
              const changeConfig = getChangeType(version.change_type);
              const ChangeIcon = changeConfig.icon;

              return (
                <motion.div
                  key={version.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={cn(
                    'p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer',
                    isSelected && 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-l-blue-500'
                  )}
                  onClick={() => handleVersionSelect(version.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className={cn(
                        'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center',
                        changeConfig.color === 'emerald' && 'bg-emerald-100 dark:bg-emerald-900/30',
                        changeConfig.color === 'blue' && 'bg-blue-100 dark:bg-blue-900/30',
                        changeConfig.color === 'red' && 'bg-red-100 dark:bg-red-900/30',
                        changeConfig.color === 'slate' && 'bg-slate-100 dark:bg-slate-700'
                      )}>
                        <ChangeIcon className={cn(
                          'h-4 w-4',
                          changeConfig.color === 'emerald' && 'text-emerald-600 dark:text-emerald-400',
                          changeConfig.color === 'blue' && 'text-blue-600 dark:text-blue-400',
                          changeConfig.color === 'red' && 'text-red-600 dark:text-red-400',
                          changeConfig.color === 'slate' && 'text-slate-600 dark:text-slate-400'
                        )} />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-sm font-medium text-slate-900 dark:text-white">
                            Version {version.version}
                          </span>
                          {isLatest && (
                            <Badge variant="success" size="sm">Current</Badge>
                          )}
                          <Badge 
                            variant={changeConfig.color === 'emerald' ? 'success' : changeConfig.color === 'red' ? 'danger' : 'secondary'} 
                            size="sm"
                          >
                            {version.change_type}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center space-x-4 text-xs text-slate-500 dark:text-slate-400">
                          <div className="flex items-center space-x-1">
                            <UserIcon className="h-3 w-3" />
                            <span>{version.author || 'System'}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <ClockIcon className="h-3 w-3" />
                            <span>{formatTimestamp(version.created_at)}</span>
                          </div>
                        </div>
                        
                        {version.change_summary && (
                          <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                            {version.change_summary}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpandedVersion(isExpanded ? null : version.id);
                        }}
                        leftIcon={<EyeIcon className="h-3 w-3" />}
                      >
                        {isExpanded ? 'Hide' : 'View'}
                      </Button>
                      
                      {!isLatest && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRevert(version.id);
                          }}
                          leftIcon={<ArrowUturnLeftIcon className="h-3 w-3" />}
                        >
                          Revert
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Expanded Version Details */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700"
                      >
                        <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4">
                          <h5 className="text-sm font-medium text-slate-900 dark:text-white mb-2">
                            Content Preview
                          </h5>
                          <div className="text-sm text-slate-700 dark:text-slate-300 max-h-32 overflow-y-auto">
                            {version.content_preview || 'No preview available'}
                          </div>
                        </div>
                        
                        {version.changes && version.changes.length > 0 && (
                          <div className="mt-4">
                            <h5 className="text-sm font-medium text-slate-900 dark:text-white mb-2">
                              Changes Made
                            </h5>
                            <ul className="space-y-1">
                              {version.changes.map((change, changeIndex) => (
                                <li key={changeIndex} className="text-xs text-slate-600 dark:text-slate-400 flex items-center space-x-2">
                                  <span className="w-1 h-1 bg-slate-400 rounded-full" />
                                  <span>{change}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentVersionHistory;