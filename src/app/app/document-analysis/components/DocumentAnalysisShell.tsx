"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface DocumentAnalysisShellProps {
  sidebar: React.ReactNode;
  children: React.ReactNode;
}

export default function DocumentAnalysisShell({
  sidebar,
  children,
}: DocumentAnalysisShellProps) {
  return (
    <div className="flex min-h-[calc(100vh-5rem)] w-full bg-slate-100">
      <aside className="hidden lg:flex w-[278px] shrink-0 flex-col p-4">{sidebar}</aside>
      <main className={cn("flex-1 min-w-0 overflow-y-auto p-4 md:p-6")}>{children}</main>
    </div>
  );
}
