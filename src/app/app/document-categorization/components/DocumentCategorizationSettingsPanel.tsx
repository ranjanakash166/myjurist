"use client";

import React from "react";
import { Settings, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

const THRESHOLD_STEPS = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

interface DocumentCategorizationSettingsProps {
  multiLabel: boolean;
  onMultiLabelChange: (value: boolean) => void;
  confidenceThresholdPct: number;
  onConfidenceThresholdChange: (value: number) => void;
  customCategories: string[];
  categoryInput: string;
  onCategoryInputChange: (value: string) => void;
  onAddCategory: (value: string) => void;
  onRemoveCategory: (category: string) => void;
}

export default function DocumentCategorizationSettings({
  multiLabel,
  onMultiLabelChange,
  confidenceThresholdPct,
  onConfidenceThresholdChange,
  customCategories,
  categoryInput,
  onCategoryInputChange,
  onAddCategory,
  onRemoveCategory,
}: DocumentCategorizationSettingsProps) {
  return (
    <div className="max-w-3xl mx-auto rounded-xl bg-white border border-slate-200 overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-2">
        <Settings className="h-4 w-4 text-slate-600" />
        <h3 className="text-sm font-semibold text-slate-900">Categorization Settings</h3>
      </div>

      <div className="p-4 space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-slate-900">Multi Level Classification</p>
            <p className="text-xs text-slate-500 mt-0.5">
              Allow documents to be assigned to multiple categories
            </p>
          </div>
          <Switch checked={multiLabel} onCheckedChange={onMultiLabelChange} />
        </div>

        <div className="space-y-3">
          <div>
            <p className="text-sm font-medium text-slate-900">Confidence Threshold</p>
            <p className="text-xs text-slate-500 mt-0.5">
              Minimum confidence score required for category assignment
            </p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {THRESHOLD_STEPS.map((step) => (
              <button
                key={step}
                type="button"
                onClick={() => onConfidenceThresholdChange(step)}
                className={cn(
                  "min-w-[40px] h-9 px-2 rounded-md text-sm font-medium transition-colors border",
                  confidenceThresholdPct === step
                    ? "bg-slate-900 text-white border-slate-900"
                    : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                )}
              >
                {step}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium text-slate-900">
            Custom Categories (Optional)
          </Label>
          <div className="flex flex-wrap items-center gap-2 min-h-[44px] rounded-lg border border-slate-200 bg-white px-3 py-2">
            {customCategories.map((cat) => (
              <span
                key={cat}
                className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-1 text-sm text-slate-800"
              >
                {cat}
                <button
                  type="button"
                  onClick={() => onRemoveCategory(cat)}
                  className="text-slate-400 hover:text-slate-600"
                  aria-label={`Remove ${cat}`}
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </span>
            ))}
            <Input
              value={categoryInput}
              onChange={(e) => onCategoryInputChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  onAddCategory(categoryInput);
                }
              }}
              placeholder="Type Here & Enter"
              className="flex-1 min-w-[140px] border-0 shadow-none focus-visible:ring-0 h-8 px-0"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
