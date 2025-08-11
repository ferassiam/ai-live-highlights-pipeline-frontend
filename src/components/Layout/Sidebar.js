import React from 'react';
import { NavLink } from 'react-router-dom';
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
  DocumentTextIcon,
  FolderIcon,
  WrenchScrewdriverIcon,
  EyeIcon,
} from '@heroicons/react/24/outline';

import { Logo } from '../ui/Logo';
import { StatusIndicator } from '../ui/StatusIndicator';
import { cn } from '../../utils/cn';

/**
 * Professional sidebar navigation for sports operations
 * Compact design with section headers and collapsible mobile view
 */
const navigationSections = [
  {
    name: 'Operations',
    items: [
      { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
      { name: 'Monitoring', href: '/enhanced-monitoring', icon: EyeIcon },
      { name: 'Channels', href: '/channels', icon: TvIcon },
      { name: 'Pipelines', href: '/pipelines', icon: PlayIcon },
    ]
  },
  {
    name: 'Content',
    items: [
      { name: 'Highlights', href: '/highlights', icon: SparklesIcon },
      { name: 'Schedules', href: '/schedules', icon: CalendarIcon },
      { name: 'Content Creation', href: '/content-creation', icon: PencilSquareIcon },
    ]
  },
  {
    name: 'Management',
    items: [
      { name: 'Files', href: '/files', icon: FolderIcon },
      { name: 'Analytics', href: '/monitoring', icon: ChartBarIcon },
      { name: 'Configuration', href: '/configuration', icon: WrenchScrewdriverIcon, adminOnly: true },
      { name: 'Settings', href: '/settings', icon: CogIcon },
    ]
  }
];

export default function Sidebar({ open, setOpen }) {
  // TODO: Get from auth context
  const isAdmin = true;
  
  // Filter navigation items based on admin status
  const filteredSections = navigationSections.map(section => ({
    ...section,
    items: section.items.filter(item => !item.adminOnly || isAdmin)
  }));

  const SidebarContent = ({ mobile = false }) => (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex h-14 items-center px-6 border-b border-stone-700 [data-theme='light'] &:border-stone-200">
        <Logo size="sm" />
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-6 px-4 py-6 overflow-y-auto">
        {filteredSections.map((section) => (
          <div key={section.name}>
            <h3 className="px-2 text-xs font-semibold text-muted uppercase tracking-wider mb-3">
              {section.name}
            </h3>
            <ul className="space-y-1">
              {section.items.map((item) => (
                <li key={item.name}>
                  <NavLink
                    to={item.href}
                    className={({ isActive }) => 
                      cn(
                        'group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all duration-150',
                        isActive
                          ? 'bg-primary-100 [data-theme="dark"] &:bg-primary-950 text-primary-700 [data-theme="dark"] &:text-primary-300'
                          : 'text-muted hover:text-surface-200 [data-theme="light"] &:hover:text-surface-700 hover:bg-surface-800 [data-theme="light"] &:hover:bg-surface-100'
                      )
                    }
                    onClick={() => mobile && setOpen(false)}
                  >
                    {({ isActive }) => (
                      <>
                        <item.icon
                          className={cn(
                            'h-5 w-5 flex-shrink-0',
                            isActive 
                              ? 'text-primary-600 [data-theme="dark"] &:text-primary-400' 
                              : 'text-muted group-hover:text-surface-300 [data-theme="light"] &:group-hover:text-surface-600'
                          )}
                        />
                        <span className="truncate">{item.name}</span>
                      </>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {/* Status footer */}
      <div className="border-t border-stone-700 [data-theme='light'] &:border-stone-200 p-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted">System Status</span>
          <StatusIndicator status="live" showLabel={false} size="xs" />
        </div>
      </div>
    </div>
  );

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
            <div className="fixed inset-0 bg-surface-950/80 [data-theme='light'] &:bg-surface-950/80" />
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
                    <button 
                      type="button" 
                      className="-m-2.5 p-2.5 text-white hover:text-surface-300 transition-colors" 
                      onClick={() => setOpen(false)}
                    >
                      <span className="sr-only">Close sidebar</span>
                      <XMarkIcon className="h-6 w-6" />
                    </button>
                  </div>
                </Transition.Child>

                <div className="bg-surface-950 [data-theme='light'] &:bg-surface-50 w-full">
                  <SidebarContent mobile />
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
        <div className="bg-surface-950 [data-theme='light'] &:bg-surface-50 border-r border-stone-700 [data-theme='light'] &:border-stone-200">
          <SidebarContent />
        </div>
      </div>
    </>
  );
}