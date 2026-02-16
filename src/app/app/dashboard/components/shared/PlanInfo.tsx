import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PlanInfo as PlanInfoType, getStatusColor, getPlanTierColor, formatPeriodDate } from '@/lib/planApi';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

interface PlanInfoProps {
  planInfo: PlanInfoType;
  isMobile?: boolean;
}

export const PlanInfo: React.FC<PlanInfoProps> = ({ planInfo, isMobile = false }) => {
  const statusColor = getStatusColor(planInfo.status);
  const tierColor = getPlanTierColor(planInfo.plan_tier);

  // Capitalize first letter of each word
  const capitalizeWords = (str: string) => {
    return str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
  };

  if (isMobile) {
    return (
      <Card className="bg-card shadow-sm border border-border mb-4">
        <CardContent className="py-3 px-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 flex-1 flex-wrap">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-medium text-muted-foreground">Plan:</span>
                <Badge className={tierColor} variant="outline" className="text-xs px-1.5 py-0.5">
                  {capitalizeWords(planInfo.plan_name)}
                </Badge>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-medium text-muted-foreground">Tier:</span>
                <span className="text-xs font-semibold text-foreground">
                  {capitalizeWords(planInfo.plan_tier)}
                </span>
              </div>
            </div>
            <Badge className={`${statusColor} px-1.5 py-0.5 text-xs`}>
              {capitalizeWords(planInfo.status)}
            </Badge>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card shadow-sm border border-border mb-4">
      <CardContent className="py-4">
        <div className="flex items-center justify-between gap-6">
          <div className="flex items-center gap-6 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground">Plan:</span>
              <Badge className={tierColor} variant="outline" className="text-sm px-2 py-0.5">
                {capitalizeWords(planInfo.plan_name)}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground">Tier:</span>
              <span className="text-sm font-semibold text-foreground capitalize">
                {capitalizeWords(planInfo.plan_tier)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground">Type:</span>
              <span className="text-sm font-semibold text-foreground capitalize">
                {capitalizeWords(planInfo.plan_kind)}
              </span>
            </div>
          </div>
          <Badge className={`${statusColor} px-2 py-1 text-xs`}>
            {planInfo.status === 'active' && <CheckCircle className="w-3 h-3 mr-1" />}
            {planInfo.status !== 'active' && <XCircle className="w-3 h-3 mr-1" />}
            {capitalizeWords(planInfo.status)}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};
