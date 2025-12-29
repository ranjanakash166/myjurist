"use client";
import React, { useState, useRef, useEffect } from "react";
import { Send, Loader2, Search, Shield, Lightbulb, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "../../../components/AuthProvider";
import { toast } from '@/hooks/use-toast';
import SimpleMarkdownRenderer from "../../../components/SimpleMarkdownRenderer";
import { searchAgenticRAG, AgenticRAGSearchResponse, SearchResult } from "@/lib/agenticRagApi";

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

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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
      let content = `I found ${response.total_results} relevant result${response.total_results > 1 ? 's' : ''} for your query:\n\n`;
      
      response.results.forEach((result, index) => {
        content += `**${result.title}**\n`;
        if (result.section_header) {
          content += `*${result.section_header}*\n`;
        }
        content += `${result.content}\n\n`;
      });
      
      return content;
    } else {
      return `I couldn't find any specific results for your query. Please try rephrasing your question or using different keywords.`;
    }
  };

  const renderResultCard = (result: SearchResult, index: number) => {
    return (
      <Card key={index} className="mb-3 border-neutral-800 bg-neutral-900/50">
        <CardContent className="p-4">
          <div className="mb-3">
            <h4 className="text-base font-semibold text-white mb-1">{result.title}</h4>
            {result.section_header && (
              <p className="text-sm text-neutral-400 italic mb-2">{result.section_header}</p>
            )}
            <p className="text-xs text-neutral-500">Source: {result.source_file}</p>
          </div>
          <p className="text-sm text-neutral-200 leading-relaxed whitespace-pre-wrap">{result.content}</p>
          {result.metadata?.url && (
            <a
              href={result.metadata.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-400 hover:text-blue-300 mt-3 inline-block"
            >
              View source →
            </a>
          )}
        </CardContent>
      </Card>
    );
  };


  return (
    <div className="h-screen flex flex-col bg-neutral-950">
      {/* Header */}
      <div className="bg-neutral-900 border-b border-neutral-800 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
              <Search className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">My Jurist Chat</h1>
              <p className="text-sm text-neutral-400">AI-powered legal search and research</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <label className="text-sm text-neutral-400 mr-2">Top K:</label>
            <select
              value={topK}
              onChange={(e) => setTopK(Number(e.target.value))}
              className="bg-neutral-800 border border-neutral-700 text-white rounded px-2 py-1 text-sm"
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

      <div className="flex-1 flex overflow-hidden">
        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-neutral-800 rounded-full flex items-center justify-center">
                    <Search className="w-8 h-8 text-neutral-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Welcome to My Jurist Chat</h3>
                  <p className="text-neutral-400 mb-4 max-w-md">
                    Ask questions about legal cases, patents, regulatory compliance, or general legal topics.
                    I'll search through our legal database and provide you with relevant results.
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setInput("Supreme Court cases on data privacy")}
                      className="text-neutral-300 border-neutral-700 hover:bg-neutral-800"
                    >
                      <BookOpen className="w-4 h-4 mr-2" />
                      Legal Cases
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setInput("Patent search for AI technology")}
                      className="text-neutral-300 border-neutral-700 hover:bg-neutral-800"
                    >
                      <Lightbulb className="w-4 h-4 mr-2" />
                      Patent Search
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setInput("Regulatory compliance requirements")}
                      className="text-neutral-300 border-neutral-700 hover:bg-neutral-800"
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
                    <div className="w-8 h-8 bg-neutral-800 rounded-full flex items-center justify-center">
                      <Search className="w-4 h-4 text-neutral-400" />
                    </div>
                  )}
                  
                  <div
                    className={`max-w-3xl px-4 py-3 rounded-2xl ${
                      message.sender === "user"
                        ? "bg-neutral-800 text-white rounded-br-md"
                        : "bg-neutral-900 text-neutral-200 rounded-bl-md border border-neutral-700"
                    }`}
                  >
                    <div className="whitespace-pre-wrap">
                      <SimpleMarkdownRenderer content={message.content} />
                    </div>
                    <div className="text-xs text-neutral-500 mt-2">
                      {formatTime(message.timestamp)}
                    </div>
                  </div>

                  {message.sender === "user" && (
                    <div className="w-8 h-8 bg-neutral-700 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      U
                    </div>
                  )}
                </div>

                {/* Render detailed results if available */}
                {message.response && message.response.results && message.response.results.length > 0 && (
                  <div className="mt-4 ml-11 max-w-3xl">
                    <div className="space-y-2">
                      {message.response.results.map((result, index) => renderResultCard(result, index))}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex items-start gap-3 justify-start">
                <div className="w-8 h-8 bg-neutral-800 rounded-full flex items-center justify-center">
                  <Search className="w-4 h-4 text-neutral-400" />
                </div>
                <div className="px-4 py-3 rounded-2xl bg-neutral-900 text-neutral-200 rounded-bl-md border border-neutral-700">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Searching...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Input Area */}
          <div className="bg-neutral-900 border-t border-neutral-800 p-4">
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
                  className="bg-neutral-800 border-neutral-700 text-white placeholder-neutral-400 focus:border-neutral-600"
                  disabled={isLoading}
                  minLength={3}
                  maxLength={1000}
                />
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-neutral-500">
                  {input.length}/1000
                </div>
              </div>
              
              <Button
                type="submit"
                disabled={!input.trim() || isLoading || input.trim().length < 3 || input.trim().length > 1000}
                className="bg-blue-600 hover:bg-blue-700"
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

