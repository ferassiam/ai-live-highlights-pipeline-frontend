import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  ChartBarIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  
  ServerIcon,
  PlayIcon,
  SignalIcon,
  CpuChipIcon,
} from '@heroicons/react/24/outline';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

import { apiService } from '../services/api';
import { MetricsCard } from '../components/ui/MetricsCard';
import { Card, CardHeader, CardContent } from '../components/ui/Card';
 
import { Badge } from '../components/ui/Badge';
import { StatusIndicator } from '../components/ui/StatusIndicator';
import { Select } from '../components/ui/Select';
import { cn } from '../utils/cn';

// Professional status mappings for sports operations
const HEALTH_STATUS_MAPPINGS = {
  'HEALTHY': { 
    status: 'healthy', 
    variant: 'success',
    color: 'success',
    icon: CheckCircleIcon,
    label: 'Operational'
  },
  'DEGRADED': { 
    status: 'warning', 
    variant: 'warning',
    color: 'warning',
    icon: ExclamationTriangleIcon,
    label: 'Degraded'
  },
  'UNHEALTHY': { 
    status: 'unhealthy', 
    variant: 'failed',
    color: 'danger',
    icon: XCircleIcon,
    label: 'Critical'
  },
  'NO_ACTIVITY': { 
    status: 'paused', 
    variant: 'paused',
    color: 'default',
    icon: ClockIcon,
    label: 'Inactive'
  }
};

