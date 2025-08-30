import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NavLink, useLocation } from 'react-router-dom';
import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import {
  HomeIcon,
  CalendarIcon,
  TvIcon,
  PlayIcon,
  SparklesIcon,
  PencilSquareIcon,
  ChartBarIcon,
  CogIcon,
  XMarkIcon,
  FolderIcon,
  WrenchScrewdriverIcon,
  ChevronRightIcon,
  SignalIcon,
  ComputerDesktopIcon,
} from '@heroicons/react/24/outline';

import { Logo } from '../ui/Logo.jsx';
import { cn } from '../../utils/cn.jsx';

const navigation = [
  { 
    name: 'Command Center', 
    href: '/dashboard', 
    icon: HomeIcon,
    description: 'System overview and control'
  },
  { 
    name: 'Live Channels', 
    href: '/channels', 
    icon: TvIcon,
    description: 'Monitor streaming channels'
  },
  { 
    name: 'Schedules', 
    href: '/schedules', 
    icon: CalendarIcon,
    description: 'Manage processing schedules'
  },
  { 
    name: 'Pipelines', 
    href: '/pipelines', 
    icon: PlayIcon,
    description: 'Processing pipeline status'
  },
  { 
    name: 'Highlights', 
    href: '/highlights', 
    icon: SparklesIcon,
    description: 'Browse generated highlights'
  },
  { 
    name: 'Content Creation', 
    href: '/content-creation', 
    icon: PencilSquareIcon,
    description: 'AI content generation'
  },
  { 
    name: 'Analytics', 
    href: '/enhanced-monitoring', 
    icon: ChartBarIcon,
    description: 'Advanced monitoring'
  },
  { 
    name: 'File Manager', 
    href: '/file-manager', 
    icon: FolderIcon,
    description: 'Browse system files'
  },
  { 
    name: 'Configuration', 
    href: '/configuration', 
    icon: WrenchScrewdriverIcon, 
    adminOnly: true,
    description: 'System configuration'
  },
  { 
    name: 'Settings', 
    href: '/settings', 
    icon: CogIcon,
    description: 'Application settings'
  },
];

const NavigationItem = ({ item, isActive, isMobile = false }) => {
  const Icon = item.icon;
  
  return (
    <NavLink
      to={item.href}
      className={({ isActive: active }) =>
        cn(
          'group relative flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all duration-200',
          active || isActive
            ? 'bg-emerald-600 text-white shadow-md'
            : 'text-gray-700 dark:text-gray-300 hover:bg-white/80 dark:hover:bg-gray-800/80 hover:text-gray-900 dark:hover:text-white',
          'focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900'
        )
      }
    >
      {({ isActive: active }) => (
        <motion.div
          className="flex items-center w-full"
          whileHover={{ x: active ? 0 : 4 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        >
          <div className={cn(
            'flex-shrink-0 w-6 h-6 mr-3',
            active ? 'text-white' : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200'
          )}>
            <Icon className="w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-medium">{item.name}</div>
            {!isMobile && (
              <div className={cn(
                'text-xs mt-0.5',
                active ? 'text-emerald-100' : 'text-gray-500 dark:text-gray-400'
              )}>
                {item.description}
              </div>
            )}
          </div>
          {!active && (
            <ChevronRightIcon className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
          )}
        </motion.div>
      )}
    </NavLink>
  );
};

const SidebarContent = ({ isMobile = false, onClose }) => {
  const location = useLocation();
  // TODO: Get from auth context
  const isAdmin = true;
  
  // Filter navigation items based on admin status
  const filteredNavigation = navigation.filter(item => !item.adminOnly || isAdmin);
  
  return (
    <div className="flex flex-col h-full">
      {/* Logo and brand */}
      <div className="flex items-center justify-between px-4 py-6 border-b border-gray-200 dark:border-gray-700">
        <Logo size="default" />
        {isMobile && (
          <button
            type="button"
            className="ml-1 flex items-center justify-center h-10 w-10 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 hover:bg-slate-100 dark:hover:bg-slate-700"
            onClick={onClose}
          >
            <span className="sr-only">Close sidebar</span>
            <XMarkIcon className="h-6 w-6 text-gray-600 dark:text-gray-400" aria-hidden="true" />
          </button>
        )}
      </div>

      {/* System status indicator */}
      <div className="px-4 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3 p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
          <div className="relative">
            <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
            <div className="absolute inset-0 w-3 h-3 bg-emerald-500 rounded-full animate-ping opacity-75" />
          </div>
          <div className="flex-1">
            <div className="text-sm font-medium text-emerald-900 dark:text-emerald-100">System Online</div>
            <div className="text-xs text-emerald-700 dark:text-emerald-300">All services operational</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        <div className="space-y-1">
          {filteredNavigation.map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
            >
              <NavigationItem 
                item={item} 
                isActive={location.pathname === item.href}
                isMobile={isMobile}
              />
            </motion.div>
          ))}
        </div>
      </nav>

      {/* Footer info */}
      <div className="px-4 py-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3 text-xs text-slate-500 dark:text-slate-400">
          <SignalIcon className="w-4 h-4" />
          <span>MediaKind Sports Operations</span>
        </div>
        <div className="text-xs text-slate-400 dark:text-slate-500 mt-1">
          v2.1.0 • Live Highlights Platform
        </div>
      </div>
    </div>
  );
};

export function Sidebar({ sidebarOpen, setSidebarOpen }) {
  return (
    <>
      {/* Mobile sidebar */}
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50 lg:hidden" onClose={setSidebarOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-900/80 dark:bg-black/90" />
          </Transition.Child>

          <div className="fixed inset-0 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 shadow-xl">
                  <SidebarContent isMobile onClose={() => setSidebarOpen(false)} />
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Static sidebar for desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-40 lg:flex lg:w-72 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-r border-gray-200/50 dark:border-gray-700/50 shadow-xl">
          <SidebarContent />
        </div>
      </div>
    </>
  );
}