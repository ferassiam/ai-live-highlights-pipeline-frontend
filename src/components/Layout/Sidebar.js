import React from 'react';
import { NavLink } from 'react-router-dom';
import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { motion } from 'framer-motion';
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
  DocumentTextIcon,
  FolderIcon,
  WrenchScrewdriverIcon,
} from '@heroicons/react/24/outline';

import { Logo } from '../ui/Logo';
import { StatusIndicator } from '../ui/StatusIndicator';
import { cn } from '../../utils/cn';
const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Schedules', href: '/schedules', icon: CalendarIcon },
  { name: 'Channels', href: '/channels', icon: TvIcon },
  { name: 'Pipelines', href: '/pipelines', icon: PlayIcon },
  { name: 'Highlights', href: '/highlights', icon: SparklesIcon },
  { name: 'Content Creation', href: '/content-creation', icon: PencilSquareIcon },
  { name: 'Configuration', href: '/configuration', icon: WrenchScrewdriverIcon, adminOnly: true },
  { name: 'Enhanced Monitoring', href: '/enhanced-monitoring', icon: ChartBarIcon },
  { name: 'File Manager', href: '/files', icon: FolderIcon },
  { name: 'Settings', href: '/settings', icon: CogIcon },
];


export default function Sidebar({ open, setOpen }) {
  // TODO: Get from auth context
  const isAdmin = true;
  
  // Filter navigation items based on admin status
  const filteredNavigation = navigation.filter(item => !item.adminOnly || isAdmin);
  
  return (
    <>
      {/* Mobile sidebar */}
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-50 lg:hidden" onClose={setOpen}>
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
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                    <button type="button" className="-m-2.5 p-2.5" onClick={() => setOpen(false)}>
                      <span className="sr-only">Close sidebar</span>
                      <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
                    </button>
                  </div>
                </Transition.Child>

                <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white dark:bg-dark-800 px-6 pb-2">
                  <div className="flex h-16 shrink-0 items-center">
                    <Logo />
                  </div>
                  <nav className="flex flex-1 flex-col">
                    <ul className="flex flex-1 flex-col gap-y-7">
                      <li>
                        <ul className="-mx-2 space-y-1">
                          {filteredNavigation.map((item) => (
                            <li key={item.name}>
                              <NavLink
                                to={item.href}
                                className={({ isActive }) => 
                                  cn(
                                    'group',
                                    isActive
                                      ? 'bg-primary-50 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300'
                                      : 'text-gray-700 dark:text-dark-300 hover:text-primary-700 dark:hover:text-primary-300 hover:bg-primary-50 dark:hover:bg-primary-900/30',
                                    'flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                                  )
                                }
                                onClick={() => setOpen(false)}
                              >
                                {({ isActive }) => (
                                  <motion.div 
                                    className="flex items-center gap-x-3 w-full"
                                    whileHover={{ x: 2 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                  >
                                    <item.icon
                                      className={cn(
                                        isActive ? 'text-primary-700 dark:text-primary-300' : 'text-gray-400 dark:text-dark-400 group-hover:text-primary-700 dark:group-hover:text-primary-300',
                                        'h-6 w-6 shrink-0'
                                      )}
                                      aria-hidden="true"
                                    />
                                    {item.name}
                                  </motion.div>
                                )}
                              </NavLink>
                            </li>
                          ))}
                        </ul>
                      </li>
                    </ul>
                  </nav>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <motion.div 
          className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 dark:border-dark-700 bg-white dark:bg-dark-800 px-6"
          initial={{ x: -300 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex h-16 shrink-0 items-center">
            <Logo />
          </div>
          <nav className="flex flex-1 flex-col">
            <ul className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul className="-mx-2 space-y-1">
                  {filteredNavigation.map((item) => (
                    <li key={item.name}>
                      <NavLink
                        to={item.href}
                        className={({ isActive }) => 
                          cn(
                            'group',
                            isActive
                              ? 'bg-primary-50 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300'
                              : 'text-gray-700 dark:text-dark-300 hover:text-primary-700 dark:hover:text-primary-300 hover:bg-primary-50 dark:hover:bg-primary-900/30',
                            'flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                          )
                        }
                      >
                        {({ isActive }) => (
                          <motion.div 
                            className="flex items-center gap-x-3 w-full"
                            whileHover={{ x: 2 }}
                            transition={{ type: "spring", stiffness: 400, damping: 30 }}
                          >
                            <item.icon
                              className={cn(
                                isActive ? 'text-primary-700 dark:text-primary-300' : 'text-gray-400 dark:text-dark-400 group-hover:text-primary-700 dark:group-hover:text-primary-300',
                                'h-6 w-6 shrink-0'
                              )}
                              aria-hidden="true"
                            />
                            {item.name}
                          </motion.div>
                        )}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </li>
              <li className="-mx-6 mt-auto">
                <div className="px-6 py-3 text-xs text-gray-500 dark:text-dark-400 border-t border-gray-200 dark:border-dark-700">
                  <div className="flex items-center justify-between">
                    <span>API Status</span>
                    <div className="flex items-center">
                      <StatusIndicator status="running" showText={false} />
                      <span className="ml-2 text-success-600 dark:text-success-400 text-xs">Connected</span>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </nav>
        </motion.div>
      </div>
    </>
  );
}