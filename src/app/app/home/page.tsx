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
  Scale
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
  }>;
  ctaText: string;
  ctaHref: string;
  gradient: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  icon,
  subFeatures,
  ctaText,
  ctaHref,
  gradient
}) => (
  <div className={`relative overflow-hidden rounded-2xl p-6 ${gradient} border border-border/50 hover:border-border transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] group`}>
    <div className="relative z-10">
      {/* Header */}
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center text-white">
          {icon}
        </div>
        <h3 className="text-2xl font-bold text-white">{title}</h3>
      </div>
      
      {/* Description */}
      <p className="text-white/90 text-lg mb-6 leading-relaxed">
        {description}
      </p>
      
      {/* Sub-features */}
      <div className="space-y-3 mb-6">
        {subFeatures.map((feature, index) => (
          <div key={index} className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              {feature.icon}
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm">{feature.title}</h4>
              <p className="text-white/80 text-sm">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>
      
      {/* CTA Button */}
      <Link
        href={ctaHref}
        className="inline-flex items-center gap-2 text-white font-semibold hover:text-white/90 transition-colors group-hover:gap-3"
      >
        {ctaText}
        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
      </Link>
    </div>
    
    {/* Background decoration */}
    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16"></div>
    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
  </div>
);

export default function HomePage() {
  const { user } = useAuth();

  const features: FeatureCardProps[] = [
    {
      title: "Document Analysis",
      description: "AI-Powered Document Analysis & Chat. Upload, analyze, and understand legal documents with intelligent AI assistance. Ask follow-up questions and get instant insights.",
      icon: <FileText className="w-6 h-6" />,
      subFeatures: [
        {
          title: "Document Intelligence",
          description: "Upload and chat with your legal documents",
          icon: <MessageSquare className="w-4 h-4" />
        },
        {
          title: "AI Analysis",
          description: "Get instant insights and understanding",
          icon: <Brain className="w-4 h-4" />
        }
      ],
      ctaText: "Start Analysis",
      ctaHref: "/app/document-analysis",
      gradient: "bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900"
    },
    {
      title: "Patent Analysis",
      description: "Comprehensive patent evaluation and reporting. Analyze patent documents, identify key claims, and generate detailed reports with AI-powered insights.",
      icon: <Shield className="w-6 h-6" />,
      subFeatures: [
        {
          title: "Patent Evaluation",
          description: "Analyze patent documents and claims",
          icon: <FileSearch className="w-4 h-4" />
        },
        {
          title: "Report Generation",
          description: "AI-powered patent analysis reports",
          icon: <FileText className="w-4 h-4" />
        }
      ],
      ctaText: "Analyze Patents",
      ctaHref: "/app/patent-analysis",
      gradient: "bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900"
    },
    {
      title: "Contract Drafting",
      description: "AI-Generated Legal Content Creation. Generate and revise detailed legal documents including contracts, briefs, and contractual provisions with intelligent assistance.",
      icon: <FileCheck className="w-6 h-6" />,
      subFeatures: [
        {
          title: "Contract Generation",
          description: "AI-powered contract creation and templates",
          icon: <PenTool className="w-4 h-4" />
        },
        {
          title: "Document Revision",
          description: "Edit and improve legal documents",
          icon: <FileText className="w-4 h-4" />
        }
      ],
      ctaText: "Create Contracts",
      ctaHref: "/app/contract-drafting",
      gradient: "bg-gradient-to-br from-neutral-700 via-neutral-800 to-neutral-900"
    },
    {
      title: "Timeline Extractor",
      description: "Automated event extraction and timeline generation. Extract key events from documents and create comprehensive timelines for legal cases and projects.",
      icon: <Calendar className="w-6 h-6" />,
      subFeatures: [
        {
          title: "Event Extraction",
          description: "Automated extraction of key events",
          icon: <Calendar className="w-4 h-4" />
        },
        {
          title: "Timeline Creation",
          description: "Generate visual timelines from documents",
          icon: <FolderOpen className="w-4 h-4" />
        }
      ],
      ctaText: "Extract Timeline",
      ctaHref: "/app/timeline-extractor",
      gradient: "bg-gradient-to-br from-zinc-700 via-zinc-800 to-zinc-900"
    },
    {
      title: "Legal Research",
      description: "AI-Enhanced Legal Research & Analysis. Search case law, analyze precedents, and get comprehensive legal research assistance with intelligent AI support.",
      icon: <Search className="w-6 h-6" />,
      subFeatures: [
        {
          title: "Case Law Search",
          description: "Find relevant cases and precedents",
          icon: <Search className="w-4 h-4" />
        },
        {
          title: "Precedent Analysis",
          description: "AI-powered legal research insights",
          icon: <Brain className="w-4 h-4" />
        }
      ],
      ctaText: "Start Research",
      ctaHref: "/app/legal-research",
      gradient: "bg-gradient-to-br from-slate-600 via-slate-700 to-slate-800"
    },
    {
      title: "Regulatory Compliance",
      description: "Automated compliance checking and guidance. Stay compliant with regulatory requirements through AI-powered monitoring and automated workflows.",
      icon: <CheckCircle className="w-6 h-6" />,
      subFeatures: [
        {
          title: "Compliance Monitoring",
          description: "Automated regulatory compliance checking",
          icon: <Scale className="w-4 h-4" />
        },
        {
          title: "Guidance System",
          description: "AI-powered compliance guidance and alerts",
          icon: <CheckCircle className="w-4 h-4" />
        }
      ],
      ctaText: "Check Compliance",
      ctaHref: "/app/regulatory-compliance",
      gradient: "bg-gradient-to-br from-gray-600 via-gray-700 to-gray-800"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Top Spacing */}
      <div className="pt-8"></div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Powerful Features at Your Fingertips
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover how our platform transforms legal workflows with cutting-edge AI technology
          </p>
        </div>

        {/* Mobile Layout - Single Column */}
        <div className="grid grid-cols-1 gap-6 md:hidden">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>

        {/* Desktop Layout - 3x2 Grid */}
        <div className="hidden lg:grid lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
        
        {/* Medium Desktop Layout - 2x3 Grid */}
        <div className="hidden md:grid lg:hidden md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>

      {/* Quick Actions Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="bg-card/50 rounded-2xl border border-border/50 p-8 backdrop-blur-sm">
          <div className="text-center mb-8">
            <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Quick Actions
            </h3>
            <p className="text-muted-foreground">
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
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <Leaf className="w-5 h-5 text-purple-500" />
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
              <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
                <Zap className="w-5 h-5 text-orange-500" />
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
