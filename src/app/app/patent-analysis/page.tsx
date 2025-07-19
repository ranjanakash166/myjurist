"use client";
import React, { useState, useEffect } from "react";
import { Search, Gavel, ShieldCheck, AlertTriangle, FileText, Download, Clock, User, FileBarChart } from "lucide-react";
import { API_BASE_URL } from "../../constants";
import { useAuth } from "../../../components/AuthProvider";

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
          return <h1 key={index} className="text-2xl font-bold text-black dark:text-white mb-4">{line.substring(2)}</h1>;
        } else if (line.startsWith('## ')) {
          return <h2 key={index} className="text-xl font-bold text-blue-600 dark:text-ai-blue-400 mb-3 mt-6">{line.substring(3)}</h2>;
        } else if (line.startsWith('### ')) {
          return <h3 key={index} className="text-lg font-semibold text-purple-600 dark:text-ai-purple-400 mb-2 mt-4">{line.substring(4)}</h3>;
        } else if (line.trim() === '') {
          return <br key={index} />;
        } else {
          // Handle bold text formatting anywhere in the line
          const formattedLine = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
          return (
            <p 
              key={index} 
              className="text-black dark:text-slate-200 mb-2 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: formattedLine }}
            />
          );
        }
      });
  };

  const handleDownloadReport = async (reportId: string, title: string) => {
    if (!isAuthenticated || !token) {
      alert("Please log in to download reports.");
      return;
    }
    
    try {
      const url = `${API_BASE_URL}/reports/patent/report/${reportId}/pdf`;
      console.log('Downloading PDF from:', url);
      
      const headers = {
        ...getAuthHeaders(),
        'accept': 'application/pdf',
      };
      console.log('Request headers:', headers);
      
      const res = await fetch(url, {
        method: 'GET',
        headers: headers,
      });
      
      console.log('Response status:', res.status);
      
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
      
      const blob = await res.blob();
      const url_download = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url_download;
      a.download = `${title.replace(/[^a-zA-Z0-9]/g, '_')}_Patent_Analysis_Report.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url_download);
      document.body.removeChild(a);
    } catch (err: any) {
      console.error('Download error:', err);
      alert(`Failed to download PDF: ${err.message}`);
    }
  };

  const totalPages = Math.ceil(totalCount / limit);

  const handleReportClick = async (reportId: string) => {
    if (!isAuthenticated || !token) {
      setSelectedReportError("Please log in to view report details.");
      return;
    }
    
    setSelectedReportLoading(true);
    setSelectedReportError(null);
    setSelectedReport(null);
    setShowReportModal(true);
    
    try {
      const url = `${API_BASE_URL}/reports/patent/report/${reportId}`;
      console.log('Fetching detailed report from:', url);
      
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
      
      const data: ComprehensiveReport = await res.json();
      console.log('Success response:', data);
      setSelectedReport(data);
    } catch (err: any) {
      console.error('Fetch error:', err);
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
      <h1 className="text-2xl sm:text-3xl font-bold gradient-text-animate mb-2">Patent Analysis</h1>
      
      {/* Tabs */}
      <div className="flex gap-4 mb-2">
        <button
          className={`px-4 py-2 rounded-t-lg font-semibold transition-all ${tab === 'quick' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300'}`}
          onClick={() => setTab('quick')}
        >
          Quick Analysis
        </button>
        <button
          className={`px-4 py-2 rounded-t-lg font-semibold transition-all ${tab === 'detailed' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300'}`}
          onClick={() => setTab('detailed')}
        >
          Detailed Patent Analysis
        </button>
        <button
          className={`px-4 py-2 rounded-t-lg font-semibold transition-all ${tab === 'history' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300'}`}
          onClick={() => setTab('history')}
        >
          History
        </button>
      </div>

      {/* Quick Analysis Tab */}
      {tab === 'quick' && (
        <div className="space-y-6">
          <label className="text-base sm:text-lg font-medium mb-1" htmlFor="desc">Describe your invention:</label>
          <textarea
            id="desc"
            className="w-full min-h-[120px] sm:min-h-[140px] rounded-lg bg-slate-800 border border-ai-blue-500/20 focus:border-ai-blue-400/40 focus:outline-none text-white p-4 text-base mb-2 resize-y"
            placeholder="Provide a detailed description of your invention including key features, technical components, functionality, and intended use... (minimum 50 characters)"
            value={desc}
            onChange={e => setDesc(e.target.value)}
          />
          {!isValid && (
            <div className="flex items-center gap-2 bg-yellow-900/80 text-yellow-300 rounded-lg px-4 py-3 mb-2">
              <AlertTriangle className="w-5 h-5" />
              <span>Minimum 50 characters required. Current: {desc.trim().length}</span>
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
            <button
              className="flex items-center justify-center gap-2 py-4 rounded-lg text-lg font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-60"
              disabled={!isValid || loading}
              onClick={handlePriorArtAnalysis}
            >
              <Search className="w-5 h-5" /> Prior Art Analysis
            </button>
            <button
              className="flex items-center justify-center gap-2 py-4 rounded-lg text-lg font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-60"
              disabled={!isValid}
              onClick={() => handleAnalysis('exclusions')}
            >
              <Gavel className="w-5 h-5" /> Exclusions Check
            </button>
            <button
              className="flex items-center justify-center gap-2 py-4 rounded-lg text-lg font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-60"
              disabled={!isValid}
              onClick={() => handleAnalysis('disclosure')}
            >
              <ShieldCheck className="w-5 h-5" /> Disclosure Check
            </button>
          </div>
          {loading && (
            <div className="glass-effect mt-6 p-6 rounded-xl shadow-lg text-center text-ai-blue-400 font-semibold">Searching patents...</div>
          )}
          {error && (
            <div className="glass-effect mt-6 p-6 rounded-xl shadow-lg text-center text-red-400 font-semibold">{error}</div>
          )}
          {searchResults && (
            <div className="glass-effect mt-6 p-6 rounded-xl shadow-lg">
              <h2 className="text-xl font-bold gradient-text-animate mb-2">Prior Art Results</h2>
              {searchResults.length === 0 ? (
                <div className="text-slate-400">No relevant prior art found.</div>
              ) : (
                <ul className="space-y-4">
                  {searchResults.map((item, idx) => (
                    <li key={idx} className="border-b border-slate-700 pb-4 last:border-b-0">
                      <div className="font-semibold text-ai-blue-400 mb-1">{item.title}</div>
                      <div className="text-slate-300 text-sm mb-1">{item.abstract}</div>
                      <div className="text-xs text-slate-500">Application No: {item.application_no} | Year: {item.year} | Score: {item.similarity_score?.toFixed(2)}</div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
          {result && (
            <div className="glass-effect mt-6 p-6 rounded-xl shadow-lg">
              <h2 className="text-xl font-bold gradient-text-animate mb-2">Analysis Result</h2>
              <p className="text-slate-200 text-base">{result}</p>
            </div>
          )}
        </div>
      )}

      {/* Detailed Patent Analysis Tab */}
      {tab === 'detailed' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Input Fields */}
            <div className="space-y-4">
              <div>
                <label className="text-base font-medium mb-2 block" htmlFor="applicant">Applicant Name:</label>
                <input
                  id="applicant"
                  type="text"
                  className="w-full rounded-lg bg-slate-800 border border-ai-blue-500/20 focus:border-ai-blue-400/40 focus:outline-none text-white p-3"
                  placeholder="Enter applicant name"
                  value={applicantName}
                  onChange={e => setApplicantName(e.target.value)}
                />
              </div>
              <div>
                <label className="text-base font-medium mb-2 block" htmlFor="title">Invention Title:</label>
                <input
                  id="title"
                  type="text"
                  className="w-full rounded-lg bg-slate-800 border border-ai-blue-500/20 focus:border-ai-blue-400/40 focus:outline-none text-white p-3"
                  placeholder="Enter invention title"
                  value={inventionTitle}
                  onChange={e => setInventionTitle(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="text-base font-medium mb-2 block" htmlFor="description">Invention Description:</label>
              <textarea
                id="description"
                className="w-full min-h-[120px] rounded-lg bg-slate-800 border border-ai-blue-500/20 focus:border-ai-blue-400/40 focus:outline-none text-white p-3 resize-y"
                placeholder="Provide a detailed description of your invention including key features, technical components, functionality, and intended use... (minimum 50 characters)"
                value={inventionDescription}
                onChange={e => setInventionDescription(e.target.value)}
              />
              {inventionDescription.trim().length < minChars && (
                <div className="flex items-center gap-2 bg-yellow-900/80 text-yellow-300 rounded-lg px-3 py-2 mt-2 text-sm">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Minimum 50 characters required. Current: {inventionDescription.trim().length}</span>
                </div>
              )}
            </div>
          </div>

          <button
            className="flex items-center justify-center gap-2 py-4 px-8 rounded-lg text-lg font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-60 w-full md:w-auto"
            disabled={!isDetailedValid || reportLoading}
            onClick={handleComprehensiveReport}
          >
            <FileText className="w-5 h-5" />
            {reportLoading ? "Generating Comprehensive Report..." : "Generate Comprehensive Report"}
          </button>

          {reportLoading && (
            <div className="glass-effect mt-6 p-6 rounded-xl shadow-lg text-center text-ai-blue-400 font-semibold">
              Generating comprehensive patent analysis report...
            </div>
          )}

          {reportError && (
            <div className="glass-effect mt-6 p-6 rounded-xl shadow-lg text-center text-red-400 font-semibold">
              {reportError}
            </div>
          )}

          {comprehensiveReport && (
            <div className="glass-effect mt-6 p-6 rounded-xl shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold gradient-text-animate">Comprehensive Patent Analysis Report</h2>
                <button
                  onClick={() => handleDownloadReport(comprehensiveReport.report_id, comprehensiveReport.title)}
                  className="flex items-center gap-2 px-4 py-2 bg-ai-blue-500 hover:bg-ai-blue-600 text-white rounded-lg transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Download Report
                </button>
              </div>
              
              {/* Report Header */}
              <div className="bg-slate-800/60 rounded-lg p-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">{comprehensiveReport.title}</h3>
                    <p className="text-slate-400 text-sm">Applicant: {comprehensiveReport.applicant}</p>
                    <p className="text-slate-400 text-sm">Generated: {new Date(comprehensiveReport.generated_at).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm">Word Count: {comprehensiveReport.word_count.toLocaleString()}</p>
                    <p className="text-slate-400 text-sm">Character Count: {comprehensiveReport.character_count.toLocaleString()}</p>
                    <p className="text-slate-400 text-sm">Report ID: {comprehensiveReport.report_id}</p>
                  </div>
                </div>
              </div>

              {/* Report Content */}
              <div className="prose prose-invert max-w-none">
                {streamingReport ? (
                  <div className="space-y-4">
                    {formatReportText(streamedReportText)}
                    <div className="inline-block w-2 h-4 bg-ai-blue-400 animate-pulse"></div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {formatReportText(comprehensiveReport.full_report)}
                  </div>
                )}
              </div>

              {/* Disclaimer */}
              <div className="mt-8 p-4 bg-slate-800/60 rounded-lg">
                <h4 className="text-sm font-semibold text-slate-300 mb-2">Disclaimer:</h4>
                <p className="text-xs text-slate-400">{comprehensiveReport.disclaimer}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* History Tab */}
      {tab === 'history' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold gradient-text-animate">Patent Analysis History</h2>
            <div className="text-slate-400 text-sm">
              Total Reports: {totalCount.toLocaleString()}
            </div>
          </div>

          {historyLoading && (
            <div className="glass-effect mt-6 p-6 rounded-xl shadow-lg text-center text-ai-blue-400 font-semibold">
              Loading report history...
            </div>
          )}

          {historyError && (
            <div className="glass-effect mt-6 p-6 rounded-xl shadow-lg text-center text-red-400 font-semibold">
              {historyError}
            </div>
          )}

          {!historyLoading && !historyError && (
            <>
              {reportHistory.length === 0 ? (
                <div className="glass-effect mt-6 p-6 rounded-xl shadow-lg text-center text-slate-400">
                  <FileBarChart className="w-16 h-16 mx-auto mb-4 text-slate-600" />
                  <h3 className="text-lg font-semibold mb-2">No Reports Found</h3>
                  <p className="text-sm">You haven't generated any patent analysis reports yet.</p>
                  <p className="text-sm mt-2">Go to the "Detailed Patent Analysis" tab to create your first report.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reportHistory.map((report) => (
                    <div 
                      key={report.report_id} 
                      className="glass-effect p-6 rounded-xl shadow-lg cursor-pointer hover:bg-slate-700/30 transition-colors"
                      onClick={() => handleReportClick(report.report_id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <FileBarChart className="w-5 h-5 text-ai-blue-400" />
                            <h3 className="text-lg font-semibold text-white">{report.invention_title}</h3>
                            <span className="px-2 py-1 bg-ai-blue-500/20 text-ai-blue-400 text-xs rounded-full">
                              {report.report_type}
                            </span>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div className="flex items-center gap-2 text-slate-400">
                              <User className="w-4 h-4" />
                              <span>Applicant: {report.applicant_name}</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-400">
                              <Clock className="w-4 h-4" />
                              <span>Generated: {new Date(report.generated_at).toLocaleString()}</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-400">
                              <FileText className="w-4 h-4" />
                              <span>Words: {report.word_count.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-400">
                              <FileText className="w-4 h-4" />
                              <span>Characters: {report.character_count.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-500 bg-slate-800/60 px-2 py-1 rounded">
                            ID: {report.report_id.slice(0, 8)}...
                          </span>
                          <div className="text-slate-400 text-sm">Click to view details</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-6">
                  <button
                    className="px-4 py-2 rounded-lg bg-slate-700 text-white disabled:opacity-50 hover:bg-slate-600 transition-colors"
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 0}
                  >
                    Previous
                  </button>
                  <span className="text-slate-300">
                    Page {currentPage + 1} of {totalPages}
                  </span>
                  <button
                    className="px-4 py-2 rounded-lg bg-slate-700 text-white disabled:opacity-50 hover:bg-slate-600 transition-colors"
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage + 1 >= totalPages}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Report Detail Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-slate-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Patent Analysis Report</h2>
              <div className="flex items-center gap-2">
                {selectedReport && (
                  <button
                    onClick={() => handleDownloadReport(selectedReport.report_id, selectedReport.title)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Download PDF
                  </button>
                )}
                <button
                  onClick={handleCloseReportModal}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              {selectedReportLoading && (
                <div className="text-center text-blue-600 dark:text-ai-blue-400 font-semibold py-8">
                  Loading report details...
                </div>
              )}

              {selectedReportError && (
                <div className="text-center text-red-600 dark:text-red-400 font-semibold py-8">
                  {selectedReportError}
                </div>
              )}

              {selectedReport && (
                <div className="space-y-6">
                  {/* Report Header */}
                  <div className="bg-gray-50 dark:bg-slate-800/60 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{selectedReport.title}</h3>
                        <p className="text-gray-600 dark:text-slate-400 text-sm">Applicant: {selectedReport.applicant}</p>
                        <p className="text-gray-600 dark:text-slate-400 text-sm">Generated: {new Date(selectedReport.generated_at).toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 dark:text-slate-400 text-sm">Word Count: {selectedReport.word_count.toLocaleString()}</p>
                        <p className="text-gray-600 dark:text-slate-400 text-sm">Character Count: {selectedReport.character_count.toLocaleString()}</p>
                        <p className="text-gray-600 dark:text-slate-400 text-sm">Report ID: {selectedReport.report_id}</p>
                      </div>
                    </div>
                  </div>

                  {/* Report Content */}
                  <div className="prose prose-gray dark:prose-invert max-w-none">
                    <div className="space-y-4">
                      {formatReportText(selectedReport.full_report)}
                    </div>
                  </div>

                  {/* Disclaimer */}
                  <div className="p-4 bg-gray-50 dark:bg-slate-800/60 rounded-lg">
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2">Disclaimer:</h4>
                    <p className="text-xs text-gray-600 dark:text-slate-400">{selectedReport.disclaimer}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 