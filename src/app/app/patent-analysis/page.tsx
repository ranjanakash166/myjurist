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

// Add Exclusions API response type
interface ExclusionsAnalysisResponse {
  overall_verdict: string;
  confidence_score: number;
  section_3a_frivolous?: Record<string, string>;
  section_3b_morality?: Record<string, string>;
  section_3c_scientific_principles?: Record<string, string>;
  section_3d_business_methods?: Record<string, string>;
  section_3e_literary_works?: Record<string, string>;
  section_3f_mental_acts?: Record<string, string>;
  section_3g_information_presentation?: Record<string, string>;
  section_3h_topography?: Record<string, string>;
  section_3i_traditional_knowledge?: Record<string, string>;
  section_3j_known_substances?: Record<string, string>;
  section_3k_admixture?: Record<string, string>;
  section_3l_arrangement?: Record<string, string>;
  section_3m_agriculture?: Record<string, string>;
  section_3n_treatment_methods?: Record<string, string>;
  section_3o_plants_animals?: Record<string, string>;
  section_3p_atomic_energy?: Record<string, string>;
  high_risk_exclusions?: string[];
  medium_risk_exclusions?: string[];
  low_risk_exclusions?: string[];
  mitigation_strategies?: string[];
  claim_drafting_suggestions?: string[];
}

// Add Disclosure API response type
interface DisclosureAnalysisResponse {
  overall_assessment: string;
  confidence_score: number;
  enablement_verdict: string;
  missing_technical_details?: string[];
  unclear_aspects?: string[];
  best_mode_disclosed: string;
  best_mode_suggestions?: string[];
  claim_clarity_score: number;
  vague_terms?: string[];
  overly_broad_aspects?: string[];
  applicable_industries?: string[];
  utility_assessment: string;
  practical_applications?: string[];
  technical_improvements?: string[];
  structural_improvements?: string[];
  example_suggestions?: string[];
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
  // Exclusions API State
  const [exclusionsResult, setExclusionsResult] = useState<ExclusionsAnalysisResponse | null>(null);
  const [exclusionsLoading, setExclusionsLoading] = useState(false);
  const [exclusionsError, setExclusionsError] = useState<string | null>(null);
  // Disclosure API State
  const [disclosureResult, setDisclosureResult] = useState<DisclosureAnalysisResponse | null>(null);
  const [disclosureLoading, setDisclosureLoading] = useState(false);
  const [disclosureError, setDisclosureError] = useState<string | null>(null);
  
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

