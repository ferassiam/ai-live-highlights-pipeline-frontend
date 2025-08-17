import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  TvIcon,
  PlayIcon,
  StopIcon,
  SignalIcon,
  ClockIcon,
  VideoCameraIcon,
} from '@heroicons/react/24/outline';

import { apiService, showSuccessToast, showErrorToast } from '../services/api';

export default function Channels() {
  const queryClient = useQueryClient();

  // Fetch channels
  const { data: channelsData, isLoading } = useQuery({
    queryKey: ['channels'],
    queryFn: () => apiService.getChannels(),
    refetchInterval: 30000,
  });

  // Fetch system status
  const { data: status } = useQuery({
    queryKey: ['systemStatus'],
    queryFn: () => apiService.getStatus(),
    refetchInterval: 30000,
  });

  // Manual control mutation
  const manualControlMutation = useMutation({
    mutationFn: ({ scheduleId, action }) => apiService.manualChannelControl(scheduleId, action),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['channels'] });
      queryClient.invalidateQueries({ queryKey: ['systemStatus'] });
      showSuccessToast(data.message);
    },
    onError: (error) => {
      showErrorToast(error.response?.data?.detail || 'Failed to control channel');
    },
  });

  const activeChannels = channelsData?.active_channels || {};
  const orchestratorRunning = status?.orchestrator_running || false;

  const handleManualControl = (scheduleId, action) => {
    manualControlMutation.mutate({ scheduleId, action });
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
            Channels
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-slate-400">
            Monitor and control active streaming channels
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
                  The orchestrator is not running. Start it from the Dashboard to see active channels.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Active channels summary */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="metric-card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <TvIcon className="h-6 w-6 text-primary-600" />
            </div>
            <div className="ml-4">
              <div className="metric-value">{Object.keys(activeChannels).length}</div>
              <div className="metric-label">Active Channels</div>
            </div>
          </div>
        </div>
        <div className="metric-card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <SignalIcon className="h-6 w-6 text-success-600" />
            </div>
            <div className="ml-4">
              <div className="metric-value">
                {Object.values(activeChannels).filter(ch => ch.status === 'running').length}
              </div>
              <div className="metric-label">Streaming</div>
            </div>
          </div>
        </div>
        <div className="metric-card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <VideoCameraIcon className="h-6 w-6 text-warning-600" />
            </div>
            <div className="ml-4">
              <div className="metric-value">
                {Object.values(activeChannels).filter(ch => ch.video_id).length}
              </div>
              <div className="metric-label">With Video ID</div>
            </div>
          </div>
        </div>
      </div>

      {/* Channels list */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Active Channels</h3>
        </div>
        <div className="card-body p-0">
          {Object.keys(activeChannels).length === 0 ? (
            <div className="text-center py-12">
              <TvIcon className="mx-auto h-12 w-12 text-gray-400 dark:text-slate-500" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No active channels</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
                {orchestratorRunning 
                  ? 'Channels will appear here when schedules are active and running.'
                  : 'Start the orchestrator to see active channels.'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-dark-600">
              {Object.entries(activeChannels).map(([scheduleId, channel]) => (
                <div key={scheduleId} className="p-6">
                  <div className="flex items-center justify-between">
                    {/* Channel info */}
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="h-12 w-12 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
                          <TvIcon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <h3 className="text-lg font-medium text-gray-900 dark:text-white">{channel.name}</h3>
                          <span className={`status-indicator ${
                            channel.status === 'running' ? 'status-running' : 
                            channel.status === 'stopped' ? 'status-stopped' : 'status-warning'
                          }`}>
                            {channel.status}
                          </span>
                        </div>
                        <div className="mt-1 space-y-1">
                          <p className="text-sm text-gray-600 dark:text-slate-400">Schedule: {scheduleId}</p>
                          <p className="text-sm text-gray-600 dark:text-slate-400">Channel ID: {channel.channel_id}</p>
                          {channel.video_id && (
                            <p className="text-sm text-gray-600 dark:text-slate-400">Video ID: {channel.video_id}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Channel status and controls */}
                    <div className="flex items-center space-x-3">
                      {/* Status indicator */}
                      <div className="flex items-center space-x-2">
                        <div className={`h-3 w-3 rounded-full ${
                          channel.status === 'running' ? 'bg-success-500 animate-pulse-fast' : 
                          channel.status === 'stopped' ? 'bg-gray-400 dark:bg-dark-500' : 'bg-warning-500'
                        }`}></div>
                        <span className="text-sm text-gray-600 dark:text-slate-400 capitalize">{channel.status}</span>
                      </div>

                      {/* Manual controls */}
                      <div className="flex space-x-2">
                        {channel.status === 'running' ? (
                          <button
                            onClick={() => handleManualControl(scheduleId, 'stop')}
                            disabled={manualControlMutation.isLoading}
                            className="btn btn-danger btn-sm flex items-center space-x-1"
                            title="Stop channel"
                          >
                            <StopIcon className="h-4 w-4" />
                            <span>Stop</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => handleManualControl(scheduleId, 'start')}
                            disabled={manualControlMutation.isLoading}
                            className="btn btn-success btn-sm flex items-center space-x-1"
                            title="Start channel"
                          >
                            <PlayIcon className="h-4 w-4" />
                            <span>Start</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Additional channel details */}
                  <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="bg-gray-50 dark:bg-slate-700 p-3 rounded-lg border border-gray-200 dark:border-slate-600">
                      <div className="text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wide">
                        Channel Name
                      </div>
                      <div className="mt-1 text-sm text-gray-900 dark:text-white font-mono">
                        {channel.name}
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 dark:bg-slate-700 p-3 rounded-lg border border-gray-200 dark:border-slate-600">
                      <div className="text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wide">
                        Channel ID
                      </div>
                      <div className="mt-1 text-sm text-gray-900 dark:text-white font-mono">
                        {channel.channel_id}
                      </div>
                    </div>

                    {channel.video_id && (
                      <div className="bg-gray-50 dark:bg-slate-700 p-3 rounded-lg border border-gray-200 dark:border-slate-600">
                        <div className="text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wide">
                          Video ID
                        </div>
                        <div className="mt-1 text-sm text-gray-900 dark:text-white font-mono">
                          {channel.video_id}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Channel streaming URLs would go here if available */}
                  {channel.status === 'running' && (
                    <div className="mt-4 p-3 bg-success-50 dark:bg-success-900/20 rounded-lg border border-success-200 dark:border-success-700">
                      <div className="flex items-center">
                        <SignalIcon className="h-4 w-4 text-success-600 dark:text-success-400 mr-2" />
                        <span className="text-sm text-success-800 dark:text-success-200">
                          Channel is actively streaming and available for highlights generation
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Channel management tips */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-medium text-gray-900">Channel Management</h3>
        </div>
        <div className="card-body">
          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-0.5">
                <div className="h-2 w-2 bg-primary-500 rounded-full"></div>
              </div>
              <div className="ml-3">
                <p><strong>Automatic Management:</strong> Channels are automatically created and managed based on your schedules when the orchestrator is running.</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-0.5">
                <div className="h-2 w-2 bg-primary-500 rounded-full"></div>
              </div>
              <div className="ml-3">
                <p><strong>Manual Control:</strong> Use the Start/Stop buttons to manually override scheduled channel operations for testing purposes.</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-0.5">
                <div className="h-2 w-2 bg-primary-500 rounded-full"></div>
              </div>
              <div className="ml-3">
                <p><strong>Video Integration:</strong> Channels with Video IDs are connected to the highlights backend for automatic highlight publishing.</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-0.5">
                <div className="h-2 w-2 bg-primary-500 rounded-full"></div>
              </div>
              <div className="ml-3">
                <p><strong>Status Monitoring:</strong> Channel status updates in real-time. Running channels are actively streaming and processing highlights.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}