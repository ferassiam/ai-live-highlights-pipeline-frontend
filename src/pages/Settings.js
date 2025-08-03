import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import {
  CogIcon,
  ServerIcon,
  KeyIcon,
  CloudIcon,
  BellIcon,
} from '@heroicons/react/24/outline';

import { apiService, showSuccessToast, showErrorToast } from '../services/api';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('global');
  const queryClient = useQueryClient();

  // Fetch global config
  const { data: globalConfig, isLoading } = useQuery(
    'globalConfig',
    () => apiService.getGlobalConfig()
  );

  // Fetch system status
  const { data: status } = useQuery(
    'systemStatus',
    () => apiService.getStatus()
  );

  // Update global config mutation
  const updateConfigMutation = useMutation(
    (config) => apiService.updateGlobalConfig(config),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('globalConfig');
        showSuccessToast('Configuration updated successfully');
      },
      onError: (error) => {
        showErrorToast(error.response?.data?.detail || 'Failed to update configuration');
      },
    }
  );

  const [configForm, setConfigForm] = useState(globalConfig || {});

  React.useEffect(() => {
    if (globalConfig) {
      setConfigForm(globalConfig);
    }
  }, [globalConfig]);

  const handleConfigSubmit = (e) => {
    e.preventDefault();
    updateConfigMutation.mutate(configForm);
  };

  const handleConfigChange = (key, value) => {
    setConfigForm(prev => ({ ...prev, [key]: value }));
  };

  const tabs = [
    { id: 'global', name: 'Global Config', icon: CogIcon },
    { id: 'system', name: 'System Info', icon: ServerIcon },
    { id: 'api', name: 'API Settings', icon: KeyIcon },
    { id: 'integrations', name: 'Integrations', icon: CloudIcon },
  ];

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
            Settings
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-dark-400">
            Configure system settings and integrations
          </p>
        </div>
      </div>

      <div className="lg:grid lg:grid-cols-12 lg:gap-x-5">
        {/* Settings navigation */}
        <aside className="py-6 px-2 sm:px-6 lg:py-0 lg:px-0 lg:col-span-3">
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`group nav-link-settings ${
                  activeTab === tab.id ? 'nav-link-settings-active' : ''
                }`}
              >
                <tab.icon
                  className={`flex-shrink-0 -ml-1 mr-3 h-6 w-6 ${
                    activeTab === tab.id ? 'text-primary-700 dark:text-primary-400' : 'text-gray-400 dark:text-dark-500 group-hover:text-gray-500 dark:group-hover:text-dark-300'
                  }`}
                />
                <span className="truncate">{tab.name}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Settings content */}
        <div className="space-y-6 sm:px-6 lg:px-0 lg:col-span-9">
          {/* Global Configuration */}
          {activeTab === 'global' && (
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-medium text-gray-900">Global Configuration</h3>
                <p className="text-sm text-gray-500">
                  Configure global settings for the pipeline system
                </p>
              </div>
              <div className="card-body">
                <form onSubmit={handleConfigSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Storage Account Name
                      </label>
                      <input
                        type="text"
                        value={configForm.storage_account_name || ''}
                        onChange={(e) => handleConfigChange('storage_account_name', e.target.value)}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        placeholder="Storage account name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Logging Level
                      </label>
                      <select
                        value={configForm.logging_level || 'INFO'}
                        onChange={(e) => handleConfigChange('logging_level', e.target.value)}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      >
                        <option value="DEBUG">Debug</option>
                        <option value="INFO">Info</option>
                        <option value="WARNING">Warning</option>
                        <option value="ERROR">Error</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Max Retries
                      </label>
                      <input
                        type="number"
                        value={configForm.max_retries || 3}
                        onChange={(e) => handleConfigChange('max_retries', parseInt(e.target.value))}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        min="1"
                        max="10"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Retry Delay (seconds)
                      </label>
                      <input
                        type="number"
                        value={configForm.retry_delay || 5}
                        onChange={(e) => handleConfigChange('retry_delay', parseInt(e.target.value))}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        min="1"
                        max="60"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Notification Webhook URL
                      </label>
                      <input
                        type="url"
                        value={configForm.notification_webhook || ''}
                        onChange={(e) => handleConfigChange('notification_webhook', e.target.value)}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        placeholder="https://example.com/webhook"
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={configForm.create_cu_locator || false}
                        onChange={(e) => handleConfigChange('create_cu_locator', e.target.checked)}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <label className="ml-2 block text-sm text-gray-900">
                        Create Content Understanding Locator
                      </label>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={updateConfigMutation.isLoading}
                      className="btn btn-primary"
                    >
                      {updateConfigMutation.isLoading ? 'Saving...' : 'Save Configuration'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* System Information */}
          {activeTab === 'system' && (
            <div className="space-y-6">
              <div className="card">
                <div className="card-header">
                  <h3 className="text-lg font-medium text-gray-900">System Status</h3>
                </div>
                <div className="card-body">
                  <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Orchestrator Status</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        <span className={`status-indicator ${status?.orchestrator_running ? 'status-running' : 'status-stopped'}`}>
                          {status?.orchestrator_running ? 'Running' : 'Stopped'}
                        </span>
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Active Connections</dt>
                      <dd className="mt-1 text-sm text-gray-900">{status?.active_connections || 0}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Schedules Loaded</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {status?.orchestrator_status?.schedules_loaded || 0}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Highlights Backend</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        <span className={`status-indicator ${status?.orchestrator_status?.highlights_backend_enabled ? 'status-running' : 'status-stopped'}`}>
                          {status?.orchestrator_status?.highlights_backend_enabled ? 'Enabled' : 'Disabled'}
                        </span>
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Active Channels</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {Object.keys(status?.orchestrator_status?.active_channels || {}).length}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Active Pipelines</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {status?.orchestrator_status?.active_pipelines?.length || 0}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>

              <div className="card">
                <div className="card-header">
                  <h3 className="text-lg font-medium text-gray-900">Environment Information</h3>
                </div>
                <div className="card-body">
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Required Environment Variables</h4>
                      <div className="grid grid-cols-1 gap-2 text-xs font-mono">
                        <div>API_KEY</div>
                        <div>MKIO_JWT</div>
                        <div>MKIO_PROJECT_NAME</div>
                        <div>AZURE_AI_SERVICES_ENDPOINT</div>
                        <div>AZURE_AI_SERVICES_API_KEY</div>
                        <div>AZURE_OPENAI_ENDPOINT</div>
                        <div>AZURE_OPENAI_API_KEY</div>
                      </div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Optional Environment Variables</h4>
                      <div className="grid grid-cols-1 gap-2 text-xs font-mono">
                        <div>HIGHLIGHTS_BACKEND_URL</div>
                        <div>SEGMENT_DURATION</div>
                        <div>QUIET_MODE</div>
                        <div>API_PORT</div>
                        <div>API_RELOAD</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* API Settings */}
          {activeTab === 'api' && (
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-medium text-gray-900">API Configuration</h3>
                <p className="text-sm text-gray-500">
                  API server settings and endpoints
                </p>
              </div>
              <div className="card-body">
                <div className="space-y-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">API Endpoints</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Health Check:</span>
                        <span className="font-mono text-gray-600">GET /health</span>
                      </div>
                      <div className="flex justify-between">
                        <span>System Status:</span>
                        <span className="font-mono text-gray-600">GET /status</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Interactive Docs:</span>
                        <span className="font-mono text-gray-600">GET /docs</span>
                      </div>
                      <div className="flex justify-between">
                        <span>WebSocket:</span>
                        <span className="font-mono text-gray-600">WS /ws</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Authentication</h4>
                    <div className="space-y-2 text-sm text-gray-600">
                      <p>The API uses Bearer token authentication.</p>
                      <p>Include your API key in the Authorization header:</p>
                      <div className="mt-2 p-2 bg-gray-100 rounded font-mono text-xs">
                        Authorization: Bearer your_api_key_here
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Rate Limiting</h4>
                    <div className="text-sm text-gray-600">
                      <p>No rate limiting is currently configured.</p>
                      <p>Consider implementing rate limiting for production deployments.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Integrations */}
          {activeTab === 'integrations' && (
            <div className="space-y-6">
              <div className="card">
                <div className="card-header">
                  <h3 className="text-lg font-medium text-gray-900">Azure Services</h3>
                </div>
                <div className="card-body">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <CloudIcon className="h-5 w-5 text-primary-500 mr-3" />
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">Azure AI Services</h4>
                          <p className="text-sm text-gray-500">Content Understanding API</p>
                        </div>
                      </div>
                      <span className="status-running">Connected</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <CloudIcon className="h-5 w-5 text-primary-500 mr-3" />
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">Azure OpenAI</h4>
                          <p className="text-sm text-gray-500">GPT models for highlight generation</p>
                        </div>
                      </div>
                      <span className="status-running">Connected</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="card-header">
                  <h3 className="text-lg font-medium text-gray-900">MKIO Platform</h3>
                </div>
                <div className="card-body">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <ServerIcon className="h-5 w-5 text-primary-500 mr-3" />
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">MKIO Channel Management</h4>
                        <p className="text-sm text-gray-500">Live streaming channel operations</p>
                      </div>
                    </div>
                    <span className="status-running">Connected</span>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="card-header">
                  <h3 className="text-lg font-medium text-gray-900">Highlights Backend</h3>
                </div>
                <div className="card-body">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <BellIcon className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">Highlights Publishing</h4>
                        <p className="text-sm text-gray-500">
                          {status?.orchestrator_status?.highlights_backend_enabled 
                            ? 'Publishing highlights to backend'
                            : 'Set HIGHLIGHTS_BACKEND_URL to enable'
                          }
                        </p>
                      </div>
                    </div>
                    <span className={`status-indicator ${status?.orchestrator_status?.highlights_backend_enabled ? 'status-running' : 'status-stopped'}`}>
                      {status?.orchestrator_status?.highlights_backend_enabled ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="card-header">
                  <h3 className="text-lg font-medium text-gray-900">Webhook Notifications</h3>
                </div>
                <div className="card-body">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <BellIcon className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">Event Notifications</h4>
                        <p className="text-sm text-gray-500">
                          {configForm.notification_webhook 
                            ? `Sending to ${configForm.notification_webhook}`
                            : 'Configure webhook URL in Global Config'
                          }
                        </p>
                      </div>
                    </div>
                    <span className={`status-indicator ${configForm.notification_webhook ? 'status-running' : 'status-stopped'}`}>
                      {configForm.notification_webhook ? 'Configured' : 'Not configured'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}