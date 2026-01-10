"use client";
import React from "react";
import { cn } from "@/lib/utils";

interface SimpleMarkdownRendererProps {
  content: string;
  className?: string;
}

export default function SimpleMarkdownRenderer({ content, className }: SimpleMarkdownRendererProps) {
  // Handle empty or null content
  if (!content || content.trim() === "") {
    return (
      <div className={cn("text-muted-foreground italic", className)}>
        No content available
      </div>
    );
  }

  // Function to parse markdown content
  const parseMarkdown = (text: string) => {
    // Split content into lines
    const lines = text.split('\n');
    const elements: React.ReactNode[] = [];
    let currentList: string[] = [];
    let inBlockquote = false;

    const flushList = () => {
      if (currentList.length > 0) {
        elements.push(
          <ul key={`list-${elements.length}`} className="list-disc list-inside mb-3 space-y-1 text-foreground">
            {currentList.map((item, index) => (
              <li key={index} className="text-foreground">
                {parseInlineMarkdown(item.trim())}
              </li>
            ))}
          </ul>
        );
        currentList = [];
      }
    };

    const parseInlineMarkdown = (line: string): React.ReactNode => {
      // Handle links first ([text](url))
      const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
      let parts: React.ReactNode[] = [];
      let lastIndex = 0;
      let match;
      let linkIndex = 0;

      while ((match = linkRegex.exec(line)) !== null) {
        // Add text before the match
        if (match.index > lastIndex) {
          const textBefore = line.slice(lastIndex, match.index);
          // Parse bold text in the text before the link
          parts.push(parseBoldText(textBefore));
        }
        // Add link
        parts.push(
          <a
            key={`link-${linkIndex}`}
            href={match[2]}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:text-primary/80 underline"
          >
            {match[1]}
          </a>
        );
        lastIndex = match.index + match[0].length;
        linkIndex++;
      }

      // Add remaining text
      if (lastIndex < line.length) {
        const remainingText = line.slice(lastIndex);
        parts.push(parseBoldText(remainingText));
      }

      return parts.length > 0 ? <>{parts}</> : parseBoldText(line);
    };

    const parseBoldText = (text: string): React.ReactNode => {
      // Handle bold text (**text**)
      // Use regex to find all bold sections
      const boldRegex = /\*\*([^*]+)\*\*/g;
      let parts: React.ReactNode[] = [];
      let lastIndex = 0;
      let match;
      let matchIndex = 0;

      // Reset regex lastIndex to ensure we start from the beginning
      boldRegex.lastIndex = 0;

      while ((match = boldRegex.exec(text)) !== null) {
        // Add text before the match
        if (match.index > lastIndex) {
          parts.push(text.slice(lastIndex, match.index));
        }
        // Add bold text with stronger styling (font-bold instead of font-semibold)
        parts.push(
          <strong key={`bold-${matchIndex++}`} className="font-bold text-foreground">
            {match[1]}
          </strong>
        );
        lastIndex = match.index + match[0].length;
      }

      // Add remaining text
      if (lastIndex < text.length) {
        parts.push(text.slice(lastIndex));
      }

      return parts.length > 0 ? <>{parts}</> : text;
    };

    lines.forEach((line, index) => {
      const trimmedLine = line.trim();

      // Handle headers
      if (trimmedLine.startsWith('**') && trimmedLine.endsWith('**')) {
        flushList();
        const headerText = trimmedLine.slice(2, -2);
        elements.push(
          <h2 key={`header-${index}`} className="text-xl font-semibold text-foreground mb-3 mt-5">
            {headerText}
          </h2>
        );
        return;
      }

      // Handle blockquotes
      if (trimmedLine.startsWith('"') && trimmedLine.endsWith('"')) {
        flushList();
        elements.push(
          <blockquote key={`blockquote-${index}`} className="border-l-4 border-primary pl-4 py-2 my-4 bg-muted/50 rounded-r-lg">
            <div className="text-foreground italic">
              {trimmedLine.slice(1, -1)}
            </div>
          </blockquote>
        );
        return;
      }

      // Handle list items
      if (trimmedLine.startsWith('*') && trimmedLine.length > 1) {
        currentList.push(trimmedLine.slice(1));
        return;
      }



      // Handle regular paragraphs
      if (trimmedLine.length > 0) {
        flushList();
        elements.push(
          <p key={`p-${index}`} className="text-foreground mb-3 leading-relaxed">
            {parseInlineMarkdown(trimmedLine)}
          </p>
        );
      } else {
        // Empty line - flush any pending list
        flushList();
      }
    });

    // Flush any remaining list items
    flushList();

    return elements;
  };

  return (
    <div className={cn("max-w-none", className)}>
      {parseMarkdown(content)}
    </div>
  );
} 