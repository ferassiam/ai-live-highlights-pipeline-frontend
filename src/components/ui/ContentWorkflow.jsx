import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DocumentTextIcon,
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  UserIcon,
  ChatBubbleLeftRightIcon,
  ArrowRightIcon,
  PencilIcon,
  ShareIcon,
} from '@heroicons/react/24/outline';
import { Badge } from './Badge.jsx';
import { Button } from './Button.jsx';
import { cn } from '../../utils/cn.jsx';

const workflowStages = [
  { id: 'draft', name: 'Draft', icon: PencilIcon, color: 'slate' },
  { id: 'review', name: 'Review', icon: EyeIcon, color: 'blue' },
  { id: 'approved', name: 'Approved', icon: CheckCircleIcon, color: 'emerald' },
  { id: 'published', name: 'Published', icon: ShareIcon, color: 'purple' },
  { id: 'rejected', name: 'Rejected', icon: XCircleIcon, color: 'red' },
];

const getStageConfig = (stage) => {
  return workflowStages.find(s => s.id === stage) || workflowStages[0];
};

export const ContentWorkflowCard = ({ 
  content, 
  onStageChange, 
  onEdit, 
  onView, 
  onComment,
  currentUser = { role: 'editor' },
  className 
}) => {
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  
  const stageConfig = getStageConfig(content.workflow_stage || 'draft');
  const StageIcon = stageConfig.icon;
  
  const canEdit = content.workflow_stage === 'draft' || currentUser.role === 'admin';
  const canApprove = currentUser.role === 'editor' || currentUser.role === 'admin';
  const canPublish = content.workflow_stage === 'approved' && (currentUser.role === 'editor' || currentUser.role === 'admin');

  const handleStageChange = (newStage) => {
    if (onStageChange) {
      onStageChange(content.id, newStage);
    }
  };

  const handleAddComment = () => {
    if (newComment.trim() && onComment) {
      onComment(content.id, newComment.trim());
      setNewComment('');
    }
  };

  const formatTimestamp = (timestamp) => {
    return new Date(typeof timestamp === 'number' ? timestamp * 1000 : timestamp).toLocaleString();
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={cn(
        'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm hover:shadow-md transition-all duration-200',
        className
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <DocumentTextIcon className="h-5 w-5 text-slate-500 dark:text-slate-400" />
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                {content.type === 'editorial' ? content.content?.headline 
                 : content.type === 'match_summary' ? `Match Summary: ${content.game_context?.teams?.home} vs ${content.game_context?.teams?.away}`
                 : content.content?.text?.substring(0, 60) + '...'}
              </h3>
            </div>
            <div className="flex items-center space-x-4 text-sm text-slate-600 dark:text-slate-400">
              <span>{content.game_context?.teams?.home} vs {content.game_context?.teams?.away}</span>
              <span>•</span>
              <span>{formatTimestamp(content.timestamp)}</span>
              {content.assigned_to && (
                <>
                  <span>•</span>
                  <div className="flex items-center space-x-1">
                    <UserIcon className="h-4 w-4" />
                    <span>{content.assigned_to}</span>
                  </div>
                </>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Badge 
              variant={stageConfig.color === 'slate' ? 'secondary' : stageConfig.color === 'emerald' ? 'success' : stageConfig.color === 'red' ? 'danger' : 'primary'}
              size="sm"
            >
              <StageIcon className="h-3 w-3 mr-1" />
              {stageConfig.name}
            </Badge>
            {content.comments && content.comments.length > 0 && (
              <button
                onClick={() => setShowComments(!showComments)}
                className="flex items-center space-x-1 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
              >
                <ChatBubbleLeftRightIcon className="h-4 w-4" />
                <span className="text-xs">{content.comments.length}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content Preview */}
      <div className="p-4">
        <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4 mb-4">
          <p className="text-sm text-slate-700 dark:text-slate-300 line-clamp-3">
            {content.type === 'editorial' ? content.content?.body?.substring(0, 200) + '...'
             : content.type === 'social_post' ? content.content?.text
             : content.content?.content?.substring(0, 200) + '...'}
          </p>
        </div>

        {/* Workflow Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onView && onView(content)}
              leftIcon={<EyeIcon className="h-4 w-4" />}
            >
              View
            </Button>
            {canEdit && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit && onEdit(content)}
                leftIcon={<PencilIcon className="h-4 w-4" />}
              >
                Edit
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowComments(!showComments)}
              leftIcon={<ChatBubbleLeftRightIcon className="h-4 w-4" />}
            >
              Comment
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            {content.workflow_stage === 'draft' && canApprove && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleStageChange('review')}
                leftIcon={<ArrowRightIcon className="h-4 w-4" />}
              >
                Send for Review
              </Button>
            )}
            {content.workflow_stage === 'review' && canApprove && (
              <>
                <Button
                  variant="success"
                  size="sm"
                  onClick={() => handleStageChange('approved')}
                  leftIcon={<CheckCircleIcon className="h-4 w-4" />}
                >
                  Approve
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleStageChange('rejected')}
                  leftIcon={<XCircleIcon className="h-4 w-4" />}
                >
                  Reject
                </Button>
              </>
            )}
            {canPublish && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleStageChange('published')}
                leftIcon={<ShareIcon className="h-4 w-4" />}
              >
                Publish
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Comments Section */}
      <AnimatePresence>
        {showComments && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-slate-200 dark:border-slate-700 overflow-hidden"
          >
            <div className="p-4 space-y-4">
              {/* Existing Comments */}
              {content.comments && content.comments.length > 0 && (
                <div className="space-y-3">
                  {content.comments.map((comment, index) => (
                    <div key={index} className="flex space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-slate-200 dark:bg-slate-600 rounded-full flex items-center justify-center">
                          <UserIcon className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-sm font-medium text-slate-900 dark:text-white">
                            {comment.author || 'Team Member'}
                          </span>
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            {formatTimestamp(comment.timestamp)}
                          </span>
                        </div>
                        <p className="text-sm text-slate-700 dark:text-slate-300">
                          {comment.text}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Add Comment */}
              <div className="flex space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center">
                    <UserIcon className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                </div>
                <div className="flex-1">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    rows={2}
                  />
                  <div className="flex justify-end mt-2">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={handleAddComment}
                      disabled={!newComment.trim()}
                    >
                      Add Comment
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ContentWorkflowCard;