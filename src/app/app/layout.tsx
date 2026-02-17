"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Home, FileText, FileSearch, Menu, X, LogOut, User, Scale, Calendar, FileCheck, Building2, BarChart3, Tag, Search, FileEdit } from "lucide-react";
import { useTheme } from "next-themes";
import { useAuth } from "../../components/AuthProvider";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "../../components/ThemeToggle";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import ProfileModal from '../../components/ProfileModal';
import MyJuristLogoWithWordmark from "@/components/landing/MyJuristLogoWithWordmark";

const getNavItems = (userRole?: string) => {
  const baseItems = [
    { label: "Home", icon: <Home className="w-6 h-6" />, href: "/app/home" },
    { label: "Dashboard", icon: <BarChart3 className="w-6 h-6" />, href: "/app/dashboard" },
    { label: "Legal Research", icon: <FileSearch className="w-6 h-6" />, href: "/app/legal-research" },
    { label: "Document Analysis", icon: <FileText className="w-6 h-6" />, href: "/app/document-analysis" },
    { label: "Regulatory Compliance", icon: <Scale className="w-6 h-6" />, href: "/app/regulatory-compliance" },
    { label: "Timeline Extractor", icon: <Calendar className="w-6 h-6" />, href: "/app/timeline-extractor" },
    { label: "My Jurist Chat", icon: <Search className="w-6 h-6" />, href: "/app/my-jurist-chat" },
    { label: "Doc Categorization", icon: <Tag className="w-6 h-6" />, href: "/app/document-categorization" },
    { label: "Smart Drafting", icon: <FileEdit className="w-6 h-6" />, href: "/app/smart-drafting" },
  ];

  // Add organization management for super admins and org admins
  if (userRole === "super_admin" || userRole === "org_admin") {
    baseItems.push({
      label: "Manage Org",
      icon: <Building2 className="w-6 h-6" />,
      href: "/app/organization-management"
    });
  }

  return baseItems;
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { theme } = useTheme();
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
      <div className="min-h-screen flex bg-background text-foreground items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell min-h-screen flex bg-background text-foreground relative group">
      {/* Portal target for modals so they inherit app-shell theme (inside app layout) */}
      <div id="app-modal-root" aria-hidden="true" className="contents" />
      {/* Mobile Top Navbar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo and Company Name */}
          <MyJuristLogoWithWordmark variant="light" size={32} href="/app/home" className="hover:opacity-80 transition-opacity" />
          
          {/* Mobile Menu */}
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-72 p-0 border-r border-white/10 bg-[#0F172A] text-white"
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center p-6 border-b border-white/10">
                  <MyJuristLogoWithWordmark variant="dark" size={40} href="/app/home" className="hover:opacity-80 transition-opacity" />
                </div>
                
                <nav className="flex-1 p-4 space-y-2">
                  {getNavItems(user?.role).map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center px-4 py-3 rounded-xl text-left font-medium transition-all duration-200 ${
                          isActive
                            ? 'bg-white text-[#0F172A] shadow-md'
                            : 'text-slate-300 hover:bg-white/10 hover:text-white'
                        }`}
                        onClick={() => setSidebarOpen(false)}
                      >
                        <div className="w-6 h-6 flex items-center justify-center mr-3">
                          {React.cloneElement(item.icon, { 
                            className: `w-6 h-6 ${isActive ? 'text-[#0F172A]' : 'text-slate-300'}`
                          })}
                        </div>
                        <span className="truncate">{item.label}</span>
                      </Link>
                    );
                  })}
                </nav>

                <div className="p-4 border-t border-white/10">
                  {user && (
                    <button
                      type="button"
                      className="flex items-center px-4 py-2 mb-4 w-full text-left hover:bg-white/10 rounded-lg transition-colors"
                      onClick={() => setProfileOpen(true)}
                    >
                      <Avatar className="w-8 h-8 mr-3">
                        <AvatarFallback>
                          <User className="w-4 h-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">
                          {user.full_name}
                        </p>
                        <p className="text-xs text-slate-300 truncate">
                          {user.email}
                        </p>
                      </div>
                    </button>
                  )}
                  
                  <div className="space-y-2">
                    <ThemeToggle />
                    <Button
                      variant="ghost"
                      onClick={async () => {
                        await logout();
                        router.push("/login");
                      }}
                      className="w-full justify-start text-slate-200 hover:text-white hover:bg-white/10"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </Button>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-16 hover:w-72 p-4 flex-col gap-4 bg-card border-r border-border min-h-screen transition-all duration-300 ease-in-out overflow-hidden group/sidebar">
        {/* Company Logo/Icon */}
        <Link href="/app/home" className="flex items-center justify-center mb-8 min-w-max hover:opacity-80 transition-opacity">
          <div className="flex items-center justify-center shrink-0">
            <MyJuristLogoWithWordmark iconOnly size={40} href={false} />
          </div>
          <span className="text-2xl font-bold text-foreground opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-300 ml-3 whitespace-nowrap">
            My Jurist
          </span>
        </Link>
        
        <nav className="flex flex-col gap-2 flex-1">
          {getNavItems(user?.role).map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-center group-hover/sidebar:justify-start px-2 group-hover/sidebar:px-4 py-3 rounded-lg text-left font-medium transition-all duration-300 hover:scale-105 focus:outline-none min-w-max ${
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-lg'
                    : 'hover:bg-accent text-muted-foreground hover:text-foreground'
                }`}
                title={item.label}
              >
                <div className="w-6 h-6 flex items-center justify-center">
                  {React.cloneElement(item.icon, { 
                    className: `w-6 h-6 ${isActive ? 'text-primary-foreground' : ''}` 
                  })}
                </div>
                <span className="ml-3 opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-300 whitespace-nowrap truncate">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* User Info, Theme Switch, and Logout - Desktop */}
        <div className="border-t border-border pt-4 mt-4 space-y-2">
          {user && (
            <button
              type="button"
              className="flex items-center justify-center group-hover/sidebar:justify-start px-2 group-hover/sidebar:px-4 py-3 min-w-max w-full text-left hover:bg-accent rounded-lg transition-colors"
              onClick={() => setProfileOpen(true)}
              title="View Profile"
            >
              <Avatar className="w-8 h-8 flex-shrink-0">
                <AvatarFallback>
                  <User className="w-4 h-4" />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0 opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-300 ml-3">
                <p className="text-sm font-medium text-foreground truncate">
                  {user.full_name}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user.email}
                </p>
              </div>
            </button>
          )}
          
          <ThemeToggle />
          
          <Button
            variant="ghost"
            onClick={async () => {
              await logout();
              router.push("/login");
            }}
            className="w-full flex items-center justify-center group-hover/sidebar:justify-start px-2 group-hover/sidebar:px-4 py-3 min-w-max"
            title="Logout"
          >
            <div className="w-6 h-6 flex items-center justify-center">
              <LogOut className="w-6 h-6" />
            </div>
            <span className="ml-3 opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-300 whitespace-nowrap">
              Logout
            </span>
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-16 group-hover/sidebar:md:ml-72 pt-16 md:pt-0 overflow-x-hidden transition-all duration-300">
        {children}
      </main>
      <ProfileModal open={profileOpen} onOpenChange={setProfileOpen} />
    </div>
  );
} 
