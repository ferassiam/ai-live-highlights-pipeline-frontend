import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { 
  Bars3Icon, 
  BellIcon, 
  UserCircleIcon,
  PowerIcon,
  CogIcon
} from '@heroicons/react/24/outline';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';

import { apiService } from '../../services/api';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function Header({ setSidebarOpen, onLogout }) {
  const [notifications] = useState([
    { id: 1, message: 'Pipeline started successfully', time: '2 min ago', type: 'success' },
    { id: 2, message: 'New highlights generated', time: '5 min ago', type: 'info' },
  ]);

  // Fetch system status for header display
  const { data: status } = useQuery(
    'systemStatus',
    () => apiService.getStatus(),
    {
      refetchInterval: 30000, // Refresh every 30 seconds
      retry: false,
    }
  );

  const orchestratorRunning = status?.orchestrator_running || false;
  const activeChannels = Object.keys(status?.orchestrator_status?.active_channels || {}).length;
  const activePipelines = status?.orchestrator_status?.active_pipelines?.length || 0;

  return (
    <div className="sticky top-0 z-40 lg:mx-auto lg:max-w-7xl lg:px-8">
      <div className="flex h-16 items-center gap-x-4 border-b border-gray-200 dark:border-dark-700 bg-white dark:bg-dark-800 px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-0 lg:shadow-none">
        <button
          type="button"
          className="-m-2.5 p-2.5 text-gray-700 dark:text-dark-300 lg:hidden"
          onClick={() => setSidebarOpen(true)}
        >
          <span className="sr-only">Open sidebar</span>
          <Bars3Icon className="h-6 w-6" aria-hidden="true" />
        </button>

        {/* Separator */}
        <div className="h-6 w-px bg-gray-200 dark:bg-dark-700 lg:hidden" aria-hidden="true" />

        {/* Status indicators */}
        <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
          <div className="flex items-center gap-x-4 lg:gap-x-6">
            {/* Orchestrator status */}
            <div className="flex items-center gap-x-2">
              <div className={`h-2 w-2 rounded-full ${orchestratorRunning ? 'bg-success-500 animate-pulse-fast' : 'bg-gray-300 dark:bg-dark-600'}`}></div>
              <span className="text-sm text-gray-600 dark:text-dark-300">
                Orchestrator {orchestratorRunning ? 'Running' : 'Stopped'}
              </span>
            </div>

            {/* Active channels/pipelines */}
            {orchestratorRunning && (
              <>
                <div className="hidden sm:flex items-center gap-x-2">
                  <span className="text-sm text-gray-600 dark:text-dark-300">Channels: {activeChannels}</span>
                </div>
                <div className="hidden sm:flex items-center gap-x-2">
                  <span className="text-sm text-gray-600 dark:text-dark-300">Pipelines: {activePipelines}</span>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-x-4 lg:gap-x-6">
          {/* Notifications */}
          <Menu as="div" className="relative">
            <Menu.Button className="-m-2.5 p-2.5 text-gray-400 dark:text-dark-400 hover:text-gray-500 dark:hover:text-dark-300">
              <span className="sr-only">View notifications</span>
              <BellIcon className="h-6 w-6" aria-hidden="true" />
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-danger-500 text-white text-xs rounded-full flex items-center justify-center">
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
                      <div className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-dark-700">
                        <p className="text-sm text-gray-900 dark:text-white">{notification.message}</p>
                        <p className="text-xs text-gray-500 dark:text-dark-400 mt-1">{notification.time}</p>
                      </div>
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
                      className={classNames(
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
                      className={classNames(
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
    </div>
  );
}