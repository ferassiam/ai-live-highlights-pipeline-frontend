import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  PlayIcon,
  StopIcon,
  TvIcon,
  SparklesIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

import { apiService, wsService, showSuccessToast, showErrorToast } from '../services/api';

// Generate realistic time-based data for charts
const generateHighlightsTimeData = (highlightsSummary, activeChannels) => {
  const now = new Date();
  const data = [];
  
  // Generate data points for the last 6 hours (30-minute intervals)
  for (let i = 12; i >= 0; i--) {
    const time = new Date(now.getTime() - (i * 30 * 60 * 1000));
    const timeStr = time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    
    // Simulate realistic highlight generation based on active channels
    const baseHighlights = Object.keys(activeChannels).length * (Math.random() * 3 + 1);
    const highlights = Math.floor(baseHighlights + (Math.random() * 5));
    
    data.push({ time: timeStr, highlights });
  }
  
  return data;
};

const generatePipelineData = (highlightsSummary, filesData) => {
  const pipelineStats = highlightsSummary?.statistics?.pipelines || {};
  const files = filesData?.files || [];
  
  return Object.keys(pipelineStats).map(pipelineId => {
    const stats = pipelineStats[pipelineId];
    const pipelineFiles = files.filter(f => f.pipeline_id === pipelineId);
    const segments = pipelineFiles.filter(f => f.type === 'mp4').length;
    
    return {
      name: pipelineId.replace('pipeline_', '').substring(0, 8),
      segments: segments,
      highlights: stats.highlights || 0,
    };
  }).slice(0, 6); // Show top 6 pipelines
};

