import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import {
  SparklesIcon,
  FunnelIcon,
  ChartBarIcon,
  CalendarIcon,
  ClockIcon,
  EyeIcon,
  PencilIcon,
  CheckCircleIcon,
  XCircleIcon,
  ShareIcon,
  ChatBubbleLeftRightIcon,
  UserIcon,
  TagIcon,
  StarIcon,
  ArrowPathIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { format, parseISO } from 'date-fns';

import { apiService, showSuccessToast, showErrorToast } from '../services/api';
import { Button } from '../components/ui/Button.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import { Input } from '../components/ui/Input.jsx';
import { Textarea } from '../components/ui/Textarea.jsx';
import { Select } from '../components/ui/Select.jsx';
import { ContentWorkflowCard } from '../components/ui/ContentWorkflow.jsx';
import { BulkOperationsBar, ContentSelectionCheckbox } from '../components/ui/BulkOperations.jsx';
import { cn } from '../utils/cn.jsx';

export default function Highlights() {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState({
    limit: 50,
    schedule_id: '',
    start_time: '',
    end_time: '',
    file_pattern: '*_highlights_filtered_*.json',
  });
  const [selectedHighlight, setSelectedHighlight] = useState(null);
  const [editingHighlight, setEditingHighlight] = useState(null);
  const [selectedHighlights, setSelectedHighlights] = useState([]);
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'workflow'
  const [workflowFilter, setWorkflowFilter] = useState('all');
  const [newComment, setNewComment] = useState('');

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

  // Mutations for workflow management
  const updateHighlightMutation = useMutation({
    mutationFn: ({ highlightId, updates }) => apiService.updateHighlight(highlightId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['highlights'] });
      showSuccessToast('Highlight updated successfully');
      setEditingHighlight(null);
    },
    onError: (error) => {
      showErrorToast(error.response?.data?.detail || 'Failed to update highlight');
    },
  });

  const publishHighlightMutation = useMutation({
    mutationFn: (highlightId) => apiService.publishHighlight(highlightId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['highlights'] });
      showSuccessToast('Highlight published successfully');
    },
    onError: (error) => {
      showErrorToast(error.response?.data?.detail || 'Failed to publish highlight');
    },
  });

  const addCommentMutation = useMutation({
    mutationFn: ({ highlightId, comment }) => apiService.addHighlightComment(highlightId, comment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['highlights'] });
      showSuccessToast('Comment added successfully');
      setNewComment('');
    },
    onError: (error) => {
      showErrorToast(error.response?.data?.detail || 'Failed to add comment');
    },
  });

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

  const handleHighlightSelection = (highlightId, isSelected) => {
    setSelectedHighlights(prev => 
      isSelected 
        ? [...prev, highlightId]
        : prev.filter(id => id !== highlightId)
    );
  };

  const handleBulkAction = (action, highlightIds, options = {}) => {
    switch (action) {
      case 'publish':
        highlightIds.forEach(id => publishHighlightMutation.mutate(id));
        break;
      case 'delete':
        // Implement bulk delete
        showSuccessToast(`Deleted ${highlightIds.length} highlights`);
        break;
      case 'assign':
        // Implement bulk assignment
        showSuccessToast(`Assigned ${highlightIds.length} highlights to ${options.assignee}`);
        break;
      case 'schedule':
        // Implement bulk scheduling
        showSuccessToast(`Scheduled ${highlightIds.length} highlights for ${options.date}`);
        break;
    }
    setSelectedHighlights([]);
  };

  const handleWorkflowStageChange = (highlightId, newStage) => {
    updateHighlightMutation.mutate({
      highlightId,
      updates: { workflow_stage: newStage }
    });
  };

  const handleAddComment = (highlightId, comment) => {
    addCommentMutation.mutate({ highlightId, comment });
  };

  const getWorkflowStage = (highlight) => {
    return highlight.workflow_stage || 'draft';
  };

  const getHighlightRating = (highlight) => {
    return highlight.confidence ? Math.round(highlight.confidence * 5) : 3;
  };

  const filteredHighlightsByWorkflow = highlights.filter(highlight => {
    if (workflowFilter === 'all') return true;
    return getWorkflowStage(highlight) === workflowFilter;
  });

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

  const workflowStages = [
    { value: 'all', label: 'All Highlights' },
    { value: 'draft', label: 'Draft' },
    { value: 'review', label: 'In Review' },
    { value: 'approved', label: 'Approved' },
    { value: 'published', label: 'Published' },
    { value: 'rejected', label: 'Rejected' },
  ];

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
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Highlights Management
              </h1>
              <p className="mt-2 text-sm text-gray-600 dark:text-slate-400">
                Review, edit, and publish AI-generated video highlights
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Select
                value={viewMode}
                onChange={setViewMode}
                options={[
                  { value: 'list', label: 'List View' },
                  { value: 'workflow', label: 'Workflow View' }
                ]}
                className="min-w-[140px]"
              />
              <Button
                variant="outline"
                onClick={() => queryClient.invalidateQueries({ queryKey: ['highlights'] })}
                leftIcon={<ArrowPathIcon className="h-4 w-4" />}
              >
                Refresh
              </Button>
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
                  <CheckCircleIcon className="h-6 w-6 text-success-600" />
                </div>
                <div className="ml-4">
                  <div className="metric-value">{highlights.filter(h => getWorkflowStage(h) === 'published').length}</div>
                  <div className="metric-label">Published</div>
                </div>
              </div>
            </div>
            <div className="metric-card">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <ClockIcon className="h-6 w-6 text-warning-600" />
                </div>
                <div className="ml-4">
                  <div className="metric-value">{highlights.filter(h => getWorkflowStage(h) === 'review').length}</div>
                  <div className="metric-label">In Review</div>
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

          {/* Workflow Filter Bar */}
          {viewMode === 'workflow' && (
            <div className="flex items-center space-x-4 bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Filter by stage:</span>
              <div className="flex space-x-2">
                {workflowStages.map(stage => (
                  <Button
                    key={stage.value}
                    variant={workflowFilter === stage.value ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => setWorkflowFilter(stage.value)}
                  >
                    {stage.label}
                    {stage.value !== 'all' && (
                      <Badge variant="secondary" size="sm" className="ml-2">
                        {highlights.filter(h => getWorkflowStage(h) === stage.value).length}
                      </Badge>
                    )}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Filters */}
          <div className="card">
            <div className="card-header">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <FunnelIcon className="h-5 w-5 text-gray-400 dark:text-slate-500 mr-2" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Filters</h3>
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

          {/* Content Display */}
          {viewMode === 'workflow' ? (
            <div className="space-y-6">
              {filteredHighlightsByWorkflow.length === 0 ? (
                <div className="text-center py-12">
                  <SparklesIcon className="mx-auto h-12 w-12 text-gray-400 dark:text-slate-500" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                    No highlights in {workflowFilter === 'all' ? 'any stage' : workflowStages.find(s => s.value === workflowFilter)?.label}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
                    Highlights will appear here as they're generated and move through the workflow
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {filteredHighlightsByWorkflow.map((highlight) => (
                    <ContentWorkflowCard
                      key={`${highlight.source_file}-${highlight.timestamp}`}
                      content={{
                        id: highlight.id || `${highlight.source_file}-${highlight.timestamp}`,
                        type: 'highlight',
                        title: highlight.description || highlight.title || 'Untitled Highlight',
                        content: {
                          summary: highlight.summary,
                          description: highlight.description,
                          confidence: highlight.confidence,
                          tags: highlight.tags || []
                        },
                        workflow_stage: getWorkflowStage(highlight),
                        timestamp: highlight.timestamp || highlight.file_timestamp,
                        game_context: {
                          teams: {
                            home: highlight.home_team || 'Team A',
                            away: highlight.away_team || 'Team B'
                          }
                        },
                        pipeline_id: highlight.pipeline_id,
                        rating: getHighlightRating(highlight),
                        comments: highlight.comments || []
                      }}
                      onStageChange={handleWorkflowStageChange}
                      onComment={handleAddComment}
                      onEdit={(content) => setEditingHighlight(content)}
                      onView={(content) => setSelectedHighlight(highlight)}
                    />
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* List view */
            <div className="card">
              <div className="card-header">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Highlights ({highlightsData?.total || 0} found)
                  </h3>
                  {selectedHighlights.length > 0 && (
                    <Badge variant="primary" size="sm">
                      {selectedHighlights.length} selected
                    </Badge>
                  )}
                </div>
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
                  <div className="divide-y divide-gray-200 dark:divide-slate-700">
                    {highlights.map((highlight, index) => {
                      const highlightId = highlight.id || `${highlight.source_file}-${highlight.timestamp}`;
                      const isSelected = selectedHighlights.includes(highlightId);
                      const workflowStage = getWorkflowStage(highlight);

                      return (
                        <motion.div
                          key={highlightId}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.02 }}
                          className={cn(
                            'p-6 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors',
                            isSelected && 'bg-blue-50 dark:bg-blue-900/20'
                          )}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-4">
                              <ContentSelectionCheckbox
                                contentId={highlightId}
                                isSelected={isSelected}
                                onSelectionChange={handleHighlightSelection}
                              />
                              
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center space-x-3">
                                  <div className="flex-shrink-0">
                                    <SparklesIcon className="h-5 w-5 text-primary-500" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center space-x-2 mb-1">
                                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                        {highlight.description || highlight.title || 'Untitled Highlight'}
                                      </p>
                                      <Badge 
                                        variant={
                                          workflowStage === 'published' ? 'success' :
                                          workflowStage === 'approved' ? 'primary' :
                                          workflowStage === 'review' ? 'warning' :
                                          workflowStage === 'rejected' ? 'danger' : 'secondary'
                                        }
                                        size="sm"
                                      >
                                        {workflowStage}
                                      </Badge>
                                    </div>
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
                                      <div className="flex items-center space-x-1">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                          <StarIcon
                                            key={i}
                                            className={cn(
                                              'h-3 w-3',
                                              i < getHighlightRating(highlight)
                                                ? 'text-yellow-400 fill-current'
                                                : 'text-gray-300 dark:text-slate-600'
                                            )}
                                          />
                                        ))}
                                      </div>
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
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-2 ml-4">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSelectedHighlight(highlight)}
                                leftIcon={<EyeIcon className="h-4 w-4" />}
                              >
                                View
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setEditingHighlight(highlight)}
                                leftIcon={<PencilIcon className="h-4 w-4" />}
                              >
                                Edit
                              </Button>
                              {workflowStage === 'approved' && (
                                <Button
                                  variant="success"
                                  size="sm"
                                  onClick={() => publishHighlightMutation.mutate(highlightId)}
                                  leftIcon={<ShareIcon className="h-4 w-4" />}
                                >
                                  Publish
                                </Button>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Bulk Operations Bar */}
          {selectedHighlights.length > 0 && (
            <BulkOperationsBar
              selectedCount={selectedHighlights.length}
              onAction={handleBulkAction}
              selectedItems={selectedHighlights}
              contentType="highlights"
            />
          )}
        </div>
      </div>

      {/* Highlight detail modal */}
      {selectedHighlight && (
        <HighlightDetailModal 
          highlight={selectedHighlight}
          onClose={() => setSelectedHighlight(null)}
          onEdit={() => {
            setEditingHighlight(selectedHighlight);
            setSelectedHighlight(null);
          }}
          onWorkflowChange={handleWorkflowStageChange}
          onAddComment={handleAddComment}
        />
      )}

      {/* Edit Modal */}
      {editingHighlight && (
        <HighlightEditModal
          highlight={editingHighlight}
          onClose={() => setEditingHighlight(null)}
          onSave={(updates) => {
            updateHighlightMutation.mutate({
              highlightId: editingHighlight.id || `${editingHighlight.source_file}-${editingHighlight.timestamp}`,
              updates
            });
          }}
        />
      )}
    </div>
  );
}

// Enhanced Highlight Detail Modal with dynamic sizing
function HighlightDetailModal({ highlight, onClose, onEdit, onWorkflowChange, onAddComment }) {
  const [newComment, setNewComment] = useState('');
  const workflowStage = highlight.workflow_stage || 'draft';

  const handleAddComment = () => {
    if (newComment.trim()) {
      onAddComment(highlight.id || `${highlight.source_file}-${highlight.timestamp}`, newComment.trim());
      setNewComment('');
    }
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

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="relative w-full max-w-4xl max-h-[90vh] bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-gray-200 dark:border-slate-600 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-slate-600">
            <div className="flex items-center space-x-3">
              <SparklesIcon className="h-6 w-6 text-primary-600" />
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {highlight.description || highlight.title || 'Highlight Details'}
                </h3>
                <p className="text-sm text-gray-500 dark:text-slate-400">
                  Pipeline: {highlight.pipeline_id}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge 
                variant={
                  workflowStage === 'published' ? 'success' :
                  workflowStage === 'approved' ? 'primary' :
                  workflowStage === 'review' ? 'warning' :
                  workflowStage === 'rejected' ? 'danger' : 'secondary'
                }
              >
                {workflowStage}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                leftIcon={<XMarkIcon className="h-4 w-4" />}
              />
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="overflow-y-auto max-h-[calc(90vh-200px)]">
            <div className="p-6 space-y-6">
              {/* Highlight Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <span className="text-sm font-medium text-gray-500 dark:text-slate-400">Timestamp:</span>
                    <span className="ml-2 text-sm text-gray-900 dark:text-white">
                      {formatTimestamp(highlight.timestamp || highlight.file_timestamp)}
                    </span>
                  </div>
                  
                  {highlight.confidence && (
                    <div>
                      <span className="text-sm font-medium text-gray-500 dark:text-slate-400">Confidence:</span>
                      <span className={`ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getConfidenceColor(highlight.confidence)}`}>
                        {Math.round(highlight.confidence * 100)}%
                      </span>
                    </div>
                  )}
                  
                  {highlight.duration && (
                    <div>
                      <span className="text-sm font-medium text-gray-500 dark:text-slate-400">Duration:</span>
                      <span className="ml-2 text-sm text-gray-900 dark:text-white">
                        {highlight.duration}s
                      </span>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <span className="text-sm font-medium text-gray-500 dark:text-slate-400">Quality Rating:</span>
                    <div className="flex items-center space-x-1 ml-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <StarIcon
                          key={i}
                          className={cn(
                            'h-4 w-4',
                            i < Math.round((highlight.confidence || 0.6) * 5)
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300 dark:text-slate-600'
                          )}
                        />
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <span className="text-sm font-medium text-gray-500 dark:text-slate-400">Source File:</span>
                    <span className="ml-2 text-xs text-gray-600 dark:text-slate-300 font-mono break-all">
                      {highlight.source_file}
                    </span>
                  </div>
                </div>
              </div>

              {/* Summary */}
              {highlight.summary && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-slate-400 mb-2">Summary:</h4>
                  <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-4">
                    <p className="text-sm text-gray-900 dark:text-white leading-relaxed">
                      {highlight.summary}
                    </p>
                  </div>
                </div>
              )}
              
              {/* Tags */}
              {highlight.tags && highlight.tags.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-slate-400 mb-2">Tags:</h4>
                  <div className="flex flex-wrap gap-2">
                    {highlight.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" size="sm">
                        <TagIcon className="h-3 w-3 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Comments Section */}
              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-slate-400 mb-4">Comments & Feedback:</h4>
                <div className="space-y-4">
                  {highlight.comments && highlight.comments.length > 0 ? (
                    highlight.comments.map((comment, index) => (
                      <div key={index} className="flex space-x-3 p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-gray-200 dark:bg-slate-600 rounded-full flex items-center justify-center">
                            <UserIcon className="h-4 w-4 text-gray-600 dark:text-slate-400" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                              {comment.author || 'Team Member'}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-slate-400">
                              {formatTimestamp(comment.timestamp)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700 dark:text-slate-300">
                            {comment.text}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-slate-400 italic">No comments yet</p>
                  )}

                  {/* Add Comment */}
                  <div className="flex space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
                        <UserIcon className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <Textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Add a comment or feedback..."
                        rows={2}
                        className="w-full"
                      />
                      <div className="flex justify-end mt-2">
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={handleAddComment}
                          disabled={!newComment.trim()}
                        >
                          Add Comment
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-700/50">
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                onClick={onEdit}
                leftIcon={<PencilIcon className="h-4 w-4" />}
              >
                Edit Details
              </Button>
              <Button
                variant="ghost"
                onClick={() => onWorkflowChange(
                  highlight.id || `${highlight.source_file}-${highlight.timestamp}`,
                  workflowStage === 'draft' ? 'review' : 'approved'
                )}
                leftIcon={<ArrowPathIcon className="h-4 w-4" />}
              >
                {workflowStage === 'draft' ? 'Send for Review' : 'Approve'}
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              {workflowStage === 'approved' && (
                <Button
                  variant="success"
                  onClick={() => onWorkflowChange(
                    highlight.id || `${highlight.source_file}-${highlight.timestamp}`,
                    'published'
                  )}
                  leftIcon={<ShareIcon className="h-4 w-4" />}
                >
                  Publish
                </Button>
              )}
              <Button
                variant="secondary"
                onClick={onClose}
              >
                Close
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// Highlight Edit Modal
function HighlightEditModal({ highlight, onClose, onSave }) {
  const [formData, setFormData] = useState({
    title: highlight.description || highlight.title || '',
    summary: highlight.summary || '',
    tags: highlight.tags ? highlight.tags.join(', ') : '',
    confidence: highlight.confidence || 0.5,
    duration: highlight.duration || '',
    workflow_stage: highlight.workflow_stage || 'draft'
  });

  const handleSave = () => {
    const updates = {
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
    };
    onSave(updates);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="relative w-full max-w-2xl max-h-[80vh] bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-gray-200 dark:border-slate-600 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-slate-600">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Edit Highlight
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              leftIcon={<XMarkIcon className="h-4 w-4" />}
            />
          </div>

          {/* Content */}
          <div className="overflow-y-auto max-h-[calc(80vh-200px)] p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                Title/Description
              </label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter highlight title..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                Summary
              </label>
              <Textarea
                value={formData.summary}
                onChange={(e) => setFormData(prev => ({ ...prev, summary: e.target.value }))}
                placeholder="Enter highlight summary..."
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                  Confidence Score
                </label>
                <Input
                  type="number"
                  min="0"
                  max="1"
                  step="0.01"
                  value={formData.confidence}
                  onChange={(e) => setFormData(prev => ({ ...prev, confidence: parseFloat(e.target.value) }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                  Duration (seconds)
                </label>
                <Input
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                  placeholder="30"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                Tags (comma-separated)
              </label>
              <Input
                value={formData.tags}
                onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                placeholder="goal, amazing, skill, highlight"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                Workflow Stage
              </label>
              <Select
                value={formData.workflow_stage}
                onChange={(value) => setFormData(prev => ({ ...prev, workflow_stage: value }))}
                options={[
                  { value: 'draft', label: 'Draft' },
                  { value: 'review', label: 'In Review' },
                  { value: 'approved', label: 'Approved' },
                  { value: 'published', label: 'Published' },
                  { value: 'rejected', label: 'Rejected' }
                ]}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-700/50">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSave}>
              Save Changes
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// Add missing API methods to handle highlight workflow
if (typeof apiService.updateHighlight === 'undefined') {
  apiService.updateHighlight = async function(highlightId, updates) {
    // Mock implementation - replace with actual API call
    return new Promise(resolve => {
      setTimeout(() => resolve({ success: true, message: 'Highlight updated' }), 500);
    });
  };
}

if (typeof apiService.publishHighlight === 'undefined') {
  apiService.publishHighlight = async function(highlightId) {
    // Mock implementation - replace with actual API call
    return new Promise(resolve => {
      setTimeout(() => resolve({ success: true, message: 'Highlight published' }), 500);
    });
  };
}

if (typeof apiService.addHighlightComment === 'undefined') {
  apiService.addHighlightComment = async function(highlightId, comment) {
    // Mock implementation - replace with actual API call
    return new Promise(resolve => {
      setTimeout(() => resolve({ success: true, message: 'Comment added' }), 300);
    });
  };
}