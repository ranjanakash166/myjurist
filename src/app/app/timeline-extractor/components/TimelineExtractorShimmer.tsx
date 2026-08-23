"use client";

import React from "react";
import { Loader2 } from "lucide-react";

export default function TimelineExtractorShimmer() {
  return (
    <div className="flex-1 min-w-0 space-y-6">
      <div className="flex justify-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-fuchsia-100 px-4 py-2 text-sm font-medium text-fuchsia-800">
          <Loader2 className="h-4 w-4 animate-spin" />
          Extracting timeline…
        </span>
      </div>

      <div className="rounded-xl bg-white border border-slate-200 p-6 space-y-4 animate-pulse">
        <div className="h-6 bg-slate-200 rounded w-1/3" />
        <div className="space-y-2">
          <div className="h-4 bg-slate-100 rounded w-full" />
          <div className="h-4 bg-slate-100 rounded w-5/6" />
          <div className="h-4 bg-slate-100 rounded w-4/6" />
        </div>
        <div className="flex gap-2 pt-2">
          <div className="h-8 bg-sky-100 rounded-lg w-32" />
          <div className="h-8 bg-sky-100 rounded-lg w-40" />
          <div className="h-8 bg-sky-100 rounded-lg w-36" />
        </div>
      </div>

      <div className="rounded-xl bg-white border border-slate-200 p-6 space-y-4 animate-pulse">
        <div className="flex items-center justify-between">
          <div className="h-6 bg-slate-200 rounded w-40" />
          <div className="h-9 bg-slate-100 rounded w-28" />
        </div>
        <div className="h-10 bg-slate-100 rounded w-full" />
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex gap-4 py-3 border-t border-slate-100">
            <div className="h-4 bg-slate-100 rounded w-24 shrink-0" />
            <div className="h-4 bg-slate-100 rounded flex-1" />
            <div className="h-4 bg-slate-100 rounded w-28 shrink-0" />
            <div className="h-4 bg-slate-100 rounded w-16 shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}
