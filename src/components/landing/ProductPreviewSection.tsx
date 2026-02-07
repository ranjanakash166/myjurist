"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import {
  MessageCircle,
  Archive,
  BookOpen,
  FolderPlus,
  FileText,
  Presentation,
  Sparkles,
  FileEdit,
  Paperclip,
  Settings,
  MoreHorizontal,
  Mic,
  ArrowUp,
  Search,
  ChevronDown,
  Cog,
  Upload,
} from "lucide-react";
import MyJuristLogo from "./MyJuristLogo";
import { Button } from "@/components/ui/button";

const sidebarFeatures = [
  { icon: MessageCircle, label: "Chat" },
  { icon: Archive, label: "Archived" },
  { icon: BookOpen, label: "Library" },
];

const sidebarWorkspaces = [
  { icon: FileText, label: "Matter A" },
  { icon: Presentation, label: "Presentation" },
  { icon: FileText, label: "Research" },
  { icon: FileText, label: "Matter B" },
];

const quickActions = [
  { icon: Search, label: "Research" },
  { icon: FileText, label: "Analyze" },
  { icon: FileEdit, label: "Draft" },
];

const featureCards = [
  {
    icon: Search,
    title: "Legal Research",
    description: "Find relevant case law and precedents in seconds.",
    button: "Start Research",
  },
  {
    icon: FileText,
    title: "Document Analysis",
    description: "Upload and analyze contracts with AI-powered insights.",
    button: "Analyze Document",
  },
  {
    icon: FileEdit,
    title: "Smart Drafting",
    description: "Generate pleadings and drafts, production ready.",
    button: "Start Drafting",
  },
];

const ProductPreviewSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry?.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [hasAnimated]);

  return (
    <section
      id="product-preview"
      className="w-full flex flex-col items-center justify-center pt-4 sm:pt-6 md:pt-8 pb-10 sm:pb-14 md:pb-20 px-3 sm:px-4 overflow-hidden"
      style={{
        minHeight: "min(100vh, 900px)",
        alignSelf: "stretch",
        background: "var(--bg-tertiary, #F1F5F9)",
      }}
    >
      <div className="w-full max-w-6xl mx-auto overflow-hidden">
        {/* App preview container – dark themed mockup (slides up when in view) */}
        <div
          ref={containerRef}
          className={`rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl border border-slate-200/50 transition-all duration-700 ease-out max-w-full ${
            hasAnimated ? "animate-slide-up-in" : "product-preview-initial"
          }`}
          style={{
            background: "linear-gradient(180deg, #1e1b4b 0%, #0f172a 50%, #020617 100%)",
            minHeight: "min(70vh, 600px)",
          }}
        >
          <div className="flex min-h-[min(70vh,600px)] md:min-h-[800px]">
            {/* Left sidebar – hidden on small screens */}
            <aside
              className="hidden md:flex w-48 lg:w-56 shrink-0 flex-col p-3 lg:p-4 border-r"
              style={{
                background: "rgba(15, 23, 42, 0.6)",
                borderColor: "rgba(148, 163, 184, 0.15)",
              }}
            >
              <div className="flex items-center gap-2 mb-6">
                <MyJuristLogo size={28} />
                <span className="font-semibold text-white text-sm">
                  My Jurist
                </span>
              </div>
              <Button
                className="w-full justify-center gap-2 rounded-lg mb-6"
                style={{
                  background: "rgba(148, 163, 184, 0.2)",
                  color: "#f1f5f9",
                  border: "1px solid rgba(148, 163, 184, 0.2)",
                }}
              >
                <Sparkles className="w-4 h-4" />
                New Chat
              </Button>
              <div className="mb-6">
                <p
                  className="text-xs font-medium uppercase tracking-wider mb-3"
                  style={{ color: "rgba(148, 163, 184, 0.8)" }}
                >
                  Features
                </p>
                <ul className="space-y-1">
                  {sidebarFeatures.map((item) => {
                    const Icon = item.icon;
                    return (
                      <li key={item.label}>
                        <button
                          type="button"
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left text-sm transition-colors hover:bg-white/5"
                          style={{ color: "#e2e8f0" }}
                        >
                          <Icon className="w-4 h-4 shrink-0 opacity-80" />
                          {item.label}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
              <div className="mb-6">
                <p
                  className="text-xs font-medium uppercase tracking-wider mb-3"
                  style={{ color: "rgba(148, 163, 184, 0.8)" }}
                >
                  Workspaces
                </p>
                <ul className="space-y-1">
                  <li>
                    <button
                      type="button"
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left text-sm transition-colors hover:bg-white/5"
                      style={{ color: "#e2e8f0" }}
                    >
                      <FolderPlus className="w-4 h-4 shrink-0 opacity-80" />
                      New Matter
                    </button>
                  </li>
                  {sidebarWorkspaces.map((item) => {
                    const Icon = item.icon;
                    return (
                      <li key={item.label}>
                        <button
                          type="button"
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left text-sm transition-colors hover:bg-white/5"
                          style={{ color: "#94a3b8" }}
                        >
                          <Icon className="w-4 h-4 shrink-0 opacity-70" />
                          {item.label}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
              <div className="mt-auto pt-4">
                <div
                  className="rounded-xl p-4 border"
                  style={{
                    background: "rgba(99, 102, 241, 0.15)",
                    borderColor: "rgba(99, 102, 241, 0.3)",
                  }}
                >
                  <p className="font-semibold text-white text-sm mb-1">
                    Upgrade to premium
                  </p>
                  <p
                    className="text-xs mb-3 leading-relaxed"
                    style={{ color: "#94a3b8" }}
                  >
                    Boost productivity with seamless automation and responsive
                    AI, built to adapt to your needs.
                  </p>
                  <Button asChild size="sm" className="w-full rounded-lg">
                    <Link
                      href="/request-demo"
                      style={{
                        background: "var(--bg-black-solid)",
                        color: "var(--text-white)",
                      }}
                    >
                      Upgrade
                    </Link>
                  </Button>
                </div>
              </div>
            </aside>

            {/* Main content */}
            <div className="flex-1 flex flex-col p-4 sm:p-6 md:p-8 relative overflow-hidden min-w-0">
              {/* Subtle radial glow */}
              <div
                className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full opacity-30 blur-3xl pointer-events-none"
                style={{
                  background:
                    "radial-gradient(circle, rgba(99, 102, 241, 0.4) 0%, transparent 70%)",
                }}
              />
              {/* Top bar */}
              <div className="flex items-center justify-between mb-8 relative z-10">
                <button
                  type="button"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm border transition-colors hover:bg-white/5"
                  style={{
                    background: "rgba(15, 23, 42, 0.8)",
                    borderColor: "rgba(148, 163, 184, 0.2)",
                    color: "#e2e8f0",
                  }}
                >
                  My Jurist AI
                  <ChevronDown className="w-4 h-4 opacity-70" />
                </button>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm border transition-colors hover:bg-white/5"
                    style={{
                      borderColor: "rgba(148, 163, 184, 0.2)",
                      color: "#94a3b8",
                    }}
                  >
                    <Cog className="w-4 h-4" />
                    Configuration
                  </button>
                  <button
                    type="button"
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm border transition-colors hover:bg-white/5"
                    style={{
                      borderColor: "rgba(148, 163, 184, 0.2)",
                      color: "#94a3b8",
                    }}
                  >
                    <Upload className="w-4 h-4" />
                    Export
                  </button>
                </div>
              </div>

              {/* Central hero + input */}
              <div className="flex flex-col items-center flex-1 relative z-10 min-w-0">
                <div
                  className="w-20 h-20 sm:w-28 sm:h-28 md:w-40 md:h-40 rounded-full mb-4 md:mb-6 opacity-90 shrink-0"
                  style={{
                    background:
                      "radial-gradient(circle at 30% 30%, rgba(99, 102, 241, 0.5), rgba(192, 38, 211, 0.4))",
                    boxShadow: "0 0 60px rgba(99, 102, 241, 0.3)",
                  }}
                />
                <h2 className="text-lg sm:text-xl md:text-3xl lg:text-4xl font-bold text-white text-center mb-4 md:mb-6 max-w-xl px-1">
                  Ready to research something new?
                </h2>
                <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 mb-4 md:mb-6">
                  {quickActions.map((action) => {
                    const Icon = action.icon;
                    return (
                      <button
                        key={action.label}
                        type="button"
                        className="flex items-center gap-2 px-4 py-2 rounded-full text-sm border transition-colors hover:bg-white/10"
                        style={{
                          borderColor: "rgba(148, 163, 184, 0.25)",
                          color: "#e2e8f0",
                        }}
                      >
                        <Icon className="w-4 h-4" />
                        {action.label}
                      </button>
                    );
                  })}
                </div>
                <div
                  className="w-full max-w-2xl rounded-2xl border p-4 mb-4"
                  style={{
                    background: "rgba(15, 23, 42, 0.6)",
                    borderColor: "rgba(148, 163, 184, 0.2)",
                  }}
                >
                  <div className="flex items-center gap-2 text-slate-400 text-sm mb-2">
                    <Sparkles className="w-4 h-4 text-indigo-400" />
                    <span>Ask anything legal...</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className="p-2 rounded-lg hover:bg-white/5 text-slate-400"
                      aria-label="Attach"
                    >
                      <Paperclip className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      className="p-2 rounded-lg hover:bg-white/5 text-slate-400"
                      aria-label="Settings"
                    >
                      <Settings className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      className="p-2 rounded-lg hover:bg-white/5 text-slate-400"
                      aria-label="Options"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                    <div className="flex-1" />
                    <button
                      type="button"
                      className="p-2 rounded-lg hover:bg-white/5 text-slate-400"
                      aria-label="Mic"
                    >
                      <Mic className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      className="p-2 rounded-full bg-indigo-500 text-white hover:bg-indigo-600"
                      aria-label="Send"
                    >
                      <ArrowUp className="w-5 h-5 p-1.5" />
                    </button>
                  </div>
                </div>

                {/* Feature cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 w-full max-w-4xl mt-4 sm:mt-6 md:mt-8">
                  {featureCards.map((card) => {
                    const Icon = card.icon;
                    return (
                      <div
                        key={card.title}
                        className="rounded-xl p-5 border transition-colors hover:bg-white/5"
                        style={{
                          background: "rgba(15, 23, 42, 0.5)",
                          borderColor: "rgba(148, 163, 184, 0.15)",
                        }}
                      >
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
                          style={{
                            background:
                              "linear-gradient(135deg, rgba(99, 102, 241, 0.3), rgba(192, 38, 211, 0.2))",
                            color: "#a5b4fc",
                          }}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <h3 className="font-semibold text-white text-sm mb-1">
                          {card.title}
                        </h3>
                        <p
                          className="text-xs leading-relaxed mb-3"
                          style={{ color: "#94a3b8" }}
                        >
                          {card.description}
                        </p>
                        <Button
                          asChild
                          size="sm"
                          variant="outline"
                          className="rounded-lg text-xs border-slate-500/50 text-slate-200 hover:bg-white/10"
                        >
                          <Link href="/app/legal-research">{card.button}</Link>
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductPreviewSection;