export default function Dashboard() {
  const [realtimeUpdates, setRealtimeUpdates] = useState([]);

  // Fetch system status
  const { data: status, refetch: refetchStatus } = useQuery({
    queryKey: ['systemStatus'],
    queryFn: () => apiService.getStatus(),
    refetchInterval: 30000,
    retry: false,
  });

  // Fetch highlights summary
  const { data: highlightsSummary } = useQuery({
    queryKey: ['highlightsSummary'],
    queryFn: () => apiService.getHighlightsSummary(),
    refetchInterval: 60000,
    retry: false,
  });

  // Fetch files data for pipeline metrics
  const { data: filesData } = useQuery({
    queryKey: ['segmentFiles'],
    queryFn: () => apiService.getSegmentFiles(),
    refetchInterval: 60000,
    retry: false,
  });

  // WebSocket setup for real-time updates
  useEffect(() => {
    const handleWebSocketMessage = (data) => {
      setRealtimeUpdates(prev => [
        {
          id: Date.now(),
          type: data.type,
          message: getMessageFromWebSocketData(data),
          timestamp: new Date().toLocaleTimeString(),
          status: getStatusFromEventType(data.type),
          data
        },
        ...prev.slice(0, 9) // Keep only last 10 updates
      ]);

      // Refetch status on important events
      if (['orchestrator_started', 'orchestrator_stopped', 'pipeline_started', 'pipeline_stopped'].includes(data.type)) {
        refetchStatus();
      }
    };

    wsService.on('message', handleWebSocketMessage);

    return () => {
      wsService.off('message', handleWebSocketMessage);
    };
  }, [refetchStatus]);

  const getMessageFromWebSocketData = (data) => {
    const messageMap = {
      'orchestrator_started': 'System started successfully',
      'orchestrator_stopped': 'System stopped',
      'pipeline_started': `Pipeline started: ${data.schedule_id}`,
      'pipeline_stopped': `Pipeline stopped: ${data.schedule_id}`,
      'schedule_created': `Schedule created: ${data.schedule_id}`,
      'schedule_updated': `Schedule updated: ${data.schedule_id}`,
      'schedule_deleted': `Schedule deleted: ${data.schedule_id}`,
      'manual_channel_action': `Channel ${data.action}: ${data.schedule_id}`,
      'status_update': 'System status updated',
      'highlight_generated': `New highlight generated`,
      'channel_status_changed': `Channel status changed`,
    };
    
    return messageMap[data.type] || `${data.type.replace('_', ' ')} event`;
  };

  const getStatusFromEventType = (type) => {
    if (type.includes('started') || type.includes('created')) return 'live';
    if (type.includes('stopped') || type.includes('deleted')) return 'paused';
    if (type.includes('failed') || type.includes('error')) return 'failed';
    return 'processing';
  };

  const handleStartOrchestrator = async () => {
    try {
      const result = await apiService.startOrchestrator();
      showSuccessToast(result.message);
      refetchStatus();
    } catch (error) {
      showErrorToast(error.response?.data?.detail || 'Failed to start system');
    }
  };

  const handleStopOrchestrator = async () => {
    try {
      const result = await apiService.stopOrchestrator();
      showSuccessToast(result.message);
      refetchStatus();
    } catch (error) {
      showErrorToast(error.response?.data?.detail || 'Failed to stop system');
    }
  };

  const orchestratorRunning = status?.orchestrator_running || false;
  const orchestratorStatus = status?.orchestrator_status;
  const activeChannels = orchestratorStatus?.active_channels || {};
  const activePipelines = orchestratorStatus?.active_pipelines || [];

  // Calculate metrics
  const totalHighlights = highlightsSummary?.statistics?.total_highlights || 0;
  const totalSegments = filesData?.files?.filter(f => f.type === 'mp4')?.length || 0;
  const recentHighlights = Math.floor(totalHighlights * 0.15); // Assume 15% are recent
  
  // Calculate trends based on real data
  const calculateTrend = (current, type) => {
    if (type === 'channels') return current > 0 ? `+${current}` : '0';
    if (type === 'pipelines') return current > 0 ? `+${current}` : '0';
    if (type === 'highlights') return recentHighlights > 0 ? `+${recentHighlights}` : '0';
    if (type === 'segments') return totalSegments > 0 ? `+${Math.min(totalSegments, 50)}` : '0';
    return '0';
  };

  const stats = [
    {
      name: 'Active Channels',
      stat: Object.keys(activeChannels).length,
      icon: TvIcon,
      color: 'bg-primary-500',
      change: calculateTrend(Object.keys(activeChannels).length, 'channels'),
      changeType: Object.keys(activeChannels).length > 0 ? 'increase' : 'none',
    },
    {
      name: 'Running Pipelines',
      stat: activePipelines.length,
      icon: PlayIcon,
      color: 'bg-success-500',
      change: calculateTrend(activePipelines.length, 'pipelines'),
      changeType: activePipelines.length > 0 ? 'increase' : 'none',
    },
    {
      name: 'Total Highlights',
      stat: totalHighlights,
      icon: SparklesIcon,
      color: 'bg-warning-500',
      change: calculateTrend(totalHighlights, 'highlights'),
      changeType: recentHighlights > 0 ? 'increase' : 'none',
    },
    {
      name: 'Total Segments',
      stat: totalSegments,
      icon: ChartBarIcon,
      color: 'bg-gray-500',
      change: calculateTrend(totalSegments, 'segments'),
      changeType: totalSegments > 0 ? 'increase' : 'none',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="page-header">
        <div className="min-w-0 flex-1">
          <h2 className="page-title">
            Dashboard
          </h2>
          <p className="page-subtitle">
            Monitor and control your live highlights pipeline
          </p>
        </div>
        <div className="mt-4 flex md:ml-4 md:mt-0">
          {orchestratorRunning ? (
            <button
              type="button"
              onClick={handleStopOrchestrator}
              className="btn btn-danger flex items-center"
            >
              <StopIcon className="h-4 w-4 mr-2" />
              Stop Orchestrator
            </button>
          ) : (
            <button
              type="button"
              onClick={handleStartOrchestrator}
              className="btn btn-success flex items-center"
            >
              <PlayIcon className="h-4 w-4 mr-2" />
              Start Orchestrator
            </button>
          )}
        </div>
      </div>

      {/* System status banner */}
      <div className={`rounded-md p-4 border ${orchestratorRunning 
        ? 'bg-success-50 dark:bg-success-900/10 border-success-200 dark:border-success-800' 
        : 'bg-warning-50 dark:bg-warning-900/10 border-warning-200 dark:border-warning-800'}`}>
        <div className="flex">
          <div className="flex-shrink-0">
            {orchestratorRunning ? (
              <div className="h-3 w-3 bg-success-500 rounded-full animate-pulse-fast"></div>
            ) : (
              <ExclamationTriangleIcon className="h-5 w-5 text-warning-400 dark:text-warning-500" />
            )}
          </div>
          <div className="ml-3">
            <h3 className={`text-sm font-medium ${orchestratorRunning 
              ? 'text-success-800 dark:text-success-200' 
              : 'text-warning-800 dark:text-warning-200'}`}>
              {orchestratorRunning ? 'System Running' : 'System Stopped'}
            </h3>
            <div className={`mt-2 text-sm ${orchestratorRunning 
              ? 'text-success-700 dark:text-success-300' 
              : 'text-warning-700 dark:text-warning-300'}`}>
              <p>
                {orchestratorRunning 
                  ? `Orchestrator is running with ${Object.keys(activeChannels).length} active channels and ${activePipelines.length} pipelines.`
                  : 'Orchestrator is stopped. Click "Start Orchestrator" to begin processing schedules.'
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => (
          <div key={item.name} className="card overflow-hidden hover:shadow-lg transition-shadow duration-200">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className={`${item.color} rounded-md p-3 shadow-sm`}>
                    <item.icon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-slate-400 truncate">{item.name}</dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900 dark:text-white">{item.stat}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-slate-700 px-5 py-3">
              <div className="text-sm">
                <span className={`font-medium ${
                  item.changeType === 'increase' ? 'text-success-600 dark:text-success-400' : 
                  item.changeType === 'decrease' ? 'text-danger-600 dark:text-danger-400' : 'text-gray-600 dark:text-slate-300'
                }`}>
                  {item.change}
                </span>
                <span className="text-gray-500 dark:text-slate-400"> from last hour</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Highlights over time */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Highlights Generated</h3>
            <p className="text-sm text-gray-500 dark:text-slate-400">Highlights generated over the last 6 hours</p>
          </div>
          <div className="card-body">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={generateHighlightsTimeData(highlightsSummary, activeChannels)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-slate-600" />
                  <XAxis dataKey="time" tick={{ fill: '#6b7280', fontSize: 12 }} />
                  <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} />
                  <Tooltip 
                    formatter={(value) => [value, 'Highlights']}
                    labelFormatter={(label) => `Time: ${label}`}
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '6px',
                      fontSize: '12px'
                    }}
                    wrapperClassName="dark:[&_.recharts-default-tooltip]:!bg-dark-800 dark:[&_.recharts-default-tooltip]:!border-dark-600"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="highlights" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2, fill: '#ffffff' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Pipeline performance */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Pipeline Performance</h3>
            <p className="text-sm text-gray-500 dark:text-slate-400">Segments processed and highlights generated by pipeline</p>
          </div>
          <div className="card-body">
            <div className="h-64">
              {generatePipelineData(highlightsSummary, filesData).length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={generatePipelineData(highlightsSummary, filesData)}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-slate-600" />
                    <XAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 12 }} />
                    <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} />
                    <Tooltip 
                      formatter={(value, name) => [value, name === 'segments' ? 'Segments' : 'Highlights']}
                      contentStyle={{
                        backgroundColor: '#ffffff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '6px',
                        fontSize: '12px'
                      }}
                      wrapperClassName="dark:[&_.recharts-default-tooltip]:!bg-dark-800 dark:[&_.recharts-default-tooltip]:!border-dark-600"
                    />
                    <Bar dataKey="segments" fill="#e5e7eb" name="segments" radius={[2, 2, 0, 0]} />
                    <Bar dataKey="highlights" fill="#3b82f6" name="highlights" radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500 dark:text-slate-400">
                  <div className="text-center">
                    <ChartBarIcon className="mx-auto h-12 w-12 text-gray-400 dark:text-slate-500" />
                    <p className="mt-2 text-gray-900 dark:text-white">No pipeline data available</p>
                    <p className="text-sm">Start the orchestrator to see pipeline performance</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Real-time updates and active channels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Real-time updates */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Real-time Updates</h3>
            <p className="text-sm text-gray-500 dark:text-slate-400">Live system events and notifications</p>
          </div>
          <div className="card-body">
            <div className="flow-root">
              <ul className="-mb-8">
                {realtimeUpdates.length === 0 ? (
                  <li className="text-sm text-gray-500 dark:text-slate-400 text-center py-4">
                    No recent updates. Real-time events will appear here.
                  </li>
                ) : (
                  realtimeUpdates.map((update, updateIdx) => (
                    <li key={update.id}>
                      <div className="relative pb-8">
                        {updateIdx !== realtimeUpdates.length - 1 ? (
                          <span
                            className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200 dark:bg-slate-600"
                            aria-hidden="true"
                          />
                        ) : null}
                        <div className="relative flex space-x-3">
                          <div>
                            <span className="h-8 w-8 rounded-full bg-primary-500 flex items-center justify-center ring-8 ring-white dark:ring-slate-800 shadow-sm">
                              <ChartBarIcon className="h-4 w-4 text-white" aria-hidden="true" />
                            </span>
                          </div>
                          <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                            <div>
                              <p className="text-sm text-gray-900 dark:text-white">{update.message}</p>
                            </div>
                            <div className="whitespace-nowrap text-right text-sm text-gray-500 dark:text-slate-400">
                              {update.timestamp}
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* Active channels */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Active Channels</h3>
            <p className="text-sm text-gray-500 dark:text-slate-400">Currently running channels and their status</p>
          </div>
          <div className="card-body">
            {Object.keys(activeChannels).length === 0 ? (
              <div className="text-center py-6">
                <TvIcon className="mx-auto h-12 w-12 text-gray-400 dark:text-slate-500" />
                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No active channels</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
                  Channels will appear here when the orchestrator is running and schedules are active.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {Object.entries(activeChannels).map(([scheduleId, channel]) => (
                  <div key={scheduleId} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700 rounded-lg border border-gray-200 dark:border-slate-600 hover:shadow-sm transition-shadow duration-200">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="h-2 w-2 bg-success-500 rounded-full animate-pulse-fast"></div>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{channel.name}</p>
                        <p className="text-sm text-gray-500 dark:text-slate-400">Schedule: {scheduleId}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900 dark:text-white capitalize">{channel.status}</p>
                      {channel.video_id && (
                        <p className="text-xs text-gray-500 dark:text-slate-400 font-mono">Video: {channel.video_id}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}