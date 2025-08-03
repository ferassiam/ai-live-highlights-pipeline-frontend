import React, { useState } from 'react';
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
} from '@heroicons/react/24/outline';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

import { apiService, showSuccessToast, showErrorToast } from '../services/api';

const defaultSchedule = {
  id: '',
  name: '',
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
        time: '14:00',
        days: ['monday'],
        description: 'Start channel',
      },
      {
        type: 'stop_and_delete',
        time: '15:00',
        days: ['monday'],
        description: 'Stop channel',
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
      editorial_frequency: 3,
      social_frequency: 1,
      editorial_style: 'professional',
      social_platforms: ['twitter', 'instagram', 'facebook'],
      social_tone: 'exciting',
    },
  },
};

const weekDays = [
  'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'
];

export default function Schedules() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [formData, setFormData] = useState(defaultSchedule);

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

  const schedules = schedulesData?.schedules || [];
  const activeChannels = status?.orchestrator_status?.active_channels || {};

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
    setFormData(prev => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        events: [
          ...prev.schedule.events,
          {
            type: 'create_and_start',
            time: '14:00',
            days: ['monday'],
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
    <div className="space-y-6">
      {/* Page header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            Schedules
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-dark-400">
            Manage channel schedules and automation rules
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            type="button"
            onClick={handleCreate}
            className="btn btn-primary flex items-center space-x-2"
          >
            <PlusIcon className="h-4 w-4" />
            <span>Create Schedule</span>
          </button>
        </div>
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
              <button
                type="button"
                onClick={handleCreate}
                className="btn btn-primary flex items-center space-x-2"
              >
                <PlusIcon className="h-4 w-4" />
                <span>Create Schedule</span>
              </button>
            </div>
          </div>
        ) : (
          schedules.map((schedule) => {
            const isActive = activeChannels[schedule.id];
            return (
              <div key={schedule.id} className="card">
                <div className="card-header">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <TvIcon className="h-5 w-5 text-gray-400 dark:text-dark-500 mr-2" />
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">{schedule.name}</h3>
                      {isActive && (
                        <span className="ml-2 status-running">Active</span>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(schedule)}
                        className="text-gray-400 dark:text-dark-500 hover:text-gray-500 dark:hover:text-dark-300 transition-colors duration-200"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(schedule.id)}
                        className="text-gray-400 dark:text-dark-500 hover:text-danger-500 dark:hover:text-danger-400 transition-colors duration-200"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="card-body">
                  <p className="text-sm text-gray-600 dark:text-dark-400 mb-4">{schedule.description}</p>
                  
                  {/* Channel info */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Channel</h4>
                    <p className="text-sm text-gray-600 dark:text-dark-400">{schedule.channel_config.name}</p>
                  </div>

                  {/* Schedule events */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Events</h4>
                    <div className="space-y-2">
                      {schedule.schedule.events.map((event, index) => (
                        <div key={index} className="flex items-center text-sm">
                          <ClockIcon className="h-4 w-4 text-gray-400 dark:text-dark-500 mr-2" />
                          <span className="text-gray-600 dark:text-dark-400">
                            {event.type === 'create_and_start' ? 'Start' : 'Stop'} at {event.time} on{' '}
                            {event.days.join(', ')}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Manual controls */}
                  <div className="flex space-x-2">
                    {isActive ? (
                      <button
                        onClick={() => handleManualControl(schedule.id, 'stop')}
                        disabled={manualControlMutation.isLoading}
                        className="btn btn-danger btn-sm flex items-center space-x-1"
                      >
                        <StopIcon className="h-3 w-3" />
                        <span>Stop</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleManualControl(schedule.id, 'start')}
                        disabled={manualControlMutation.isLoading}
                        className="btn btn-success btn-sm flex items-center space-x-1"
                      >
                        <PlayIcon className="h-3 w-3" />
                        <span>Start</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
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
            <div className="modal-overlay" />
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
                <Dialog.Panel className="modal-content sm:max-w-2xl">
                  <form onSubmit={handleSubmit}>
                    <div className="space-y-6">
                      <div>
                        <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
                          {editingSchedule ? 'Edit Schedule' : 'Create Schedule'}
                        </Dialog.Title>
                      </div>

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
                          <button
                            type="button"
                            onClick={addEvent}
                            className="btn btn-sm btn-secondary flex items-center space-x-1"
                          >
                            <PlusIcon className="h-3 w-3" />
                            <span>Add Event</span>
                          </button>
                        </div>
                        <div className="space-y-4">
                          {formData.schedule.events.map((event, index) => (
                            <div key={index} className="border border-gray-200 dark:border-dark-600 bg-white dark:bg-dark-800 rounded-lg p-4">
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
                                    Time
                                  </label>
                                  <input
                                    type="time"
                                    value={event.time}
                                    onChange={(e) => updateEvent(index, 'time', e.target.value)}
                                    className="form-input"
                                  />
                                </div>
                                <div className="flex items-end">
                                  <button
                                    type="button"
                                    onClick={() => removeEvent(index)}
                                    className="btn btn-sm btn-danger flex items-center"
                                  >
                                    <TrashIcon className="h-3 w-3" />
                                  </button>
                                </div>
                              </div>
                              <div className="mt-4">
                                <label className="form-label mb-2">
                                  Days
                                </label>
                                <div className="flex flex-wrap gap-2">
                                  {weekDays.map((day) => (
                                    <label key={day} className="flex items-center">
                                      <input
                                        type="checkbox"
                                        checked={event.days.includes(day)}
                                        onChange={(e) => {
                                          const newDays = e.target.checked
                                            ? [...event.days, day]
                                            : event.days.filter(d => d !== day);
                                          updateEvent(index, 'days', newDays);
                                        }}
                                        className="form-checkbox"
                                      />
                                      <span className="ml-2 text-sm text-gray-700 dark:text-dark-300 capitalize">
                                        {day.slice(0, 3)}
                                      </span>
                                    </label>
                                  ))}
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

                    <div className="mt-6 flex items-center justify-end space-x-3">
                      <button
                        type="button"
                        onClick={() => setIsModalOpen(false)}
                        className="btn btn-secondary"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={createMutation.isLoading || updateMutation.isLoading}
                        className="btn btn-primary"
                      >
                        {(createMutation.isLoading || updateMutation.isLoading) ? 'Saving...' : 'Save'}
                      </button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  );
}