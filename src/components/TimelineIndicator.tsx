import React from "react";
import { Check, FileText, MessageSquare, Users, Upload, MessageCircle } from "lucide-react";

interface TimelineStep {
  id: string;
  label: string;
  icon: React.ReactNode;
  status: "completed" | "current" | "pending";
}

interface TimelineIndicatorProps {
  currentStep: "documents" | "chat" | "conversation" | "upload" | "communication";
  selectedDocument?: string;
  selectedChat?: string;
}

export default function TimelineIndicator({ currentStep, selectedDocument, selectedChat }: TimelineIndicatorProps) {
  // Determine which steps to show based on current step
  const isNewAnalysis = currentStep === "upload" || currentStep === "communication";
  
  const getStepStatus = (stepId: string, currentStep: string): "completed" | "current" | "pending" => {
    if (stepId === currentStep) return "current";
    if (isNewAnalysis) {
      const stepOrder = ["upload", "communication", "conversation"];
      const currentIndex = stepOrder.indexOf(currentStep);
      const stepIndex = stepOrder.indexOf(stepId);
      return stepIndex < currentIndex ? "completed" : "pending";
    } else {
      const stepOrder = ["documents", "chat", "conversation"];
      const currentIndex = stepOrder.indexOf(currentStep);
      const stepIndex = stepOrder.indexOf(stepId);
      return stepIndex < currentIndex ? "completed" : "pending";
    }
  };
  
  const steps: TimelineStep[] = isNewAnalysis ? [
    {
      id: "upload",
      label: "Upload Document",
      icon: <Upload className="w-4 h-4" />,
      status: getStepStatus("upload", currentStep)
    },
    {
      id: "communication",
      label: "Communication",
      icon: <MessageCircle className="w-4 h-4" />,
      status: getStepStatus("communication", currentStep)
    },
    {
      id: "conversation",
      label: "Conversation",
      icon: <Users className="w-4 h-4" />,
      status: getStepStatus("conversation", currentStep)
    }
  ] : [
    {
      id: "documents",
      label: "Select Document",
      icon: <FileText className="w-4 h-4" />,
      status: getStepStatus("documents", currentStep)
    },
    {
      id: "chat",
      label: "Select Chat",
      icon: <MessageSquare className="w-4 h-4" />,
      status: getStepStatus("chat", currentStep)
    },
    {
      id: "conversation",
      label: "Conversation",
      icon: <Users className="w-4 h-4" />,
      status: getStepStatus("conversation", currentStep)
    }
  ];

  return (
    <div className="bg-slate-800/60 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-slate-300">Analysis Progress</h3>
        {selectedDocument && (
          <span className="text-xs text-slate-400 bg-slate-700/50 px-2 py-1 rounded">
            {selectedDocument}
          </span>
        )}
      </div>
      
      <div className="flex items-center space-x-4">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <div className="flex items-center space-x-2">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all ${
                step.status === "completed" 
                  ? "bg-ai-blue-500 border-ai-blue-500 text-white" 
                  : step.status === "current"
                  ? "bg-ai-blue-500/20 border-ai-blue-500 text-ai-blue-400"
                  : "bg-slate-700 border-slate-600 text-slate-400"
              }`}>
                {step.status === "completed" ? (
                  <Check className="w-4 h-4" />
                ) : (
                  step.icon
                )}
              </div>
              <span className={`text-sm font-medium ${
                step.status === "completed" 
                  ? "text-ai-blue-400" 
                  : step.status === "current"
                  ? "text-white"
                  : "text-slate-400"
              }`}>
                {step.label}
              </span>
            </div>
            
            {index < steps.length - 1 && (
              <div className={`flex-1 h-0.5 rounded ${
                step.status === "completed" ? "bg-ai-blue-500" : "bg-slate-600"
              }`} />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
} 