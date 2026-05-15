"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  FileText,
  FileSearch,
  Menu,
  MoreHorizontal,
  X,
  LogOut,
  Calendar,
  Building2,
  Tag,
  LayoutGrid,
  MessageSquare,
  Settings,
  Bell,
} from "lucide-react";
import { useAuth } from "../../components/AuthProvider";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "../../components/ThemeToggle";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import ProfileModal from "../../components/ProfileModal";
import { AppRouteLightTheme } from "@/components/AppRouteLightTheme";
import MyJuristLogoWithWordmark from "@/components/landing/MyJuristLogoWithWordmark";

type AppNavItem = {
  label: string;
  icon: React.ReactElement;
  matches: string[];
  href?: string;
  onClick?: () => void | Promise<void>;
  iconClassName?: string;
  activeClassName?: string;
};

function pathMatchesNav(pathname: string | null, matches: string[]): boolean {
  if (!pathname || matches.length === 0) return false;
  return matches.some((m) => pathname === m || pathname.startsWith(`${m}/`));
}

const roleLabelMap: Record<string, string> = {
  super_admin: "Super Admin",
  org_admin: "Org Admin",
  member: "Member",
  user: "Member",
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { user, isAuthenticated, isInitialized, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, isInitialized, router]);

  const appNavItems = useMemo<AppNavItem[]>(() => {
    const items: AppNavItem[] = [
      {
        label: "Dashboard",
        href: "/app/home",
        icon: <LayoutGrid className="h-6 w-6" strokeWidth={1.9} />,
        matches: ["/app/home", "/app/dashboard"],
        iconClassName: "text-slate-700",
        activeClassName: "bg-slate-900 text-white",
      },
      {
        label: "Legal Research",
        href: "/app/legal-research",
        icon: <FileSearch className="h-6 w-6" strokeWidth={1.9} />,
        matches: ["/app/legal-research"],
        iconClassName: "text-violet-600",
        activeClassName: "bg-violet-50 text-violet-700 ring-1 ring-violet-200",
      },
      {
        label: "Document Analysis",
        href: "/app/document-analysis",
        icon: <FileText className="h-6 w-6" strokeWidth={1.9} />,
        matches: ["/app/document-analysis"],
        iconClassName: "text-blue-600",
        activeClassName: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
      },
      {
        label: "Timeline Extractor",
        href: "/app/timeline-extractor",
        icon: <Calendar className="h-6 w-6" strokeWidth={1.9} />,
        matches: ["/app/timeline-extractor"],
        iconClassName: "text-orange-500",
        activeClassName: "bg-orange-50 text-orange-600 ring-1 ring-orange-200",
      },
      {
        label: "My Jurist Chat",
        href: "/app/my-jurist-chat",
        icon: <MessageSquare className="h-6 w-6" strokeWidth={1.9} />,
        matches: ["/app/my-jurist-chat"],
        iconClassName: "text-emerald-600",
        activeClassName: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
      },
      {
        label: "Document Categorization",
        href: "/app/document-categorization",
        icon: <Tag className="h-6 w-6" strokeWidth={1.9} />,
        matches: ["/app/document-categorization"],
        iconClassName: "text-fuchsia-600",
        activeClassName: "bg-fuchsia-50 text-fuchsia-700 ring-1 ring-fuchsia-200",
      },
    ];

    if (user?.role === "super_admin" || user?.role === "org_admin") {
      items.push({
        label: "Manage Org",
        href: "/app/organization-management",
        icon: <Building2 className="h-6 w-6" strokeWidth={1.9} />,
        matches: ["/app/organization-management"],
        iconClassName: "text-slate-700",
        activeClassName: "bg-slate-900 text-white",
      });
    }

    items.push({
      label: "Preferences",
      icon: <Settings className="h-6 w-6" strokeWidth={1.9} />,
      matches: [],
      onClick: () => setProfileOpen(true),
      iconClassName: "text-slate-500",
    });

    items.push({
      label: "Logout",
      icon: <LogOut className="h-6 w-6" strokeWidth={1.9} />,
      matches: [],
      onClick: async () => {
        await logout();
        router.push("/login");
      },
      iconClassName: "text-rose-500",
    });

    return items;
  }, [logout, router, user?.role]);

  const mobileBottomNav = useMemo(
    () =>
      [
        {
          href: "/app/home",
          label: "Home",
          matches: ["/app/home", "/app/dashboard"],
          icon: <LayoutGrid className="h-5 w-5" strokeWidth={1.9} />,
        },
        {
          href: "/app/document-analysis",
          label: "Docs",
          matches: ["/app/document-analysis"],
          icon: <FileText className="h-5 w-5" strokeWidth={1.9} />,
        },
        {
          href: "/app/legal-research",
          label: "Research",
          matches: ["/app/legal-research"],
          icon: <FileSearch className="h-5 w-5" strokeWidth={1.9} />,
        },
        {
          href: "/app/my-jurist-chat",
          label: "Chat",
          matches: ["/app/my-jurist-chat"],
          icon: <MessageSquare className="h-5 w-5" strokeWidth={1.9} />,
        },
      ],
    []
  );

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex bg-background text-foreground items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  const formattedDate = new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date());

  const welcomeName = user?.full_name?.trim() || "there";
  const roleLabel = roleLabelMap[user?.role ?? ""] || "Member";
  const initials = welcomeName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="app-shell min-h-screen bg-white text-slate-900">
      <AppRouteLightTheme />
      <div id="app-modal-root" aria-hidden="true" className="contents" />

      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border px-4 py-3">
        <div className="flex items-center justify-between">
          <MyJuristLogoWithWordmark
            variant="light"
            size={32}
            href="/app/home"
            className="hover:opacity-80 transition-opacity"
          />

          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="md:hidden gap-2 px-2 text-foreground"
                aria-label="Open navigation menu"
              >
                <Menu className="h-5 w-5 shrink-0" />
                <span className="hidden text-sm font-medium sm:inline">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
            className="w-72 border-r border-slate-200 bg-slate-50 p-0 text-slate-900"
            >
              <div className="flex flex-col h-full">
              <div className="border-b border-slate-200 bg-white p-6">
                  <MyJuristLogoWithWordmark
                  variant="light"
                    size={40}
                    href="/app/home"
                    className="hover:opacity-80 transition-opacity"
                  />
                </div>

                <nav className="flex-1 space-y-2 overflow-y-auto p-4">
                  {appNavItems.map((item) => {
                    const isActive = pathMatchesNav(pathname, item.matches);
                    const rowClass = `flex w-full items-center rounded-xl px-4 py-3 text-left font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-white text-slate-900 shadow-sm ring-1 ring-slate-200"
                        : "text-slate-600 hover:bg-white hover:text-slate-900"
                    }`;
                    const iconClass = `h-6 w-6 shrink-0 ${isActive ? "text-slate-900" : "text-slate-500"}`;

                    if (item.href) {
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={rowClass}
                          onClick={() => setSidebarOpen(false)}
                        >
                          <span className="mr-3 flex h-6 w-6 items-center justify-center">
                            {React.isValidElement(item.icon)
                              ? React.cloneElement(item.icon as React.ReactElement<{ className?: string }>, {
                                  className: iconClass,
                                })
                              : item.icon}
                          </span>
                          <span className="truncate">{item.label}</span>
                        </Link>
                      );
                    }

                    return (
                      <button
                        key={item.label}
                        type="button"
                        className={rowClass}
                        onClick={async () => {
                          await item.onClick?.();
                          setSidebarOpen(false);
                        }}
                      >
                        <span className="mr-3 flex h-6 w-6 items-center justify-center">
                          {React.isValidElement(item.icon)
                            ? React.cloneElement(item.icon as React.ReactElement<{ className?: string }>, {
                                className: iconClass,
                              })
                            : item.icon}
                        </span>
                        <span className="truncate">{item.label}</span>
                      </button>
                    );
                  })}
                </nav>

                <div className="border-t border-slate-200 bg-white p-4">
                  {user && (
                    <button
                      type="button"
                      className="mb-4 flex w-full items-center rounded-lg px-4 py-2 text-left transition-colors hover:bg-slate-100"
                      onClick={() => {
                        setProfileOpen(true);
                        setSidebarOpen(false);
                      }}
                    >
                      <Avatar className="w-8 h-8 mr-3">
                        <AvatarFallback className="bg-slate-200 text-slate-800">{initials}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="truncate text-sm font-medium text-slate-900">
                          {user.full_name}
                        </p>
                        <p className="truncate text-xs text-slate-500">
                          {roleLabel}
                        </p>
                      </div>
                    </button>
                  )}

                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <aside className="fixed inset-y-0 left-0 z-40 hidden w-20 border-r border-slate-200 bg-white md:flex md:flex-col md:items-center">
        <Link
          href="/app/home"
          className="flex h-20 items-center justify-center"
          aria-label="My Jurist home"
        >
          <MyJuristLogoWithWordmark iconOnly size={48} href={false} />
        </Link>

        <TooltipProvider delayDuration={150}>
          <nav className="mt-4 flex flex-1 flex-col items-center gap-2">
            {appNavItems.map((item, index) => {
              const isActive = pathMatchesNav(pathname, item.matches);
              const itemClassName = isActive
                ? item.activeClassName ?? "bg-slate-100 text-slate-900"
                : `${item.iconClassName} hover:bg-slate-100 hover:text-slate-900`;
              const commonClassName = `flex h-14 w-14 items-center justify-center rounded-[8px] transition-colors ${itemClassName} ${
                index === appNavItems.length - 1 ? "mt-auto" : ""
              }`;

              return (
                <Tooltip key={item.label}>
                  <TooltipTrigger asChild>
                    {item.href ? (
                      <Link
                        href={item.href}
                        aria-label={item.label}
                        className={commonClassName}
                      >
                        {item.icon}
                      </Link>
                    ) : (
                      <button
                        type="button"
                        aria-label={item.label}
                        onClick={item.onClick}
                        className={commonClassName}
                      >
                        {item.icon}
                      </button>
                    )}
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>{item.label}</p>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </nav>
        </TooltipProvider>
      </aside>

      <header className="fixed left-0 right-0 top-0 z-30 hidden h-20 border-b border-slate-200 bg-white md:flex md:items-center md:justify-between md:pl-[104px] md:pr-8">
        <p className="text-[20px] font-medium leading-6 text-slate-900">
          Welcome back, {welcomeName}!
        </p>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-base font-medium leading-[22px] tracking-[-0.18px] text-slate-900">
              {formattedDate}
            </p>
          </div>

          <button
            type="button"
            aria-label="Notifications"
            className="flex h-10 w-10 items-center justify-center rounded-[8px] bg-slate-100 text-slate-500 transition-colors hover:bg-slate-200 hover:text-slate-700"
          >
            <Bell className="h-5 w-5" strokeWidth={1.9} />
          </button>

          <button
            type="button"
            onClick={() => setProfileOpen(true)}
            className="flex items-center gap-2 rounded-[8px] px-2 py-1 transition-colors hover:bg-slate-50"
          >
            <Avatar className="h-10 w-10 rounded-[8px]">
              <AvatarFallback className="rounded-[8px] bg-slate-200 text-slate-800">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="text-left">
              <p className="text-base font-medium leading-[22px] tracking-[-0.18px] text-slate-900">
                {welcomeName}
              </p>
              <p className="text-xs leading-4 tracking-[-0.12px] text-slate-600">
                {roleLabel}
              </p>
            </div>
          </button>
        </div>
      </header>

      <main className="overflow-x-hidden pb-20 pt-16 md:pb-0 md:pl-20 md:pt-20">
        {children}
      </main>

      <nav
        className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white/95 px-1 pb-[env(safe-area-inset-bottom,0px)] pt-1 shadow-[0_-4px_12px_rgba(15,23,42,0.08)] backdrop-blur-sm md:hidden"
        aria-label="Primary navigation"
      >
        <div className="mx-auto flex h-14 max-w-lg items-stretch justify-between gap-0.5">
          {mobileBottomNav.map((item) => {
            const isActive = pathMatchesNav(pathname, [...item.matches]);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex min-w-0 flex-1 flex-col items-center justify-center gap-0.5 rounded-lg px-1 py-1 text-[10px] font-semibold leading-tight transition-colors ${
                  isActive ? "text-primary" : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <span className={isActive ? "text-primary" : "text-slate-600"}>{item.icon}</span>
                <span className="max-w-full truncate">{item.label}</span>
              </Link>
            );
          })}
          <button
            type="button"
            className="flex min-w-0 flex-1 flex-col items-center justify-center gap-0.5 rounded-lg px-1 py-1 text-[10px] font-semibold leading-tight text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
            aria-label="More navigation"
            onClick={() => setSidebarOpen(true)}
          >
            <MoreHorizontal className="h-5 w-5 text-slate-600" strokeWidth={1.9} />
            <span className="max-w-full truncate">More</span>
          </button>
        </div>
      </nav>

      <ProfileModal open={profileOpen} onOpenChange={setProfileOpen} />
    </div>
  );
}
