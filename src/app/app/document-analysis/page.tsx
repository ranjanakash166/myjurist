"use client";
import React, { useState, useEffect, useRef } from "react";
import { API_BASE_URL } from "../../constants";
import { useAuth } from "../../../components/AuthProvider";
import ChatList from "./ChatList";
import SessionList from "./SessionList";
import ChatInterface from "./ChatInterface";
import PdfViewerModal from "../../../components/PdfViewerModal";
import CollapsibleSection from "../../../components/CollapsibleSection";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageCircle, FileText, Check, Plus, Upload, Settings, AlertTriangle, FileUp, X, Clock, CheckCircle } from "lucide-react";
import { toast } from '@/hooks/use-toast';

interface ApiResponse {
  document_id: string;
  filename: string;
  is_chunked: boolean;
  total_chunks: number;
  total_tokens: number;
  structure_analysis: string;
  file_size: number;
}

interface Chat {
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

interface Session {
  id: string;
  chat_id: string;
  name: string;
  created_at: string;
  last_activity: string;
  message_count: number;
  is_active: boolean;
  selected_document_count: number;
  selected_documents: any[];
}

interface Message {
  id: string;
  session_id: string;
  user_message: string;
  assistant_response: string;
  timestamp: string;
  response_time_ms: number;
}

interface SelectedDocument {
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

function generateSessionId() {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export default function DocumentAnalysisPage() {
  const { getAuthHeaders } = useAuth();
  const [tab, setTab] = useState<'new' | 'history'>('new');
  const [processing, setProcessing] = useState(false);
  const [apiResult, setApiResult] = useState<ApiResponse | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [documentId, setDocumentId] = useState<string | null>(null);
  const [streaming, setStreaming] = useState(false);
  const [streamedText, setStreamedText] = useState("");

  // History state
  const [chats, setChats] = useState<Chat[]>([]);
  const [chatsLoading, setChatsLoading] = useState(false);
  const [chatsError, setChatsError] = useState<string | null>(null);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [sessionsLoading, setSessionsLoading] = useState(false);
  const [sessionsError, setSessionsError] = useState<string | null>(null);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [messagesError, setMessagesError] = useState<string | null>(null);
  const [historyLoading, setHistoryLoading] = useState(false);

  // Add pagination state
  const [chatPage, setChatPage] = useState(0);
  const chatPageSize = 10; // You can adjust this as needed
  const [chatTotalCount, setChatTotalCount] = useState(0);

  // Add session pagination state
  const [sessionPage, setSessionPage] = useState(0);
  const sessionPageSize = 5; // Adjust as needed
  const [sessionTotalCount, setSessionTotalCount] = useState(0);

  // PDF viewer state
  const [pdfModalOpen, setPdfModalOpen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");
  const [pdfFilename, setPdfFilename] = useState("");

  // UI state for collapsible sections
  const [documentsCollapsed, setDocumentsCollapsed] = useState(false);
  const [sessionsCollapsed, setSessionsCollapsed] = useState(false);
  const [uploadCollapsed, setUploadCollapsed] = useState(false);

  // Add state for new analysis flow
  const [newChatName, setNewChatName] = useState("");
  const [newChatDescription, setNewChatDescription] = useState("");
  const [newChatLoading, setNewChatLoading] = useState(false);
  const [newChatError, setNewChatError] = useState<string | null>(null);
  const [newChatSuccess, setNewChatSuccess] = useState(false);
  const [createdChat, setCreatedChat] = useState<any>(null);
  const [newAnalysisStep, setNewAnalysisStep] = useState<'create' | 'upload'>('create');

  // Fetch chats on component mount
  const fetchChats = async () => {
    try {
      setChatsLoading(true);
      setChatsError(null);
      
      const skip = chatPage * chatPageSize;
      const limit = chatPageSize;
      
      const res = await fetch(`${API_BASE_URL}/chats?skip=${skip}&limit=${limit}&active_only=true`, {
        headers: getAuthHeaders(),
      });
      
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.detail?.[0]?.msg || 'Failed to fetch chats');
      }
      
      const data = await res.json();
      setChats(data.chats || []);
      setChatTotalCount(data.total || 0);
    } catch (err: any) {
      setChatsError(err.message || 'Failed to fetch chats');
      setChats([]);
      setChatTotalCount(0);
    } finally {
      setChatsLoading(false);
    }
  };

  // Step 2 state
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadedDocs, setUploadedDocs] = useState<any[]>([]);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Step 3 state
  const [selectedDocIds, setSelectedDocIds] = useState<string[]>([]);
  const [sessionName, setSessionName] = useState("");
  const [sessionLoading, setSessionLoading] = useState(false);
  const [sessionError, setSessionError] = useState<string | null>(null);
  const [sessionSuccess, setSessionSuccess] = useState(false);
  const [createdSession, setCreatedSession] = useState<any>(null);

  // Step 4 state
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);

  // Document lists state
  const [chatDocuments, setChatDocuments] = useState<any[]>([]);
  const [sessionDocuments, setSessionDocuments] = useState<any[]>([]);
  const [chatDocumentsLoading, setChatDocumentsLoading] = useState(false);
  const [sessionDocumentsLoading, setSessionDocumentsLoading] = useState(false);

  const [addToSessionSuccessTrigger, setAddToSessionSuccessTrigger] = useState(0);

  const [uploadingNewDocuments, setUploadingNewDocuments] = useState(false);

  const handleToggleDoc = (docId: string) => {
    setSelectedDocIds(prev =>
      prev.includes(docId) ? prev.filter(id => id !== docId) : [...prev, docId]
    );
  };

