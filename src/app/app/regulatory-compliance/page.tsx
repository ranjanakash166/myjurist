"use client";
import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../../../components/AuthProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
      <Card className="w-full border-2 shadow-lg bg-gradient-to-br from-slate-50 to-gray-50 dark:from-slate-900/50 dark:to-gray-900/50">
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
                      className="w-full text-left px-4 py-3 hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors border-b border-border last:border-b-0 first:rounded-t-xl last:rounded-b-xl"
                    >
                      <div className="flex items-center gap-2">
                        <Search className="w-4 h-4 text-primary" />
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
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-primary/10 dark:hover:bg-primary/20 hover:text-primary transition-colors border border-transparent hover:border-primary/40"
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
        <Card className="w-full border-2 shadow-lg">
          <CardContent className="py-12">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 mb-6 bg-gradient-to-r from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 rounded-full flex items-center justify-center shadow-lg">
                <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">Analyzing Regulatory Information...</h3>
              <p className="text-muted-foreground text-sm max-w-md mx-auto">
                Searching through laws, regulations, and legal precedents
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results Section */}
      {result && !isSubmitting && (
        <div className="space-y-6">
          {/* Results Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center shadow-md">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">Analysis Complete</h2>
              <p className="text-sm text-muted-foreground mt-1">Regulatory compliance analysis results</p>
            </div>
          </div>

          {/* AI Answer */}
          <Card className="border-2 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 rounded-t-lg border-b">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center shadow-md">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span>AI Analysis</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 rounded-xl p-6 border-2 border-emerald-200 dark:border-emerald-800">
                <div className="text-base leading-relaxed text-gray-700 dark:text-gray-300 prose prose-sm max-w-none">
                  <SimpleMarkdownRenderer content={result.answer} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Related Sections */}
          {result.related_sections.length > 0 && (
            <Card className="border-2 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 rounded-t-lg border-b">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center shadow-md">
                      <BookOpen className="w-5 h-5 text-white" />
                    </div>
                    <span>Related Sections</span>
                  </CardTitle>
                  <Badge variant="secondary" className="text-sm">
                    {result.related_sections.length} {result.related_sections.length === 1 ? 'section' : 'sections'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex flex-wrap gap-3">
                  {result.related_sections.map((section, index) => (
                    <Badge 
                      key={index} 
                      className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 border-2 border-emerald-200 dark:border-emerald-800 px-4 py-2 text-sm font-medium hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-colors"
                    >
                      Section {section}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Amendments */}
          {result.amendments_found.length > 0 && (
            <Card className="border-2 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20 rounded-t-lg border-b">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-600 rounded-lg flex items-center justify-center shadow-md">
                      <AlertTriangle className="w-5 h-5 text-white" />
                    </div>
                    <span>Amendments Found</span>
                  </CardTitle>
                  <Badge variant="secondary" className="text-sm">
                    {result.amendments_found.length} {result.amendments_found.length === 1 ? 'amendment' : 'amendments'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  {result.amendments_found.map((amendment, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 bg-white/70 dark:bg-gray-800/70 rounded-lg border-2 border-orange-100 dark:border-orange-900/50 hover:shadow-md transition-shadow">
                      <div className="w-2.5 h-2.5 bg-orange-500 rounded-full mt-2 flex-shrink-0 shadow-sm"></div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-gray-900 dark:text-gray-100 mb-1">{amendment.title}</p>
                        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{amendment.snippet}</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(amendment.source, '_blank')}
                        className="flex-shrink-0 hover:bg-orange-100 dark:hover:bg-orange-900/30 gap-2"
                      >
                        <ExternalLink className="w-4 h-4" />
                        View
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Sources */}
          {result.sources.length > 0 && (
            <Card className="border-2 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-950/20 dark:to-gray-950/20 rounded-t-lg border-b">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="w-10 h-10 bg-gradient-to-br from-slate-500 to-gray-600 rounded-lg flex items-center justify-center shadow-md">
                      <Link2 className="w-5 h-5 text-white" />
                    </div>
                    <span>Sources</span>
                  </CardTitle>
                  <Badge variant="secondary" className="text-sm">
                    {result.sources.length} {result.sources.length === 1 ? 'source' : 'sources'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  {result.sources.map((source, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 bg-white/70 dark:bg-gray-800/70 rounded-lg border-2 border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow">
                      <div className="w-10 h-10 bg-gradient-to-br from-slate-100 to-gray-100 dark:from-slate-800 dark:to-gray-800 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
                        <FileText className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-gray-900 dark:text-gray-100 mb-2 truncate">{source.title}</p>
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className="text-xs text-muted-foreground">{source.domain}</span>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(source.url, '_blank')}
                        className="flex-shrink-0 hover:bg-slate-100 dark:hover:bg-slate-800 gap-2"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Open
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

    </div>
  );
} 