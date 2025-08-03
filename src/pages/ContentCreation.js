import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
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
      return <ShareIcon {...iconProps} className={`${iconProps.className} text-gray-500 dark:text-dark-400`} />;
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
  const [contentItems, setContentItems] = useState([]);
  const [generationProgress, setGenerationProgress] = useState(0);

  // Fetch content items
  const { data: content, refetch } = useQuery(
    'contentItems',
    async () => {
      try {
        const response = await apiService.getContentItems({
          limit: 100
        });
        return response.items || [];
      } catch (error) {
        console.error('Failed to fetch content items:', error);
        // Fallback to mock data if API fails
        return mockContentItems;
      }
    },
    {
      refetchInterval: 30000, // Refresh every 30 seconds
      retry: 2,
    }
  );

  // Fetch content generation progress
  const { data: progressData, refetch: refetchProgress } = useQuery(
    'contentProgress',
    async () => {
      try {
        const response = await apiService.getContentProgress();
        return response.progress || [];
      } catch (error) {
        console.error('Failed to fetch content progress:', error);
        return mockGenerationProgress;
      }
    },
    {
      refetchInterval: 10000, // Refresh every 10 seconds for real-time updates
      retry: 1,
    }
  );

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

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon className="h-5 w-5 text-success-500" />;
      case 'generating':
        return <ArrowPathIcon className="h-5 w-5 text-warning-500 animate-spin" />;
      case 'failed':
        return <XCircleIcon className="h-5 w-5 text-danger-500" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-400 dark:text-dark-400" />;
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

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
        <div className="card overflow-hidden hover:shadow-lg transition-shadow duration-200">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DocumentTextIcon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-dark-400 truncate">
                    Total Editorials
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">12</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="card overflow-hidden hover:shadow-lg transition-shadow duration-200">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ChatBubbleLeftEllipsisIcon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-dark-400 truncate">
                    Social Posts
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">28</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="card overflow-hidden hover:shadow-lg transition-shadow duration-200">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ArrowPathIcon className="h-6 w-6 text-warning-500 dark:text-warning-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-dark-400 truncate">
                    Generating
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">3</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="card overflow-hidden hover:shadow-lg transition-shadow duration-200">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DocumentChartBarIcon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-dark-400 truncate">
                    Game Summaries
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    {contentItems.filter(item => item.type === 'match_summary').length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="card overflow-hidden hover:shadow-lg transition-shadow duration-200">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ShareIcon className="h-6 w-6 text-success-500 dark:text-success-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-dark-400 truncate">
                    Posted Today
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">15</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent activity */}
      <div className="card">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">
            Recent Content Generation
          </h3>
          <div className="flow-root">
            <ul className="-mb-8">
              {generationProgress.slice(0, 5).map((item, itemIdx) => (
                <li key={item.id}>
                  <div className="relative pb-8">
                    {itemIdx !== generationProgress.length - 1 ? (
                      <span
                        className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200 dark:bg-dark-700"
                        aria-hidden="true"
                      />
                    ) : null}
                    <div className="relative flex space-x-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full ring-8 ring-white dark:ring-dark-800 shadow-sm">
                        {getStatusIcon(item.status)}
                      </div>
                      <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                        <div>
                          <p className="text-sm text-gray-500 dark:text-dark-400">
                            Generated {item.type} for{' '}
                            <span className="font-medium text-gray-900 dark:text-white">
                              {item.match}
                            </span>
                          </p>
                          <p className="text-xs text-gray-400 dark:text-dark-500">
                            Trigger: {item.trigger}
                          </p>
                        </div>
                        <div className="whitespace-nowrap text-right text-sm text-gray-500 dark:text-dark-400">
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
      </div>
    </div>
  );

  const renderContentList = (type) => {
    const filteredContent = contentItems.filter(item => !type || item.type === type);
    
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
      <div className="card">
        <div className="px-4 py-5 sm:p-6">
          <div className="sm:flex sm:items-center sm:justify-between mb-6">
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                {getContentTitle(type)}
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-dark-400">
                {getContentDescription(type)}
              </p>
            </div>
            <button
              type="button"
              className="btn btn-primary flex items-center"
              onClick={() => refetch()}
            >
              <ArrowPathIcon className="h-4 w-4 mr-2" />
              Refresh
            </button>
          </div>

          <div className="space-y-4">
            {filteredContent.length === 0 ? (
              <div className="text-center py-12">
                <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400 dark:text-dark-500" />
                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No content available</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-dark-400">
                  Content will appear here as it's generated during matches.
                </p>
              </div>
            ) : (
              filteredContent.map((item) => (
                <div
                  key={item.id}
                  className="border border-gray-200 dark:border-dark-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-dark-700 cursor-pointer transition-colors duration-200 hover:shadow-sm"
                  onClick={() => setSelectedContent(item)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        {React.createElement(contentTypeIcons[item.type], {
                          className: "h-5 w-5 text-primary-600 dark:text-primary-400"
                        })}
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                          {item.type === 'editorial' ? item.content.headline 
                           : item.type === 'match_summary' ? `Match Summary: ${item.game_context?.teams?.home || 'Team A'} vs ${item.game_context?.teams?.away || 'Team B'}`
                           : item.content.text.substring(0, 60) + '...'}
                        </h4>
                      </div>
                      <p className="mt-1 text-sm text-gray-500 dark:text-dark-400">
                        {item.game_context?.teams?.home || 'Team A'} vs {item.game_context?.teams?.away || 'Team B'}
                      </p>
                      <p className="mt-1 text-xs text-gray-400 dark:text-dark-500">
                        Generated: {formatTimestamp(item.timestamp * 1000)}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedContent(item);
                        }}
                        className="text-primary-600 dark:text-primary-400 hover:text-primary-900 dark:hover:text-primary-300 p-1 rounded-md transition-colors duration-200"
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
                              className="p-1 rounded-md transition-transform duration-200 hover:scale-110 hover:shadow-sm"
                              title={`Post to ${platform}`}
                            >
                              <SocialIcon platform={platform} className="w-4 h-4" />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderGenerationProgress = () => (
    <div className="bg-white dark:bg-dark-800 shadow rounded-lg border border-gray-200 dark:border-dark-700">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-6">
          Content Generation Progress
        </h3>
        <div className="space-y-4">
          {generationProgress.map((item) => (
            <div
              key={item.id}
              className="border border-gray-200 dark:border-dark-700 rounded-lg p-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(item.status)}
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {item.type.charAt(0).toUpperCase() + item.type.slice(1)} - {item.match}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-dark-400">
                      Trigger: {item.trigger}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500 dark:text-dark-400">
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
                  <div className="bg-gray-200 dark:bg-dark-700 rounded-full h-2">
                    <div className="bg-warning-500 h-2 rounded-full animate-pulse" style={{ width: '65%' }}></div>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-dark-400 mt-1">Processing highlight content...</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="page-header">
        <div className="flex-1 min-w-0">
          <h2 className="page-title">
            Content Creation
          </h2>
          <p className="page-subtitle">
            AI-generated editorials and social media posts from live match highlights
          </p>
        </div>
      </div>

      {/* Navigation tabs */}
      <div className="border-b border-gray-200 dark:border-dark-700">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              className={classNames(
                selectedTab === tab.id
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-gray-500 dark:text-dark-400 hover:text-gray-700 dark:hover:text-dark-300 hover:border-gray-300 dark:hover:border-dark-600',
                'whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors duration-200'
              )}
            >
              <tab.icon className="h-5 w-5" />
              <span>{tab.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab content */}
      <div className="mt-6">
        {selectedTab === 'overview' && renderOverview()}
        {selectedTab === 'editorials' && renderContentList('editorial')}
        {selectedTab === 'social' && renderContentList('social_post')}
        {selectedTab === 'summaries' && renderContentList('match_summary')}
        {selectedTab === 'progress' && renderGenerationProgress()}
      </div>

      {/* Content detail modal */}
      {selectedContent && (
        <ContentDetailModal 
          content={selectedContent} 
          onClose={() => setSelectedContent(null)}
          onSocialPost={handleSocialMediaPost}
        />
      )}
    </div>
  );
}

// Content Detail Modal Component
function ContentDetailModal({ content, onClose, onSocialPost }) {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div 
          className="modal-overlay"
          onClick={onClose}
        ></div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

        <div className="modal-content sm:max-w-4xl sm:w-full">
          <div className="absolute top-0 right-0 pt-4 pr-4">
            <button
              type="button"
              className="bg-white dark:bg-dark-800 rounded-md text-gray-400 dark:text-dark-400 hover:text-gray-500 dark:hover:text-dark-300 transition-colors duration-200"
              onClick={onClose}
            >
              <span className="sr-only">Close</span>
              <XCircleIcon className="h-6 w-6" />
            </button>
          </div>

          <div className="bg-white dark:bg-dark-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="w-full">
                <div className="mt-3 sm:mt-0 sm:text-left">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                    {content.type === 'editorial' ? 'Editorial Content' 
                     : content.type === 'match_summary' ? 'Game Summary'
                     : 'Social Media Post'}
                  </h3>
                  
                  <div className="mt-4 space-y-4">
                    {/* Meta information */}
                    <div className="bg-gray-50 dark:bg-dark-700 p-4 rounded-lg border border-gray-200 dark:border-dark-600">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-gray-500 dark:text-dark-400">Match:</span>
                          <p className="text-gray-900 dark:text-white">
                            {content.game_context?.teams?.home || 'Team A'} vs {content.game_context?.teams?.away || 'Team B'}
                          </p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-500 dark:text-dark-400">Generated:</span>
                          <p className="text-gray-900 dark:text-white">
                            {new Date(content.timestamp * 1000).toLocaleString()}
                          </p>
                        </div>
                        <div className="col-span-2">
                          <span className="font-medium text-gray-500 dark:text-dark-400">
                            {content.type === 'match_summary' ? 'Summary Type:' : 'Trigger:'}
                          </span>
                          <p className="text-gray-900 dark:text-white">
                            {content.type === 'match_summary' 
                              ? `${content.content?.type || 'fulltime'} - Covers ${content.content?.highlights_covered || 'N/A'} highlights`
                              : content.trigger_highlight}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Content sections */}
                    {content.type === 'editorial' ? (
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            {content.content.headline}
                          </h4>
                          <div className="prose dark:prose-invert max-w-none">
                            <div className="whitespace-pre-line text-gray-700 dark:text-dark-300">
                              {content.content.body}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2 text-sm">
                          <span className="px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-200 rounded-md">
                            {content.content.word_count} words
                          </span>
                          <span className="px-2 py-1 bg-gray-100 dark:bg-dark-600 text-gray-800 dark:text-dark-200 rounded-md">
                            {content.content.style}
                          </span>
                          <span className="px-2 py-1 bg-gray-100 dark:bg-dark-600 text-gray-800 dark:text-dark-200 rounded-md">
                            {content.content.tone}
                          </span>
                        </div>
                      </div>
                    ) : content.type === 'social_post' ? (
                      <div className="space-y-4">
                        <div className="bg-gray-50 dark:bg-dark-700 p-4 rounded-lg border border-gray-200 dark:border-dark-600">
                          <p className="text-gray-900 dark:text-white">{content.content.text}</p>
                        </div>
                        <div className="flex flex-wrap gap-2 text-sm">
                          <span className="px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-200 rounded-md">
                            {content.content.character_count} characters
                          </span>
                          <span className="px-2 py-1 bg-gray-100 dark:bg-dark-600 text-gray-800 dark:text-dark-200 rounded-md">
                            {content.content.tone}
                          </span>
                          <span className="px-2 py-1 bg-warning-100 dark:bg-warning-900/30 text-warning-800 dark:text-warning-200 rounded-md">
                            {content.content.engagement_potential}
                          </span>
                        </div>
                        
                        {/* Social media posting buttons */}
                        <div className="pt-4 border-t border-gray-200 dark:border-dark-600">
                          <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Post to Social Media:</h5>
                          <div className="flex space-x-3">
                            {content.platforms?.map((platform) => (
                              <button
                                key={platform}
                                onClick={() => onSocialPost(platform, content.content.text, content.id)}
                                className="btn btn-secondary flex items-center space-x-2"
                              >
                                <SocialIcon platform={platform} className="w-4 h-4" />
                                <span className="capitalize">{platform}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      // Match summary content
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            {content.game_context?.teams?.home || 'Team A'} vs {content.game_context?.teams?.away || 'Team B'} - Final Summary
                          </h4>
                          <div className="prose dark:prose-invert max-w-none">
                            <div className="whitespace-pre-line text-gray-700 dark:text-dark-300">
                              {content.content?.content || 'No summary content available'}
                            </div>
                          </div>
                        </div>
                        
                        {content.content?.key_moments && content.content.key_moments.length > 0 && (
                          <div>
                            <h5 className="text-md font-semibold text-gray-900 dark:text-white mb-2">Key Moments</h5>
                            <div className="space-y-2">
                              {content.content.key_moments.map((moment, index) => (
                                <div key={index} className="bg-gray-50 dark:bg-dark-700 p-3 rounded-lg border border-gray-200 dark:border-dark-600">
                                  <p className="text-sm text-gray-700 dark:text-dark-300">{moment}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        <div className="flex flex-wrap gap-2 text-sm">
                          <span className="px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-200 rounded-md">
                            {content.content?.type || 'fulltime'} summary
                          </span>
                          <span className="px-2 py-1 bg-gray-100 dark:bg-dark-600 text-gray-800 dark:text-dark-200 rounded-md">
                            {content.content?.highlights_covered || 0} highlights covered
                          </span>
                          {content.content?.match_rating && (
                            <span className="px-2 py-1 bg-warning-100 dark:bg-warning-900/30 text-warning-800 dark:text-warning-200 rounded-md flex items-center space-x-1">
                              <StarIcon className="h-3 w-3" />
                              <span>{content.content.match_rating}/5.0</span>
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
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