import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  ChartBarIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ServerIcon,
  PlayIcon,
} from '@heroicons/react/24/outline';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { format } from 'date-fns';

import { apiService } from '../services/api';

const HEALTH_STATUS_COLORS = {
  'HEALTHY': 'text-success-600 bg-success-50',
  'DEGRADED': 'text-warning-600 bg-warning-50', 
  'UNHEALTHY': 'text-danger-600 bg-danger-50',
  'NO_ACTIVITY': 'text-gray-600 bg-gray-50'
};

const HEALTH_STATUS_ICONS = {
  'HEALTHY': CheckCircleIcon,
  'DEGRADED': ExclamationTriangleIcon,
  'UNHEALTHY': XCircleIcon,
  'NO_ACTIVITY': ClockIcon
};

export default function Monitoring() {
  const [timeRange, setTimeRange] = useState(24);
  const [selectedPipeline, setSelectedPipeline] = useState(null);

  // Fetch monitoring data
  const { data: monitoringData, isLoading } = useQuery(
    ['monitoring', timeRange],
    () => apiService.get(`/highlights/monitoring?hours=${timeRange}`),
    {
      refetchInterval: 30000,
      retry: false,
    }
  );

  // Fetch pipeline-specific data if selected
  const { data: pipelineData } = useQuery(
    ['pipelineMonitoring', selectedPipeline, timeRange],
    () => apiService.get(`/highlights/monitoring/pipeline/${selectedPipeline}?hours=${timeRange}`),
    {
      enabled: !!selectedPipeline,
      refetchInterval: 30000,
      retry: false,
    }
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

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

  // Success rate pie chart data
  const successRateData = [
    { name: 'Successful', value: stats.successful_pushes || 0, color: '#22c55e' },
    { name: 'Failed', value: stats.failed_pushes || 0, color: '#ef4444' }
  ];

  const HealthStatusIcon = HEALTH_STATUS_ICONS[stats.backend_health_status] || ClockIcon;

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            Highlight Monitoring
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-dark-400">
            Real-time monitoring of highlight generation and backend pushing
          </p>
        </div>
        <div className="flex space-x-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(parseInt(e.target.value))}
            className="form-select"
          >
            <option value={1}>Last 1 hour</option>
            <option value={6}>Last 6 hours</option>
            <option value={24}>Last 24 hours</option>
            <option value={72}>Last 3 days</option>
            <option value={168}>Last week</option>
          </select>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="metric-card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ChartBarIcon className="h-6 w-6 text-primary-600" />
            </div>
            <div className="ml-4">
              <div className="metric-value">{stats.total_highlights_generated || 0}</div>
              <div className="metric-label">Highlights Generated</div>
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ServerIcon className="h-6 w-6 text-success-600" />
            </div>
            <div className="ml-4">
              <div className="metric-value">{stats.total_highlights_pushed || 0}</div>
              <div className="metric-label">Highlights Pushed</div>
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ClockIcon className="h-6 w-6 text-warning-600" />
            </div>
            <div className="ml-4">
              <div className="metric-value">{Math.round(stats.avg_push_time_ms || 0)}ms</div>
              <div className="metric-label">Avg Push Time</div>
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <HealthStatusIcon className="h-6 w-6 text-gray-600" />
            </div>
            <div className="ml-4">
              <div className="metric-value">{Math.round(stats.push_success_rate || 0)}%</div>
              <div className="metric-label">Success Rate</div>
            </div>
          </div>
        </div>
      </div>

      {/* Backend health status */}
      <div className={`rounded-md p-4 border ${
        stats.backend_health_status === 'HEALTHY' ? 'bg-success-50 border-success-200' :
        stats.backend_health_status === 'DEGRADED' ? 'bg-warning-50 border-warning-200' :
        stats.backend_health_status === 'UNHEALTHY' ? 'bg-danger-50 border-danger-200' :
        'bg-gray-50 border-gray-200'
      }`}>
        <div className="flex">
          <div className="flex-shrink-0">
            <HealthStatusIcon className="h-5 w-5" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium">
              Backend Health: {stats.backend_health_status || 'Unknown'}
            </h3>
            <div className="mt-2 text-sm">
              <p>
                {stats.backend_health_status === 'HEALTHY' && 'Backend is operating normally with high success rates.'}
                {stats.backend_health_status === 'DEGRADED' && 'Backend is experiencing some issues but still functional.'}
                {stats.backend_health_status === 'UNHEALTHY' && 'Backend is experiencing significant issues.'}
                {stats.backend_health_status === 'NO_ACTIVITY' && 'No recent backend activity detected.'}
                {!stats.backend_health_status && 'Backend health status unavailable.'}
              </p>
              {stats.last_activity && (
                <p className="mt-1">
                  Last activity: {format(new Date(stats.last_activity), 'MMM dd, HH:mm:ss')}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity over time */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900">Activity Over Time</h3>
            <p className="text-sm text-gray-500">Highlights generated and pushed per hour</p>
          </div>
          <div className="card-body">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={timeSeriesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name) => [value, name === 'highlights' ? 'Generated' : 'Pushed']}
                    labelFormatter={(label) => `Time: ${label}`}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="highlights" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    name="highlights"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="pushes" 
                    stroke="#22c55e" 
                    strokeWidth={2}
                    name="pushes"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Success rate */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900">Push Success Rate</h3>
            <p className="text-sm text-gray-500">Backend push success vs failures</p>
          </div>
          <div className="card-body">
            <div className="h-64">
              {successRateData.some(d => d.value > 0) ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={successRateData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {successRateData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <div className="text-center">
                    <ChartBarIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2">No push data available</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Recent events */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-medium text-gray-900">Recent Events</h3>
          <p className="text-sm text-gray-500">Latest highlight generation and backend push events</p>
        </div>
        <div className="card-body p-0">
          <div className="flow-root">
            <ul className="divide-y divide-gray-200">
              {[...generationEvents.slice(0, 10), ...pushEvents.slice(0, 10)]
                .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                .slice(0, 20)
                .map((event, index) => (
                <li key={index} className="px-6 py-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      {event.video_id ? (
                        <ServerIcon className={`h-5 w-5 ${event.success ? 'text-success-500' : 'text-danger-500'}`} />
                      ) : (
                        <PlayIcon className={`h-5 w-5 ${event.success ? 'text-primary-500' : 'text-danger-500'}`} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {event.video_id ? 'Backend Push' : 'Highlight Generation'}
                        {event.video_id && ` (${event.highlight_count} highlights)`}
                        {!event.video_id && ` (${event.highlight_count} highlights generated)`}
                      </p>
                      <p className="text-sm text-gray-500">
                        {event.pipeline_id} • {format(new Date(event.timestamp), 'MMM dd, HH:mm:ss')}
                        {event.response_time_ms && ` • ${event.response_time_ms}ms`}
                      </p>
                      {event.error_message && (
                        <p className="text-sm text-danger-600 mt-1">{event.error_message}</p>
                      )}
                    </div>
                    <div className="flex-shrink-0">
                      {event.success ? (
                        <CheckCircleIcon className="h-5 w-5 text-success-500" />
                      ) : (
                        <XCircleIcon className="h-5 w-5 text-danger-500" />
                      )}
                    </div>
                  </div>
                </li>
              ))}
              {generationEvents.length === 0 && pushEvents.length === 0 && (
                <li className="px-6 py-12 text-center text-gray-500">
                  <EyeIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No recent events</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Events will appear here when highlights are generated or pushed to the backend.
                  </p>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}