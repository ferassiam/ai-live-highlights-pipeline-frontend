import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CloudArrowUpIcon,
  DocumentIcon,
  XMarkIcon,
  CheckCircleIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';
import { cn } from '../../utils/cn';

export function FileUpload({
  onFileSelect,
  onUpload,
  accept = '*/*',
  maxSize = 10 * 1024 * 1024, // 10MB
  multiple = false,
  className = '',
  children,
  disabled = false,
  uploading = false,
  uploadProgress = 0,
  error = null,
  success = false
}) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);

    if (disabled) return;

    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    handleFiles(files);
  };

  const handleFiles = (files) => {
    const validFiles = files.filter(file => {
      if (maxSize && file.size > maxSize) {
        console.error(`File ${file.name} is too large. Maximum size is ${formatFileSize(maxSize)}`);
        return false;
      }
      return true;
    });

    setSelectedFiles(multiple ? [...selectedFiles, ...validFiles] : validFiles);
    if (onFileSelect) {
      onFileSelect(multiple ? [...selectedFiles, ...validFiles] : validFiles[0]);
    }
  };

  const removeFile = (index) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    if (onFileSelect) {
      onFileSelect(multiple ? newFiles : newFiles[0] || null);
    }
  };

  const handleUpload = () => {
    if (onUpload && selectedFiles.length > 0) {
      onUpload(multiple ? selectedFiles : selectedFiles[0]);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (file) => {
    if (file.type.startsWith('image/')) return '🖼️';
    if (file.type.startsWith('video/')) return '🎥';
    if (file.type.startsWith('audio/')) return '🎵';
    if (file.type === 'application/json') return '📄';
    if (file.type === 'text/plain') return '📝';
    return '📄';
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* Upload Area */}
      <motion.div
        className={cn(
          'relative border-2 border-dashed rounded-lg p-6 transition-colors cursor-pointer',
          isDragOver && !disabled
            ? 'border-primary-400 bg-primary-50 dark:bg-primary-900/20'
            : success
            ? 'border-success-400 bg-success-50 dark:bg-success-900/20'
            : error
            ? 'border-danger-400 bg-danger-50 dark:bg-danger-900/20'
            : 'border-gray-300 dark:border-dark-600 hover:border-gray-400 dark:hover:border-dark-500',
          disabled && 'cursor-not-allowed opacity-50'
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !disabled && fileInputRef.current?.click()}
        whileHover={!disabled ? { scale: 1.01 } : {}}
        whileTap={!disabled ? { scale: 0.99 } : {}}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept={accept}
          multiple={multiple}
          onChange={handleFileSelect}
          disabled={disabled}
        />

        <div className="text-center">
          <div className="mx-auto h-12 w-12 flex items-center justify-center">
            {uploading ? (
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            ) : success ? (
              <CheckCircleIcon className="h-8 w-8 text-success-600" />
            ) : error ? (
              <ExclamationCircleIcon className="h-8 w-8 text-danger-600" />
            ) : (
              <CloudArrowUpIcon className="h-8 w-8 text-gray-400" />
            )}
          </div>

          {children || (
            <div className="mt-2">
              <p className="text-sm text-gray-600 dark:text-dark-400">
                {uploading
                  ? 'Uploading...'
                  : success
                  ? 'Upload successful!'
                  : error
                  ? 'Upload failed'
                  : 'Drop files here or click to browse'
                }
              </p>
              {!uploading && !success && !error && (
                <p className="text-xs text-gray-500 dark:text-dark-500 mt-1">
                  {accept !== '*/*' && `Accepts: ${accept} • `}
                  Max size: {formatFileSize(maxSize)}
                  {multiple && ' • Multiple files allowed'}
                </p>
              )}
            </div>
          )}

          {/* Progress bar */}
          {uploading && uploadProgress > 0 && (
            <div className="mt-3 w-full bg-gray-200 dark:bg-dark-600 rounded-full h-2">
              <motion.div
                className="bg-primary-600 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${uploadProgress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          )}

          {/* Error message */}
          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-2 text-sm text-danger-600 dark:text-danger-400"
            >
              {error}
            </motion.p>
          )}
        </div>
      </motion.div>

      {/* Selected Files */}
      <AnimatePresence>
        {selectedFiles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2"
          >
            <h4 className="text-sm font-medium text-gray-900 dark:text-white">
              Selected Files ({selectedFiles.length})
            </h4>
            <div className="space-y-2">
              {selectedFiles.map((file, index) => (
                <motion.div
                  key={`${file.name}-${index}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-dark-700 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">{getFileIcon(file)}</span>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-dark-400">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(index);
                    }}
                    className="p-1 text-gray-400 hover:text-gray-600 dark:text-dark-500 dark:hover:text-dark-300"
                    disabled={disabled || uploading}
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                </motion.div>
              ))}
            </div>

            {/* Upload Button */}
            {onUpload && selectedFiles.length > 0 && !success && (
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={handleUpload}
                disabled={disabled || uploading}
                className="w-full btn btn-primary"
              >
                {uploading ? 'Uploading...' : `Upload ${selectedFiles.length} file${selectedFiles.length === 1 ? '' : 's'}`}
              </motion.button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default FileUpload;