import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { 
  Bars3Icon, 
  BellIcon, 
  UserCircleIcon,
  PowerIcon,
  CogIcon
} from '@heroicons/react/24/outline';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';

import { Logo } from '../ui/Logo';
import { ThemeToggle } from '../ui/ThemeToggle';
import { StatusIndicator } from '../ui/StatusIndicator';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { apiService } from '../../services/api';
import { cn } from '../../utils/cn';


export default function Header({ setSidebarOpen, onLogout }) {
  const [notifications] = useState([
    { id: 1, message: 'Pipeline completed successfully', time: '2 min ago', type: 'success' },
    { id: 2, message: 'New highlights generated', time: '5 min ago', type: 'info' },
  ]);

  // Fetch system status for header display
  const { data: status } = useQuery({
    queryKey: ['systemStatus'],
    queryFn: () => apiService.getStatus(),
    refetchInterval: 30000,
    retry: false,
  });

  const orchestratorRunning = status?.orchestrator_running || false;
  const activeChannels = Object.keys(status?.orchestrator_status?.active_channels || {}).length;
  const activePipelines = status?.orchestrator_status?.active_pipelines?.length || 0;
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Implement global search functionality
      console.log('Searching for:', searchQuery);
    }
  };

  return (
    <motion.div 
      className="sticky top-0 z-40 lg:mx-auto lg:max-w-7xl lg:px-8"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex h-16 items-center gap-x-4 border-b border-gray-200 dark:border-dark-700 bg-white dark:bg-dark-800 px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-0 lg:shadow-none">
        {/* Mobile menu button */}
        <button
          type="button"
          className="-m-2.5 p-2.5 text-gray-700 dark:text-dark-300 lg:hidden"
          onClick={() => setSidebarOpen(true)}
        >
          <span className="sr-only">Open sidebar</span>
          <Bars3Icon className="h-6 w-6" aria-hidden="true" />
        </button>

        {/* Logo for mobile */}
        <div className="lg:hidden">
          <Logo size="sm" variant="icon" />
        </div>

        {/* Separator */}
        <div className="h-6 w-px bg-gray-200 dark:bg-dark-700 lg:hidden" aria-hidden="true" />

        {/* Status indicators */}
        <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
          <div className="flex items-center gap-x-4 lg:gap-x-6">
            {/* Orchestrator status */}
            <StatusIndicator 
              status={orchestratorRunning ? 'running' : 'stopped'}
              showText={true}
            />

            {/* Active channels/pipelines */}
            {orchestratorRunning && (
              <>
                <div className="hidden sm:flex items-center gap-x-2">
                  <Badge variant="secondary">
                    Channels: {activeChannels}
                  </Badge>
                </div>
                <div className="hidden sm:flex items-center gap-x-2">
                  <Badge variant="secondary">
                    Pipelines: {activePipelines}
                  </Badge>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-x-4 lg:gap-x-6">
          {/* Theme toggle */}
          <ThemeToggle size="sm" />

          {/* Notifications */}
          <Menu as="div" className="relative">
            <Menu.Button className="-m-2.5 p-2.5 text-gray-400 dark:text-dark-400 hover:text-gray-500 dark:hover:text-dark-300">
              <span className="sr-only">View notifications</span>
              <BellIcon className="h-6 w-6" aria-hidden="true" />
              {notifications.length > 0 && (
                <motion.span 
                  className="absolute -top-1 -right-1 h-4 w-4 bg-danger-500 text-white text-xs rounded-full flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                >
                  {notifications.length}
                </span>
              )}
            </Menu.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 z-10 mt-2.5 w-80 origin-top-right rounded-md bg-white dark:bg-dark-800 py-2 shadow-lg ring-1 ring-gray-900/5 dark:ring-white/10 focus:outline-none">
                <div className="px-4 py-2 border-b border-gray-200 dark:border-dark-700">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">Notifications</h3>
                </div>
                {notifications.length === 0 ? (
                  <div className="px-4 py-3 text-sm text-gray-500 dark:text-dark-400">No new notifications</div>
                ) : (
                  notifications.map((notification) => (
                    <Menu.Item key={notification.id}>
                      <motion.div 
                        className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-dark-700 cursor-pointer"
                        whileHover={{ backgroundColor: 'rgba(0,0,0,0.05)' }}
                      >
                        <p className="text-sm text-gray-900 dark:text-white">{notification.message}</p>
                        <p className="text-xs text-gray-500 dark:text-dark-400 mt-1">{notification.time}</p>
                      </motion.div>
                    </Menu.Item>
                  ))
                )}
              </Menu.Items>
            </Transition>
          </Menu>

          {/* Separator */}
          <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200 dark:lg:bg-dark-700" aria-hidden="true" />

          {/* Profile dropdown */}
          <Menu as="div" className="relative">
            <Menu.Button className="-m-1.5 flex items-center p-1.5">
              <span className="sr-only">Open user menu</span>
              <UserCircleIcon className="h-8 w-8 text-gray-400 dark:text-dark-400" />
              <span className="hidden lg:flex lg:items-center">
                <span className="ml-4 text-sm font-semibold leading-6 text-gray-900 dark:text-white" aria-hidden="true">
                  API User
                </span>
              </span>
            </Menu.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white dark:bg-dark-800 py-2 shadow-lg ring-1 ring-gray-900/5 dark:ring-white/10 focus:outline-none">
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={cn(
                        active ? 'bg-gray-50 dark:bg-dark-700' : '',
                        'flex w-full items-center px-3 py-1 text-sm leading-6 text-gray-900 dark:text-white'
                      )}
                    >
                      <CogIcon className="mr-2 h-4 w-4" />
                      Settings
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={onLogout}
                      className={cn(
                        active ? 'bg-gray-50 dark:bg-dark-700' : '',
                        'flex w-full items-center px-3 py-1 text-sm leading-6 text-gray-900 dark:text-white'
                      )}
                    >
                      <PowerIcon className="mr-2 h-4 w-4" />
                      Sign out
                    </button>
                  )}
                </Menu.Item>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </div>
    </motion.div>
}