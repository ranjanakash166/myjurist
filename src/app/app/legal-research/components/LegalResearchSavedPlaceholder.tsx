"use client";

import React from "react";
import { Bookmark } from "lucide-react";

export default function LegalResearchSavedPlaceholder() {
  return (
    <div className="mx-auto max-w-lg mt-16 text-center space-y-4">
      <div className="mx-auto h-16 w-16 rounded-full bg-slate-200 flex items-center justify-center">
        <Bookmark className="h-8 w-8 text-slate-500" />
      </div>
      <h2 className="text-xl font-semibold text-slate-900">Saved searches coming soon</h2>
      <p className="text-sm text-slate-500">
        Save searches for quick access — this feature is on the way. For now, use Recent Searches or
        History to revisit past research.
      </p>
    </div>
  );
}
