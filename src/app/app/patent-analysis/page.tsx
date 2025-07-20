"use client";
import React, { useState, useEffect } from "react";
import { Search, Gavel, ShieldCheck, AlertTriangle, FileText, Download, Clock, User, FileBarChart } from "lucide-react";
import { API_BASE_URL } from "../../constants";
import { useAuth } from "../../../components/AuthProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const dummyResults = {
  prior: "No exact prior art found. Your invention appears novel based on the provided description.",
  exclusions: "No exclusions detected. Your invention seems eligible for patenting.",
  disclosure: "No public disclosures found. Your invention appears to be non-disclosed.",
};

interface ComprehensiveReport {
  report_id: string;
  report_type: string;
  format: string;
  applicant: string;
  title: string;
  invention_summary: string;
  full_report: string;
  generated_at: string;
  word_count: number;
  character_count: number;
  disclaimer: string;
  user_id: string;
}

interface ReportHistoryItem {
  report_id: string;
  report_type: string;
  invention_title: string;
  applicant_name: string;
  generated_at: string;
  word_count: number;
  character_count: number;
}

interface ReportHistoryResponse {
  reports: ReportHistoryItem[];
  total_count: number;
  user_id: string;
  limit: number;
  offset: number;
}

export default function PatentAnalysisPage() {
  const { getAuthHeaders, isAuthenticated, token } = useAuth();
  const [tab, setTab] = useState<'quick' | 'detailed' | 'history'>('quick');
  
  // Quick Analysis State
  const [desc, setDesc] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<any[] | null>(null);
  
  // Detailed Analysis State
  const [applicantName, setApplicantName] = useState("");
  const [inventionTitle, setInventionTitle] = useState("");
  const [inventionDescription, setInventionDescription] = useState("");
  const [comprehensiveReport, setComprehensiveReport] = useState<ComprehensiveReport | null>(null);
  const [reportLoading, setReportLoading] = useState(false);
  const [reportError, setReportError] = useState<string | null>(null);
  const [streamingReport, setStreamingReport] = useState(false);
  const [streamedReportText, setStreamedReportText] = useState("");
  
  // History State
  const [reportHistory, setReportHistory] = useState<ReportHistoryItem[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [limit] = useState(10);
  
  // Selected Report State
  const [selectedReport, setSelectedReport] = useState<ComprehensiveReport | null>(null);
  const [selectedReportLoading, setSelectedReportLoading] = useState(false);
  const [selectedReportError, setSelectedReportError] = useState<string | null>(null);
  const [showReportModal, setShowReportModal] = useState(false);
  
  const minChars = 50;
  const isValid = desc.trim().length >= minChars;
  const isDetailedValid = applicantName.trim() && inventionTitle.trim() && inventionDescription.trim().length >= minChars;
  const totalPages = Math.ceil(totalCount / limit);

  // Fetch report history when history tab is opened
  useEffect(() => {
    if (tab === 'history') {
      fetchReportHistory();
    }
  }, [tab, currentPage]);

  const fetchReportHistory = async () => {
    if (!isAuthenticated || !token) {
      setHistoryError("Please log in to view your report history.");
      setHistoryLoading(false);
      return;
    }
    
    setHistoryLoading(true);
    setHistoryError(null);
    try {
      const offset = currentPage * limit;
      const url = `${API_BASE_URL}/reports/patent/my-reports?limit=${limit}&offset=${offset}`;
      console.log('Fetching report history from:', url);
      
      const headers = {
        ...getAuthHeaders(),
        'accept': 'application/json',
      };
      console.log('Request headers:', headers);
      
      const res = await fetch(url, {
        method: 'GET',
        headers: headers,
      });
      
      console.log('Response status:', res.status);
      console.log('Response headers:', res.headers);
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error('Error response:', errorText);
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch (e) {
          errorData = { detail: [{ msg: errorText }] };
        }
        throw new Error(errorData?.detail?.[0]?.msg || `HTTP ${res.status}: ${res.statusText}`);
      }
      
      const data: ReportHistoryResponse = await res.json();
      console.log('Success response:', data);
      setReportHistory(data.reports || []);
      setTotalCount(data.total_count || 0);
    } catch (err: any) {
      console.error('Fetch error:', err);
      setHistoryError(err.message || "An error occurred while fetching report history.");
    } finally {
      setHistoryLoading(false);
    }
  };

  const handlePriorArtAnalysis = async () => {
    if (!isValid) return;
    setLoading(true);
    setError(null);
    setResult(null);
    setSearchResults(null);
    try {
      const res = await fetch(`${API_BASE_URL}/patents/search`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          query: desc,
          top_k: 10,
          min_score: 0.3,
          include_full_document: false,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.detail?.[0]?.msg || "Search failed");
      }
      const data = await res.json();
      setSearchResults(data.results || []);
      setResult(null);
    } catch (err: any) {
      setError(err.message || "An error occurred during search.");
    } finally {
      setLoading(false);
    }
  };

  const handleAnalysis = (type: keyof typeof dummyResults) => {
    if (!isValid) return;
    setResult(dummyResults[type]);
  };

  // Simulated streaming for comprehensive report
  const simulateStreaming = async (fullText: string) => {
    setStreamingReport(true);
    setStreamedReportText("");
    for (let i = 1; i <= fullText.length; i++) {
      setStreamedReportText(fullText.slice(0, i));
      await new Promise(res => setTimeout(res, 5)); // Faster streaming for long reports
    }
    setStreamingReport(false);
    setStreamedReportText("");
  };

  const handleComprehensiveReport = async () => {
    if (!isDetailedValid) return;
    setReportLoading(true);
    setReportError(null);
    setComprehensiveReport(null);
    try {
      const res = await fetch(`${API_BASE_URL}/reports/patent/comprehensive`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          invention_description: inventionDescription,
          applicant_name: applicantName,
          invention_title: inventionTitle,
          report_format: "comprehensive"
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.detail?.[0]?.msg || "Report generation failed");
      }
      const data: ComprehensiveReport = await res.json();
      setComprehensiveReport(data);
      // Start streaming the full report
      await simulateStreaming(data.full_report);
    } catch (err: any) {
      setReportError(err.message || "An error occurred during report generation.");
    } finally {
      setReportLoading(false);
    }
  };

  // Function to format the report text with proper markdown rendering
  const formatReportText = (text: string) => {
    return text
      .split('\n')
      .map((line, index) => {
        if (line.startsWith('# ')) {
          return <h1 key={index} className="text-2xl font-bold text-foreground mb-4">{line.substring(2)}</h1>;
        } else if (line.startsWith('## ')) {
          return <h2 key={index} className="text-xl font-bold text-primary mb-3 mt-6">{line.substring(3)}</h2>;
        } else if (line.startsWith('### ')) {
          return <h3 key={index} className="text-lg font-semibold text-accent mb-2 mt-4">{line.substring(4)}</h3>;
        } else if (line.trim() === '') {
          return <br key={index} />;
        } else {
          // Handle bold text formatting anywhere in the line
          const formattedLine = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
          return (
            <p 
              key={index} 
              className="text-foreground mb-2 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: formattedLine }}
            />
          );
        }
      });
  };

  const handleDownloadReport = async (reportId: string, title: string) => {
    try {
         const downloadurl = `${API_BASE_URL}/reports/patent/report/${reportId}/pdf`;
      const res = await fetch(downloadurl, {
        method: "GET",
        headers: getAuthHeaders(),
      });
      if (!res.ok) {
        throw new Error("Download failed");
      }
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_patent_analysis.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err: any) {
      console.error('Download error:', err);
      alert('Failed to download report: ' + err.message);
    }
  };

  const handleReportClick = async (reportId: string) => {
    setSelectedReportLoading(true);
    setSelectedReportError(null);
    setShowReportModal(true);
    try {
      const res = await fetch(`${API_BASE_URL}/reports/patent/report/${reportId}`, {
        method: "GET",
        headers: getAuthHeaders(),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.detail?.[0]?.msg || "Failed to fetch report");
      }
      const data: ComprehensiveReport = await res.json();
      setSelectedReport(data);
    } catch (err: any) {
      setSelectedReportError(err.message || "An error occurred while fetching report details.");
    } finally {
      setSelectedReportLoading(false);
    }
  };

  const handleCloseReportModal = () => {
    setShowReportModal(false);
    setSelectedReport(null);
    setSelectedReportError(null);
    setStreamingReport(false);
    setStreamedReportText("");
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 md:px-8 py-4 flex flex-col gap-6">
      <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Patent Analysis</h1>
      
      <Tabs value={tab} onValueChange={(value) => setTab(value as 'quick' | 'detailed' | 'history')} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="quick">Quick Analysis</TabsTrigger>
          <TabsTrigger value="detailed">Detailed Patent Analysis</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="quick" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Patent Analysis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="desc">Describe your invention:</Label>
                <Textarea
                  id="desc"
                  placeholder="Provide a detailed description of your invention including key features, technical components, functionality, and intended use... (minimum 50 characters)"
                  value={desc}
                  onChange={e => setDesc(e.target.value)}
                  className="min-h-[120px] sm:min-h-[140px]"
                />
                {!isValid && (
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      Minimum 50 characters required. Current: {desc.trim().length}
                    </AlertDescription>
                  </Alert>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Button
                  onClick={handlePriorArtAnalysis}
                  disabled={!isValid || loading}
                  className="flex items-center gap-2"
                >
                  <Search className="w-5 h-5" /> Prior Art Analysis
                </Button>
                <Button
                  onClick={() => handleAnalysis('exclusions')}
                  disabled={!isValid}
                  className="flex items-center gap-2"
                >
                  <Gavel className="w-5 h-5" /> Exclusions Check
                </Button>
                <Button
                  onClick={() => handleAnalysis('disclosure')}
                  disabled={!isValid}
                  className="flex items-center gap-2"
                >
                  <ShieldCheck className="w-5 h-5" /> Disclosure Check
                </Button>
              </div>

              {loading && (
                <Alert>
                  <Search className="h-4 w-4" />
                  <AlertDescription>Searching patents...</AlertDescription>
                </Alert>
              )}

              {error && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {searchResults && (
                <Card>
                  <CardHeader>
                    <CardTitle>Prior Art Results</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {searchResults.length === 0 ? (
                      <p className="text-muted-foreground">No relevant prior art found.</p>
                    ) : (
                      <div className="space-y-4">
                        {searchResults.map((item, idx) => (
                          <div key={idx} className="border-b border-border pb-4 last:border-b-0">
                            <div className="font-semibold text-primary mb-1">{item.title}</div>
                            <div className="text-muted-foreground text-sm mb-1">{item.abstract}</div>
                            <div className="text-xs text-muted-foreground">Application No: {item.application_no} | Year: {item.year} | Score: {item.similarity_score?.toFixed(2)}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {result && (
                <Card>
                  <CardHeader>
                    <CardTitle>Analysis Result</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-foreground">{result}</p>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="detailed" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Detailed Patent Analysis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="applicant">Applicant Name:</Label>
                    <Input
                      id="applicant"
                      type="text"
                      placeholder="Enter applicant name"
                      value={applicantName}
                      onChange={e => setApplicantName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="title">Invention Title:</Label>
                    <Input
                      id="title"
                      type="text"
                      placeholder="Enter invention title"
                      value={inventionTitle}
                      onChange={e => setInventionTitle(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Invention Description:</Label>
                  <Textarea
                    id="description"
                    placeholder="Provide a detailed description of your invention including key features, technical components, functionality, and intended use... (minimum 50 characters)"
                    value={inventionDescription}
                    onChange={e => setInventionDescription(e.target.value)}
                    className="min-h-[120px]"
                  />
                  {inventionDescription.trim().length < minChars && (
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        Minimum 50 characters required. Current: {inventionDescription.trim().length}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </div>

              <Button
                onClick={handleComprehensiveReport}
                disabled={!isDetailedValid || reportLoading}
                className="flex items-center gap-2 w-full md:w-auto"
              >
                <FileText className="w-5 h-5" />
                {reportLoading ? "Generating Comprehensive Report..." : "Generate Comprehensive Report"}
              </Button>

              {reportLoading && (
                <Alert>
                  <FileText className="h-4 w-4" />
                  <AlertDescription>Generating comprehensive patent analysis report...</AlertDescription>
                </Alert>
              )}

              {reportError && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{reportError}</AlertDescription>
                </Alert>
              )}

              {comprehensiveReport && (
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Comprehensive Patent Analysis Report</CardTitle>
                      <Button
                        onClick={() => handleDownloadReport(comprehensiveReport.report_id, comprehensiveReport.title)}
                        className="flex items-center gap-2"
                      >
                        <Download className="w-4 h-4" />
                        Download Report
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Report Header */}
                    <Card className="bg-muted/50">
                      <CardContent className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h3 className="text-lg font-semibold text-foreground mb-2">{comprehensiveReport.title}</h3>
                            <p className="text-muted-foreground text-sm">Applicant: {comprehensiveReport.applicant}</p>
                            <p className="text-muted-foreground text-sm">Generated: {new Date(comprehensiveReport.generated_at).toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground text-sm">Word Count: {comprehensiveReport.word_count.toLocaleString()}</p>
                            <p className="text-muted-foreground text-sm">Character Count: {comprehensiveReport.character_count.toLocaleString()}</p>
                            <p className="text-muted-foreground text-sm">Report ID: {comprehensiveReport.report_id}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Report Content */}
                    <div className="prose prose-invert max-w-none">
                      {streamingReport ? (
                        <div className="space-y-4">
                          {formatReportText(streamedReportText)}
                          <div className="inline-block w-2 h-4 bg-primary animate-pulse"></div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {formatReportText(comprehensiveReport.full_report)}
                        </div>
                      )}
                    </div>

                    {/* Disclaimer */}
                    <Card className="bg-muted/50">
                      <CardContent className="p-4">
                        <h4 className="text-sm font-semibold text-foreground mb-2">Disclaimer:</h4>
                        <p className="text-xs text-muted-foreground">{comprehensiveReport.disclaimer}</p>
                      </CardContent>
                    </Card>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Patent Analysis History</CardTitle>
                <div className="text-muted-foreground text-sm">
                  Total Reports: {totalCount.toLocaleString()}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {historyLoading && (
                <Alert>
                  <FileBarChart className="h-4 w-4" />
                  <AlertDescription>Loading report history...</AlertDescription>
                </Alert>
              )}

              {historyError && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{historyError}</AlertDescription>
                </Alert>
              )}

              {!historyLoading && !historyError && (
                <>
                  {reportHistory.length === 0 ? (
                    <div className="text-center py-8">
                      <FileBarChart className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="text-lg font-semibold mb-2">No Reports Found</h3>
                      <p className="text-sm text-muted-foreground">You haven't generated any patent analysis reports yet.</p>
                      <p className="text-sm mt-2 text-muted-foreground">Go to the "Detailed Patent Analysis" tab to create your first report.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {reportHistory.map((report) => (
                        <Card 
                          key={report.report_id} 
                          className="cursor-pointer hover:bg-muted/50 transition-colors"
                          onClick={() => handleReportClick(report.report_id)}
                        >
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <FileBarChart className="w-5 h-5 text-primary" />
                                  <h3 className="text-lg font-semibold text-foreground">{report.invention_title}</h3>
                                  <Badge variant="secondary">
                                    {report.report_type}
                                  </Badge>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                  <div className="flex items-center gap-2 text-muted-foreground">
                                    <User className="w-4 h-4" />
                                    <span>Applicant: {report.applicant_name}</span>
                                  </div>
                                  <div className="flex items-center gap-2 text-muted-foreground">
                                    <Clock className="w-4 h-4" />
                                    <span>Generated: {new Date(report.generated_at).toLocaleString()}</span>
                                  </div>
                                  <div className="flex items-center gap-2 text-muted-foreground">
                                    <FileText className="w-4 h-4" />
                                    <span>Words: {report.word_count.toLocaleString()}</span>
                                  </div>
                                  <div className="flex items-center gap-2 text-muted-foreground">
                                    <FileText className="w-4 h-4" />
                                    <span>Characters: {report.character_count.toLocaleString()}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-xs">
                                  ID: {report.report_id.slice(0, 8)}...
                                </Badge>
                                <div className="text-muted-foreground text-sm">Click to view details</div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-4 mt-6">
                      <Button
                        variant="outline"
                        onClick={() => setCurrentPage(currentPage - 1)}
                        disabled={currentPage === 0}
                      >
                        Previous
                      </Button>
                      <span className="text-foreground">
                        Page {currentPage + 1} of {totalPages}
                      </span>
                      <Button
                        variant="outline"
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={currentPage + 1 >= totalPages}
                      >
                        Next
                      </Button>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Report Detail Modal */}
      <Dialog open={showReportModal} onOpenChange={setShowReportModal}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle>Patent Analysis Report</DialogTitle>
              <div className="flex items-center gap-2">
                {selectedReport && (
                  <Button
                    onClick={() => handleDownloadReport(selectedReport.report_id, selectedReport.title)}
                    className="flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download PDF
                  </Button>
                )}
              </div>
            </div>
          </DialogHeader>
          
          <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
            {selectedReportLoading && (
              <div className="text-center text-primary font-semibold py-8">
                Loading report details...
              </div>
            )}

            {selectedReportError && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{selectedReportError}</AlertDescription>
              </Alert>
            )}

            {selectedReport && (
              <div className="space-y-6">
                {/* Report Header */}
                <Card className="bg-muted/50">
                  <CardContent className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-lg font-semibold text-foreground mb-2">{selectedReport.title}</h3>
                        <p className="text-muted-foreground text-sm">Applicant: {selectedReport.applicant}</p>
                        <p className="text-muted-foreground text-sm">Generated: {new Date(selectedReport.generated_at).toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-sm">Word Count: {selectedReport.word_count.toLocaleString()}</p>
                        <p className="text-muted-foreground text-sm">Character Count: {selectedReport.character_count.toLocaleString()}</p>
                        <p className="text-muted-foreground text-sm">Report ID: {selectedReport.report_id}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Report Content */}
                <div className="prose prose-invert max-w-none">
                  <div className="space-y-4">
                    {formatReportText(selectedReport.full_report)}
                  </div>
                </div>

                {/* Disclaimer */}
                <Card className="bg-muted/50">
                  <CardContent className="p-4">
                    <h4 className="text-sm font-semibold text-foreground mb-2">Disclaimer:</h4>
                    <p className="text-xs text-muted-foreground">{selectedReport.disclaimer}</p>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 