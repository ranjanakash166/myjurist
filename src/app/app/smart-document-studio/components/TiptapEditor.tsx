'use client';

import React, { useCallback, useEffect, useState } from 'react';
import './WordDocumentStyles.css';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { TextStyle } from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import Typography from '@tiptap/extension-typography';
import CharacterCount from '@tiptap/extension-character-count';
import Placeholder from '@tiptap/extension-placeholder';
import Gapcursor from '@tiptap/extension-gapcursor';
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
  Underline as UnderlineIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Type,
  FileText,
  Palette,
  Printer,
  Eye,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { useDocumentEditorStore } from '@/lib/stores/documentEditorStore';

interface TiptapEditorProps {
  initialContent?: string;
  onContentChange?: (content: string) => void;
  onSave?: (content: string) => Promise<void>;
  onDownload?: (content: string) => void;
  className?: string;
  contractId?: string;
}

export function TiptapEditor({ 
  initialContent = '', 
  onContentChange,
  onSave,
  onDownload,
  className = '',
  contractId
}: TiptapEditorProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [isPrintView, setIsPrintView] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
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

  // Ensure component only renders on client side
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
      TextStyle,
      Color,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Underline,
      Typography,
      CharacterCount,
      Placeholder.configure({
        placeholder: 'Start typing your document...',
        emptyEditorClass: 'is-editor-empty',
      }),
      Gapcursor,
    ],
    content: initialContent,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      updateContent(html, 'Manual edit');
      onContentChange?.(html);
    },
    editorProps: {
      attributes: {
        class: 'word-document-editor focus:outline-none min-h-[500px] p-8',
        style: `
          font-family: 'Times New Roman', serif;
          font-size: 12pt;
          line-height: 1.15;
          color: #000000;
          background-color: #ffffff;
          margin: 0;
          padding: 1in 1in 1in 1in;
          min-height: 11in;
          width: 8.5in;
          max-width: 8.5in;
          margin: 0 auto;
          box-shadow: 0 0 10px rgba(0,0,0,0.1);
          border: 1px solid #d1d5db;
          white-space: pre-wrap;
          word-wrap: break-word;
          overflow-wrap: break-word;
        `,
      },
      handleKeyDown: (view, event) => {
        // Handle Enter key for proper paragraph breaks
        if (event.key === 'Enter') {
          const { state, dispatch } = view;
          const { selection } = state;
          const { $from } = selection;
          
          // Insert a hard break and create a new paragraph
          const tr = state.tr.insertText('\n\n');
          dispatch(tr);
          return true;
        }
        return false;
      },
    },
  });

  // Update editor content when store content changes
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  // Handle keyboard shortcuts
  useEffect(() => {
    if (!editor) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey) {
        switch (event.key) {
          case 'z':
            event.preventDefault();
            if (event.shiftKey) {
              redo();
            } else {
              undo();
            }
            break;
          case 'y':
            event.preventDefault();
            redo();
            break;
          case 's':
            event.preventDefault();
            handleSave();
            break;
          case 'b':
            event.preventDefault();
            editor.chain().focus().toggleBold().run();
            break;
          case 'i':
            event.preventDefault();
            editor.chain().focus().toggleItalic().run();
            break;
          case 'u':
            event.preventDefault();
            editor.chain().focus().toggleUnderline().run();
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [editor, undo, redo]);

  const handleSave = async () => {
    if (!editor || !contractId) return;
    
    setIsSaving(true);
    setSaveStatus('saving');
    
    try {
      const content = editor.getHTML();
      await onSave?.(content);
      setSaveStatus('success');
      // Reset success status after 3 seconds
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (error) {
      console.error('Save failed:', error);
      setSaveStatus('error');
      setError(error instanceof Error ? error.message : 'Failed to save document');
      // Reset error status after 5 seconds
      setTimeout(() => setSaveStatus('idle'), 5000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownload = () => {
    if (editor) {
      const content = editor.getHTML();
      onDownload?.(content);
    }
  };

  const handleCopy = async () => {
    if (editor) {
      const text = editor.getText();
      try {
        await navigator.clipboard.writeText(text);
      } catch (err) {
        console.error('Failed to copy text:', err);
      }
    }
  };

  if (!isMounted || !editor) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col h-full relative ${className}`}>
      {/* Toolbar */}
      <Card className="mb-4 relative z-10">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <FileText className="w-5 h-5" />
              <span>Document Editor</span>
              {isDirty && <Badge variant="outline" className="text-orange-600">Unsaved Changes</Badge>}
            </CardTitle>
            <div className="flex items-center space-x-2 flex-wrap">
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
                variant={isDirty ? "default" : "outline"}
                size="sm"
                onClick={handleSave}
                disabled={!isDirty || isSaving}
                className="flex items-center space-x-1"
              >
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : saveStatus === 'success' ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Saved!</span>
                  </>
                ) : saveStatus === 'error' ? (
                  <>
                    <XCircle className="w-4 h-4 text-red-500" />
                    <span>Error</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
        
        {/* Formatting Toolbar */}
        <CardContent className="pt-0">
          <div className="space-y-3">
            {/* First Row - Text Formatting and Alignment */}
            <div className="flex items-center space-x-4 flex-wrap">
              {/* Text Formatting */}
              <div className="flex items-center space-x-1 border-r pr-4">
                <Button
                  variant={editor.isActive('bold') ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => editor.chain().focus().toggleBold().run()}
                  className="p-2 h-8 w-8"
                  title="Bold (Ctrl+B)"
                >
                  <Bold className="w-4 h-4" />
                </Button>
                <Button
                  variant={editor.isActive('italic') ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => editor.chain().focus().toggleItalic().run()}
                  className="p-2 h-8 w-8"
                  title="Italic (Ctrl+I)"
                >
                  <Italic className="w-4 h-4" />
                </Button>
                <Button
                  variant={editor.isActive('underline') ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => editor.chain().focus().toggleUnderline().run()}
                  className="p-2 h-8 w-8"
                  title="Underline (Ctrl+U)"
                >
                  <UnderlineIcon className="w-4 h-4" />
                </Button>
              </div>

              {/* Alignment */}
              <div className="flex items-center space-x-1 border-r pr-4">
                <Button
                  variant={editor.isActive({ textAlign: 'left' }) ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => editor.chain().focus().setTextAlign('left').run()}
                  className="p-2 h-8 w-8"
                  title="Align Left"
                >
                  <AlignLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant={editor.isActive({ textAlign: 'center' }) ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => editor.chain().focus().setTextAlign('center').run()}
                  className="p-2 h-8 w-8"
                  title="Align Center"
                >
                  <AlignCenter className="w-4 h-4" />
                </Button>
                <Button
                  variant={editor.isActive({ textAlign: 'right' }) ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => editor.chain().focus().setTextAlign('right').run()}
                  className="p-2 h-8 w-8"
                  title="Align Right"
                >
                  <AlignRight className="w-4 h-4" />
                </Button>
              </div>

              {/* Lists */}
              <div className="flex items-center space-x-1 border-r pr-4">
                <Button
                  variant={editor.isActive('bulletList') ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => editor.chain().focus().toggleBulletList().run()}
                  className="p-2 h-8 w-8"
                  title="Bullet List"
                >
                  <List className="w-4 h-4" />
                </Button>
                <Button
                  variant={editor.isActive('orderedList') ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => editor.chain().focus().toggleOrderedList().run()}
                  className="p-2 h-8 w-8"
                  title="Numbered List"
                >
                  <ListOrdered className="w-4 h-4" />
                </Button>
              </div>

              {/* View Toggle */}
              <div className="flex items-center space-x-1">
                <Button
                  variant={isPrintView ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setIsPrintView(true)}
                  className="p-2 h-8 w-8"
                  title="Print Layout"
                >
                  <Printer className="w-4 h-4" />
                </Button>
                <Button
                  variant={!isPrintView ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setIsPrintView(false)}
                  className="p-2 h-8 w-8"
                  title="Web Layout"
                >
                  <Eye className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Second Row - Headings */}
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-muted-foreground">Headings:</span>
              <div className="flex items-center space-x-1">
                <Button
                  variant={editor.isActive('heading', { level: 1 }) ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                  className="px-3 h-8 text-xs"
                  title="Heading 1"
                >
                  H1
                </Button>
                <Button
                  variant={editor.isActive('heading', { level: 2 }) ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                  className="px-3 h-8 text-xs"
                  title="Heading 2"
                >
                  H2
                </Button>
                <Button
                  variant={editor.isActive('heading', { level: 3 }) ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                  className="px-3 h-8 text-xs"
                  title="Heading 3"
                >
                  H3
                </Button>
              </div>

              {/* Selection Info */}
              {editor.state.selection && !editor.state.selection.empty && (
                <div className="ml-auto text-sm text-muted-foreground">
                  Selected: {editor.state.doc.textBetween(editor.state.selection.from, editor.state.selection.to).length} characters
                </div>
              )}
            </div>
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
          <div className={`h-full overflow-y-auto ${isPrintView ? 'bg-gray-100 dark:bg-gray-800 p-4' : 'p-0'}`}>
            <EditorContent 
              editor={editor} 
              className={`word-document-container ${isPrintView ? 'print-view' : 'normal-view'}`}
            />
          </div>
        </CardContent>
      </Card>

      {/* Status Bar */}
      <div className="mt-2 flex items-center justify-between text-sm text-muted-foreground">
        <div className="flex items-center space-x-4">
          <span>Words: {editor?.storage?.characterCount?.words() || 0}</span>
          <span>Characters: {editor?.storage?.characterCount?.characters() || 0}</span>
          {contractId && (
            <span className="text-blue-600">Contract ID: {contractId.slice(0, 8)}...</span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          {isLoading && <span>Processing...</span>}
          {isSaving && <span className="text-blue-600">Saving...</span>}
          {saveStatus === 'success' && <span className="text-green-600">✓ Saved successfully</span>}
          {saveStatus === 'error' && <span className="text-red-600">✗ Save failed</span>}
          {isDirty && !isSaving && saveStatus !== 'success' && (
            <span className="text-orange-600">• Unsaved changes</span>
          )}
        </div>
      </div>
    </div>
  );
}
