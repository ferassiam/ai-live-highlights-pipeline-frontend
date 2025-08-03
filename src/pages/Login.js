import React, { useState } from 'react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { Logo } from '../components/ui/Logo';
import { Button } from '../components/ui/Button';
import { Input, FormField } from '../components/ui/Input';
import { ThemeToggle } from '../components/ui/ThemeToggle';
import { showErrorToast, showSuccessToast } from '../services/api';

const schema = yup.object({
  apiKey: yup.string().required('API key is required').min(1, 'API key cannot be empty'),
});
export default function Login({ onLogin }) {
  const [showApiKey, setShowApiKey] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      await onLogin(data.apiKey.trim());
      showSuccessToast('Successfully logged in');
    } catch (error) {
      showErrorToast('Invalid API key. Please check your credentials.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-900 py-12 px-4 sm:px-6 lg:px-8">
      {/* Theme toggle in top right */}
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      
      <div className="max-w-md w-full space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="flex justify-center mb-6">
            <Logo size="lg" />
          </div>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-dark-300">
            Enter your API key to access the dashboard
          </p>
        </motion.div>
        
        <motion.form 
          className="mt-8 space-y-6" 
          onSubmit={handleSubmit(onSubmit)}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <FormField
            label="API Key"
            error={errors.apiKey?.message}
          >
            <div className="relative">
              <Input
                {...register('apiKey')}
                type={showApiKey ? 'text' : 'password'}
                placeholder="Enter your API key"
                disabled={isSubmitting}
                error={errors.apiKey}
                className="pr-10"
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
          </FormField>

          <Button
            type="submit"
            disabled={isSubmitting}
            loading={isSubmitting}
            className="w-full"
            size="lg"
          >
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </Button>
        </motion.form>

        <motion.div 
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
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
              <p>🔗 Make sure the API server is running</p>
              <p>📚 Check the documentation for setup instructions</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

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