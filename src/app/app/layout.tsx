"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Home, FileText, FileSearch, Menu, X, LogOut, User, Scale, Calendar, FileCheck, Building2 } from "lucide-react";
import { useTheme } from "next-themes";
import { useAuth } from "../../components/AuthProvider";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "../../components/ThemeToggle";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import ProfileModal from '../../components/ProfileModal';

const getNavItems = (userRole?: string) => {
  const baseItems = [
    { label: "Dashboard", icon: <Home className="w-6 h-6" />, href: "/app/dashboard" },
    { label: "Patent Analysis", icon: <FileSearch className="w-6 h-6" />, href: "/app/patent-analysis" },
    { label: "Document Analysis", icon: <FileText className="w-6 h-6" />, href: "/app/document-analysis" },
    { label: "Contract Drafting", icon: <FileCheck className="w-6 h-6" />, href: "/app/contract-drafting" },
    { label: "Timeline Extractor", icon: <Calendar className="w-6 h-6" />, href: "/app/timeline-extractor" },
    { label: "Legal Research", icon: <FileSearch className="w-6 h-6" />, href: "/app/legal-research" },
    { label: "Regulatory Compliance", icon: <Scale className="w-6 h-6" />, href: "/app/regulatory-compliance" },
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
    <div className="min-h-screen flex bg-background text-foreground relative">
      {/* Mobile Top Navbar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border px-4 py-3">
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
            <span className="text-lg font-bold text-foreground">My Jurist</span>
          </div>
          
          {/* Mobile Menu */}
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <div className="flex flex-col h-full">
                <div className="flex items-center p-6 border-b">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center shadow-lg overflow-hidden">
                      <img 
                        src="/images/myjurist-logo.png" 
                        alt="My Jurist" 
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <span className="text-xl font-bold text-foreground">My Jurist</span>
                  </div>
                </div>
                
                <nav className="flex-1 p-4 space-y-2">
                  {getNavItems(user?.role).map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center px-4 py-3 rounded-lg text-left font-medium transition-all duration-300 hover:scale-105 ${
                          isActive
                            ? 'bg-primary text-primary-foreground shadow-lg'
                            : 'hover:bg-accent text-muted-foreground hover:text-foreground'
                        }`}
                        onClick={() => setSidebarOpen(false)}
                      >
                        <div className="w-6 h-6 flex items-center justify-center mr-3">
                          {React.cloneElement(item.icon, { 
                            className: `w-6 h-6 ${isActive ? 'text-primary-foreground' : ''}` 
                          })}
                        </div>
                        {item.label}
                      </Link>
                    );
                  })}
                </nav>

                <div className="p-4 border-t">
                  {user && (
                    <button
                      type="button"
                      className="flex items-center px-4 py-2 mb-4 w-full text-left hover:bg-accent rounded-lg transition-colors"
                      onClick={() => setProfileOpen(true)}
                    >
                      <Avatar className="w-8 h-8 mr-3">
                        <AvatarFallback>
                          <User className="w-4 h-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {user.full_name}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
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
                      className="w-full justify-start"
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
      <aside className="hidden md:flex group w-16 hover:w-64 p-4 flex-col gap-4 bg-card border-r border-border min-h-screen transition-all duration-300 ease-in-out overflow-hidden">
        {/* Company Logo/Icon */}
        <div className="flex items-center justify-center mb-8 min-w-max">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center shadow-lg overflow-hidden">
            <img 
              src="/images/myjurist-logo.png" 
              alt="My Jurist" 
              className="w-full h-full object-contain"
            />
          </div>
          <span className="text-2xl font-bold text-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-300 ml-3">
            My Jurist
          </span>
        </div>
        
        <nav className="flex flex-col gap-2 flex-1">
          {getNavItems(user?.role).map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-center group-hover:justify-start px-2 group-hover:px-4 py-3 rounded-lg text-left font-medium transition-all duration-300 hover:scale-105 focus:outline-none min-w-max ${
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
                <span className="ml-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
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
              className="flex items-center justify-center group-hover:justify-start px-2 group-hover:px-4 py-3 min-w-max w-full text-left hover:bg-accent rounded-lg transition-colors"
              onClick={() => setProfileOpen(true)}
              title="View Profile"
            >
              <Avatar className="w-8 h-8 flex-shrink-0">
                <AvatarFallback>
                  <User className="w-4 h-4" />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ml-3">
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
            className="w-full flex items-center justify-center group-hover:justify-start px-2 group-hover:px-4 py-3 min-w-max"
            title="Logout"
          >
            <div className="w-6 h-6 flex items-center justify-center">
              <LogOut className="w-6 h-6" />
            </div>
            <span className="ml-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
              Logout
            </span>
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-16 pt-16 md:pt-0 overflow-x-hidden">
        {children}
      </main>
      <ProfileModal open={profileOpen} onOpenChange={setProfileOpen} />
    </div>
  );
} 