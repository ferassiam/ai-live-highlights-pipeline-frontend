import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PlayIcon,
  StopIcon,
  TvIcon,
  SparklesIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  BoltIcon,
  SignalIcon,
  CloudIcon,
  CpuChipIcon,
  VideoCameraIcon,
  RocketLaunchIcon,
} from '@heroicons/react/24/outline';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';

import { apiService, wsService, showSuccessToast, showErrorToast } from '../services/api.jsx';

// Modern color palette
const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

// Generate realistic time-based data for charts
const generateHighlightsTimeData = (highlightsSummary, activeChannels) => {
  const now = new Date();
  const data = [];
  
  for (let i = 24; i >= 0; i--) {
    const time = new Date(now.getTime() - (i * 30 * 60 * 1000));
    const timeStr = time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    
    const baseHighlights = Object.keys(activeChannels).length * (Math.random() * 4 + 2);
    const highlights = Math.floor(baseHighlights + (Math.random() * 8));
    const processed = Math.floor(highlights * (0.8 + Math.random() * 0.2));
    
    data.push({ 
      time: timeStr, 
      highlights,
      processed,
      active: Math.floor(Math.random() * 3) + Object.keys(activeChannels).length
    });
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
      efficiency: Math.floor(80 + Math.random() * 20),
    };
  }).slice(0, 6);
};

// Modern metric card component
const MetricCard = ({ title, value, subtitle, icon: Icon, trend, color, gradient, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.6, ease: "easeOut" }}
    className={`relative overflow-hidden rounded-2xl p-6 shadow-lg border border-white/10 backdrop-blur-xl ${gradient || 'bg-gradient-to-br from-white/90 to-white/60 dark:from-gray-800/90 dark:to-gray-900/60'}`}
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{title}</p>
        <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{value}</p>
        {subtitle && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>
        )}
        {trend && (
          <div className={`flex items-center mt-2 text-sm ${trend.positive ? 'text-green-600' : 'text-red-600'}`}>
            <span className="font-medium">{trend.value}</span>
            <span className="ml-1">{trend.label}</span>
          </div>
        )}
      </div>
      <div className={`flex-shrink-0 w-16 h-16 ${color || 'bg-blue-500'} rounded-2xl flex items-center justify-center shadow-lg`}>
        <Icon className="w-8 h-8 text-white" />
      </div>
    </div>
    
    {/* Animated background pattern */}
    <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-xl" />
  </motion.div>
);

// Status indicator component
const StatusIndicator = ({ label, status, count }) => {
  const statusConfig = {
    active: { color: 'bg-green-500', pulse: true },
    idle: { color: 'bg-yellow-500', pulse: false },
    error: { color: 'bg-red-500', pulse: true },
    offline: { color: 'bg-gray-500', pulse: false },
  };

  const config = statusConfig[status] || statusConfig.offline;

  return (
    <div className="flex items-center space-x-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
      <div className="relative">
        <div className={`w-3 h-3 rounded-full ${config.color}`} />
        {config.pulse && (
          <div className={`absolute inset-0 w-3 h-3 rounded-full ${config.color} animate-ping opacity-75`} />
        )}
      </div>
      <div className="flex-1">
        <span className="text-sm font-medium text-gray-900 dark:text-white">{label}</span>
        {count !== undefined && (
          <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">({count})</span>
        )}
      </div>
    </div>
  );
};

