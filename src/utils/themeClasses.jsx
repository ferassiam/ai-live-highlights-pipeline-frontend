import { useDesignTheme } from '../hooks/useDesignTheme.jsx';

export const useThemeClasses = () => {
  const { designTheme } = useDesignTheme();

  const getPageBg = () => {
    switch (designTheme) {
      case 'minimalist':
        return 'bg-white dark:bg-slate-900';
      case 'enterprise':
        return 'bg-gradient-to-br from-slate-100 via-blue-100 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900';
      case 'gaming':
        return 'bg-gradient-to-br from-black via-green-900/20 to-emerald-900/30 dark:from-black dark:via-green-900/40 dark:to-emerald-900/50';
      case 'corporate':
        return 'bg-gray-50 dark:bg-slate-900';
      case 'modern':
      default:
        return 'bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20';
    }
  };

  const getCardClasses = () => {
    switch (designTheme) {
      case 'minimalist':
        return 'bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-md';
      case 'enterprise':
        return 'bg-white dark:bg-slate-800 border-2 border-blue-200 dark:border-blue-800 shadow-lg hover:shadow-xl hover:border-blue-300 dark:hover:border-blue-700';
      case 'gaming':
        return 'bg-slate-800/90 dark:bg-black/90 border border-green-500/30 dark:border-green-400/40 shadow-2xl hover:shadow-green-500/20 dark:hover:shadow-green-400/20 hover:border-green-400/50 dark:hover:border-green-300/60';
      case 'corporate':
        return 'bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 shadow-sm hover:shadow-lg';
      case 'modern':
      default:
        return 'bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 shadow-lg hover:shadow-xl';
    }
  };

  const getHeaderClasses = () => {
    switch (designTheme) {
      case 'minimalist':
        return 'bg-white dark:bg-slate-800 border-b border-gray-100 dark:border-slate-700';
      case 'enterprise':
        return 'bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-800 dark:to-indigo-800 border-b-4 border-blue-700 dark:border-blue-900';
      case 'gaming':
        return 'bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 dark:from-green-700 dark:via-emerald-700 dark:to-teal-700 border-b-2 border-green-400/50 dark:border-green-300/50';
      case 'corporate':
        return 'bg-gray-800 dark:bg-slate-700 border-b border-gray-700 dark:border-slate-600';
      case 'modern':
      default:
        return 'bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border-b border-white/20 dark:border-slate-700/50';
    }
  };

  const getTitleClasses = () => {
    switch (designTheme) {
      case 'enterprise':
        return 'text-blue-900 dark:text-blue-100 font-bold';
      case 'gaming':
        return 'text-green-100 dark:text-green-200 font-bold';
      case 'corporate':
        return 'text-white font-semibold';
      default:
        return 'text-gray-900 dark:text-white';
    }
  };

  const getTextClasses = () => {
    switch (designTheme) {
      case 'gaming':
        return 'text-gray-200 dark:text-gray-300';
      case 'corporate':
        return 'text-white';
      default:
        return 'text-gray-600 dark:text-slate-400';
    }
  };

  return {
    getPageBg,
    getCardClasses,
    getHeaderClasses,
    getTitleClasses,
    getTextClasses,
    designTheme,
  };
};