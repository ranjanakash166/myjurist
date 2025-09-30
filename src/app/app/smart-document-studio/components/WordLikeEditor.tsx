'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Undo, 
  Redo, 
  Save, 
  Download, 
  Copy, 
  Bold, 
  Italic, 
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Type,
  FileText
} from 'lucide-react';
import { useDocumentEditorStore } from '@/lib/stores/documentEditorStore';

interface WordLikeEditorProps {
  initialContent?: string;
  onContentChange?: (content: string) => void;
  onSave?: (content: string) => void;
  onDownload?: (content: string) => void;
  className?: string;
}

export function WordLikeEditor({ 
  initialContent = '', 
  onContentChange,
  onSave,
  onDownload,
  className = ''
}: WordLikeEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  
  const {
    content,
    isDirty,
    isLoading,
    error,
    canUndo,
    canRedo,
    updateContent,
    undo,
    redo,
    setError,
    clearError
  } = useDocumentEditorStore();

  // Initialize content
  useEffect(() => {
    if (initialContent && !content) {
      useDocumentEditorStore.getState().setContent(initialContent);
    }
  }, [initialContent, content]);

  // Handle content changes
  const handleContentChange = () => {
    if (editorRef.current) {
      const newContent = editorRef.current.innerHTML;
      updateContent(newContent, 'Manual edit');
      onContentChange?.(newContent);
    }
  };

  // Handle text selection
  const handleSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim()) {
      setSelectedText(selection.toString());
    } else {
      setSelectedText('');
    }
  };

  // Formatting functions
  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    handleContentChange();
  };

  const formatText = (format: 'bold' | 'italic' | 'underline') => {
    execCommand(format);
  };

  const alignText = (alignment: 'left' | 'center' | 'right') => {
    execCommand('justify' + alignment.charAt(0).toUpperCase() + alignment.slice(1));
  };

  const createList = (ordered: boolean = false) => {
    execCommand(ordered ? 'insertOrderedList' : 'insertUnorderedList');
  };

  // Handle keyboard shortcuts
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'z':
          e.preventDefault();
          if (e.shiftKey) {
            redo();
          } else {
            undo();
          }
          break;
        case 'y':
          e.preventDefault();
          redo();
          break;
        case 's':
          e.preventDefault();
          handleSave();
          break;
        case 'b':
          e.preventDefault();
          formatText('bold');
          break;
        case 'i':
          e.preventDefault();
          formatText('italic');
          break;
        case 'u':
          e.preventDefault();
          formatText('underline');
          break;
      }
    }
  };

  const handleSave = () => {
    if (editorRef.current) {
      const content = editorRef.current.innerHTML;
      onSave?.(content);
    }
  };

  const handleDownload = () => {
    if (editorRef.current) {
      const content = editorRef.current.innerHTML;
      onDownload?.(content);
    }
  };

  const handleCopy = async () => {
    if (editorRef.current) {
      const content = editorRef.current.innerText;
      try {
        await navigator.clipboard.writeText(content);
      } catch (err) {
        console.error('Failed to copy text:', err);
      }
    }
  };

  return (
    <div className={`flex flex-col h-full relative ${className}`}>
      {/* Toolbar */}
      <Card className="mb-4">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <FileText className="w-5 h-5" />
              <span>Document Editor</span>
              {isDirty && <Badge variant="outline" className="text-orange-600">Unsaved Changes</Badge>}
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={undo}
                disabled={!canUndo()}
                className="flex items-center space-x-1"
              >
                <Undo className="w-4 h-4" />
                <span>Undo</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={redo}
                disabled={!canRedo()}
                className="flex items-center space-x-1"
              >
                <Redo className="w-4 h-4" />
                <span>Redo</span>
              </Button>
              <Separator orientation="vertical" className="h-6" />
              <Button
                variant="outline"
                size="sm"
                onClick={handleSave}
                disabled={!isDirty}
                className="flex items-center space-x-1"
              >
                <Save className="w-4 h-4" />
                <span>Save</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
                className="flex items-center space-x-1"
              >
                <Download className="w-4 h-4" />
                <span>Download</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                className="flex items-center space-x-1"
              >
                <Copy className="w-4 h-4" />
                <span>Copy</span>
              </Button>
            </div>
          </div>
        </CardHeader>
        
        {/* Formatting Toolbar */}
        <CardContent className="pt-0">
          <div className="flex items-center space-x-2 flex-wrap">
            {/* Text Formatting */}
            <div className="flex items-center space-x-1 border-r pr-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => formatText('bold')}
                className="p-2"
                title="Bold (Ctrl+B)"
              >
                <Bold className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => formatText('italic')}
                className="p-2"
                title="Italic (Ctrl+I)"
              >
                <Italic className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => formatText('underline')}
                className="p-2"
                title="Underline (Ctrl+U)"
              >
                <Underline className="w-4 h-4" />
              </Button>
            </div>

            {/* Alignment */}
            <div className="flex items-center space-x-1 border-r pr-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => alignText('left')}
                className="p-2"
                title="Align Left"
              >
                <AlignLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => alignText('center')}
                className="p-2"
                title="Align Center"
              >
                <AlignCenter className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => alignText('right')}
                className="p-2"
                title="Align Right"
              >
                <AlignRight className="w-4 h-4" />
              </Button>
            </div>

            {/* Lists */}
            <div className="flex items-center space-x-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => createList(false)}
                className="p-2"
                title="Bullet List"
              >
                <List className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => createList(true)}
                className="p-2"
                title="Numbered List"
              >
                <ListOrdered className="w-4 h-4" />
              </Button>
            </div>

            {/* Selection Info */}
            {selectedText && (
              <div className="ml-auto text-sm text-muted-foreground">
                Selected: {selectedText.length} characters
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm">{error}</p>
          <Button
            variant="outline"
            size="sm"
            onClick={clearError}
            className="mt-2"
          >
            Dismiss
          </Button>
        </div>
      )}

      {/* Document Editor */}
      <Card className="flex-1 relative overflow-hidden">
        <CardContent className="p-0 h-full relative">
          <div
            ref={editorRef}
            contentEditable
            className={`
              w-full h-full p-8 min-h-[600px] focus:outline-none
              ${isFocused ? 'ring-2 ring-blue-500 ring-opacity-50' : ''}
              prose prose-lg max-w-none
              font-serif leading-relaxed
              text-gray-900 dark:text-gray-100
              relative z-10 overflow-y-auto
            `}
            style={{
              fontFamily: 'Georgia, "Times New Roman", serif',
              lineHeight: '1.6',
              fontSize: '14px',
              maxHeight: '600px'
            }}
            dangerouslySetInnerHTML={{ __html: content }}
            onInput={handleContentChange}
            onSelect={handleSelection}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyDown={handleKeyDown}
            suppressContentEditableWarning={true}
          />
        </CardContent>
      </Card>

      {/* Status Bar */}
      <div className="mt-2 flex items-center justify-between text-sm text-muted-foreground">
        <div className="flex items-center space-x-4">
          <span>Words: {content.split(/\s+/).filter(word => word.length > 0).length}</span>
          <span>Characters: {content.length}</span>
        </div>
        <div className="flex items-center space-x-2">
          {isLoading && <span>Processing...</span>}
          {isDirty && <span className="text-orange-600">• Unsaved changes</span>}
        </div>
      </div>
    </div>
  );
}
