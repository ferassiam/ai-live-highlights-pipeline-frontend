import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  DocumentTextIcon,
  ChatBubbleLeftRightIcon,
  DocumentChartBarIcon,
  EyeIcon,
  CheckCircleIcon,
  XMarkIcon,
  ClockIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import { Button } from './Button.jsx';
import { Input } from './Input.jsx';
import { Textarea } from './Textarea.jsx';
import { Select } from './Select.jsx';
import { Badge } from './Badge.jsx';
import { cn } from '../../utils/cn.jsx';

const contentTypeConfigs = {
  editorial: {
    icon: DocumentTextIcon,
    label: 'Editorial Article',
    fields: ['headline', 'body', 'style', 'tone', 'word_count_target'],
    preview: (content) => content.headline
  },
  social_post: {
    icon: ChatBubbleLeftRightIcon,
    label: 'Social Media Post',
    fields: ['text', 'platforms', 'tone', 'hashtags'],
    preview: (content) => content.text?.substring(0, 100) + '...'
  },
  match_summary: {
    icon: DocumentChartBarIcon,
    label: 'Match Summary',
    fields: ['content', 'type', 'key_moments', 'match_rating'],
    preview: (content) => `${content.type || 'fulltime'} summary`
  }
};

const styleOptions = [
  { value: 'professional', label: 'Professional' },
  { value: 'casual', label: 'Casual' },
  { value: 'analytical', label: 'Analytical' },
  { value: 'dramatic', label: 'Dramatic' }
];

const toneOptions = [
  { value: 'neutral', label: 'Neutral' },
  { value: 'exciting', label: 'Exciting' },
  { value: 'analytical', label: 'Analytical' },
  { value: 'dramatic', label: 'Dramatic' },
  { value: 'humorous', label: 'Humorous' }
];

const platformOptions = [
  { value: 'twitter', label: 'Twitter' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'tiktok', label: 'TikTok' }
];

