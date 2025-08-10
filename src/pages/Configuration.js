import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CogIcon,
  DocumentTextIcon,
  CodeBracketIcon,
  ClockIcon,
  GlobeAltIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';

import { apiService, showSuccessToast, showErrorToast, wsService } from '../services/api';
import { TabNavigation } from '../components/ui/TabNavigation';
import { CodeEditor } from '../components/ui/CodeEditor';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { Select } from '../components/ui/Select';
import { Button } from '../components/ui/Button';
import { cn } from '../utils/cn';

export default function Configuration() {
  const [activeTab, setActiveTab] = useState('prompts');
  const [selectedSport, setSelectedSport] = useState('football');
  const [promptType, setPromptType] = useState('scene_generation');
  const [promptConfig, setPromptConfig] = useState('');
  const [schemaConfig, setSchemaConfig] = useState('');
  const [promptError, setPromptError] = useState(null);
  const [schemaError, setSchemaError] = useState(null);
  const [isAdmin] = useState(true); // TODO: Get from auth context
  
  const queryClient = useQueryClient();

  // Fetch supported sports
  const { data: sportsResponse, isLoading: sportsLoading, error: sportsError } = useQuery({
    queryKey: ['supportedSports'],
    queryFn: () => apiService.getSupportedSports(),
    retry: false,
    staleTime: 300000, // 5 minutes
    onError: (error) => {
      console.error('Failed to fetch supported sports:', error);
    }
  });

  // Handle different possible response formats from the backend
  const supportedSports = React.useMemo(() => {
    if (!sportsResponse) return [];
    
    // If the response is already an array
    if (Array.isArray(sportsResponse)) {
      return sportsResponse;
    }
    
    // If the response has a sports property
    if (sportsResponse.sports && Array.isArray(sportsResponse.sports)) {
      return sportsResponse.sports;
    }
    
    // If the response has a data property
    if (sportsResponse.data && Array.isArray(sportsResponse.data)) {
      return sportsResponse.data;
    }
    
    // If the response has supported_sports property
    if (sportsResponse.supported_sports && Array.isArray(sportsResponse.supported_sports)) {
      return sportsResponse.supported_sports;
    }
    
    // If it's an object with string values, try to extract them
    if (typeof sportsResponse === 'object' && sportsResponse !== null) {
      const values = Object.values(sportsResponse).filter(v => typeof v === 'string');
      if (values.length > 0) {
        return values;
      }
      
      // Try to get all keys if they look like sport names
      const keys = Object.keys(sportsResponse);
      if (keys.length > 0 && keys.every(k => typeof k === 'string' && k.length > 0)) {
        return keys;
      }
    }
    
    // Log the actual response structure for debugging in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Unexpected sports response format:', sportsResponse);
    }
    return [];
  }, [sportsResponse]);

  // Fetch prompt configuration
  const { data: promptData, isLoading: promptLoading, error: promptFetchError } = useQuery({
    queryKey: ['promptConfig', selectedSport, promptType],
    queryFn: () => apiService.getPromptConfig(selectedSport),
    enabled: activeTab === 'prompts' && !!selectedSport,
  });

  // Fetch schema configuration
  const { data: schemaData, isLoading: schemaLoading, error: schemaFetchError } = useQuery({
    queryKey: ['schemaConfig', selectedSport],
    queryFn: () => apiService.getSchemaConfig(selectedSport),
    enabled: activeTab === 'schemas' && !!selectedSport,
  });

  // Fetch prompt history
  const { data: promptHistory = [] } = useQuery({
    queryKey: ['promptHistory', selectedSport],
    queryFn: () => apiService.getPromptHistory(selectedSport),
    enabled: activeTab === 'history' && !!selectedSport,
  });

  // Fetch schema history
  const { data: schemaHistory = [] } = useQuery({
    queryKey: ['schemaHistory', selectedSport],
    queryFn: () => apiService.getSchemaHistory(selectedSport),
    enabled: activeTab === 'history' && !!selectedSport,
  });

  // Update prompt mutation
  const updatePromptMutation = useMutation({
    mutationFn: ({ sport, config, etag }) => apiService.updatePromptConfig(sport, config, etag),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promptConfig'] });
      queryClient.invalidateQueries({ queryKey: ['promptHistory'] });
      showSuccessToast('Prompt configuration updated successfully');
      setPromptError(null);
    },
    onError: (error) => {
      const message = error.response?.data?.detail || 'Failed to update prompt configuration';
      showErrorToast(message);
      setPromptError(message);
    },
  });

  // Update schema mutation
  const updateSchemaMutation = useMutation({
    mutationFn: ({ sport, schema, etag }) => apiService.updateSchemaConfig(sport, schema, etag),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schemaConfig'] });
      queryClient.invalidateQueries({ queryKey: ['schemaHistory'] });
      showSuccessToast('Schema configuration updated successfully');
      setSchemaError(null);
    },
    onError: (error) => {
      const message = error.response?.data?.detail || 'Failed to update schema configuration';
      showErrorToast(message);
      setSchemaError(message);
    },
  });

  // Rollback prompt mutation
  const rollbackPromptMutation = useMutation({
    mutationFn: ({ sport, version }) => apiService.rollbackPrompt(sport, version),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promptConfig'] });
      queryClient.invalidateQueries({ queryKey: ['promptHistory'] });
      showSuccessToast('Prompt configuration rolled back successfully');
    },
    onError: (error) => {
      showErrorToast(error.response?.data?.detail || 'Failed to rollback prompt configuration');
    },
  });

  // Rollback schema mutation
  const rollbackSchemaMutation = useMutation({
    mutationFn: ({ sport, version }) => apiService.rollbackSchema(sport, version),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schemaConfig'] });
      queryClient.invalidateQueries({ queryKey: ['schemaHistory'] });
      showSuccessToast('Schema configuration rolled back successfully');
    },
    onError: (error) => {
      showErrorToast(error.response?.data?.detail || 'Failed to rollback schema configuration');
    },
  });

  // Update local states when data changes
  useEffect(() => {
    if (promptData) {
      // Handle nested data structure from API
      const actualData = promptData.data || promptData;
      if (actualData && actualData[promptType]) {
        setPromptConfig(actualData[promptType]);
      }
    }
  }, [promptData, promptType]);

  useEffect(() => {
    if (schemaData) {
      // Handle nested data structure from API
      const actualData = schemaData.data || schemaData;
      if (actualData) {
        // For schema, stringify the entire data object
        setSchemaConfig(JSON.stringify(actualData, null, 2));
      }
    }
  }, [schemaData]);

  // WebSocket listeners for real-time updates
  useEffect(() => {
    const handleConfigUpdate = (data) => {
      if (data.sport === selectedSport) {
        queryClient.invalidateQueries({ queryKey: ['promptConfig'] });
        queryClient.invalidateQueries({ queryKey: ['schemaConfig'] });
        showSuccessToast(`Configuration updated for ${data.sport}`);
      }
    };

    wsService.on('configUpdated', handleConfigUpdate);
    return () => wsService.off('configUpdated', handleConfigUpdate);
  }, [selectedSport, queryClient]);

  const tabs = [
    { id: 'prompts', name: 'Prompts', icon: DocumentTextIcon },
    { id: 'schemas', name: 'Schemas', icon: CodeBracketIcon },
    { id: 'history', name: 'Version History', icon: ClockIcon },
    { id: 'global', name: 'Global Config', icon: GlobeAltIcon },
  ];

  const promptTypes = [
    { value: 'scene_generation', label: 'Scene Generation' },
    { value: 'highlight_generation', label: 'Highlight Generation' }
  ];

  const handlePromptSave = () => {
    if (!isAdmin) return;
    
    // Handle nested data structure - update the specific prompt type
    const actualData = promptData?.data || promptData || {};
    const updatedData = {
      ...actualData,
      [promptType]: promptConfig
    };
    
    updatePromptMutation.mutate({ 
      sport: selectedSport, 
      config: updatedData, 
      etag: promptData?.etag 
    });
  };

  const handleSchemaSave = () => {
    if (!isAdmin) return;
    
    try {
      const parsedSchema = JSON.parse(schemaConfig);
      updateSchemaMutation.mutate({ 
        sport: selectedSport, 
        schema: parsedSchema, 
        etag: schemaData?.etag 
      });
    } catch (error) {
      setSchemaError('Invalid JSON format');
      showErrorToast('Invalid JSON format');
    }
  };

  const handleRollback = (type, version) => {
    if (!isAdmin) return;
    
    const confirmMessage = `Are you sure you want to rollback ${type} configuration to version ${version}?`;
    if (window.confirm(confirmMessage)) {
      if (type === 'prompt') {
        rollbackPromptMutation.mutate({ sport: selectedSport, version });
      } else if (type === 'schema') {
        rollbackSchemaMutation.mutate({ sport: selectedSport, version });
      }
    }
  };


  if (sportsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner message="Loading configuration management..." />
      </div>
    );
  }

  if (sportsError) {
    return (
      <div className="space-y-6">
        <div className="page-header">
          <div>
            <h1 className="page-title flex items-center">
              <CogIcon className="h-8 w-8 mr-3" />
              Configuration Management
            </h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-dark-400">
              Manage sport-specific prompts, schemas, and system configuration
            </p>
          </div>
        </div>
        
        <div className="bg-danger-50 dark:bg-danger-900/20 border border-danger-200 dark:border-danger-800 rounded-md p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-danger-800 dark:text-danger-200">
                Configuration Error
              </h3>
              <p className="mt-1 text-sm text-danger-700 dark:text-danger-300">
                {sportsError?.response?.status === 401 
                  ? 'Authentication failed. The configuration endpoints require valid authentication.'
                  : (sportsError.message || 'Failed to load configuration data. The configuration endpoints may not be available.')
                }
              </p>
              {sportsError?.response?.status === 401 && (
                <p className="mt-2 text-sm text-danger-600 dark:text-danger-400">
                  Status: {sportsError.response.status} - {sportsError.response.statusText}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!sportsLoading && (!Array.isArray(supportedSports) || supportedSports.length === 0)) {
    return (
      <div className="space-y-6">
        <div className="page-header">
          <div>
            <h1 className="page-title flex items-center">
              <CogIcon className="h-8 w-8 mr-3" />
              Configuration Management
            </h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-dark-400">
              Manage sport-specific prompts, schemas, and system configuration
            </p>
          </div>
        </div>
        
        <div className="bg-warning-50 dark:bg-warning-900/20 border border-warning-200 dark:border-warning-800 rounded-md p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-warning-800 dark:text-warning-200">
                No Configuration Available
              </h3>
              <p className="mt-1 text-sm text-warning-700 dark:text-warning-300">
                No supported sports found. Configuration management may not be set up on the backend.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="page-header">
        <div>
          <h1 className="page-title flex items-center">
            <CogIcon className="h-8 w-8 mr-3" />
            Configuration Management
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-dark-400">
            Manage sport-specific prompts, schemas, and system configuration
          </p>
        </div>
        
        {/* Sport selector */}
        <div className="flex items-center space-x-4">
          <Select
            label="Sport"
            value={selectedSport}
            onChange={setSelectedSport}
            options={Array.isArray(supportedSports) ? supportedSports.map(sport => ({ value: sport, label: sport.charAt(0).toUpperCase() + sport.slice(1) })) : []}
            className="min-w-[150px]"
          />
          {!isAdmin && (
            <div className="bg-warning-50 dark:bg-warning-900/20 border border-warning-200 dark:border-warning-800 rounded-md px-3 py-2">
              <span className="text-sm text-warning-700 dark:text-warning-300">Read-only access</span>
            </div>
          )}
        </div>
      </div>

      {/* Tab navigation */}
      <TabNavigation
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Tab content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
        >
          {/* Prompts Tab */}
          {activeTab === 'prompts' && (
            <div className="space-y-6">
              <div className="card">
                <div className="card-header">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        Prompt Configuration
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-dark-400">
                        Edit sport-specific prompts for AI processing
                      </p>
                    </div>
                    <Select
                      label="Prompt Type"
                      value={promptType}
                      onChange={setPromptType}
                      options={promptTypes}
                      className="min-w-[200px]"
                    />
                  </div>
                </div>
                <div className="card-body">
                  {promptLoading ? (
                    <div className="flex items-center justify-center h-64">
                      <LoadingSpinner />
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <CodeEditor
                        value={promptConfig}
                        onChange={setPromptConfig}
                        language="text"
                        height="400px"
                        readOnly={!isAdmin}
                        placeholder="Enter prompt configuration..."
                        error={promptError}
                      />
                      {isAdmin && (
                        <div className="flex justify-end space-x-3">
                          <Button
                            variant="outline"
                            onClick={() => {
                              const actualData = promptData?.data || promptData;
                              if (actualData && actualData[promptType]) {
                                setPromptConfig(actualData[promptType]);
                                setPromptError(null);
                              }
                            }}
                          >
                            Reset
                          </Button>
                          <Button
                            onClick={handlePromptSave}
                            loading={updatePromptMutation.isLoading}
                          >
                            Save Changes
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Schemas Tab */}
          {activeTab === 'schemas' && (
            <div className="space-y-6">
              <div className="card">
                <div className="card-header">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Schema Configuration
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-dark-400">
                    Edit JSON schemas for data validation and structure
                  </p>
                </div>
                <div className="card-body">
                  {schemaLoading ? (
                    <div className="flex items-center justify-center h-64">
                      <LoadingSpinner />
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <CodeEditor
                        value={schemaConfig}
                        onChange={setSchemaConfig}
                        language="json"
                        height="500px"
                        readOnly={!isAdmin}
                        placeholder="Enter JSON schema..."
                        error={schemaError}
                        showLineNumbers={true}
                      />
                      {isAdmin && (
                        <div className="flex justify-end space-x-3">
                          <Button
                            variant="outline"
                            onClick={() => {
                              const actualData = schemaData?.data || schemaData;
                              if (actualData) {
                                setSchemaConfig(JSON.stringify(actualData, null, 2));
                                setSchemaError(null);
                              }
                            }}
                          >
                            Reset
                          </Button>
                          <Button
                            onClick={handleSchemaSave}
                            loading={updateSchemaMutation.isLoading}
                          >
                            Save Changes
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Version History Tab */}
          {activeTab === 'history' && (
            <div className="space-y-6">
              {/* Prompt History */}
              <div className="card">
                <div className="card-header">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Prompt Version History
                  </h3>
                </div>
                <div className="card-body">
                  {promptHistory.length === 0 ? (
                    <p className="text-gray-500 dark:text-dark-400 text-center py-4">
                      No version history available
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {promptHistory.map((version, index) => (
                        <div
                          key={version.version}
                          className="flex items-center justify-between p-4 border border-gray-200 dark:border-dark-600 rounded-lg"
                        >
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              Version {version.version}
                              {index === 0 && (
                                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200">
                                  Current
                                </span>
                              )}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-dark-400">
                              {new Date(version.created_at).toLocaleString()}
                            </p>
                          </div>
                          {isAdmin && index !== 0 && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleRollback('prompt', version.version)}
                              loading={rollbackPromptMutation.isLoading}
                            >
                              Rollback
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Schema History */}
              <div className="card">
                <div className="card-header">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Schema Version History
                  </h3>
                </div>
                <div className="card-body">
                  {schemaHistory.length === 0 ? (
                    <p className="text-gray-500 dark:text-dark-400 text-center py-4">
                      No version history available
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {schemaHistory.map((version, index) => (
                        <div
                          key={version.version}
                          className="flex items-center justify-between p-4 border border-gray-200 dark:border-dark-600 rounded-lg"
                        >
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              Version {version.version}
                              {index === 0 && (
                                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200">
                                  Current
                                </span>
                              )}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-dark-400">
                              {new Date(version.created_at).toLocaleString()}
                            </p>
                          </div>
                          {isAdmin && index !== 0 && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleRollback('schema', version.version)}
                              loading={rollbackSchemaMutation.isLoading}
                            >
                              Rollback
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Global Config Tab */}
          {activeTab === 'global' && (
            <div className="space-y-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-4">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Global configuration is managed through the Settings page. 
                  <a href="/settings" className="font-medium underline ml-1">Go to Settings</a>
                </p>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}