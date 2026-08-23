import type { AISummaryResponse, SearchResult } from "@/lib/legalResearchApi";

export const CHAT_PREFILL_KEY = "myjurist_chat_prefill_query";

export function formatFileName(filePath: string): string {
  const parts = filePath.split("/");
  return parts[parts.length - 1]?.replace(".md", "") || filePath;
}

export function formatCaseTitle(result: SearchResult): string {
  const t = result.title?.trim();
  if (t) return t;
  return formatFileName(result.source_file);
}

export function formatCourtLabel(courtType: string): string {
  return courtType
    .split(/[-_]/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
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

export function getSimilarityColor(score: number): string {
  if (score >= 0.8) return "text-primary bg-primary/10";
  if (score >= 0.6) return "text-yellow-600 bg-yellow-100";
  return "text-red-600 bg-red-100";
}

export function buildCaseCopyText(result: SearchResult): string {
  const lines = [
    `Title: ${result.title?.trim() ? result.title : formatFileName(result.source_file)}`,
    `Source: ${formatFileName(result.source_file)}`,
  ];
  if (result.section_header) lines.push(`Section: ${result.section_header}`);
  if (result.court_type) lines.push(`Court: ${result.court_type}`);
  if (result.year) lines.push(`Year: ${result.year}`);
  if (
    typeof result.similarity_score === "number" &&
    result.similarity_score >= 0 &&
    result.similarity_score <= 1
  ) {
    lines.push(`Match: ${(result.similarity_score * 100).toFixed(1)}%`);
  }
  lines.push("", "Content:", result.content || "");
  return lines.join("\n");
}

export type ParsedAISummaryData = {
  ai_summary: string;
  key_legal_insights?: string[];
  relevant_precedents?: string[];
  statutory_provisions?: string[];
  procedural_developments?: string[];
  practical_implications?: string[];
  legal_areas_covered?: string[];
  confidence_score?: number;
};

export function getParsedAISummaryData(aiSummary: AISummaryResponse): ParsedAISummaryData {
  try {
    let jsonContent = aiSummary.ai_summary;
    if (jsonContent.includes("```json")) {
      jsonContent = jsonContent.replace(/```json\s*/, "").replace(/\s*```$/, "");
    }
    const cleanJson = jsonContent.replace(/\s+/g, " ").trim();
    const parsedSummary = JSON.parse(cleanJson);
    return {
      ai_summary: parsedSummary.ai_summary || aiSummary.ai_summary,
      key_legal_insights: parsedSummary.key_legal_insights || aiSummary.key_legal_insights,
      relevant_precedents: parsedSummary.relevant_precedents || aiSummary.relevant_precedents,
      statutory_provisions: parsedSummary.statutory_provisions || aiSummary.statutory_provisions,
      procedural_developments:
        parsedSummary.procedural_developments || aiSummary.procedural_developments,
      practical_implications:
        parsedSummary.practical_implications || aiSummary.practical_implications,
      legal_areas_covered: parsedSummary.legal_areas_covered || aiSummary.legal_areas_covered,
      confidence_score: parsedSummary.confidence_score || aiSummary.confidence_score,
    };
  } catch {
    return {
      ai_summary: aiSummary.ai_summary,
      key_legal_insights: aiSummary.key_legal_insights,
      relevant_precedents: aiSummary.relevant_precedents,
      statutory_provisions: aiSummary.statutory_provisions,
      procedural_developments: aiSummary.procedural_developments,
      practical_implications: aiSummary.practical_implications,
      legal_areas_covered: aiSummary.legal_areas_covered,
      confidence_score: aiSummary.confidence_score,
    };
  }
}

export function buildSummaryDownloadText(
  query: string,
  searchType: string,
  totalResults: number,
  parsedData: ParsedAISummaryData
): string {
  let summaryText = `Legal Research Summary\n`;
  summaryText += `Query: ${query}\n`;
  summaryText += `Search Type: ${searchType}\n\n`;
  summaryText += `AI Summary:\n${parsedData.ai_summary}\n\n`;

  if (parsedData.key_legal_insights?.length) {
    summaryText += `Key Legal Insights:\n`;
    parsedData.key_legal_insights.forEach((insight, index) => {
      summaryText += `${index + 1}. ${insight}\n`;
    });
    summaryText += `\n`;
  }
  if (parsedData.relevant_precedents?.length) {
    summaryText += `Relevant Precedents:\n`;
    parsedData.relevant_precedents.forEach((precedent, index) => {
      summaryText += `${index + 1}. ${precedent}\n`;
    });
    summaryText += `\n`;
  }
  if (parsedData.statutory_provisions?.length) {
    summaryText += `Statutory Provisions:\n`;
    parsedData.statutory_provisions.forEach((provision, index) => {
      summaryText += `${index + 1}. ${provision}\n`;
    });
    summaryText += `\n`;
  }
  if (parsedData.procedural_developments?.length) {
    summaryText += `Procedural Developments:\n`;
    parsedData.procedural_developments.forEach((development, index) => {
      summaryText += `${index + 1}. ${development}\n`;
    });
    summaryText += `\n`;
  }
  if (parsedData.practical_implications?.length) {
    summaryText += `Practical Implications:\n`;
    parsedData.practical_implications.forEach((implication, index) => {
      summaryText += `${index + 1}. ${implication}\n`;
    });
    summaryText += `\n`;
  }
  if (parsedData.legal_areas_covered?.length) {
    summaryText += `Legal Areas Covered:\n`;
    parsedData.legal_areas_covered.forEach((area) => {
      summaryText += `• ${area}\n`;
    });
    summaryText += `\n`;
  }
  summaryText += `Total Results: ${totalResults}\n`;
  return summaryText;
}

export function downloadTextFile(content: string, filename: string) {
  const blob = new Blob([content], { type: "text/plain" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}
