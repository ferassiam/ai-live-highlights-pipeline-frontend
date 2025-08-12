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
  FolderIcon,
  WrenchScrewdriverIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  SignalIcon,
} from '@heroicons/react/24/outline';

import { Logo } from '../ui/Logo';
import { StatusIndicator } from '../ui/StatusIndicator';
import { Button } from '../ui/Button';
import { cn } from '../../utils/cn';
// Professional navigation for sports operations
const navigation = [
  { 
    name: 'Dashboard', 
    href: '/dashboard', 
    icon: HomeIcon, 
    shortName: 'Dashboard',
    description: 'System overview and KPIs'
  },
  { 
    name: 'Schedules', 
    href: '/schedules', 
    icon: CalendarIcon, 
    shortName: 'Schedules',
    description: 'Content schedules and timing'
  },
  { 
    name: 'Channels', 
    href: '/channels', 
    icon: TvIcon, 
    shortName: 'Channels',
    description: 'Live broadcast channels'
  },
  { 
    name: 'Pipelines', 
    href: '/pipelines', 
    icon: PlayIcon, 
    shortName: 'Pipelines',
    description: 'Processing workflows'
  },
  { 
    name: 'Highlights', 
    href: '/highlights', 
    icon: SparklesIcon, 
    shortName: 'Highlights',
    description: 'Generated content'
  },
  { 
    name: 'Content Creation', 
    href: '/content-creation', 
    icon: PencilSquareIcon, 
    shortName: 'Content',
    description: 'Content generation tools'
  },
  { 
    name: 'Enhanced Monitoring', 
    href: '/enhanced-monitoring', 
    icon: ChartBarIcon, 
    shortName: 'Monitoring',
    description: 'Advanced analytics'
  },
  { 
    name: 'File Manager', 
    href: '/files', 
    icon: FolderIcon, 
    shortName: 'Files',
    description: 'File browser and uploads'
  },
  { 
    name: 'Configuration', 
    href: '/configuration', 
    icon: WrenchScrewdriverIcon, 
    shortName: 'Config',
    description: 'System configuration',
    adminOnly: true 
  },
  { 
    name: 'Settings', 
    href: '/settings', 
    icon: CogIcon, 
    shortName: 'Settings',
    description: 'Application preferences'
  },
];


