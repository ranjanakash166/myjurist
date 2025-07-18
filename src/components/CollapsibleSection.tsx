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
    <div className={`glass-effect rounded-2xl overflow-hidden ${className}`}>
      <button
        onClick={handleToggle}
        className="w-full flex items-center justify-between p-4 hover:bg-slate-700/50 transition-colors"
      >
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        {isCollapsed ? (
          <ChevronDown className="w-5 h-5 text-slate-400" />
        ) : (
          <ChevronUp className="w-5 h-5 text-slate-400" />
        )}
      </button>
      
      {!isCollapsed && (
        <div className="p-4 border-t border-slate-700/50">
          {children}
        </div>
      )}
    </div>
  );
} 