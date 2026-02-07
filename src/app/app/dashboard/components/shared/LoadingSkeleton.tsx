import React from 'react';

interface LoadingSkeletonProps {
  isMobile?: boolean;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ isMobile = false }) => {
  if (isMobile) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            {/* Header */}
            <div className="h-8 bg-muted rounded w-3/4 mb-6"></div>
            <div className="h-4 bg-muted rounded w-1/2 mb-8"></div>
            
            {/* Mobile Stats Cards */}
            <div className="space-y-4 mb-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-20 bg-muted rounded-lg"></div>
              ))}
            </div>
            
            {/* Mobile Charts */}
            <div className="space-y-6 mb-8">
              <div className="h-64 bg-muted rounded-lg"></div>
              <div className="h-64 bg-muted rounded-lg"></div>
            </div>
            
            {/* Mobile Quick Actions */}
            <div className="space-y-3 mb-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 bg-muted rounded-lg"></div>
              ))}
            </div>
            
            {/* Mobile Activity */}
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-20 bg-muted rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="animate-pulse">
          {/* Header */}
          <div className="h-8 bg-muted rounded w-1/4 mb-6"></div>
          <div className="h-4 bg-muted rounded w-1/3 mb-8"></div>
          
          {/* Desktop Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-muted rounded"></div>
            ))}
          </div>
          
          {/* Desktop Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="h-80 bg-muted rounded"></div>
            <div className="h-80 bg-muted rounded"></div>
          </div>
          
          {/* Desktop Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-muted rounded"></div>
            ))}
          </div>
          
          {/* Desktop Activity */}
          <div className="h-96 bg-muted rounded"></div>
        </div>
      </div>
    </div>
  );
}; 