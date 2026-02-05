"use client";
import React, { useState, useRef, useEffect } from "react";
import { Send, Loader2, Search, Shield, BookOpen, Copy, ExternalLink, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "../../../components/AuthProvider";
import { toast } from '@/hooks/use-toast';
import SimpleMarkdownRenderer from "../../../components/SimpleMarkdownRenderer";
import { searchAgenticRAG, AgenticRAGSearchResponse, SearchResult } from "@/lib/agenticRagApi";
import { normalizeContentLineBreaks } from "@/lib/utils";

const RESULT_PREVIEW_LENGTH = 400;

function ResultCard({ result, index }: { result: SearchResult; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const isLong = result.content.length > RESULT_PREVIEW_LENGTH;
  const displayContent = isLong && !expanded
    ? result.content.slice(0, RESULT_PREVIEW_LENGTH) + "..."
    : result.content;

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
            <Badge className="shrink-0 bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
              {index + 1}
            </Badge>
            <h4 className="text-base font-semibold text-foreground truncate">{result.title}</h4>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0 opacity-70 hover:opacity-100"
            onClick={handleCopy}
          >
            <Copy className="h-4 w-4" />
          </Button>
        </div>
        {result.section_header && (
          <p className="text-sm text-muted-foreground italic mb-2">{result.section_header}</p>
        )}
        <p className="text-xs text-muted-foreground mb-3">Source: {result.source_file}</p>
        <div className="text-sm text-foreground leading-relaxed prose prose-sm max-w-none">
          <SimpleMarkdownRenderer content={normalizeContentLineBreaks(displayContent)} />
        </div>
        {isLong && (
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="text-xs text-primary font-medium mt-2 flex items-center gap-1 hover:underline"
          >
            {expanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            {expanded ? "Show less" : "Show more"}
          </button>
        )}
        {result.metadata?.url && (
          <a
            href={result.metadata.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-primary hover:underline mt-3 inline-flex items-center gap-1"
          >
            <ExternalLink className="h-3 w-3" />
            View source
          </a>
        )}
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
  
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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

    setMessages(prev => [...prev, userMessage]);
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

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err: any) {
      setError(err.message || "An error occurred");
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: "assistant",
        content: `❌ **Error**\n\nI encountered an error while processing your query: ${err.message}\n\nPlease try again or contact support if the issue persists.`,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
      toast({
        title: "Error",
        description: err.message || "An error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatResponse = (response: AgenticRAGSearchResponse): string => {
    if (response.results && response.results.length > 0) {
      return `I found **${response.total_results}** relevant result${response.total_results > 1 ? 's' : ''} for your query. See the sources below.`;
    }
    return `I couldn't find any specific results for your query. Please try rephrasing your question or using different keywords.`;
  };



  return (
    <div className="h-screen max-h-screen flex flex-col bg-background overflow-x-hidden overflow-y-hidden">
      {/* Header */}
      <div className="bg-card border-b border-border p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-md">
              <Search className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">My Jurist Chat</h1>
              <p className="text-sm text-muted-foreground">AI-powered legal search and research</p>
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
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 rounded-2xl flex items-center justify-center">
                    <Search className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Welcome to My Jurist Chat</h3>
                  <p className="text-muted-foreground mb-6">
                    Ask questions about legal cases, patents, regulatory compliance, or general legal topics.
                    I'll search through our legal database and provide you with relevant results.
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setInput("Supreme Court cases on data privacy")}
                      className="border-emerald-200 dark:border-emerald-800 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                    >
                      <BookOpen className="w-4 h-4 mr-2" />
                      Legal Cases
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setInput("Regulatory compliance requirements")}
                      className="border-emerald-200 dark:border-emerald-800 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
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
                    <div className="w-8 h-8 shrink-0 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
                      <Search className="w-4 h-4 text-white" />
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
                        <SimpleMarkdownRenderer content={message.content} />
                      </div>
                    )}
                  </div>
                  {message.sender === "user" && (
                    <div className="w-8 h-8 shrink-0 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold text-sm">
                      U
                    </div>
                  )}
                </div>

                {message.response && message.response.results && message.response.results.length > 0 && (
                  <div className="mt-4 ml-11 max-w-3xl">
                    <p className="text-sm font-semibold text-foreground mb-3">Sources</p>
                    <div className="space-y-3">
                      {message.response.results.map((result, index) => (
                        <ResultCard key={index} result={result} index={index} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex items-start gap-3 justify-start">
                <div className="w-8 h-8 shrink-0 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
                  <Search className="w-4 h-4 text-white" />
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
                disabled={!input.trim() || isLoading || input.trim().length < 3 || input.trim().length > 1000}
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shrink-0"
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

