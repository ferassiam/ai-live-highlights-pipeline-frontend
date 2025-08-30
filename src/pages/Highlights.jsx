import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  SparklesIcon,
  FunnelIcon,
  ChartBarIcon,
  CalendarIcon,
  ClockIcon,
  EyeIcon,
} from '@heroicons/react/24/outline';
import { format, parseISO } from 'date-fns';

import { apiService } from '../services/api';

export default function Highlights() {
  const [filters, setFilters] = useState({
    limit: 50,
    schedule_id: '',
    start_time: '',
    end_time: '',
    file_pattern: '*_highlights_filtered_*.json',
  });
  const [selectedHighlight, setSelectedHighlight] = useState(null);

  // Fetch highlights
  const { data: highlightsData, isLoading } = useQuery({
    queryKey: ['highlights', filters],
    queryFn: () => apiService.getHighlights(filters),
    keepPreviousData: true,
  });

  // Fetch highlights summary
  const { data: summaryData } = useQuery({
    queryKey: ['highlightsSummary'],
    queryFn: () => apiService.getHighlightsSummary(),
    refetchInterval: 60000,
  });

  // Fetch schedules for filter dropdown
  const { data: schedulesData } = useQuery({
    queryKey: ['schedules'],
    queryFn: () => apiService.getSchedules(),
  });

  const highlights = highlightsData?.highlights || [];
  const summary = summaryData?.statistics || {};
  const schedules = schedulesData?.schedules || [];

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      limit: 50,
      schedule_id: '',
      start_time: '',
      end_time: '',
      file_pattern: '*_highlights_filtered_*.json',
    });
  };

  const formatTimestamp = (timestamp) => {
    try {
      return format(parseISO(timestamp), 'MMM dd, HH:mm:ss');
    } catch {
      return timestamp;
    }
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.8) return 'text-success-600 bg-success-50';
    if (confidence >= 0.6) return 'text-warning-600 bg-warning-50';
    return 'text-danger-600 bg-danger-50';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
      {/* Page header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            Highlights
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-slate-300 dark:text-slate-400">
            Browse and analyze generated video highlights
          </p>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="metric-card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <SparklesIcon className="h-6 w-6 text-primary-600" />
            </div>
            <div className="ml-4">
              <div className="metric-value">{summary.total_highlights || 0}</div>
              <div className="metric-label">Total Highlights</div>
            </div>
          </div>
        </div>
        <div className="metric-card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ChartBarIcon className="h-6 w-6 text-success-600" />
            </div>
            <div className="ml-4">
              <div className="metric-value">{summary.total_pipelines || 0}</div>
              <div className="metric-label">Active Pipelines</div>
            </div>
          </div>
        </div>
        <div className="metric-card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ClockIcon className="h-6 w-6 text-warning-600" />
            </div>
            <div className="ml-4">
              <div className="metric-value">{summary.total_highlight_files || 0}</div>
              <div className="metric-label">Highlight Files</div>
            </div>
          </div>
        </div>
        <div className="metric-card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CalendarIcon className="h-6 w-6 text-gray-600 dark:text-slate-300" />
            </div>
            <div className="ml-4">
              <div className="metric-value">{highlights.length}</div>
              <div className="metric-label">Filtered Results</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="card-header">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FunnelIcon className="h-5 w-5 text-gray-400 dark:text-slate-500 mr-2" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white dark:text-white">Filters</h3>
            </div>
            <button
              onClick={clearFilters}
              className="text-sm text-primary-600 hover:text-primary-500"
            >
              Clear all
            </button>
          </div>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Schedule
              </label>
              <select
                value={filters.schedule_id}
                onChange={(e) => handleFilterChange('schedule_id', e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              >
                <option value="">All schedules</option>
                {schedules.map((schedule) => (
                  <option key={schedule.id} value={schedule.id}>
                    {schedule.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Start Date
              </label>
              <input
                type="datetime-local"
                value={filters.start_time}
                onChange={(e) => handleFilterChange('start_time', e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                End Date
              </label>
              <input
                type="datetime-local"
                value={filters.end_time}
                onChange={(e) => handleFilterChange('end_time', e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Limit
              </label>
              <select
                value={filters.limit}
                onChange={(e) => handleFilterChange('limit', parseInt(e.target.value))}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              >
                <option value={25}>25 results</option>
                <option value={50}>50 results</option>
                <option value={100}>100 results</option>
                <option value={200}>200 results</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Highlights list */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Highlights ({highlightsData?.total || 0} found)
          </h3>
        </div>
        <div className="card-body p-0">
          {highlights.length === 0 ? (
            <div className="text-center py-12">
              <SparklesIcon className="mx-auto h-12 w-12 text-gray-400 dark:text-slate-500" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No highlights found</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
                Try adjusting your filters or wait for more highlights to be generated.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {highlights.map((highlight, index) => (
                <div
                  key={`${highlight.source_file}-${index}`}
                  className="p-6 hover:bg-gray-50 dark:hover:bg-slate-700 cursor-pointer"
                  onClick={() => setSelectedHighlight(highlight)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          <SparklesIcon className="h-5 w-5 text-primary-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {highlight.description || highlight.title || 'Untitled Highlight'}
                          </p>
                          <div className="flex items-center space-x-4 mt-1">
                            <span className="text-xs text-gray-500 dark:text-slate-400">
                              {formatTimestamp(highlight.timestamp || highlight.file_timestamp)}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-slate-400">
                              Pipeline: {highlight.pipeline_id}
                            </span>
                            {highlight.confidence && (
                              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getConfidenceColor(highlight.confidence)}`}>
                                {Math.round(highlight.confidence * 100)}% confidence
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {highlight.summary && (
                        <p className="mt-2 text-sm text-gray-600 dark:text-slate-300 line-clamp-2">
                          {highlight.summary}
                        </p>
                      )}
                      
                      {highlight.tags && highlight.tags.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {highlight.tags.slice(0, 3).map((tag, tagIndex) => (
                            <span
                              key={tagIndex}
                              className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary-100 text-primary-800"
                            >
                              {tag}
                            </span>
                          ))}
                          {highlight.tags.length > 3 && (
                            <span className="text-xs text-gray-500 dark:text-slate-400">
                              +{highlight.tags.length - 3} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-shrink-0 ml-4">
                      <button className="text-gray-400 dark:text-slate-500 hover:text-gray-500 dark:text-slate-400">
                        <EyeIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Highlight detail modal */}
      {selectedHighlight && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div 
              className="fixed inset-0 bg-gray-500 dark:bg-black bg-opacity-75 dark:bg-opacity-50 transition-opacity"
              onClick={() => setSelectedHighlight(null)}
            ></div>

            <div className="inline-block align-bottom bg-white dark:bg-slate-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full border border-gray-200 dark:border-slate-600">
              <div className="bg-white dark:bg-slate-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <SparklesIcon className="h-6 w-6 text-primary-600" />
                  </div>
                  <div className="ml-3 w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                      {selectedHighlight.description || selectedHighlight.title || 'Highlight Details'}
                    </h3>
                    <div className="mt-2">
                      <div className="space-y-3">
                        <div>
                          <span className="text-sm font-medium text-gray-500 dark:text-slate-400">Timestamp:</span>
                          <span className="ml-2 text-sm text-gray-900 dark:text-white">
                            {formatTimestamp(selectedHighlight.timestamp || selectedHighlight.file_timestamp)}
                          </span>
                        </div>
                        
                        <div>
                          <span className="text-sm font-medium text-gray-500 dark:text-slate-400">Pipeline:</span>
                          <span className="ml-2 text-sm text-gray-900 dark:text-white">
                            {selectedHighlight.pipeline_id}
                          </span>
                        </div>
                        
                        {selectedHighlight.confidence && (
                          <div>
                            <span className="text-sm font-medium text-gray-500 dark:text-slate-400">Confidence:</span>
                            <span className={`ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getConfidenceColor(selectedHighlight.confidence)}`}>
                              {Math.round(selectedHighlight.confidence * 100)}%
                            </span>
                          </div>
                        )}
                        
                        {selectedHighlight.summary && (
                          <div>
                            <span className="text-sm font-medium text-gray-500 dark:text-slate-400 block mb-1">Summary:</span>
                            <p className="text-sm text-gray-900 dark:text-white">{selectedHighlight.summary}</p>
                          </div>
                        )}
                        
                        {selectedHighlight.duration && (
                          <div>
                            <span className="text-sm font-medium text-gray-500 dark:text-slate-400">Duration:</span>
                            <span className="ml-2 text-sm text-gray-900 dark:text-white">
                              {selectedHighlight.duration}s
                            </span>
                          </div>
                        )}
                        
                        {selectedHighlight.tags && selectedHighlight.tags.length > 0 && (
                          <div>
                            <span className="text-sm font-medium text-gray-500 dark:text-slate-400 block mb-2">Tags:</span>
                            <div className="flex flex-wrap gap-1">
                              {selectedHighlight.tags.map((tag, index) => (
                                <span
                                  key={index}
                                  className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary-100 text-primary-800"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        <div>
                          <span className="text-sm font-medium text-gray-500 dark:text-slate-400">Source File:</span>
                          <span className="ml-2 text-xs text-gray-600 dark:text-slate-300 font-mono break-all">
                            {selectedHighlight.source_file}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-slate-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t border-gray-200 dark:border-slate-600">
                <button
                  type="button"
                  onClick={() => setSelectedHighlight(null)}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
        </div>
      </div>
    </div>
  );
}