"use client";
import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  Loader2,
  Search,
  Shield,
  BookOpen,
  Copy,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  FileText,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useAuth } from "../../../components/AuthProvider";
import { toast } from "@/hooks/use-toast";
import SimpleMarkdownRenderer from "../../../components/SimpleMarkdownRenderer";
import {
  searchAgenticRAG,
  AgenticRAGSearchResponse,
  SearchResult,
} from "@/lib/agenticRagApi";
import { downloadLegalDocumentPDF } from "@/lib/legalResearchApi";
import { normalizeContentLineBreaks } from "@/lib/utils";

const RESULT_PREVIEW_LENGTH = 400;

function formatCourtTypeLabel(courtType: string): string {
  return courtType
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function getSourcesCollapsibleLabel(response: AgenticRAGSearchResponse): string {
  const n = response.results.length;
  if (
    response.query_type === "regulatory_query" ||
    response.rag_variant === "regulatory_compliance"
  ) {
    return `Reference links (${n})`;
  }
  return `Relevant cases (${n})`;
}

function filterNonEmptyStrings(items: string[] | undefined): string[] {
  if (!items || !Array.isArray(items)) return [];
  return items.map((s) => String(s).trim()).filter(Boolean);
}

interface ResultCardProps {
  result: SearchResult;
  index: number;
  onViewPdf: (result: SearchResult) => void;
  onDownloadPdf: (result: SearchResult) => void;
  pdfActionBusy: boolean;
}

function ResultCard({
  result,
  index,
  onViewPdf,
  onDownloadPdf,
  pdfActionBusy,
}: ResultCardProps) {
  const [expanded, setExpanded] = useState(false);
  const hasPdf = Boolean(result.metadata?.pdf_download_url);
  const isLong = result.content.length > RESULT_PREVIEW_LENGTH;
  const displayContent = isLong && !expanded
    ? result.content.slice(0, RESULT_PREVIEW_LENGTH) + "..."
    : result.content;
  const hasExcerpt = result.content.trim().length > 0;
  const hasSourceUrl = Boolean(result.metadata?.url);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(result.content);
      toast({ title: "Copied", description: "Content copied to clipboard" });
    } catch {
      toast({ title: "Copy failed", variant: "destructive" });
    }
  };

  return (
    <Card className="border-2 shadow-md hover:shadow-lg transition-shadow bg-card">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 flex-wrap min-w-0">
            <Badge className="shrink-0 bg-primary text-primary-foreground">
              {index + 1}
            </Badge>
            <h4 className="text-base font-semibold text-foreground truncate">
              {result.title}
            </h4>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0 opacity-70 hover:opacity-100"
            onClick={handleCopy}
            disabled={!hasExcerpt}
            title={hasExcerpt ? "Copy excerpt" : "No excerpt to copy"}
          >
            <Copy className="h-4 w-4" />
          </Button>
        </div>
        {(result.metadata?.year != null || result.metadata?.court_type) && (
          <div className="flex flex-wrap gap-2 mb-2">
            {result.metadata?.year != null && (
              <Badge variant="secondary" className="text-xs font-normal">
                {result.metadata.year}
              </Badge>
            )}
            {result.metadata?.court_type && (
              <Badge variant="outline" className="text-xs font-normal">
                {formatCourtTypeLabel(result.metadata.court_type)}
              </Badge>
            )}
          </div>
        )}
        {result.section_header && (
          <p className="text-sm text-muted-foreground italic mb-2">
            {result.section_header}
          </p>
        )}
        <p className="text-xs text-muted-foreground mb-3">
          Source: {result.source_file}
        </p>
        {hasExcerpt ? (
          <>
            <div className="text-sm text-foreground leading-relaxed prose prose-sm max-w-none">
              <SimpleMarkdownRenderer
                content={normalizeContentLineBreaks(displayContent)}
              />
            </div>
            {isLong && (
              <button
                type="button"
                onClick={() => setExpanded(!expanded)}
                className="text-xs text-primary font-medium mt-2 flex items-center gap-1 hover:underline"
              >
                {expanded ? (
                  <ChevronUp className="h-3 w-3" />
                ) : (
                  <ChevronDown className="h-3 w-3" />
                )}
                {expanded ? "Show less" : "Show more"}
              </button>
            )}
          </>
        ) : hasSourceUrl ? (
          <p className="text-sm text-muted-foreground">
            Full text is available at the source link below.
          </p>
        ) : (
          <p className="text-sm text-muted-foreground italic">
            No excerpt available for this chunk.
          </p>
        )}
        <div className="flex flex-wrap items-center gap-2 mt-3">
          {hasPdf && (
            <>
              <Button
                type="button"
                variant="default"
                size="sm"
                className="h-8 text-xs"
                disabled={pdfActionBusy}
                onClick={() => onViewPdf(result)}
              >
                {pdfActionBusy ? (
                  <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                ) : (
                  <FileText className="h-3 w-3 mr-1" />
                )}
                View PDF
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 text-xs"
                disabled={pdfActionBusy}
                onClick={() => onDownloadPdf(result)}
              >
                {pdfActionBusy ? (
                  <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                ) : (
                  <Download className="h-3 w-3 mr-1" />
                )}
                Download
              </Button>
            </>
          )}
          {result.metadata?.url && (
            <a
              href={result.metadata.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-primary hover:underline inline-flex items-center gap-1"
            >
              <ExternalLink className="h-3 w-3" />
              View source
            </a>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

interface ChatMessage {
  id: string;
  sender: "user" | "assistant";
  content: string;
  timestamp: Date;
  response?: AgenticRAGSearchResponse;
}

export default function MyJuristChatPage() {
  const { getAuthHeaders, refreshToken } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [topK, setTopK] = useState<number>(10);

  const [pdfDialogOpen, setPdfDialogOpen] = useState(false);
  const [pdfViewerUrl, setPdfViewerUrl] = useState<string | null>(null);
  const [pdfViewerTitle, setPdfViewerTitle] = useState("");
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [pdfActionBusy, setPdfActionBusy] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    return () => {
      if (pdfViewerUrl) {
        window.URL.revokeObjectURL(pdfViewerUrl);
      }
    };
  }, [pdfViewerUrl]);

  const handleViewPdf = async (result: SearchResult) => {
    const documentId = result.metadata?.pdf_download_url;
    if (!documentId) return;

    setPdfViewerTitle(result.title);
    setPdfError(null);
    setPdfDialogOpen(true);
    setPdfLoading(true);
    setPdfViewerUrl((prev) => {
      if (prev) window.URL.revokeObjectURL(prev);
      return null;
    });
    setPdfActionBusy(true);

    try {
      const authHeaders = getAuthHeaders();
      const authToken = authHeaders.Authorization?.replace("Bearer ", "") || "";
      const blob = await downloadLegalDocumentPDF(
        { document_id: documentId },
        authToken,
        getAuthHeaders,
        refreshToken
      );
      const url = window.URL.createObjectURL(blob);
      setPdfViewerUrl(url);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to load PDF preview.";
      setPdfError(message);
      toast({
        title: "Failed to load PDF",
        description: message,
        variant: "destructive",
      });
    } finally {
      setPdfLoading(false);
      setPdfActionBusy(false);
    }
  };

  const handleDownloadPdf = async (result: SearchResult) => {
    const documentId = result.metadata?.pdf_download_url;
    if (!documentId) {
      toast({
        title: "Error",
        description: "PDF path not available for this result.",
        variant: "destructive",
      });
      return;
    }

    setPdfActionBusy(true);
    try {
      const authHeaders = getAuthHeaders();
      const authToken = authHeaders.Authorization?.replace("Bearer ", "") || "";
      const blob = await downloadLegalDocumentPDF(
        { document_id: documentId },
        authToken,
        getAuthHeaders,
        refreshToken
      );
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      const baseName =
        result.metadata?.pdf_filename?.replace(/\.pdf$/i, "") || result.title;
      link.download = `${baseName.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast({
        title: "PDF downloaded",
        description: "The document has been saved.",
      });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to download PDF.";
      toast({
        title: "PDF download failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setPdfActionBusy(false);
    }
  };

  const handlePdfDialogOpenChange = (open: boolean) => {
    setPdfDialogOpen(open);
    if (!open) {
      setPdfViewerUrl((prev) => {
        if (prev) window.URL.revokeObjectURL(prev);
        return null;
      });
      setPdfError(null);
      setPdfLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    // Validate query length
    if (input.trim().length < 3) {
      toast({
        title: "Query too short",
        description: "Please enter at least 3 characters",
        variant: "destructive",
      });
      return;
    }

    if (input.trim().length > 1000) {
      toast({
        title: "Query too long",
        description: "Please enter less than 1000 characters",
        variant: "destructive",
      });
      return;
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const queryText = input.trim();
    setInput("");
    setIsLoading(true);
    setError(null);

    try {
      const response = await searchAgenticRAG(
        {
          query: queryText,
          top_k: topK,
          include_metadata: true,
        },
        getAuthHeaders,
        refreshToken
      );

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: "assistant",
        content: formatResponse(response),
        timestamp: new Date(),
        response: response,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "An error occurred";
      setError(msg);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: "assistant",
        content: `❌ **Error**\n\nI encountered an error while processing your query: ${msg}\n\nPlease try again or contact support if the issue persists.`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      toast({
        title: "Error",
        description: msg,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatResponse = (response: AgenticRAGSearchResponse): string => {
    const n = response.total_results ?? response.results?.length ?? 0;
    if (response.results?.length) {
      return `I found **${n}** relevant result${n !== 1 ? "s" : ""} for your query. See the sources below.`;
    }
    if (response.answer?.trim()) {
      return "Details for your query are shown below.";
    }
    return `I couldn't find any specific results for your query. Please try rephrasing your question or using different keywords.`;
  };

  return (
    <div className="h-screen max-h-screen flex flex-col bg-background overflow-x-hidden overflow-y-hidden">
      <Dialog open={pdfDialogOpen} onOpenChange={handlePdfDialogOpenChange}>
        <DialogContent className="max-w-4xl w-[95vw] h-[90vh] max-h-[90vh] flex flex-col gap-0 p-0 overflow-hidden sm:max-w-4xl">
          <DialogHeader className="px-6 pt-6 pb-2 shrink-0 border-b border-border">
            <DialogTitle className="truncate pr-8">{pdfViewerTitle}</DialogTitle>
          </DialogHeader>
          <div className="flex-1 min-h-0 bg-muted/20 flex flex-col">
            {pdfLoading ? (
              <div className="flex-1 flex items-center justify-center gap-2 text-sm text-muted-foreground p-8">
                <Loader2 className="h-5 w-5 animate-spin" />
                Loading PDF…
              </div>
            ) : pdfError ? (
              <div className="flex-1 flex items-center justify-center p-6">
                <Alert variant="destructive" className="max-w-md">
                  <AlertDescription>{pdfError}</AlertDescription>
                </Alert>
              </div>
            ) : pdfViewerUrl ? (
              <iframe
                src={pdfViewerUrl}
                className="w-full flex-1 min-h-0 border-0 bg-background"
                title={pdfViewerTitle}
              />
            ) : (
              <div className="flex-1 flex items-center justify-center text-sm text-muted-foreground p-8">
                PDF preview unavailable.
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Header */}
      <div className="bg-card border-b border-border p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-md">
              <Search className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">My Jurist Chat</h1>
              <p className="text-sm text-muted-foreground">
                AI-powered legal search and research
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-muted-foreground mr-2">Top K:</label>
            <select
              value={topK}
              onChange={(e) => setTopK(Number(e.target.value))}
              className="bg-background border border-input text-foreground rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              {[5, 10, 15, 20, 25, 30].map((k) => (
                <option key={k} value={k}>
                  {k}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden min-h-0 p-4">
        <div className="flex-1 flex flex-col min-h-0 border-2 border-border rounded-lg overflow-hidden bg-card">
          <div className="flex-1 min-h-0 overflow-y-auto p-4">
            <div className="space-y-6">
              {messages.length === 0 && (
                <div className="flex items-center justify-center min-h-[280px]">
                  <div className="text-center max-w-lg">
                    <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-2xl flex items-center justify-center">
                      <Search className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      Welcome to My Jurist Chat
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      Ask questions about legal cases, patents, regulatory
                      compliance, or general legal topics. I&apos;ll search through
                      our legal database and provide you with relevant results.
                    </p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setInput("Supreme Court cases on data privacy")
                        }
                        className="border-primary/40 hover:bg-primary/10"
                      >
                        <BookOpen className="w-4 h-4 mr-2" />
                        Legal Cases
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setInput("Regulatory compliance requirements")
                        }
                        className="border-primary/40 hover:bg-primary/10"
                      >
                        <Shield className="w-4 h-4 mr-2" />
                        Compliance
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {messages.map((message) => (
                <div key={message.id}>
                  <div
                    className={`flex items-start gap-3 ${
                      message.sender === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    {message.sender === "assistant" && (
                      <div className="w-8 h-8 shrink-0 bg-primary rounded-full flex items-center justify-center">
                        <Search className="w-4 h-4 text-primary-foreground" />
                      </div>
                    )}
                    <div
                      className={`max-w-3xl px-4 py-3 rounded-2xl ${
                        message.sender === "user"
                          ? "bg-primary text-primary-foreground rounded-br-md"
                          : "bg-card text-foreground rounded-bl-md border-2 border-border shadow-sm"
                      }`}
                    >
                      {message.sender === "user" ? (
                        <p className="text-[inherit] leading-relaxed whitespace-pre-wrap break-words">
                          {message.content}
                        </p>
                      ) : (
                        <div className="prose prose-sm dark:prose-invert max-w-none prose-p:my-1 prose-strong:text-foreground">
                          <SimpleMarkdownRenderer
                            content={message.content || "\u00a0"}
                          />
                        </div>
                      )}
                    </div>
                    {message.sender === "user" && (
                      <div className="w-8 h-8 shrink-0 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold text-sm">
                        U
                      </div>
                    )}
                  </div>

                  {message.sender === "assistant" &&
                    message.response &&
                    (filterNonEmptyStrings(message.response.related_sections).length >
                      0 ||
                      filterNonEmptyStrings(message.response.amendments_found).length >
                        0) && (
                      <div className="mt-3 ml-11 max-w-3xl space-y-2">
                        {filterNonEmptyStrings(message.response.related_sections)
                          .length > 0 && (
                          <div className="flex flex-wrap gap-2 items-start">
                            <span className="text-xs font-medium text-muted-foreground shrink-0 pt-0.5">
                              Related sections
                            </span>
                            <div className="flex flex-wrap gap-1.5 min-w-0">
                              {filterNonEmptyStrings(
                                message.response.related_sections
                              ).map((s, i) => (
                                <Badge
                                  key={`rel-${i}`}
                                  variant="secondary"
                                  className="text-xs font-normal max-w-full whitespace-normal h-auto py-1"
                                >
                                  {s}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        {filterNonEmptyStrings(message.response.amendments_found)
                          .length > 0 && (
                          <div className="flex flex-wrap gap-2 items-start">
                            <span className="text-xs font-medium text-muted-foreground shrink-0 pt-0.5">
                              Amendments
                            </span>
                            <div className="flex flex-wrap gap-1.5 min-w-0">
                              {filterNonEmptyStrings(
                                message.response.amendments_found
                              ).map((s, i) => (
                                <Badge
                                  key={`amd-${i}`}
                                  variant="outline"
                                  className="text-xs font-normal max-w-full whitespace-normal h-auto py-1"
                                >
                                  {s}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                  {message.response &&
                    message.response.results &&
                    message.response.results.length > 0 && (
                      <div className="mt-4 ml-11 max-w-3xl">
                        <Collapsible defaultOpen className="group/collapsible">
                          <CollapsibleTrigger className="flex w-full items-center gap-2 text-sm font-semibold text-foreground rounded-md py-1.5 -ml-1 pl-1 pr-2 hover:bg-muted/60 text-left [&[data-state=open]>svg:first-child]:rotate-180">
                            <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
                            <span>
                              {getSourcesCollapsibleLabel(message.response)}
                            </span>
                          </CollapsibleTrigger>
                          <CollapsibleContent className="space-y-3 pt-3">
                            {message.response.results.map((result, index) => (
                              <ResultCard
                                key={`${message.id}-src-${index}-${result.source_file ?? String(result.chunk_index)}`}
                                result={result}
                                index={index}
                                onViewPdf={handleViewPdf}
                                onDownloadPdf={handleDownloadPdf}
                                pdfActionBusy={pdfActionBusy}
                              />
                            ))}
                          </CollapsibleContent>
                        </Collapsible>
                      </div>
                    )}

                  {message.sender === "assistant" &&
                    message.response &&
                    typeof message.response.answer === "string" &&
                    message.response.answer.trim().length > 0 && (
                      <div className="mt-4 ml-11 max-w-3xl rounded-2xl border-2 border-border bg-card px-4 py-3 shadow-sm">
                        <SimpleMarkdownRenderer
                          className="text-sm"
                          content={normalizeContentLineBreaks(
                            message.response.answer.trim()
                          )}
                        />
                      </div>
                    )}

                  {message.sender === "assistant" &&
                    message.response &&
                    filterNonEmptyStrings(message.response.suggestions).length >
                      0 && (
                      <div className="mt-4 ml-11 max-w-3xl">
                        <p className="text-sm font-semibold text-foreground mb-2">
                          Suggested follow-ups
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {filterNonEmptyStrings(
                            message.response.suggestions
                          ).map((s, i) => (
                            <Button
                              key={`${message.id}-sug-${i}`}
                              type="button"
                              variant="outline"
                              size="sm"
                              className="h-auto min-h-8 max-w-full whitespace-normal text-left py-1.5 px-3 text-xs leading-snug"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setInput(s);
                                queueMicrotask(() => {
                                  inputRef.current?.focus();
                                });
                              }}
                            >
                              {s}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}
                </div>
              ))}

              {isLoading && (
                <div className="flex items-start gap-3 justify-start">
                  <div className="w-8 h-8 shrink-0 bg-primary rounded-full flex items-center justify-center">
                    <Search className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <div className="px-4 py-3 rounded-2xl bg-card text-foreground rounded-bl-md border-2 border-border shadow-sm">
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-primary" />
                      <span>Searching legal database...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div ref={chatEndRef} />
          </div>

          <div className="bg-card border-t border-border p-4 shadow-sm">
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <form onSubmit={handleSendMessage} className="flex gap-3">
              <div className="flex-1 relative">
                <Input
                  ref={inputRef}
                  type="text"
                  placeholder="Ask a legal question... (3-1000 characters)"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="pr-14 bg-background border-input focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  disabled={isLoading}
                  minLength={3}
                  maxLength={1000}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                  {input.length}/1000
                </span>
              </div>
              <Button
                type="submit"
                disabled={
                  !input.trim() ||
                  isLoading ||
                  input.trim().length < 3 ||
                  input.trim().length > 1000
                }
                className="bg-primary hover:bg-primary/90 text-primary-foreground shrink-0"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
