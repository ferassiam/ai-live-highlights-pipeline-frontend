import React from 'react';
import { motion } from 'framer-motion';
import { Bars3Icon, BellIcon, UserIcon } from '@heroicons/react/24/outline';
import { ThemeToggle } from '../ui/ThemeToggle.jsx';
import { DesignThemeSelector } from '../ui/DesignThemeSelector.jsx';
import { Button } from '../ui/Button.jsx';
import { Logo } from '../ui/Logo.jsx';
import { Badge } from '../ui/Badge.jsx';
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
      className="sticky top-0 z-30 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Mobile menu button */}
          <div className="flex items-center lg:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-md"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Open sidebar</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>
            <div className="ml-3">
              <Logo size="sm" />
            </div>
          </div>

          {/* Left side - Brand and system status */}
          <div className="flex-1 flex items-center lg:ml-0">
            <div className="hidden lg:block">
              <Logo />
            </div>
          </div>

          {/* Right side - Actions */}
          <div className="flex items-center space-x-3">
            
            {/* System status indicator */}
            <div className="hidden md:flex items-center space-x-2 px-3 py-1 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded-full text-xs font-medium">
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
                className="relative inline-flex items-center justify-center p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-md"
              >
                <span className="sr-only">View notifications</span>
                <BellIcon className="h-5 w-5" aria-hidden="true" />
                {notifications.length > 0 && (
                  <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-danger-500 ring-2 ring-white dark:ring-slate-900" />
                )}
              </button>
            </div>

            {/* User menu */}
            <div className="relative">
              <button
                type="button"
                className="flex items-center space-x-3 text-sm p-2 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-md"
              >
                <div className="flex-shrink-0 w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center">
                  <UserIcon className="w-4 h-4 text-white" />
                </div>
                <div className="hidden md:block text-left">
                  <div className="text-sm font-medium text-slate-900 dark:text-white">
                    {user.name}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
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