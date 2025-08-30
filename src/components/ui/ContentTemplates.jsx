import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  DocumentDuplicateIcon,
  DocumentTextIcon,
  ChatBubbleLeftRightIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  StarIcon,
} from '@heroicons/react/24/outline';
import { Button } from './Button.jsx';
import { Badge } from './Badge.jsx';
import { cn } from '../../utils/cn.jsx';

const defaultTemplates = [
  {
    id: 'goal_editorial',
    name: 'Goal Editorial',
    type: 'editorial',
    sport: 'soccer',
    description: 'Professional editorial template for goal highlights',
    template: {
      headline: '[Player Name] Strikes Gold: [Team] Takes the Lead with [Minute]\' Brilliance',
      structure: [
        'Opening statement with context',
        'Goal description and buildup',
        'Player performance analysis',
        'Team impact and momentum shift',
        'Looking ahead implications'
      ],
      tone: 'professional',
      word_count_target: 300,
      key_elements: ['player_name', 'team_name', 'minute', 'score', 'context']
    },
    usage_count: 45,
    last_used: new Date().toISOString(),
    created_by: 'Editorial Team',
    is_favorite: true
  },
  {
    id: 'social_goal',
    name: 'Goal Social Post',
    type: 'social_post',
    sport: 'soccer',
    description: 'Engaging social media template for goal celebrations',
    template: {
      text: '⚽ GOAL! [Player Name] finds the net for [Team]! \n\n[Minute]\' - What a strike! [Context] \n\n[Score] #[Hashtags]',
      character_limit: 280,
      tone: 'exciting',
      platforms: ['twitter', 'instagram'],
      hashtags: ['Goal', 'Soccer', 'LiveFootball'],
      emoji_style: 'moderate'
    },
    usage_count: 78,
    last_used: new Date().toISOString(),
    created_by: 'Social Media Team',
    is_favorite: true
  },
  {
    id: 'halftime_summary',
    name: 'Halftime Summary',
    type: 'match_summary',
    sport: 'soccer',
    description: 'Comprehensive halftime analysis template',
    template: {
      structure: [
        'First half overview and score',
        'Key moments and turning points',
        'Team performance analysis',
        'Player spotlights',
        'Second half predictions'
      ],
      tone: 'analytical',
      word_count_target: 400,
      include_stats: true,
      include_quotes: false
    },
    usage_count: 23,
    last_used: new Date(Date.now() - 86400000).toISOString(),
    created_by: 'Editorial Team',
    is_favorite: false
  }
];

export const ContentTemplateSelector = ({ 
  onSelectTemplate, 
  contentType = 'all',
  sport = 'all',
  className 
}) => {
  const [templates] = useState(defaultTemplates);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const filteredTemplates = templates.filter(template => {
    if (contentType !== 'all' && template.type !== contentType) return false;
    if (sport !== 'all' && template.sport !== sport) return false;
    return true;
  });

  const handleSelectTemplate = (template) => {
    setSelectedTemplate(template);
    if (onSelectTemplate) {
      onSelectTemplate(template);
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'editorial': return DocumentTextIcon;
      case 'social_post': return ChatBubbleLeftRightIcon;
      case 'match_summary': return DocumentDuplicateIcon;
      default: return DocumentTextIcon;
    }
  };

  const getTypeBadge = (type) => {
    switch (type) {
      case 'editorial': return { variant: 'primary', label: 'Editorial' };
      case 'social_post': return { variant: 'success', label: 'Social' };
      case 'match_summary': return { variant: 'warning', label: 'Summary' };
      default: return { variant: 'secondary', label: 'Content' };
    }
  };

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
          Content Templates
        </h3>
        <Button variant="outline" size="sm" leftIcon={<PlusIcon className="h-4 w-4" />}>
          Create Template
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTemplates.map((template, index) => {
          const TypeIcon = getTypeIcon(template.type);
          const typeBadge = getTypeBadge(template.type);
          const isSelected = selectedTemplate?.id === template.id;

          return (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
              className={cn(
                'border rounded-lg p-4 cursor-pointer transition-all duration-200',
                isSelected 
                  ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 shadow-md'
                  : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-sm'
              )}
              onClick={() => handleSelectTemplate(template)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <TypeIcon className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                  {template.is_favorite && (
                    <StarIcon className="h-4 w-4 text-yellow-500 fill-current" />
                  )}
                </div>
                <Badge variant={typeBadge.variant} size="sm">
                  {typeBadge.label}
                </Badge>
              </div>

              <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
                {template.name}
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                {template.description}
              </p>

              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>Used {template.usage_count} times</span>
                <span>by {template.created_by}</span>
              </div>

              {isSelected && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-4 pt-4 border-t border-emerald-200 dark:border-emerald-800"
                >
                  <div className="flex space-x-2">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectTemplate && onSelectTemplate(template);
                      }}
                      className="flex-1"
                    >
                      Use Template
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => e.stopPropagation()}
                      leftIcon={<PencilIcon className="h-3 w-3" />}
                    >
                      Edit
                    </Button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default ContentTemplateSelector;