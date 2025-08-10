import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PencilSquareIcon,
  PlayIcon,
  StopIcon,
  SparklesIcon,
  UserGroupIcon,
  DocumentTextIcon,
  ShareIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

import { apiService, showSuccessToast, showErrorToast, wsService } from '../services/api';
import { TabNavigation } from '../components/ui/TabNavigation';
import { MetricsCard } from '../components/ui/MetricsCard';
import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/Select';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { cn } from '../utils/cn';

export default function ContentGeneration() {
  const [activeTab, setActiveTab] = useState('matches');
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [isInitializing, setIsInitializing] = useState(false);
  const [matchForm, setMatchForm] = useState({
    matchId: '',
    homeTeam: '',
    awayTeam: '',
    enableEditorials: true,
    enableSocialMedia: true,
    editorialFrequency: 3,
    socialFrequency: 1,
    editorialStyle: 'professional',
    socialTone: 'exciting',
    socialPlatforms: ['twitter', 'instagram']
  });

  const queryClient = useQueryClient();

  // Fetch active content matches
  const { data: activeMatches = [], isLoading: matchesLoading, error: matchesError } = useQuery({
    queryKey: ['activeContentMatches'],
    queryFn: () => apiService.getActiveContentMatches(),
    refetchInterval: 30000,
    retry: false,
  });

  // Fetch content items (generated content)
  const { data: contentItems = [], isLoading: contentLoading, error: contentError } = useQuery({
    queryKey: ['contentItems'],
    queryFn: () => apiService.getContentItems(),
    refetchInterval: 30000,
    retry: false,
  });

  // Fetch content progress for selected match
  const { data: contentProgress } = useQuery({
    queryKey: ['contentProgress', selectedMatch],
    queryFn: () => selectedMatch ? apiService.getContentProgress(selectedMatch) : null,
    enabled: !!selectedMatch,
    refetchInterval: 15000,
  });

  // Initialize content generation mutation
  const initializeContentMutation = useMutation({
    mutationFn: (data) => apiService.initializeContentGeneration(
      data.matchId,
      data.homeTeam,
      data.awayTeam,
      {
        enable_editorials: data.enableEditorials,
        enable_social_media: data.enableSocialMedia,
        editorial_frequency: data.editorialFrequency,
        social_frequency: data.socialFrequency,
        editorial_style: data.editorialStyle,
        social_tone: data.socialTone,
        social_platforms: data.socialPlatforms
      }
    ),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['activeContentMatches'] });
      showSuccessToast(data.message || 'Content generation initialized successfully');
      setIsInitializing(false);
      setSelectedMatch(matchForm.matchId);
      // Reset form
      setMatchForm({
        matchId: '',
        homeTeam: '',
        awayTeam: '',
        enableEditorials: true,
        enableSocialMedia: true,
        editorialFrequency: 3,
        socialFrequency: 1,
        editorialStyle: 'professional',
        socialTone: 'exciting',
        socialPlatforms: ['twitter', 'instagram']
      });
    },
    onError: (error) => {
      showErrorToast(error.response?.data?.detail || 'Failed to initialize content generation');
      setIsInitializing(false);
    },
  });

  // Start content generation mutation
  const startContentMutation = useMutation({
    mutationFn: (matchId) => apiService.startContentGeneration(matchId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['activeContentMatches'] });
      queryClient.invalidateQueries({ queryKey: ['contentProgress'] });
      showSuccessToast(data.message || 'Content generation started successfully');
    },
    onError: (error) => {
      showErrorToast(error.response?.data?.detail || 'Failed to start content generation');
    },
  });

  // End content generation mutation
  const endContentMutation = useMutation({
    mutationFn: (matchId) => apiService.endContentGeneration(matchId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['activeContentMatches'] });
      queryClient.invalidateQueries({ queryKey: ['contentProgress'] });
      showSuccessToast(data.message || 'Content generation ended successfully');
      if (selectedMatch === matchId) {
        setSelectedMatch(null);
      }
    },
    onError: (error) => {
      showErrorToast(error.response?.data?.detail || 'Failed to end content generation');
    },
  });

  // Post to social media mutation
  const postToSocialMutation = useMutation({
    mutationFn: ({ platform, contentId, message }) => 
      apiService.postToSocialMedia(platform, contentId, message),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['contentItems'] });
      showSuccessToast(data.message || 'Posted to social media successfully');
    },
    onError: (error) => {
      showErrorToast(error.response?.data?.detail || 'Failed to post to social media');
    },
  });

  // WebSocket listeners for real-time updates
  useEffect(() => {
    const handleContentUpdate = (data) => {
      queryClient.invalidateQueries({ queryKey: ['activeContentMatches'] });
      queryClient.invalidateQueries({ queryKey: ['contentItems'] });
      queryClient.invalidateQueries({ queryKey: ['contentProgress'] });
      
      if (data.message) {
        showSuccessToast(data.message);
      }
    };

    wsService.on('contentUpdate', handleContentUpdate);
    return () => wsService.off('contentUpdate', handleContentUpdate);
  }, [queryClient]);

  const tabs = [
    { id: 'matches', name: 'Active Matches', icon: UserGroupIcon },
    { id: 'content', name: 'Generated Content', icon: DocumentTextIcon },
    { id: 'initialize', name: 'Initialize Match', icon: PlayIcon },
  ];

  const editorialStyles = [
    { value: 'professional', label: 'Professional' },
    { value: 'casual', label: 'Casual' },
    { value: 'analytical', label: 'Analytical' },
    { value: 'dramatic', label: 'Dramatic' }
  ];

  const socialTones = [
    { value: 'exciting', label: 'Exciting' },
    { value: 'dramatic', label: 'Dramatic' },
    { value: 'neutral', label: 'Neutral' },
    { value: 'humorous', label: 'Humorous' }
  ];

  const socialPlatforms = [
    { value: 'twitter', label: 'Twitter' },
    { value: 'instagram', label: 'Instagram' },
    { value: 'facebook', label: 'Facebook' },
    { value: 'linkedin', label: 'LinkedIn' }
  ];

  const handleInitialize = (e) => {
    e.preventDefault();
    if (!matchForm.matchId || !matchForm.homeTeam || !matchForm.awayTeam) {
      showErrorToast('Please fill in all required fields');
      return;
    }
    setIsInitializing(true);
    initializeContentMutation.mutate(matchForm);
  };

  const handlePostToSocial = (platform, contentId, message = null) => {
    postToSocialMutation.mutate({ platform, contentId, message });
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const getMatchStatus = (match) => {
    if (match.status === 'active') return 'success';
    if (match.status === 'ended') return 'gray';
    if (match.status === 'error') return 'danger';
    return 'warning';
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="page-header">
        <div>
          <h1 className="page-title flex items-center">
            <PencilSquareIcon className="h-8 w-8 mr-3" />
            Content Generation
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-dark-400">
            Manage AI-powered content generation for live matches
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            onClick={() => {
              queryClient.invalidateQueries({ queryKey: ['activeContentMatches'] });
              queryClient.invalidateQueries({ queryKey: ['contentItems'] });
              queryClient.invalidateQueries({ queryKey: ['contentProgress'] });
            }}
          >
            <ArrowPathIcon className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <MetricsCard
          title="Active Matches"
          value={activeMatches.filter(m => m.status === 'active').length}
          icon={UserGroupIcon}
          color="primary"
          loading={matchesLoading}
        />
        <MetricsCard
          title="Generated Content"
          value={contentItems.length}
          icon={DocumentTextIcon}
          color="success"
          loading={contentLoading}
        />
        <MetricsCard
          title="Published Posts"
          value={contentItems.filter(item => item.published).length}
          icon={ShareIcon}
          color="warning"
          loading={contentLoading}
        />
        <MetricsCard
          title="Pending Content"
          value={contentItems.filter(item => !item.published).length}
          icon={ClockIcon}
          color="gray"
          loading={contentLoading}
        />
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
          {/* Active Matches Tab */}
          {activeTab === 'matches' && (
            <div className="space-y-6">
              {matchesLoading ? (
                <div className="flex items-center justify-center h-32">
                  <LoadingSpinner />
                </div>
              ) : activeMatches.length === 0 ? (
                <div className="text-center py-12">
                  <UserGroupIcon className="mx-auto h-12 w-12 text-gray-400 dark:text-dark-500" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                    No Active Matches
                  </h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-dark-400">
                    Initialize a new match to start content generation
                  </p>
                  <div className="mt-6">
                    <Button onClick={() => setActiveTab('initialize')}>
                      <PlayIcon className="h-4 w-4 mr-2" />
                      Initialize Match
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {activeMatches.map((match) => (
                    <div key={match.match_id} className="card">
                      <div className="card-header">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                              {match.match_id}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-dark-400">
                              {match.home_team} vs {match.away_team}
                            </p>
                          </div>
                          <span className={cn(
                            'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
                            getMatchStatus(match) === 'success' && 'bg-success-100 dark:bg-success-900 text-success-800 dark:text-success-200',
                            getMatchStatus(match) === 'warning' && 'bg-warning-100 dark:bg-warning-900 text-warning-800 dark:text-warning-200',
                            getMatchStatus(match) === 'danger' && 'bg-danger-100 dark:bg-danger-900 text-danger-800 dark:text-danger-200',
                            getMatchStatus(match) === 'gray' && 'bg-gray-100 dark:bg-dark-600 text-gray-800 dark:text-dark-200'
                          )}>
                            {match.status}
                          </span>
                        </div>
                      </div>
                      <div className="card-body">
                        <div className="space-y-3">
                          <div className="text-sm text-gray-500 dark:text-dark-400">
                            Started: {formatDateTime(match.created_at)}
                          </div>
                          
                          {match.progress && (
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600 dark:text-dark-400">Content Generated:</span>
                                <span className="font-medium text-gray-900 dark:text-white">
                                  {match.progress.total_content || 0}
                                </span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600 dark:text-dark-400">Published:</span>
                                <span className="font-medium text-gray-900 dark:text-white">
                                  {match.progress.published_content || 0}
                                </span>
                              </div>
                            </div>
                          )}

                          <div className="flex space-x-2 pt-3">
                            {match.status === 'initialized' && (
                              <Button
                                size="sm"
                                onClick={() => startContentMutation.mutate(match.match_id)}
                                loading={startContentMutation.isLoading}
                              >
                                <PlayIcon className="h-3 w-3 mr-1" />
                                Start
                              </Button>
                            )}
                            
                            {match.status === 'active' && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setSelectedMatch(match.match_id)}
                              >
                                View Progress
                              </Button>
                            )}

                            <Button
                              size="sm"
                              variant="danger"
                              onClick={() => endContentMutation.mutate(match.match_id)}
                              loading={endContentMutation.isLoading}
                            >
                              <StopIcon className="h-3 w-3 mr-1" />
                              End
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Selected Match Progress */}
              {selectedMatch && contentProgress && (
                <div className="card">
                  <div className="card-header">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      Match Progress: {selectedMatch}
                    </h3>
                  </div>
                  <div className="card-body">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                          {contentProgress.highlights_processed || 0}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-dark-400">Highlights Processed</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-success-600 dark:text-success-400">
                          {contentProgress.editorials_generated || 0}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-dark-400">Editorials</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-warning-600 dark:text-warning-400">
                          {contentProgress.social_posts_generated || 0}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-dark-400">Social Posts</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-danger-600 dark:text-danger-400">
                          {contentProgress.errors || 0}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-dark-400">Errors</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Generated Content Tab */}
          {activeTab === 'content' && (
            <div className="space-y-6">
              {contentLoading ? (
                <div className="flex items-center justify-center h-32">
                  <LoadingSpinner />
                </div>
              ) : contentItems.length === 0 ? (
                <div className="text-center py-12">
                  <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400 dark:text-dark-500" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                    No Generated Content
                  </h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-dark-400">
                    Content will appear here once matches start generating content
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {contentItems.map((item) => (
                    <div key={item.id} className="card">
                      <div className="card-header">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                              {item.title || `Content ${item.id}`}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-dark-400">
                              {item.type} • Match: {item.match_id}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            {item.published ? (
                              <CheckCircleIcon className="h-5 w-5 text-success-600" />
                            ) : (
                              <ClockIcon className="h-5 w-5 text-warning-600" />
                            )}
                            <span className={cn(
                              'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
                              item.published
                                ? 'bg-success-100 dark:bg-success-900 text-success-800 dark:text-success-200'
                                : 'bg-warning-100 dark:bg-warning-900 text-warning-800 dark:text-warning-200'
                            )}>
                              {item.published ? 'Published' : 'Draft'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="card-body">
                        <div className="space-y-3">
                          <p className="text-sm text-gray-600 dark:text-dark-400">
                            {item.content}
                          </p>
                          
                          <div className="text-xs text-gray-500 dark:text-dark-400">
                            Created: {formatDateTime(item.created_at)}
                          </div>

                          {!item.published && item.type === 'social' && (
                            <div className="flex flex-wrap gap-2 pt-2">
                              {socialPlatforms.map(platform => (
                                <Button
                                  key={platform.value}
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handlePostToSocial(platform.value, item.id)}
                                  loading={postToSocialMutation.isLoading}
                                >
                                  <ShareIcon className="h-3 w-3 mr-1" />
                                  Post to {platform.label}
                                </Button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Initialize Match Tab */}
          {activeTab === 'initialize' && (
            <div className="max-w-2xl mx-auto">
              <div className="card">
                <div className="card-header">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Initialize Content Generation
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-dark-400">
                    Set up a new match for AI-powered content generation
                  </p>
                </div>
                <div className="card-body">
                  <form onSubmit={handleInitialize} className="space-y-6">
                    {/* Match Details */}
                    <div className="space-y-4">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white">Match Details</h4>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <div>
                          <label className="form-label">Match ID *</label>
                          <input
                            type="text"
                            value={matchForm.matchId}
                            onChange={(e) => setMatchForm(prev => ({ ...prev, matchId: e.target.value }))}
                            className="form-input"
                            placeholder="e.g., MATCH_001"
                            required
                          />
                        </div>
                        <div>
                          <label className="form-label">Home Team *</label>
                          <input
                            type="text"
                            value={matchForm.homeTeam}
                            onChange={(e) => setMatchForm(prev => ({ ...prev, homeTeam: e.target.value }))}
                            className="form-input"
                            placeholder="e.g., FC Barcelona"
                            required
                          />
                        </div>
                        <div>
                          <label className="form-label">Away Team *</label>
                          <input
                            type="text"
                            value={matchForm.awayTeam}
                            onChange={(e) => setMatchForm(prev => ({ ...prev, awayTeam: e.target.value }))}
                            className="form-input"
                            placeholder="e.g., Real Madrid"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    {/* Content Settings */}
                    <div className="space-y-4">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white">Content Settings</h4>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={matchForm.enableEditorials}
                            onChange={(e) => setMatchForm(prev => ({ ...prev, enableEditorials: e.target.checked }))}
                            className="form-checkbox"
                          />
                          <label className="ml-2 text-sm text-gray-900 dark:text-white">
                            Enable Editorial Generation
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={matchForm.enableSocialMedia}
                            onChange={(e) => setMatchForm(prev => ({ ...prev, enableSocialMedia: e.target.checked }))}
                            className="form-checkbox"
                          />
                          <label className="ml-2 text-sm text-gray-900 dark:text-white">
                            Enable Social Media Posts
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Frequency Settings */}
                    <div className="space-y-4">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white">Frequency Settings</h4>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                          <label className="form-label">Editorial Frequency (every N highlights)</label>
                          <Select
                            value={matchForm.editorialFrequency}
                            onChange={(value) => setMatchForm(prev => ({ ...prev, editorialFrequency: value }))}
                            options={[
                              { value: 1, label: 'Every highlight' },
                              { value: 2, label: 'Every 2 highlights' },
                              { value: 3, label: 'Every 3 highlights' },
                              { value: 5, label: 'Every 5 highlights' }
                            ]}
                          />
                        </div>
                        <div>
                          <label className="form-label">Social Media Frequency (every N highlights)</label>
                          <Select
                            value={matchForm.socialFrequency}
                            onChange={(value) => setMatchForm(prev => ({ ...prev, socialFrequency: value }))}
                            options={[
                              { value: 1, label: 'Every highlight' },
                              { value: 2, label: 'Every 2 highlights' },
                              { value: 3, label: 'Every 3 highlights' }
                            ]}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Style Settings */}
                    <div className="space-y-4">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white">Style Settings</h4>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                          <label className="form-label">Editorial Style</label>
                          <Select
                            value={matchForm.editorialStyle}
                            onChange={(value) => setMatchForm(prev => ({ ...prev, editorialStyle: value }))}
                            options={editorialStyles}
                          />
                        </div>
                        <div>
                          <label className="form-label">Social Media Tone</label>
                          <Select
                            value={matchForm.socialTone}
                            onChange={(value) => setMatchForm(prev => ({ ...prev, socialTone: value }))}
                            options={socialTones}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Social Platforms */}
                    <div className="space-y-4">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white">Social Media Platforms</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {socialPlatforms.map(platform => (
                          <div key={platform.value} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={matchForm.socialPlatforms.includes(platform.value)}
                              onChange={(e) => {
                                const newPlatforms = e.target.checked
                                  ? [...matchForm.socialPlatforms, platform.value]
                                  : matchForm.socialPlatforms.filter(p => p !== platform.value);
                                setMatchForm(prev => ({ ...prev, socialPlatforms: newPlatforms }));
                              }}
                              className="form-checkbox"
                            />
                            <label className="ml-2 text-sm text-gray-900 dark:text-white">
                              {platform.label}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Submit */}
                    <div className="flex justify-end">
                      <Button
                        type="submit"
                        loading={isInitializing || initializeContentMutation.isLoading}
                        disabled={!matchForm.matchId || !matchForm.homeTeam || !matchForm.awayTeam}
                      >
                        <PlayIcon className="h-4 w-4 mr-2" />
                        Initialize Match
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}