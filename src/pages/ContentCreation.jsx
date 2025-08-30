import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { 
  DocumentTextIcon,
  ChatBubbleLeftEllipsisIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon,
  EyeIcon,
  ShareIcon,
  DocumentChartBarIcon,
  StarIcon,
  ClockIcon,
  FunnelIcon,
  CalendarIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';

// Import real social media icons
import { 
  FaFacebookF, 
  FaInstagram, 
  FaLinkedinIn,
  FaTiktok,
  FaYoutube
} from 'react-icons/fa';

import { FaXTwitter } from 'react-icons/fa6';

import { apiService } from '../services/api';
import { ProfessionalMetricCard } from '../components/ui/ProfessionalMetricCard.jsx';
import { FilterBar } from '../components/ui/FilterBar.jsx';
import { DataTable } from '../components/ui/DataTable.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Select } from '../components/ui/Select.jsx';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

// Social media icon component with real icons
const SocialIcon = ({ platform, className = "" }) => {
  const iconProps = { className: `${className} social-icon` };
  
  switch (platform) {
    case 'twitter':
      return <FaXTwitter {...iconProps} className={`${iconProps.className} social-icon-twitter`} />;
    case 'facebook':
      return <FaFacebookF {...iconProps} className={`${iconProps.className} social-icon-facebook`} />;
    case 'instagram':
      return <FaInstagram {...iconProps} className={`${iconProps.className} social-icon-instagram`} />;
    case 'linkedin':
      return <FaLinkedinIn {...iconProps} className={`${iconProps.className} social-icon-linkedin`} />;
    case 'tiktok':
      return <FaTiktok {...iconProps} className={`${iconProps.className} text-black dark:text-white hover:text-gray-600 dark:hover:text-gray-300`} />;
    case 'youtube':
      return <FaYoutube {...iconProps} className={`${iconProps.className} text-red-500 hover:text-red-600`} />;
    default:
      return <ShareIcon {...iconProps} className={`${iconProps.className} text-gray-500 dark:text-slate-400`} />;
  }
};

// Content type icons
const contentTypeIcons = {
  editorial: DocumentTextIcon,
  social_post: ChatBubbleLeftEllipsisIcon,
  match_summary: DocumentChartBarIcon,
};

// Mock content generation status
const mockGenerationProgress = [
  { 
    id: 1, 
    type: 'editorial', 
    match: 'El Clasico - Barcelona vs Real Madrid',
    status: 'completed', 
    timestamp: new Date().toISOString(),
    trigger: 'Goal scored by Messi in 89th minute'
  },
  { 
    id: 2, 
    type: 'social_post', 
    match: 'El Clasico - Barcelona vs Real Madrid',
    status: 'generating', 
    timestamp: new Date().toISOString(),
    trigger: 'Near miss by Vinicius Jr.'
  },
  { 
    id: 3, 
    type: 'editorial', 
    match: 'Premier League - Manchester United vs Liverpool',
    status: 'failed', 
    timestamp: new Date().toISOString(),
    trigger: 'Red card incident'
  },
];

export default function ContentCreation() {
  const [selectedTab, setSelectedTab] = useState('overview');
  const [selectedContent, setSelectedContent] = useState(null);
  const [contentItems, setContentItems] = useState(mockContentItems);
  const [generationProgress, setGenerationProgress] = useState([]);
  const [filters, setFilters] = useState({
    match_id: '',
    content_type: '',
    date_from: '',
    date_to: '',
    status: ''
  });
  const [selectedMatch, setSelectedMatch] = useState('');

  // Fetch active content matches
  const { data: activeMatches = [] } = useQuery({
    queryKey: ['activeContentMatches'],
    queryFn: () => apiService.getActiveContentMatches(),
    refetchInterval: 15000, // Refresh every 15 seconds
    retry: 1,
  });

  // Fetch content items
  const { data: content, refetch, isError: contentError } = useQuery({
    queryKey: ['contentItems'],
    queryFn: async () => {
      try {
        const response = await apiService.getContentItems({
          limit: 100
        });
        const items = response.items || [];
        // If API returns empty data, use mock data for demonstration
        return items.length > 0 ? items : mockContentItems;
      } catch (error) {
        console.error('Failed to fetch content items:', error);
        // Fallback to mock data if API fails
        return mockContentItems;
      }
    },
    refetchInterval: 30000, // Refresh every 30 seconds
    retry: 1, // Reduced retries to show mock data faster
  });

  // Fetch content generation progress
  const { data: progressData, refetch: refetchProgress, isError: progressError } = useQuery({
    queryKey: ['contentProgress'],
    queryFn: async () => {
      try {
        const response = await apiService.getContentProgress();
        return response.progress || [];
      } catch (error) {
        console.error('Failed to fetch content progress:', error);
        return mockGenerationProgress;
      }
    },
    refetchInterval: 10000, // Refresh every 10 seconds for real-time updates
    retry: 1,
  });

  useEffect(() => {
    if (content) {
      setContentItems(content);
    }
  }, [content]);

  useEffect(() => {
    if (progressData) {
      setGenerationProgress(progressData);
    }
  }, [progressData]);

  const tabs = [
    { id: 'overview', name: 'Overview', icon: ClockIcon },
    { id: 'editorials', name: 'Editorials', icon: DocumentTextIcon },
    { id: 'social', name: 'Social Posts', icon: ChatBubbleLeftEllipsisIcon },
    { id: 'summaries', name: 'Game Summaries', icon: DocumentChartBarIcon },
    { id: 'progress', name: 'Generation Progress', icon: ArrowPathIcon },
  ];

  // Filter configurations
  const filterConfigs = [
    {
      key: 'match_id',
      label: 'Match',
      type: 'select',
      options: [
        { value: '', label: 'All Matches' },
        ...Array.from(new Set(contentItems.map(item => item.match_id || item.game_context?.teams?.home + ' vs ' + item.game_context?.teams?.away)))
          .filter(Boolean)
          .map(match => ({ value: match, label: match }))
      ]
    },
    {
      key: 'content_type',
      label: 'Content Type',
      type: 'select',
      options: [
        { value: '', label: 'All Types' },
        { value: 'editorial', label: 'Editorial' },
        { value: 'social_post', label: 'Social Post' },
        { value: 'match_summary', label: 'Match Summary' }
      ]
    },
    {
      key: 'date_from',
      label: 'From Date',
      type: 'date'
    },
    {
      key: 'date_to',
      label: 'To Date',
      type: 'date'
    }
  ];

  // Filter content items based on current filters
  const filteredContentItems = contentItems.filter(item => {
    if (filters.match_id && item.match_id !== filters.match_id && 
        (item.game_context?.teams?.home + ' vs ' + item.game_context?.teams?.away) !== filters.match_id) {
      return false;
    }
    if (filters.content_type && item.type !== filters.content_type) {
      return false;
    }
    if (filters.date_from) {
      const itemDate = new Date(typeof item.timestamp === 'number' ? item.timestamp * 1000 : item.timestamp);
      const filterDate = new Date(filters.date_from);
      if (itemDate < filterDate) return false;
    }
    if (filters.date_to) {
      const itemDate = new Date(typeof item.timestamp === 'number' ? item.timestamp * 1000 : item.timestamp);
      const filterDate = new Date(filters.date_to);
      filterDate.setHours(23, 59, 59, 999); // End of day
      if (itemDate > filterDate) return false;
    }
    return true;
  });

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleClearFilters = () => {
    setFilters({
      match_id: '',
      content_type: '',
      date_from: '',
      date_to: '',
      status: ''
    });
  };
  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon className="h-5 w-5 text-success-500" />;
      case 'generating':
        return <ArrowPathIcon className="h-5 w-5 text-warning-500 animate-spin" />;
      case 'failed':
        return <XCircleIcon className="h-5 w-5 text-danger-500" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-400 dark:text-slate-400" />;
    }
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  const handleSocialMediaPost = async (platform, content, contentId = null) => {
    try {
      let id = contentId;
      
      // If contentId is not provided, try to extract it from content object
      if (!id && typeof content === 'object' && content.id) {
        id = content.id;
      }
      
      // If content is a string, assume it's the message and we need a contentId
      if (!id) {
        console.error('Content ID is required for social media posting');
        toast.error('Unable to post: Content ID missing');
        return;
      }
      
      const message = typeof content === 'string' ? content : undefined;
      
      const response = await apiService.postToSocialMedia(platform, id, message);
      
      if (response.success) {
        toast.success(`Successfully posted to ${platform}!`);
        
        // Refresh content progress to show the posting activity
        refetchProgress();
      } else {
        throw new Error(response.message || 'Post failed');
      }
    } catch (error) {
      console.error(`Failed to post to ${platform}:`, error);
      toast.error(`Failed to post to ${platform}: ${error.message}`);
    }
  };

  // Calculate metrics based on filtered data
  const calculateMetrics = () => {
    const totalEditorials = filteredContentItems.filter(item => item.type === 'editorial').length;
    const totalSocialPosts = filteredContentItems.filter(item => item.type === 'social_post').length;
    const totalSummaries = filteredContentItems.filter(item => item.type === 'match_summary').length;
    const generatingCount = Array.isArray(generationProgress) ? 
      generationProgress.filter(item => item.status === 'generating').length : 0;
    const completedToday = Array.isArray(generationProgress) ? 
      generationProgress.filter(item => item.status === 'completed').length : 0;

    return {
      totalEditorials,
      totalSocialPosts,
      totalSummaries,
      generatingCount,
      completedToday
    };
  };

  const metrics = calculateMetrics();
  const renderOverview = () => (
    <div className="space-y-6">
      {/* Filters */}
      <FilterBar
        filters={filterConfigs}
        values={filters}
        onChange={handleFilterChange}
        onClear={handleClearFilters}
        title="Content Filters"
      />

      {/* Stats cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
        <ProfessionalMetricCard
          title="Editorial Articles"
          value={metrics.totalEditorials}
          subtitle={`${Math.round(metrics.totalEditorials / Math.max(filteredContentItems.length, 1) * 100)}% of content`}
          icon={DocumentTextIcon}
          color="emerald"
          delay={0.1}
        />
        
        <ProfessionalMetricCard
          title="Social Posts"
          value={metrics.totalSocialPosts}
          subtitle={`${Math.round(metrics.totalSocialPosts / Math.max(filteredContentItems.length, 1) * 100)}% of content`}
          icon={ChatBubbleLeftEllipsisIcon}
          color="blue"
          delay={0.2}
        />
        
        <ProfessionalMetricCard
          title="Currently Generating"
          value={metrics.generatingCount}
          subtitle="Active AI processes"
          icon={ArrowPathIcon}
          color="orange"
          delay={0.3}
        />
        
        <ProfessionalMetricCard
          title="Match Summaries"
          value={metrics.totalSummaries}
          subtitle="Comprehensive reports"
          icon={DocumentChartBarIcon}
          color="purple"
          delay={0.4}
        />
        
        <ProfessionalMetricCard
          title="Published Today"
          value={metrics.completedToday}
          subtitle="Successfully posted"
          icon={ShareIcon}
          color="slate"
          delay={0.5}
        />
      </div>

      {/* Active Matches Overview */}
      {activeMatches.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm"
        >
          <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <UserGroupIcon className="h-5 w-5 text-slate-500 dark:text-slate-400" />
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Active Matches</h3>
                <Badge variant="secondary" size="sm">{activeMatches.length}</Badge>
              </div>
              <Button variant="outline" size="sm" onClick={() => refetch()}>
                <ArrowPathIcon className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeMatches.map((match, index) => (
                <motion.div
                  key={match.match_id || index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 + (index * 0.1), duration: 0.3 }}
                  className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-slate-900 dark:text-white">
                      {match.home_team} vs {match.away_team}
                    </h4>
                    <Badge 
                      variant={match.status === 'active' ? 'success' : 'secondary'} 
                      size="sm"
                    >
                      {match.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                    Match ID: {match.match_id}
                  </p>
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span>Content: {contentItems.filter(item => item.match_id === match.match_id).length}</span>
                    <span>Started: {new Date(match.created_at).toLocaleDateString()}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Recent activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm"
      >
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            Recent Content Generation
          </h3>
        </div>
        <div className="p-6">
          <div className="flow-root">
            <ul className="-mb-8">
              {(Array.isArray(generationProgress) ? generationProgress : []).slice(0, 5).map((item, itemIdx) => (
                <li key={item.id}>
                  <div className="relative pb-8">
                    {itemIdx !== (Array.isArray(generationProgress) ? generationProgress : []).length - 1 ? (
                      <span
                        className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-slate-200 dark:bg-slate-700"
                        aria-hidden="true"
                      />
                    ) : null}
                    <div className="relative flex space-x-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full ring-4 ring-white dark:ring-slate-800 shadow-sm">
                        {getStatusIcon(item.status)}
                      </div>
                      <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                        <div>
                          <p className="text-sm text-slate-900 dark:text-white font-medium">
                            Generated {item.type} for{' '}
                            <span className="text-emerald-600 dark:text-emerald-400">
                              {item.match}
                            </span>
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            Trigger: {item.trigger}
                          </p>
                        </div>
                        <div className="whitespace-nowrap text-right text-sm text-slate-500 dark:text-slate-400">
                          {formatTimestamp(item.timestamp)}
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );

  const renderContentList = (type) => {
    const typeFilteredContent = type ? filteredContentItems.filter(item => item.type === type) : filteredContentItems;
    
    const getContentTitle = (type) => {
      switch (type) {
        case 'editorial': return 'Editorial Content';
        case 'social_post': return 'Social Media Posts';
        case 'match_summary': return 'Game Summaries';
        default: return 'Content';
      }
    };
    
    const getContentDescription = (type) => {
      switch (type) {
        case 'editorial': return 'Professional editorial content ready for publication';
        case 'social_post': return 'Social media content ready for posting';
        case 'match_summary': return 'Comprehensive game summaries generated after matches';
        default: return 'Generated content ready for review and publishing';
      }
    };
    
    return (
      <div className="space-y-6">
        {/* Filters for specific content type */}
        <FilterBar
          filters={filterConfigs}
          values={filters}
          onChange={handleFilterChange}
          onClear={handleClearFilters}
          title={`${getContentTitle(type)} Filters`}
        />

        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                {getContentTitle(type)}
              </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                {getContentDescription(type)}
              </p>
              </div>
              <div className="flex items-center space-x-3">
                <Badge variant="secondary" size="sm">
                  {typeFilteredContent.length} items
                </Badge>
                <Button variant="outline" size="sm" onClick={() => refetch()}>
                  <ArrowPathIcon className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </div>
          </div>

          <div className="p-6">
            {typeFilteredContent.length === 0 ? (
              <div className="text-center py-8">
                <DocumentTextIcon className="mx-auto h-12 w-12 text-slate-400 dark:text-slate-500" />
                <h3 className="mt-2 text-sm font-medium text-slate-900 dark:text-white">No content available</h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Content will appear here as it's generated during matches.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {typeFilteredContent.map((item, index) => (
                  <motion.div
                  key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                    className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer transition-all duration-200 hover:shadow-md"
                  onClick={() => {
                    setSelectedContent(item);
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        {React.createElement(contentTypeIcons[item.type], {
                          className: "h-5 w-5 text-emerald-600 dark:text-emerald-400"
                        })}
                        <h4 className="text-sm font-medium text-slate-900 dark:text-white">
                          {item.type === 'editorial' ? item.content.headline 
                           : item.type === 'match_summary' ? `Match Summary: ${item.game_context?.teams?.home || 'Team A'} vs ${item.game_context?.teams?.away || 'Team B'}`
                           : item.content.text.substring(0, 60) + '...'}
                        </h4>
                      </div>
                      <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                        {item.game_context?.teams?.home || 'Team A'} vs {item.game_context?.teams?.away || 'Team B'}
                      </p>
                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        Generated: {formatTimestamp(
                          typeof item.timestamp === 'number' 
                            ? item.timestamp * 1000 
                            : item.timestamp
                        )}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedContent(item);
                        }}
                        className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 p-2 rounded-md hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors duration-200"
                        title="View details"
                      >
                        <EyeIcon className="h-5 w-5" />
                      </button>
                      {item.type === 'social_post' && (
                        <div className="flex space-x-2">
                          {item.platforms?.map((platform) => (
                            <button
                              key={platform}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSocialMediaPost(platform, item.content.text, item.id);
                              }}
                              className="p-2 rounded-md transition-all duration-200 hover:scale-110 hover:shadow-sm hover:bg-slate-100 dark:hover:bg-slate-700"
                              title={`Post to ${platform}`}
                            >
                              <SocialIcon platform={platform} className="w-4 h-4" />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderGenerationProgress = () => (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm">
      <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
          Content Generation Progress
        </h3>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {(Array.isArray(generationProgress) ? generationProgress : []).map((item) => (
            <div
              key={item.id}
              className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(item.status)}
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                      {item.type.charAt(0).toUpperCase() + item.type.slice(1)} - {item.match}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Trigger: {item.trigger}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {formatTimestamp(item.timestamp)}
                  </p>
                  <span className={classNames(
                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                    item.status === 'completed' ? 'bg-success-100 text-success-800 dark:bg-success-900 dark:text-success-200' :
                    item.status === 'generating' ? 'bg-warning-100 text-warning-800 dark:bg-warning-900 dark:text-warning-200' :
                    'bg-danger-100 text-danger-800 dark:bg-danger-900 dark:text-danger-200'
                  )}>
                    {item.status}
                  </span>
                </div>
              </div>
              {item.status === 'generating' && (
                <div className="mt-3">
                  <div className="bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                    <div className="bg-warning-500 h-2 rounded-full animate-pulse" style={{ width: '65%' }}></div>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Processing highlight content...</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Professional Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              Content Operations Center
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              AI-powered editorial and social media content management
            </p>
            
            {/* Status indicators for API errors */}
            {(contentError || progressError) && (
              <div className="mt-4 inline-flex items-center space-x-2 px-4 py-2 bg-warning-50 dark:bg-warning-900/20 border border-warning-200 dark:border-warning-800 rounded-lg text-sm text-warning-700 dark:text-warning-300">
                <XCircleIcon className="h-4 w-4" />
                <span>
                  {contentError && progressError ? 'Using cached data - API unavailable' :
                   contentError ? 'Content data unavailable - using mock data' :
                   'Progress data unavailable - using mock data'}
                </span>
              </div>
            )}
          </motion.div>

          {/* Professional Tab Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm mb-6"
          >
            <div className="border-b border-slate-200 dark:border-slate-700">
              <nav className="flex space-x-8 px-6" aria-label="Tabs">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedTab(tab.id)}
                    className={classNames(
                      selectedTab === tab.id
                        ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                        : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600',
                      'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-all duration-200'
                    )}
                  >
                    <tab.icon className="h-5 w-5" />
                    <span>{tab.name}</span>
                  </button>
                ))}
              </nav>
            </div>
          </motion.div>

          {/* Tab content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {selectedTab === 'overview' && renderOverview()}
              {selectedTab === 'editorials' && renderContentList('editorial')}
              {selectedTab === 'social' && renderContentList('social_post')}
              {selectedTab === 'summaries' && renderContentList('match_summary')}
              {selectedTab === 'progress' && renderGenerationProgress()}
            </motion.div>
          </AnimatePresence>

          {/* Content detail modal */}
          {selectedContent && (
            <ContentDetailModal 
              content={selectedContent} 
              onClose={() => setSelectedContent(null)}
              onSocialPost={handleSocialMediaPost}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// Content Detail Modal Component
function ContentDetailModal({ content, onClose, onSocialPost }) {
  if (!content) {
    return null;
  }
  
  return (
    <div 
      className="fixed inset-0 bg-slate-900/50 dark:bg-black/70 backdrop-blur-sm overflow-y-auto h-full w-full flex items-center justify-center"
      style={{
        zIndex: 1000
      }}
      onClick={onClose}
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3 }}
        className="relative mx-auto p-8 border border-slate-200 dark:border-slate-600 w-11/12 max-w-4xl shadow-xl rounded-lg bg-white dark:bg-slate-800"
        style={{
          maxWidth: '1200px',
          width: '98%',
          position: 'relative',
          zIndex: 1001
        }}
        onClick={(e) => e.stopPropagation()}
      >
          <div className="absolute top-0 right-0 pt-4 pr-4">
            <button
              type="button"
              className="p-2 rounded-md text-slate-400 dark:text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors duration-200"
              onClick={onClose}
            >
              <span className="sr-only">Close</span>
              <XCircleIcon className="h-6 w-6" />
            </button>
          </div>

        
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
          {content?.type === 'editorial' ? 'Editorial Content' 
           : content?.type === 'match_summary' ? 'Game Summary'
           : 'Social Media Post'}
        </h3>
                  
                  <div className="space-y-6">
                    {/* Meta information */}
                    <div className="bg-slate-50 dark:bg-slate-700/50 p-6 rounded-lg border border-slate-200 dark:border-slate-600">
                      <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Match Information</h4>
                      <div className="grid grid-cols-2 gap-6 text-sm">
                        <div>
                          <span className="font-medium text-slate-500 dark:text-slate-400">Match:</span>
                          <p className="text-slate-900 dark:text-white font-medium">
                            {content?.game_context?.teams?.home || 'Team A'} vs {content?.game_context?.teams?.away || 'Team B'}
                          </p>
                        </div>
                        <div>
                          <span className="font-medium text-slate-500 dark:text-slate-400">Generated:</span>
                          <p className="text-slate-900 dark:text-white font-medium">
                            {content?.timestamp ? new Date(
                              typeof content.timestamp === 'number' 
                                ? content.timestamp * 1000 
                                : content.timestamp
                            ).toLocaleString() : 'N/A'}
                          </p>
                        </div>
                        <div className="col-span-2">
                          <span className="font-medium text-slate-500 dark:text-slate-400">
                            {content.type === 'match_summary' ? 'Summary Type:' : 'Trigger:'}
                          </span>
                          <p className="text-slate-900 dark:text-white font-medium">
                            {content?.type === 'match_summary' 
                              ? `${content?.content?.type || 'fulltime'} - Covers ${content?.content?.highlights_covered || 'N/A'} highlights`
                              : (content?.trigger_highlight || 'N/A')}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Content sections */}
                    {content?.type === 'editorial' ? (
                      <div className="space-y-6">
                        <div>
                          <h4 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
                            {content?.content?.headline || 'Editorial Title'}
                          </h4>
                          <div className="prose dark:prose-invert max-w-none bg-slate-50 dark:bg-slate-700/50 p-6 rounded-lg">
                            <div className="whitespace-pre-line text-slate-700 dark:text-slate-300 leading-relaxed">
                              {content?.content?.body || 'Editorial content not available'}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <Badge variant="primary" size="sm">
                            {content?.content?.word_count || 0} words
                          </Badge>
                          <Badge variant="secondary" size="sm">
                            {content?.content?.style || 'professional'}
                          </Badge>
                          <Badge variant="secondary" size="sm">
                            {content?.content?.tone || 'neutral'}
                          </Badge>
                        </div>
                      </div>
                    ) : content?.type === 'social_post' ? (
                      <div className="space-y-6">
                        <div className="bg-slate-50 dark:bg-slate-700/50 p-6 rounded-lg border border-slate-200 dark:border-slate-600">
                          <p className="text-slate-900 dark:text-white text-lg leading-relaxed">{content?.content?.text || 'Social post content not available'}</p>
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <Badge variant="primary" size="sm">
                            {content?.content?.character_count || 0} characters
                          </Badge>
                          <Badge variant="secondary" size="sm">
                            {content?.content?.tone || 'neutral'}
                          </Badge>
                          <Badge variant="warning" size="sm">
                            {content?.content?.engagement_potential || 'medium'}
                          </Badge>
                        </div>
                        
                        {/* Social media posting buttons */}
                        <div className="pt-6 border-t border-slate-200 dark:border-slate-600">
                          <h5 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Post to Social Media</h5>
                          <div className="flex flex-wrap gap-3">
                            {content?.platforms?.map((platform) => (
                              <Button
                                key={platform}
                                variant="outline"
                                size="sm"
                                onClick={() => onSocialPost(platform, content?.content?.text, content?.id)}
                                leftIcon={<SocialIcon platform={platform} className="w-4 h-4" />}
                              >
                                {platform.charAt(0).toUpperCase() + platform.slice(1)}
                              </Button>
                            )) || (
                              <p className="text-slate-500 dark:text-slate-400 text-sm">No platforms available</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ) : (
                      // Match summary content
                      <div className="space-y-6">
                        <div>
                          <h4 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
                            {content?.game_context?.teams?.home || 'Team A'} vs {content?.game_context?.teams?.away || 'Team B'} - Final Summary
                          </h4>
                          <div className="prose dark:prose-invert max-w-none bg-slate-50 dark:bg-slate-700/50 p-6 rounded-lg">
                            <div className="whitespace-pre-line text-slate-700 dark:text-slate-300 leading-relaxed">
                              {content?.content?.content || 'No summary content available'}
                            </div>
                          </div>
                        </div>
                        
                        {content?.content?.key_moments && content?.content?.key_moments?.length > 0 && (
                          <div>
                            <h5 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Key Moments</h5>
                            <div className="space-y-3">
                              {content?.content?.key_moments?.map((moment, index) => (
                                <div key={index} className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg border border-slate-200 dark:border-slate-600">
                                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{moment}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        <div className="flex flex-wrap gap-3">
                          <Badge variant="primary" size="sm">
                            {content?.content?.type || 'fulltime'} summary
                          </Badge>
                          <Badge variant="secondary" size="sm">
                            {content?.content?.highlights_covered || 0} highlights covered
                          </Badge>
                          {content?.content?.match_rating && (
                            <Badge variant="warning" size="sm">
                              <StarIcon className="h-3 w-3 mr-1" />
                              {content?.content?.match_rating}/5.0
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
      </motion.div>
    </div>
  );
}

// Mock data - this will be replaced with actual API calls
const mockContentItems = [
  {
    id: "editorial_el_clasico_003_1754171406_1",
    type: "editorial", 
    match_id: "el_clasico_003_1754171406",
    timestamp: 1754171736,
    match_minute: 29236432,
    trigger_highlight: "Jude Bellingham (Real Madrid) makes a strong tackle, then Vinicius Jr. and Rodrigo (Real Madrid) lead an attack before Barcelona's number 20 volleys just wide.",
    content: {
      headline: "Bellingham's Grit and Vinicius-Led Break Ignite Early Clasico Fire as Barcelona Narrowly Miss",
      body: "Bellingham's fierce slide halts a surging Barcelona attack, instantly flipping the script as Vinicius Jr. and Rodrygo spearhead a Real Madrid counter—only for Barcelona's number 20 to volley inches wide as the tension boils over...",
      style: "professional",
      word_count: 446,
      tone: "analytical",
      key_themes: ["individual_brilliance", "team_performance", "tactical_analysis"]
    },
    game_context: {
      score: { home: 0, away: 0 },
      minute: 29236432,
      teams: { home: "FC Barcelona", away: "Real Madrid" }
    }
  },
  {
    id: "social_el_clasico_003_1754171406_1",
    type: "social_post",
    match_id: "el_clasico_003_1754171406", 
    timestamp: 1754171544,
    match_minute: 29236430,
    trigger_highlight: "Pre-match tension builds as Kounde, Lewandowski, Raphinha, and Pedri (Barcelona) prepare, followed by Real Madrid's tactical huddle and the match kickoff at 0-0.",
    content: {
      text: "KICKOFF! 🚨 Lewandowski, Kounde, Raphinha & Pedri locked in as Barcelona get ready, while Real Madrid huddle up—tension is electric at Camp Nou! 2' and it's 0-0... Who will make the first move? ⚡️\n\nWho takes control early—Barça or Madrid? #ElClasico #ForçaBarça #HalaMadrid",
      platform: "twitter",
      character_count: 272,
      tone: "exciting", 
      engagement_potential: "medium",
      suggested_media: "video_clip",
      optimal_timing: "within_5_minutes"
    },
    platforms: ["twitter", "instagram", "facebook"],
    hashtags: ["#LiveFootball", "#MatchHighlights", "#FCBarcelona", "#RealMadrid"],
    game_context: {
      score: { home: 0, away: 0 },
      minute: 29236430,
      teams: { home: "FC Barcelona", away: "Real Madrid" }
    }
  },
  {
    id: "summary_el_clasico_003_final",
    type: "match_summary",
    schedule_id: "el_clasico_003",
    timestamp: 1754172745,
    content: {
      content: "**FULLTIME SUMMARY: FC BARCELONA 0–0 REAL MADRID**\n\n**Opening Statement**\n\nAfter 90 pulsating minutes at the Camp Nou, FC Barcelona and Real Madrid have played out a gripping 0-0 draw that belies the drama and quality on display. From the opening whistle, this latest edition of El Clásico delivered intensity, tactical intrigue, and a series of pivotal moments—though neither side could find a decisive breakthrough. Both teams showcased defensive resilience and flashes of attacking brilliance, but ultimately the night belonged to the goalkeepers and backlines, who stood tall in the face of relentless pressure.\n\n**Key Moments Breakdown**\n\nThe tone was set early, with Thibaut Courtois (1') making a vital save to deny Barcelona after intricate buildup play by Raphinha and Dani Olmo. Moments later, Lewandowski was flagged offside (3') following a slick move involving Martínez and De Jong, as Real Madrid's Tchouaméni and Bellingham regained control, signaling Madrid's intent to dictate midfield battles.\n\nBy the 10th minute, both sides had exchanged quick counterattacks—De Jong and Tchouaméni orchestrating a rapid transition, only for Martínez and Vinícius Jr. to be halted by Barcelona's Bowde and Rayal. The pattern continued: Raphinha and Lewandowski (12') threatened again, but Madrid's stand-in keeper Mash Bay produced another crucial save.",
      type: "fulltime",
      highlights_covered: 10,
      key_moments: [
        "Both teams showcased defensive resilience and flashes of attacking brilliance, but ultimately the night belonged to the goalkeepers and backlines, who stood tall in the face of relentless pressure",
        "The tone was set early, with Thibaut Courtois (1') making a vital save to deny Barcelona after intricate buildup play by Raphinha and Dani Olmo",
        "The pattern continued: Raphinha and Lewandowski (12') threatened again, but Madrid's stand-in keeper Mash Bay produced another crucial save",
        "The lack of goals was not for want of trying—goalkeepers and last-ditch defending were the true stars",
        "The absence of a breakthrough became the story itself, with each missed chance or timely interception raising the stakes"
      ],
      match_rating: 5.0,
      narrative_flow: "dominance"
    },
    game_context: {
      score: { home: 0, away: 0 },
      teams: { home: "FC Barcelona", away: "Real Madrid" }
    }
  }
];