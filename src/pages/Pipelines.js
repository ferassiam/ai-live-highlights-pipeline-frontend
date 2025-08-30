import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  PlayIcon,
  StopIcon,
  CpuChipIcon,
  ClockIcon,
  DocumentIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';

import { apiService, showSuccessToast, showErrorToast } from '../services/api';

export default function Pipelines() {
  const queryClient = useQueryClient();

  // Fetch pipelines
  const { data: pipelinesData, isLoading } = useQuery({
    queryKey: ['pipelines'],
    queryFn: () => apiService.getPipelines(),
    refetchInterval: 30000,
  });

  // Fetch system status
  const { data: status } = useQuery({
    queryKey: ['systemStatus'],
    queryFn: () => apiService.getStatus(),
    refetchInterval: 30000,
  });

  // Fetch schedules for pipeline information
  const { data: schedulesData } = useQuery({
    queryKey: ['schedules'],
    queryFn: () => apiService.getSchedules(),
  });

  // Fetch segment files for pipeline activity
  const { data: filesData } = useQuery({
    queryKey: ['segmentFiles'],
    queryFn: () => apiService.getSegmentFiles(),
    refetchInterval: 60000,
  });

  // Pipeline control mutations
  const startMutation = useMutation({
    mutationFn: (scheduleId) => apiService.startPipeline(scheduleId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['pipelines'] });
      queryClient.invalidateQueries({ queryKey: ['systemStatus'] });
      showSuccessToast(data.message);
    },
    onError: (error) => {
      showErrorToast(error.response?.data?.detail || 'Failed to start pipeline');
    },
  });

  const stopMutation = useMutation({
    mutationFn: (scheduleId) => apiService.stopPipeline(scheduleId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['pipelines'] });
      queryClient.invalidateQueries({ queryKey: ['systemStatus'] });
      showSuccessToast(data.message);
    },
    onError: (error) => {
      showErrorToast(error.response?.data?.detail || 'Failed to stop pipeline');
    },
  });

  const activePipelines = pipelinesData?.active_pipelines || [];
  const orchestratorRunning = status?.orchestrator_running || false;
  const activeChannels = status?.orchestrator_status?.active_channels || {};
  const schedules = schedulesData?.schedules || [];
  const files = filesData?.files || [];

  const handleStartPipeline = (scheduleId) => {
    startMutation.mutate(scheduleId);
  };

  const handleStopPipeline = (scheduleId) => {
    stopMutation.mutate(scheduleId);
  };

  // Get pipeline statistics
  const getPipelineStats = (scheduleId) => {
    const pipelineFiles = files.filter(f => f.pipeline_id.includes(scheduleId.slice(0, 8)));
    const mp4Files = pipelineFiles.filter(f => f.type === 'mp4');
    const jsonFiles = pipelineFiles.filter(f => f.type === 'json');
    
    return {
      segments: mp4Files.length,
      results: jsonFiles.length,
      latestActivity: mp4Files.length > 0 ? mp4Files[0].modified : null,
    };
  };

  const getScheduleInfo = (scheduleId) => {
    return schedules.find(s => s.id === scheduleId);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            Pipelines
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-slate-400">
            Monitor and control video processing pipelines
          </p>
        </div>
      </div>

      {/* Status banner */}
      {!orchestratorRunning && (
        <div className="rounded-md bg-warning-50 dark:bg-warning-900/20 p-4 border border-warning-200 dark:border-warning-700">
          <div className="flex">
            <div className="flex-shrink-0">
              <ClockIcon className="h-5 w-5 text-warning-400 dark:text-warning-500" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-warning-800 dark:text-warning-200">
                Orchestrator Stopped
              </h3>
              <div className="mt-2 text-sm text-warning-700 dark:text-warning-300">
                <p>
                  The orchestrator is not running. Start it from the Dashboard to see active pipelines.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pipeline summary */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-4">
        <div className="metric-card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CpuChipIcon className="h-6 w-6 text-primary-600" />
            </div>
            <div className="ml-4">
              <div className="metric-value">{activePipelines.length}</div>
              <div className="metric-label">Active Pipelines</div>
            </div>
          </div>
        </div>
        <div className="metric-card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <PlayIcon className="h-6 w-6 text-success-600" />
            </div>
            <div className="ml-4">
              <div className="metric-value">{Object.keys(activeChannels).length}</div>
              <div className="metric-label">Connected Channels</div>
            </div>
          </div>
        </div>
        <div className="metric-card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <DocumentIcon className="h-6 w-6 text-warning-600" />
            </div>
            <div className="ml-4">
              <div className="metric-value">{files.filter(f => f.type === 'mp4').length}</div>
              <div className="metric-label">Total Segments</div>
            </div>
          </div>
        </div>
        <div className="metric-card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ChartBarIcon className="h-6 w-6 text-gray-600" />
            </div>
            <div className="ml-4">
              <div className="metric-value">{files.filter(f => f.type === 'json').length}</div>
              <div className="metric-label">Result Files</div>
            </div>
          </div>
        </div>
      </div>

      {/* Active pipelines */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-medium text-gray-900">Active Pipelines</h3>
        </div>
        <div className="card-body p-0">
          {activePipelines.length === 0 ? (
            <div className="text-center py-12">
              <CpuChipIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No active pipelines</h3>
              <p className="mt-1 text-sm text-gray-500">
                {orchestratorRunning 
                  ? 'Pipelines will appear here when channels are running and processing video.'
                  : 'Start the orchestrator to see active pipelines.'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {activePipelines.map((scheduleId) => {
                const scheduleInfo = getScheduleInfo(scheduleId);
                const channel = activeChannels[scheduleId];
                const stats = getPipelineStats(scheduleId);
                
                return (
                  <div key={scheduleId} className="p-6">
                    <div className="flex items-center justify-between">
                      {/* Pipeline info */}
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <div className="h-12 w-12 bg-success-100 rounded-lg flex items-center justify-center">
                            <CpuChipIcon className="h-6 w-6 text-success-600" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <h3 className="text-lg font-medium text-gray-900">
                              {scheduleInfo?.name || scheduleId}
                            </h3>
                            <span className="status-running">Running</span>
                          </div>
                          <div className="mt-1 space-y-1">
                            <p className="text-sm text-gray-600">Schedule: {scheduleId}</p>
                            {channel && (
                              <p className="text-sm text-gray-600">Channel: {channel.name}</p>
                            )}
                            {scheduleInfo && (
                              <p className="text-sm text-gray-600">
                                Segment Duration: {scheduleInfo.pipeline_config?.segment_duration || 120}s
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Pipeline controls */}
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-2">
                          <div className="h-3 w-3 rounded-full bg-success-500 animate-pulse-fast"></div>
                          <span className="text-sm text-gray-600">Processing</span>
                        </div>
                        <button
                          onClick={() => handleStopPipeline(scheduleId)}
                          disabled={stopMutation.isLoading}
                          className="btn btn-danger btn-sm flex items-center"
                          title="Stop pipeline"
                        >
                          <StopIcon className="h-4 w-4 mr-1" />
                          Stop
                        </button>
                      </div>
                    </div>

                    {/* Pipeline statistics */}
                    <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                          Segments Processed
                        </div>
                        <div className="mt-1 text-sm text-gray-900 font-medium">
                          {stats.segments}
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                          Result Files
                        </div>
                        <div className="mt-1 text-sm text-gray-900 font-medium">
                          {stats.results}
                        </div>
                      </div>

                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                          Last Activity
                        </div>
                        <div className="mt-1 text-sm text-gray-900 font-medium">
                          {stats.latestActivity 
                            ? new Date(stats.latestActivity).toLocaleTimeString()
                            : 'No activity'
                          }
                        </div>
                      </div>
                    </div>

                    {/* Pipeline configuration */}
                    {scheduleInfo && (
                      <div className="mt-4 p-3 bg-primary-50 rounded-lg">
                        <div className="text-xs font-medium text-primary-700 uppercase tracking-wide mb-2">
                          Configuration
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-primary-600">Segments per batch:</span>
                            <span className="ml-2 text-primary-900">
                              {scheduleInfo.pipeline_config?.segments_per_batch || 1}
                            </span>
                          </div>
                          <div>
                            <span className="text-primary-600">Quiet mode:</span>
                            <span className="ml-2 text-primary-900">
                              {scheduleInfo.pipeline_config?.quiet_mode ? 'Enabled' : 'Disabled'}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Available channels for pipeline start */}
      {orchestratorRunning && activePipelines.length < Object.keys(activeChannels).length && (
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900">Available Channels</h3>
            <p className="text-sm text-gray-500">Channels without active pipelines</p>
          </div>
          <div className="card-body p-0">
            <div className="divide-y divide-gray-200">
              {Object.entries(activeChannels)
                .filter(([scheduleId]) => !activePipelines.includes(scheduleId))
                .map(([scheduleId, channel]) => {
                  const scheduleInfo = getScheduleInfo(scheduleId);
                  
                  return (
                    <div key={scheduleId} className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="flex-shrink-0">
                            <div className="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center">
                              <CpuChipIcon className="h-5 w-5 text-gray-400" />
                            </div>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">
                              {scheduleInfo?.name || scheduleId}
                            </h4>
                            <p className="text-sm text-gray-600">Channel: {channel.name}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleStartPipeline(scheduleId)}
                          disabled={startMutation.isLoading}
                          className="btn btn-success btn-sm flex items-center"
                        >
                          <PlayIcon className="h-4 w-4 mr-1" />
                          Start Pipeline
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}

      {/* Pipeline management tips */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-medium text-gray-900">Pipeline Management</h3>
        </div>
        <div className="card-body">
          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-0.5">
                <div className="h-2 w-2 bg-primary-500 rounded-full"></div>
              </div>
              <div className="ml-3">
                <p><strong>Automatic Processing:</strong> Pipelines automatically start when channels are created if auto_start_pipeline is enabled in the schedule.</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-0.5">
                <div className="h-2 w-2 bg-primary-500 rounded-full"></div>
              </div>
              <div className="ml-3">
                <p><strong>Manual Control:</strong> You can manually start and stop pipelines independently of channel status for testing purposes.</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-0.5">
                <div className="h-2 w-2 bg-primary-500 rounded-full"></div>
              </div>
              <div className="ml-3">
                <p><strong>Processing Flow:</strong> Pipelines segment video streams, process them through Azure AI, and generate highlights using OpenAI.</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-0.5">
                <div className="h-2 w-2 bg-primary-500 rounded-full"></div>
              </div>
              <div className="ml-3">
                <p><strong>Output Monitoring:</strong> Check the segments and results counts to monitor pipeline activity and performance.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}