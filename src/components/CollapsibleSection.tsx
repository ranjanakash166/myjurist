import React from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
  isCollapsed?: boolean;
  onToggle?: (collapsed: boolean) => void;
  className?: string;
}

export default function CollapsibleSection({ 
  title, 
  children, 
  isCollapsed = false, 
  onToggle,
  className = ""
}: CollapsibleSectionProps) {
  const handleToggle = () => {
    onToggle?.(!isCollapsed);
  };

  return (
    <div className={`rounded-2xl overflow-hidden bg-card border border-border shadow-sm ${className}`}>
      <button
        onClick={handleToggle}
        className="w-full flex items-center justify-between p-4 bg-muted/80 hover:bg-accent transition-colors text-left"
      >
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        {isCollapsed ? (
          <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0" />
        ) : (
          <ChevronUp className="w-5 h-5 text-muted-foreground flex-shrink-0" />
        )}
      </button>
      
      {!isCollapsed && (
        <div className="p-4 border-t border-border bg-card">
          {children}
        </div>
      )}
    </div>
  );
} 