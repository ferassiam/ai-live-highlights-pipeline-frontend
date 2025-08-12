import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  FolderIcon,
  ArrowDownTrayIcon,
  MagnifyingGlassIcon,
  InformationCircleIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

import { apiService, showSuccessToast, showErrorToast } from '../services/api';
import { FileUpload } from '../components/ui/FileUpload';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { Button } from '../components/ui/Button';

export default function FileManager() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFileType, setSelectedFileType] = useState('all');
  const [sortBy, setSortBy] = useState('modified');
  const [sortOrder, setSortOrder] = useState('desc');

  const queryClient = useQueryClient();

  // Fetch segment files with metadata
  const { data: filesData = [], isLoading, error } = useQuery({
    queryKey: ['segmentFiles'],
    queryFn: () => apiService.getSegmentFilesWithMetadata(),
    refetchInterval: 60000, // Refresh every minute
  });

  // Ensure filesData is always an array
  const files = Array.isArray(filesData) ? filesData : [];

  // Upload schedule file mutation
  const uploadFileMutation = useMutation({
    mutationFn: (file) => apiService.uploadScheduleFile(file),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['segmentFiles'] });
      showSuccessToast(data.message || 'File uploaded successfully');
    },
    onError: (error) => {
      showErrorToast(error.response?.data?.detail || 'Failed to upload file');
    },
  });

  // Download schedule file mutation
  const downloadScheduleMutation = useMutation({
    mutationFn: () => apiService.downloadScheduleFile(),
    onSuccess: (blob) => {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'channel_schedule.json';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      showSuccessToast('File downloaded successfully');
    },
    onError: (error) => {
      showErrorToast('Failed to download file');
    },
  });

  const handleFileUpload = (file) => {
    uploadFileMutation.mutate(file);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const getFileIcon = (fileName) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'json':
        return '📄';
      case 'mp4':
      case 'avi':
      case 'mov':
        return '🎥';
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return '🖼️';
      case 'txt':
      case 'log':
        return '📝';
      default:
        return '📄';
    }
  };

  const getFileType = (fileName) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'json':
        return 'Configuration';
      case 'mp4':
      case 'avi':
      case 'mov':
        return 'Video';
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return 'Image';
      case 'txt':
      case 'log':
        return 'Text';
      default:
        return 'Unknown';
    }
  };

  // Filter and sort files
  const filteredFiles = files
    .filter(file => {
      // Ensure file has required properties
      if (!file || !file.name) return false;
      
      const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = selectedFileType === 'all' || getFileType(file.name).toLowerCase() === selectedFileType;
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      let aValue, bValue;
      
      // Safety checks to ensure objects exist and have required properties
      if (!a || !b) return 0;
      
      switch (sortBy) {
        case 'name':
          aValue = (a.name || '').toLowerCase();
          bValue = (b.name || '').toLowerCase();
          break;
        case 'size':
          aValue = a.size || 0;
          bValue = b.size || 0;
          break;
        case 'modified':
        default:
          aValue = new Date(a.modified_at || 0);
          bValue = new Date(b.modified_at || 0);
          break;
      }

      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

  const fileTypes = ['all', 'configuration', 'video', 'image', 'text'];

  if (error) {
    return (
      <div className="space-y-6">
        <div className="page-header">
          <div>
            <h1 className="page-title flex items-center">
              <FolderIcon className="h-8 w-8 mr-3" />
              File Manager
            </h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-dark-400">
              Manage and browse system files
            </p>
          </div>
        </div>
        
        <div className="bg-danger-50 dark:bg-danger-900/20 border border-danger-200 dark:border-danger-800 rounded-md p-4">
          <div className="flex">
            <InformationCircleIcon className="h-5 w-5 text-danger-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-danger-800 dark:text-danger-200">
                Failed to load files
              </h3>
              <p className="mt-1 text-sm text-danger-700 dark:text-danger-300">
                {error.message || 'Unable to fetch file list'}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="page-header">
        <div>
          <h1 className="page-title flex items-center">
            <FolderIcon className="h-8 w-8 mr-3" />
            File Manager
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-dark-400">
            Manage and browse system files
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            onClick={() => downloadScheduleMutation.mutate()}
            loading={downloadScheduleMutation.isLoading}
          >
            <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
            Download Schedule
          </Button>
          
          <Button
            variant="outline"
            onClick={() => queryClient.invalidateQueries({ queryKey: ['segmentFiles'] })}
          >
            <ArrowPathIcon className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* File Upload */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Upload Files
          </h3>
          <p className="text-sm text-gray-500 dark:text-dark-400">
            Upload schedule files and other configuration files
          </p>
        </div>
        <div className="card-body">
          <FileUpload
            onUpload={handleFileUpload}
            accept=".json,.txt,.log"
            maxSize={10 * 1024 * 1024} // 10MB
            uploading={uploadFileMutation.isLoading}
          />
        </div>
      </div>

      {/* Search and Filters */}
      <div className="card">
        <div className="card-body">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-dark-500" />
                <input
                  type="text"
                  placeholder="Search files..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="form-input pl-10"
                />
              </div>
            </div>

            {/* File Type Filter */}
            <div className="sm:w-48">
              <select
                value={selectedFileType}
                onChange={(e) => setSelectedFileType(e.target.value)}
                className="form-select"
              >
                {fileTypes.map(type => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)} Files
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Options */}
            <div className="sm:w-32">
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [sort, order] = e.target.value.split('-');
                  setSortBy(sort);
                  setSortOrder(order);
                }}
                className="form-select"
              >
                <option value="modified-desc">Latest</option>
                <option value="modified-asc">Oldest</option>
                <option value="name-asc">Name A-Z</option>
                <option value="name-desc">Name Z-A</option>
                <option value="size-desc">Size Large</option>
                <option value="size-asc">Size Small</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* File List */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Files ({filteredFiles.length})
          </h3>
        </div>
        <div className="card-body p-0">
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <LoadingSpinner />
            </div>
          ) : filteredFiles.length === 0 ? (
            <div className="text-center py-12">
              <FolderIcon className="mx-auto h-12 w-12 text-gray-400 dark:text-dark-500" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                {searchTerm || selectedFileType !== 'all' ? 'No matching files' : 'No files found'}
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-dark-400">
                {searchTerm || selectedFileType !== 'all' 
                  ? 'Try adjusting your search or filters'
                  : 'Files will appear here when available'
                }
              </p>
            </div>
          ) : (
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-dark-600">
                <thead className="bg-gray-50 dark:bg-dark-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">
                      Size
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">
                      Modified
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-dark-800 divide-y divide-gray-200 dark:divide-dark-600">
                  {filteredFiles.map((file, index) => (
                    <motion.tr
                      key={file.name || index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                      className="hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="text-lg mr-3">{getFileIcon(file.name || '')}</span>
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {file.name || 'Unknown file'}
                            </div>
                            {file.path && (
                              <div className="text-sm text-gray-500 dark:text-dark-400">
                                {file.path}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-dark-600 text-gray-800 dark:text-dark-200">
                          {getFileType(file.name || '')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-dark-400">
                        {file.size ? formatFileSize(file.size) : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {file.modified_at ? formatDate(file.modified_at) : 'Unknown'}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}