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
    value: 'text-primary',
    bg: 'bg-primary/10',
    border: 'border-primary/20'
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
        className={`bg-card shadow-sm border ${colors.border} hover:scale-[1.02] hover:shadow-lg transition-all duration-200 ${onClick ? 'cursor-pointer' : ''}`}
        onClick={onClick}
      >
        <CardContent className="p-3">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0 pr-2">
              <h3 className="text-xs font-medium text-muted-foreground mb-1 leading-tight">
                {title}
              </h3>
              <div className={`text-lg font-bold ${colors.value} mb-0.5 leading-tight`}>
                {typeof value === 'number' ? value.toLocaleString() : value}
              </div>
              <p className="text-xs text-muted-foreground leading-tight">
                {description}
              </p>
            </div>
            <div className={`w-8 h-8 rounded-full ${colors.bg} flex items-center justify-center flex-shrink-0`}>
              <div className={`w-4 h-4 rounded-full ${color === 'blue' ? 'bg-primary opacity-30' : colors.value.replace('text-', 'bg-') + ' opacity-20'}`}></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card 
      className={`bg-card shadow-sm border border-border hover:scale-[1.02] hover:shadow-xl transition-transform duration-200 ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className={`text-3xl font-bold ${colors.value}`}>
          {typeof value === 'number' ? value.toLocaleString() : value}
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}; 