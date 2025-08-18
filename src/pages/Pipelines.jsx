import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PlayIcon,
  StopIcon,
  CpuChipIcon,
  ClockIcon,
  DocumentIcon,
  ChartBarIcon,
  SparklesIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  BoltIcon,
  RocketLaunchIcon,
} from '@heroicons/react/24/outline';

import { apiService, wsService, showSuccessToast, showErrorToast } from '../services/api.jsx';

// Status configuration for pipelines
const getStatusConfig = (status) => {
  const configs = {
    running: {
      color: 'bg-green-500',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      borderColor: 'border-green-200 dark:border-green-800',
      textColor: 'text-green-700 dark:text-green-300',
      label: 'PROCESSING',
      icon: CheckCircleIcon,
      pulse: true,
    },
    idle: {
      color: 'bg-yellow-500',
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
      borderColor: 'border-yellow-200 dark:border-yellow-800',
      textColor: 'text-yellow-700 dark:text-yellow-300',
      label: 'IDLE',
      icon: ClockIcon,
      pulse: false,
    },
    stopped: {
      color: 'bg-gray-500',
      bgColor: 'bg-gray-50 dark:bg-gray-900/20',
      borderColor: 'border-gray-200 dark:border-gray-800',
      textColor: 'text-gray-700 dark:text-gray-300',
      label: 'STOPPED',
      icon: XCircleIcon,
      pulse: false,
    },
    error: {
      color: 'bg-red-500',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
      borderColor: 'border-red-200 dark:border-red-800',
      textColor: 'text-red-700 dark:text-red-300',
      label: 'ERROR',
      icon: ExclamationTriangleIcon,
      pulse: true,
    },
  };
  return configs[status] || configs.stopped;
};

// Pipeline card component
const PipelineCard = ({ pipelineId, pipeline, onControl, isControlling }) => {
  const statusConfig = getStatusConfig(pipeline.status);
  const StatusIcon = statusConfig.icon;

  const [localStats, setLocalStats] = useState({
    processedToday: Math.floor(Math.random() * 150) + 50,
    avgProcessingTime: Math.floor(Math.random() * 30) + 15, // seconds
    successRate: 95 + Math.floor(Math.random() * 5), // 95-100%
    queueSize: Math.floor(Math.random() * 20),
  });

  // Simulate real-time stats updates
  useEffect(() => {
    if (pipeline.status === 'running') {
      const interval = setInterval(() => {
        setLocalStats(prev => ({
          ...prev,
          processedToday: prev.processedToday + Math.floor(Math.random() * 3),
          queueSize: Math.max(0, prev.queueSize + Math.floor(Math.random() * 6) - 3),
        }));
      }, 5000 + Math.random() * 3000);

      return () => clearInterval(interval);
    }
  }, [pipeline.status]);

  const formatDuration = (seconds) => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      className={`relative overflow-hidden rounded-2xl p-6 shadow-lg border-2 ${statusConfig.borderColor} ${statusConfig.bgColor} backdrop-blur-sm`}
    >
      {/* Status indicator */}
      <div className="absolute top-4 right-4">
        <div className="relative">
          <div className={`w-4 h-4 rounded-full ${statusConfig.color}`} />
          {statusConfig.pulse && (
            <div className={`absolute inset-0 w-4 h-4 rounded-full ${statusConfig.color} animate-ping opacity-75`} />
          )}
        </div>
      </div>

      {/* Pipeline header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <CpuChipIcon className="w-6 h-6 text-gray-700 dark:text-gray-300" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              {pipelineId}
            </h3>
          </div>
          <div className="flex items-center space-x-2">
            <StatusIcon className={`w-5 h-5 ${statusConfig.textColor}`} />
            <span className={`text-sm font-semibold ${statusConfig.textColor}`}>
              {statusConfig.label}
            </span>
          </div>
        </div>
      </div>

      {/* Performance metrics */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-3">
          <div className="flex items-center space-x-2">
            <SparklesIcon className="w-4 h-4 text-blue-600" />
            <span className="text-sm text-gray-600 dark:text-gray-400">Processed</span>
          </div>
          <p className="text-lg font-bold text-gray-900 dark:text-white">
            {localStats.processedToday}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">today</p>
        </div>
        
        <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-3">
          <div className="flex items-center space-x-2">
            <ClockIcon className="w-4 h-4 text-green-600" />
            <span className="text-sm text-gray-600 dark:text-gray-400">Avg Time</span>
          </div>
          <p className="text-lg font-bold text-gray-900 dark:text-white">
            {formatDuration(localStats.avgProcessingTime)}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">per item</p>
        </div>
        
        <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-3">
          <div className="flex items-center space-x-2">
            <CheckCircleIcon className="w-4 h-4 text-purple-600" />
            <span className="text-sm text-gray-600 dark:text-gray-400">Success</span>
          </div>
          <p className="text-lg font-bold text-gray-900 dark:text-white">
            {localStats.successRate}%
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">rate</p>
        </div>
        
        <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-3">
          <div className="flex items-center space-x-2">
            <DocumentIcon className="w-4 h-4 text-orange-600" />
            <span className="text-sm text-gray-600 dark:text-gray-400">Queue</span>
          </div>
          <p className="text-lg font-bold text-gray-900 dark:text-white">
            {localStats.queueSize}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">items</p>
        </div>
      </div>

      {/* Pipeline details */}
      <div className="space-y-2 mb-6">
        {pipeline.config?.input_source && (
          <div className="text-sm">
            <span className="text-gray-600 dark:text-gray-400">Input:</span>
            <span className="ml-2 text-gray-900 dark:text-white font-mono text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
              {pipeline.config.input_source}
            </span>
          </div>
        )}
        
        {pipeline.schedule_id && (
          <div className="text-sm">
            <span className="text-gray-600 dark:text-gray-400">Schedule:</span>
            <span className="ml-2 text-gray-900 dark:text-white">
              {pipeline.schedule_id}
            </span>
          </div>
        )}
        
        {pipeline.last_activity && (
          <div className="text-sm">
            <span className="text-gray-600 dark:text-gray-400">Last Activity:</span>
            <span className="ml-2 text-gray-900 dark:text-white">
              {new Date(pipeline.last_activity).toLocaleString()}
            </span>
          </div>
        )}
      </div>

      {/* Control buttons */}
      <div className="flex space-x-3">
        {pipeline.status === 'running' ? (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onControl(pipelineId, 'stop')}
            disabled={isControlling}
            className="flex-1 flex items-center justify-center px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
          >
            <StopIcon className="w-5 h-5 mr-2" />
            {isControlling ? 'Stopping...' : 'Stop Pipeline'}
          </motion.button>
        ) : (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onControl(pipelineId, 'start')}
            disabled={isControlling}
            className="flex-1 flex items-center justify-center px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
          >
            <PlayIcon className="w-5 h-5 mr-2" />
            {isControlling ? 'Starting...' : 'Start Pipeline'}
          </motion.button>
        )}
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onControl(pipelineId, 'restart')}
          disabled={isControlling}
          className="px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
        >
          <ArrowPathIcon className="w-5 h-5" />
        </motion.button>
      </div>

      {/* Animated background accent */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-20" />
    </motion.div>
  );
};

