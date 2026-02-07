"use client";
import React from "react";
import Link from "next/link";
import { 
  Search, 
  Calendar, 
  Shield, 
  MessageSquare,
  Tags,
  Clock,
  Sparkles,
  Upload,
  ArrowRight,
  BarChart3
} from "lucide-react";
import { useAuth } from "../../../components/AuthProvider";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function HomePage() {
  const { user } = useAuth();

  // Document Intelligence - Upload-based features
  const documentFeatures = [
    {
      title: "Document Analysis",
      description: "Upload and analyze legal documents with AI",
      icon: Upload,
      href: "/app/document-analysis"
    },
    {
      title: "Timeline Extractor",
      description: "Extract chronological events from documents",
      icon: Clock,
      href: "/app/timeline-extractor"
    },
    {
      title: "Document Categorization",
      description: "Smart document classification and sorting",
      icon: Tags,
      href: "/app/document-categorization"
    }
  ];

  // AI Research & Chat - Conversational features
  const researchFeatures = [
    {
      title: "Dashboard",
      description: "View your activity and statistics",
      icon: BarChart3,
      href: "/app/dashboard"
    },
    {
      title: "Legal Research",
      description: "AI-powered case law and precedent search",
      icon: Search,
      href: "/app/legal-research"
    },
    {
      title: "Regulatory Compliance",
      description: "Automated compliance checking and guidance",
      icon: Shield,
      href: "/app/regulatory-compliance"
    },
    {
      title: "My Jurist Chat",
      description: "AI legal assistant for instant answers",
      icon: MessageSquare,
      href: "/app/my-jurist-chat"
    },
    {
      title: "Smart Document Drafting",
      description: "AI-powered document creation and generation",
      icon: Sparkles,
      href: "/app/smart-document-studio"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Quick Actions Section */}
      <div className="w-full px-4 sm:px-6 lg:px-8 pt-8 pb-8">
        <div className="mb-4">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-2">
            <Sparkles className="h-7 w-7 text-emerald-600 dark:text-primary" />
            Quick Actions
          </h2>
        </div>
        <p className="text-base text-muted-foreground mb-8">
          Access all features and start working with AI-powered legal tools
        </p>

        {/* Document Intelligence Section */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <Upload className="h-5 w-5 text-emerald-600 dark:text-primary" />
            <h3 className="text-xl font-semibold text-foreground">Document Intelligence</h3>
            <Badge variant="outline" className="text-xs">Upload & Analyze</Badge>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Upload your documents for AI-powered analysis and insights
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {documentFeatures.map((feature, index) => {
              const Icon = feature.icon;
              
              return (
                <Link key={index} href={feature.href} className="group">
                  <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-card dark:to-primary/10 border-emerald-200 dark:border-border dark:border-primary/30 hover:scale-[1.02] hover:shadow-xl transition-all duration-300 cursor-pointer h-full">
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between mb-4">
                        <div className="p-3 rounded-lg bg-emerald-600 dark:bg-primary group-hover:scale-110 transition-transform duration-300">
                          <Icon className="h-6 w-6 text-white dark:text-primary-foreground" />
                        </div>
                        <ArrowRight className="h-5 w-5 text-emerald-600 dark:text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                      <CardTitle className="text-lg font-semibold text-gray-900 dark:text-foreground">
                        {feature.title}
                      </CardTitle>
                      <CardDescription className="text-gray-600 dark:text-muted-foreground mt-2">
                        {feature.description}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>

        {/* AI Research & Chat Section */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <MessageSquare className="h-5 w-5 text-slate-600 dark:text-primary" />
            <h3 className="text-xl font-semibold text-foreground">AI Research & Chat</h3>
            <Badge variant="outline" className="text-xs">Conversational AI</Badge>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Get instant answers, research, and AI assistance without uploading documents
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {researchFeatures.map((feature, index) => {
              const Icon = feature.icon;
              
              return (
                <Link key={index} href={feature.href} className="group">
                  <Card className="bg-gradient-to-br from-slate-50 to-gray-50 dark:from-card dark:to-primary/10 border-slate-200 dark:border-border dark:border-primary/30 hover:scale-[1.02] hover:shadow-xl transition-all duration-300 cursor-pointer h-full">
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between mb-4">
                        <div className="p-3 rounded-lg bg-slate-600 dark:bg-primary group-hover:scale-110 transition-transform duration-300">
                          <Icon className="h-6 w-6 text-white dark:text-primary-foreground" />
                        </div>
                        <ArrowRight className="h-5 w-5 text-slate-600 dark:text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                      <CardTitle className="text-lg font-semibold text-gray-900 dark:text-foreground">
                        {feature.title}
                      </CardTitle>
                      <CardDescription className="text-gray-600 dark:text-muted-foreground mt-2">
                        {feature.description}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