export default function Monitoring() {
  const [timeRange, setTimeRange] = useState(24);
  

  // Fetch monitoring data
  const { data: monitoringData, isLoading } = useQuery({
    queryKey: ['monitoring', timeRange],
    queryFn: () => apiService.get(`/highlights/monitoring?hours=${timeRange}`),
    refetchInterval: 30000,
    retry: false,
  });

  // Pipeline-specific data can be added when selection is implemented

  const stats = monitoringData?.data?.stats || {};
  const events = monitoringData?.data?.recent_events || {};
  const generationEvents = events.generation_events || [];
  const pushEvents = events.push_events || [];

  // Generate time series data for charts
  const generateTimeSeriesData = () => {
    const data = [];
    const now = new Date();
    
    // Group events by hour for the chart
    const hourlyData = {};
    
    generationEvents.forEach(event => {
      const eventTime = new Date(event.timestamp);
      const hourKey = eventTime.toISOString().slice(0, 13) + ':00:00.000Z';
      
      if (!hourlyData[hourKey]) {
        hourlyData[hourKey] = { highlights: 0, pushes: 0 };
      }
      hourlyData[hourKey].highlights += event.highlight_count;
    });
    
    pushEvents.forEach(event => {
      const eventTime = new Date(event.timestamp);
      const hourKey = eventTime.toISOString().slice(0, 13) + ':00:00.000Z';
      
      if (!hourlyData[hourKey]) {
        hourlyData[hourKey] = { highlights: 0, pushes: 0 };
      }
      if (event.success) {
        hourlyData[hourKey].pushes += event.highlight_count;
      }
    });
    
    // Fill in missing hours with zero data
    for (let i = timeRange - 1; i >= 0; i--) {
      const time = new Date(now.getTime() - (i * 60 * 60 * 1000));
      const hourKey = time.toISOString().slice(0, 13) + ':00:00.000Z';
      const timeStr = format(time, 'HH:mm');
      
      data.push({
        time: timeStr,
        highlights: hourlyData[hourKey]?.highlights || 0,
        pushes: hourlyData[hourKey]?.pushes || 0,
      });
    }
    
    return data;
  };

  const timeSeriesData = generateTimeSeriesData();

  // Professional success rate data
  const successRateData = [
    { name: 'Successful', value: stats.successful_pushes || 0, color: '#10b981' },
    { name: 'Failed', value: stats.failed_pushes || 0, color: '#ef4444' }
  ];

  const healthMapping = HEALTH_STATUS_MAPPINGS[stats.backend_health_status] || HEALTH_STATUS_MAPPINGS['NO_ACTIVITY'];

  const metrics = [
    {
      title: 'Highlights Generated',
      value: stats.total_highlights_generated || 0,
      icon: ChartBarIcon,
      color: 'primary',
      change: 12.5,
      changeLabel: 'vs last period',
      subtitle: 'Total content generated'
    },
    {
      title: 'Highlights Pushed',
      value: stats.total_highlights_pushed || 0,
      icon: ServerIcon,
      color: 'success',
      change: 8.3,
      changeLabel: 'successful deliveries',
      subtitle: 'Backend submissions'
    },
    {
      title: 'Avg Push Time',
      value: Math.round(stats.avg_push_time_ms || 0),
      unit: 'ms',
      icon: ClockIcon,
      color: 'warning',
      change: -5.2,
      changeLabel: 'response improvement',
      subtitle: 'Backend latency'
    },
    {
      title: 'Success Rate',
      value: Math.round(stats.push_success_rate || 0),
      unit: '%',
      icon: CpuChipIcon,
      color: healthMapping.color,
      change: 2.1,
      changeLabel: 'reliability metric',
      subtitle: 'Backend stability'
    }
  ];

  const timeRangeOptions = [
    { value: '1', label: 'Last 1 hour' },
    { value: '6', label: 'Last 6 hours' },
    { value: '24', label: 'Last 24 hours' },
    { value: '72', label: 'Last 3 days' },
    { value: '168', label: 'Last week' }
  ];

  if (isLoading) {
    return (
      <motion.div 
        className="space-y-8 p-6 max-w-7xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary-500 border-r-transparent" />
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
              Highlight Monitoring
            </h1>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 font-medium mt-2">
            Real-time monitoring of highlight generation and backend integration
          </p>
        </div>
        <div className="flex items-center gap-3">
          <StatusIndicator 
            status={healthMapping.status} 
            showText 
            size="sm"
          />
          <Select
            value={timeRange.toString()}
            onChange={(value) => setTimeRange(parseInt(value))}
            options={timeRangeOptions}
            size="sm"
            className="min-w-[140px]"
          />
        </div>
      </div>

      {/* Professional KPI metrics */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <MetricsCard
              title={metric.title}
              value={metric.value}
              unit={metric.unit}
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

      {/* Professional backend health status */}
      <Card 
        variant="default"
        className={cn(
          'border-l-4 transition-all duration-200',
          stats.backend_health_status === 'HEALTHY' ? 'border-l-success-500 bg-success-50 dark:bg-success-950/20' :
          stats.backend_health_status === 'DEGRADED' ? 'border-l-warning-500 bg-warning-50 dark:bg-warning-950/20' :
          stats.backend_health_status === 'UNHEALTHY' ? 'border-l-danger-500 bg-danger-50 dark:bg-danger-950/20' :
          'border-l-slate-500 bg-slate-50 dark:bg-slate-950/20'
        )}
      >
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 pt-0.5">
              <StatusIndicator 
                status={healthMapping.status} 
                size="sm" 
                showRing 
              />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className={cn(
                  'text-lg font-subheading tracking-tight',
                  stats.backend_health_status === 'HEALTHY' ? 'text-success-700 dark:text-success-300' :
                  stats.backend_health_status === 'DEGRADED' ? 'text-warning-700 dark:text-warning-300' :
                  stats.backend_health_status === 'UNHEALTHY' ? 'text-danger-700 dark:text-danger-300' :
                  'text-slate-700 dark:text-slate-300'
                )}>
                  Backend Status: {healthMapping.label}
                </h3>
                <Badge variant={healthMapping.variant} size="sm">
                  {stats.backend_health_status || 'UNKNOWN'}
                </Badge>
              </div>
              
              <p className={cn(
                'text-sm leading-relaxed',
                stats.backend_health_status === 'HEALTHY' ? 'text-success-600 dark:text-success-400' :
                stats.backend_health_status === 'DEGRADED' ? 'text-warning-600 dark:text-warning-400' :
                stats.backend_health_status === 'UNHEALTHY' ? 'text-danger-600 dark:text-danger-400' :
                'text-slate-600 dark:text-slate-400'
              )}>
                {stats.backend_health_status === 'HEALTHY' && 'Backend services are operating normally with optimal performance and high success rates.'}
                {stats.backend_health_status === 'DEGRADED' && 'Backend services are experiencing minor issues but remain functional. Performance may be impacted.'}
                {stats.backend_health_status === 'UNHEALTHY' && 'Backend services are experiencing significant issues. Immediate attention required.'}
                {stats.backend_health_status === 'NO_ACTIVITY' && 'No recent backend activity detected. Systems may be idle or offline.'}
                {!stats.backend_health_status && 'Backend health status is currently unavailable. Check system connectivity.'}
              </p>
              
              {stats.last_activity && (
                <div className="mt-3 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <ClockIcon className="h-3 w-3" />
                  <span className="font-medium">
                    Last activity: {format(new Date(stats.last_activity), 'MMM dd, HH:mm:ss')}
                  </span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Professional analytics charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity timeline chart */}
        <Card variant="elevated">
          <CardHeader>
            <h3 className="text-lg font-subheading font-semibold text-slate-900 dark:text-slate-100 tracking-tight">
              Activity Timeline
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
              Highlights generated and backend pushes over time
            </p>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={timeSeriesData}>
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
                    formatter={(value, name) => [value, name === 'highlights' ? 'Generated' : 'Pushed']}
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
                    name="highlights"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="pushes" 
                    stroke="#10b981" 
                    strokeWidth={2.5}
                    dot={{ fill: '#10b981', strokeWidth: 0, r: 3 }}
                    activeDot={{ r: 5, stroke: '#10b981', strokeWidth: 2, fill: '#ffffff' }}
                    name="pushes"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Success rate visualization */}
        <Card variant="elevated">
          <CardHeader>
            <h3 className="text-lg font-subheading font-semibold text-slate-900 dark:text-slate-100 tracking-tight">
              Backend Success Rate
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
              Push success rate and failure analysis
            </p>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              {successRateData.some(d => d.value > 0) ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={successRateData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={85}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {successRateData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'rgba(248, 250, 252, 0.95)',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        fontSize: '12px',
                        fontWeight: '500',
                        backdropFilter: 'blur(8px)'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <ChartBarIcon className="mx-auto h-12 w-12 text-slate-400 dark:text-slate-600" />
                    <h4 className="mt-3 text-base font-subheading font-medium text-slate-900 dark:text-slate-100">
                      No push data
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                      Backend push statistics will appear here
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Professional activity feed */}
      <Card variant="default">
        <CardHeader>
          <div className="flex items-center gap-2">
            <EyeIcon className="h-5 w-5 text-slate-600 dark:text-slate-400" />
            <h3 className="text-lg font-subheading font-semibold text-slate-900 dark:text-slate-100 tracking-tight">
              Recent Activity
            </h3>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
            Latest highlight generation and backend push events
          </p>
        </CardHeader>
        <CardContent className="p-0">
          <div className="max-h-96 overflow-y-auto">
            {[...generationEvents.slice(0, 10), ...pushEvents.slice(0, 10)]
              .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
              .slice(0, 20)
              .length === 0 ? (
              <div className="text-center py-12">
                <EyeIcon className="mx-auto h-12 w-12 text-slate-400 dark:text-slate-600" />
                <h4 className="mt-3 text-base font-subheading font-medium text-slate-900 dark:text-slate-100">
                  No recent events
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Activity will appear here when highlights are generated or pushed
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-200 dark:divide-slate-700">
                {[...generationEvents.slice(0, 10), ...pushEvents.slice(0, 10)]
                  .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                  .slice(0, 20)
                  .map((event, index) => (
                  <motion.div 
                    key={index}
                    className="px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.02 }}
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 pt-1">
                        <StatusIndicator 
                          status={event.success ? 'healthy' : 'unhealthy'} 
                          size="sm" 
                          showText={false}
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                          <h4 className="text-sm font-subheading font-medium text-slate-900 dark:text-slate-100">
                            {event.video_id ? 'Backend Push' : 'Highlight Generation'}
                          </h4>
                          <Badge 
                            variant={event.success ? 'success' : 'failed'} 
                            size="sm"
                          >
                            {event.success ? 'Success' : 'Failed'}
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                          {event.highlight_count} highlights • {event.pipeline_id}
                          {event.response_time_ms && ` • ${event.response_time_ms}ms response`}
                        </p>
                        
                        {event.error_message && (
                          <p className="text-sm text-danger-600 dark:text-danger-400 bg-danger-50 dark:bg-danger-950/20 px-3 py-2 rounded-md mb-2">
                            {event.error_message}
                          </p>
                        )}
                        
                        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                          <ClockIcon className="h-3 w-3" />
                          <span className="font-medium font-mono tabular-nums">
                            {format(new Date(event.timestamp), 'MMM dd, HH:mm:ss')}
                          </span>
                          {event.video_id && (
                            <>
                              <span>•</span>
                              <span className="font-mono">
                                {event.video_id.substring(0, 8)}...
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex-shrink-0 pt-1">
                        {event.video_id ? (
                          <ServerIcon className={cn(
                            'h-4 w-4',
                            event.success ? 'text-success-500' : 'text-danger-500'
                          )} />
                        ) : (
                          <PlayIcon className={cn(
                            'h-4 w-4',
                            event.success ? 'text-primary-500' : 'text-danger-500'
                          )} />
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}