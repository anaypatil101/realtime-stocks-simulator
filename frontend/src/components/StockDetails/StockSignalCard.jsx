import React from 'react';

const SIGNAL_CONFIG = {
  'Perfect Time to Buy': {
    bg: 'bg-green-100 dark:bg-green-900',
    border: 'border-green-300 dark:border-green-700',
    badge: 'bg-green-500',
    text: 'text-green-800 dark:text-green-200',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
  },
  'Good Time to Buy': {
    bg: 'bg-blue-50 dark:bg-blue-900',
    border: 'border-blue-200 dark:border-blue-700',
    badge: 'bg-blue-500',
    text: 'text-blue-800 dark:text-blue-200',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  Risky: {
    bg: 'bg-yellow-50 dark:bg-yellow-900',
    border: 'border-yellow-300 dark:border-yellow-700',
    badge: 'bg-yellow-500',
    text: 'text-yellow-800 dark:text-yellow-200',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
      </svg>
    ),
  },
  Avoid: {
    bg: 'bg-red-50 dark:bg-red-900',
    border: 'border-red-200 dark:border-red-700',
    badge: 'bg-red-500',
    text: 'text-red-800 dark:text-red-200',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
      </svg>
    ),
  },
  'Insufficient Data': {
    bg: 'bg-gray-50 dark:bg-gray-900',
    border: 'border-gray-200 dark:border-gray-700',
    badge: 'bg-gray-400',
    text: 'text-gray-600 dark:text-gray-400',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
};

const StockSignalCard = ({ signal, reason, disclaimer, isLoading, error }) => {
  if (isLoading) {
    return (
      <div className="mt-8 animate-pulse">
        <div className="h-4 w-32 bg-gray-200 dark:bg-gray-600 rounded mb-3" />
        <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 bg-gray-200 dark:bg-gray-600 rounded-full" />
            <div className="h-5 w-40 bg-gray-200 dark:bg-gray-600 rounded" />
          </div>
          <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-full" />
          <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-4/5" />
          <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded w-3/4 mt-2" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-8">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-3">
          AI Signal
        </h2>
        <div className="border border-red-200 dark:border-red-800 rounded-xl p-5 bg-red-50 dark:bg-red-900">
          <p className="text-sm text-red-600 dark:text-red-300">{error}</p>
        </div>
      </div>
    );
  }

  if (!signal) return null;

  const config = SIGNAL_CONFIG[signal] ?? SIGNAL_CONFIG['Insufficient Data'];

  return (
    <div className="mt-8">
      <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-3">
        AI Signal
      </h2>
      <div className={`border rounded-xl p-5 ${config.bg} ${config.border}`}>
        {/* Signal badge */}
        <div className="flex items-center gap-3 mb-3">
          <span className={`flex items-center justify-center h-9 w-9 rounded-full text-white shrink-0 ${config.badge}`}>
            {config.icon}
          </span>
          <span className={`text-base font-bold ${config.text}`}>{signal}</span>
        </div>

        {/* Reason */}
        <p className={`text-sm leading-relaxed ${config.text}`}>{reason}</p>

        {/* Disclaimer */}
        {disclaimer && (
          <p className="mt-3 text-xs text-gray-400 dark:text-gray-500 italic border-t border-gray-200 dark:border-gray-700 pt-3">
            {disclaimer}
          </p>
        )}
      </div>
    </div>
  );
};

export default StockSignalCard;
