import React, { useRef } from "react";
import { Paperclip, Upload } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

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
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="w-5 h-5" />
          Document Uploader
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="flex-1 w-full flex items-center gap-3 bg-muted/50 border border-border rounded-lg px-4 py-3 min-h-[48px]">
            <Paperclip className="w-5 h-5 text-muted-foreground" />
            <span className={`truncate text-sm ${file ? 'text-foreground' : 'text-muted-foreground'}`}>
              {file ? file.name : "No file selected"}
            </span>
            {file && (
              <Badge variant="secondary" className="ml-auto">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </Badge>
            )}
          </div>
          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="w-full sm:w-auto"
          >
            {file ? "Change File" : "Choose File"}
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleChange}
            accept=".pdf,.doc,.docx,.txt"
          />
        </div>
        
        <Button
          onClick={onProcess}
          disabled={!file || processing}
          className="w-full"
        >
          {processing ? "Processing..." : "Process Document"}
        </Button>
        
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
} 