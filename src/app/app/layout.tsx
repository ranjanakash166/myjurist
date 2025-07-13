"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Home, FileText, FileSearch, Menu, X, Sun, Moon } from "lucide-react";
import { useTheme } from "../../components/ThemeProvider";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Dashboard", icon: <Home className="w-5 h-5 mr-2" />, href: "/app/dashboard" },
  { label: "Patent Analysis", icon: <FileSearch className="w-5 h-5 mr-2" />, href: "/app/patent-analysis" },
  { label: "Document Analysis", icon: <FileText className="w-5 h-5 mr-2" />, href: "/app/document-analysis" },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();

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
        <div className="flex items-center mb-8 gap-2">
          <span className="text-2xl font-bold gradient-text-animate">My Jurist</span>
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="ml-2 p-2 rounded-lg border border-ai-blue-500/20 bg-slate-800/60 hover:bg-slate-700/80 transition-colors text-ai-blue-400 hover:text-ai-blue-200"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
        <nav className="flex flex-col gap-2 flex-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={
                  `flex items-center px-4 py-2 rounded-lg text-left font-medium transition-all duration-300 hover:scale-105 focus:outline-none ` +
                  (isActive
                    ? 'bg-gradient-to-r from-ai-blue-500 to-ai-purple-500 text-white shadow-lg ai-shadow dark:bg-gradient-to-r dark:from-ai-blue-500 dark:to-ai-purple-500 dark:text-white light:bg-gradient-to-r light:from-blue-600 light:to-purple-600 light:text-white'
                    : 'hover:bg-ai-blue-500/10 text-slate-300 hover:text-ai-blue-400')
                }
                onClick={() => setSidebarOpen(false)}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}
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
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className="p-2 rounded-lg border border-ai-blue-500/20 bg-slate-800/60 hover:bg-slate-700/80 transition-colors text-ai-blue-400 hover:text-ai-blue-200"
                  aria-label="Toggle theme"
                >
                  {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
                <button onClick={() => setSidebarOpen(false)} aria-label="Close navigation">
                  <X className="w-6 h-6 text-white" />
                </button>
              </div>
            </div>
            <nav className="flex flex-col gap-2 flex-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={
                      `flex items-center px-4 py-2 rounded-lg text-left font-medium transition-all duration-300 hover:scale-105 focus:outline-none ` +
                      (isActive
                        ? 'bg-gradient-to-r from-ai-blue-500 to-ai-purple-500 text-white shadow-lg ai-shadow dark:bg-gradient-to-r dark:from-ai-blue-500 dark:to-ai-purple-500 dark:text-white light:bg-gradient-to-r light:from-blue-600 light:to-purple-600 light:text-white'
                        : 'hover:bg-ai-blue-500/10 text-slate-300 hover:text-ai-blue-400')
                    }
                    onClick={() => setSidebarOpen(false)}
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                );
              })}
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