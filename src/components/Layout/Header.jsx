import React from 'react';
import { motion } from 'framer-motion';
import { Bars3Icon, BellIcon, UserIcon } from '@heroicons/react/24/outline';
import { ThemeToggle } from '../ui/ThemeToggle.jsx';
import { Button } from '../ui/Button.jsx';
import { cn } from '../../utils/cn.jsx';

export function Header({ setSidebarOpen }) {
  // Mock user data - in real app this would come from auth context
  const user = {
    name: 'Operations Team',
    email: 'ops@mediakind.com',
    avatar: null
  };

  const notifications = [
    { id: 1, title: 'Pipeline 3 completed', time: '2 min ago', type: 'success' },
    { id: 2, title: 'Channel 1 reconnected', time: '5 min ago', type: 'info' },
    { id: 3, title: 'New highlights generated', time: '12 min ago', type: 'success' },
  ];

  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="sticky top-0 z-30 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Mobile menu button */}
          <div className="flex items-center lg:hidden">
            <motion.button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-xl text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              onClick={() => setSidebarOpen(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="sr-only">Open sidebar</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </motion.button>
          </div>

          {/* Left side - Page breadcrumb/title would go here */}
          <div className="flex-1 flex items-center lg:ml-0">
            {/* This could be dynamic based on current route */}
            <div className="hidden lg:block">
              <nav className="flex" aria-label="Breadcrumb">
                <ol className="flex items-center space-x-2">
                  <li>
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Sports Operations
                      </span>
                    </div>
                  </li>
                  <li>
                    <div className="flex items-center">
                      <span className="text-gray-400 dark:text-gray-600">/</span>
                      <span className="ml-2 text-sm font-medium text-gray-900 dark:text-white">
                        Live Highlights Pipeline
                      </span>
                    </div>
                  </li>
                </ol>
              </nav>
            </div>
          </div>

          {/* Right side - Actions */}
          <div className="flex items-center space-x-3">
            
            {/* System status indicator */}
            <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-full text-xs font-medium">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span>System Operational</span>
            </div>

            {/* Theme toggle */}
            <ThemeToggle size="sm" />

            {/* Notifications */}
            <div className="relative">
              <motion.button
                type="button"
                className="relative inline-flex items-center justify-center p-2 rounded-xl text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="sr-only">View notifications</span>
                <BellIcon className="h-5 w-5" aria-hidden="true" />
                {notifications.length > 0 && (
                  <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white dark:ring-gray-900" />
                )}
              </motion.button>
            </div>

            {/* User menu */}
            <div className="relative">
              <motion.button
                type="button"
                className="flex items-center space-x-3 text-sm rounded-xl p-2 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <UserIcon className="w-4 h-4 text-white" />
                </div>
                <div className="hidden md:block text-left">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {user.name}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {user.email}
                  </div>
                </div>
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  );
}