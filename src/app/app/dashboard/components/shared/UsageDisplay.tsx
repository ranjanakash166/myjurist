import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { PlanUsage, FeatureUsage, formatPeriodDate, getIconName } from '@/lib/planApi';
import {
  Scale,
  FileSearch,
  MessageCircle,
  Clock,
  FolderTree,
  PenTool,
  Circle,
} from 'lucide-react';

interface UsageDisplayProps {
  planUsage: PlanUsage;
  isMobile?: boolean;
}

// Icon mapping component
const IconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Scale,
  FileSearch,
  MessageCircle,
  Clock,
  FolderTree,
  PenTool,
  Circle,
};

const getFeatureIcon = (iconKey: string) => {
  const iconName = getIconName(iconKey);
  const IconComponent = IconMap[iconName] || Circle;
  return IconComponent;
};

const getUsageColor = (percentage: number): string => {
  if (percentage >= 90) return 'bg-red-500';
  if (percentage >= 75) return 'bg-orange-500';
  if (percentage >= 50) return 'bg-yellow-500';
  return 'bg-primary';
};

const getUsageTextColor = (percentage: number): string => {
  if (percentage >= 90) return 'text-red-600 dark:text-red-400';
  if (percentage >= 75) return 'text-orange-600 dark:text-orange-400';
  if (percentage >= 50) return 'text-yellow-600 dark:text-yellow-400';
  return 'text-primary';
};

export const UsageDisplay: React.FC<UsageDisplayProps> = ({ planUsage, isMobile = false }) => {
  if (isMobile) {
    return (
      <Card className="bg-card shadow-sm border border-border mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-foreground">
            Usage & Limits
          </CardTitle>
          <CardDescription className="text-xs">
            {planUsage.features.length > 0 && (
              <>Period: {formatPeriodDate(planUsage.features[0].period_start)} - {formatPeriodDate(planUsage.features[0].period_end)}</>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {planUsage.features.map((feature) => {
            const IconComponent = getFeatureIcon(feature.icon);
            const usageColor = getUsageColor(feature.usage_percentage);
            const textColor = getUsageTextColor(feature.usage_percentage);

            return (
              <div key={feature.display_key} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <IconComponent className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground">
                      {feature.display_name}
                    </span>
                  </div>
                  <span className={`text-xs font-semibold ${textColor}`}>
                    {feature.current_count} / {feature.max_count}
                  </span>
                </div>
                <Progress 
                  value={feature.usage_percentage} 
                  className="h-2"
                />
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{feature.description}</span>
                  <span className={textColor}>
                    {feature.remaining} remaining
                  </span>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card shadow-sm border border-border mb-4">
      <CardContent className="py-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-1">
              Usage & Limits
            </h3>
            {planUsage.features.length > 0 && (
              <p className="text-xs text-muted-foreground">
                Period: {formatPeriodDate(planUsage.features[0].period_start)} - {formatPeriodDate(planUsage.features[0].period_end)}
              </p>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {planUsage.features.map((feature) => {
            const IconComponent = getFeatureIcon(feature.icon);
            const usageColor = getUsageColor(feature.usage_percentage);
            const textColor = getUsageTextColor(feature.usage_percentage);

            return (
              <div
                key={feature.display_key}
                className="p-3 rounded-lg border border-border bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-2 mb-2">
                  <IconComponent className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <h3 className="text-xs font-semibold text-foreground truncate">
                    {feature.display_name}
                  </h3>
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Usage</span>
                    <span className={`font-semibold ${textColor}`}>
                      {feature.current_count.toLocaleString()} / {feature.max_count.toLocaleString()}
                    </span>
                  </div>
                  <Progress 
                    value={feature.usage_percentage} 
                    className="h-1.5"
                  />
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">
                      {feature.remaining.toLocaleString()} left
                    </span>
                    <span className={`font-medium ${textColor}`}>
                      {feature.usage_percentage.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
