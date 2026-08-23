"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface LegalResearchShellProps {
  sidebar: React.ReactNode;
  children: React.ReactNode;
  mobileSidebar?: React.ReactNode;
}

export default function LegalResearchShell({
  sidebar,
  children,
  mobileSidebar,
}: LegalResearchShellProps) {
  return (
    <div className="flex min-h-[calc(100vh-5rem)] w-full bg-slate-100">
      <aside className="hidden lg:flex w-[278px] shrink-0 flex-col p-4">
        {sidebar}
      </aside>
      {mobileSidebar && (
        <div className="lg:hidden fixed bottom-20 left-4 z-30">{mobileSidebar}</div>
      )}
      <main className={cn("flex-1 min-w-0 overflow-y-auto p-4 md:p-6")}>{children}</main>
    </div>
  );
}