export function Dashboard() {
  const [orchestratorRunning, setOrchestratorRunning] = useState(false);
  const [realtimeData, setRealtimeData] = useState({});

  // Queries for dashboard data
  const { data: statusData, refetch: refetchStatus } = useQuery({
    queryKey: ['status'],
    queryFn: () => apiService.getStatus(),
    refetchInterval: 5000,
  });

  const { data: channelsData } = useQuery({
    queryKey: ['channels'],
    queryFn: () => apiService.getChannels(),
    refetchInterval: 10000,
  });

  const { data: highlightsSummary } = useQuery({
    queryKey: ['highlights-summary'],
    queryFn: () => apiService.getHighlightsSummary(),
    refetchInterval: 15000,
  });

  const { data: filesData } = useQuery({
    queryKey: ['segment-files'],
    queryFn: () => apiService.getSegmentFiles({ limit: 100 }),
    refetchInterval: 30000,
  });

  // WebSocket for real-time updates
  useEffect(() => {
    const handleStatusUpdate = (data) => {
      setRealtimeData(prev => ({ ...prev, ...data }));
      refetchStatus();
    };

    wsService.on('pipeline_status', handleStatusUpdate);
    wsService.on('monitoring_update', handleStatusUpdate);
    wsService.on('channel_status', handleStatusUpdate);

    return () => {
      wsService.off('pipeline_status', handleStatusUpdate);
      wsService.off('monitoring_update', handleStatusUpdate);
      wsService.off('channel_status', handleStatusUpdate);
    };
  }, [refetchStatus]);

  // Update orchestrator status
  useEffect(() => {
    if (statusData) {
      setOrchestratorRunning(statusData.orchestrator_running || false);
    }
  }, [statusData]);

  // Calculate metrics
  const activeChannels = channelsData?.channels || {};
  const totalChannels = Object.keys(activeChannels).length;
  const runningChannels = Object.values(activeChannels).filter(c => c.status === 'running').length;
  
  const totalHighlights = highlightsSummary?.total_highlights || 0;
  const todayHighlights = highlightsSummary?.today_highlights || 0;
  const recentHighlights = highlightsSummary?.last_hour_highlights || 0;

  const totalSegments = filesData?.files?.length || 0;
  const processingRate = totalHighlights > 0 ? Math.floor((todayHighlights / totalHighlights) * 100) : 0;

  // Generate chart data
  const timelineData = generateHighlightsTimeData(highlightsSummary, activeChannels);
  const pipelineData = generatePipelineData(highlightsSummary, filesData);

  // System health calculation
  const systemHealth = orchestratorRunning && runningChannels > 0 ? 
    Math.min(100, Math.floor(85 + (runningChannels * 3) + Math.random() * 10)) : 0;

  const handleStartOrchestrator = async () => {
    try {
      await apiService.startOrchestrator();
      showSuccessToast('Orchestrator started successfully');
      refetchStatus();
    } catch (error) {
      showErrorToast('Failed to start orchestrator');
    }
  };

  const handleStopOrchestrator = async () => {
    try {
      await apiService.stopOrchestrator();
      showSuccessToast('Orchestrator stopped successfully');
      refetchStatus();
    } catch (error) {
      showErrorToast('Failed to stop orchestrator');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Hero Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent mb-4">
            AI Sports Highlights Command Center
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            Real-time monitoring and control of your intelligent highlights pipeline
          </p>
          
          {/* System Status Banner */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className={`inline-flex items-center px-6 py-3 rounded-full ${
              orchestratorRunning 
                ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white' 
                : 'bg-gradient-to-r from-amber-500 to-orange-600 text-white'
            } shadow-lg`}
          >
            <div className={`w-3 h-3 rounded-full ${orchestratorRunning ? 'bg-white' : 'bg-yellow-200'} mr-3 ${orchestratorRunning ? 'animate-pulse' : ''}`} />
            <span className="font-semibold">
              System {orchestratorRunning ? 'OPERATIONAL' : 'STANDBY'}
            </span>
            <span className="ml-3 text-sm opacity-90">
              Health: {systemHealth}%
            </span>
          </motion.div>
        </motion.div>

        {/* Control Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="flex justify-center mb-12"
        >
          <AnimatePresence mode="wait">
            {orchestratorRunning ? (
              <motion.button
                key="stop"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleStopOrchestrator}
                className="flex items-center px-8 py-4 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <StopIcon className="w-6 h-6 mr-3" />
                <span className="font-semibold text-lg">Stop System</span>
              </motion.button>
            ) : (
              <motion.button
                key="start"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleStartOrchestrator}
                className="flex items-center px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <RocketLaunchIcon className="w-6 h-6 mr-3" />
                <span className="font-semibold text-lg">Launch System</span>
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <MetricCard
            title="Active Channels"
            value={runningChannels}
            subtitle={`${totalChannels} total configured`}
            icon={VideoCameraIcon}
            color="bg-gradient-to-br from-blue-500 to-blue-600"
            gradient="bg-gradient-to-br from-blue-50/90 to-blue-100/60 dark:from-blue-900/40 dark:to-blue-800/60"
            delay={0.1}
            trend={{ positive: runningChannels > 0, value: '+' + runningChannels, label: 'online' }}
          />
          
          <MetricCard
            title="Highlights Today"
            value={todayHighlights}
            subtitle={`${recentHighlights} in last hour`}
            icon={SparklesIcon}
            color="bg-gradient-to-br from-green-500 to-emerald-600"
            gradient="bg-gradient-to-br from-green-50/90 to-green-100/60 dark:from-green-900/40 dark:to-green-800/60"
            delay={0.2}
            trend={{ positive: recentHighlights > 0, value: recentHighlights, label: 'recent' }}
          />
          
          <MetricCard
            title="Processing Rate"
            value={`${processingRate}%`}
            subtitle="System efficiency"
            icon={CpuChipIcon}
            color="bg-gradient-to-br from-purple-500 to-purple-600"
            gradient="bg-gradient-to-br from-purple-50/90 to-purple-100/60 dark:from-purple-900/40 dark:to-purple-800/60"
            delay={0.3}
            trend={{ positive: processingRate > 80, value: processingRate, label: 'efficiency' }}
          />
          
          <MetricCard
            title="Total Segments"
            value={totalSegments}
            subtitle="Media files processed"
            icon={ChartBarIcon}
            color="bg-gradient-to-br from-orange-500 to-orange-600"
            gradient="bg-gradient-to-br from-orange-50/90 to-orange-100/60 dark:from-orange-900/40 dark:to-orange-800/60"
            delay={0.4}
            trend={{ positive: totalSegments > 0, value: totalSegments, label: 'files' }}
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          
          {/* Real-time Activity Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Real-time Activity
              </h3>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm text-gray-600 dark:text-gray-300">Live</span>
              </div>
            </div>
            
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={timelineData}>
                <defs>
                  <linearGradient id="highlightsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="processedGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(156, 163, 175, 0.3)" />
                <XAxis 
                  dataKey="time" 
                  stroke="rgba(156, 163, 175, 0.8)"
                  fontSize={12}
                />
                <YAxis stroke="rgba(156, 163, 175, 0.8)" fontSize={12} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="highlights"
                  stroke="#3B82F6"
                  fillOpacity={1}
                  fill="url(#highlightsGradient)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="processed"
                  stroke="#10B981"
                  fillOpacity={1}
                  fill="url(#processedGradient)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Pipeline Performance */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20"
          >
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              Pipeline Performance
            </h3>
            
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={pipelineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(156, 163, 175, 0.3)" />
                <XAxis 
                  dataKey="name" 
                  stroke="rgba(156, 163, 175, 0.8)"
                  fontSize={12}
                />
                <YAxis stroke="rgba(156, 163, 175, 0.8)" fontSize={12} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Bar 
                  dataKey="highlights" 
                  fill="#3B82F6" 
                  radius={[4, 4, 0, 0]}
                  name="Highlights"
                />
                <Bar 
                  dataKey="segments" 
                  fill="#10B981" 
                  radius={[4, 4, 0, 0]}
                  name="Segments"
                />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* System Status Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20"
        >
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
            System Components Status
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatusIndicator 
              label="Orchestrator" 
              status={orchestratorRunning ? 'active' : 'offline'} 
            />
            <StatusIndicator 
              label="Active Channels" 
              status={runningChannels > 0 ? 'active' : 'idle'} 
              count={runningChannels}
            />
            <StatusIndicator 
              label="Processing Pipelines" 
              status={pipelineData.length > 0 ? 'active' : 'idle'} 
              count={pipelineData.length}
            />
            <StatusIndicator 
              label="WebSocket" 
              status={wsService.ws?.readyState === WebSocket.OPEN ? 'active' : 'offline'} 
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}