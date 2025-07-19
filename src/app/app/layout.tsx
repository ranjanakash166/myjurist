"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Home, FileText, FileSearch, Menu, X, Sun, Moon, LogOut, User } from "lucide-react";
import { useTheme } from "../../components/ThemeProvider";
import { useAuth } from "../../components/AuthProvider";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Dashboard", icon: <Home className="w-6 h-6" />, href: "/app/dashboard" },
  { label: "Patent Analysis", icon: <FileSearch className="w-6 h-6" />, href: "/app/patent-analysis" },
  { label: "Document Analysis", icon: <FileText className="w-6 h-6" />, href: "/app/document-analysis" },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const { user, isAuthenticated, isInitialized, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  // Route protection - wait for auth to initialize
  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, isInitialized, router]);

  // Show loading screen while auth is initializing
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ai-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-300">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative">
      {/* Mobile Top Navbar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-sm border-b border-ai-blue-500/20 px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo and Company Name */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shadow-lg overflow-hidden">
              <img 
                src="/images/myjurist-logo.png" 
                alt="My Jurist" 
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-lg font-bold gradient-text-animate">My Jurist</span>
          </div>
          
          {/* Hamburger Menu Button */}
          <button
            className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700/90 transition-colors"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open navigation"
          >
            <Menu className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
      {/* Sidebar */}
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex group w-16 hover:w-64 p-4 flex-col gap-4 glass-effect border-r border-ai-blue-500/20 min-h-screen transition-all duration-300 ease-in-out overflow-hidden">
        {/* Company Logo/Icon */}
        <div className="flex items-center justify-center mb-8 min-w-max">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center shadow-lg overflow-hidden">
            <img 
              src="/images/myjurist-logo.png" 
              alt="My Jurist" 
              className="w-full h-full object-contain"
            />
          </div>
          <span className="text-2xl font-bold gradient-text-animate opacity-0 group-hover:opacity-100 transition-opacity duration-300 ml-3">
            My Jurist
          </span>
        </div>
        <nav className="flex flex-col gap-2 flex-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={
                  `flex items-center justify-center group-hover:justify-start px-2 group-hover:px-4 py-3 rounded-lg text-left font-medium transition-all duration-300 hover:scale-105 focus:outline-none min-w-max ` +
                  (isActive
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'hover:bg-ai-blue-500/10 text-slate-300 hover:text-ai-blue-400')
                }
                onClick={() => setSidebarOpen(false)}
                title={item.label}
              >
                <div className={`w-6 h-6 flex items-center justify-center ${isActive ? 'text-white' : ''}`}>
                  {React.cloneElement(item.icon, { 
                    className: `w-6 h-6 ${isActive ? 'text-white drop-shadow-lg' : ''}` 
                  })}
                </div>
                <span className="ml-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* User Info, Theme Switch, and Logout - Desktop */}
        <div className="border-t border-ai-blue-500/20 pt-4 mt-4 space-y-2">
          {user && (
            <div className="flex items-center justify-center group-hover:justify-start px-2 group-hover:px-4 py-3 min-w-max">
              <div className="w-8 h-8 bg-ai-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 text-ai-blue-400" />
              </div>
              <div className="flex-1 min-w-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ml-3">
                <p className="text-sm font-medium text-slate-200 truncate">
                  {user.full_name}
                </p>
                <p className="text-xs text-slate-400 truncate">
                  {user.email}
                </p>
              </div>
            </div>
          )}
          
          {/* Theme Switch */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="w-full flex items-center justify-center group-hover:justify-start px-2 group-hover:px-4 py-3 rounded-lg text-left font-medium transition-all duration-300 hover:scale-105 hover:bg-ai-blue-500/10 text-slate-300 hover:text-ai-blue-400 min-w-max"
            title="Toggle theme"
          >
            <div className="w-6 h-6 flex items-center justify-center">
              {theme === 'dark' ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
            </div>
            <span className="ml-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
              {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </span>
          </button>
          
          {/* Logout */}
          <button
            onClick={async () => {
              await logout();
              router.push("/login");
            }}
            className="w-full flex items-center justify-center group-hover:justify-start px-2 group-hover:px-4 py-3 rounded-lg text-left font-medium transition-all duration-300 hover:scale-105 hover:bg-red-500/10 text-slate-300 hover:text-red-400 min-w-max"
            title="Logout"
          >
            <div className="w-6 h-6 flex items-center justify-center">
              <LogOut className="w-6 h-6" />
            </div>
            <span className="ml-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
              Logout
            </span>
          </button>
        </div>
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
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center shadow-lg overflow-hidden">
                  <img 
                    src="/images/myjurist-logo.png" 
                    alt="My Jurist" 
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="text-2xl font-bold gradient-text-animate">My Jurist</span>
              </div>
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
                      `flex items-center px-4 py-3 rounded-lg text-left font-medium transition-all duration-300 hover:scale-105 focus:outline-none ` +
                      (isActive
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'hover:bg-ai-blue-500/10 text-slate-300 hover:text-ai-blue-400')
                    }
                    onClick={() => setSidebarOpen(false)}
                  >
                    <div className={`w-6 h-6 flex items-center justify-center mr-3 ${isActive ? 'text-white' : ''}`}>
                      {React.cloneElement(item.icon, { 
                        className: `w-6 h-6 ${isActive ? 'text-white drop-shadow-lg' : ''}` 
                      })}
                    </div>
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* User Info, Theme Switch, and Logout - Mobile */}
            <div className="border-t border-ai-blue-500/20 pt-4 mt-4 space-y-2">
              {user && (
                <div className="flex items-center px-4 py-2">
                  <div className="w-8 h-8 bg-ai-blue-500/20 rounded-full flex items-center justify-center mr-3">
                    <User className="w-4 h-4 text-ai-blue-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-200 truncate">
                      {user.full_name}
                    </p>
                    <p className="text-xs text-slate-400 truncate">
                      {user.email}
                    </p>
                  </div>
                </div>
              )}
              
              {/* Theme Switch - Mobile */}
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="w-full flex items-center px-4 py-3 rounded-lg text-left font-medium transition-all duration-300 hover:scale-105 hover:bg-ai-blue-500/10 text-slate-300 hover:text-ai-blue-400"
              >
                <div className="w-6 h-6 flex items-center justify-center mr-3">
                  {theme === 'dark' ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
                </div>
                {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
              </button>
              
              {/* Logout - Mobile */}
              <button
                onClick={async () => {
                  await logout();
                  router.push("/login");
                  setSidebarOpen(false);
                }}
                className="w-full flex items-center px-4 py-3 rounded-lg text-left font-medium transition-all duration-300 hover:scale-105 hover:bg-red-500/10 text-slate-300 hover:text-red-400"
              >
                <div className="w-6 h-6 flex items-center justify-center mr-3">
                  <LogOut className="w-6 h-6" />
                </div>
                Logout
              </button>
            </div>
          </aside>
        </>
      )}
      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-2 sm:p-4 md:p-6 lg:p-8 min-h-screen w-full md:pt-0 pt-16">
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