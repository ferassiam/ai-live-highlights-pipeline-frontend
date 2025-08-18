import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TvIcon,
  PlayIcon,
  StopIcon,
  SignalIcon,
  ClockIcon,
  VideoCameraIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  WifiIcon,
  RocketLaunchIcon,
} from '@heroicons/react/24/outline';

import { apiService, wsService, showSuccessToast, showErrorToast } from '../services/api.jsx';

// Status configuration for channels
const getStatusConfig = (status) => {
  const configs = {
    running: {
      color: 'bg-green-500',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      borderColor: 'border-green-200 dark:border-green-800',
      textColor: 'text-green-700 dark:text-green-300',
      label: 'LIVE',
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
      label: 'OFFLINE',
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

// Channel control component
const ChannelCard = ({ channelId, channel, onControl, isControlling }) => {
  const statusConfig = getStatusConfig(channel.status);
  const StatusIcon = statusConfig.icon;

  const [localStats, setLocalStats] = useState({
    viewerCount: Math.floor(Math.random() * 1500) + 100,
    quality: ['4K', '1080p', '720p'][Math.floor(Math.random() * 3)],
    bitrate: Math.floor(Math.random() * 5000) + 2000,
    uptime: Math.floor(Math.random() * 1440) + 60, // minutes
  });

  // Simulate real-time viewer count changes
  useEffect(() => {
    if (channel.status === 'running') {
      const interval = setInterval(() => {
        setLocalStats(prev => ({
          ...prev,
          viewerCount: Math.max(50, prev.viewerCount + Math.floor(Math.random() * 20) - 10),
          bitrate: prev.bitrate + Math.floor(Math.random() * 200) - 100,
        }));
      }, 3000 + Math.random() * 2000);

      return () => clearInterval(interval);
    }
  }, [channel.status]);

  const formatUptime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
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
      {/* Status indicator with pulse animation */}
      <div className="absolute top-4 right-4">
        <div className="relative">
          <div className={`w-4 h-4 rounded-full ${statusConfig.color}`} />
          {statusConfig.pulse && (
            <div className={`absolute inset-0 w-4 h-4 rounded-full ${statusConfig.color} animate-ping opacity-75`} />
          )}
        </div>
      </div>

      {/* Channel header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <TvIcon className="w-6 h-6 text-gray-700 dark:text-gray-300" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              {channelId}
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

      {/* Channel metrics */}
      {channel.status === 'running' && (
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-3">
            <div className="flex items-center space-x-2">
              <EyeIcon className="w-4 h-4 text-blue-600" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Viewers</span>
            </div>
            <p className="text-lg font-bold text-gray-900 dark:text-white">
              {localStats.viewerCount.toLocaleString()}
            </p>
          </div>
          
          <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-3">
            <div className="flex items-center space-x-2">
              <WifiIcon className="w-4 h-4 text-green-600" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Quality</span>
            </div>
            <p className="text-lg font-bold text-gray-900 dark:text-white">
              {localStats.quality}
            </p>
          </div>
          
          <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-3">
            <div className="flex items-center space-x-2">
              <ChartBarIcon className="w-4 h-4 text-purple-600" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Bitrate</span>
            </div>
            <p className="text-lg font-bold text-gray-900 dark:text-white">
              {localStats.bitrate} kbps
            </p>
          </div>
          
          <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-3">
            <div className="flex items-center space-x-2">
              <ClockIcon className="w-4 h-4 text-orange-600" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Uptime</span>
            </div>
            <p className="text-lg font-bold text-gray-900 dark:text-white">
              {formatUptime(localStats.uptime)}
            </p>
          </div>
        </div>
      )}

      {/* Channel details */}
      <div className="space-y-2 mb-6">
        {channel.stream_url && (
          <div className="text-sm">
            <span className="text-gray-600 dark:text-gray-400">Stream URL:</span>
            <span className="ml-2 text-gray-900 dark:text-white font-mono text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
              {channel.stream_url.length > 40 ? `${channel.stream_url.substring(0, 40)}...` : channel.stream_url}
            </span>
          </div>
        )}
        
        {channel.schedule_id && (
          <div className="text-sm">
            <span className="text-gray-600 dark:text-gray-400">Schedule:</span>
            <span className="ml-2 text-gray-900 dark:text-white">
              {channel.schedule_id}
            </span>
          </div>
        )}
        
        {channel.last_activity && (
          <div className="text-sm">
            <span className="text-gray-600 dark:text-gray-400">Last Activity:</span>
            <span className="ml-2 text-gray-900 dark:text-white">
              {new Date(channel.last_activity).toLocaleString()}
            </span>
          </div>
        )}
      </div>

      {/* Control buttons */}
      <div className="flex space-x-3">
        {channel.status === 'running' ? (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onControl(channelId, 'stop')}
            disabled={isControlling}
            className="flex-1 flex items-center justify-center px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
          >
            <StopIcon className="w-5 h-5 mr-2" />
            {isControlling ? 'Stopping...' : 'Stop Channel'}
          </motion.button>
        ) : (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onControl(channelId, 'start')}
            disabled={isControlling}
            className="flex-1 flex items-center justify-center px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
          >
            <PlayIcon className="w-5 h-5 mr-2" />
            {isControlling ? 'Starting...' : 'Start Channel'}
          </motion.button>
        )}
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onControl(channelId, 'restart')}
          disabled={isControlling}
          className="px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
        >
          <RocketLaunchIcon className="w-5 h-5" />
        </motion.button>
      </div>

      {/* Animated background accent */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-20" />
    </motion.div>
  );
};

