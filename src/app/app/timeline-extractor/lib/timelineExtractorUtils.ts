import type { TimelineListItem } from "@/lib/timelineApi";

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

export function formatTimelineDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatTimelineGroupLabel(dateString: string): string {
  const date = new Date(dateString);
  const today = new Date();
  const isToday =
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();
  if (isToday) return "Today";
  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function groupTimelinesByDate(
  items: TimelineListItem[]
): { label: string; items: TimelineListItem[] }[] {
  const groups = new Map<string, TimelineListItem[]>();
  for (const item of items) {
    const label = formatTimelineGroupLabel(item.updated_at || item.created_at);
    const existing = groups.get(label) ?? [];
    existing.push(item);
    groups.set(label, existing);
  }
  return Array.from(groups.entries()).map(([label, groupItems]) => ({
    label,
    items: groupItems,
  }));
}

export function formatConfidencePercent(score: number): string {
  const pct = score <= 1 ? score * 100 : score;
  return `${Math.round(pct)}%`;
}

function normalizeSummaryText(text: string): string {
  return text
    .replace(/\\n/g, "\n")
    .replace(/\\t/g, "\t")
    .replace(/\\"/g, '"')
    .trim();
}

function stripMarkdownFences(text: string): string {
  return text
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```\s*$/i, "")
    .trim();
}

function unescapeJsonStringValue(value: string): string {
  return normalizeSummaryText(
    value
      .replace(/\\n/g, "\n")
      .replace(/\\t/g, "\t")
      .replace(/\\"/g, '"')
      .replace(/\\\\/g, "\\")
  );
}

export interface TimelineSummaryParts {
  short: string;
  detailed: string;
}

function looksLikeSummaryJson(text: string): boolean {
  const t = text.trim();
  return (
    t.includes("```") ||
    t.includes('"short_summary"') ||
    t.includes('"detailed_summary"') ||
    t.startsWith("{")
  );
}

function parseSummaryFieldValue(value: string, field: "short" | "detailed"): string {
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (looksLikeSummaryJson(trimmed)) {
    const parts = extractSummaryFieldsFromJsonLike(trimmed);
    return field === "short"
      ? parts.short || parts.detailed
      : parts.detailed || parts.short;
  }
  return normalizeSummaryText(trimmed);
}

function extractSummaryFromObject(obj: Record<string, unknown>): TimelineSummaryParts {
  const shortRaw = obj.short_summary ?? obj.short ?? obj.shortSummary;
  const detailedRaw = obj.detailed_summary ?? obj.detailed ?? obj.detailedSummary;

  const short =
    typeof shortRaw === "string" ? parseSummaryFieldValue(shortRaw, "short") : "";
  const detailed =
    typeof detailedRaw === "string" ? parseSummaryFieldValue(detailedRaw, "detailed") : "";

  if (short && detailed && short === detailed) {
    return { short: "", detailed };
  }

  return { short, detailed };
}

function extractSummaryFieldsFromJsonLike(text: string): TimelineSummaryParts {
  const stripped = stripMarkdownFences(text.trim());

  if (stripped.startsWith("{")) {
    try {
      const parsed = JSON.parse(stripped);
      if (parsed && typeof parsed === "object") {
        return extractSummaryFromObject(parsed as Record<string, unknown>);
      }
    } catch {
      // truncated or malformed JSON — fall through to regex extraction
    }
  }

  const result: TimelineSummaryParts = { short: "", detailed: "" };

  const detailedMatch =
    stripped.match(/"detailed_summary"\s*:\s*"((?:[^"\\]|\\.)*)"/) ||
    stripped.match(/"detailed"\s*:\s*"((?:[^"\\]|\\.)*)"/) ||
    stripped.match(/"detailed_summary"\s*:\s*"([\s\S]+?)"\s*,/) ||
    stripped.match(/"detailed_summary"\s*:\s*"([\s\S]+)$/);
  const shortMatch =
    stripped.match(/"short_summary"\s*:\s*"((?:[^"\\]|\\.)*)"/) ||
    stripped.match(/"short"\s*:\s*"((?:[^"\\]|\\.)*)"/) ||
    stripped.match(/"short_summary"\s*:\s*"([\s\S]+?)"\s*,/);

  if (detailedMatch?.[1]) result.detailed = unescapeJsonStringValue(detailedMatch[1]);
  if (shortMatch?.[1]) result.short = unescapeJsonStringValue(shortMatch[1]);

  if (result.detailed || result.short) return result;

  // Plain prose (not JSON-shaped)
  if (!stripped.startsWith("{") && !stripped.includes('"short_summary"')) {
    return { short: "", detailed: normalizeSummaryText(stripped) };
  }

  return result;
}

/** Parse API summary which may be plain text, JSON, markdown-fenced JSON, or nested either way. */
export function parseTimelineSummaryParts(raw: unknown): TimelineSummaryParts {
  if (raw == null) return { short: "", detailed: "" };

  if (typeof raw === "object") {
    return extractSummaryFromObject(raw as Record<string, unknown>);
  }

  if (typeof raw !== "string") return { short: "", detailed: "" };

  const text = raw.trim();
  if (!text) return { short: "", detailed: "" };

  // Fenced JSON block (may be truncated — no closing ```)
  if (text.includes("```") || text.includes('"short_summary"') || text.includes('"detailed_summary"')) {
    const parts = extractSummaryFieldsFromJsonLike(text);
    if (parts.detailed || parts.short) return parts;
  }

  if (text.startsWith("{")) {
    try {
      return extractSummaryFromObject(JSON.parse(text) as Record<string, unknown>);
    } catch {
      return extractSummaryFieldsFromJsonLike(text);
    }
  }

  return { short: "", detailed: normalizeSummaryText(text) };
}

export function parseTimelineSummary(raw: unknown): string {
  const { short, detailed } = parseTimelineSummaryParts(raw);
  if (detailed && short) return `${short}\n\n${detailed}`;
  return detailed || short || "";
}
