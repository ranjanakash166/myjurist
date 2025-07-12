"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Home, FileText, FileSearch, Menu, X } from "lucide-react";

const navItems = [
  { label: "Dashboard", icon: <Home className="w-5 h-5 mr-2" />, href: "/app/dashboard" },
  { label: "Patent Analysis", icon: <FileSearch className="w-5 h-5 mr-2" />, href: "/app/patent-analysis" },
  { label: "Document Analysis", icon: <FileText className="w-5 h-5 mr-2" />, href: "/app/document-analysis" },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative">
      {/* Mobile Nav Icon */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700/90 transition"
        onClick={() => setSidebarOpen(true)}
        aria-label="Open navigation"
      >
        <Menu className="w-6 h-6 text-white" />
      </button>
      {/* Sidebar */}
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 p-6 flex-col gap-4 glass-effect border-r border-ai-blue-500/20 min-h-screen">
        <div className="flex items-center mb-8">
          <span className="text-2xl font-bold gradient-text-animate">My Jurist</span>
        </div>
        <nav className="flex flex-col gap-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center px-4 py-2 rounded-lg text-left font-medium transition-all duration-300 hover:scale-105 hover:bg-ai-blue-500/10 focus:outline-none text-slate-300 hover:text-ai-blue-400"
              onClick={() => setSidebarOpen(false)}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-40"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="fixed top-0 left-0 z-50 w-64 h-full p-6 flex flex-col gap-4 glass-effect border-r border-ai-blue-500/20 animate-slide-in">
            <div className="flex items-center mb-8 justify-between">
              <span className="text-2xl font-bold gradient-text-animate">My Jurist</span>
              <button onClick={() => setSidebarOpen(false)} aria-label="Close navigation">
                <X className="w-6 h-6 text-white" />
              </button>
            </div>
            <nav className="flex flex-col gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center px-4 py-2 rounded-lg text-left font-medium transition-all duration-300 hover:scale-105 hover:bg-ai-blue-500/10 focus:outline-none text-slate-300 hover:text-ai-blue-400"
                  onClick={() => setSidebarOpen(false)}
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}
            </nav>
          </aside>
        </>
      )}
      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-2 sm:p-4 md:p-10 min-h-screen">
        {children}
      </main>
      <style jsx global>{`
        @keyframes slide-in {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
        .animate-slide-in {
          animation: slide-in 0.3s cubic-bezier(0.4,0,0.2,1);
        }
      `}</style>
    </div>
  );
} 