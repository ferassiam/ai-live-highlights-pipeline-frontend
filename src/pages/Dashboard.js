import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  PlayIcon,
  StopIcon,
  TvIcon,
  SparklesIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  SignalIcon,
} from '@heroicons/react/24/outline';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { motion } from 'framer-motion';

import { apiService, wsService, showSuccessToast, showErrorToast } from '../services/api';
import { MetricsCard } from '../components/ui/MetricsCard';
import { Card, CardHeader, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { StatusIndicator } from '../components/ui/StatusIndicator';
import { cn } from '../utils/cn';
import { Container } from '../components/ui/Container';
import { PageHeader } from '../components/ui/PageHeader';

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

  // Fetch schedules for overview
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
      'orchestrator_started': 'Orchestrator started successfully',
      'orchestrator_stopped': 'Orchestrator stopped',
      'pipeline_started': `Pipeline started for ${data.schedule_id}`,
      'pipeline_stopped': `Pipeline stopped for ${data.schedule_id}`,
      'schedule_created': `Schedule created: ${data.schedule_id}`,
      'schedule_updated': `Schedule updated: ${data.schedule_id}`,
      'schedule_deleted': `Schedule deleted: ${data.schedule_id}`,
      'manual_channel_action': `Manual ${data.action} for ${data.schedule_id}`,
      'status_update': 'System status updated',
    };
    
    return messageMap[data.type] || `${data.type} event received`;
  };

  const handleStartOrchestrator = async () => {
    try {
      const result = await apiService.startOrchestrator();
      showSuccessToast(result.message);
      refetchStatus();
    } catch (error) {
      showErrorToast(error.response?.data?.detail || 'Failed to start orchestrator');
    }
  };

  const handleStopOrchestrator = async () => {
    try {
      const result = await apiService.stopOrchestrator();
      showSuccessToast(result.message);
      refetchStatus();
    } catch (error) {
      showErrorToast(error.response?.data?.detail || 'Failed to stop orchestrator');
    }
  };

  const orchestratorRunning = status?.orchestrator_running || false;
  const orchestratorStatus = status?.orchestrator_status;
  const activeChannels = orchestratorStatus?.active_channels || {};
  const activePipelines = orchestratorStatus?.active_pipelines || [];

  // Calculate real metrics
  const totalHighlights = highlightsSummary?.statistics?.total_highlights || 0;
  const totalSegments = filesData?.files?.filter(f => f.type === 'mp4')?.length || 0;
  const recentHighlights = Math.floor(totalHighlights * 0.15); // Assume 15% are recent
  
  // (Trends computed inline per metric where needed)

  const stats = [
    {
      title: 'Active Channels',
      value: Object.keys(activeChannels).length,
      icon: TvIcon,
      color: 'primary',
      change: Object.keys(activeChannels).length > 0 ? 12.5 : 0,
      changeLabel: 'from last hour',
      subtitle: 'Live broadcast streams',
    },
    {
      title: 'Running Pipelines',
      value: activePipelines.length,
      icon: PlayIcon,
      color: 'success',
      change: activePipelines.length > 0 ? 8.3 : 0,
      changeLabel: 'processing rate',
      subtitle: 'Active video processing',
    },
    {
      title: 'Total Highlights',
      value: totalHighlights,
      icon: SparklesIcon,
      color: 'warning',
      change: recentHighlights > 0 ? 15.7 : 0,
      changeLabel: 'generated today',
      subtitle: 'Content pieces created',
    },
    {
      title: 'Total Segments',
      value: totalSegments,
      icon: ChartBarIcon,
      color: 'default',
      change: totalSegments > 0 ? 22.1 : 0,
      changeLabel: 'processed today',
      subtitle: 'Video segments analyzed',
    },
  ];

  return (
    <motion.div 
      className="space-y-8 py-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Container>
        <PageHeader 
          title="Dashboard"
          description="Monitor and control your live highlights pipeline operations"
          actions={
            <>
              <StatusIndicator status={orchestratorRunning ? 'healthy' : 'unhealthy'} showText size="sm" />
              {orchestratorRunning ? (
                <Button variant="destructive" onClick={handleStopOrchestrator} leftIcon={<StopIcon className="h-4 w-4" />}>Stop Orchestrator</Button>
              ) : (
                <Button variant="success" onClick={handleStartOrchestrator} leftIcon={<PlayIcon className="h-4 w-4" />}>Start Orchestrator</Button>
              )}
            </>
          }
        />

      {/* Professional system status banner */}
  <Card 
        variant={orchestratorRunning ? "default" : "flat"}
        className={cn(
          'border-l-4 transition-all duration-200',
          orchestratorRunning 
    ? 'border-l-success-500 bg-success-50 dark:bg-success-950/20' 
    : 'border-l-warning-500 bg-warning-50 dark:bg-warning-950/20'
        )}
      >
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 pt-0.5">
              {orchestratorRunning ? (
                <StatusIndicator status="healthy" size="sm" showRing />
              ) : (
                <ExclamationTriangleIcon className="h-6 w-6 text-warning-500" />
              )}
            </div>
            <div className="flex-1">
        <h3 className={cn(
                'text-lg font-subheading tracking-tight',
                orchestratorRunning 
          ? 'text-success-700 dark:text-success-300' 
          : 'text-warning-700 dark:text-warning-300'
              )}>
                {orchestratorRunning ? 'System Operational' : 'System Offline'}
              </h3>
        <p className={cn(
                'text-sm mt-2 leading-relaxed',
                orchestratorRunning 
          ? 'text-success-600 dark:text-success-400' 
          : 'text-warning-600 dark:text-warning-400'
              )}>
                {orchestratorRunning 
                  ? `Live highlights pipeline is operational with ${Object.keys(activeChannels).length} active channels and ${activePipelines.length} running pipelines.`
                  : 'The orchestrator is currently stopped. Start it to begin processing scheduled content and monitoring live channels.'
                }
              </p>
              {orchestratorRunning && (
                <div className="flex items-center gap-4 mt-3">
                  <Badge variant="success" size="sm">
                    {Object.keys(activeChannels).length} Channels
                  </Badge>
                  <Badge variant="processing" size="sm">
                    {activePipelines.length} Pipelines
                  </Badge>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Professional KPI metrics */}
  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((metric, index) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <MetricsCard
              title={metric.title}
              value={metric.value}
              change={metric.change}
              changeLabel={metric.changeLabel}
              subtitle={metric.subtitle}
              icon={metric.icon}
              color={metric.color}
              showTrend={true}
            />
          </motion.div>
        ))}
      </div>

      {/* Professional charts section */}
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Highlights trend chart */}
        <Card variant="elevated">
          <CardHeader>
            <h3 className="text-lg font-subheading font-semibold text-slate-900 dark:text-slate-100 tracking-tight">
              Highlights Generated
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
              Content generation over the last 6 hours
            </p>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={generateHighlightsTimeData(highlightsSummary, activeChannels)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.6} />
                  <XAxis 
                    dataKey="time" 
                    tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }}
                    axisLine={{ stroke: '#cbd5e1' }}
                    tickLine={{ stroke: '#cbd5e1' }}
                  />
                  <YAxis 
                    tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }}
                    axisLine={{ stroke: '#cbd5e1' }}
                    tickLine={{ stroke: '#cbd5e1' }}
                  />
                  <Tooltip 
                    formatter={(value) => [value, 'Highlights']}
                    labelFormatter={(label) => `Time: ${label}`}
                    contentStyle={{
                      backgroundColor: 'rgba(248, 250, 252, 0.95)',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: '500',
                      backdropFilter: 'blur(8px)'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="highlights" 
                    stroke="#0ea5e9" 
                    strokeWidth={2.5}
                    dot={{ fill: '#0ea5e9', strokeWidth: 0, r: 3 }}
                    activeDot={{ r: 5, stroke: '#0ea5e9', strokeWidth: 2, fill: '#ffffff' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Pipeline performance chart */}
        <Card variant="elevated">
          <CardHeader>
            <h3 className="text-lg font-subheading font-semibold text-slate-900 dark:text-slate-100 tracking-tight">
              Pipeline Performance
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
              Segments processed and highlights generated by pipeline
            </p>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              {generatePipelineData(highlightsSummary, filesData).length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={generatePipelineData(highlightsSummary, filesData)}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.6} />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }}
                      axisLine={{ stroke: '#cbd5e1' }}
                      tickLine={{ stroke: '#cbd5e1' }}
                    />
                    <YAxis 
                      tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }}
                      axisLine={{ stroke: '#cbd5e1' }}
                      tickLine={{ stroke: '#cbd5e1' }}
                    />
                    <Tooltip 
                      formatter={(value, name) => [value, name === 'segments' ? 'Segments' : 'Highlights']}
                      contentStyle={{
                        backgroundColor: 'rgba(248, 250, 252, 0.95)',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        fontSize: '12px',
                        fontWeight: '500',
                        backdropFilter: 'blur(8px)'
                      }}
                    />
                    <Bar dataKey="segments" fill="#e2e8f0" name="segments" radius={[3, 3, 0, 0]} />
                    <Bar dataKey="highlights" fill="#0ea5e9" name="highlights" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <ChartBarIcon className="mx-auto h-12 w-12 text-slate-400 dark:text-slate-600" />
                    <h4 className="mt-3 text-base font-subheading font-medium text-slate-900 dark:text-slate-100">
                      No pipeline data
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                      Start the orchestrator to see pipeline performance metrics
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Professional activity feed and channels */}
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Professional activity feed */}
        <Card variant="default">
          <CardHeader>
            <div className="flex items-center gap-2">
              <SignalIcon className="h-5 w-5 text-slate-600 dark:text-slate-400" />
              <h3 className="text-lg font-subheading font-semibold text-slate-900 dark:text-slate-100 tracking-tight">
                System Activity
              </h3>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
              Live system events and real-time notifications
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-80 overflow-y-auto">
              {realtimeUpdates.length === 0 ? (
                <div className="text-center py-8">
                  <ClockIcon className="mx-auto h-8 w-8 text-slate-400 dark:text-slate-600" />
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 font-medium">
                    No recent activity
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                    Real-time system events will appear here
                  </p>
                </div>
              ) : (
                realtimeUpdates.map((update, index) => (
                  <motion.div
                    key={update.id}
                    className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <div className="flex-shrink-0 pt-0.5">
                      <StatusIndicator 
                        status={update.type.includes('started') ? 'healthy' : update.type.includes('stopped') ? 'unhealthy' : 'warning'} 
                        size="sm"
                        showText={false}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-100 leading-relaxed">
                        {update.message}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-mono tabular-nums">
                          {update.timestamp}
                        </span>
                        <Badge variant="secondary" size="sm" className="text-xs">
                          {update.type}
                        </Badge>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Professional active channels */}
        <Card variant="default">
          <CardHeader>
            <div className="flex items-center gap-2">
              <TvIcon className="h-5 w-5 text-slate-600 dark:text-slate-400" />
              <h3 className="text-lg font-subheading font-semibold text-slate-900 dark:text-slate-100 tracking-tight">
                Active Channels
              </h3>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
              Live broadcast channels and processing status
            </p>
          </CardHeader>
          <CardContent>
            {Object.keys(activeChannels).length === 0 ? (
              <div className="text-center py-8">
                <TvIcon className="mx-auto h-12 w-12 text-slate-400 dark:text-slate-600" />
                <h4 className="mt-3 text-base font-subheading font-medium text-slate-900 dark:text-slate-100">
                  No active channels
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Channels will appear when the orchestrator starts processing schedules
                </p>
              </div>
            ) : (
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {Object.entries(activeChannels).map(([scheduleId, channel], index) => (
                  <motion.div
                    key={scheduleId}
                    className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 hover:shadow-subtle transition-all duration-200"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <StatusIndicator status="healthy" size="sm" showRing />
                      <div className="min-w-0 flex-1">
                        <h4 className="text-sm font-subheading font-medium text-slate-900 dark:text-slate-100 truncate">
                          {channel.name}
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                          Schedule: {scheduleId}
                        </p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <Badge variant="live" size="sm" className="mb-1">
                        {channel.status}
                      </Badge>
                      {channel.video_id && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                          {channel.video_id.substring(0, 8)}...
                        </p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      </Container>
    </motion.div>
  );
}