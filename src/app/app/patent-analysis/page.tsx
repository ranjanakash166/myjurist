"use client";
import React, { useState } from "react";
import { Search, Gavel, ShieldCheck, AlertTriangle } from "lucide-react";
import { API_BASE_URL } from "../../constants";
import { useAuth } from "../../../components/AuthProvider";

const dummyResults = {
  prior: "No exact prior art found. Your invention appears novel based on the provided description.",
  exclusions: "No exclusions detected. Your invention seems eligible for patenting.",
  disclosure: "No public disclosures found. Your invention appears to be non-disclosed.",
};

export default function PatentAnalysisPage() {
  const { getAuthHeaders } = useAuth();
  const [desc, setDesc] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<any[] | null>(null);
  const minChars = 50;
  const isValid = desc.trim().length >= minChars;

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

  return (
    <div className="w-full max-w-3xl mx-auto px-2 sm:px-4 md:px-8 py-4 flex flex-col gap-6">
      <h1 className="text-2xl sm:text-3xl font-bold gradient-text-animate mb-2">Quick Patent Analysis</h1>
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
          className="flex items-center justify-center gap-2 py-4 rounded-lg text-lg font-semibold bg-gradient-to-r from-ai-blue-500 to-ai-purple-500 text-white shadow-lg ai-shadow disabled:opacity-60 transition-all"
          disabled={!isValid || loading}
          onClick={handlePriorArtAnalysis}
        >
          <Search className="w-5 h-5" /> Prior Art Analysis
        </button>
        <button
          className="flex items-center justify-center gap-2 py-4 rounded-lg text-lg font-semibold bg-gradient-to-r from-ai-blue-500 to-ai-purple-500 text-white shadow-lg ai-shadow disabled:opacity-60 transition-all"
          disabled={!isValid}
          onClick={() => handleAnalysis('exclusions')}
        >
          <Gavel className="w-5 h-5" /> Exclusions Check
        </button>
        <button
          className="flex items-center justify-center gap-2 py-4 rounded-lg text-lg font-semibold bg-gradient-to-r from-ai-blue-500 to-ai-purple-500 text-white shadow-lg ai-shadow disabled:opacity-60 transition-all"
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
  );
} 