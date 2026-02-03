"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useEditor, Tiptap, useTiptap } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TurndownService from "turndown";
import { Loader2, Bold, Italic, List, ListOrdered, Heading2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getDraftContractDocxBlob, updateDraftContract } from "@/lib/smartDraftingApi";
import mammoth from "mammoth";
import { toast } from "@/hooks/use-toast";

/** Convert editor HTML to Markdown-style string so API gets original format (not HTML) for PDF/DOCX. */
function htmlToMarkdownString(html: string): string {
  const turndown = new TurndownService({
    headingStyle: "atx",
    bulletListMarker: "*",
    hr: "---",
  });
  return turndown.turndown(html).trim();
}

interface ContractEditorProps {
  contractId: string | null;
  getAuthHeaders: () => Record<string, string>;
}

function EditorToolbar({
  contractId,
  getAuthHeaders,
}: {
  contractId: string;
  getAuthHeaders: () => Record<string, string>;
}) {
  const { editor, isReady } = useTiptap();
  const [saving, setSaving] = useState(false);
  if (!isReady || !editor) return null;

  const handleSave = async () => {
    if (!contractId) return;
    setSaving(true);
    try {
      // Convert HTML to Markdown-style string so API gets original format for PDF/DOCX; raw HTML breaks those.
      const html = editor.getHTML();
      const content = htmlToMarkdownString(html);
      await updateDraftContract(contractId, content, getAuthHeaders);
      toast({ title: "Saved", description: "Contract changes saved successfully." });
    } catch (err) {
      toast({
        title: "Save failed",
        description: err instanceof Error ? err.message : "Failed to save contract",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 p-2 border-b border-border bg-muted/50 rounded-t-lg">
      <div className="flex flex-wrap items-center gap-1">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={editor.isActive("bold") ? "bg-muted" : ""}
      >
        <Bold className="w-4 h-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={editor.isActive("italic") ? "bg-muted" : ""}
      >
        <Italic className="w-4 h-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={editor.isActive("heading", { level: 2 }) ? "bg-muted" : ""}
      >
        <Heading2 className="w-4 h-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={editor.isActive("bulletList") ? "bg-muted" : ""}
      >
        <List className="w-4 h-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={editor.isActive("orderedList") ? "bg-muted" : ""}
      >
        <ListOrdered className="w-4 h-4" />
      </Button>
      </div>
      <Button
        type="button"
        size="sm"
        onClick={handleSave}
        disabled={saving}
        className="bg-emerald-600 hover:bg-emerald-700 text-white"
      >
        {saving ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <>
            <Save className="w-4 h-4 mr-1.5" />
            Save
          </>
        )}
      </Button>
    </div>
  );
}

export default function ContractEditor({ contractId, getAuthHeaders }: ContractEditorProps) {
  const [htmlContent, setHtmlContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const editor = useEditor({
    extensions: [StarterKit],
    content: "",
    immediatelyRender: false,
  });

  const loadDocx = useCallback(async () => {
    if (!contractId) return;
    setLoading(true);
    setLoadError(null);
    try {
      const blob = await getDraftContractDocxBlob(contractId, getAuthHeaders);
      const arrayBuffer = await blob.arrayBuffer();
      const result = await mammoth.convertToHtml({ arrayBuffer });
      setHtmlContent(result.value);
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : "Failed to load document");
      setHtmlContent(null);
    } finally {
      setLoading(false);
    }
  }, [contractId, getAuthHeaders]);

  useEffect(() => {
    if (contractId) {
      loadDocx();
    } else {
      setHtmlContent(null);
      setLoadError(null);
    }
  }, [contractId, loadDocx]);

  useEffect(() => {
    if (editor && htmlContent !== null) {
      editor.chain().focus().setContent(htmlContent).run();
    }
  }, [editor, htmlContent]);

  if (!contractId) {
    return (
      <div className="h-full flex items-center justify-center rounded-lg border border-border bg-muted/30 p-8">
        <p className="text-sm text-muted-foreground text-center">
          Complete the flow to generate your contract. It will open here for editing.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center rounded-lg border border-border bg-muted/30 p-8">
        <Loader2 className="w-10 h-10 animate-spin text-muted-foreground mb-4" />
        <p className="text-sm text-muted-foreground">Loading document...</p>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="h-full flex flex-col items-center justify-center rounded-lg border border-border bg-destructive/5 p-8">
        <p className="text-sm text-destructive text-center mb-4">{loadError}</p>
        <Button variant="outline" size="sm" onClick={loadDocx}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col rounded-lg border border-border bg-background overflow-hidden">
      <Tiptap instance={editor}>
        <Tiptap.Loading>
          <div className="flex items-center justify-center min-h-[300px] p-8">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        </Tiptap.Loading>
        <EditorToolbar contractId={contractId} getAuthHeaders={getAuthHeaders} />
        <div className="flex-1 overflow-y-auto border-t border-border">
          <Tiptap.Content className="prose prose-sm dark:prose-invert max-w-none min-h-[400px] p-4 focus:outline-none [&_.ProseMirror]:outline-none [&_.ProseMirror]:min-h-[380px]" />
        </div>
      </Tiptap>
    </div>
  );
}
