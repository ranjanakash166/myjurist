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
  Clock
} from "lucide-react";
import { useAuth } from "../../../components/AuthProvider";

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
      title: "Agents & Automation",
      description: "Specialized AI Agents & Workflows. Leverage domain-specific AI agents for complex legal tasks and automated workflows.",
      icon: <Settings className="w-6 h-6" />,
      subFeatures: [
        {
          title: "Patent Analysis",
          description: "Comprehensive patent evaluation and reporting",
          icon: <Shield className="w-4 h-4" />,
          href: "/app/patent-analysis"
        },
        {
          title: "Legal Research",
          description: "AI-enhanced case law and precedent search",
          icon: <Search className="w-4 h-4" />,
          href: "/app/legal-research"
        },
        {
          title: "Regulatory Compliance",
          description: "Automated compliance checking and guidance",
          icon: <CheckCircle className="w-4 h-4" />,
          href: "/app/regulatory-compliance"
        }
      ],
      gradient: "bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900"
    },
    {
      title: "Intelligence",
      description: "AI-Powered Document Analysis & Chat. Search, analyze, and understand legal documents with intelligent AI assistance. Ask follow-up questions and get instant insights.",
      icon: <Brain className="w-6 h-6" />,
      subFeatures: [
        {
          title: "Document Analysis",
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
      title: "Forge",
      description: "AI-Generated Legal Content Creation. Generate and revise detailed legal documents including contracts, briefs, and contractual provisions with intelligent assistance.",
      icon: <Leaf className="w-6 h-6" />,
      subFeatures: [
        {
          title: "Contract Drafting",
          description: "AI-powered contract generation and templates",
          icon: <PenTool className="w-4 h-4" />,
          href: "/app/contract-drafting"
        },
        {
          title: "Document Generation",
          description: "Create legal briefs and complex documents",
          icon: <FileText className="w-4 h-4" />,
          href: "/app/contract-drafting"
        }
      ],
      gradient: "bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900"
    },
    {
      title: "Repository",
      description: "Secure Document Storage & Management. Upload, store, and organize thousands of legal documents with advanced search and metadata management.",
      icon: <Database className="w-6 h-6" />,
      subFeatures: [
        {
          title: "Timeline Extractor",
          description: "Automated event extraction from documents",
          icon: <Clock className="w-4 h-4" />,
          href: "/app/timeline-extractor"
        },
        {
          title: "Document Management",
          description: "Organize and search your legal library",
          icon: <FolderOpen className="w-4 h-4" />,
          href: "/app/document-analysis"
        }
      ],
      gradient: "bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
            Powerful Features at Your Fingertips
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

      {/* Quick Actions Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="bg-card/50 rounded-2xl border border-border/50 p-6 backdrop-blur-sm">
          <div className="text-center mb-6">
            <h3 className="text-xl md:text-2xl font-bold text-foreground mb-2">
              Quick Actions
            </h3>
            <p className="text-sm text-muted-foreground">
              Get started quickly with these common tasks
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              href="/app/dashboard"
              className="flex items-center gap-3 p-4 rounded-xl bg-background/50 hover:bg-background border border-border/50 hover:border-border transition-all duration-200 hover:scale-105 group"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Dashboard</p>
                <p className="text-sm text-muted-foreground">View overview</p>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-transform ml-auto" />
            </Link>

            <Link
              href="/app/document-analysis"
              className="flex items-center gap-3 p-4 rounded-xl bg-background/50 hover:bg-background border border-border/50 hover:border-border transition-all duration-200 hover:scale-105 group"
            >
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Brain className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Analyze Document</p>
                <p className="text-sm text-muted-foreground">Upload & chat</p>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-transform ml-auto" />
            </Link>

            <Link
              href="/app/contract-drafting"
              className="flex items-center gap-3 p-4 rounded-xl bg-background/50 hover:bg-background border border-border/50 hover:border-border transition-all duration-200 hover:scale-105 group"
            >
              <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                <Leaf className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Draft Contract</p>
                <p className="text-sm text-muted-foreground">AI-powered creation</p>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-transform ml-auto" />
            </Link>

            <Link
              href="/app/patent-analysis"
              className="flex items-center gap-3 p-4 rounded-xl bg-background/50 hover:bg-background border border-border/50 hover:border-border transition-all duration-200 hover:scale-105 group"
            >
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <Zap className="w-5 h-5 text-purple-500" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Patent Analysis</p>
                <p className="text-sm text-muted-foreground">Comprehensive review</p>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-transform ml-auto" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
