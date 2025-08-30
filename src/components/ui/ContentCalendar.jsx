import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CalendarIcon,
  ClockIcon,
  DocumentTextIcon,
  ChatBubbleLeftRightIcon,
  DocumentChartBarIcon,
} from '@heroicons/react/24/outline';
import { Badge } from './Badge.jsx';
import { Button } from './Button.jsx';
import { cn } from '../../utils/cn.jsx';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const getContentTypeConfig = (type) => {
  const configs = {
    editorial: { icon: DocumentTextIcon, color: 'blue', label: 'Editorial' },
    social_post: { icon: ChatBubbleLeftRightIcon, color: 'emerald', label: 'Social' },
    match_summary: { icon: DocumentChartBarIcon, color: 'purple', label: 'Summary' },
  };
  return configs[type] || configs.editorial;
};

export const ContentCalendar = ({ 
  contentItems = [], 
  onDateSelect, 
  onContentSelect,
  selectedDate,
  className 
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('month'); // 'month' | 'week'

  // Generate calendar data
  const calendarData = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const current = new Date(startDate);
    
    while (current <= lastDay || current.getDay() !== 0) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    
    return days;
  }, [currentDate]);

  // Group content by date
  const contentByDate = useMemo(() => {
    const grouped = {};
    
    contentItems.forEach(item => {
      const date = new Date(typeof item.timestamp === 'number' ? item.timestamp * 1000 : item.timestamp);
      const dateKey = date.toDateString();
      
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(item);
    });
    
    return grouped;
  }, [contentItems]);

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + direction);
      return newDate;
    });
  };

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isCurrentMonth = (date) => {
    return date.getMonth() === currentDate.getMonth();
  };

  const isSelected = (date) => {
    return selectedDate && date.toDateString() === selectedDate.toDateString();
  };

  const getDateContent = (date) => {
    return contentByDate[date.toDateString()] || [];
  };

  const handleDateClick = (date) => {
    if (onDateSelect) {
      onDateSelect(date);
    }
  };

  return (
    <div className={cn('bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm', className)}>
      {/* Calendar Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              Content Calendar
            </h3>
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === 'month' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setViewMode('month')}
              >
                Month
              </Button>
              <Button
                variant={viewMode === 'week' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setViewMode('week')}
              >
                Week
              </Button>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateMonth(-1)}
              leftIcon={<ChevronLeftIcon className="h-4 w-4" />}
            />
            <h4 className="text-lg font-semibold text-slate-900 dark:text-white min-w-[200px] text-center">
              {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateMonth(1)}
              leftIcon={<ChevronRightIcon className="h-4 w-4" />}
            />
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="p-4">
        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {DAYS.map(day => (
            <div key={day} className="p-2 text-center text-sm font-medium text-slate-600 dark:text-slate-400">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-1">
          {calendarData.map((date, index) => {
            const dayContent = getDateContent(date);
            const isCurrentMonthDay = isCurrentMonth(date);
            const isTodayDate = isToday(date);
            const isSelectedDate = isSelected(date);

            return (
              <motion.div
                key={date.toISOString()}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.01, duration: 0.2 }}
                className={cn(
                  'min-h-[100px] p-2 border border-slate-200 dark:border-slate-700 rounded-lg cursor-pointer transition-all duration-200',
                  isCurrentMonthDay 
                    ? 'bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                    : 'bg-slate-50 dark:bg-slate-900/50 text-slate-400 dark:text-slate-500',
                  isTodayDate && 'ring-2 ring-emerald-500 bg-emerald-50 dark:bg-emerald-900/20',
                  isSelectedDate && 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20',
                  dayContent.length > 0 && 'shadow-sm'
                )}
                onClick={() => handleDateClick(date)}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={cn(
                    'text-sm font-medium',
                    isTodayDate ? 'text-emerald-700 dark:text-emerald-300' : 'text-slate-900 dark:text-white'
                  )}>
                    {date.getDate()}
                  </span>
                  {dayContent.length > 0 && (
                    <Badge variant="secondary" size="sm">
                      {dayContent.length}
                    </Badge>
                  )}
                </div>

                {/* Content Items */}
                <div className="space-y-1">
                  {dayContent.slice(0, 3).map((item, itemIndex) => {
                    const config = getContentTypeConfig(item.type);
                    const Icon = config.icon;

                    return (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: itemIndex * 0.05 }}
                        className={cn(
                          'flex items-center space-x-1 p-1 rounded text-xs cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700',
                          config.color === 'blue' && 'text-blue-700 dark:text-blue-300',
                          config.color === 'emerald' && 'text-emerald-700 dark:text-emerald-300',
                          config.color === 'purple' && 'text-purple-700 dark:text-purple-300'
                        )}
                        onClick={(e) => {
                          e.stopPropagation();
                          onContentSelect && onContentSelect(item);
                        }}
                      >
                        <Icon className="h-3 w-3 flex-shrink-0" />
                        <span className="truncate">
                          {item.type === 'editorial' ? item.content?.headline?.substring(0, 20) + '...'
                           : item.type === 'social_post' ? item.content?.text?.substring(0, 20) + '...'
                           : 'Summary'}
                        </span>
                      </motion.div>
                    );
                  })}
                  {dayContent.length > 3 && (
                    <div className="text-xs text-slate-500 dark:text-slate-400 text-center">
                      +{dayContent.length - 3} more
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-xs">
            <div className="flex items-center space-x-1">
              <DocumentTextIcon className="h-3 w-3 text-blue-600" />
              <span className="text-slate-600 dark:text-slate-400">Editorial</span>
            </div>
            <div className="flex items-center space-x-1">
              <ChatBubbleLeftRightIcon className="h-3 w-3 text-emerald-600" />
              <span className="text-slate-600 dark:text-slate-400">Social</span>
            </div>
            <div className="flex items-center space-x-1">
              <DocumentChartBarIcon className="h-3 w-3 text-purple-600" />
              <span className="text-slate-600 dark:text-slate-400">Summary</span>
            </div>
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Click dates to view content
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentCalendar;