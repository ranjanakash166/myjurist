/**
 * Document analysis (chats / sessions) — typed API client.
 */
import { API_BASE_URL } from "../app/constants";
import { throwIfNotOk } from "./apiClientErrors";

export async function daEnsureOk(
  res: Response,
  logContext: string,
  userFallback: string
): Promise<void> {
  await throwIfNotOk(res, logContext, { default: userFallback });
}

export interface DAChat {
  id: string;
  name: string;
  description: string;
  created_at: string;
  last_activity: string;
  is_active: boolean;
  document_count: number;
  session_count: number;
  user_id: string;
}

export interface DASession {
  id: string;
  chat_id: string;
  name: string;
  created_at: string;
  last_activity: string;
  message_count: number;
  is_active: boolean;
  selected_document_count: number;
  selected_documents?: unknown[];
}

export interface DAMessage {
  id: string;
  session_id: string;
  user_message: string;
  assistant_response: string;
  timestamp: string;
  response_time_ms: number;
}

export interface DADocument {
  id: string;
  filename: string;
  file_type: string;
  file_size: number;
  upload_timestamp: string;
  processing_status: string;
  total_pages: number;
  total_tokens: number;
  total_chunks: number;
  added_to_chat_at: string;
}

export interface SessionListItem {
  session: DASession;
  chatId: string;
  chatName: string;
}

export interface ChatMessage {
  sender: "user" | "system";
  text: string;
  time: Date;
}

type AuthHeaders = Record<string, string>;

function authHeadersOnly(getAuthHeaders: () => AuthHeaders): AuthHeaders {
  const headers = { ...getAuthHeaders() };
  if ("Content-Type" in headers) delete headers["Content-Type"];
  return headers;
}

export async function fetchChats(
  getAuthHeaders: () => AuthHeaders,
  skip = 0,
  limit = 50
): Promise<{ chats: DAChat[]; total: number }> {
  const res = await fetch(
    `${API_BASE_URL}/chats?skip=${skip}&limit=${limit}&active_only=true`,
    { headers: getAuthHeaders() }
  );
  await daEnsureOk(res, "GET /chats", "Could not load your document chats. Please try again.");
  const data = await res.json();
  return { chats: data.chats || [], total: data.total || 0 };
}

export async function fetchSessionsForChat(
  getAuthHeaders: () => AuthHeaders,
  chatId: string,
  skip = 0,
  limit = 50
): Promise<{ sessions: DASession[]; total: number }> {
  const res = await fetch(
    `${API_BASE_URL}/chats/${chatId}/sessions?skip=${skip}&limit=${limit}&active_only=true`,
    { headers: getAuthHeaders() }
  );
  await daEnsureOk(res, "GET /chats/{id}/sessions", "Could not load sessions for this chat. Please try again.");
  const data = await res.json();
  return { sessions: data.sessions || [], total: data.total || 0 };
}

export async function fetchRecentSessions(
  getAuthHeaders: () => AuthHeaders,
  chatLimit = 20
): Promise<SessionListItem[]> {
  const { chats } = await fetchChats(getAuthHeaders, 0, chatLimit);
  const results = await Promise.all(
    chats.map(async (chat) => {
      try {
        const { sessions } = await fetchSessionsForChat(getAuthHeaders, chat.id, 0, 50);
        return sessions.map((session) => ({
          session,
          chatId: chat.id,
          chatName: chat.name,
        }));
      } catch {
        return [] as SessionListItem[];
      }
    })
  );
  return results
    .flat()
    .sort(
      (a, b) =>
        new Date(b.session.last_activity).getTime() - new Date(a.session.last_activity).getTime()
    );
}

export async function createChat(
  getAuthHeaders: () => AuthHeaders,
  name: string,
  description?: string
): Promise<DAChat> {
  const res = await fetch(`${API_BASE_URL}/chats`, {
    method: "POST",
    headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify({ name, description: description ?? name }),
  });
  await daEnsureOk(res, "POST /chats", "Could not create this chat. Please try again.");
  return res.json();
}

export async function uploadChatDocuments(
  getAuthHeaders: () => AuthHeaders,
  chatId: string,
  files: File[]
): Promise<{ uploaded_documents: DADocument[]; total_uploaded: number; failed_documents?: unknown[] }> {
  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));
  const res = await fetch(`${API_BASE_URL}/chats/${chatId}/documents`, {
    method: "POST",
    headers: authHeadersOnly(getAuthHeaders),
    body: formData,
  });
  await daEnsureOk(res, "POST /chats/{id}/documents", "Could not upload your documents. Please try again.");
  return res.json();
}

export async function createSession(
  getAuthHeaders: () => AuthHeaders,
  chatId: string,
  name: string,
  documentIds: string[]
): Promise<DASession> {
  const res = await fetch(`${API_BASE_URL}/chats/${chatId}/sessions/`, {
    method: "POST",
    headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify({ name, document_ids: documentIds }),
  });
  await daEnsureOk(res, "POST /chats/{id}/sessions", "Could not create this session. Please try again.");
  return res.json();
}

export async function fetchSessionMessages(
  getAuthHeaders: () => AuthHeaders,
  chatId: string,
  sessionId: string,
  skip = 0,
  limit = 100
): Promise<DAMessage[]> {
  const res = await fetch(
    `${API_BASE_URL}/chats/${chatId}/sessions/${sessionId}/messages?skip=${skip}&limit=${limit}`,
    { headers: getAuthHeaders() }
  );
  await daEnsureOk(res, "GET /chats/.../messages", "Could not load messages for this session. Please try again.");
  const data = await res.json();
  return data.messages || [];
}

export function messagesToChatHistory(messages: DAMessage[]): ChatMessage[] {
  return messages
    .flatMap((msg) => [
      { sender: "user" as const, text: msg.user_message, time: new Date(msg.timestamp) },
      { sender: "system" as const, text: msg.assistant_response, time: new Date(msg.timestamp) },
    ]);
}

export async function sendSessionMessage(
  getAuthHeaders: () => AuthHeaders,
  chatId: string,
  sessionId: string,
  message: string
): Promise<{ assistant_response: string; timestamp?: string }> {
  const res = await fetch(`${API_BASE_URL}/chats/${chatId}/sessions/${sessionId}/messages`, {
    method: "POST",
    headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });
  await daEnsureOk(res, "POST /chats/.../messages", "Could not send your message. Please try again.");
  const data = await res.json();
  return {
    assistant_response: data.assistant_response || data.response || data.message || "No response received",
    timestamp: data.timestamp,
  };
}

export async function fetchChatDocuments(
  getAuthHeaders: () => AuthHeaders,
  chatId: string
): Promise<DADocument[]> {
  const res = await fetch(`${API_BASE_URL}/chats/${chatId}/documents`, {
    headers: getAuthHeaders(),
  });
  await daEnsureOk(res, "GET /chats/{id}/documents", "Could not load documents for this chat.");
  const data = await res.json();
  return data.documents || [];
}

export async function fetchSessionDocuments(
  getAuthHeaders: () => AuthHeaders,
  chatId: string,
  sessionId: string,
  chatDocuments: DADocument[] = []
): Promise<DADocument[]> {
  const res = await fetch(
    `${API_BASE_URL}/chats/${chatId}/sessions/${sessionId}/documents`,
    { headers: getAuthHeaders() }
  );
  await daEnsureOk(res, "GET /chats/.../sessions/.../documents", "Could not load session documents.");
  const data = await res.json();
  if (Array.isArray(data)) return data;
  if (typeof data === "string") {
    const doc = chatDocuments.find((d) => d.id === data);
    return doc ? [doc] : [];
  }
  if (data && typeof data === "object" && data.documents) return data.documents;
  return [];
}

export async function downloadChatDocument(
  getAuthHeaders: () => AuthHeaders,
  chatId: string,
  documentId: string
): Promise<Blob> {
  const res = await fetch(`${API_BASE_URL}/chats/${chatId}/documents/${documentId}/download`, {
    headers: getAuthHeaders(),
  });
  await daEnsureOk(res, "GET /chats/.../documents/.../download", "Could not download this document. Please try again.");
  return res.blob();
}

export async function deleteChatDocument(
  getAuthHeaders: () => AuthHeaders,
  chatId: string,
  documentId: string
): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/chats/${chatId}/documents/${documentId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  await daEnsureOk(res, "DELETE /chats/.../documents", "Could not delete this document. Please try again.");
}

export async function deleteSessionDocument(
  getAuthHeaders: () => AuthHeaders,
  chatId: string,
  sessionId: string,
  documentId: string
): Promise<void> {
  const res = await fetch(
    `${API_BASE_URL}/chats/${chatId}/sessions/${sessionId}/documents/${documentId}`,
    { method: "DELETE", headers: getAuthHeaders() }
  );
  await daEnsureOk(res, "DELETE /chats/.../sessions/.../documents", "Could not remove this document from the session.");
}

export async function addDocumentToSession(
  getAuthHeaders: () => AuthHeaders,
  chatId: string,
  sessionId: string,
  documentId: string
): Promise<void> {
  const res = await fetch(
    `${API_BASE_URL}/chats/${chatId}/sessions/${sessionId}/documents/${documentId}`,
    { method: "PUT", headers: getAuthHeaders() }
  );
  await daEnsureOk(res, "PUT /chats/.../sessions/.../documents", "Could not add this document to the session.");
}
