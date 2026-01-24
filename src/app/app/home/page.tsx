"use client";
import React from "react";
import Link from "next/link";
import { 
  Brain, 
  Database, 
  Leaf, 
  Settings, 
  FileText, 
  Search, 
  Calendar, 
  FileCheck, 
  Shield, 
  CheckCircle, 
  Users,
  ArrowRight,
  MessageSquare,
  FolderOpen,
  PenTool,
  Zap,
  BarChart3,
  FileSearch,
  Scale,
  Tags,
  Clock,
  Sparkles,
  Upload
} from "lucide-react";
import { useAuth } from "../../../components/AuthProvider";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  subFeatures: Array<{
    title: string;
    description: string;
    icon: React.ReactNode;
    href: string;
  }>;
  gradient: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  icon,
  subFeatures,
  gradient
}) => (
  <div className={`relative overflow-hidden rounded-2xl p-4 ${gradient} border border-border/50 hover:border-border transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] group`}>
    <div className="relative z-10">
      {/* Header */}
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center text-white">
          {icon}
        </div>
        <h3 className="text-xl font-bold text-white">{title}</h3>
      </div>
      
      {/* Description */}
      <p className="text-white/90 text-sm mb-4 leading-relaxed">
        {description}
      </p>
      
      {/* Sub-features */}
      <div className="space-y-2">
        {subFeatures.map((feature, index) => (
          <Link
            key={index}
            href={feature.href}
            className="flex items-start gap-3 p-2 rounded-lg hover:bg-white/10 transition-all duration-200 group/feature"
          >
            <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover/feature:bg-white/30 transition-colors">
              {feature.icon}
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-white text-sm group-hover/feature:text-white transition-colors">{feature.title}</h4>
              <p className="text-white/80 text-xs group-hover/feature:text-white/90 transition-colors">{feature.description}</p>
            </div>
            <ArrowRight className="w-4 h-4 text-white/60 group-hover/feature:text-white group-hover/feature:translate-x-1 transition-all duration-200" />
          </Link>
        ))}
      </div>
    </div>
    
    {/* Background decoration */}
    <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -translate-y-12 translate-x-12"></div>
    <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/5 rounded-full translate-y-8 -translate-x-8"></div>
  </div>
);