export default function Sidebar({ open, setOpen, collapsed = false, onToggleCollapse }) {
  // TODO: Get from auth context
  const isAdmin = true;
  
  // Filter navigation items based on admin status
  const filteredNavigation = navigation.filter(item => !item.adminOnly || isAdmin);

  // Navigation item component for consistent rendering
  const NavItem = ({ item, isCollapsed = false, onClick }) => (
    <NavLink
      to={item.href}
      onClick={onClick}
      className={({ isActive }) => 
        cn(
          'group relative flex items-center gap-x-3 rounded-lg px-3 py-2.5 text-sm font-subheading transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
          'focus:ring-offset-slate-50 dark:focus:ring-offset-slate-950',
          isActive
            ? 'bg-primary-50 dark:bg-primary-950/50 text-primary-700 dark:text-primary-300 shadow-subtle'
            : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800',
          isCollapsed && 'justify-center px-2.5'
        )
      }
    >
      {({ isActive }) => (
        <>
          <motion.div
            className="flex items-center gap-x-3 w-full"
            whileHover={isCollapsed ? { scale: 1.05 } : { x: 1 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
          >
            <item.icon
              className={cn(
                'h-5 w-5 flex-shrink-0',
                isActive 
                  ? 'text-primary-600 dark:text-primary-400' 
                  : 'text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300'
              )}
              aria-hidden="true"
            />
            
            {!isCollapsed && (
              <motion.span 
                className="truncate tracking-tight"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
              >
                {item.name}
              </motion.span>
            )}
          </motion.div>
          
          {/* Tooltip for collapsed state */}
          {isCollapsed && (
            <div className="absolute left-full ml-2 px-2 py-1 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
              {item.name}
              <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-0 h-0 border-r-4 border-r-slate-900 dark:border-r-slate-100 border-y-4 border-y-transparent" />
            </div>
          )}
          
          {/* Screen reader content */}
          <span className="sr-only">
            {isActive ? 'Current page: ' : 'Navigate to: '}
            {item.name}
            {item.description && ` - ${item.description}`}
          </span>
        </>
      )}
    </NavLink>
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
            <div className="fixed inset-0 bg-slate-900/80 dark:bg-black/90 backdrop-blur-sm" />
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
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setOpen(false)}
                      className="text-white hover:text-slate-200 hover:bg-white/10"
                    >
                      <span className="sr-only">Close sidebar</span>
                      <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                    </Button>
                  </div>
                </Transition.Child>

                <motion.div 
                  className="flex grow flex-col overflow-y-auto bg-slate-50 dark:bg-slate-950 border-r border-stone-200 dark:border-stone-600"
                  initial={{ x: -100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -100, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Mobile logo */}
                  <div className="flex h-14 shrink-0 items-center px-6 border-b border-stone-200 dark:border-stone-600">
                    <Logo size="sm" />
                  </div>
                  
                  {/* Mobile navigation */}
                  <nav className="flex-1 px-4 py-4" aria-label="Main navigation">
                    <ul className="space-y-1">
                      {filteredNavigation.map((item) => (
                        <li key={item.name}>
                          <NavItem 
                            item={item} 
                            onClick={() => setOpen(false)}
                          />
                        </li>
                      ))}
                    </ul>
                  </nav>

                  {/* Mobile status footer */}
                  <div className="border-t border-stone-200 dark:border-stone-600 p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <SignalIcon className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                        <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                          System Status
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <StatusIndicator status="healthy" size="sm" showText={false} />
                        <span className="text-xs text-success-600 dark:text-success-400 font-medium">
                          Online
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Desktop sidebar */}
      <motion.div 
        className={cn(
          'hidden lg:fixed lg:inset-y-0 lg:z-40 lg:flex lg:flex-col',
          'bg-slate-50 dark:bg-slate-950 border-r border-stone-200 dark:border-stone-600'
        )}
        animate={{ 
          width: collapsed ? '4rem' : '16rem' // 64px : 256px
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        initial={false}
      >
        {/* Desktop header */}
        <div className="flex h-14 shrink-0 items-center justify-between px-4 border-b border-stone-200 dark:border-stone-600">
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Logo size="sm" />
            </motion.div>
          )}
          
          {onToggleCollapse && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleCollapse}
              className={cn(
                'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300',
                collapsed && 'mx-auto'
              )}
            >
              <span className="sr-only">
                {collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              </span>
              {collapsed ? (
                <ChevronRightIcon className="h-4 w-4" />
              ) : (
                <ChevronLeftIcon className="h-4 w-4" />
              )}
            </Button>
          )}
        </div>

        {/* Desktop navigation */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto" aria-label="Main navigation">
          <ul className="space-y-1">
            {filteredNavigation.map((item) => (
              <li key={item.name}>
                <NavItem item={item} isCollapsed={collapsed} />
              </li>
            ))}
          </ul>
        </nav>

        {/* Desktop status footer */}
        <div className="border-t border-stone-200 dark:border-stone-600 p-3">
          <div className={cn(
            'flex items-center transition-all duration-300',
            collapsed ? 'justify-center' : 'justify-between'
          )}>
            {collapsed ? (
              <div className="relative group">
                <StatusIndicator status="healthy" size="sm" showRing />
                <div className="absolute left-full ml-2 px-2 py-1 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                  System Online
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-0 h-0 border-r-4 border-r-slate-900 dark:border-r-slate-100 border-y-4 border-y-transparent" />
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <SignalIcon className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                  <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                    System Status
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <StatusIndicator status="healthy" size="sm" showText={false} />
                  <span className="text-xs text-success-600 dark:text-success-400 font-medium tabular-nums">
                    Online
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </motion.div>
    </>
  );
}