export function Channels() {
  const queryClient = useQueryClient();
  const [controllingChannel, setControllingChannel] = useState(null);

  // Fetch channels data
  const { data: channelsData, isLoading } = useQuery({
    queryKey: ['channels'],
    queryFn: () => apiService.getChannels(),
    refetchInterval: 10000,
  });

  // Fetch system status
  const { data: statusData } = useQuery({
    queryKey: ['status'],
    queryFn: () => apiService.getStatus(),
    refetchInterval: 15000,
  });

  // Channel control mutation
  const controlMutation = useMutation({
    mutationFn: ({ channelId, action }) => apiService.manualChannelControl(channelId, action),
    onSuccess: (data, { action, channelId }) => {
      showSuccessToast(`Channel ${channelId} ${action} successful`);
      queryClient.invalidateQueries(['channels']);
      setControllingChannel(null);
    },
    onError: (error, { action, channelId }) => {
      showErrorToast(`Failed to ${action} channel ${channelId}`);
      setControllingChannel(null);
    },
  });

  // WebSocket real-time updates
  useEffect(() => {
    const handleChannelUpdate = (data) => {
      queryClient.invalidateQueries(['channels']);
    };

    wsService.on('channel_status', handleChannelUpdate);
    return () => wsService.off('channel_status', handleChannelUpdate);
  }, [queryClient]);

  const handleChannelControl = async (channelId, action) => {
    setControllingChannel(channelId);
    controlMutation.mutate({ channelId, action });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-lg text-gray-600 dark:text-gray-300">Loading channels...</p>
        </div>
      </div>
    );
  }

  const channels = channelsData?.channels || {};
  const channelEntries = Object.entries(channels);
  
  // Calculate summary stats
  const totalChannels = channelEntries.length;
  const runningChannels = channelEntries.filter(([_, channel]) => channel.status === 'running').length;
  const errorChannels = channelEntries.filter(([_, channel]) => channel.status === 'error').length;

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
            Live Channels Control Center
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Monitor and control live streaming channels in real-time
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
                <TvIcon className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Channels</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalChannels}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20">
            <div className="flex items-center">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                <SignalIcon className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Live Channels</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{runningChannels}</p>
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
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{errorChannels}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Channels Grid */}
        {totalChannels === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-center py-12"
          >
            <TvIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No Channels Configured
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Configure channels in your system settings to start monitoring.
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
              {channelEntries.map(([channelId, channel], index) => (
                <motion.div
                  key={channelId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                >
                  <ChannelCard
                    channelId={channelId}
                    channel={channel}
                    onControl={handleChannelControl}
                    isControlling={controllingChannel === channelId}
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