  const handleCreateSession = async (e: React.FormEvent) => {
    e.preventDefault();
    setSessionError(null);
    setSessionSuccess(false);
    setSessionLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/chats/${createdChat.id}/sessions/`, {
        method: 'POST',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: sessionName,
          document_ids: selectedDocIds,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.detail?.[0]?.msg || 'Failed to create session');
      }
      const data = await res.json();
      setCreatedSession(data);
      setSessionSuccess(true);
      setChatMessages([]); // Reset chat messages for new session
      setChatInput(""); // Reset chat input for new session
      
      // Fetch documents for the new session
      await fetchChatDocuments(createdChat.id);
      await fetchSessionDocuments(createdChat.id, data.id);
    } catch (err: any) {
      setSessionError(err.message || 'An error occurred while creating session.');
    } finally {
      setSessionLoading(false);
    }
  };

  // Fetch chats when history tab is opened
  useEffect(() => {
    if (tab === 'history') {
      setSelectedChat(null);
      setSessions([]);
      setSelectedSession(null);
      setChatMessages([]); // Clear old chat history
      setChatInput(""); // Clear old input
      setChatLoading(false); // Clear old loading state
      setChatError(null); // Clear old error state
      setMessages([]);
      // Ensure chats section is expanded when history tab is opened
      setDocumentsCollapsed(false);
      setSessionsCollapsed(false);
      
      fetchChats();
    }
  }, [tab, chatPage]);

  // Fetch sessions when selected chat changes
  useEffect(() => {
    if (selectedChat) {
      const fetchSessions = async () => {
        try {
          setSessionsLoading(true);
          setSessionsError(null);
          
          const skip = sessionPage * sessionPageSize;
          const limit = sessionPageSize;
          
          const res = await fetch(`${API_BASE_URL}/chats/${selectedChat.id}/sessions?skip=${skip}&limit=${limit}&active_only=true`, {
            headers: getAuthHeaders(),
          });
          
          if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err?.detail?.[0]?.msg || 'Failed to fetch sessions');
          }
          
          const data = await res.json();
          setSessions(data.sessions || []);
          setSessionTotalCount(data.total || 0);
        } catch (err: any) {
          setSessionsError(err.message || 'Failed to fetch sessions');
          setSessions([]);
          setSessionTotalCount(0);
        } finally {
          setSessionsLoading(false);
        }
      };
      
      fetchSessions();
    }
  }, [selectedChat, sessionPage]);

  // File upload logic
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setUploadFiles(Array.from(e.target.files));
      setUploadError(null);
    }
  };

  const handleUploadDocuments = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createdChat?.id || uploadFiles.length === 0) return;
    setUploading(true);
    setUploadError(null);
    setUploadSuccess(false);
    try {
      const formData = new FormData();
      uploadFiles.forEach(file => formData.append('files', file));

      // Only include Authorization header, never Content-Type
      const headers = { ...getAuthHeaders() };
      if ('Content-Type' in headers) delete headers['Content-Type'];
      const res = await fetch(`${API_BASE_URL}/chats/${createdChat.id}/documents`, {
        method: 'POST',
        headers,
        body: formData,
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.detail?.[0]?.msg || 'Failed to upload documents');
      }
      const data = await res.json();
      
      // Check if upload was successful
      if (data.total_uploaded > 0) {
        setUploadedDocs(data.uploaded_documents || []);
        setUploadSuccess(true);
        setUploadFiles([]);
      } else {
        // Handle upload failure
        const failedDocs = data.failed_documents || [];
        const errorMessage = failedDocs.length > 0 
          ? `Failed to upload: ${failedDocs.join(', ')}`
          : 'Failed to upload documents';
        throw new Error(errorMessage);
      }
    } catch (err: any) {
      setUploadError(err.message || 'An error occurred while uploading documents.');
    } finally {
      setUploading(false);
    }
  };

  // Simulated streaming for chat
  const simulateStreaming = async (fullText: string) => {
    setStreaming(true);
    setStreamedText("");
    for (let i = 1; i <= fullText.length; i++) {
      setStreamedText(fullText.slice(0, i));
      await new Promise(res => setTimeout(res, 12));
    }
    setStreaming(false);
    setChatMessages(prev => [
      ...prev,
      { sender: "system", text: fullText, time: new Date() },
    ]);
    setStreamedText("");
  };

  // Send a new chat message
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !documentId) return;
    setChatError(null);
    const now = new Date();
    setChatMessages(prev => [
      ...prev,
      { sender: "user", text: chatInput, time: now },
    ]);
    setChatLoading(true);
    const question = chatInput;
    setChatInput("");
    try {
      const body: any = {
        question,
        document_id: documentId,
      };
      if (selectedSession && selectedSession.id) {
        body.session_id = selectedSession.id;
      }
      const res = await fetch(`${API_BASE_URL}/chat`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.detail?.[0]?.msg || "Chat failed");
      }
      const data = await res.json();
      await simulateStreaming(data.response);
    } catch (err: any) {
      setChatMessages(prev => [
        ...prev,
        { sender: "system", text: "(Error) " + (err.message || "An error occurred during chat."), time: new Date() },
      ]);
      setChatError(err.message || "An error occurred during chat.");
    } finally {
      setChatLoading(false);
    }
  };

  // Handle chat selection from history
  const handleSelectChat = async (chat: Chat) => {
    setSelectedChat(chat);
    setSelectedSession(null);
    setSessionsLoading(true);
    setSessionsError(null);
    setChatMessages([]); // Clear old chat history
    setChatInput(""); // Clear old input
    setChatLoading(false); // Clear old loading state
    setChatError(null); // Clear old error state
    setMessages([]);
    setDocumentsCollapsed(true); // Collapse chat list
    setTimeout(() => {
      chatSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 300); // Wait for UI update
    
    try {
      const skip = sessionPage * sessionPageSize;
      const limit = sessionPageSize;
      
      const res = await fetch(`${API_BASE_URL}/chats/${chat.id}/sessions?skip=${skip}&limit=${limit}&active_only=true`, {
        headers: getAuthHeaders(),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.detail?.[0]?.msg || "Failed to fetch sessions");
      }
      const data = await res.json();
      setSessions(data.sessions || []);
      setSessionTotalCount(data.total || 0);
      setSessionPage(0); // Reset to first page
    } catch (err: any) {
      setSessionsError(err.message || "Failed to load chat sessions.");
    } finally {
      setSessionsLoading(false);
    }
  };

  // Handle session selection
  const handleSelectSession = async (session: Session) => {
    setSelectedSession(session);
    setMessagesLoading(true);
    setMessagesError(null);
    setChatMessages([]); // Clear old chat history
    setChatInput(""); // Clear old input
    setChatLoading(false); // Clear old loading state
    setChatError(null); // Clear old error state
    
    try {
      const res = await fetch(`${API_BASE_URL}/chats/${session.chat_id}/sessions/${session.id}/messages?skip=0&limit=100`, {
        headers: getAuthHeaders(),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.detail?.[0]?.msg || "Failed to fetch session messages");
      }
      const data = await res.json();
      const chatHistory = data.messages.map((msg: Message) => [
        { sender: "user", text: msg.user_message, time: new Date(msg.timestamp) },
        { sender: "system", text: msg.assistant_response, time: new Date(msg.timestamp) },
      ]).flat();
      setChatMessages(chatHistory);
      setMessages(data.messages || []);
      
      // Fetch documents for the selected session
      if (session.chat_id) {
        await fetchChatDocuments(session.chat_id);
        await fetchSessionDocuments(session.chat_id, session.id);
      }
    } catch (err: any) {
      setChatMessages([
        { sender: "system", text: "(Error) " + (err.message || "Failed to load chat session."), time: new Date() },
      ]);
      setChatError(err.message || "Failed to load chat session.");
    } finally {
      setChatLoading(false);
    }
  };

  // Handle document download
  const handleDownload = async (documentId: string, filename: string) => {
    // Get chatId from createdChat or selectedSession
    const chatId = createdChat?.id || selectedSession?.chat_id;
    if (!chatId) {
      alert('Chat ID not found for download.');
      return;
    }
    try {
      const res = await fetch(`${API_BASE_URL}/chats/${chatId}/documents/${documentId}/download`, {
        headers: getAuthHeaders(),
      });
      if (!res.ok) {
        throw new Error("Download failed");
      }
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err: any) {
      console.error('Download error:', err);
      alert('Failed to download document: ' + err.message);
    }
  };

  // Handle document view
  const handleView = async (documentId: string, filename: string) => {
    // Get chatId from createdChat or selectedSession
    const chatId = createdChat?.id || selectedSession?.chat_id;
    if (!chatId) {
      alert('Chat ID not found for view.');
      return;
    }
    try {
      const res = await fetch(`${API_BASE_URL}/chats/${chatId}/documents/${documentId}/download`, {
        headers: getAuthHeaders(),
      });
      if (!res.ok) {
        throw new Error("View failed");
      }
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      setPdfUrl(url);
      setPdfFilename(filename);
      setPdfModalOpen(true);
    } catch (err: any) {
      console.error('View error:', err);
      alert('Failed to view document: ' + err.message);
    }
  };

  const handleClosePdfModal = () => {
    setPdfModalOpen(false);
    if (pdfUrl) {
      window.URL.revokeObjectURL(pdfUrl);
      setPdfUrl("");
    }
    setPdfFilename("");
  };

  // Step 1: Create Chat handler
  const handleCreateChat = async (e: React.FormEvent) => {
    e.preventDefault();
    setNewChatError(null);
    setNewChatSuccess(false);
    setNewChatLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/chats`, {
        method: "POST",
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newChatName,
          description: newChatDescription,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.detail?.[0]?.msg || "Failed to create chat");
      }
      const data = await res.json();
      setCreatedChat(data);
      setNewChatSuccess(true);
      setNewAnalysisStep('upload');
    } catch (err: any) {
      setNewChatError(err.message || "An error occurred while creating chat.");
    } finally {
      setNewChatLoading(false);
    }
  };

  // Timeline/collapsible logic for new analysis flow
  const steps = [
    { key: 'create', label: 'Create Chat' },
    { key: 'upload', label: 'Upload Documents' },
    { key: 'select', label: 'Select Documents & Start Session' },
    { key: 'chat', label: 'Chat' },
  ];
  const currentStepIndex = createdSession ? 3 : (sessionSuccess ? 2 : (uploadSuccess ? 1 : 0));
  const [collapsedSteps, setCollapsedSteps] = useState<{[key: string]: boolean}>({});
  const handleToggleStep = (key: string) => {
    setCollapsedSteps(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Determine current step for timeline
  const getCurrentStep = () => {
    if (tab === 'new') {
      if (selectedSession) return "conversation";
      if (apiResult) return "communication";
      return "upload";
    } else {
      if (selectedSession) return "conversation";
      if (selectedChat) return "sessions";
      return "chats";
    }
  };

  const handleSendChatMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Determine which chat and session to use based on current flow
    const chatId = createdChat?.id || selectedChat?.id;
    const sessionId = createdSession?.id || selectedSession?.id;
    
    if (!chatId || !sessionId || !chatInput.trim()) {
      return;
    }
    
    setChatError(null);
    setChatLoading(true);
    const userMsg = chatInput;
    setChatInput("");
    setChatMessages(prev => [
      ...prev,
      { sender: "user", text: userMsg, time: new Date() },
    ]);
    
    try {
      const res = await fetch(`${API_BASE_URL}/chats/${chatId}/sessions/${sessionId}/messages`, {
        method: 'POST',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMsg }),
      });
      
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.detail?.[0]?.msg || 'Failed to send message');
      }
      
      const data = await res.json();
      
      // Handle different response formats
      const assistantResponse = data.assistant_response || data.response || data.message || 'No response received';
      const timestamp = data.timestamp || new Date().toISOString();
      
      setChatMessages(prev => [
        ...prev,
        { sender: "system", text: assistantResponse, time: new Date(timestamp) },
      ]);
      
      // Update session message count if we're in history flow
      if (selectedSession) {
        setSelectedSession(prev => prev ? {
          ...prev,
          message_count: prev.message_count + 1,
          last_activity: new Date().toISOString()
        } : null);
      }
    } catch (err: any) {
      setChatError(err.message || 'An error occurred while sending message.');
      setChatMessages(prev => [
        ...prev,
        { sender: "system", text: "(Error) " + (err.message || "An error occurred during chat."), time: new Date() },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  // Fetch chat documents
  const fetchChatDocuments = async (chatId: string) => {
    if (!chatId) return;
    setChatDocumentsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/chats/${chatId}/documents`, {
        headers: getAuthHeaders(),
      });
      if (!res.ok) {
        throw new Error('Failed to fetch chat documents');
      }
      const data = await res.json();
      setChatDocuments(data.documents || []);
    } catch (err: any) {
      console.error('Error fetching chat documents:', err);
    } finally {
      setChatDocumentsLoading(false);
    }
  };

  // Fetch session documents
  const fetchSessionDocuments = async (chatId: string, sessionId: string) => {
    if (!chatId || !sessionId) return;
    setSessionDocumentsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/chats/${chatId}/sessions/${sessionId}/documents`, {
        headers: getAuthHeaders(),
      });
      if (!res.ok) {
        throw new Error('Failed to fetch session documents');
      }
      const data = await res.json();
      
      // Handle different response formats
      if (Array.isArray(data)) {
        setSessionDocuments(data);
      } else if (typeof data === 'string') {
        // If it's a single document ID string, we'll filter from chat documents
        const sessionDoc = chatDocuments.find(doc => doc.id === data);
        setSessionDocuments(sessionDoc ? [sessionDoc] : []);
      } else if (data && typeof data === 'object' && data.documents) {
        // If it's an object with documents array
        setSessionDocuments(data.documents);
      } else {
        // Default to empty array
        setSessionDocuments([]);
      }
    } catch (err: any) {
      console.error('Error fetching session documents:', err);
      setSessionDocuments([]);
    } finally {
      setSessionDocumentsLoading(false);
    }
  };

  const handleDeleteDocument = async (documentId: string, context: 'chat' | 'session') => {
    if (!createdChat?.id && !selectedSession?.chat_id) return;
    let chatId = createdChat?.id || selectedSession?.chat_id;
    let sessionId = createdSession?.id || selectedSession?.id;

    if (!chatId) return;

    const confirmDelete = window.confirm('Are you sure you want to delete this document?');
    if (!confirmDelete) return;

    try {
      let url = '';
      if (context === 'chat') {
        url = `${API_BASE_URL}/chats/${chatId}/documents/${documentId}`;
      } else if (context === 'session' && sessionId) {
        url = `${API_BASE_URL}/chats/${chatId}/sessions/${sessionId}/documents/${documentId}`;
      } else {
        return;
      }
      const res = await fetch(url, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.detail?.[0]?.msg || 'Failed to delete document');
      }
      // Refresh document lists after delete
      await fetchChatDocuments(chatId);
      if (sessionId) await fetchSessionDocuments(chatId, sessionId);
    } catch (err: any) {
      alert(err.message || 'Failed to delete document');
    }
  };

  const handleAddToSession = async (documentIds: string[]) => {
    if (!createdChat?.id && !selectedSession?.chat_id) return;
    let chatId = createdChat?.id || selectedSession?.chat_id;
    let sessionId = createdSession?.id || selectedSession?.id;
    if (!chatId || !sessionId) return;
    try {
      for (const docId of documentIds) {
        const url = `${API_BASE_URL}/chats/${chatId}/sessions/${sessionId}/documents/${docId}`;
        const res = await fetch(url, {
          method: 'PUT',
          headers: getAuthHeaders(),
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err?.detail?.[0]?.msg || 'Failed to add document to session');
        }
      }
      // Refresh session documents after adding
      await fetchSessionDocuments(chatId, sessionId);
      setAddToSessionSuccessTrigger(t => t + 1);
      toast({ title: 'Added to session', description: 'Document(s) added to session context.' });
    } catch (err: any) {
      alert(err.message || 'Failed to add document to session');
    }
  };

  const handleUploadNewDocuments = async (files: FileList) => {
    if (!createdChat?.id && !selectedSession?.chat_id) return;
    let chatId = createdChat?.id || selectedSession?.chat_id;
    let sessionId = createdSession?.id || selectedSession?.id;
    if (!chatId || !sessionId) return;
    setUploadingNewDocuments(true);
    try {
      // Upload files to chat
      const formData = new FormData();
      Array.from(files).forEach(file => formData.append('files', file));
      const headers = { ...getAuthHeaders() };
      if ('Content-Type' in headers) delete headers['Content-Type'];
      const res = await fetch(`${API_BASE_URL}/chats/${chatId}/documents`, {
        method: 'POST',
        headers,
        body: formData,
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.detail?.[0]?.msg || 'Failed to upload documents');
      }
      const data = await res.json();
      const uploadedDocs = data.uploaded_documents || [];
      // Add each uploaded doc to session context
      for (const doc of uploadedDocs) {
        const putRes = await fetch(`${API_BASE_URL}/chats/${chatId}/sessions/${sessionId}/documents/${doc.id}`, {
          method: 'PUT',
          headers: getAuthHeaders(),
        });
        if (!putRes.ok) {
          const err = await putRes.json().catch(() => ({}));
          throw new Error(err?.detail?.[0]?.msg || 'Failed to add document to session');
        }
      }
      await fetchChatDocuments(chatId);
      await fetchSessionDocuments(chatId, sessionId);
      toast({ title: 'Documents uploaded', description: 'New documents added to chat and session context.' });
    } catch (err: any) {
      toast({ title: 'Upload failed', description: err.message || 'Failed to upload documents', variant: 'destructive' });
    } finally {
      setUploadingNewDocuments(false);
    }
  };

  const chatSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (uploadSuccess) {
      setCollapsedSteps(prev => ({ ...prev, upload: true }));
    }
  }, [uploadSuccess]);

  useEffect(() => {
    if (sessionSuccess) {
      setCollapsedSteps(prev => ({ ...prev, select: true, chat: false }));
    }
  }, [sessionSuccess]);

  // Removed unnecessary fetchChatDocuments call for new analysis flow
  // We only need to fetch documents after session creation

  useEffect(() => {
    if (createdChat?.id && createdSession?.id) {
      fetchSessionDocuments(createdChat.id, createdSession.id);
    }
  }, [createdChat?.id, createdSession?.id]);

  return (
    <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 md:px-8 py-4 flex flex-col gap-4 sm:gap-6 min-h-screen">
      <Tabs value={tab} onValueChange={(value) => {
        const newTab = value as 'new' | 'history';
        setTab(newTab);
        if (newTab === 'new') {
          setProcessing(false);
          setApiResult(null);
          setApiError(null);
          setChatMessages([]); // Clear old chat history
          setChatInput(""); // Clear old input
          setChatLoading(false); // Clear old loading state
          setChatError(null); // Clear old error state
          setSessionId(null);
          setDocumentId(null);
          setChatInput("");
        }
      }} className="w-full">
        <TabsList className="grid w-full grid-cols-2 h-auto">
          <TabsTrigger value="new" className="text-sm py-2 px-2 sm:px-4">New Analysis</TabsTrigger>
          <TabsTrigger value="history" className="text-sm py-2 px-2 sm:px-4">History</TabsTrigger>
        </TabsList>

        <TabsContent value="new" className="space-y-6 flex-1">
          {/* Timeline Indicator */}
          {/* <TimelineIndicator 
            currentStep={getCurrentStep()}
            selectedDocument={selectedDocument?.filename}
            selectedChat={selectedSession?.session_id}
          /> */}

          {/* Document Upload Section */}
          {/* <CollapsibleSection
            title="Upload Document"
            isCollapsed={uploadCollapsed}
            onToggle={setUploadCollapsed}
          >
            <DocumentUploader
              file={file}
              onProcess={handleProcess}
              processing={processing}
              error={apiError}
            />
          </CollapsibleSection> */}
          
          {/* Chat Interface for New Analysis - Show when document is processed */}
          {apiResult && (
            <Card className="w-full flex-1 min-h-[500px] flex flex-col">
              {/* Document Header for New Analysis */}
              <CardHeader className="border-b">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg break-words truncate">{apiResult.filename}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      Document processed successfully • {apiResult.total_tokens} tokens • {apiResult.total_chunks} chunks
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Badge variant="secondary" className="text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20">
                      Ready for chat
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              
              {/* Chat Interface - Full width */}
              <CardContent className="flex-1 p-0">
                <ChatInterface
                  chat={chatMessages}
                  onSend={handleSend}
                  input={chatInput}
                  setInput={setChatInput}
                  loading={chatLoading}
                  streaming={streaming}
                  streamedText={streamedText}
                  error={chatError}
                  disabled={chatLoading || streaming}
                  continuingSession={false}
                  onDeleteDocument={handleDeleteDocument}
                />
              </CardContent>
            </Card>
          )}

          {tab === 'new' && (
            <div className="w-full">
              {/* Timeline */}
              <div className="flex w-full justify-between items-center mb-6">
                {steps.map((step, idx) => (
                  <React.Fragment key={step.key}>
                    <div
                      className={`flex flex-col items-center flex-1 min-w-0 ${
                        idx < currentStepIndex
                          ? 'text-primary'
                          : idx === currentStepIndex
                          ? 'font-bold text-primary'
                          : 'text-muted-foreground'
                      }`}
                      style={{ minWidth: 0 }}
                    >
                      <div
                        className={`rounded-full w-9 h-9 flex items-center justify-center mb-1 border-2 transition-colors
                          ${
                            idx < currentStepIndex
                              ? 'bg-primary text-white border-primary'
                              : idx === currentStepIndex
                              ? 'bg-primary/80 text-black dark:text-black border-primary'
                              : 'bg-muted text-black dark:text-white border-border'
                          }
                        `}
                      >
                        {idx < currentStepIndex ? (
                          <Check className="w-5 h-5 text-white dark:text-black" />
                        ) : (
                          idx + 1
                        )}
                      </div>
                      <span className="text-xs text-center break-words w-full max-w-[80px]">{step.label}</span>
                    </div>
                    {idx < steps.length - 1 && (
                      <div
                        className="flex-1 h-1 mx-1 transition-colors"
                        style={{
                          background:
                            idx < currentStepIndex
                              ? 'var(--tw-prose-bold, hsl(var(--primary)))'
                              : 'hsl(var(--border))',
                          opacity: idx < currentStepIndex ? 1 : 0.5,
                        }}
                      />
                    )}
                  </React.Fragment>
                ))}
              </div>

              {/* Step 1: Create Chat */}
              <CollapsibleSection
                title="1. Create Chat"
                isCollapsed={currentStepIndex > 0 && collapsedSteps['create'] !== false}
                onToggle={() => handleToggleStep('create')}
                className="w-full"
              >
                {newAnalysisStep === 'create' && !createdChat && (
                  <div className="max-w-2xl w-full mx-auto">
                    <Card className="w-full hover:scale-[1.02] hover:shadow-xl transition-transform duration-200">
                      <CardHeader className="text-center pb-6">
                        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                          <MessageCircle className="w-8 h-8 text-white" />
                        </div>
                        <CardTitle className="text-2xl font-bold mb-2">Start a New Analysis</CardTitle>
                        <p className="text-muted-foreground">Create a new chat to begin your document analysis workflow</p>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <form onSubmit={handleCreateChat} className="space-y-6">
                          <div className="space-y-2">
                            <label htmlFor="chat-name" className="block text-sm font-semibold text-foreground">
                              <MessageCircle className="w-4 h-4 inline mr-2" />
                              Chat Name
                            </label>
                            <input
                              id="chat-name"
                              type="text"
                              className="w-full rounded-lg border-2 border-input bg-background px-4 py-3 text-base text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-all duration-200"
                              placeholder="Enter a descriptive name for this analysis"
                              value={newChatName}
                              onChange={e => setNewChatName(e.target.value)}
                              required
                              maxLength={64}
                            />
                            <p className="text-xs text-muted-foreground">Choose a clear, descriptive name to help you identify this analysis later</p>
                          </div>
                          
                          <div className="space-y-2">
                            <label htmlFor="chat-desc" className="block text-sm font-semibold text-foreground">
                              <FileText className="w-4 h-4 inline mr-2" />
                              Description
                            </label>
                            <textarea
                              id="chat-desc"
                              className="w-full rounded-lg border-2 border-input bg-background px-4 py-3 text-base text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 min-h-[100px] resize-y transition-all duration-200"
                              placeholder="Describe the purpose, scope, or specific questions you want to analyze..."
                              value={newChatDescription}
                              onChange={e => setNewChatDescription(e.target.value)}
                              maxLength={256}
                            />
                            <div className="flex justify-between items-center">
                              <p className="text-xs text-muted-foreground">Optional: Provide context about your analysis goals</p>
                              <span className="text-xs text-muted-foreground">{newChatDescription.length}/256</span>
                            </div>
                          </div>

                          {/* Status Messages */}
                          {newChatError && (
                            <div className="bg-destructive/10 border border-destructive/20 text-destructive rounded-lg px-4 py-3 text-sm flex items-center gap-2">
                              <AlertTriangle className="w-4 h-4" />
                              {newChatError}
                            </div>
                          )}
                          
                          {newChatSuccess && (
                            <div className="bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 rounded-lg px-4 py-3 text-sm flex items-center gap-2">
                              <Check className="w-4 h-4" />
                              Chat created successfully! Ready to upload documents.
                            </div>
                          )}

                          {/* Action Button */}
                          <Button
                            type="submit"
                            className="w-full py-3 text-base font-semibold hover:scale-[1.02] hover:shadow-lg transition-all duration-200"
                            disabled={newChatLoading || !newChatName.trim()}
                          >
                            {newChatLoading ? (
                              <div className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Creating Chat...
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                <Plus className="w-4 h-4" />
                                Create Chat
                              </div>
                            )}
                          </Button>
                        </form>

                        {/* Quick Tips */}
                        <div className="mt-6 pt-6 border-t border-border">
                          <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                            <Settings className="w-4 h-4" />
                            Quick Tips
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="flex items-start gap-2 text-xs text-muted-foreground">
                              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
                              <span>Use descriptive names like "Contract Review Q1 2024"</span>
                            </div>
                            <div className="flex items-start gap-2 text-xs text-muted-foreground">
                              <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-1.5 flex-shrink-0"></div>
                              <span>Add context about your analysis goals</span>
                            </div>
                            <div className="flex items-start gap-2 text-xs text-muted-foreground">
                              <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 flex-shrink-0"></div>
                              <span>You can upload multiple documents per chat</span>
                            </div>
                            <div className="flex items-start gap-2 text-xs text-muted-foreground">
                              <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-1.5 flex-shrink-0"></div>
                              <span>Create multiple sessions for different analysis topics</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </CollapsibleSection>

              {/* Step 2: Upload Documents */}
              <CollapsibleSection
                title="2. Upload Documents"
                isCollapsed={currentStepIndex > 1 && collapsedSteps['upload'] !== false}
                onToggle={() => handleToggleStep('upload')}
                className="w-full"
              >
                {newAnalysisStep === 'upload' && createdChat && (
                  <div className="w-full max-w-3xl mx-auto">
                    <Card className="w-full hover:scale-[1.02] hover:shadow-xl transition-transform duration-200">
                      <CardHeader className="text-center pb-6">
                        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                          <FileUp className="w-8 h-8 text-white" />
                        </div>
                        <CardTitle className="text-2xl font-bold mb-2">Upload Documents</CardTitle>
                        <p className="text-muted-foreground">Add one or more documents to your analysis chat</p>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <form onSubmit={handleUploadDocuments} className="space-y-6">
                          {/* File Upload Area */}
                          <div className="space-y-4">
                            <label htmlFor="doc-upload" className="block text-sm font-semibold text-foreground">
                              <Upload className="w-4 h-4 inline mr-2" />
                              Select Documents
                            </label>
                            
                            {/* Modern File Upload Area */}
                            <div className="relative">
                              <input
                                id="doc-upload"
                                type="file"
                                multiple
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                onChange={handleFileChange}
                                disabled={uploading}
                                accept=".pdf,.doc,.docx,.txt,.rtf"
                              />
                              <div className="border-2 border-dashed border-input rounded-lg p-8 text-center hover:border-primary transition-colors duration-200 bg-muted/30">
                                <FileUp className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                                <p className="text-lg font-medium mb-2">Drop files here or click to browse</p>
                                <p className="text-sm text-muted-foreground mb-4">
                                  Supports PDF, DOC, DOCX, TXT, RTF files
                                </p>
                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium">
                                  <Upload className="w-4 h-4" />
                                  Choose Files
                                </div>
                              </div>
                            </div>

                            {/* Selected Files Preview */}
                            {uploadFiles.length > 0 && (
                              <div className="space-y-3">
                                <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                                  <FileText className="w-4 h-4" />
                                  Selected Files ({uploadFiles.length})
                                </h4>
                                <div className="grid gap-2">
                                  {uploadFiles.map((file, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-3 bg-muted rounded-lg border border-border hover:bg-muted/80 transition-colors">
                                      <div className="flex items-center gap-3 flex-1 min-w-0">
                                        <FileText className="w-5 h-5 text-primary flex-shrink-0" />
                                        <div className="flex-1 min-w-0">
                                          <p className="text-sm font-medium truncate" title={file.name}>{file.name}</p>
                                          <p className="text-xs text-muted-foreground">
                                            {(file.size / 1024).toFixed(1)} KB
                                          </p>
                                        </div>
                                      </div>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setUploadFiles(prev => prev.filter((_, i) => i !== idx));
                                        }}
                                        className="p-1 hover:bg-destructive/10 rounded-full transition-colors"
                                      >
                                        <X className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Status Messages */}
                          {uploadError && (
                            <div className="bg-destructive/10 border border-destructive/20 text-destructive rounded-lg px-4 py-3 text-sm flex items-center gap-2">
                              <AlertTriangle className="w-4 h-4" />
                              {uploadError}
                            </div>
                          )}
                          
                          {uploadSuccess && (
                            <div className="bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 rounded-lg px-4 py-3 text-sm flex items-center gap-2">
                              <CheckCircle className="w-4 h-4" />
                              Documents uploaded successfully! Ready to create session.
                            </div>
                          )}

                          {/* Upload Button */}
                          <Button
                            type="submit"
                            className="w-full py-3 text-base font-semibold hover:scale-[1.02] hover:shadow-lg transition-all duration-200"
                            disabled={uploading || uploadFiles.length === 0}
                          >
                            {uploading ? (
                              <div className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Uploading Documents...
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                <Upload className="w-4 h-4" />
                                Upload Documents
                              </div>
                            )}
                          </Button>
                        </form>

                        {/* Uploaded Documents List */}
                        {uploadedDocs.length > 0 && (
                          <div className="mt-8 pt-6 border-t border-border">
                            <h3 className="text-lg font-semibold mb-4 text-foreground flex items-center gap-2">
                              <CheckCircle className="w-5 h-5 text-green-500" />
                              Uploaded Documents ({uploadedDocs.length})
                            </h3>
                            <div className="grid gap-3">
                              {uploadedDocs.map((doc, idx) => (
                                <div key={doc.id || idx} className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg border border-border hover:bg-muted transition-colors">
                                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <FileText className="w-5 h-5 text-white" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="font-medium text-sm truncate" title={doc.filename}>{doc.filename}</p>
                                    <div className="flex items-center gap-4 mt-1">
                                      <span className="text-xs text-muted-foreground">
                                        {doc.file_size ? (doc.file_size / 1024).toFixed(1) + ' KB' : 'Unknown size'}
                                      </span>
                                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        {doc.processing_status || 'Processing...'}
                                      </span>
                                    </div>
                                  </div>
                                  <Badge variant="secondary" className="flex-shrink-0">
                                    Ready
                                  </Badge>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Upload Tips */}
                        <div className="mt-6 pt-6 border-t border-border">
                          <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                            <Settings className="w-4 h-4" />
                            Upload Tips
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="flex items-start gap-2 text-xs text-muted-foreground">
                              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
                              <span>Maximum file size: 10MB per document</span>
                            </div>
                            <div className="flex items-start gap-2 text-xs text-muted-foreground">
                              <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-1.5 flex-shrink-0"></div>
                              <span>Supported formats: PDF, DOC, DOCX, TXT, RTF</span>
                            </div>
                            <div className="flex items-start gap-2 text-xs text-muted-foreground">
                              <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 flex-shrink-0"></div>
                              <span>You can upload multiple files at once</span>
                            </div>
                            <div className="flex items-start gap-2 text-xs text-muted-foreground">
                              <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-1.5 flex-shrink-0"></div>
                              <span>Documents are processed automatically after upload</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </CollapsibleSection>

              {/* Step 3: Select Documents & Start Session */}
              <CollapsibleSection
                title="3. Select Documents & Start Session"
                isCollapsed={currentStepIndex > 2 && collapsedSteps['select'] !== false}
                onToggle={() => handleToggleStep('select')}
                className="w-full"
              >

                {newAnalysisStep === 'upload' && createdChat && uploadedDocs.length > 0 && (
                  <div className="w-full max-w-2xl mx-auto mt-8">
                    <Card className="w-full">
                      <CardHeader>
                        <CardTitle>Select Documents & Start Session</CardTitle>
                        <p className="text-muted-foreground text-sm">Select one or more documents and start a chat session for analysis.</p>
                      </CardHeader>
                      <CardContent>
                        <form onSubmit={handleCreateSession} className="space-y-4">
                          <div className="space-y-2">
                            {uploadedDocs.map(doc => (
                              <label key={doc.id} className="flex items-center gap-3 bg-muted rounded-lg px-3 py-2 cursor-pointer border border-border">
                                <input
                                  type="checkbox"
                                  checked={selectedDocIds.includes(doc.id)}
                                  onChange={() => handleToggleDoc(doc.id)}
                                  className="accent-primary w-5 h-5"
                                />
                                <span className="break-all flex-1 text-sm text-foreground">{doc.filename}</span>
                                <span className="text-xs text-muted-foreground">{doc.file_size ? (doc.file_size / 1024).toFixed(1) + ' KB' : ''}</span>
                              </label>
                            ))}
                          </div>
                          <div>
                            <label htmlFor="session-name" className="block text-sm font-medium mb-1">Session Name</label>
                            <input
                              id="session-name"
                              type="text"
                              className="w-full rounded-lg border border-border bg-background px-4 py-3 text-base text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                              placeholder="Enter a name for this session"
                              value={sessionName}
                              onChange={e => setSessionName(e.target.value)}
                              required
                              maxLength={64}
                            />
                          </div>
                          {sessionError && (
                            <div className="bg-red-900/80 text-red-200 rounded-lg px-4 py-3 text-center text-sm border border-red-700/50 shadow-lg">{sessionError}</div>
                          )}
                          {sessionSuccess && (
                            <div className="bg-green-900/80 text-green-200 rounded-lg px-4 py-3 text-center text-sm border border-green-700/50 shadow-lg">Session created successfully!</div>
                          )}
                          <button
                            type="submit"
                            className="w-full py-3 rounded-lg bg-white text-black border border-border font-semibold hover:bg-gray-100 transition-colors disabled:opacity-60"
                            disabled={sessionLoading || selectedDocIds.length === 0 || !sessionName.trim()}
                          >
                            {sessionLoading ? 'Creating Session...' : 'Start Session'}
                          </button>
                        </form>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </CollapsibleSection>

              {/* Step 4: Chat */}
              <CollapsibleSection
                title="4. Chat"
                isCollapsed={currentStepIndex < 3 || collapsedSteps['chat'] === true}
                onToggle={() => handleToggleStep('chat')}
                className="w-full"
              >
                {createdSession && (
                  <div className="w-full mx-auto mt-8">
                    <h3 className="text-lg font-bold mb-2 text-foreground">4. Chat</h3>
                    <ChatInterface
                      chat={chatMessages}
                      onSend={handleSendChatMessage}
                      input={chatInput}
                      setInput={setChatInput}
                      loading={chatLoading}
                      streaming={false}
                      streamedText={""}
                      error={chatError}
                      disabled={chatLoading}
                      continuingSession={true}
                      continuingSessionId={createdSession.id}
                      chatDocuments={chatDocuments}
                      sessionDocuments={sessionDocuments}
                      chatId={createdChat?.id}
                      sessionId={createdSession?.id}
                      onViewDocument={handleView}
                      onDownloadDocument={handleDownload}
                      onDeleteDocument={handleDeleteDocument}
                      onAddToSession={handleAddToSession}
                      addToSessionSuccessTrigger={addToSessionSuccessTrigger}
                      onUploadNewDocuments={handleUploadNewDocuments}
                      uploadingNewDocuments={uploadingNewDocuments}
                    />
                  </div>
                )}
              </CollapsibleSection>
            </div>
          )}
        </TabsContent>

        <TabsContent value="history" className="flex flex-col gap-6 flex-1">
          {/* Timeline Indicator */}
          {/* <TimelineIndicator 
            currentStep={getCurrentStep()}
            selectedChat={selectedChat?.name}
            selectedSession={selectedSession?.name}
          /> */}

          {/* Chats Section - Always visible at top */}
          <CollapsibleSection
            title="Chats"
            isCollapsed={documentsCollapsed}
            onToggle={setDocumentsCollapsed}
          >
            {chatsLoading ? (
              <Alert>
                <AlertDescription>Loading chats...</AlertDescription>
              </Alert>
            ) : chatsError ? (
              <Alert variant="destructive">
                <AlertDescription>{chatsError}</AlertDescription>
              </Alert>
            ) : (
              <ChatList
                chats={chats}
                onSelect={handleSelectChat}
                page={chatPage}
                pageSize={chatPageSize}
                totalCount={chatTotalCount}
                onPageChange={setChatPage}
                loading={chatsLoading}
              />
            )}
          </CollapsibleSection>

          {/* Sessions Section - Appears when chat is selected */}
          {selectedChat && (
            <div ref={chatSectionRef}>
              <CollapsibleSection
                title={`Sessions - ${selectedChat.name.length > 20 ? selectedChat.name.substring(0, 20) + '...' : selectedChat.name}`}
                isCollapsed={sessionsCollapsed}
                onToggle={setSessionsCollapsed}
              >
                {sessionsLoading ? (
                  <Alert>
                    <AlertDescription>Loading sessions...</AlertDescription>
                  </Alert>
                ) : sessionsError ? (
                  <Alert variant="destructive">
                    <AlertDescription>{sessionsError}</AlertDescription>
                  </Alert>
                ) : (
                  <SessionList
                    sessions={sessions}
                    onSelect={handleSelectSession}
                    page={sessionPage}
                    pageSize={sessionPageSize}
                    totalCount={sessionTotalCount}
                    onPageChange={setSessionPage}
                    loading={sessionsLoading}
                    selectedChatName={selectedChat.name}
                  />
                )}
              </CollapsibleSection>
            </div>
          )}

          {/* Chat Interface - Takes full width at bottom */}
          {selectedSession && (
            <Card className="w-full flex-1 min-h-[500px] flex flex-col">
              {/* Session Header */}
              <CardHeader className="border-b">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg break-words truncate">{selectedSession.name}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      Session: {selectedSession.id.slice(0, 8)}... • {selectedSession.message_count} messages
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Badge variant={selectedSession.is_active ? "default" : "secondary"}>
                      {selectedSession.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              
              {/* Chat Interface - Full width */}
              <CardContent className="flex-1 p-0">
                <ChatInterface
                  chat={chatMessages}
                  onSend={handleSendChatMessage}
                  input={chatInput}
                  setInput={setChatInput}
                  loading={chatLoading}
                  streaming={streaming}
                  streamedText={streamedText}
                  error={chatError}
                  disabled={chatLoading || streaming}
                  continuingSession={true}
                  continuingSessionId={selectedSession.id}
                  chatDocuments={chatDocuments}
                  sessionDocuments={sessionDocuments}
                  chatId={selectedSession?.chat_id}
                  sessionId={selectedSession?.id}
                  onViewDocument={handleView}
                  onDownloadDocument={handleDownload}
                  onDeleteDocument={handleDeleteDocument}
                  onAddToSession={handleAddToSession}
                  addToSessionSuccessTrigger={addToSessionSuccessTrigger}
                  onUploadNewDocuments={handleUploadNewDocuments}
                  uploadingNewDocuments={uploadingNewDocuments}
                />
              </CardContent>
            </Card>
          )}

          {/* Empty State when no session is selected */}
          {selectedChat && !selectedSession && (
            <Card className="w-full flex items-center justify-center py-12">
              <CardContent className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                  <MessageCircle className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Select a Session</h3>
                <p className="text-sm text-muted-foreground">Choose a session from the list above to start conversing</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* PDF Viewer Modal */}
      <PdfViewerModal
        isOpen={pdfModalOpen}
        onClose={handleClosePdfModal}
        pdfUrl={pdfUrl}
        filename={pdfFilename}
      />
    </div>
  );
} 