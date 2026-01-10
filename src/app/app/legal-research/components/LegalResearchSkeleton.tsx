import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function LegalResearchSkeleton() {
  return (
    <div className="space-y-6">
      {/* AI Summary Skeleton */}
      <Card className="max-w-7xl mx-auto">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-5 rounded" />
            <Skeleton className="h-6 w-32" />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Summary Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
            </div>
            <Skeleton className="h-9 w-32 rounded-md" />
          </div>

          {/* AI Summary Content */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 rounded-lg p-6 border">
            <div className="flex items-center gap-2 mb-4">
              <Skeleton className="h-5 w-5 rounded" />
              <Skeleton className="h-6 w-24" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-full rounded" />
              <Skeleton className="h-4 w-full rounded" />
              <Skeleton className="h-4 w-5/6 rounded" />
              <Skeleton className="h-4 w-4/6 rounded" />
              <Skeleton className="h-4 w-full rounded" />
            </div>
          </div>

          {/* Key Legal Insights Skeleton */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-lg p-6 border">
            <div className="flex items-center gap-2 mb-4">
              <Skeleton className="h-5 w-5 rounded" />
              <Skeleton className="h-6 w-36" />
            </div>
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg border">
                  <Skeleton className="w-2 h-2 rounded-full mt-2 flex-shrink-0" />
                  <Skeleton className="h-4 flex-1 rounded" />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search Results Skeleton */}
      <div className="space-y-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-2 mb-4">
          <Skeleton className="h-5 w-5 rounded" />
          <Skeleton className="h-7 w-48" />
        </div>

        {/* Result Cards Skeleton - 3-4 cards as requested */}
        {[1, 2, 3, 4].map((index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <Skeleton className="h-4 w-4 rounded" />
                    <Skeleton className="h-5 w-3/4" />
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Skeleton className="h-8 w-8 rounded" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="bg-muted/50 rounded-lg p-4 border">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full rounded" />
                  <Skeleton className="h-4 w-full rounded" />
                  <Skeleton className="h-4 w-5/6 rounded" />
                  <Skeleton className="h-4 w-4/6 rounded" />
                  <Skeleton className="h-4 w-full rounded" />
                  <Skeleton className="h-4 w-3/4 rounded" />
                </div>
              </div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t">
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-8 w-20 rounded-md" />
                  <Skeleton className="h-8 w-28 rounded-md" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
