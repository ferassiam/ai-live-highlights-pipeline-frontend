import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

export function CodeEditor({ 
  value = '', 
  onChange, 
  language = 'json',
  placeholder = '',
  height = '300px',
  readOnly = false,
  className = '',
  showLineNumbers = false,
  error = null
}) {
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef(null);

  const handleChange = (e) => {
    if (onChange && !readOnly) {
      onChange(e.target.value);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      const newValue = value.substring(0, start) + '  ' + value.substring(end);
      
      if (onChange && !readOnly) {
        onChange(newValue);
        // Set cursor position after the inserted spaces
        setTimeout(() => {
          e.target.selectionStart = e.target.selectionEnd = start + 2;
        }, 0);
      }
    }
  };

  const formatValue = () => {
    if (language === 'json' && value) {
      try {
        const parsed = JSON.parse(value);
        return JSON.stringify(parsed, null, 2);
      } catch {
        return value;
      }
    }
    return value;
  };

  const handleFormat = () => {
    if (language === 'json' && onChange && !readOnly) {
      try {
        const formatted = formatValue();
        onChange(formatted);
      } catch (error) {
        console.error('Failed to format JSON:', error);
      }
    }
  };

  const getLanguageLabel = () => {
    const labels = {
      json: 'JSON',
      javascript: 'JavaScript',
      python: 'Python',
      sql: 'SQL',
      yaml: 'YAML',
      markdown: 'Markdown'
    };
    return labels[language] || language.toUpperCase();
  };

  return (
    <motion.div
      className={cn('relative border rounded-lg overflow-hidden', className, {
        'border-primary-300 dark:border-primary-600': isFocused && !error,
        'border-danger-300 dark:border-danger-600': error,
        'border-gray-200 dark:border-dark-600': !isFocused && !error
      })}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 bg-gray-50 dark:bg-dark-700 border-b border-gray-200 dark:border-dark-600">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-medium text-gray-500 dark:text-dark-400">
            {getLanguageLabel()}
          </span>
          {readOnly && (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 dark:bg-dark-600 text-gray-800 dark:text-dark-200">
              Read-only
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          {language === 'json' && !readOnly && (
            <button
              type="button"
              onClick={handleFormat}
              className="text-xs text-gray-500 dark:text-dark-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              Format
            </button>
          )}
          <span className="text-xs text-gray-400 dark:text-dark-500">
            {value.split('\n').length} lines
          </span>
        </div>
      </div>

      {/* Editor */}
      <div className="relative" style={{ height }}>
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          readOnly={readOnly}
          spellCheck={false}
          className={cn(
            'w-full h-full p-4 border-none outline-none resize-none',
            'bg-white dark:bg-dark-800 text-gray-900 dark:text-white',
            'font-mono text-sm leading-relaxed',
            'placeholder-gray-400 dark:placeholder-dark-500',
            {
              'cursor-not-allowed bg-gray-50 dark:bg-dark-700/50': readOnly
            }
          )}
          style={{
            tabSize: 2,
            lineHeight: 1.5
          }}
        />

        {showLineNumbers && value && (
          <div className="absolute left-0 top-0 p-4 pointer-events-none select-none">
            <div className="font-mono text-sm text-gray-400 dark:text-dark-500 leading-relaxed">
              {value.split('\n').map((_, index) => (
                <div key={index} className="text-right pr-2" style={{ minWidth: '2em' }}>
                  {index + 1}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Error message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-3 py-2 bg-danger-50 dark:bg-danger-900/20 border-t border-danger-200 dark:border-danger-800"
        >
          <p className="text-sm text-danger-600 dark:text-danger-400">{error}</p>
        </motion.div>
      )}
    </motion.div>
  );
}

export default CodeEditor;