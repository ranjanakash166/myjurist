"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, Loader2, FileEdit, CheckCircle, AlertCircle, FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "../../../components/AuthProvider";
import SimpleMarkdownRenderer from "../../../components/SimpleMarkdownRenderer";
import {
  sendDraftingMessage,
  downloadDraftContract,
  DraftingQuestion,
  DraftingResponse,
} from "@/lib/smartDraftingApi";
import ContractEditor from "./ContractEditor";

interface ChatMessage {
  id: string;
  sender: "user" | "assistant";
  content: string;
  timestamp: Date;
}

function formatTime(date: Date) {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

/** Build answer string from question answers: "field: value" per line */
function buildAnswersMessage(answers: Record<string, string>): string {
  return Object.entries(answers)
    .map(([field, value]) => `${field}: ${value}`)
    .join("\n");
}

export default function SmartDraftingPage() {
  const { getAuthHeaders, user } = useAuth();
  const userInitial = user?.full_name ? user.full_name.trim().charAt(0).toUpperCase() : "U";

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [sessionId, setSessionId] = useState<string | null>(null);
  const [questions, setQuestions] = useState<DraftingQuestion[] | null>(null);
  const [questionAnswers, setQuestionAnswers] = useState<Record<string, string>>({});
  const [matchedTemplate, setMatchedTemplate] = useState<string | null>(null);
  const [contractId, setContractId] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [downloadFormat, setDownloadFormat] = useState<"pdf" | "docx" | null>(null);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, questions]);

  const applyResponse = (data: DraftingResponse) => {
    setSessionId(data.session_id);
    setMatchedTemplate(data.matched_template ?? null);
    setContractId(data.contract_id ?? null);
    setStatus(data.status);
    setQuestions(data.questions ?? null);
    if (data.questions) {
      const initial: Record<string, string> = {};
      data.questions.forEach((q) => {
        initial[q.field] = "";
      });
      setQuestionAnswers(initial);
    } else {
      setQuestionAnswers({});
    }
  };

  const handleSendRequirement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userText = input.trim();
    setInput("");
    setMessages((prev) => [
      ...prev,
      { id: crypto.randomUUID(), sender: "user", content: userText, timestamp: new Date() },
    ]);
    setIsLoading(true);
    setError(null);

    try {
      const data = await sendDraftingMessage(
        sessionId ? { message: userText, session_id: sessionId } : { message: userText },
        getAuthHeaders
      );
      applyResponse(data);
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          sender: "assistant",
          content: data.message,
          timestamp: new Date(),
        },
      ]);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Request failed";
      setError(msg);
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          sender: "assistant",
          content: `Error: ${msg}`,
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitQuestionAnswers = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sessionId || !questions?.length || isLoading) return;

    const answersText = buildAnswersMessage(questionAnswers);
    setMessages((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        sender: "user",
        content: answersText,
        timestamp: new Date(),
      },
    ]);
    setQuestions(null);
    setQuestionAnswers({});
    setIsLoading(true);
    setError(null);

    try {
      const data = await sendDraftingMessage(
        { message: answersText, session_id: sessionId },
        getAuthHeaders
      );
      applyResponse(data);
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          sender: "assistant",
          content: data.message,
          timestamp: new Date(),
        },
      ]);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Request failed";
      setError(msg);
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          sender: "assistant",
          content: `Error: ${msg}`,
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const canSubmitQuestions =
    questions?.length &&
    questions.every((q) => (questionAnswers[q.field] ?? "").trim() !== "");

  const handleDownload = async (format: "pdf" | "docx") => {
    if (!contractId) return;
    setDownloadError(null);
    setDownloadFormat(format);
    try {
      await downloadDraftContract(contractId, format, getAuthHeaders);
    } catch (err: unknown) {
      setDownloadError(err instanceof Error ? err.message : "Download failed");
    } finally {
      setDownloadFormat(null);
    }
  };

  return (
    <div className="w-full px-2 sm:px-4 md:px-8 py-4 flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Header */}
      <div className="mb-4 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-primary to-blue-500 rounded-xl flex items-center justify-center">
            <FileEdit className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Smart Drafting</h1>
            <p className="text-sm text-muted-foreground">
              Describe your contract need; we&apos;ll ask a few questions and generate your draft.
            </p>
          </div>
        </div>
      </div>

      {/* Side-by-side: left = chat, right = document editor */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1 min-h-0">
        {/* Left: chat interface */}
        <div className="flex flex-col gap-4 min-h-0 overflow-hidden">
      {/* Contract ready state */}
      {contractId && (
        <Card className="mb-6 border-primary/30 bg-primary/5">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-primary" />
              <CardTitle className="text-lg">Contract ready</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              Your draft has been created. Download it below.
            </p>
            {matchedTemplate && (
              <Badge variant="secondary" className="mb-4">
                {matchedTemplate}
              </Badge>
            )}
            <div className="flex flex-wrap gap-3">
              <Button
                variant="default"
                size="sm"
                onClick={() => handleDownload("pdf")}
                disabled={downloadFormat !== null}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {downloadFormat === "pdf" ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <FileDown className="w-4 h-4 mr-2" />
                )}
                Download PDF
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDownload("docx")}
                disabled={downloadFormat !== null}
              >
                {downloadFormat === "docx" ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <FileDown className="w-4 h-4 mr-2" />
                )}
                Download DOCX
              </Button>
            </div>
            {downloadError && (
              <Alert variant="destructive" className="mt-3">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{downloadError}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}

      {/* Chat area */}
      <Card className="flex-1 flex flex-col min-h-[400px] border-border">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && !isLoading && (
            <div className="flex items-center justify-center min-h-[280px]">
              <div className="text-center max-w-md">
                <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                  <FileEdit className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  What do you need to draft?
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Example: &quot;Draft me a rental agreement&quot;, &quot;I need an NDA&quot;, or
                  &quot;Create a service agreement&quot;.
                </p>
              </div>
            </div>
          )}

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.sender === "assistant" && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center border border-border">
                  <FileEdit className="w-4 h-4 text-primary" />
                </div>
              )}
              <div
                className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm ${
                  msg.sender === "user"
                    ? "bg-primary text-primary-foreground rounded-br-md dark:bg-primary/90"
                    : "bg-muted text-foreground rounded-bl-md border border-border"
                }`}
              >
                {msg.sender === "user" ? (
                  <>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                    <div className="text-xs text-primary-foreground/90 opacity-90 mt-2">
                      {formatTime(msg.timestamp)}
                    </div>
                  </>
                ) : (
                  <>
                    <SimpleMarkdownRenderer content={msg.content} className="text-sm leading-relaxed" />
                    <div className="text-xs opacity-80 mt-2">{formatTime(msg.timestamp)}</div>
                  </>
                )}
              </div>
              {msg.sender === "user" && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center border border-border font-semibold text-sm">
                  {userInitial}
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex items-start gap-3 justify-start">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center border border-border">
                <FileEdit className="w-4 h-4 text-primary" />
              </div>
              <div className="px-4 py-3 rounded-2xl rounded-bl-md bg-muted border border-border">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Processing...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Question form (when we have questions and no contract yet) */}
        {questions && questions.length > 0 && !contractId && (
          <div className="border-t border-border p-4 bg-muted/30">
            {matchedTemplate && (
              <p className="text-sm text-muted-foreground mb-3">
                Template: <strong className="text-foreground">{matchedTemplate}</strong>
              </p>
            )}
            <form onSubmit={handleSubmitQuestionAnswers} className="space-y-4">
              {questions.map((q) => (
                <div key={q.field} className="space-y-2">
                  <Label htmlFor={q.field} className="text-sm font-medium">
                    {q.question}
                  </Label>
                  {q.type === "text" || !q.options?.length ? (
                    <Input
                      id={q.field}
                      value={questionAnswers[q.field] ?? ""}
                      onChange={(e) =>
                        setQuestionAnswers((prev) => ({ ...prev, [q.field]: e.target.value }))
                      }
                      placeholder={`Enter ${q.field.replace(/_/g, " ")}`}
                      className="bg-background"
                      required
                      disabled={isLoading}
                    />
                  ) : (
                    <Select
                      value={questionAnswers[q.field] ?? ""}
                      onValueChange={(value) =>
                        setQuestionAnswers((prev) => ({ ...prev, [q.field]: value }))
                      }
                      disabled={isLoading}
                    >
                      <SelectTrigger id={q.field} className="bg-background">
                        <SelectValue placeholder={`Select ${q.field.replace(/_/g, " ")}`} />
                      </SelectTrigger>
                      <SelectContent>
                        {q.options.map((opt) => (
                          <SelectItem key={opt} value={opt}>
                            {opt}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
              ))}
              <Button type="submit" disabled={!canSubmitQuestions || isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit answers"
                )}
              </Button>
            </form>
          </div>
        )}

        {/* Chat input (when no pending questions or we're in initial state) */}
        {(!questions || questions.length === 0) && !contractId && (
          <div className="border-t border-border p-4">
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <form onSubmit={handleSendRequirement} className="flex gap-3">
              <Input
                ref={inputRef}
                type="text"
                placeholder="Describe what you want to draft (e.g. draft me a rental agreement)"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1"
                disabled={isLoading}
              />
              <Button type="submit" disabled={!input.trim() || isLoading}>
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </form>
          </div>
        )}
      </Card>
        </div>

        {/* Right: document editor */}
        <div className="flex flex-col min-h-[500px] lg:min-h-0">
          <ContractEditor contractId={contractId} getAuthHeaders={getAuthHeaders} />
        </div>
      </div>
    </div>
  );
}
