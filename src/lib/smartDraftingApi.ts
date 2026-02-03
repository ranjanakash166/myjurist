import { API_BASE_URL } from "../app/constants";

/** Single question from the drafting API (e.g. landlord_name, type text, options null). */
export interface DraftingQuestion {
  field: string;
  question: string;
  type: string;
  options: string[] | null;
}

/** Response from POST /drafting - same shape for first and subsequent calls. */
export interface DraftingResponse {
  session_id: string;
  message: string;
  questions: DraftingQuestion[] | null;
  status: string;
  matched_template: string | null;
  contract_id: string | null;
}

export interface SendDraftingMessageParams {
  message: string;
  session_id?: string;
}

/**
 * Send a message to the smart contract drafting API.
 * First call: pass only message; use returned session_id for follow-ups.
 * Subsequent calls: pass session_id + message (e.g. answers as string).
 */
export async function sendDraftingMessage(
  params: SendDraftingMessageParams,
  getAuthHeaders: () => Record<string, string>
): Promise<DraftingResponse> {
  const body: Record<string, string> = { message: params.message };
  if (params.session_id) {
    body.session_id = params.session_id;
  }

  const res = await fetch(`${API_BASE_URL}/drafting`, {
    method: "POST",
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    const msg =
      (err as { detail?: Array<{ msg?: string }> })?.detail?.[0]?.msg ||
      (err as { message?: string }).message ||
      res.statusText;
    throw new Error(msg || "Drafting request failed");
  }

  return res.json() as Promise<DraftingResponse>;
}

/**
 * Download the drafted contract as PDF or DOCX.
 * Uses the Content-Disposition filename from the response when available.
 */
export async function downloadDraftContract(
  contractId: string,
  format: "pdf" | "docx",
  getAuthHeaders: () => Record<string, string>
): Promise<void> {
  const url = `${API_BASE_URL}/drafting/contract/${contractId}/${format}`;
  const res = await fetch(url, {
    method: "GET",
    headers: {
      accept: format === "pdf" ? "application/pdf" : "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ...getAuthHeaders(),
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    const msg =
      (err as { detail?: Array<{ msg?: string }> })?.detail?.[0]?.msg ||
      (err as { message?: string }).message ||
      res.statusText;
    throw new Error(msg || `Download failed: ${res.statusText}`);
  }

  const blob = await res.blob();
  const disposition = res.headers.get("content-disposition");
  const filenameMatch = disposition?.match(/filename=(.+)/);
  const filename =
    filenameMatch?.[1]?.replace(/^["']|["']$/g, "")?.trim() ||
    `contract_${contractId}.${format === "pdf" ? "pdf" : "docx"}`;

  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  URL.revokeObjectURL(a.href);
  document.body.removeChild(a);
}

/**
 * Fetch the drafted contract as DOCX blob (for loading into editor).
 * Does not trigger a download.
 */
export async function getDraftContractDocxBlob(
  contractId: string,
  getAuthHeaders: () => Record<string, string>
): Promise<Blob> {
  const url = `${API_BASE_URL}/drafting/contract/${contractId}/docx`;
  const res = await fetch(url, {
    method: "GET",
    headers: {
      accept: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ...getAuthHeaders(),
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    const msg =
      (err as { detail?: Array<{ msg?: string }> })?.detail?.[0]?.msg ||
      (err as { message?: string }).message ||
      res.statusText;
    throw new Error(msg || `Failed to fetch contract: ${res.statusText}`);
  }

  return res.blob();
}

/**
 * Update contract content (e.g. after user edits in the editor and saves).
 * PUT /drafting/contract/{contract_id} with body { content: string }.
 */
export async function updateDraftContract(
  contractId: string,
  content: string,
  getAuthHeaders: () => Record<string, string>
): Promise<string> {
  const url = `${API_BASE_URL}/drafting/contract/${contractId}`;
  const res = await fetch(url, {
    method: "PUT",
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ content }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    const msg =
      (err as { detail?: Array<{ msg?: string }> })?.detail?.[0]?.msg ||
      (err as { message?: string }).message ||
      res.statusText;
    throw new Error(msg || `Update failed: ${res.statusText}`);
  }

  const data = await res.json();
  return typeof data === "string" ? data : String(data ?? "");
}
