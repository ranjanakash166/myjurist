"use client";

import React from "react";
import { Loader2 } from "lucide-react";

export default function DocumentAnalysisSkeleton() {
  return (
    <div className="flex items-center justify-center min-h-[400px] text-slate-400">
      <Loader2 className="h-8 w-8 animate-spin" />
    </div>
  );
}
