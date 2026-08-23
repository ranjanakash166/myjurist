"use client";

import React from "react";
import { Loader2 } from "lucide-react";

export default function DocumentCategorizationShimmer() {
  return (
    <div className="flex-1 min-w-0 space-y-6">
      <div className="flex justify-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-fuchsia-100 px-4 py-2 text-sm font-medium text-fuchsia-800">
          <Loader2 className="h-4 w-4 animate-spin" />
          Categorizing documents…
        </span>
      </div>

      <div className="rounded-xl bg-white border border-slate-200 p-6 space-y-4 animate-pulse">
        <div className="h-6 bg-slate-200 rounded w-1/3" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 bg-slate-100 rounded w-2/3" />
              <div className="h-2 bg-slate-100 rounded w-full" />
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl bg-white border border-slate-200 p-6 space-y-4 animate-pulse">
        <div className="h-6 bg-slate-200 rounded w-1/4" />
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-lg border border-slate-100 p-4 space-y-3">
            <div className="h-4 bg-slate-100 rounded w-1/2" />
            <div className="flex gap-2">
              <div className="h-6 bg-sky-100 rounded w-28" />
              <div className="h-6 bg-sky-100 rounded w-32" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