  // Exclusions API handler
  const handleExclusionsAnalysis = async () => {
    if (!isValid) return;
    setExclusionsLoading(true);
    setExclusionsError(null);
    setExclusionsResult(null);
    try {
      const res = await fetch(
        `https://api.myjurist.io/api/v1/patents/analysis/exclusions/detailed`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders(),
          },
          body: JSON.stringify({
            invention_description: desc,
            section_by_section: true,
            include_case_law: false,
            borderline_analysis: true,
          }),
        }
      );
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.detail?.[0]?.msg || "Exclusions analysis failed");
      }
      const data: ExclusionsAnalysisResponse = await res.json();
      setExclusionsResult(data);
    } catch (err: any) {
      setExclusionsError(err.message || "An error occurred during exclusions analysis.");
    } finally {
      setExclusionsLoading(false);
    }
  };

  // Disclosure API handler
  const handleDisclosureAnalysis = async () => {
    if (!isValid) return;
    setDisclosureLoading(true);
    setDisclosureError(null);
    setDisclosureResult(null);
    try {
      const res = await fetch(
        `https://api.myjurist.io/api/v1/patents/analysis/disclosure/detailed`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders(),
          },
          body: JSON.stringify({
            invention_description: desc,
            check_enablement: true,
            check_best_mode: true,
            check_clarity: true,
            suggest_improvements: true,
          }),
        }
      );
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.detail?.[0]?.msg || "Disclosure analysis failed");
      }
      const data: DisclosureAnalysisResponse = await res.json();
      setDisclosureResult(data);
    } catch (err: any) {
      setDisclosureError(err.message || "An error occurred during disclosure analysis.");
    } finally {
      setDisclosureLoading(false);
    }
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
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-2">Patent Analysis</h1>
      
      <Tabs value={tab} onValueChange={(value) => setTab(value as 'quick' | 'detailed' | 'history')} className="w-full">
        <TabsList className="grid w-full grid-cols-3 h-auto">
          <TabsTrigger value="quick" className="text-xs sm:text-sm py-2 px-1 sm:px-3">Quick</TabsTrigger>
          <TabsTrigger value="detailed" className="text-xs sm:text-sm py-2 px-1 sm:px-3">Detailed</TabsTrigger>
          <TabsTrigger value="history" className="text-xs sm:text-sm py-2 px-1 sm:px-3">History</TabsTrigger>
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

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <Button
                  onClick={handlePriorArtAnalysis}
                  disabled={!isValid || loading}
                  className="flex items-center gap-2 text-sm"
                >
                  <Search className="w-4 h-4" /> 
                  <span className="hidden sm:inline">Prior Art</span>
                  <span className="sm:hidden">Prior Art</span>
                </Button>
                <Button
                  onClick={handleExclusionsAnalysis}
                  disabled={!isValid || exclusionsLoading}
                  className="flex items-center gap-2 text-sm"
                >
                  <Gavel className="w-4 h-4" /> 
                  <span className="hidden sm:inline">Exclusions</span>
                  <span className="sm:hidden">Exclusions</span>
                </Button>
                <Button
                  onClick={handleDisclosureAnalysis}
                  disabled={!isValid || disclosureLoading}
                  className="flex items-center gap-2 text-sm col-span-1 sm:col-span-2 lg:col-span-1"
                >
                  <ShieldCheck className="w-4 h-4" /> 
                  <span className="hidden sm:inline">Disclosure</span>
                  <span className="sm:hidden">Disclosure</span>
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

              {exclusionsLoading && (
                <Alert>
                  <Gavel className="h-4 w-4" />
                  <AlertDescription>Analyzing exclusions...</AlertDescription>
                </Alert>
              )}
              {exclusionsError && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{exclusionsError}</AlertDescription>
                </Alert>
              )}
              {exclusionsResult && (
                <Card>
                  <CardHeader>
                    <CardTitle>Exclusions Analysis Result</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-2">
                      <strong>Overall Verdict:</strong> {exclusionsResult.overall_verdict}
                    </div>
                    <div className="mb-2">
                      <strong>Confidence Score:</strong> {exclusionsResult.confidence_score}
                    </div>
                    {Object.entries(exclusionsResult)
                      .filter(([key]) => key.startsWith('section_3'))
                      .map(([key, value]) => (
                        <div key={key} className="mb-2">
                          <strong>{key.replace(/_/g, ' ').replace('section 3', 'Section 3')}:</strong>
                          <ul className="list-disc ml-6">
                            {value && typeof value === 'object' &&
                              Object.entries(value as Record<string, string>).map(([k, v]) => (
                                <li key={k}><strong>{k}:</strong> {v}</li>
                              ))}
                          </ul>
                        </div>
                      ))}
                    {['high_risk_exclusions', 'medium_risk_exclusions', 'low_risk_exclusions'].map((risk) =>
                      exclusionsResult[risk as keyof ExclusionsAnalysisResponse] && (
                        <div key={risk} className="mb-2">
                          <strong>{risk.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:</strong>
                          <ul className="list-disc ml-6">
                            {(exclusionsResult[risk as keyof ExclusionsAnalysisResponse] as string[]).map((item, idx) => (
                              <li key={idx}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      )
                    )}
                    {exclusionsResult.mitigation_strategies && exclusionsResult.mitigation_strategies.length > 0 && (
                      <div className="mb-2">
                        <strong>Mitigation Strategies:</strong>
                        <ul className="list-disc ml-6">
                          {exclusionsResult.mitigation_strategies.map((item, idx) => (
                            <li key={idx}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {exclusionsResult.claim_drafting_suggestions && exclusionsResult.claim_drafting_suggestions.length > 0 && (
                      <div className="mb-2">
                        <strong>Claim Drafting Suggestions:</strong>
                        <ul className="list-disc ml-6">
                          {exclusionsResult.claim_drafting_suggestions.map((item, idx) => (
                            <li key={idx}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {disclosureLoading && (
                <Alert>
                  <ShieldCheck className="h-4 w-4" />
                  <AlertDescription>Analyzing disclosure...</AlertDescription>
                </Alert>
              )}
              {disclosureError && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{disclosureError}</AlertDescription>
                </Alert>
              )}
              {disclosureResult && (
                <Card>
                  <CardHeader>
                    <CardTitle>Disclosure Analysis Result</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-2">
                      <strong>Overall Assessment:</strong> {disclosureResult.overall_assessment}
                    </div>
                    <div className="mb-2">
                      <strong>Confidence Score:</strong> {disclosureResult.confidence_score}
                    </div>
                    <div className="mb-2">
                      <strong>Enablement Verdict:</strong> {disclosureResult.enablement_verdict}
                    </div>
                    {disclosureResult.missing_technical_details && disclosureResult.missing_technical_details.length > 0 && (
                      <div className="mb-2">
                        <strong>Missing Technical Details:</strong>
                        <ul className="list-disc ml-6">
                          {disclosureResult.missing_technical_details.map((item, idx) => (
                            <li key={idx}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {disclosureResult.unclear_aspects && disclosureResult.unclear_aspects.length > 0 && (
                      <div className="mb-2">
                        <strong>Unclear Aspects:</strong>
                        <ul className="list-disc ml-6">
                          {disclosureResult.unclear_aspects.map((item, idx) => (
                            <li key={idx}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <div className="mb-2">
                      <strong>Best Mode Disclosed:</strong> {disclosureResult.best_mode_disclosed}
                    </div>
                    {disclosureResult.best_mode_suggestions && disclosureResult.best_mode_suggestions.length > 0 && (
                      <div className="mb-2">
                        <strong>Best Mode Suggestions:</strong>
                        <ul className="list-disc ml-6">
                          {disclosureResult.best_mode_suggestions.map((item, idx) => (
                            <li key={idx}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <div className="mb-2">
                      <strong>Claim Clarity Score:</strong> {disclosureResult.claim_clarity_score}
                    </div>
                    {disclosureResult.vague_terms && disclosureResult.vague_terms.length > 0 && (
                      <div className="mb-2">
                        <strong>Vague Terms:</strong>
                        <ul className="list-disc ml-6">
                          {disclosureResult.vague_terms.map((item, idx) => (
                            <li key={idx}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {disclosureResult.overly_broad_aspects && disclosureResult.overly_broad_aspects.length > 0 && (
                      <div className="mb-2">
                        <strong>Overly Broad Aspects:</strong>
                        <ul className="list-disc ml-6">
                          {disclosureResult.overly_broad_aspects.map((item, idx) => (
                            <li key={idx}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {disclosureResult.applicable_industries && disclosureResult.applicable_industries.length > 0 && (
                      <div className="mb-2">
                        <strong>Applicable Industries:</strong>
                        <ul className="list-disc ml-6">
                          {disclosureResult.applicable_industries.map((item, idx) => (
                            <li key={idx}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <div className="mb-2">
                      <strong>Utility Assessment:</strong> {disclosureResult.utility_assessment}
                    </div>
                    {disclosureResult.practical_applications && disclosureResult.practical_applications.length > 0 && (
                      <div className="mb-2">
                        <strong>Practical Applications:</strong>
                        <ul className="list-disc ml-6">
                          {disclosureResult.practical_applications.map((item, idx) => (
                            <li key={idx}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {disclosureResult.technical_improvements && disclosureResult.technical_improvements.length > 0 && (
                      <div className="mb-2">
                        <strong>Technical Improvements:</strong>
                        <ul className="list-disc ml-6">
                          {disclosureResult.technical_improvements.map((item, idx) => (
                            <li key={idx}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {disclosureResult.structural_improvements && disclosureResult.structural_improvements.length > 0 && (
                      <div className="mb-2">
                        <strong>Structural Improvements:</strong>
                        <ul className="list-disc ml-6">
                          {disclosureResult.structural_improvements.map((item, idx) => (
                            <li key={idx}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {disclosureResult.example_suggestions && disclosureResult.example_suggestions.length > 0 && (
                      <div className="mb-2">
                        <strong>Example Suggestions:</strong>
                        <ul className="list-disc ml-6">
                          {disclosureResult.example_suggestions.map((item, idx) => (
                            <li key={idx}>{item}</li>
                          ))}
                        </ul>
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
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
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
                          className="cursor-pointer hover:bg-muted/50 transition-colors w-full max-w-full"
                          onClick={() => handleReportClick(report.report_id)}
                        >
                          <CardContent className="px-2 py-4 sm:p-6 w-full max-w-full">
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 w-full max-w-full">
                              <div className="flex-1 min-w-0 w-full max-w-full">
                                <div className="flex flex-wrap items-center gap-2 mb-2 w-full max-w-full">
                                  <FileBarChart className="w-5 h-5 text-primary flex-shrink-0" />
                                  <h3 className="text-lg font-semibold text-foreground break-words w-full max-w-full">{report.invention_title}</h3>
                                  <Badge variant="secondary" className="whitespace-nowrap">{report.report_type}</Badge>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm w-full max-w-full">
                                  <div className="flex items-center gap-2 text-muted-foreground break-words w-full max-w-full">
                                    <User className="w-4 h-4" />
                                    <span className="break-words w-full max-w-full">Applicant: {report.applicant_name}</span>
                                  </div>
                                  <div className="flex items-center gap-2 text-muted-foreground break-words w-full max-w-full">
                                    <Clock className="w-4 h-4" />
                                    <span className="break-words w-full max-w-full">Generated: {new Date(report.generated_at).toLocaleString()}</span>
                                  </div>
                                  <div className="flex items-center gap-2 text-muted-foreground break-words w-full max-w-full">
                                    <FileText className="w-4 h-4" />
                                    <span className="break-words w-full max-w-full">Words: {report.word_count.toLocaleString()}</span>
                                  </div>
                                  <div className="flex items-center gap-2 text-muted-foreground break-words w-full max-w-full">
                                    <FileText className="w-4 h-4" />
                                    <span className="break-words w-full max-w-full">Characters: {report.character_count.toLocaleString()}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex flex-row sm:flex-col items-center gap-2 flex-shrink-0 mt-2 sm:mt-0">
                                <Badge variant="outline" className="text-xs break-all w-full max-w-[120px] text-center">ID: {report.report_id.slice(0, 8)}...</Badge>
                                <div className="text-muted-foreground text-xs sm:text-sm text-center w-full max-w-[120px]">Click to view details</div>
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