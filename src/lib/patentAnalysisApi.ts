import { API_BASE_URL } from "../app/constants";
import { throwIfNotOk } from "./apiClientErrors";

export async function fetchPatentReportHistory(
  getAuthHeaders: () => Record<string, string>,
  limit: number,
  offset: number
): Promise<unknown> {
  const res = await fetch(
    `${API_BASE_URL}/reports/patent/my-reports?limit=${limit}&offset=${offset}`,
    {
      method: "GET",
      headers: { ...getAuthHeaders(), accept: "application/json" },
    }
  );
  await throwIfNotOk(res, "GET /reports/patent/my-reports", {
    default: "Could not load your patent report history. Please try again.",
  });
  return res.json();
}

export async function postPatentPriorArtSearch(
  getAuthHeaders: () => Record<string, string>,
  body: Record<string, unknown>
): Promise<unknown> {
  const res = await fetch(`${API_BASE_URL}/patents/search`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(body),
  });
  await throwIfNotOk(res, "POST /patents/search", {
    default: "Could not run prior art search. Please try again.",
  });
  return res.json();
}

export async function postPatentExclusionsAnalysis(
  getAuthHeaders: () => Record<string, string>,
  body: Record<string, unknown>
): Promise<unknown> {
  const res = await fetch(`${API_BASE_URL}/patents/analysis/exclusions/detailed`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getAuthHeaders() },
    body: JSON.stringify(body),
  });
  await throwIfNotOk(res, "POST /patents/analysis/exclusions/detailed", {
    default: "Could not run exclusions analysis. Please try again.",
  });
  return res.json();
}

export async function postPatentDisclosureAnalysis(
  getAuthHeaders: () => Record<string, string>,
  body: Record<string, unknown>
): Promise<unknown> {
  const res = await fetch(`${API_BASE_URL}/patents/analysis/disclosure/detailed`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getAuthHeaders() },
    body: JSON.stringify(body),
  });
  await throwIfNotOk(res, "POST /patents/analysis/disclosure/detailed", {
    default: "Could not run disclosure analysis. Please try again.",
  });
  return res.json();
}

export async function postPatentNoveltyAnalysis(
  getAuthHeaders: () => Record<string, string>,
  body: Record<string, unknown>
): Promise<unknown> {
  const res = await fetch(`${API_BASE_URL}/patents/analysis/novelty/detailed`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getAuthHeaders() },
    body: JSON.stringify(body),
  });
  await throwIfNotOk(res, "POST /patents/analysis/novelty/detailed", {
    default: "Could not run novelty analysis. Please try again.",
  });
  return res.json();
}

export async function postPatentComprehensiveReport(
  getAuthHeaders: () => Record<string, string>,
  body: Record<string, unknown>
): Promise<unknown> {
  const res = await fetch(`${API_BASE_URL}/reports/patent/comprehensive`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(body),
  });
  await throwIfNotOk(res, "POST /reports/patent/comprehensive", {
    default: "Could not generate this report. Please try again.",
  });
  return res.json();
}

export async function fetchPatentReportPdf(
  getAuthHeaders: () => Record<string, string>,
  reportId: string
): Promise<Blob> {
  const res = await fetch(`${API_BASE_URL}/reports/patent/report/${reportId}/pdf`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  await throwIfNotOk(res, "GET /reports/patent/report/.../pdf", {
    default: "Could not download this report. Please try again.",
  });
  return res.blob();
}

export async function fetchPatentReportById(
  getAuthHeaders: () => Record<string, string>,
  reportId: string
): Promise<unknown> {
  const res = await fetch(`${API_BASE_URL}/reports/patent/report/${reportId}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  await throwIfNotOk(res, "GET /reports/patent/report/{id}", {
    default: "Could not load this report. Please try again.",
  });
  return res.json();
}
