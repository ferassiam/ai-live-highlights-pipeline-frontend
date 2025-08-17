import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  ChartBarIcon,
  PlayIcon,
  SparklesIcon,
  ServerIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon,
  SignalIcon,
  EyeIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';

import { apiService, wsService } from '../services/api';
import { MetricsCard } from '../components/ui/MetricsCard';
import { TabNavigation } from '../components/ui/TabNavigation';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/Select';
import { Card, CardHeader, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { StatusIndicator } from '../components/ui/StatusIndicator';
import { cn } from '../utils/cn';

export default function EnhancedMonitoring() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedHours, setSelectedHours] = useState(24);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [selectedPipeline, setSelectedPipeline] = useState('all');
  
  const queryClient = useQueryClient();

  // Fetch monitoring stats
  const { data: monitoringStats, isLoading: statsLoading, error: statsError } = useQuery({
    queryKey: ['monitoringStats', selectedHours],
    queryFn: () => apiService.getMonitoringStats(selectedHours),
    refetchInterval: autoRefresh ? 30000 : false, // Refresh every 30 seconds
    retry: false,
    staleTime: 30000,
  });

  // Fetch system status
  const { data: systemStatus } = useQuery({
    queryKey: ['systemStatus'],
    queryFn: () => apiService.getStatus(),
    refetchInterval: autoRefresh ? 15000 : false, // Refresh every 15 seconds
  });

  // Fetch pipeline monitoring stats
  const { data: pipelineStats } = useQuery({
    queryKey: ['pipelineStats', selectedPipeline, selectedHours],
    queryFn: () => selectedPipeline !== 'all' 
      ? apiService.getPipelineMonitoringStats(selectedPipeline, selectedHours)
      : Promise.resolve(null),
    enabled: selectedPipeline !== 'all' && activeTab === 'pipelines',
    refetchInterval: autoRefresh ? 30000 : false,
  });

  // Fetch highlights summary for recent events
  const { data: recentHighlights } = useQuery({
    queryKey: ['recentHighlights'],
    queryFn: () => apiService.getHighlights({ limit: 10 }),
    refetchInterval: autoRefresh ? 60000 : false, // Refresh every minute
  });

  // WebSocket listeners for real-time updates
  useEffect(() => {
    const handleMonitoringUpdate = (data) => {
      queryClient.invalidateQueries({ queryKey: ['monitoringStats'] });
      queryClient.invalidateQueries({ queryKey: ['systemStatus'] });
    };

    const handlePipelineStatus = (data) => {
      queryClient.invalidateQueries({ queryKey: ['pipelineStats'] });
      queryClient.invalidateQueries({ queryKey: ['systemStatus'] });
    };

    wsService.on('monitoringUpdate', handleMonitoringUpdate);
    wsService.on('pipelineStatus', handlePipelineStatus);

    return () => {
      wsService.off('monitoringUpdate', handleMonitoringUpdate);
      wsService.off('pipelineStatus', handlePipelineStatus);
    };
  }, [queryClient]);

  const activePipelines = systemStatus?.orchestrator_status?.active_pipelines || [];

  const tabs = [
    { 
      id: 'overview', 
      name: 'Overview', 
      icon: ChartBarIcon,
      count: Object.keys(systemStatus?.orchestrator_status?.active_channels || {}).length
    },
    { 
      id: 'pipelines', 
      name: 'Pipelines', 
      icon: PlayIcon,
      count: activePipelines.length,
      alert: activePipelines.length === 0 ? 'warning' : null
    },
    { 
      id: 'events', 
      name: 'Activity', 
      icon: EyeIcon,
      count: recentHighlights?.highlights?.length || 0
    },
    { 
      id: 'health', 
      name: 'Health', 
      icon: ShieldCheckIcon,
      alert: !systemStatus?.orchestrator_running ? 'danger' : null
    },
  ];

  const timeRangeOptions = [
    { value: '1', label: 'Last Hour' },
    { value: '6', label: 'Last 6 Hours' },
    { value: '24', label: 'Last 24 Hours' },
    { value: '168', label: 'Last Week' },
  ];

  const pipelineOptions = [
    { value: 'all', label: 'All Pipelines' },
    ...activePipelines.map(p => ({ value: p, label: p }))
  ];

  const calculateSuccessRate = (stats) => {
    if (!stats || !stats.total_processed) return 0;
    return Math.round((stats.successful / stats.total_processed) * 100);
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  if (statsLoading && !monitoringStats) {
    return (
      <motion.div 
        className="space-y-8 p-6 max-w-7xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner message="Loading enhanced monitoring data..." />
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="space-y-8 p-6 max-w-7xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Professional page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-3">
            <SignalIcon className="h-6 w-6 text-slate-600 dark:text-slate-400" />
            <h1 className="text-2xl font-heading font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              Enhanced Monitoring
            </h1>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 font-medium mt-2">
            Advanced real-time system monitoring and performance analytics
          </p>
        </div>

        <div className="flex items-center gap-3">
          <StatusIndicator 
            status={systemStatus?.orchestrator_running ? 'healthy' : 'unhealthy'} 
            showText 
            size="sm"
          />
          
          <Select
            value={selectedHours.toString()}
            onChange={(value) => setSelectedHours(parseInt(value))}
            options={timeRangeOptions}
            size="sm"
            className="min-w-[140px]"
          />
          
          <Button
            variant={autoRefresh ? "success" : "subtle"}
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
          >
            <ArrowPathIcon className={cn('h-4 w-4 mr-2', autoRefresh && 'animate-spin')} />
            Auto Refresh
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              queryClient.invalidateQueries({ queryKey: ['monitoringStats'] });
              queryClient.invalidateQueries({ queryKey: ['systemStatus'] });
              queryClient.invalidateQueries({ queryKey: ['pipelineStats'] });
            }}
          >
            <ArrowPathIcon className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Professional error state */}
      {statsError && (
        <Card 
          variant="default"
          className="border-l-4 border-l-danger-500 bg-danger-50 dark:bg-danger-950/20"
        >
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 pt-0.5">
                <ExclamationTriangleIcon className="h-6 w-6 text-danger-500" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-subheading tracking-tight text-danger-700 dark:text-danger-300">
                  Monitoring Data Error
                </h3>
                <p className="text-sm text-danger-600 dark:text-danger-400 mt-1">
                  {statsError.message || 'Unable to fetch monitoring statistics. Check system connectivity.'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tab navigation */}
      <TabNavigation
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Tab content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <MetricsCard
                title="Total Highlights"
                value={formatNumber(monitoringStats?.total_highlights || 0)}
                icon={SparklesIcon}
                color="primary"
                loading={statsLoading}
              />
              <MetricsCard
                title="Success Rate"
                value={`${calculateSuccessRate(monitoringStats)}%`}
                change={monitoringStats?.success_rate_change}
                icon={ChartBarIcon}
                color="success"
                loading={statsLoading}
              />
              <MetricsCard
                title="Active Pipelines"
                value={activePipelines.length}
                icon={PlayIcon}
                color="warning"
                loading={statsLoading}
              />
              <MetricsCard
                title="System Health"
                value={systemStatus?.orchestrator_running ? 'Healthy' : 'Issues'}
                icon={ServerIcon}
                color={systemStatus?.orchestrator_running ? 'success' : 'danger'}
                loading={statsLoading}
              />
            </div>

            {/* Professional analytics cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Processing Statistics */}
              <Card variant="elevated">
                <CardHeader>
                  <h3 className="text-lg font-subheading font-semibold text-slate-900 dark:text-slate-100 tracking-tight">
                    Processing Statistics
                  </h3>
                </CardHeader>
                <CardContent>
                  {statsLoading ? (
                    <div className="flex items-center justify-center h-32">
                      <LoadingSpinner />
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600 dark:text-slate-400 font-medium">Total Processed</span>
                        <span className="font-bold text-slate-900 dark:text-slate-100 tabular-nums">
                          {formatNumber(monitoringStats?.total_processed || 0)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600 dark:text-slate-400 font-medium">Successful</span>
                        <span className="font-bold text-success-600 dark:text-success-400 tabular-nums">
                          {formatNumber(monitoringStats?.successful || 0)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600 dark:text-slate-400 font-medium">Failed</span>
                        <span className="font-bold text-danger-600 dark:text-danger-400 tabular-nums">
                          {formatNumber(monitoringStats?.failed || 0)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600 dark:text-slate-400 font-medium">Avg Processing Time</span>
                        <span className="font-bold text-slate-900 dark:text-slate-100 tabular-nums">
                          {monitoringStats?.avg_processing_time ? 
                            `${monitoringStats.avg_processing_time.toFixed(1)}s` : 'N/A'}
                        </span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* System Resources */}
              <Card variant="elevated">
                <CardHeader>
                  <h3 className="text-lg font-subheading font-semibold text-slate-900 dark:text-slate-100 tracking-tight">
                    System Resources
                  </h3>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600 dark:text-slate-400 font-medium">Active Connections</span>
                      <span className="font-bold text-slate-900 dark:text-slate-100 tabular-nums">
                        {systemStatus?.active_connections || 0}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600 dark:text-slate-400 font-medium">Schedules Loaded</span>
                      <span className="font-bold text-slate-900 dark:text-slate-100 tabular-nums">
                        {systemStatus?.orchestrator_status?.schedules_loaded || 0}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600 dark:text-slate-400 font-medium">Active Channels</span>
                      <span className="font-bold text-slate-900 dark:text-slate-100 tabular-nums">
                        {Object.keys(systemStatus?.orchestrator_status?.active_channels || {}).length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600 dark:text-slate-400 font-medium">Backend Status</span>
                      <Badge 
                        variant={systemStatus?.orchestrator_status?.highlights_backend_enabled ? 'success' : 'secondary'}
                        size="sm"
                      >
                        {systemStatus?.orchestrator_status?.highlights_backend_enabled ? 'Connected' : 'Disabled'}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Pipelines Tab */}
        {activeTab === 'pipelines' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                Pipeline Monitoring
              </h2>
              <Select
                label="Pipeline"
                value={selectedPipeline}
                onChange={setSelectedPipeline}
                options={pipelineOptions}
                className="min-w-[200px]"
              />
            </div>

            {activePipelines.length === 0 ? (
              <div className="text-center py-12">
                <PlayIcon className="mx-auto h-12 w-12 text-gray-400 dark:text-slate-500" />
                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                  No Active Pipelines
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
                  Start the orchestrator to begin pipeline monitoring
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {activePipelines.map((pipelineId) => (
                  <div key={pipelineId} className="card">
                    <div className="card-header">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        {pipelineId}
                      </h3>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-success-100 dark:bg-success-900 text-success-800 dark:text-success-200">
                        Active
                      </span>
                    </div>
                    <div className="card-body">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500 dark:text-slate-400">Status</span>
                          <span className="text-sm font-medium text-success-600 dark:text-success-400">
                            Running
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500 dark:text-slate-400">Uptime</span>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {/* Calculate uptime - placeholder */}
                            Active
                          </span>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedPipeline(pipelineId)}
                          className="w-full"
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pipeline-specific stats */}
            {selectedPipeline !== 'all' && pipelineStats && (
              <div className="card">
                <div className="card-header">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    {selectedPipeline} - Detailed Statistics
                  </h3>
                </div>
                <div className="card-body">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                        {formatNumber(pipelineStats.highlights_generated || 0)}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-slate-400">Highlights Generated</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-success-600 dark:text-success-400">
                        {pipelineStats.success_rate ? `${pipelineStats.success_rate.toFixed(1)}%` : '0%'}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-slate-400">Success Rate</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-warning-600 dark:text-warning-400">
                        {pipelineStats.avg_processing_time ? `${pipelineStats.avg_processing_time.toFixed(1)}s` : '0s'}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-slate-400">Avg Processing</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-danger-600 dark:text-danger-400">
                        {formatNumber(pipelineStats.errors || 0)}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-slate-400">Errors</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Recent Events Tab */}
        {activeTab === 'events' && (
          <div className="space-y-6">
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Recent Highlights
                </h3>
              </div>
              <div className="card-body">
                {recentHighlights?.highlights?.length === 0 ? (
                  <p className="text-center text-gray-500 dark:text-slate-400 py-8">
                    No recent highlights found
                  </p>
                ) : (
                  <div className="space-y-4">
                    {recentHighlights?.highlights?.slice(0, 10).map((highlight) => (
                      <div
                        key={highlight.id}
                        className="flex items-center justify-between p-4 border border-gray-200 dark:border-slate-600 rounded-lg"
                      >
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {highlight.title || `Highlight ${highlight.id}`}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-slate-400">
                            Schedule: {highlight.schedule_id} • 
                            Confidence: {highlight.confidence?.toFixed(2) || 'N/A'}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500 dark:text-slate-400">
                            {new Date(highlight.created_at).toLocaleString()}
                          </p>
                          <span className={cn(
                            'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
                            highlight.pushed
                              ? 'bg-success-100 dark:bg-success-900 text-success-800 dark:text-success-200'
                              : 'bg-warning-100 dark:bg-warning-900 text-warning-800 dark:text-warning-200'
                          )}>
                            {highlight.pushed ? 'Published' : 'Pending'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* System Health Tab */}
        {activeTab === 'health' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Orchestrator Health */}
              <div className="card">
                <div className="card-header">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Orchestrator Health
                  </h3>
                </div>
                <div className="card-body">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500 dark:text-slate-400">Status</span>
                      <span className={cn(
                        'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
                        systemStatus?.orchestrator_running
                          ? 'bg-success-100 dark:bg-success-900 text-success-800 dark:text-success-200'
                          : 'bg-danger-100 dark:bg-danger-900 text-danger-800 dark:text-danger-200'
                      )}>
                        {systemStatus?.orchestrator_running ? 'Running' : 'Stopped'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500 dark:text-slate-400">Backend Enabled</span>
                      <span className={cn(
                        'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
                        systemStatus?.orchestrator_status?.highlights_backend_enabled
                          ? 'bg-success-100 dark:bg-success-900 text-success-800 dark:text-success-200'
                          : 'bg-gray-100 dark:bg-slate-600 text-gray-800 dark:text-slate-200'
                      )}>
                        {systemStatus?.orchestrator_status?.highlights_backend_enabled ? 'Yes' : 'No'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* System Resources */}
              <div className="card">
                <div className="card-header">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    System Resources
                  </h3>
                </div>
                <div className="card-body">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500 dark:text-slate-400">Memory Usage</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {/* Placeholder - would need actual metrics */}
                        Normal
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500 dark:text-slate-400">CPU Usage</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {/* Placeholder - would need actual metrics */}
                        Normal
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500 dark:text-slate-400">Disk Usage</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {/* Placeholder - would need actual metrics */}
                        Normal
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}