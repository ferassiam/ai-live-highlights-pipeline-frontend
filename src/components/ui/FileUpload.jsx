import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CloudArrowUpIcon,
  DocumentIcon,
  XMarkIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  PhotoIcon,
  FilmIcon,
  SpeakerWaveIcon
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
    if (file.type.startsWith('image/')) return <PhotoIcon className="h-4 w-4 text-info-600" />;
    if (file.type.startsWith('video/')) return <FilmIcon className="h-4 w-4 text-warning-600" />;
    if (file.type.startsWith('audio/')) return <SpeakerWaveIcon className="h-4 w-4 text-success-600" />;
    return <DocumentIcon className="h-4 w-4 text-slate-600" />;
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* Upload Area */}
      <motion.div
        className={cn(
          'relative border-2 border-dashed rounded-lg p-8 transition-all duration-200 cursor-pointer',
          'bg-slate-50 dark:bg-slate-900',
          isDragOver && !disabled
            ? 'border-primary-400 bg-primary-50 dark:bg-primary-950/30 scale-[1.02]'
            : success
            ? 'border-success-400 bg-success-50 dark:bg-success-950/30'
            : error
            ? 'border-danger-400 bg-danger-50 dark:bg-danger-950/30'
            : 'border-stone-300 dark:border-stone-600 hover:border-stone-400 dark:hover:border-stone-500',
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
          <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800">
            {uploading ? (
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary-500 border-r-transparent"></div>
            ) : success ? (
              <CheckCircleIcon className="h-8 w-8 text-success-600" />
            ) : error ? (
              <ExclamationCircleIcon className="h-8 w-8 text-danger-600" />
            ) : (
              <CloudArrowUpIcon className="h-8 w-8 text-slate-500" />
            )}
          </div>

          {children || (
            <div className="mt-4">
              <h3 className="font-subheading text-slate-900 dark:text-slate-100 tracking-tight">
                {uploading
                  ? 'Uploading files...'
                  : success
                  ? 'Upload successful!'
                  : error
                  ? 'Upload failed'
                  : 'Drop files to upload'
                }
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                {uploading
                  ? 'Please wait while your files are being uploaded'
                  : success
                  ? 'Your files have been uploaded successfully'
                  : error
                  ? 'Please try again or check your file format'
                  : 'or click to browse from your computer'
                }
              </p>
              {!uploading && !success && !error && (
                <div className="mt-2 text-xs text-slate-500 dark:text-slate-400 space-y-1">
                  {accept !== '*/*' && (
                    <div>Accepted formats: <span className="font-medium">{accept}</span></div>
                  )}
                  <div>Maximum file size: <span className="font-medium">{formatFileSize(maxSize)}</span></div>
                  {multiple && <div>Multiple files allowed</div>}
                </div>
              )}
            </div>
          )}

          {/* Progress bar */}
          {uploading && uploadProgress > 0 && (
            <div className="mt-4 w-full">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-slate-600 dark:text-slate-400">Progress</span>
                <span className="font-medium text-primary-600 tabular-nums">{uploadProgress}%</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                <motion.div
                  className="bg-primary-500 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${uploadProgress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
          )}

          {/* Error message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 p-3 bg-danger-50 dark:bg-danger-950/30 border border-danger-200 dark:border-danger-800 rounded-lg"
            >
              <p className="text-sm text-danger-700 dark:text-danger-300 font-medium">
                {error}
              </p>
            </motion.div>
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
            <h4 className="text-sm font-subheading text-slate-900 dark:text-slate-100 tracking-tight">
              Selected Files ({selectedFiles.length})
            </h4>
            <div className="space-y-2">
              {selectedFiles.map((file, index) => (
                <motion.div
                  key={`${file.name}-${index}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex items-center justify-between p-4 bg-slate-100 dark:bg-slate-800 border border-stone-200 dark:border-stone-600 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-50 dark:bg-slate-700 rounded-md">
                      {getFileIcon(file)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-100 tracking-tight">
                        {file.name}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
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
                    className="p-2 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md transition-colors"
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
                className={cn(
                  'w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-subheading tracking-tight transition-all duration-200',
                  'bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-700',
                  'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
                  'focus:ring-offset-slate-50 dark:focus:ring-offset-slate-950',
                  'disabled:opacity-50 disabled:cursor-not-allowed',
                  'shadow-subtle hover:shadow-elevation'
                )}
              >
                {uploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-r-transparent" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <CloudArrowUpIcon className="h-4 w-4" />
                    Upload {selectedFiles.length} file{selectedFiles.length === 1 ? '' : 's'}
                  </>
                )}
              </motion.button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default FileUpload;