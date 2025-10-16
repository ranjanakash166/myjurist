"use client";
import React, { useState, useRef, useEffect } from "react";
import { 
  Send, 
  Paperclip, 
  Mic, 
  Search, 
  Zap, 
  Eye, 
  FileText, 
  Download, 
  Brain,
  BookOpen,
  FolderOpen,
  Clock,
  Shield,
  FileCheck,
  Lightbulb,
  Target,
  Users,
  Settings,
  History,
  Plus,
  X,
  Loader2,
  Sparkles,
  MessageSquare,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../../../components/ui/collapsible";
import { useAuth } from "../../../components/AuthProvider";
import { toast } from '@/hooks/use-toast';
import SimpleMarkdownRenderer from "../../../components/SimpleMarkdownRenderer";
import { createSuperChatApi, SuperChatRequest, SuperChatResponse } from "@/lib/superChatApi";

// Feature types for the Super Chat
type ChatFeature = 
  | "simple-chat"
  | "legal-research" 
  | "document-analysis"
  | "document-categorization"
  | "timeline-extractor"
  | "regulatory-compliance"
  | "smart-document-studio"
  | "patent-analysis"
  | "organization-management";

interface ChatMessage {
  id: string;
  sender: "user" | "assistant";
  content: string;
  timestamp: Date;
  feature?: ChatFeature;
  metadata?: any;
}

interface FeatureConfig {
  id: ChatFeature;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  enabled: boolean;
}

const FEATURES: FeatureConfig[] = [
  {
    id: "simple-chat",
    name: "Simple Chat",
    description: "General conversation and assistance",
    icon: MessageSquare,
    color: "bg-blue-500",
    enabled: true
  },
  {
    id: "legal-research",
    name: "Legal Research",
    description: "Search legal database with AI insights",
    icon: BookOpen,
    color: "bg-purple-500",
    enabled: true
  },
  {
    id: "document-analysis",
    name: "Document Analysis",
    description: "Analyze uploaded documents",
    icon: FileText,
    color: "bg-green-500",
    enabled: true
  },
  {
    id: "document-categorization",
    name: "Document Categorization",
    description: "Automatically categorize documents",
    icon: FolderOpen,
    color: "bg-orange-500",
    enabled: true
  },
  {
    id: "timeline-extractor",
    name: "Timeline Extractor",
    description: "Extract timelines from documents",
    icon: Clock,
    color: "bg-indigo-500",
    enabled: true
  },
  {
    id: "regulatory-compliance",
    name: "Regulatory Compliance",
    description: "Search regulatory information",
    icon: Shield,
    color: "bg-red-500",
    enabled: true
  },
  {
    id: "smart-document-studio",
    name: "Smart Document Studio",
    description: "Generate contracts and documents",
    icon: FileCheck,
    color: "bg-teal-500",
    enabled: true
  },
  {
    id: "patent-analysis",
    name: "Patent Analysis",
    description: "Analyze patent information",
    icon: Lightbulb,
    color: "bg-yellow-500",
    enabled: true
  },
  {
    id: "organization-management",
    name: "Organization Management",
    description: "Manage organization data",
    icon: Users,
    color: "bg-pink-500",
    enabled: true
  }
];

export default function SuperChatPage() {
  const { getAuthHeaders, refreshToken } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<ChatFeature>("simple-chat");
  const [isFeatureSelectorOpen, setIsFeatureSelectorOpen] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  
  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectedFeatureConfig = FEATURES.find(f => f.id === selectedFeature);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: "user",
      content: input.trim(),
      timestamp: new Date(),
      feature: selectedFeature
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call based on selected feature
      const response = await handleFeatureRequest(selectedFeature, input.trim());
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: "assistant",
        content: response,
        timestamp: new Date(),
        feature: selectedFeature
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err: any) {
      setError(err.message || "An error occurred");
      toast({
        title: "Error",
        description: err.message || "An error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFeatureRequest = async (feature: ChatFeature, query: string): Promise<string> => {
    try {
      const superChatApi = createSuperChatApi(getAuthHeaders, refreshToken);
      
      const request: SuperChatRequest = {
        query,
        feature,
        files: uploadedFiles,
        context: { previousMessages: messages.slice(-5) } // Include recent context
      };

      const response: SuperChatResponse = await superChatApi.processRequest(request);
      
      // Add suggestions to the response if available
      if (response.suggestions && response.suggestions.length > 0) {
        const suggestions = response.suggestions.map(s => `• ${s}`).join('\n');
        return `${response.content}\n\n**Suggested Actions:**\n${suggestions}`;
      }
      
      return response.content;
    } catch (error: any) {
      console.error('Super Chat API Error:', error);
      return `❌ **Error**\n\nI encountered an error while processing your request: ${error.message}\n\nPlease try again or contact support if the issue persists.`;
    }
  };

  const handleFileUpload = async (files: FileList) => {
    setIsUploading(true);
    try {
      const fileArray = Array.from(files);
      setUploadedFiles(prev => [...prev, ...fileArray]);
      
      toast({
        title: "Files uploaded",
        description: `${fileArray.length} file(s) uploaded successfully`,
      });
    } catch (err: any) {
      toast({
        title: "Upload failed",
        description: err.message || "Failed to upload files",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getFeatureIcon = (feature: ChatFeature) => {
    const config = FEATURES.find(f => f.id === feature);
    return config ? config.icon : MessageSquare;
  };

  const getFeatureColor = (feature: ChatFeature) => {
    const config = FEATURES.find(f => f.id === feature);
    return config ? config.color : "bg-blue-500";
  };

  return (
    <div className="h-screen flex flex-col bg-neutral-950">
      {/* Header */}
      <div className="bg-neutral-900 border-b border-neutral-800 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Super Chat</h1>
              <p className="text-sm text-neutral-400">AI-powered legal assistant</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setChatHistory(messages)}
              className="text-neutral-300 border-neutral-700 hover:bg-neutral-800"
            >
              <History className="w-4 h-4 mr-2" />
              History
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-neutral-300 border-neutral-700 hover:bg-neutral-800"
            >
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Feature Selector */}
        <div className="w-80 bg-neutral-900 border-r border-neutral-800 flex flex-col">
          <div className="p-4 border-b border-neutral-800">
            <h2 className="text-lg font-semibold text-white mb-4">Choose Feature</h2>
            
            <Collapsible open={isFeatureSelectorOpen} onOpenChange={setIsFeatureSelectorOpen}>
              <CollapsibleTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-between text-neutral-300 border-neutral-700 hover:bg-neutral-800"
                >
                  <div className="flex items-center gap-2">
                    {selectedFeatureConfig && (
                      <>
                        <selectedFeatureConfig.icon className="w-4 h-4" />
                        <span>{selectedFeatureConfig.name}</span>
                      </>
                    )}
                  </div>
                  {isFeatureSelectorOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </Button>
              </CollapsibleTrigger>
              
              <CollapsibleContent className="mt-2 space-y-1">
                {FEATURES.map((feature) => (
                  <Button
                    key={feature.id}
                    variant={selectedFeature === feature.id ? "default" : "ghost"}
                    className={`w-full justify-start text-left ${
                      selectedFeature === feature.id 
                        ? "bg-neutral-800 text-white" 
                        : "text-neutral-400 hover:text-white hover:bg-neutral-800"
                    }`}
                    onClick={() => setSelectedFeature(feature.id)}
                  >
                    <feature.icon className="w-4 h-4 mr-3" />
                    <div>
                      <div className="font-medium">{feature.name}</div>
                      <div className="text-xs opacity-75">{feature.description}</div>
                    </div>
                  </Button>
                ))}
              </CollapsibleContent>
            </Collapsible>
          </div>

          {/* Uploaded Files */}
          <div className="flex-1 p-4">
            <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Uploaded Files
              <Badge variant="secondary" className="ml-auto">
                {uploadedFiles.length}
              </Badge>
            </h3>
            
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {uploadedFiles.length === 0 ? (
                <div className="text-center text-neutral-500 text-sm py-4">
                  <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No files uploaded</p>
                </div>
              ) : (
                uploadedFiles.map((file, index) => (
                  <div
                    key={index}
                    className="p-2 bg-neutral-800 rounded-lg border border-neutral-700 hover:bg-neutral-700 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white truncate">{file.name}</p>
                        <p className="text-xs text-neutral-400">
                          {(file.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 text-neutral-400 hover:text-red-400"
                        onClick={() => setUploadedFiles(prev => prev.filter((_, i) => i !== index))}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-neutral-800 rounded-full flex items-center justify-center">
                    <Sparkles className="w-8 h-8 text-neutral-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Welcome to Super Chat</h3>
                  <p className="text-neutral-400 mb-4">
                    Choose a feature and start chatting with AI assistance
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {FEATURES.slice(0, 4).map((feature) => (
                      <Button
                        key={feature.id}
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedFeature(feature.id)}
                        className="text-neutral-300 border-neutral-700 hover:bg-neutral-800"
                      >
                        <feature.icon className="w-4 h-4 mr-2" />
                        {feature.name}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start gap-3 ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {message.sender === "assistant" && (
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getFeatureColor(message.feature || "simple-chat")}`}>
                    {React.createElement(getFeatureIcon(message.feature || "simple-chat"), { className: "w-4 h-4 text-white" })}
                  </div>
                )}
                
                <div
                  className={`max-w-2xl px-4 py-3 rounded-2xl ${
                    message.sender === "user"
                      ? "bg-neutral-800 text-white rounded-br-md"
                      : "bg-neutral-900 text-neutral-200 rounded-bl-md border border-neutral-700"
                  }`}
                >
                  <div className="whitespace-pre-wrap">
                    <SimpleMarkdownRenderer content={message.content} />
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="text-xs text-neutral-500">
                      {formatTime(message.timestamp)}
                    </div>
                    {message.feature && message.feature !== "simple-chat" && (
                      <Badge variant="secondary" className="text-xs">
                        {FEATURES.find(f => f.id === message.feature)?.name}
                      </Badge>
                    )}
                  </div>
                </div>

                {message.sender === "user" && (
                  <div className="w-8 h-8 bg-neutral-700 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    U
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex items-start gap-3 justify-start">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getFeatureColor(selectedFeature)}`}>
                  {React.createElement(getFeatureIcon(selectedFeature), { className: "w-4 h-4 text-white" })}
                </div>
                <div className="px-4 py-3 rounded-2xl bg-neutral-900 text-neutral-200 rounded-bl-md border border-neutral-700">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Thinking...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Input Area */}
          <div className="bg-neutral-900 border-t border-neutral-800 p-4">
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSendMessage} className="flex gap-3">
              <div className="flex-1 relative">
                <Input
                  type="text"
                  placeholder={`Ask about ${selectedFeatureConfig?.name.toLowerCase()}...`}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="bg-neutral-800 border-neutral-700 text-white placeholder-neutral-400 focus:border-neutral-600"
                  disabled={isLoading}
                />
              </div>
              
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isLoading || isUploading}
                  className="text-neutral-300 border-neutral-700 hover:bg-neutral-800"
                >
                  {isUploading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Paperclip className="w-4 h-4" />
                  )}
                </Button>
                
                <Button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                multiple
                className="hidden"
                onChange={(e) => {
                  if (e.target.files) {
                    handleFileUpload(e.target.files);
                  }
                }}
              />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
