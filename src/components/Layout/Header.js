import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Bars3Icon, 
  BellIcon, 
  UserCircleIcon,
  PowerIcon,
  CogIcon,
  MagnifyingGlassIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { motion } from 'framer-motion';

import { Logo } from '../ui/Logo';
import { ThemeToggle } from '../ui/ThemeToggle';
import { StatusIndicator } from '../ui/StatusIndicator';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { apiService } from '../../services/api';
import { cn } from '../../utils/cn';


export default function Header({ 
  setSidebarOpen, 
  onLogout, 
  breadcrumbs = [],
  searchValue = '',
  onSearch = null,
  quickActions = []
}) {
  const [notifications] = useState([
    { id: 1, message: 'Pipeline started successfully', time: '2 min ago', type: 'success' },
    { id: 2, message: 'New highlights generated', time: '5 min ago', type: 'info' },
    { id: 3, message: 'Channel offline detected', time: '10 min ago', type: 'warning' },
  ]);

  // Fetch system status for header display
  const { data: status } = useQuery(
    {
      queryKey: ['systemStatus'],
      queryFn: () => apiService.getStatus(),
      refetchInterval: 30000, // Refresh every 30 seconds
      retry: false,
    }
  );

  const orchestratorRunning = status?.orchestrator_running || false;
  const activeChannels = Object.keys(status?.orchestrator_status?.active_channels || {}).length;
  const activePipelines = status?.orchestrator_status?.active_pipelines?.length || 0;

  return (
    <motion.div 
      className="sticky top-0 z-40 bg-slate-50 dark:bg-slate-950 border-b border-stone-200 dark:border-stone-700"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Main header */}
      <div className="flex h-14 items-center gap-x-4 px-4 sm:gap-x-6 sm:px-6 lg:px-8">
        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="sm"
          className="lg:hidden -ml-2"
          onClick={() => setSidebarOpen(true)}
        >
          <span className="sr-only">Open sidebar</span>
          <Bars3Icon className="h-5 w-5" aria-hidden="true" />
        </Button>

        {/* Logo for mobile */}
        <div className="lg:hidden">
          <Logo size="sm" />
        </div>

        {/* Desktop breadcrumbs */}
        {breadcrumbs.length > 0 && (
          <nav className="hidden lg:flex items-center gap-2 text-sm" aria-label="Breadcrumb">
            {breadcrumbs.map((crumb, index) => (
              <Fragment key={crumb.href || index}>
                {index > 0 && (
                  <ChevronRightIcon className="h-3 w-3 text-slate-400 flex-shrink-0" />
                )}
                {crumb.href ? (
                  <a 
                    href={crumb.href}
                    className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 font-medium tracking-tight"
                  >
                    {crumb.label}
                  </a>
                ) : (
                  <span className="text-slate-900 dark:text-slate-100 font-medium tracking-tight">
                    {crumb.label}
                  </span>
                )}
              </Fragment>
            ))}
          </nav>
        )}

        {/* Center section - Search or status */}
        <div className="flex flex-1 items-center justify-center lg:justify-start gap-x-4 lg:gap-x-6">
          {onSearch ? (
            <div className="w-full max-w-md">
              <Input
                type="search"
                placeholder="Search channels, pipelines, highlights..."
                value={searchValue}
                onChange={(e) => onSearch(e.target.value)}
                leftIcon={<MagnifyingGlassIcon className="h-4 w-4" />}
                size="sm"
                className="w-full"
              />
            </div>
          ) : (
            <div className="flex items-center gap-x-3">
              {/* System status */}
              <StatusIndicator 
                status={orchestratorRunning ? 'healthy' : 'unhealthy'}
                showText={false}
                size="sm"
                showRing
              />
              <span className="hidden sm:inline text-sm text-slate-600 dark:text-slate-400 font-medium">
                {orchestratorRunning ? 'System Online' : 'System Offline'}
              </span>

              {/* Quick metrics */}
              {orchestratorRunning && (
                <div className="hidden md:flex items-center gap-x-4">
                  <div className="flex items-center gap-x-1">
                    <span className="text-xs text-slate-500 dark:text-slate-400">Channels:</span>
                    <Badge variant="secondary" size="sm">{activeChannels}</Badge>
                  </div>
                  <div className="flex items-center gap-x-1">
                    <span className="text-xs text-slate-500 dark:text-slate-400">Active:</span>
                    <Badge variant="success" size="sm">{activePipelines}</Badge>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right section */}
        <div className="flex items-center gap-x-2">
          {/* Quick actions */}
          {quickActions.length > 0 && (
            <div className="hidden lg:flex items-center gap-x-2">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant={action.variant || 'ghost'}
                  size="sm"
                  onClick={action.onClick}
                  leftIcon={action.icon}
                  className={action.className}
                >
                  {action.label}
                </Button>
              ))}
            </div>
          )}

          {/* Theme toggle */}
          <ThemeToggle />

          {/* Notifications */}
          <Menu as="div" className="relative">
            <Menu.Button className="relative p-2 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <span className="sr-only">View notifications</span>
              <BellIcon className="h-5 w-5" aria-hidden="true" />
              {notifications.length > 0 && (
                <motion.span 
                  className="absolute -top-1 -right-1 h-4 w-4 bg-danger-500 text-white text-xs rounded-full flex items-center justify-center font-medium"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                >
                  {notifications.length}
                </motion.span>
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
              <Menu.Items className="absolute right-0 z-10 mt-2 w-80 origin-top-right rounded-xl bg-slate-50 dark:bg-slate-900 border border-stone-200 dark:border-stone-600 shadow-elevated focus:outline-none overflow-hidden">
                <div className="px-4 py-3 bg-slate-100 dark:bg-slate-800 border-b border-stone-200 dark:border-stone-600">
                  <h3 className="text-sm font-subheading text-slate-900 dark:text-slate-100 tracking-tight">
                    System Notifications
                  </h3>
                </div>
                {notifications.length === 0 ? (
                  <div className="px-4 py-8 text-center">
                    <BellIcon className="mx-auto h-8 w-8 text-slate-400 mb-2" />
                    <p className="text-sm text-slate-500 dark:text-slate-400">No new notifications</p>
                  </div>
                ) : (
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.map((notification) => (
                      <Menu.Item key={notification.id}>
                        <motion.div 
                          className="px-4 py-3 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer border-b border-stone-100 dark:border-stone-700 last:border-b-0"
                          whileHover={{ x: 2 }}
                          transition={{ duration: 0.15 }}
                        >
                          <div className="flex items-start gap-3">
                            <div className={cn(
                              'w-2 h-2 rounded-full mt-2 flex-shrink-0',
                              notification.type === 'success' && 'bg-success-500',
                              notification.type === 'warning' && 'bg-warning-500',
                              notification.type === 'info' && 'bg-info-500',
                              !notification.type && 'bg-slate-400'
                            )} />
                            <div className="flex-1">
                              <p className="text-sm text-slate-900 dark:text-slate-100 font-medium tracking-tight">
                                {notification.message}
                              </p>
                              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                {notification.time}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      </Menu.Item>
                    ))}
                    {notifications.length > 0 && (
                      <div className="px-4 py-2 bg-slate-100 dark:bg-slate-800">
                        <Button variant="ghost" size="sm" className="w-full text-xs">
                          View all notifications
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </Menu.Items>
            </Transition>
          </Menu>

          {/* Profile dropdown */}
          <Menu as="div" className="relative">
            <Menu.Button className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <span className="sr-only">Open user menu</span>
              <UserCircleIcon className="h-6 w-6 text-slate-500 dark:text-slate-400" />
              <span className="hidden lg:block text-sm font-medium text-slate-700 dark:text-slate-300">
                Operations
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
              <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-xl bg-slate-50 dark:bg-slate-900 border border-stone-200 dark:border-stone-600 shadow-elevated focus:outline-none overflow-hidden">
                <div className="px-4 py-3 bg-slate-100 dark:bg-slate-800 border-b border-stone-200 dark:border-stone-600">
                  <p className="text-sm font-subheading text-slate-900 dark:text-slate-100 tracking-tight">
                    Operations User
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Sports Operations Team
                  </p>
                </div>
                <div className="p-2">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        className={cn(
                          'flex w-full items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 rounded-lg transition-colors',
                          active && 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100'
                        )}
                      >
                        <CogIcon className="h-4 w-4" />
                        Settings
                      </button>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={onLogout}
                        className={cn(
                          'flex w-full items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 rounded-lg transition-colors',
                          active && 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100'
                        )}
                      >
                        <PowerIcon className="h-4 w-4" />
                        Sign Out
                      </button>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </div>
    </motion.div>
  );
}