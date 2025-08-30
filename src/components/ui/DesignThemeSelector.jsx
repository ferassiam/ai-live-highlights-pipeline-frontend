import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PaintBrushIcon, 
  ChevronDownIcon,
  CheckIcon 
} from '@heroicons/react/24/outline';
import { useDesignTheme } from '../../hooks/useDesignTheme.jsx';

export const DesignThemeSelector = () => {
  const { designTheme, setDesignTheme, themes } = useDesignTheme();
  const [isOpen, setIsOpen] = useState(false);

  const handleThemeSelect = (themeKey) => {
    setDesignTheme(themeKey);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-700 rounded-md transition-colors duration-200"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <PaintBrushIcon className="h-4 w-4" />
        <span className="hidden sm:block">Design</span>
        <ChevronDownIcon 
          className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-200 dark:border-slate-600 z-50"
          >
            <div className="p-2">
              <div className="px-3 py-2 border-b border-gray-200 dark:border-slate-600">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                  Design Themes
                </h3>
                <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
                  Choose your preferred interface style
                </p>
              </div>
              
              <div className="py-2">
                {Object.entries(themes).map(([key, theme]) => (
                  <motion.button
                    key={key}
                    onClick={() => handleThemeSelect(key)}
                    className={`w-full text-left px-3 py-2 rounded-md transition-colors duration-150 flex items-center justify-between group ${
                      designTheme === key
                        ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                        : 'hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-300'
                    }`}
                    whileHover={{ x: 2 }}
                  >
                    <div>
                      <div className="font-medium text-sm">{theme.name}</div>
                      <div className="text-xs text-gray-500 dark:text-slate-400 group-hover:text-gray-600 dark:group-hover:text-slate-300">
                        {theme.description}
                      </div>
                    </div>
                    {designTheme === key && (
                      <CheckIcon className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                    )}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay to close dropdown */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};