import React, { useRef, useEffect } from "react";
import { Send, Paperclip, Mic, Search, Zap, Eye, FileText, Download, Eye as EyeIcon } from "lucide-react";
import SimpleMarkdownRenderer from "../../../components/SimpleMarkdownRenderer";

function formatTime(date: Date) {
 return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

interface ChatMessage {
 sender: string;
 text: string;
 time: Date;
}

interface ChatDocument {
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

interface SessionDocument {
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

interface ChatInterfaceProps {
 chat: ChatMessage[];
 onSend: (e: React.FormEvent) => void;
 input: string;
 setInput: (val: string) => void;
 loading: boolean;
 streaming: boolean;
 streamedText: string;
 error?: string | null;
 disabled?: boolean;
 continuingSession?: boolean;
 continuingSessionId?: string;
 chatDocuments?: ChatDocument[];
 sessionDocuments?: SessionDocument[];
 chatId?: string;
 sessionId?: string;
 onViewDocument?: (documentId: string, filename: string) => void;
 onDownloadDocument?: (documentId: string, filename: string) => void;
 onDeleteDocument?: (documentId: string, context: 'chat' | 'session') => void;
 onAddToSession?: (documentIds: string[]) => void;
 addToSessionSuccessTrigger?: number;
 onUploadNewDocuments?: (files: FileList) => void;
 uploadingNewDocuments?: boolean;
 userInitial?: string;
}

export default function ChatInterface({ 
 chat, 
 onSend, 
 input, 
 setInput, 
 loading, 
 streaming, 
 streamedText, 
 error, 
 disabled, 
 continuingSession, 
 continuingSessionId,
 chatDocuments = [],
 sessionDocuments = [],
 chatId,
 sessionId,
 onViewDocument,
 onDownloadDocument,
 onDeleteDocument,
 onAddToSession,
 addToSessionSuccessTrigger,
 onUploadNewDocuments,
 uploadingNewDocuments,
 userInitial = "U"
}: ChatInterfaceProps) {
 const chatEndRef = useRef<HTMLDivElement>(null);
 const inputRef = useRef<HTMLInputElement>(null);
 const [selectedForSession, setSelectedForSession] = React.useState<string[]>([]);
 const fileInputRef = React.useRef<HTMLInputElement>(null);

 React.useEffect(() => {
 setSelectedForSession([]);
 }, [addToSessionSuccessTrigger]);

 useEffect(() => {
 chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
 }, [chat, loading, streaming, streamedText]);

 const handleSubmit = (e: React.FormEvent) => {
 e.preventDefault();
 if (!input.trim() || disabled) {
 return;
 }
 onSend(e);
 };

 const formatFileSize = (bytes: number) => {
 if (bytes === 0) return '0 Bytes';
 const k = 1024;
 const sizes = ['Bytes', 'KB', 'MB', 'GB'];
 const i = Math.floor(Math.log(bytes) / Math.log(k));
 return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
 };

 return (
 <div className="flex h-full gap-4">
 {/* Left Side - Chat Documents */}
 <div className="w-64 bg-card rounded-lg border border-border p-4 flex flex-col">
 <div className="flex items-center gap-2 mb-4 pb-2 border-b border-border">
 <FileText className="w-4 h-4 text-muted-foreground" />
 <h3 className="text-sm font-semibold text-foreground">Chat Documents</h3>
 <span className="ml-auto text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
 {chatDocuments.length}
 </span>
 </div>
 
 <div className="flex-1 overflow-y-auto space-y-2">
 {!Array.isArray(chatDocuments) || chatDocuments.length === 0 ? (
 <div className="text-center text-muted-foreground text-sm py-8">
 <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
 <p>No documents in chat</p>
 </div>
 ) : (
 (chatDocuments as any[]).map((doc) => {
 const inSession = Array.isArray(sessionDocuments) && sessionDocuments.some(sdoc => sdoc.id === doc.id);
 return (
 <div
 key={doc.id}
 className="p-3 bg-muted/80 rounded-lg border border-border hover:bg-accent transition-colors"
 >
 <div className="flex items-start justify-between mb-2">
 <h4 className="text-sm font-medium text-foreground truncate flex-1">
 {doc.filename}
 </h4>
 {/* Checkbox for eligible docs */}
 {!inSession && onAddToSession && (
 <input
 type="checkbox"
 className="form-checkbox accent-primary w-4 h-4 ml-2"
 checked={selectedForSession.includes(doc.id)}
 onChange={e => {
 if (e.target.checked) {
 setSelectedForSession(prev => [...prev, doc.id]);
 } else {
 setSelectedForSession(prev => prev.filter(id => id !== doc.id));
 }
 }}
 title="Select to add to session"
 />
 )}
 </div>
 <div className="flex items-center gap-3 mt-2">
 {onViewDocument && (
 <button
 onClick={() => onViewDocument(doc.id, doc.filename)}
 className="p-1 text-muted-foreground hover:text-foreground transition-colors"
 title="View document"
 >
 <EyeIcon className="w-4 h-4" />
 </button>
 )}
 {onDownloadDocument && (
 <button
 onClick={() => onDownloadDocument(doc.id, doc.filename)}
 className="p-1 text-muted-foreground hover:text-foreground transition-colors"
 title="Download document"
 >
 <Download className="w-4 h-4" />
 </button>
 )}
 {onDeleteDocument && (
 <button
 onClick={() => !inSession && onDeleteDocument(doc.id, 'chat')}
 className={`p-1 ${inSession ? 'text-muted-foreground cursor-not-allowed' : 'text-red-400 hover:text-red-600'} transition-colors`}
 title={inSession ? 'Cannot delete: document is in session context' : 'Delete document'}
 disabled={inSession}
 >
 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
 <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
 </svg>
 </button>
 )}
 </div>
 </div>
 );
 })
 )}
 {/* Add to session button */}
 {onAddToSession && selectedForSession.length > 0 && (
 <button
 className="mt-4 w-full py-2 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors disabled:opacity-60"
 onClick={() => onAddToSession(selectedForSession)}
 >
 Add to session
 </button>
 )}
 </div>
 </div>

 {/* Center - Chat Interface */}
 <div className="flex-1 flex flex-col">
 {/* Banner for continuing old chat */}
 {continuingSession && continuingSessionId && (
 <div className="mb-3 p-3 rounded-lg bg-muted border border-border text-foreground text-sm font-semibold text-center">
 Continuing previous chat session: <span className="font-mono text-muted-foreground">{continuingSessionId.slice(0, 8)}...</span>
 </div>
 )}

 {/* Scrollable Chat Area - Takes remaining space */}
 <div className="flex-1 overflow-y-auto bg-card rounded-lg p-4 transition-all border border-border">
 {chat.length === 0 && !loading && !streaming && (
 <div className="flex items-center justify-center h-full text-muted-foreground">
 <div className="text-center">
 <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center border border-border">
 <Search className="w-8 h-8 text-muted-foreground" />
 </div>
 <h3 className="text-lg font-semibold mb-2 text-foreground">Start a Conversation</h3>
 <p className="text-sm text-muted-foreground">Ask questions about your document to get started</p>
 </div>
 </div>
 )}
 
 {chat.map((msg, idx) => (
 <div
 key={idx}
 className={`mb-4 flex items-end gap-3 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
 >
 {msg.sender === "system" && (
 <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-sm border border-border">
 MJ
 </div>
 )}
 <div
 className={`px-4 py-3 rounded-2xl max-w-md text-sm shadow-lg transition-all duration-200 ${
 msg.sender === "user"
 ? "bg-primary text-primary-foreground rounded-br-md border border-primary"
 : "bg-muted text-foreground rounded-bl-md border border-border"
 }`}
 >
 <SimpleMarkdownRenderer content={msg.text} className="text-sm leading-relaxed" />
 </div>
 {msg.sender === "user" && (
 <div className="flex-shrink-0 w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold text-sm border border-border">
 {userInitial.toUpperCase()}
 </div>
 )}
 </div>
 ))}
 
 {/* Simulated streaming bubble */}
 {streaming && (
 <div className="mb-4 flex items-end gap-3 justify-start">
 <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-sm border border-border">
 MJ
 </div>
 <div className="px-4 py-3 rounded-2xl max-w-md text-sm bg-muted text-foreground shadow-lg border border-border rounded-bl-md">
 {streamedText ? (
 <SimpleMarkdownRenderer content={streamedText} className="text-sm leading-relaxed" />
 ) : (
 <span className="opacity-60">Typing...</span>
 )}
 <div className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
 <div className="flex gap-1">
 <div className="w-1 h-1 bg-muted-foreground rounded-full animate-bounce"></div>
 <div className="w-1 h-1 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
 <div className="w-1 h-1 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
 </div>
 </div>
 </div>
 </div>
 )}
 
 {loading && !streaming && (
 <div className="mb-4 flex items-end gap-3 justify-start">
 <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-sm border border-border">
 MJ
 </div>
 <div className="px-4 py-3 rounded-2xl max-w-md text-sm bg-muted text-foreground shadow-lg border border-border rounded-bl-md">
 <div className="flex items-center gap-2">
 <div className="w-4 h-4 border-2 border-muted-foreground border-t-transparent rounded-full animate-spin"></div>
 <span>Generating response...</span>
 </div>
 </div>
 </div>
 )}
 <div ref={chatEndRef} />
 </div>
 
 {/* Input Area - Fixed at bottom */}
 <div className="bg-card backdrop-blur-sm border-t border-border p-4 shadow-xl mt-4 rounded-lg relative">
 {/* Loader overlay when uploading */}
 {uploadingNewDocuments && (
 <div className="absolute inset-0 bg-background/80 flex flex-col items-center justify-center z-20 rounded-lg">
 <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-3"></div>
 <span className="text-foreground font-semibold">Uploading documents...</span>
 </div>
 )}
 <form onSubmit={handleSubmit} className="w-full">
 {/* Main Input Field */}
 <div className="relative mb-3">
 <input
 ref={inputRef}
 type="text"
 className="w-full px-4 py-4 pr-16 rounded-2xl bg-background border border-border focus:border-primary focus:outline-none text-foreground placeholder:text-muted-foreground text-base shadow-lg transition-all duration-200"
 placeholder="Ask a follow-up question..."
 value={input}
 onChange={e => setInput(e.target.value)}
 disabled={disabled}
 autoFocus
 />
 {/* Send Button */}
 <button
 type="submit"
 className="absolute right-2 top-1/2 transform -translate-y-1/2 p-3 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
 disabled={disabled || !input.trim()}
 >
 <Send className="w-5 h-5" />
 </button>
 </div>

 {/* Enhanced Icon Bar */}
 <div className="flex items-center justify-between px-2">
 {/* Left Group - Functionality Icons */}
 <div className="flex items-center gap-2">
 <button
 type="button"
 className="p-3 rounded-xl bg-muted hover:bg-accent text-muted-foreground hover:text-foreground transition-all duration-200 border border-border shadow-md hover:shadow-lg"
 title="Search"
 >
 <Search className="w-4 h-4" />
 </button>
 <button
 type="button"
 className="p-3 rounded-xl bg-muted hover:bg-accent text-muted-foreground hover:text-foreground transition-all duration-200 border border-border shadow-md hover:shadow-lg"
 title="Generate"
 >
 <Zap className="w-4 h-4" />
 </button>
 <button
 type="button"
 className="p-3 rounded-xl bg-muted hover:bg-accent text-muted-foreground hover:text-foreground transition-all duration-200 border border-border shadow-md hover:shadow-lg"
 title="Visual Search"
 >
 <Eye className="w-4 h-4" />
 </button> 
 </div>
 {/* Right Group - Action Icons */}
 <div className="flex items-center gap-2">
 {/* Upload icon */}
 <button
 type="button"
 className={`p-3 rounded-xl bg-muted hover:bg-accent ${uploadingNewDocuments ? 'opacity-60 cursor-wait' : 'text-muted-foreground hover:text-foreground'} transition-all duration-200 border border-border shadow-md hover:shadow-lg`}
 title="Upload new documents"
 onClick={() => !uploadingNewDocuments && fileInputRef.current?.click()}
 disabled={uploadingNewDocuments}
 >
 {uploadingNewDocuments ? (
 <span className="inline-block w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></span>
 ) : (
 <Paperclip className="w-4 h-4" />
 )}
 <input
 ref={fileInputRef}
 type="file"
 multiple
 className="hidden"
 onChange={e => {
 if (e.target.files && onUploadNewDocuments) {
 onUploadNewDocuments(e.target.files);
 e.target.value = '';
 }
 }}
 />
 </button>
 <button
 type="button"
 className="p-3 rounded-xl bg-muted hover:bg-accent text-muted-foreground hover:text-foreground transition-all duration-200 border border-border shadow-md hover:shadow-lg"
 title="Voice Input"
 >
 <Mic className="w-4 h-4" />
 </button>
 </div>
 </div>

 {/* Error Message */}
 {error && (
 <div className="mt-3 w-full bg-red-900/80 text-red-200 rounded-xl px-4 py-3 text-center text-sm border border-red-700/50 shadow-lg">
 {error}
 </div>
 )}
 </form>
 </div>
 </div>

 {/* Right Side - Session Documents */}
 <div className="w-64 bg-card rounded-lg border border-border p-4 flex flex-col">
 <div className="flex items-center gap-2 mb-4 pb-2 border-b border-border">
 <FileText className="w-4 h-4 text-muted-foreground" />
 <h3 className="text-sm font-semibold text-foreground">Session Context</h3>
 <span className="ml-auto text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
 {sessionDocuments.length}
 </span>
 </div>
 
 <div className="flex-1 overflow-y-auto space-y-2">
 {!Array.isArray(sessionDocuments) || sessionDocuments.length === 0 ? (
 <div className="text-center text-muted-foreground text-sm py-8">
 <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
 <p>No documents in context</p>
 </div>
 ) : (
 (sessionDocuments as any[]).map((doc) => (
 <div
 key={doc.id}
 className="p-3 bg-muted/80 rounded-lg border border-border hover:bg-accent transition-colors"
 >
 <div className="flex items-start justify-between mb-2">
 <h4 className="text-sm font-medium text-foreground truncate flex-1">
 {doc.filename}
 </h4>
 </div>
 <div className="flex items-center gap-3 mt-2">
 {onViewDocument && (
 <button
 onClick={() => onViewDocument(doc.id, doc.filename)}
 className="p-1 text-muted-foreground hover:text-foreground transition-colors"
 title="View document"
 >
 <EyeIcon className="w-4 h-4" />
 </button>
 )}
 {onDownloadDocument && (
 <button
 onClick={() => onDownloadDocument(doc.id, doc.filename)}
 className="p-1 text-muted-foreground hover:text-foreground transition-colors"
 title="Download document"
 >
 <Download className="w-4 h-4" />
 </button>
 )}
 {onDeleteDocument && (
 <button
 onClick={() => onDeleteDocument(doc.id, 'session')}
 className="p-1 text-red-400 hover:text-red-600 transition-colors"
 title="Delete document"
 >
 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
 <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
 </svg>
 </button>
 )}
 </div>
 </div>
 ))
 )}
 </div>
 </div>
 </div>
 );
} 