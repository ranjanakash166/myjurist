"use client";
import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../../../components/AuthProvider";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Loader2, 
  ExternalLink, 
  CheckCircle, 
  Scale, 
  BookOpen, 
  FileText, 
  Sparkles,
  Link2,
  AlertTriangle,
  Lightbulb
} from "lucide-react";
import { fetchRegulatorySuggestions, submitRegulatoryQuery, RegulatoryQueryResponse, RegulatoryAmendment } from "@/lib/regulatoryComplianceApi";
import { useToast } from "@/hooks/use-toast";
import SimpleMarkdownRenderer from "@/components/SimpleMarkdownRenderer";

// Example queries for quick access
const exampleQueries = [
  "Define 'contract' under Indian Contract Act, 1872",
  "What is Section 1 of Companies Act, 2013?",
  "Amendments to Income Tax Act, 1961",
  "Consumer Protection Act provisions",
  "GST compliance requirements"
];

export default function RegulatoryCompliancePage() {
  const { user, getAuthHeaders } = useAuth();
  const { toast } = useToast();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<RegulatoryQueryResponse | null>(null);
  const [selectedSuggestion, setSelectedSuggestion] = useState<string | null>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleExampleClick = (exampleQuery: string) => {
    setQuery(exampleQuery);
    inputRef.current?.focus();
  };

  // Debounced search for suggestions
  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (query.trim().length >= 3) {
        try {
          setIsLoading(true);
          const authHeaders = await getAuthHeaders();
          const suggestionsData = await fetchRegulatorySuggestions(authHeaders, query);
          setSuggestions(suggestionsData);
          setShowSuggestions(true);
        } catch (error) {
          console.error("Error fetching suggestions:", error);
          toast({
            title: "Error",
            description: "Failed to fetch suggestions. Please try again.",
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [query, getAuthHeaders, toast]);

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    setSelectedSuggestion(suggestion);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const handleSubmit = async () => {
    if (!query.trim()) {
      toast({
        title: "Error",
        description: "Please enter a query to search.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      setResult(null);
      const authHeaders = await getAuthHeaders();
      const response = await submitRegulatoryQuery(authHeaders, query.trim());
      setResult(response);
      toast({
        title: "Success",
        description: "Regulatory compliance check completed successfully.",
      });
    } catch (error) {
      console.error("Error submitting query:", error);
      const errorMessage = error instanceof Error 
        ? error.message 
        : "Failed to submit query. Please try again.";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center shadow-lg">
            <Scale className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Regulatory Compliance</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Search laws, regulations, and legal requirements with AI-powered analysis
        </p>
      </div>

      {/* Search Section */}
      <Card className="w-full border-0 shadow-sm bg-gradient-to-br from-slate-50 to-gray-50 dark:from-slate-900/50 dark:to-gray-900/50">
        <CardContent className="pt-6">
          <div className="space-y-5">
            {/* Search Input with integrated button */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                <Search className="w-5 h-5" />
              </div>
              <Input
                ref={inputRef}
                type="text"
                placeholder="What regulatory information are you looking for?"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="h-14 text-base pl-12 pr-32 rounded-xl border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                disabled={isSubmitting}
              />
              <Button 
                onClick={handleSubmit}
                className="absolute right-2 top-1/2 -translate-y-1/2 h-10 px-6 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-md"
                disabled={isSubmitting || !query.trim()}
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="hidden sm:inline">Analyzing...</span>
                  </div>
                ) : (
                  <span>Search</span>
                )}
              </Button>
              
              {/* Loading indicator */}
              {isLoading && (
                <div className="absolute right-36 top-1/2 -translate-y-1/2">
                  <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                </div>
              )}
              
              {/* Suggestions Dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div
                  ref={suggestionsRef}
                  className="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-xl shadow-lg z-50 max-h-60 overflow-y-auto"
                >
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="w-full text-left px-4 py-3 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors border-b border-border last:border-b-0 first:rounded-t-xl last:rounded-b-xl"
                    >
                      <div className="flex items-center gap-2">
                        <Search className="w-4 h-4 text-emerald-500" />
                        <span className="text-sm">{suggestion}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Example Queries */}
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
              <h3 className="text-xs font-medium text-muted-foreground mb-3 flex items-center gap-2 uppercase tracking-wide">
                <Lightbulb className="w-3.5 h-3.5" />
                Example Queries
              </h3>
              <div className="flex flex-wrap gap-2">
                {exampleQueries.map((exampleQuery, index) => (
                  <button
                    key={index}
                    onClick={() => handleExampleClick(exampleQuery)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors border border-transparent hover:border-emerald-200 dark:hover:border-emerald-800"
                  >
                    <Search className="w-3 h-3" />
                    {exampleQuery.length > 35 ? exampleQuery.substring(0, 35) + '...' : exampleQuery}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Loading Skeleton */}
      {isSubmitting && (
        <Card className="w-full">
          <CardContent className="py-8">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 mb-4 bg-gradient-to-r from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 rounded-full flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Analyzing Regulatory Information...</h3>
              <p className="text-muted-foreground text-sm">
                Searching through laws, regulations, and legal precedents
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results Section */}
      {result && !isSubmitting && (
        <div className="space-y-4">
          {/* Results Header */}
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-emerald-500" />
            <span className="font-semibold text-foreground">Analysis Complete</span>
          </div>

          {/* AI Answer */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 rounded-lg p-6 border">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-purple-500" />
              <h3 className="font-semibold text-lg">AI Analysis</h3>
            </div>
            <div className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
              <SimpleMarkdownRenderer content={result.answer} />
            </div>
          </div>

          {/* Related Sections */}
          {result.related_sections.length > 0 && (
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 rounded-lg p-6 border">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="w-5 h-5 text-emerald-500" />
                <h3 className="font-semibold text-lg">Related Sections</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {result.related_sections.map((section, index) => (
                  <Badge 
                    key={index} 
                    className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800"
                  >
                    Section {section}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Amendments */}
          {result.amendments_found.length > 0 && (
            <div className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20 rounded-lg p-6 border">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-5 h-5 text-orange-500" />
                <h3 className="font-semibold text-lg">Amendments Found</h3>
                <Badge variant="secondary" className="ml-auto">{result.amendments_found.length}</Badge>
              </div>
              <div className="space-y-3">
                {result.amendments_found.map((amendment, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg border hover:shadow-sm transition-shadow">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-gray-900 dark:text-gray-100">{amendment.title}</p>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{amendment.snippet}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(amendment.source, '_blank')}
                      className="flex-shrink-0 hover:bg-orange-100 dark:hover:bg-orange-900/30"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sources */}
          {result.sources.length > 0 && (
            <div className="bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-950/20 dark:to-gray-950/20 rounded-lg p-6 border">
              <div className="flex items-center gap-2 mb-4">
                <Link2 className="w-5 h-5 text-slate-500" />
                <h3 className="font-semibold text-lg">Sources</h3>
                <Badge variant="secondary" className="ml-auto">{result.sources.length}</Badge>
              </div>
              <div className="space-y-3">
                {result.sources.map((source, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg border hover:shadow-sm transition-shadow">
                    <div className="w-8 h-8 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText className="w-4 h-4 text-slate-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-gray-900 dark:text-gray-100 truncate">{source.title}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-muted-foreground">{source.domain}</span>
                        <Badge variant="outline" className="text-xs">
                          Relevance: {source.relevance}
                        </Badge>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(source.url, '_blank')}
                      className="flex-shrink-0 hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
} 