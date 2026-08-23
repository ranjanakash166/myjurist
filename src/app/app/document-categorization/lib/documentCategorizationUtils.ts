export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

export function formatHistoryDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatHistoryGroupLabel(dateString: string): string {
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

export interface HistoryListItem {
  request_id: string;
  total_documents: number;
  created_at: string;
  status: string;
  category_count?: number;
}

export function groupHistoryByDate(
  items: HistoryListItem[]
): { label: string; items: HistoryListItem[] }[] {
  const groups = new Map<string, HistoryListItem[]>();
  for (const item of items) {
    const label = formatHistoryGroupLabel(item.created_at);
    const existing = groups.get(label) ?? [];
    existing.push(item);
    groups.set(label, existing);
  }
  return Array.from(groups.entries()).map(([label, groupItems]) => ({
    label,
    items: groupItems,
  }));
}

export function formatSessionLabel(item: HistoryListItem): string {
  const date = new Date(item.created_at);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatConfidencePercent(confidence: number): number {
  return confidence <= 1 ? Math.round(confidence * 100) : Math.round(confidence);
}

export const ACCEPTED_EXTENSIONS = [".pdf", ".doc", ".docx", ".txt", ".rtf"];

export function isAcceptedFile(file: File): boolean {
  const ext = file.name.toLowerCase().slice(file.name.lastIndexOf("."));
  return ACCEPTED_EXTENSIONS.includes(ext);
}

export const MAX_FILE_SIZE = 50 * 1024 * 1024;
