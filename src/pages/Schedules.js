import React, { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ClockIcon,
  CalendarIcon,
  TvIcon,
  PlayIcon,
  StopIcon,
  ArrowPathIcon,
  DocumentArrowUpIcon,
  DocumentArrowDownIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

import { apiService, showSuccessToast, showErrorToast, wsService } from '../services/api';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../components/ui/Card';
import Container from '../components/ui/Container';
import PageHeader from '../components/ui/PageHeader';

const defaultSchedule = {
  id: '',
  name: '',
  sport: 'soccer',
  league: '',
  poster_image_url: '',
  description: '',
  channel_config: {
    name: '',
    source_id: 'f358894ea0dd4d219a33dab68060ff64',
    template_id: '795ee85334a342cbb4691d4bf961857d',
    timeshift_duration: 24,
  },
  schedule: {
    timezone: 'UTC',
    events: [
      {
        type: 'create_and_start',
        at: new Date(new Date().getTime() + 10 * 60 * 1000).toISOString(), // 10 minutes from now
        description: 'Start broadcast',
      },
      {
        type: 'stop_and_delete',
        at: new Date(new Date().getTime() + 70 * 60 * 1000).toISOString(), // 70 minutes from now
        description: 'Stop broadcast',
      },
    ],
  },
  pipeline_config: {
    segment_duration: 120,
    segments_per_batch: 1,
    quiet_mode: false,
    auto_start_pipeline: true,
    content_generation: {
      enabled: false,
      teams: {
        home: '',
        away: '',
      },
      enable_editorials: true,
      enable_social_media: true,
      contextual_analysis: true,
      player_spotlights: true,
      editorial_frequency: 3,
      social_frequency: 1,
      editorial_style: 'professional',
      social_platforms: ['twitter', 'instagram', 'facebook'],
      social_tone: 'exciting',
    },
  },
  webhook_config: {
    enabled: true,
    webhooks: [],
  },
};


export default function Schedules() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [formData, setFormData] = useState(defaultSchedule);
  const [lastReloadTime, setLastReloadTime] = useState(null);
  const [pollingEnabled] = useState(true);
  const fileInputRef = useRef(null);

  const queryClient = useQueryClient();

  // Fetch schedules
  const { data: schedulesData, isLoading } = useQuery({
    queryKey: ['schedules'],
    queryFn: () => apiService.getSchedules(),
    refetchInterval: 30000,
  });

  // Fetch system status for active channels
  const { data: status } = useQuery({
    queryKey: ['systemStatus'],
    queryFn: () => apiService.getStatus(),
    refetchInterval: 30000,
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: (scheduleData) => apiService.createSchedule(scheduleData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedules'] });
      showSuccessToast('Schedule created successfully');
      setIsModalOpen(false);
      setFormData(defaultSchedule);
    },
    onError: (error) => {
      showErrorToast(error.response?.data?.detail || 'Failed to create schedule');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ scheduleId, scheduleData }) => apiService.updateSchedule(scheduleId, scheduleData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedules'] });
      showSuccessToast('Schedule updated successfully');
      setIsModalOpen(false);
      setEditingSchedule(null);
      setFormData(defaultSchedule);
    },
    onError: (error) => {
      showErrorToast(error.response?.data?.detail || 'Failed to update schedule');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (scheduleId) => apiService.deleteSchedule(scheduleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedules'] });
      showSuccessToast('Schedule deleted successfully');
    },
    onError: (error) => {
      showErrorToast(error.response?.data?.detail || 'Failed to delete schedule');
    },
  });

  const manualControlMutation = useMutation({
    mutationFn: ({ scheduleId, action }) => apiService.manualChannelControl(scheduleId, action),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['systemStatus'] });
      showSuccessToast(data.message);
    },
    onError: (error) => {
      showErrorToast(error.response?.data?.detail || 'Failed to control channel');
    },
  });

  const reloadSchedulesMutation = useMutation({
    mutationFn: () => apiService.reloadSchedules(),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['schedules'] });
      setLastReloadTime(new Date());
      showSuccessToast(data.message || 'Schedules reloaded successfully');
    },
    onError: (error) => {
      showErrorToast(error.response?.data?.detail || 'Failed to reload schedules');
    },
  });

  const uploadScheduleMutation = useMutation({
    mutationFn: (file) => apiService.uploadScheduleFile(file),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['schedules'] });
      showSuccessToast(data.message || 'Schedule file uploaded successfully');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    },
    onError: (error) => {
      showErrorToast(error.response?.data?.detail || 'Failed to upload schedule file');
    },
  });

  const downloadScheduleMutation = useMutation({
    mutationFn: () => apiService.downloadScheduleFile(),
    onSuccess: (blob) => {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'channel_schedule.json';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      showSuccessToast('Schedule file downloaded successfully');
    },
    onError: (error) => {
      showErrorToast('Failed to download schedule file');
    },
  });

  const schedules = schedulesData?.schedules || [];
  const activeChannels = status?.orchestrator_status?.active_channels || {};

  // WebSocket listeners for real-time updates
  useEffect(() => {
    const handleScheduleReloaded = (data) => {
      queryClient.invalidateQueries({ queryKey: ['schedules'] });
      setLastReloadTime(new Date());
      showSuccessToast('Schedules automatically reloaded');
    };

    wsService.on('scheduleReloaded', handleScheduleReloaded);
    return () => wsService.off('scheduleReloaded', handleScheduleReloaded);
  }, [queryClient]);

  const handleCreate = () => {
    setEditingSchedule(null);
    setFormData(defaultSchedule);
    setIsModalOpen(true);
  };

  const handleEdit = (schedule) => {
    setEditingSchedule(schedule);
    setFormData(schedule);
    setIsModalOpen(true);
  };

  const handleDelete = (scheduleId) => {
    if (window.confirm('Are you sure you want to delete this schedule?')) {
      deleteMutation.mutate(scheduleId);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingSchedule) {
      updateMutation.mutate({ scheduleId: editingSchedule.id, scheduleData: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleManualControl = (scheduleId, action) => {
    manualControlMutation.mutate({ scheduleId, action });
  };

  const handleReloadSchedules = () => {
    reloadSchedulesMutation.mutate();
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.type !== 'application/json') {
        showErrorToast('Please select a JSON file');
        return;
      }
      uploadScheduleMutation.mutate(file);
    }
  };

  const handleDownloadSchedules = () => {
    downloadScheduleMutation.mutate();
  };

  const updateFormData = (path, value) => {
    setFormData(prev => {
      const newData = { ...prev };
      const keys = path.split('.');
      let current = newData;
      
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      return newData;
    });
  };

  const addEvent = () => {
    const nextHour = new Date(new Date().getTime() + 60 * 60 * 1000).toISOString();
    setFormData(prev => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        events: [
          ...prev.schedule.events,
          {
            type: 'create_and_start',
            at: nextHour,
            description: 'New event',
          },
        ],
      },
    }));
  };

  const updateEvent = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        events: prev.schedule.events.map((event, i) =>
          i === index ? { ...event, [field]: value } : event
        ),
      },
    }));
  };

  const removeEvent = (index) => {
    setFormData(prev => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        events: prev.schedule.events.filter((_, i) => i !== index),
      },
    }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <Container className="space-y-6">
      {/* Hidden file input for Upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Page header with actions on the right */}
      <PageHeader
        title="Schedules"
        description="Manage channel schedules and automation rules"
        actions={(
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="md"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadScheduleMutation.isLoading}
              leftIcon={<DocumentArrowUpIcon className="h-4 w-4" />}
              title="Upload schedule file"
            >
              Upload
            </Button>
            <Button
              variant="outline"
              size="md"
              onClick={handleDownloadSchedules}
              disabled={downloadScheduleMutation.isLoading}
              leftIcon={<DocumentArrowDownIcon className="h-4 w-4" />}
              title="Download schedule file"
            >
              Download
            </Button>
            <Button
              variant="outline"
              size="md"
              onClick={handleReloadSchedules}
              disabled={reloadSchedulesMutation.isLoading}
              leftIcon={<ArrowPathIcon className={`h-4 w-4 ${reloadSchedulesMutation.isLoading ? 'animate-spin' : ''}`} />}
              title="Reload schedules from file"
            >
              Reload
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={handleCreate}
              leftIcon={<PlusIcon className="h-4 w-4" />}
            >
              Create Schedule
            </Button>
          </div>
        )}
      />

      {/* Polling status row */}
      <div className="mt-1 flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 dark:text-slate-400">Auto-reload:</span>
          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
            pollingEnabled
              ? 'bg-success-100 dark:bg-success-900 text-success-800 dark:text-success-200'
              : 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200'
          }`}>
            {pollingEnabled ? 'Enabled' : 'Disabled'}
          </span>
        </div>
        {lastReloadTime && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 dark:text-slate-400">Last reload:</span>
            <span className="text-xs text-slate-700 dark:text-slate-300">
              {lastReloadTime.toLocaleTimeString()}
            </span>
          </div>
        )}
      </div>

      {/* Schedules list */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {schedules.length === 0 ? (
          <div className="col-span-2 text-center py-12">
            <CalendarIcon className="mx-auto h-12 w-12 text-gray-400 dark:text-dark-500" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No schedules</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-dark-400">
              Get started by creating a new schedule.
            </p>
            <div className="mt-6">
              <Button variant="primary" onClick={handleCreate} leftIcon={<PlusIcon className="h-4 w-4" />}>Create Schedule</Button>
            </div>
          </div>
        ) : (
          schedules.map((schedule) => {
            const isActive = activeChannels[schedule.id];
            return (
              <Card key={schedule.id}>
                <CardHeader divided actions={(
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(schedule)}
                      leftIcon={<PencilIcon className="h-4 w-4" />}
                      aria-label="Edit schedule"
                      title="Edit schedule"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(schedule.id)}
                      leftIcon={<TrashIcon className="h-4 w-4" />}
                      aria-label="Delete schedule"
                      title="Delete schedule"
                    />
                  </div>
                )}>
                  <div className="flex items-center gap-2">
                    <TvIcon className="h-5 w-5 text-slate-500 dark:text-slate-400" />
                    <CardTitle level={3}>{schedule.name}</CardTitle>
                    {isActive && (
                      <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-success-100 dark:bg-success-900 text-success-800 dark:text-success-200">Active</span>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">{schedule.description}</p>

                  {/* Match info */}
                  {(schedule.sport || schedule.league) && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-slate-900 dark:text-slate-100 mb-2">Match Details</h4>
                      <div className="flex flex-wrap gap-2 text-sm">
                        {schedule.sport && (
                          <span className="inline-flex items-center px-2 py-1 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 capitalize">
                            {schedule.sport}
                          </span>
                        )}
                        {schedule.league && (
                          <span className="inline-flex items-center px-2 py-1 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                            {schedule.league}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Channel info */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-slate-900 dark:text-slate-100 mb-2">Channel</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{schedule.channel_config.name}</p>
                  </div>

                  {/* Schedule events */}
                  <div className="mb-2">
                    <h4 className="text-sm font-medium text-slate-900 dark:text-slate-100 mb-2">Events</h4>
                    <div className="space-y-2">
                      {schedule.schedule.events.map((event, index) => (
                        <div key={index} className="flex items-center text-sm">
                          <ClockIcon className="h-4 w-4 text-slate-400 dark:text-slate-500 mr-2" />
                          <span className="text-slate-600 dark:text-slate-400">
                            {event.type === 'create_and_start' ? 'Start' : 'Stop'} at{' '}
                            {event.at ? new Date(event.at).toLocaleString() : 
                             `${event.time} on ${event.days?.join(', ')}`}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
                <CardFooter divided justify="end">
                  {isActive ? (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleManualControl(schedule.id, 'stop')}
                      disabled={manualControlMutation.isLoading}
                      leftIcon={<StopIcon className="h-4 w-4" />}
                    >
                      Stop
                    </Button>
                  ) : (
                    <Button
                      variant="success"
                      size="sm"
                      onClick={() => handleManualControl(schedule.id, 'start')}
                      disabled={manualControlMutation.isLoading}
                      leftIcon={<PlayIcon className="h-4 w-4" />}
                    >
                      Start
                    </Button>
                  )}
                </CardFooter>
              </Card>
            );
          })
        )}
      </div>

      {/* Create/Edit Modal */}
      <Transition.Root show={isModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={setIsModalOpen}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-slate-900/50 dark:bg-slate-950/70 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative w-full transform overflow-hidden rounded-lg bg-slate-50 dark:bg-slate-900 border border-stone-200 dark:border-stone-600 text-left shadow-elevated transition-all sm:my-8 sm:w-full sm:max-w-2xl">
                  <form onSubmit={handleSubmit}>
                    {/* Header */}
                    <div className="px-6 py-4 border-b border-stone-200 dark:border-stone-600 bg-slate-50/50 dark:bg-slate-800/50 backdrop-blur-sm flex items-start justify-between">
                      <Dialog.Title as="h3" className="text-lg font-heading tracking-tight text-slate-900 dark:text-slate-100">
                        {editingSchedule ? 'Edit Schedule' : 'Create Schedule'}
                      </Dialog.Title>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsModalOpen(false)}
                        aria-label="Close"
                        title="Close"
                        className="-mr-2"
                        leftIcon={<XMarkIcon className="h-4 w-4" />}
                      />
                    </div>

                    {/* Content */}
                    <div className="px-6 py-5 space-y-6">

                      {/* Basic info */}
                      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <div>
                          <label className="form-label">
                            Schedule ID
                          </label>
                          <input
                            type="text"
                            value={formData.id}
                            onChange={(e) => updateFormData('id', e.target.value)}
                            className="form-input"
                            required
                            disabled={editingSchedule}
                          />
                        </div>
                        <div>
                          <label className="form-label">
                            Name
                          </label>
                          <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => updateFormData('name', e.target.value)}
                            className="form-input"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                        <div>
                          <label className="form-label">
                            Sport
                          </label>
                          <select
                            value={formData.sport || 'soccer'}
                            onChange={(e) => updateFormData('sport', e.target.value)}
                            className="form-select"
                          >
                            <option value="soccer">Soccer</option>
                            <option value="football">Football</option>
                            <option value="basketball">Basketball</option>
                            <option value="baseball">Baseball</option>
                            <option value="tennis">Tennis</option>
                            <option value="hockey">Hockey</option>
                          </select>
                        </div>
                        <div>
                          <label className="form-label">
                            League
                          </label>
                          <input
                            type="text"
                            value={formData.league || ''}
                            onChange={(e) => updateFormData('league', e.target.value)}
                            className="form-input"
                            placeholder="e.g., LA Liga, Premier League"
                          />
                        </div>
                        <div>
                          <label className="form-label">
                            Poster Image URL
                          </label>
                          <input
                            type="url"
                            value={formData.poster_image_url || ''}
                            onChange={(e) => updateFormData('poster_image_url', e.target.value)}
                            className="form-input"
                            placeholder="https://..."
                          />
                        </div>
                      </div>

                      <div>
                        <label className="form-label">
                          Description
                        </label>
                        <textarea
                          value={formData.description}
                          onChange={(e) => updateFormData('description', e.target.value)}
                          rows={2}
                          className="form-textarea"
                        />
                      </div>

                      {/* Channel config */}
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-4">Channel Configuration</h4>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <div>
                            <label className="form-label">
                              Channel Name
                            </label>
                            <input
                              type="text"
                              value={formData.channel_config.name}
                              onChange={(e) => updateFormData('channel_config.name', e.target.value)}
                              className="form-input"
                              required
                            />
                          </div>
                          <div>
                            <label className="form-label">
                              Timeshift Duration (hours)
                            </label>
                            <input
                              type="number"
                              value={formData.channel_config.timeshift_duration}
                              onChange={(e) => updateFormData('channel_config.timeshift_duration', parseInt(e.target.value))}
                              className="form-input"
                              min="1"
                              max="168"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Pipeline config */}
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-4">Pipeline Configuration</h4>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                          <div>
                            <label className="form-label">
                              Segment Duration (seconds)
                            </label>
                            <input
                              type="number"
                              value={formData.pipeline_config.segment_duration}
                              onChange={(e) => updateFormData('pipeline_config.segment_duration', parseInt(e.target.value))}
                              className="form-input"
                              min="30"
                              max="300"
                            />
                          </div>
                          <div>
                            <label className="form-label">
                              Segments per Batch
                            </label>
                            <input
                              type="number"
                              value={formData.pipeline_config.segments_per_batch}
                              onChange={(e) => updateFormData('pipeline_config.segments_per_batch', parseInt(e.target.value))}
                              className="form-input"
                              min="1"
                              max="5"
                            />
                          </div>
                          <div className="flex items-center pt-6">
                            <input
                              type="checkbox"
                              checked={formData.pipeline_config.auto_start_pipeline}
                              onChange={(e) => updateFormData('pipeline_config.auto_start_pipeline', e.target.checked)}
                              className="form-checkbox"
                            />
                            <label className="ml-2 block text-sm text-gray-900 dark:text-white">
                              Auto-start pipeline
                            </label>
                          </div>
                        </div>
                      </div>

                      {/* Content Generation Configuration */}
                      <div>
                        <div className="flex items-center mb-4">
                          <input
                            type="checkbox"
                            checked={formData.pipeline_config.content_generation?.enabled || false}
                            onChange={(e) => updateFormData('pipeline_config.content_generation.enabled', e.target.checked)}
                            className="form-checkbox"
                          />
                          <label className="ml-2 block text-sm font-medium text-gray-900 dark:text-white">
                            Enable Content Generation
                          </label>
                        </div>
                        
                        {formData.pipeline_config.content_generation?.enabled && (
                          <div className="space-y-4 pl-6 border-l-2 border-primary-200 dark:border-primary-700">
                            {/* Teams */}
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                              <div>
                                <label className="form-label">
                                  Home Team
                                </label>
                                <input
                                  type="text"
                                  value={formData.pipeline_config.content_generation?.teams?.home || ''}
                                  onChange={(e) => updateFormData('pipeline_config.content_generation.teams.home', e.target.value)}
                                  className="form-input"
                                  placeholder="e.g., FC Barcelona"
                                />
                              </div>
                              <div>
                                <label className="form-label">
                                  Away Team
                                </label>
                                <input
                                  type="text"
                                  value={formData.pipeline_config.content_generation?.teams?.away || ''}
                                  onChange={(e) => updateFormData('pipeline_config.content_generation.teams.away', e.target.value)}
                                  className="form-input"
                                  placeholder="e.g., Real Madrid"
                                />
                              </div>
                            </div>

                            {/* Content Type Toggles */}
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                              <div className="flex items-center">
                                <input
                                  type="checkbox"
                                  checked={formData.pipeline_config.content_generation?.enable_editorials || false}
                                  onChange={(e) => updateFormData('pipeline_config.content_generation.enable_editorials', e.target.checked)}
                                  className="form-checkbox"
                                />
                                <label className="ml-2 block text-sm text-gray-900 dark:text-white">
                                  Enable Editorials
                                </label>
                              </div>
                              <div className="flex items-center">
                                <input
                                  type="checkbox"
                                  checked={formData.pipeline_config.content_generation?.enable_social_media || false}
                                  onChange={(e) => updateFormData('pipeline_config.content_generation.enable_social_media', e.target.checked)}
                                  className="form-checkbox"
                                />
                                <label className="ml-2 block text-sm text-gray-900 dark:text-white">
                                  Enable Social Media
                                </label>
                              </div>
                              <div className="flex items-center">
                                <input
                                  type="checkbox"
                                  checked={formData.pipeline_config.content_generation?.contextual_analysis || false}
                                  onChange={(e) => updateFormData('pipeline_config.content_generation.contextual_analysis', e.target.checked)}
                                  className="form-checkbox"
                                />
                                <label className="ml-2 block text-sm text-gray-900 dark:text-white">
                                  Contextual Analysis
                                </label>
                              </div>
                              <div className="flex items-center">
                                <input
                                  type="checkbox"
                                  checked={formData.pipeline_config.content_generation?.player_spotlights || false}
                                  onChange={(e) => updateFormData('pipeline_config.content_generation.player_spotlights', e.target.checked)}
                                  className="form-checkbox"
                                />
                                <label className="ml-2 block text-sm text-gray-900 dark:text-white">
                                  Player Spotlights
                                </label>
                              </div>
                            </div>

                            {/* Frequency Settings */}
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                              <div>
                                <label className="form-label">
                                  Editorial Frequency (every N highlights)
                                </label>
                                <input
                                  type="number"
                                  value={formData.pipeline_config.content_generation?.editorial_frequency || 3}
                                  onChange={(e) => updateFormData('pipeline_config.content_generation.editorial_frequency', parseInt(e.target.value))}
                                  className="form-input"
                                  min="1"
                                  max="10"
                                />
                              </div>
                              <div>
                                <label className="form-label">
                                  Social Media Frequency (every N highlights)
                                </label>
                                <input
                                  type="number"
                                  value={formData.pipeline_config.content_generation?.social_frequency || 1}
                                  onChange={(e) => updateFormData('pipeline_config.content_generation.social_frequency', parseInt(e.target.value))}
                                  className="form-input"
                                  min="1"
                                  max="5"
                                />
                              </div>
                            </div>

                            {/* Style Settings */}
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                              <div>
                                <label className="form-label">
                                  Editorial Style
                                </label>
                                <select
                                  value={formData.pipeline_config.content_generation?.editorial_style || 'professional'}
                                  onChange={(e) => updateFormData('pipeline_config.content_generation.editorial_style', e.target.value)}
                                  className="form-select"
                                >
                                  <option value="professional">Professional</option>
                                  <option value="casual">Casual</option>
                                  <option value="analytical">Analytical</option>
                                  <option value="dramatic">Dramatic</option>
                                </select>
                              </div>
                              <div>
                                <label className="form-label">
                                  Social Media Tone
                                </label>
                                <select
                                  value={formData.pipeline_config.content_generation?.social_tone || 'exciting'}
                                  onChange={(e) => updateFormData('pipeline_config.content_generation.social_tone', e.target.value)}
                                  className="form-select"
                                >
                                  <option value="exciting">Exciting</option>
                                  <option value="dramatic">Dramatic</option>
                                  <option value="neutral">Neutral</option>
                                  <option value="humorous">Humorous</option>
                                </select>
                              </div>
                            </div>

                            {/* Social Platforms */}
                            <div>
                              <label className="form-label mb-2">
                                Social Media Platforms
                              </label>
                              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                                {['twitter', 'instagram', 'facebook', 'linkedin'].map(platform => (
                                  <div key={platform} className="flex items-center">
                                    <input
                                      type="checkbox"
                                      checked={(formData.pipeline_config.content_generation?.social_platforms || []).includes(platform)}
                                      onChange={(e) => {
                                        const platforms = formData.pipeline_config.content_generation?.social_platforms || [];
                                        const newPlatforms = e.target.checked 
                                          ? [...platforms, platform]
                                          : platforms.filter(p => p !== platform);
                                        updateFormData('pipeline_config.content_generation.social_platforms', newPlatforms);
                                      }}
                                      className="form-checkbox"
                                    />
                                    <label className="ml-2 block text-sm text-gray-900 dark:text-white capitalize">
                                      {platform}
                                    </label>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Schedule events */}
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white">Schedule Events</h4>
                          <Button type="button" size="sm" variant="secondary" onClick={addEvent} leftIcon={<PlusIcon className="h-3 w-3" />}>Add Event</Button>
                        </div>
                        <div className="space-y-4">
                          {formData.schedule.events.map((event, index) => (
                            <div key={index} className="border border-stone-200 dark:border-stone-600 bg-white dark:bg-slate-800 rounded-lg p-4">
                              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                                <div>
                                  <label className="form-label">
                                    Type
                                  </label>
                                  <select
                                    value={event.type}
                                    onChange={(e) => updateEvent(index, 'type', e.target.value)}
                                    className="form-select"
                                  >
                                    <option value="create_and_start">Create and Start</option>
                                    <option value="stop_and_delete">Stop and Delete</option>
                                  </select>
                                </div>
                                <div>
                                  <label className="form-label">
                                    Date and Time
                                  </label>
                                  <input
                                    type="datetime-local"
                                    value={event.at ? new Date(event.at).toISOString().slice(0, 16) : ''}
                                    onChange={(e) => {
                                      const isoString = e.target.value ? new Date(e.target.value).toISOString() : '';
                                      updateEvent(index, 'at', isoString);
                                    }}
                                    className="form-input"
                                  />
                                </div>
                                <div className="flex items-end">
                                  <Button type="button" size="sm" variant="destructive" onClick={() => removeEvent(index)} leftIcon={<TrashIcon className="h-3 w-3" />}>
                                    Remove
                                  </Button>
                                </div>
                              </div>
                              <div className="mt-4">
                                <label className="form-label">
                                  Description
                                </label>
                                <input
                                  type="text"
                                  value={event.description}
                                  onChange={(e) => updateEvent(index, 'description', e.target.value)}
                                  className="form-input"
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="px-6 py-4 border-t border-stone-200 dark:border-stone-600 bg-slate-50/30 dark:bg-slate-800/30 flex items-center justify-end gap-3">
                      <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" variant="primary" disabled={createMutation.isLoading || updateMutation.isLoading}>
                        {(createMutation.isLoading || updateMutation.isLoading) ? 'Saving...' : 'Save'}
                      </Button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
  </Container>
  );
}