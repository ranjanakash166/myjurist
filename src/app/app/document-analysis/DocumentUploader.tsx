import React, { useRef } from "react";
import { Paperclip } from "lucide-react";

interface DocumentUploaderProps {
  file: File | null;
  onFileChange: (file: File | null) => void;
  onProcess: () => void;
  processing: boolean;
  error?: string | null;
}

export default function DocumentUploader({ file, onFileChange, onProcess, processing, error }: DocumentUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileChange(e.target.files[0]);
    }
  };

  return (
    <div className="glass-effect rounded-2xl p-8 flex flex-col items-center justify-center w-full">
      <h2 className="text-xl font-bold gradient-text-animate mb-6">Document Uploader</h2>
      <div className="w-full flex flex-col sm:flex-row items-center gap-4 mb-4">
        <div className="flex-1 w-full flex items-center gap-3 bg-slate-800/60 border border-ai-blue-500/30 rounded-lg px-4 py-3 min-h-[48px]">
          <Paperclip className="w-6 h-6 text-ai-blue-400" />
          <span className={`truncate text-base ${file ? 'text-white' : 'text-slate-400'}`}>{file ? file.name : "No file selected"}</span>
        </div>
        <button
          className="px-5 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors w-full sm:w-auto"
          onClick={() => fileInputRef.current?.click()}
          type="button"
        >
          {file ? "Change File" : "Choose File"}
        </button>
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleChange}
        />
      </div>
      <button
        className="w-full max-w-md py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 mt-2"
        onClick={onProcess}
        disabled={!file || processing}
      >
        {processing ? "Processing..." : "Process Document"}
      </button>
      {error && (
        <div className="mt-4 w-full bg-red-900/80 text-red-300 rounded-lg px-4 py-3 text-center">{error}</div>
      )}
    </div>
  );
} 