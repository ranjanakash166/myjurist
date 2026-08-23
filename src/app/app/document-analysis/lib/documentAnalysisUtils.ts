import type { SessionListItem } from "@/lib/documentAnalysisApi";

export const MAX_QUERY_LENGTH = 1000;

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

export function formatSessionDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatSessionGroupLabel(dateString: string): string {
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

export function groupSessionsByDate(
  items: SessionListItem[]
): { label: string; items: SessionListItem[] }[] {
  const groups = new Map<string, SessionListItem[]>();
  for (const item of items) {
    const label = formatSessionGroupLabel(item.session.last_activity);
    const existing = groups.get(label) ?? [];
    existing.push(item);
    groups.set(label, existing);
  }
  return Array.from(groups.entries()).map(([label, groupItems]) => ({
    label,
    items: groupItems,
  }));
}

export function generateChatName(): string {
  const now = new Date();
  const dateStr = now.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  return `Document Analysis - ${dateStr}`;
}

export function generateSessionName(): string {
  const now = new Date();
  const dateStr = now.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  return `Session - ${dateStr}`;
}

export function getProcessingLabel(status: string): string | null {
  const s = status.toLowerCase();
  if (s.includes("upload")) return "Uploading…";
  if (s.includes("process") || s.includes("analyz") || s.includes("pending")) return "Analyzing…";
  if (s.includes("complete") || s.includes("ready") || s.includes("done")) return null;
  return status ? "Processing…" : null;
}
