import React from 'react';
import { motion } from 'framer-motion';
import { Bars3Icon, BellIcon, UserIcon } from '@heroicons/react/24/outline';
import { ThemeToggle } from '../ui/ThemeToggle.jsx';
import { DesignThemeSelector } from '../ui/DesignThemeSelector.jsx';
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
    <header
      className="sticky top-0 z-30 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-700"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Mobile menu button */}
          <div className="flex items-center lg:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 focus:outline-none focus:ring-1 focus:ring-brand-500"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Open sidebar</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          {/* Left side - Page breadcrumb/title would go here */}
          <div className="flex-1 flex items-center lg:ml-0">
            {/* This could be dynamic based on current route */}
            <div className="hidden lg:block">
              <nav className="flex" aria-label="Breadcrumb">
                <ol className="flex items-center space-x-2">
                  <li>
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                        Sports Operations
                      </span>
                    </div>
                  </li>
                  <li>
                    <div className="flex items-center">
                      <span className="text-neutral-400 dark:text-neutral-600">/</span>
                      <span className="ml-2 text-sm font-medium text-neutral-900 dark:text-white">
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
            <div className="hidden md:flex items-center space-x-2 px-3 py-1 bg-success-50 dark:bg-success-900/20 text-success-700 dark:text-success-300 border border-success-200 dark:border-success-800 text-xs font-medium">
              <div className="w-2 h-2 bg-success-500 rounded-full" />
              <span>System Operational</span>
            </div>

            {/* Design theme selector */}
            <DesignThemeSelector />
            
            {/* Theme toggle */}
            <ThemeToggle size="sm" />

            {/* Notifications */}
            <div className="relative">
              <button
                type="button"
                className="relative inline-flex items-center justify-center p-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 focus:outline-none focus:ring-1 focus:ring-brand-500"
              >
                <span className="sr-only">View notifications</span>
                <BellIcon className="h-5 w-5" aria-hidden="true" />
                {notifications.length > 0 && (
                  <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-danger-500 ring-2 ring-white dark:ring-neutral-900" />
                )}
              </button>
            </div>

            {/* User menu */}
            <div className="relative">
              <button
                type="button"
                className="flex items-center space-x-3 text-sm p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 focus:outline-none focus:ring-1 focus:ring-brand-500"
              >
                <div className="flex-shrink-0 w-8 h-8 bg-brand-600 rounded-full flex items-center justify-center">
                  <UserIcon className="w-4 h-4 text-white" />
                </div>
                <div className="hidden md:block text-left">
                  <div className="text-sm font-medium text-neutral-900 dark:text-white">
                    {user.name}
                  </div>
                  <div className="text-xs text-neutral-500 dark:text-neutral-400">
                    {user.email}
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}