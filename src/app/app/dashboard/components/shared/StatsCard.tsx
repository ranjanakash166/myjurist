import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface StatsCardProps {
  title: string;
  value: string | number;
  description: string;
  color: 'blue' | 'green' | 'purple' | 'orange';
  isMobile?: boolean;
  onClick?: () => void;
}

const colorClasses = {
  blue: {
    value: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    border: 'border-blue-200 dark:border-blue-800'
  },
  green: {
    value: 'text-green-600 dark:text-green-400',
    bg: 'bg-green-50 dark:bg-green-900/20',
    border: 'border-green-200 dark:border-green-800'
  },
  purple: {
    value: 'text-purple-600 dark:text-purple-400',
    bg: 'bg-purple-50 dark:bg-purple-900/20',
    border: 'border-purple-200 dark:border-purple-800'
  },
  orange: {
    value: 'text-orange-600 dark:text-orange-400',
    bg: 'bg-orange-50 dark:bg-orange-900/20',
    border: 'border-orange-200 dark:border-orange-800'
  }
};

export const StatsCard: React.FC<StatsCardProps> = ({ 
  title, 
  value, 
  description, 
  color, 
  isMobile = false,
  onClick 
}) => {
  const colors = colorClasses[color];
  
  if (isMobile) {
    return (
      <Card 
        className={`bg-white dark:bg-neutral-800 shadow-sm border ${colors.border} hover:scale-[1.02] hover:shadow-lg transition-all duration-200 ${onClick ? 'cursor-pointer' : ''}`}
        onClick={onClick}
      >
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                {title}
              </h3>
              <div className={`text-2xl font-bold ${colors.value} mb-1`}>
                {typeof value === 'number' ? value.toLocaleString() : value}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {description}
              </p>
            </div>
            <div className={`w-12 h-12 rounded-full ${colors.bg} flex items-center justify-center`}>
              <div className={`w-6 h-6 rounded-full ${colors.value.replace('text-', 'bg-')} opacity-20`}></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card 
      className={`bg-white dark:bg-neutral-800 shadow-sm border-0 hover:scale-[1.02] hover:shadow-xl transition-transform duration-200 ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className={`text-3xl font-bold ${colors.value}`}>
          {typeof value === 'number' ? value.toLocaleString() : value}
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}; 