export const ContentEditor = ({ 
  content, 
  onSave, 
  onCancel, 
  onPreview,
  template = null,
  className 
}) => {
  const [formData, setFormData] = useState(content || {});
  const [isDirty, setIsDirty] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const contentConfig = contentTypeConfigs[formData.type] || contentTypeConfigs.editorial;
  const ContentIcon = contentConfig.icon;

  useEffect(() => {
    if (template) {
      setFormData(prev => ({
        ...prev,
        content: {
          ...prev.content,
          ...template.template
        }
      }));
      setIsDirty(true);
    }
  }, [template]);

  const handleFieldChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      content: {
        ...prev.content,
        [field]: value
      }
    }));
    setIsDirty(true);
    
    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (formData.type === 'editorial') {
      if (!formData.content?.headline?.trim()) {
        errors.headline = 'Headline is required';
      }
      if (!formData.content?.body?.trim()) {
        errors.body = 'Body content is required';
      }
      if (formData.content?.body && formData.content.body.length < 100) {
        errors.body = 'Body must be at least 100 characters';
      }
    } else if (formData.type === 'social_post') {
      if (!formData.content?.text?.trim()) {
        errors.text = 'Post text is required';
      }
      if (formData.content?.text && formData.content.text.length > 280) {
        errors.text = 'Post text must be under 280 characters';
      }
    } else if (formData.type === 'match_summary') {
      if (!formData.content?.content?.trim()) {
        errors.content = 'Summary content is required';
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave && onSave(formData);
    }
  };

  const handlePreview = () => {
    setShowPreview(!showPreview);
    onPreview && onPreview(formData);
  };

  const getCharacterCount = () => {
    if (formData.type === 'social_post') {
      return formData.content?.text?.length || 0;
    }
    if (formData.type === 'editorial') {
      return formData.content?.body?.length || 0;
    }
    return 0;
  };

  const getWordCount = () => {
    if (formData.type === 'editorial') {
      return formData.content?.body?.split(/\s+/).filter(word => word.length > 0).length || 0;
    }
    return 0;
  };

  return (
    <div className={cn('bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm', className)}>
      {/* Header */}
      <div className="p-6 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <ContentIcon className="h-6 w-6 text-slate-600 dark:text-slate-400" />
            <div>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                {content ? 'Edit' : 'Create'} {contentConfig.label}
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {formData.game_context?.teams?.home} vs {formData.game_context?.teams?.away}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {isDirty && (
              <Badge variant="warning" size="sm">
                <ClockIcon className="h-3 w-3 mr-1" />
                Unsaved
              </Badge>
            )}
            <Button
              variant="outline"
              onClick={handlePreview}
              leftIcon={<EyeIcon className="h-4 w-4" />}
            >
              Preview
            </Button>
          </div>
        </div>
      </div>

      {/* Editor Content */}
      <div className="p-6 space-y-6">
        {/* Editorial Fields */}
        {formData.type === 'editorial' && (
          <>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Headline *
              </label>
              <Input
                value={formData.content?.headline || ''}
                onChange={(e) => handleFieldChange('headline', e.target.value)}
                placeholder="Enter compelling headline..."
                error={validationErrors.headline}
                className="text-lg font-semibold"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Article Body *
              </label>
              <Textarea
                value={formData.content?.body || ''}
                onChange={(e) => handleFieldChange('body', e.target.value)}
                placeholder="Write your article content here..."
                error={validationErrors.body}
                rows={12}
                showCharCount
                maxLength={2000}
              />
              <div className="flex items-center justify-between mt-2 text-xs text-slate-500 dark:text-slate-400">
                <span>{getWordCount()} words</span>
                <span>Target: {formData.content?.word_count_target || 300} words</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Style
                </label>
                <Select
                  value={formData.content?.style || 'professional'}
                  onChange={(value) => handleFieldChange('style', value)}
                  options={styleOptions}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Tone
                </label>
                <Select
                  value={formData.content?.tone || 'neutral'}
                  onChange={(value) => handleFieldChange('tone', value)}
                  options={toneOptions}
                />
              </div>
            </div>
          </>
        )}

        {/* Social Post Fields */}
        {formData.type === 'social_post' && (
          <>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Post Content *
              </label>
              <Textarea
                value={formData.content?.text || ''}
                onChange={(e) => handleFieldChange('text', e.target.value)}
                placeholder="Write your social media post..."
                error={validationErrors.text}
                rows={4}
                showCharCount
                maxLength={280}
              />
              <div className="flex items-center justify-between mt-2 text-xs">
                <span className={cn(
                  getCharacterCount() > 280 ? 'text-red-600' : 'text-slate-500 dark:text-slate-400'
                )}>
                  {getCharacterCount()}/280 characters
                </span>
                <span className="text-slate-500 dark:text-slate-400">
                  Optimal: 100-150 characters
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Tone
                </label>
                <Select
                  value={formData.content?.tone || 'exciting'}
                  onChange={(value) => handleFieldChange('tone', value)}
                  options={toneOptions}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Platforms
                </label>
                <div className="space-y-2">
                  {platformOptions.map(platform => (
                    <label key={platform.value} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={(formData.platforms || []).includes(platform.value)}
                        onChange={(e) => {
                          const platforms = formData.platforms || [];
                          const newPlatforms = e.target.checked
                            ? [...platforms, platform.value]
                            : platforms.filter(p => p !== platform.value);
                          setFormData(prev => ({ ...prev, platforms: newPlatforms }));
                          setIsDirty(true);
                        }}
                        className="w-4 h-4 text-emerald-600 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 rounded focus:ring-emerald-500"
                      />
                      <span className="ml-2 text-sm text-slate-700 dark:text-slate-300">
                        {platform.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {/* Match Summary Fields */}
        {formData.type === 'match_summary' && (
          <>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Summary Content *
              </label>
              <Textarea
                value={formData.content?.content || ''}
                onChange={(e) => handleFieldChange('content', e.target.value)}
                placeholder="Write comprehensive match summary..."
                error={validationErrors.content}
                rows={10}
                showCharCount
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Summary Type
                </label>
                <Select
                  value={formData.content?.type || 'fulltime'}
                  onChange={(value) => handleFieldChange('type', value)}
                  options={[
                    { value: 'halftime', label: 'Halftime' },
                    { value: 'fulltime', label: 'Full Time' },
                    { value: 'post_match', label: 'Post Match' }
                  ]}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Match Rating (1-5)
                </label>
                <Input
                  type="number"
                  min="1"
                  max="5"
                  step="0.1"
                  value={formData.content?.match_rating || ''}
                  onChange={(e) => handleFieldChange('match_rating', parseFloat(e.target.value))}
                  placeholder="4.5"
                />
              </div>
            </div>
          </>
        )}

        {/* Assignment and Workflow */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Assigned To
            </label>
            <Select
              value={formData.assigned_to || ''}
              onChange={(value) => setFormData(prev => ({ ...prev, assigned_to: value }))}
              options={[
                { value: '', label: 'Unassigned' },
                { value: 'editor1', label: 'John Smith (Editor)' },
                { value: 'editor2', label: 'Sarah Johnson (Senior Editor)' },
                { value: 'social1', label: 'Mike Chen (Social Media)' },
              ]}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Priority
            </label>
            <Select
              value={formData.priority || 'medium'}
              onChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}
              options={[
                { value: 'low', label: 'Low' },
                { value: 'medium', label: 'Medium' },
                { value: 'high', label: 'High' },
                { value: 'urgent', label: 'Urgent' }
              ]}
            />
          </div>
        </div>
      </div>

      {/* Preview Panel */}
      {showPreview && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="border-t border-slate-200 dark:border-slate-700 p-6 bg-slate-50 dark:bg-slate-800/50"
        >
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            Content Preview
          </h3>
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-4">
            {formData.type === 'editorial' && (
              <div>
                <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                  {formData.content?.headline || 'Untitled Article'}
                </h4>
                <div className="prose dark:prose-invert max-w-none">
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                    {formData.content?.body || 'No content yet...'}
                  </p>
                </div>
              </div>
            )}
            {formData.type === 'social_post' && (
              <div className="bg-slate-100 dark:bg-slate-700 rounded-lg p-4">
                <p className="text-slate-900 dark:text-white">
                  {formData.content?.text || 'No post content yet...'}
                </p>
                {formData.platforms && formData.platforms.length > 0 && (
                  <div className="flex items-center space-x-2 mt-3">
                    <span className="text-xs text-slate-500 dark:text-slate-400">Platforms:</span>
                    {formData.platforms.map(platform => (
                      <Badge key={platform} variant="secondary" size="sm">
                        {platform}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            )}
            {formData.type === 'match_summary' && (
              <div>
                <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                  Match Summary - {formData.content?.type || 'Full Time'}
                </h4>
                <div className="prose dark:prose-invert max-w-none">
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                    {formData.content?.content || 'No summary content yet...'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Footer Actions */}
      <div className="p-6 border-t border-slate-200 dark:border-slate-700 bg-slate-50/30 dark:bg-slate-800/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm text-slate-600 dark:text-slate-400">
            {formData.type === 'editorial' && (
              <span>{getWordCount()} words</span>
            )}
            {formData.type === 'social_post' && (
              <span>{getCharacterCount()} characters</span>
            )}
            <span>Last saved: {formData.updated_at ? new Date(formData.updated_at).toLocaleTimeString() : 'Never'}</span>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              onClick={onCancel}
            >
              Cancel
            </Button>
            <Button
              variant="secondary"
              onClick={handleSave}
              disabled={!isDirty}
            >
              Save Draft
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                if (validateForm()) {
                  setFormData(prev => ({ ...prev, workflow_stage: 'review' }));
                  handleSave();
                }
              }}
              leftIcon={<CheckCircleIcon className="h-4 w-4" />}
            >
              Submit for Review
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentEditor;