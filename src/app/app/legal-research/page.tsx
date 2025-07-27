"use client";
import React, { useState } from "react";
import { Search, FileText, Clock, TrendingUp, BookOpen, Filter, Download, Copy, ExternalLink, AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "../../../components/AuthProvider";
import { searchLegalResearch, LegalResearchRequest, LegalResearchResponse, SearchResult } from "@/lib/legalResearchApi";
import SimpleMarkdownRenderer from "../../../components/SimpleMarkdownRenderer";
import { toast } from '@/hooks/use-toast';

export default function LegalResearchPage() {
  const { getAuthHeaders } = useAuth();
  const [query, setQuery] = useState("");
  const [searchType, setSearchType] = useState<"general" | "specific">("general");
  const [topK, setTopK] = useState(5);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<LegalResearchResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);
    setError(null);
    
    try {
      const authHeaders = getAuthHeaders();
      const authToken = authHeaders.Authorization?.replace('Bearer ', '') || '';
      
      const request: LegalResearchRequest = {
        query: query.trim(),
        top_k: topK,
        search_type: searchType,
      };

      const response = await searchLegalResearch(request, authToken);
      setSearchResults(response);
      
      // Add to search history
      if (!searchHistory.includes(query.trim())) {
        setSearchHistory(prev => [query.trim(), ...prev.slice(0, 9)]);
      }
      
      toast({
        title: "Search completed",
        description: `Found ${response.total_results} results in ${response.search_time_ms}ms`,
      });
    } catch (err: any) {
      setError(err.message || "An error occurred during search");
      toast({
        title: "Search failed",
        description: err.message || "An error occurred during search",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleCopyContent = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      toast({
        title: "Copied to clipboard",
        description: "Content has been copied to your clipboard",
      });
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Failed to copy content to clipboard",
        variant: "destructive",
      });
    }
  };

  const handleQuickSearch = (quickQuery: string) => {
    setQuery(quickQuery);
  };

  const formatFileName = (filePath: string) => {
    const parts = filePath.split('/');
    return parts[parts.length - 1]?.replace('.md', '') || filePath;
  };

  const getSimilarityColor = (score: number) => {
    if (score >= 0.8) return "text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20";
    if (score >= 0.6) return "text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/20";
    return "text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/20";
  };

  const quickSearchQueries = [
    "financial irregularities",
    "fraudulent trading",
    "insolvency proceedings",
    "corporate governance",
    "contract disputes",
    "intellectual property",
    "regulatory compliance",
    "employment law",
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Legal Research</h1>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Search through our comprehensive legal database to find relevant case law, regulations, and legal precedents
        </p>
      </div>

      {/* Search Form */}
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Search Legal Database
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="Enter your legal research query..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="h-12 text-base"
                  disabled={isSearching}
                />
              </div>
              <Button 
                type="submit" 
                className="h-12 px-8"
                disabled={isSearching || !query.trim()}
              >
                {isSearching ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Searching...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Search className="w-4 h-4" />
                    Search
                  </div>
                )}
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-2">Search Type</label>
                <Select value={searchType} onValueChange={(value: "general" | "specific") => setSearchType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General Search</SelectItem>
                    <SelectItem value="specific">Specific Search</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium mb-2">Number of Results</label>
                <Select value={topK.toString()} onValueChange={(value) => setTopK(parseInt(value))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3">3 results</SelectItem>
                    <SelectItem value="5">5 results</SelectItem>
                    <SelectItem value="10">10 results</SelectItem>
                    <SelectItem value="15">15 results</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </form>

          {/* Quick Search Suggestions */}
          <div className="mt-6 pt-6 border-t">
            <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Popular Searches
            </h3>
            <div className="flex flex-wrap gap-2">
              {quickSearchQueries.map((quickQuery, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickSearch(quickQuery)}
                  className="text-xs"
                >
                  {quickQuery}
                </Button>
              ))}
            </div>
          </div>

          {/* Search History */}
          {searchHistory.length > 0 && (
            <div className="mt-4 pt-4 border-t">
              <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Recent Searches
              </h3>
              <div className="flex flex-wrap gap-2">
                {searchHistory.map((historyQuery, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    size="sm"
                    onClick={() => handleQuickSearch(historyQuery)}
                    className="text-xs"
                  >
                    {historyQuery}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Alert variant="destructive" className="max-w-4xl mx-auto">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Search Results */}
      {searchResults && (
        <div className="space-y-6">
          {/* Results Header */}
          <Card className="max-w-4xl mx-auto">
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-foreground">
                    Search Results for "{searchResults.query}"
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Found {searchResults.total_results} results in {searchResults.search_time_ms}ms
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {searchResults.index_stats.files_indexed} files indexed
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {searchResults.index_stats.total_chunks} chunks
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results List */}
          <div className="space-y-4 max-w-4xl mx-auto">
            {searchResults.results.map((result, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader className="pb-3">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <FileText className="w-4 h-4 text-primary" />
                        <h3 className="font-semibold text-foreground truncate" title={result.title}>
                          {result.title}
                        </h3>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Filter className="w-3 h-3" />
                          {formatFileName(result.source_file)}
                        </span>
                        {result.section_header && (
                          <span className="flex items-center gap-1">
                            <BookOpen className="w-3 h-3" />
                            {result.section_header}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" />
                          Chunk {result.chunk_index}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Badge className={`text-xs ${getSimilarityColor(result.similarity_score)}`}>
                        {(result.similarity_score * 100).toFixed(1)}% match
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopyContent(result.content)}
                        className="h-8 w-8 p-0"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="bg-muted/50 rounded-lg p-4 border">
                    <SimpleMarkdownRenderer 
                      content={result.content} 
                      className="text-sm leading-relaxed"
                    />
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t">
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>Document ID: {result.document_id.slice(0, 8)}...</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCopyContent(result.content)}
                        className="h-8 text-xs"
                      >
                        <Copy className="w-3 h-3 mr-1" />
                        Copy
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 text-xs"
                      >
                        <ExternalLink className="w-3 h-3 mr-1" />
                        View Source
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* No Results */}
          {searchResults.results.length === 0 && (
            <Card className="max-w-4xl mx-auto">
              <CardContent className="pt-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                  <Search className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No results found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search terms or using different keywords
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Empty State */}
      {!searchResults && !isSearching && (
        <Card className="max-w-4xl mx-auto">
          <CardContent className="pt-6 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Start Your Legal Research</h3>
            <p className="text-muted-foreground mb-4">
              Enter a query above to search through our comprehensive legal database
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {quickSearchQueries.slice(0, 4).map((quickQuery, index) => (
                <Button
                  key={index}
                  variant="outline"
                  onClick={() => handleQuickSearch(quickQuery)}
                  className="text-sm"
                >
                  {quickQuery}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 