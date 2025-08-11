import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Bars3Icon, 
  BellIcon, 
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  CogIcon,
  MagnifyingGlassIcon,
  CalendarIcon,
  FunnelIcon
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

/**
 * Professional header for sports operations dashboard
 * Reduced height with breadcrumbs, quick filters, and global search
 */
export default function Header({ setSidebarOpen, onLogout }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications] = useState([
    { id: 1, message: 'Pipeline completed successfully', time: '2 min ago', type: 'success' },
    { id: 2, message: 'New highlights generated', time: '5 min ago', type: 'info' },
    { id: 3, message: 'Channel latency warning', time: '8 min ago', type: 'warning' },
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

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Implement global search functionality
      console.log('Searching for:', searchQuery);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-surface-950/95 [data-theme='light'] &:bg-surface-50/95 backdrop-blur-sm border-b border-stone-700 [data-theme='light'] &:border-stone-200">
      <div className="flex h-14 items-center gap-4 px-4 sm:px-6 lg:px-8">
        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden"
          leftIcon={Bars3Icon}
          aria-label="Open sidebar"
        />

        {/* Logo for mobile */}
        <div className="lg:hidden">
          <Logo size="sm" variant="icon" />
        </div>

        {/* Status indicators */}
        <div className="flex items-center gap-3">
          <StatusIndicator 
            status={orchestratorRunning ? 'live' : 'paused'}
            label={orchestratorRunning ? 'Live' : 'Offline'}
            size="sm"
          />
          
          {orchestratorRunning && (
            <>
              <div className="hidden sm:flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  {activeChannels} CH
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  {activePipelines} PL
                </Badge>
              </div>
            </>
          )}
        </div>

        {/* Global search */}
        <div className="flex-1 max-w-md">
          <form onSubmit={handleSearch} className="relative">
            <Input
              type="search"
              placeholder="Search channels, events, highlights..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={MagnifyingGlassIcon}
              className="w-full text-sm"
            />
          </form>
        </div>

        {/* Quick filters */}
        <div className="hidden md:flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            leftIcon={CalendarIcon}
            className="text-xs"
          >
            Today
          </Button>
          <Button
            variant="ghost"
            size="sm"
            leftIcon={FunnelIcon}
            className="text-xs"
          >
            Filters
          </Button>
        </div>

        <div className="flex items-center gap-2">
          {/* Theme toggle */}
          <ThemeToggle size="sm" />

          {/* Notifications */}
          <Menu as="div" className="relative">
            <Menu.Button className="relative p-2 text-muted hover:text-surface-200 [data-theme='light'] &:hover:text-surface-700 transition-colors">
              <span className="sr-only">View notifications</span>
              <BellIcon className="h-5 w-5" />
              {notifications.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-4 w-4 bg-danger-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
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
              <Menu.Items className="absolute right-0 z-10 mt-2 w-80 origin-top-right card p-0 focus:outline-none">
                <div className="card-header">
                  <h3 className="text-sm font-semibold text-surface-50 [data-theme='light'] &:text-surface-950">
                    Notifications
                  </h3>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-sm text-muted text-center">
                      No new notifications
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <Menu.Item key={notification.id}>
                        <div className="p-4 hover:bg-surface-800 [data-theme='light'] &:hover:bg-surface-100 cursor-pointer border-b border-stone-700 [data-theme='light'] &:border-stone-200 last:border-b-0">
                          <p className="text-sm text-surface-50 [data-theme='light'] &:text-surface-950">
                            {notification.message}
                          </p>
                          <p className="text-xs text-muted mt-1">
                            {notification.time}
                          </p>
                        </div>
                      </Menu.Item>
                    ))
                  )}
                </div>
              </Menu.Items>
            </Transition>
          </Menu>

          {/* User menu */}
          <Menu as="div" className="relative">
            <Menu.Button className="flex items-center gap-2 p-1.5 rounded-md hover:bg-surface-800 [data-theme='light'] &:hover:bg-surface-100 transition-colors">
              <UserCircleIcon className="h-6 w-6 text-muted" />
              <span className="hidden sm:block text-sm font-medium text-surface-200 [data-theme='light'] &:text-surface-700">
                Operator
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
              <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right card p-2 focus:outline-none">
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={cn(
                        'flex w-full items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors',
                        active ? 'bg-surface-800 [data-theme="light"] &:bg-surface-100' : '',
                        'text-surface-200 [data-theme="light"] &:text-surface-700'
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
                        'flex w-full items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors',
                        active ? 'bg-surface-800 [data-theme="light"] &:bg-surface-100' : '',
                        'text-surface-200 [data-theme="light"] &:text-surface-700'
                      )}
                    >
                      <ArrowRightOnRectangleIcon className="h-4 w-4" />
                      Sign out
                    </button>
                  )}
                </Menu.Item>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </div>
    </header>
  );
}