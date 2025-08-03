import React, { useState } from 'react';
import { SparklesIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { showErrorToast, showSuccessToast } from '../services/api';

export default function Login({ onLogin }) {
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!apiKey.trim()) {
      showErrorToast('Please enter your API key');
      return;
    }

    setIsLoading(true);
    
    try {
      await onLogin(apiKey.trim());
      showSuccessToast('Successfully logged in');
    } catch (error) {
      showErrorToast('Invalid API key. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 bg-primary-600 rounded-lg flex items-center justify-center">
            <SparklesIcon className="h-8 w-8 text-white" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Live Highlights Dashboard
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-dark-300">
            Enter your API key to access the dashboard
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="api-key" className="sr-only">
              API Key
            </label>
            <div className="relative">
              <input
                id="api-key"
                name="api-key"
                type={showApiKey ? 'text' : 'password'}
                autoComplete="current-password"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 pr-10 border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-800 placeholder-gray-500 dark:placeholder-dark-400 text-gray-900 dark:text-white focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                placeholder="Enter your API key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                disabled={isLoading}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowApiKey(!showApiKey)}
              >
                {showApiKey ? (
                  <EyeSlashIcon className="h-5 w-5 text-gray-400 dark:text-dark-400" />
                ) : (
                  <EyeIcon className="h-5 w-5 text-gray-400 dark:text-dark-400" />
                )}
              </button>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Signing in...
                </div>
              ) : (
                'Sign in'
              )}
            </button>
          </div>

          <div className="text-center">
            <div className="text-sm text-gray-600 dark:text-dark-300">
              <p className="mb-2">Don't have an API key?</p>
              <div className="bg-gray-100 dark:bg-dark-700 rounded-md p-3 text-left">
                <p className="text-xs font-mono break-all text-gray-800 dark:text-dark-200">
                  Set the <code className="bg-gray-200 dark:bg-dark-600 text-gray-800 dark:text-dark-200 px-1 rounded">API_KEY</code> environment variable in your API server configuration.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <div className="text-xs text-gray-500 dark:text-dark-400 space-y-1">
              <p>🔗 Make sure the API server is running on port 8000</p>
              <p>📚 Check the documentation for setup instructions</p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}