export function Pipelines() {
  const queryClient = useQueryClient();
  const [controllingPipeline, setControllingPipeline] = useState(null);

  // Fetch pipelines data
  const { data: pipelinesData, isLoading } = useQuery({
    queryKey: ['pipelines'],
    queryFn: () => apiService.getPipelines(),
    refetchInterval: 10000,
  });

  // Fetch system status
  const { data: statusData } = useQuery({
    queryKey: ['status'],
    queryFn: () => apiService.getStatus(),
    refetchInterval: 15000,
  });

  // Pipeline control mutation
  const controlMutation = useMutation({
    mutationFn: ({ pipelineId, action }) => {
      if (action === 'start') {
        return apiService.startPipeline(pipelineId);
      } else if (action === 'stop') {
        return apiService.stopPipeline(pipelineId);
      } else if (action === 'restart') {
        return apiService.stopPipeline(pipelineId).then(() => 
          apiService.startPipeline(pipelineId)
        );
      }
    },
    onSuccess: (data, { action, pipelineId }) => {
      showSuccessToast(`Pipeline ${pipelineId} ${action} successful`);
      queryClient.invalidateQueries(['pipelines']);
      setControllingPipeline(null);
    },
    onError: (error, { action, pipelineId }) => {
      showErrorToast(`Failed to ${action} pipeline ${pipelineId}`);
      setControllingPipeline(null);
    },
  });

  // WebSocket real-time updates
  useEffect(() => {
    const handlePipelineUpdate = (data) => {
      queryClient.invalidateQueries(['pipelines']);
    };

    wsService.on('pipeline_status', handlePipelineUpdate);
    return () => wsService.off('pipeline_status', handlePipelineUpdate);
  }, [queryClient]);

  const handlePipelineControl = async (pipelineId, action) => {
    setControllingPipeline(pipelineId);
    controlMutation.mutate({ pipelineId, action });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-lg text-gray-600 dark:text-gray-300">Loading pipelines...</p>
        </div>
      </div>
    );
  }

  const pipelines = pipelinesData?.pipelines || {};
  const pipelineEntries = Object.entries(pipelines);
  
  // Calculate summary stats
  const totalPipelines = pipelineEntries.length;
  const runningPipelines = pipelineEntries.filter(([_, pipeline]) => pipeline.status === 'running').length;
  const errorPipelines = pipelineEntries.filter(([_, pipeline]) => pipeline.status === 'error').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent mb-4">
            Processing Pipelines Control
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Monitor and control AI processing pipelines in real-time
          </p>
        </motion.div>

        {/* Summary Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20">
            <div className="flex items-center">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <CpuChipIcon className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Pipelines</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalPipelines}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20">
            <div className="flex items-center">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                <BoltIcon className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Active Pipelines</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{runningPipelines}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20">
            <div className="flex items-center">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center">
                <ExclamationTriangleIcon className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Errors</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{errorPipelines}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Pipelines Grid */}
        {totalPipelines === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-center py-12"
          >
            <CpuChipIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No Pipelines Active
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Start your first pipeline to begin processing highlights.
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <AnimatePresence>
              {pipelineEntries.map(([pipelineId, pipeline], index) => (
                <motion.div
                  key={pipelineId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                >
                  <PipelineCard
                    pipelineId={pipelineId}
                    pipeline={pipeline}
                    onControl={handlePipelineControl}
                    isControlling={controllingPipeline === pipelineId}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}