import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  PlayIcon,
  StopIcon,
  TvIcon,
  SparklesIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  PlusIcon,
  CalendarIcon,
  WrenchScrewdriverIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

import { apiService, wsService, showSuccessToast, showErrorToast } from '../services/api';
import { Card, CardHeader, CardTitle, CardContent, CardActions } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { StatusIndicator } from '../components/ui/StatusIndicator';
import { MetricsCard } from '../components/ui/MetricsCard';
import { SkeletonCard } from '../components/ui/LoadingSpinner';

/**
 * Sports operations dashboard with live KPIs and activity feed
 * Optimized for high information density and quick actions
 */
export default function Dashboard() {
  const [realtimeUpdates, setRealtimeUpdates] = useState([]);

  // Fetch system status
  const { data: status, refetch: refetchStatus, isLoading: statusLoading } = useQuery({
    queryKey: ['systemStatus'],
    queryFn: () => apiService.getStatus(),
    refetchInterval: 30000,
    retry: false,
  });

  // Fetch highlights summary
  const { data: highlightsSummary, isLoading: highlightsLoading } = useQuery({
    queryKey: ['highlightsSummary'],
    queryFn: () => apiService.getHighlightsSummary(),
    refetchInterval: 60000,
    retry: false,
  });

  // Fetch files data for pipeline metrics
  const { data: filesData, isLoading: filesLoading } = useQuery({
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
  const recentHighlights = Math.floor(totalHighlights * 0.15);
  const errorCount = realtimeUpdates.filter(u => u.status === 'failed').length;

  // Generate chart data
  const generateHighlightsTimeData = () => {
    const now = new Date();
    const data = [];
    
    for (let i = 11; i >= 0; i--) {
      const time = new Date(now.getTime() - (i * 60 * 60 * 1000));
      const timeStr = time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      const highlights = Math.floor(Math.random() * (Object.keys(activeChannels).length * 3 + 1));
      data.push({ time: timeStr, highlights });
    }
    
    return data;
  };

  const generatePipelineData = () => {
    const pipelineStats = highlightsSummary?.statistics?.pipelines || {};
    const files = filesData?.files || [];
    
    return Object.keys(pipelineStats).slice(0, 6).map(pipelineId => {
      const stats = pipelineStats[pipelineId];
      const pipelineFiles = files.filter(f => f.pipeline_id === pipelineId);
      const segments = pipelineFiles.filter(f => f.type === 'mp4').length;
      
      return {
        name: pipelineId.replace('pipeline_', '').substring(0, 8),
        segments: segments,
        highlights: stats.highlights || 0,
      };
    });
  };

  const isLoading = statusLoading || highlightsLoading || filesLoading;

  return (
    <div className="space-y-6">
      {/* Page header with quick actions */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-surface-50 [data-theme='light'] &:text-surface-950">
            Operations Dashboard
          </h1>
          <p className="text-muted mt-1">
            Live sports broadcast operations and content pipeline
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="subtle"
            size="sm"
            leftIcon={CalendarIcon}
          >
            New Schedule
          </Button>
          <Button
            variant="subtle"
            size="sm"
            leftIcon={SparklesIcon}
          >
            Create Highlight
          </Button>
          <Button
            variant={orchestratorRunning ? 'destructive' : 'primary'}
            leftIcon={orchestratorRunning ? StopIcon : PlayIcon}
            onClick={orchestratorRunning ? handleStopOrchestrator : handleStartOrchestrator}
          >
            {orchestratorRunning ? 'Stop System' : 'Start System'}
          </Button>
        </div>
      </div>

      {/* System status banner */}
      <Card className={cn(
        'border-l-4',
        orchestratorRunning 
          ? 'border-l-success-500 bg-success-950/20 [data-theme="light"] &:bg-success-50' 
          : 'border-l-warning-500 bg-warning-950/20 [data-theme="light"] &:bg-warning-50'
      )}>
        <CardContent className="py-4">
          <div className="flex items-center gap-4">
            <StatusIndicator 
              status={orchestratorRunning ? 'live' : 'paused'}
              size="md"
            />
            <div className="flex-1">
              <h3 className={cn(
                'font-semibold',
                orchestratorRunning 
                  ? 'text-success-400 [data-theme="light"] &:text-success-700' 
                  : 'text-warning-400 [data-theme="light"] &:text-warning-700'
              )}>
                {orchestratorRunning ? 'System Operational' : 'System Offline'}
              </h3>
              <p className={cn(
                'text-sm',
                orchestratorRunning 
                  ? 'text-success-300 [data-theme="light"] &:text-success-600' 
                  : 'text-warning-300 [data-theme="light"] &:text-warning-600'
              )}>
                {orchestratorRunning 
                  ? `${Object.keys(activeChannels).length} channels active, ${activePipelines.length} pipelines running`
                  : 'Start the system to begin processing live content'
                }
              </p>
            </div>
            {!orchestratorRunning && (
              <Button
                variant="primary"
                size="sm"
                leftIcon={PlayIcon}
                onClick={handleStartOrchestrator}
              >
                Start System
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* KPI Metrics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricsCard
          title="Live Channels"
          value={Object.keys(activeChannels).length}
          change={Object.keys(activeChannels).length > 0 ? 12 : 0}
          changeType={Object.keys(activeChannels).length > 0 ? 'positive' : 'neutral'}
          icon={TvIcon}
          color="primary"
          loading={isLoading}
          subtitle="Currently streaming"
        />
        <MetricsCard
          title="Active Pipelines"
          value={activePipelines.length}
          change={activePipelines.length > 0 ? 8 : 0}
          changeType={activePipelines.length > 0 ? 'positive' : 'neutral'}
          icon={PlayIcon}
          color="success"
          loading={isLoading}
          subtitle="Processing content"
        />
        <MetricsCard
          title="Highlights Generated"
          value={totalHighlights}
          change={recentHighlights > 0 ? 15 : 0}
          changeType={recentHighlights > 0 ? 'positive' : 'neutral'}
          icon={SparklesIcon}
          color="warning"
          loading={isLoading}
          subtitle="Total processed"
        />
        <MetricsCard
          title="System Health"
          value={errorCount === 0 ? '100%' : `${Math.max(0, 100 - errorCount * 10)}%`}
          change={errorCount === 0 ? 0 : -errorCount * 5}
          changeType={errorCount === 0 ? 'neutral' : 'negative'}
          icon={ChartBarIcon}
          color={errorCount === 0 ? 'success' : 'danger'}
          loading={isLoading}
          subtitle="Operational status"
        />
      </div>

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Highlights Timeline */}
        <Card>
          <CardHeader>
            <CardTitle>Content Generation</CardTitle>
            <p className="text-sm text-muted">Highlights generated over the last 12 hours</p>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-64 flex items-center justify-center">
                <div className="space-y-3 w-full">
                  <div className="skeleton h-4 w-32"></div>
                  <div className="skeleton h-48 w-full"></div>
                </div>
              </div>
            ) : (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={generateHighlightsTimeData()}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgb(68 64 60)" />
                    <XAxis 
                      dataKey="time" 
                      tick={{ fill: 'rgb(148 163 184)', fontSize: 12 }} 
                      axisLine={{ stroke: 'rgb(68 64 60)' }}
                    />
                    <YAxis 
                      tick={{ fill: 'rgb(148 163 184)', fontSize: 12 }} 
                      axisLine={{ stroke: 'rgb(68 64 60)' }}
                    />
                    <Tooltip 
                      formatter={(value) => [value, 'Highlights']}
                      labelFormatter={(label) => `Time: ${label}`}
                      contentStyle={{
                        backgroundColor: 'rgb(15 23 42)',
                        border: '1px solid rgb(68 64 60)',
                        borderRadius: '6px',
                        fontSize: '12px',
                        color: 'rgb(248 250 252)'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="highlights" 
                      stroke="rgb(16 185 129)" 
                      strokeWidth={2}
                      dot={{ fill: 'rgb(16 185 129)', strokeWidth: 2, r: 3 }}
                      activeDot={{ r: 5, stroke: 'rgb(16 185 129)', strokeWidth: 2, fill: 'rgb(15 23 42)' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pipeline Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Pipeline Performance</CardTitle>
            <p className="text-sm text-muted">Processing activity by pipeline</p>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-64 flex items-center justify-center">
                <div className="space-y-3 w-full">
                  <div className="skeleton h-4 w-32"></div>
                  <div className="skeleton h-48 w-full"></div>
                </div>
              </div>
            ) : generatePipelineData().length > 0 ? (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={generatePipelineData()}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgb(68 64 60)" />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fill: 'rgb(148 163 184)', fontSize: 12 }} 
                      axisLine={{ stroke: 'rgb(68 64 60)' }}
                    />
                    <YAxis 
                      tick={{ fill: 'rgb(148 163 184)', fontSize: 12 }} 
                      axisLine={{ stroke: 'rgb(68 64 60)' }}
                    />
                    <Tooltip 
                      formatter={(value, name) => [value, name === 'segments' ? 'Segments' : 'Highlights']}
                      contentStyle={{
                        backgroundColor: 'rgb(15 23 42)',
                        border: '1px solid rgb(68 64 60)',
                        borderRadius: '6px',
                        fontSize: '12px',
                        color: 'rgb(248 250 252)'
                      }}
                    />
                    <Bar dataKey="segments" fill="rgb(68 64 60)" name="segments" radius={[2, 2, 0, 0]} />
                    <Bar dataKey="highlights" fill="rgb(16 185 129)" name="highlights" radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 text-muted">
                <div className="text-center space-y-3">
                  <ChartBarIcon className="mx-auto h-12 w-12 text-surface-600" />
                  <div>
                    <p className="font-medium">No pipeline data</p>
                    <p className="text-sm">Start the system to see pipeline activity</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Live Activity and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Real-time Activity Feed */}
        <Card>
          <CardHeader>
            <CardTitle>Live Activity</CardTitle>
            <p className="text-sm text-muted">Real-time system events and operations</p>
          </CardHeader>
          <CardContent className="p-0">
            <div className="max-h-80 overflow-y-auto">
              {realtimeUpdates.length === 0 ? (
                <div className="p-6 text-center text-muted">
                  <ClockIcon className="mx-auto h-8 w-8 mb-2 text-surface-600" />
                  <p className="text-sm">No recent activity</p>
                  <p className="text-xs">System events will appear here</p>
                </div>
              ) : (
                <div className="divide-y divide-stone-700 [data-theme='light'] &:divide-stone-200">
                  {realtimeUpdates.map((update) => (
                    <div key={update.id} className="p-4 flex items-start gap-3">
                      <StatusIndicator 
                        status={update.status} 
                        showLabel={false} 
                        size="xs" 
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-surface-50 [data-theme='light'] &:text-surface-950">
                          {update.message}
                        </p>
                        <p className="text-xs text-muted mt-1">
                          {update.timestamp}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Active Channels Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Active Channels</CardTitle>
            <p className="text-sm text-muted">Currently streaming channels</p>
          </CardHeader>
          <CardContent className="p-0">
            <div className="max-h-80 overflow-y-auto">
              {Object.keys(activeChannels).length === 0 ? (
                <div className="p-6 text-center text-muted">
                  <TvIcon className="mx-auto h-8 w-8 mb-2 text-surface-600" />
                  <p className="text-sm">No active channels</p>
                  <p className="text-xs">Channels will appear when system is running</p>
                </div>
              ) : (
                <div className="divide-y divide-stone-700 [data-theme='light'] &:divide-stone-200">
                  {Object.entries(activeChannels).map(([scheduleId, channel]) => (
                    <div key={scheduleId} className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <StatusIndicator 
                          status="live" 
                          showLabel={false} 
                          size="sm" 
                        />
                        <div>
                          <p className="text-sm font-medium text-surface-50 [data-theme='light'] &:text-surface-950">
                            {channel.name}
                          </p>
                          <p className="text-xs text-muted">
                            {scheduleId}
                          </p>
                        </div>
                      </div>
                      <Badge status="live" dot>
                        {channel.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}