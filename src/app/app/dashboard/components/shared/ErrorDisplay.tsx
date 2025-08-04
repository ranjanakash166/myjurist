import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ErrorDisplayProps {
  error: string;
  isMobile?: boolean;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error, isMobile = false }) => {
  if (isMobile) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-neutral-900 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
              <h2 className="text-lg font-semibold text-red-800 dark:text-red-200">
                Error Loading Dashboard
              </h2>
            </div>
            <p className="text-red-600 dark:text-red-300 text-sm leading-relaxed">
              {error}
            </p>
            <div className="mt-4">
              <button 
                onClick={() => window.location.reload()} 
                className="text-sm text-red-700 dark:text-red-300 underline hover:no-underline"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-8">
          <div className="flex items-center space-x-4 mb-6">
            <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
            <h2 className="text-xl font-semibold text-red-800 dark:text-red-200">
              Error Loading Dashboard
            </h2>
          </div>
          <p className="text-red-600 dark:text-red-300 mb-6">
            {error}
          </p>
          <div className="flex space-x-4">
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
            <button 
              onClick={() => window.history.back()} 
              className="px-4 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}; 