export default function HomePage() {
  const { user } = useAuth();

  const features: FeatureCardProps[] = [
    {
      title: "Legal Research",
      description: "AI-enhanced case law and precedent search. Leverage powerful search tools to find relevant legal documents and insights.",
      icon: <Search className="w-6 h-6" />,
      subFeatures: [
        {
          title: "Case Law Search",
          description: "Find relevant cases and precedents",
          icon: <Search className="w-4 h-4" />,
          href: "/app/legal-research"
        },
        {
          title: "Legal Analysis",
          description: "AI-powered legal document analysis",
          icon: <FileSearch className="w-4 h-4" />,
          href: "/app/legal-research"
        }
      ],
      gradient: "bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900"
    },
    {
      title: "Document Analysis",
      description: "AI-Powered Document Analysis & Chat. Search, analyze, and understand legal documents with intelligent AI assistance. Ask follow-up questions and get instant insights.",
      icon: <Brain className="w-6 h-6" />,
      subFeatures: [
        {
          title: "Document Chat",
          description: "Upload and chat with your legal documents",
          icon: <MessageSquare className="w-4 h-4" />,
          href: "/app/document-analysis"
        },
        {
          title: "Document Categorization",
          description: "Smart tools for understanding and sorting documents",
          icon: <Tags className="w-4 h-4" />,
          href: "/app/document-categorization"
        }
      ],
      gradient: "bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900"
    },
    {
      title: "Regulatory Compliance",
      description: "Automated compliance checking and guidance. Stay compliant with AI-powered regulatory analysis and monitoring.",
      icon: <Shield className="w-6 h-6" />,
      subFeatures: [
        {
          title: "Compliance Check",
          description: "Automated compliance verification",
          icon: <CheckCircle className="w-4 h-4" />,
          href: "/app/regulatory-compliance"
        },
        {
          title: "Regulatory Updates",
          description: "Stay updated with latest regulations",
          icon: <Scale className="w-4 h-4" />,
          href: "/app/regulatory-compliance"
        }
      ],
      gradient: "bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900"
    },
    {
      title: "Timeline Extractor",
      description: "Automated Event Timeline Extraction. Extract and organize chronological events from legal documents with precision.",
      icon: <Clock className="w-6 h-6" />,
      subFeatures: [
        {
          title: "Extract Timeline",
          description: "Automated event extraction from documents",
          icon: <Calendar className="w-4 h-4" />,
          href: "/app/timeline-extractor"
        }
      ],
      gradient: "bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900"
    },
    {
      title: "My Jurist Chat",
      description: "AI Legal Assistant. Get instant answers to legal questions and comprehensive legal guidance powered by advanced AI.",
      icon: <MessageSquare className="w-6 h-6" />,
      subFeatures: [
        {
          title: "Legal Q&A",
          description: "Ask any legal question and get AI-powered answers",
          icon: <MessageSquare className="w-4 h-4" />,
          href: "/app/my-jurist-chat"
        }
      ],
      gradient: "bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900"
    },
    {
      title: "Patent Analysis",
      description: "Comprehensive Patent Evaluation. Analyze patents and intellectual property with detailed AI-powered insights.",
      icon: <FileSearch className="w-6 h-6" />,
      subFeatures: [
        {
          title: "Patent Review",
          description: "Comprehensive patent evaluation and reporting",
          icon: <Shield className="w-4 h-4" />,
          href: "/app/patent-analysis"
        }
      ],
      gradient: "bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900"
    },
    {
      title: "Document Categorization",
      description: "Smart Document Classification. Automatically categorize and organize legal documents with AI assistance.",
      icon: <Tags className="w-6 h-6" />,
      subFeatures: [
        {
          title: "Auto-Categorize",
          description: "Smart tools for understanding and sorting documents",
          icon: <Tags className="w-4 h-4" />,
          href: "/app/document-categorization"
        }
      ],
      gradient: "bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900"
    },
    {
      title: "Smart Document Drafting",
      description: "AI-Generated Legal Content Creation. Generate and revise detailed legal documents including contracts, briefs, and provisions with intelligent assistance.",
      icon: <Sparkles className="w-6 h-6" />,
      subFeatures: [
        {
          title: "Document Drafting",
          description: "AI-powered document creation and generation",
          icon: <Sparkles className="w-4 h-4" />,
          href: "/app/smart-document-studio"
        },
        {
          title: "Document Generation",
          description: "Create legal briefs and complex documents",
          icon: <FileText className="w-4 h-4" />,
          href: "/app/smart-document-studio"
        }
      ],
      gradient: "bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Quick Actions Section - Now at the top */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-2">
            <Sparkles className="h-7 w-7 text-blue-600 dark:text-blue-400" />
            Quick Actions
          </h2>
          <Badge variant="secondary" className="text-xs">
            Get Started
          </Badge>
        </div>
        <p className="text-base text-muted-foreground mb-6">
          Start working with the most common features
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Legal Research Action */}
          <Link href="/app/legal-research" className="group">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800 hover:scale-[1.02] hover:shadow-2xl transition-all duration-300 cursor-pointer h-full">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="p-3 bg-blue-600 dark:bg-blue-700 rounded-lg group-hover:scale-110 transition-transform duration-300">
                    <Search className="h-6 w-6 text-white" />
                  </div>
                  <ArrowRight className="h-5 w-5 text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100 mt-3">
                  Legal Research
                </CardTitle>
                <CardDescription className="text-gray-700 dark:text-gray-300">
                  AI-powered case law and precedent search
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          {/* Document Analysis Action */}
          <Link href="/app/document-analysis" className="group">
            <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800 hover:scale-[1.02] hover:shadow-2xl transition-all duration-300 cursor-pointer h-full">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="p-3 bg-green-600 dark:bg-green-700 rounded-lg group-hover:scale-110 transition-transform duration-300">
                    <Upload className="h-6 w-6 text-white" />
                  </div>
                  <ArrowRight className="h-5 w-5 text-green-600 dark:text-green-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100 mt-3">
                  Document Analysis
                </CardTitle>
                <CardDescription className="text-gray-700 dark:text-gray-300">
                  Upload and analyze legal documents with AI
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          {/* Regulatory Compliance Action */}
          <Link href="/app/regulatory-compliance" className="group">
            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800 hover:scale-[1.02] hover:shadow-2xl transition-all duration-300 cursor-pointer h-full">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="p-3 bg-purple-600 dark:bg-purple-700 rounded-lg group-hover:scale-110 transition-transform duration-300">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  <ArrowRight className="h-5 w-5 text-purple-600 dark:text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100 mt-3">
                  Regulatory Compliance
                </CardTitle>
                <CardDescription className="text-gray-700 dark:text-gray-300">
                  Automated compliance checking and guidance
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
            All Features
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover how our platform transforms legal workflows with cutting-edge AI technology
          </p>
        </div>

        {/* Mobile Layout - Single Column */}
        <div className="grid grid-cols-1 gap-4 md:hidden">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>

        {/* Desktop Layout - 2x2 Grid for 4 categories */}
        <div className="hidden lg:grid lg:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
        
        {/* Medium Desktop Layout - 2x2 Grid */}
        <div className="hidden md:grid lg:hidden md:grid-cols-2 gap-4">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>
    </div>
  );
}
