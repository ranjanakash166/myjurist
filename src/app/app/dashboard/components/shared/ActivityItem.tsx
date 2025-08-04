import React from 'react';
import { Badge } from '@/components/ui/badge';
import { getActivityIcon, getStatusColor, formatDate, type ActivityItem as ActivityItemType } from '@/lib/dashboardApi';

interface ActivityItemProps {
  activity: ActivityItemType;
  isMobile?: boolean;
  onClick?: () => void;
}

export const ActivityItem: React.FC<ActivityItemProps> = ({ 
  activity, 
  isMobile = false,
  onClick 
}) => {
  if (isMobile) {
    return (
      <div
        className={`flex items-center justify-between p-4 bg-gray-50 dark:bg-neutral-700 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-600 hover:scale-[1.01] hover:shadow-md transition-all duration-200 ${onClick ? 'cursor-pointer' : ''}`}
        onClick={onClick}
      >
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          <div className="text-xl flex-shrink-0">
            {getActivityIcon(activity.type)}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-gray-900 dark:text-gray-100 text-sm truncate">
              {activity.title}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {formatDate(activity.timestamp)}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2 flex-shrink-0">
          <Badge className={`text-xs px-2 py-1 ${getStatusColor(activity.status)}`}>
            {activity.status}
          </Badge>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex items-center justify-between p-4 bg-gray-50 dark:bg-neutral-700 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-600 hover:scale-[1.02] hover:shadow-xl transition-all duration-200 ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-center space-x-4">
        <div className="text-2xl">
          {getActivityIcon(activity.type)}
        </div>
        <div>
          <h3 className="font-medium text-gray-900 dark:text-gray-100">
            {activity.title}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {formatDate(activity.timestamp)}
          </p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Badge className={getStatusColor(activity.status)}>
          {activity.status}
        </Badge>
      </div>
    </div>
  );
}; 