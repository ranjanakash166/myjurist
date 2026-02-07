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
        className={`flex items-center justify-between p-2.5 bg-muted rounded-lg border-b border-border last:border-b-0 hover:bg-accent hover:scale-[1.01] hover:shadow-md transition-all duration-200 ${onClick ? 'cursor-pointer' : ''}`}
        onClick={onClick}
      >
        <div className="flex items-center space-x-2 flex-1 min-w-0">
          <div className="text-base flex-shrink-0">
            {getActivityIcon(activity.type)}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-foreground text-xs truncate leading-tight">
              {activity.title}
            </h3>
            <p className="text-xs text-muted-foreground leading-tight">
              {formatDate(activity.timestamp)}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-1 flex-shrink-0 ml-1.5">
          <Badge className={`text-xs px-1.5 py-0.5 ${getStatusColor(activity.status)}`}>
            {activity.status}
          </Badge>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex items-center justify-between p-4 bg-muted rounded-lg border-b border-border last:border-b-0 hover:bg-accent hover:scale-[1.02] hover:shadow-xl transition-all duration-200 ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-center space-x-4">
        <div className="text-2xl">
          {getActivityIcon(activity.type)}
        </div>
        <div>
          <h3 className="font-medium text-foreground">
            {activity.title}
          </h3>
          <p className="text-sm text-muted-foreground">
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