"use client";
import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../../../components/AuthProvider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Loader2, ExternalLink, CheckCircle, AlertCircle } from "lucide-react";
import { fetchRegulatorySuggestions, submitRegulatoryQuery, RegulatoryQueryResponse, RegulatoryAmendment } from "@/lib/regulatoryComplianceApi";
import { useToast } from "@/hooks/use-toast";
import SimpleMarkdownRenderer from "@/components/SimpleMarkdownRenderer";

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

  const formatConfidenceScore = (score: number) => {
    return `${(score * 100).toFixed(1)}%`;
  };

  const getConfidenceColor = (score: number) => {
    if (score >= 0.7) return "text-green-600";
    if (score >= 0.5) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Regulatory Compliance</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Search and analyze regulatory compliance information. Get detailed answers about laws, 
          regulations, and legal requirements with AI-powered insights.
        </p>
      </div>

      {/* Search Section */}
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Search Regulatory Compliance
          </CardTitle>
          <CardDescription>
            Enter your query or select from suggestions to get regulatory compliance information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Input
              ref={inputRef}
              type="text"
              placeholder="e.g., Define 'contract' under Indian Contract Act, 1872"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="pr-10"
            />
            {isLoading && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
              </div>
            )}
            
            {/* Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div
                ref={suggestionsRef}
                className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto"
              >
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full text-left px-4 py-3 hover:bg-accent transition-colors border-b border-border last:border-b-0"
                  >
                    <div className="flex items-center gap-2">
                      <Search className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{suggestion}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting || !query.trim()}
            className="w-full"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Search className="w-4 h-4 mr-2" />
                Regulatory Compliance Check
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Results Section */}
      {result && (
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                Analysis Results
              </CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="outline">
                  Confidence: <span className={getConfidenceColor(result.confidence_score)}>
                    {formatConfidenceScore(result.confidence_score)}
                  </span>
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Answer */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Answer</h3>
              <SimpleMarkdownRenderer content={result.answer} />
            </div>

            <Separator />

            {/* Related Sections */}
            {result.related_sections.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Related Sections</h3>
                <div className="flex flex-wrap gap-2">
                  {result.related_sections.map((section, index) => (
                    <Badge key={index} variant="secondary">
                      Section {section}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Amendments */}
            {result.amendments_found.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Amendments Found</h3>
                <div className="space-y-3">
                  {result.amendments_found.map((amendment, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm">{amendment.title}</p>
                          <p className="text-xs text-muted-foreground mt-1">{amendment.snippet}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(amendment.source, '_blank')}
                          className="ml-2 flex-shrink-0"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Separator />

            {/* Sources */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Sources</h3>
              <div className="space-y-2">
                {result.sources.map((source, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{source.title}</p>
                      <p className="text-xs text-muted-foreground">{source.domain}</p>
                      <p className="text-xs text-muted-foreground">Relevance: {source.relevance}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(source.url, '_blank')}
                      className="ml-2"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Info Section */}
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            How to Use
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold">Search Tips:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Be specific with your legal questions</li>
                <li>• Include act names and years when relevant</li>
                <li>• Ask about specific sections or provisions</li>
                <li>• Use natural language for complex queries</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">Example Queries:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• "Define contract under Indian Contract Act"</li>
                <li>• "What is section 1 of Companies Act, 2013?"</li>
                <li>• "Amendments to Income Tax Act, 1961"</li>
                <li>• "Sections of Indian Contract Act"</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 