import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import React from "react"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Parses text and renders bold markdown (**text**) as <strong> elements
 * @param text - The text string to parse
 * @returns React node with bold text properly rendered
 */
export function parseBoldText(text: string): React.ReactNode {
  if (!text) return text;
  
  // Handle bold text (**text**)
  const boldRegex = /\*\*([^*]+)\*\*/g;
  const parts: React.ReactNode[] = [];
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
    // Add bold text
    parts.push(
      React.createElement('strong', { 
        key: `bold-${matchIndex++}`, 
        className: 'font-semibold text-foreground' 
      }, match[1])
    );
    lastIndex = match.index + match[0].length;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? React.createElement(React.Fragment, null, ...parts) : text;
}

/**
 * Parses text and renders both bold (**text**) and italic (*text*) markdown
 * @param text - The text string to parse
 * @returns React node with bold and italic text properly rendered
 */
export function parseMarkdownText(text: string): React.ReactNode {
  if (!text) return text;
  
  // Combined regex to match both **bold** and *italic* (but not **bold**)
  // We need to handle bold first, then italic
  // Pattern: **bold** or *italic* (where italic is not part of bold)
  const combinedRegex = /(\*\*([^*]+)\*\*)|(\*([^*]+)\*)/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match;
  let matchIndex = 0;

  // Reset regex lastIndex to ensure we start from the beginning
  combinedRegex.lastIndex = 0;

  while ((match = combinedRegex.exec(text)) !== null) {
    // Add text before the match
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    
    if (match[1]) {
      // Bold match (**text**)
      parts.push(
        React.createElement('strong', { 
          key: `bold-${matchIndex++}`, 
          className: 'font-semibold text-foreground' 
        }, match[2])
      );
    } else if (match[3]) {
      // Italic match (*text*)
      parts.push(
        React.createElement('em', { 
          key: `italic-${matchIndex++}`, 
          className: 'italic text-foreground' 
        }, match[4])
      );
    }
    
    lastIndex = match.index + match[0].length;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? React.createElement(React.Fragment, null, ...parts) : text;
}

/**
 * Validates if a date string is valid and returns a formatted date or fallback
 * @param dateString - The date string to validate
 * @param fallback - The fallback text to return if date is invalid (default: 'Invalid date')
 * @returns Formatted date string or fallback
 */
export function formatDateSafely(dateString: string, fallback: string = 'Invalid date'): string {
  if (!dateString || dateString.trim() === '') {
    return 'No date';
  }
  
  // Handle incomplete date formats
  const normalizedDate = normalizeIncompleteDate(dateString);
  if (normalizedDate) {
    try {
      const date = new Date(normalizedDate);
      if (isNaN(date.getTime())) {
        return fallback;
      }
      
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return fallback;
    }
  }
  
  // Try original date string
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      // If the original date is invalid, try to extract just the year
      const yearMatch = dateString.match(/^(\d{4})/);
      if (yearMatch) {
        const year = parseInt(yearMatch[1]);
        if (year >= 1900 && year <= 2100) {
          return `Year ${year}`;
        }
      }
      return fallback;
    }
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch {
    // If parsing fails, try to extract just the year
    const yearMatch = dateString.match(/^(\d{4})/);
    if (yearMatch) {
      const year = parseInt(yearMatch[1]);
      if (year >= 1900 && year <= 2100) {
        return `Year ${year}`;
      }
    }
    return fallback;
  }
}

/**
 * Normalizes incomplete date strings to valid ISO format
 * @param dateString - The date string to normalize
 * @returns Normalized date string or null if cannot be normalized
 */
function normalizeIncompleteDate(dateString: string): string | null {
  if (!dateString || dateString.trim() === '') {
    return null;
  }
  
  // Handle "YYYY-MM" format (missing day)
  const yearMonthMatch = dateString.match(/^(\d{4})-(\d{1,2})$/);
  if (yearMonthMatch) {
    const year = parseInt(yearMonthMatch[1]);
    const month = parseInt(yearMonthMatch[2]);
    
    if (year >= 1900 && year <= 2100 && month >= 1 && month <= 12) {
      // Use the first day of the month
      return `${year}-${month.toString().padStart(2, '0')}-01`;
    }
  }
  
  // Handle "YYYY-00-00" format (invalid month/day) - ALWAYS show year
  const invalidDateMatch = dateString.match(/^(\d{4})-00-00$/);
  if (invalidDateMatch) {
    const year = parseInt(invalidDateMatch[1]);
    if (year >= 1900 && year <= 2100) {
      // Use January 1st of the year
      return `${year}-01-01`;
    }
  }
  
  // Handle "YYYY-MM-00" format (invalid day)
  const invalidDayMatch = dateString.match(/^(\d{4})-(\d{1,2})-00$/);
  if (invalidDayMatch) {
    const year = parseInt(invalidDayMatch[1]);
    const month = parseInt(invalidDayMatch[2]);
    
    if (year >= 1900 && year <= 2100 && month >= 1 && month <= 12) {
      // Use the first day of the month
      return `${year}-${month.toString().padStart(2, '0')}-01`;
    }
  }
  
  // Handle any format that starts with a valid year
  const yearOnlyMatch = dateString.match(/^(\d{4})/);
  if (yearOnlyMatch) {
    const year = parseInt(yearOnlyMatch[1]);
    if (year >= 1900 && year <= 2100) {
      // If we can't parse the full date but have a valid year, use January 1st
      return `${year}-01-01`;
    }
  }
  
  return null;
}

/**
 * Validates if a date string is valid
 * @param dateString - The date string to validate
 * @returns true if the date is valid, false otherwise
 */
export function isValidDate(dateString: string): boolean {
  if (!dateString || dateString.trim() === '') {
    return false;
  }
  
  // Check if it's an incomplete date that can be normalized
  const normalizedDate = normalizeIncompleteDate(dateString);
  if (normalizedDate) {
    try {
      const date = new Date(normalizedDate);
      return !isNaN(date.getTime());
    } catch {
      return false;
    }
  }
  
  // Check original date string
  try {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  } catch {
    return false;
  }
  
  // If all else fails, check if we have at least a valid year
  const yearMatch = dateString.match(/^(\d{4})/);
  if (yearMatch) {
    const year = parseInt(yearMatch[1]);
    return year >= 1900 && year <= 2100;
  }
  
  return false;
}

/**
 * Validates and logs date issues for debugging
 * @param dateString - The date string to validate
 * @param context - Context information for logging
 * @returns true if the date is valid, false otherwise
 */
export function validateAndLogDate(dateString: string, context: string = 'Unknown'): boolean {
  const isValid = isValidDate(dateString);
  if (!isValid) {
    console.warn(`Invalid date found in ${context}:`, dateString);
  }
  return isValid;
}

/**
 * Gets a normalized date string for sorting purposes
 * @param dateString - The date string to normalize
 * @returns Normalized date string or null if cannot be normalized
 */
export function getNormalizedDate(dateString: string): string | null {
  if (!dateString || dateString.trim() === '') {
    return null;
  }
  
  const normalizedDate = normalizeIncompleteDate(dateString);
  if (normalizedDate) {
    return normalizedDate;
  }
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return null;
    }
    return date.toISOString().split('T')[0]; // Return YYYY-MM-DD format
  } catch {
    return null;
  }
}

/**
 * Test function to verify date normalization (for debugging)
 * This function can be called from browser console to test date handling
 */
export function testDateNormalization() {
  const testCases = [
    "2018-08",
    "2011-00-00", 
    "2024-00-00", // The specific case mentioned
    "2015-03-00",
    "2020-12-25",
    "invalid-date",
    "",
    "2023-13-01", // Invalid month
    "2023-04-31",  // Invalid day
    "2025",        // Just year
    "2025-13-45"   // Completely invalid but has year
  ];
  
  testCases.forEach(testCase => {
    const normalized = getNormalizedDate(testCase);
    const formatted = formatDateSafely(testCase);
    const isValid = isValidDate(testCase);
  });
}

// Utility function to make API calls with automatic token refresh
export async function apiCallWithRefresh(
  url: string,
  options: RequestInit,
  getAuthHeaders: () => Record<string, string>,
  refreshToken: () => Promise<boolean>
): Promise<Response> {
  // Add auth headers to the request
  const authHeaders = getAuthHeaders();
  const requestOptions = {
    ...options,
    headers: {
      ...options.headers,
      ...authHeaders,
    },
  };

  // Make the initial request
  let response = await fetch(url, requestOptions);

  // If the response is 401 (Unauthorized), try to refresh the token
  if (response.status === 401) {
    const refreshSuccess = await refreshToken();
    
    if (refreshSuccess) {
      // Retry the request with the new token
      const newAuthHeaders = getAuthHeaders();
      const retryOptions = {
        ...options,
        headers: {
          ...options.headers,
          ...newAuthHeaders,
        },
      };
      response = await fetch(url, retryOptions);
    }
  }

  return response;
}

/**
 * Ensures API content newlines display consistently.
 * Replaces literal backslash-n (and backslash-r-backslash-n) with real newline characters
 * so that content shows line breaks the same whether the API sent escaped or real newlines.
 * @param content - The content string (e.g. from legal-research/history)
 * @returns Content with literal \n converted to real newlines
 */
export function normalizeApiNewlines(content: string): string {
  if (!content || typeof content !== "string") {
    return content;
  }
  return content
    .replace(/\\r\\n/g, "\n")
    .replace(/\\n/g, "\n")
    .replace(/\r\n/g, "\n");
}

/**
 * Options for normalizeContentLineBreaks
 * @param preserveSingleNewlines - When true, do not collapse single newlines (e.g. for legal research content so \n shows consistently as line break)
 */
export type NormalizeContentLineBreaksOptions = {
  preserveSingleNewlines?: boolean;
};

/**
 * Normalizes content by collapsing excessive line breaks
 * - Converts literal \n from API to real newlines first
 * - Collapses 3+ consecutive newlines into a double newline (paragraph break)
 * - Optionally collapses single newlines within sentences (set preserveSingleNewlines for API content)
 * - Preserves intentional formatting like headers (## Page X)
 * - Keeps double newlines as paragraph breaks
 * @param content - The content string to normalize
 * @param options - When preserveSingleNewlines is true, every \n is shown as a line break (use for legal-research history, etc.)
 * @returns Normalized content with collapsed line breaks
 */
export function normalizeContentLineBreaks(
  content: string,
  options?: NormalizeContentLineBreaksOptions
): string {
  if (!content || content.trim() === '') {
    return content;
  }

  const preserveSingleNewlines = options?.preserveSingleNewlines ?? false;
  let normalized = normalizeApiNewlines(content);

  // Step 1: Collapse 3+ consecutive newlines into double newline (paragraph break)
  normalized = normalized.replace(/\n{3,}/g, '\n\n');

  if (!preserveSingleNewlines) {
    // Step 2: Collapse single newlines that appear within sentences
    // Replace single newline followed by lowercase letter, number, or common punctuation
    // This handles cases like "this\ncase" -> "this case"
    normalized = normalized.replace(/([^\n\s])\n([a-z0-9,;:])/g, '$1 $2');

    // Step 3: Handle newlines after punctuation that should be spaces
    // Cases like "word.\n18." where the number continues the sentence
    normalized = normalized.replace(/([.!?])\n(\d+\.\s*[A-Z])/g, '$1 $2');

    // Step 4: Handle newlines after numbers/periods that continue sentences
    // Cases like "18.\nAs" where it's a numbered point but continues
    // But preserve cases like "18.\n\nAs" which are paragraph breaks
    normalized = normalized.replace(/(\d+\.)\n([a-z])/g, '$1 $2');
  }

  // Step 5: Collapse multiple spaces into single space (but preserve paragraph breaks)
  normalized = normalized.replace(/[ \t]+/g, ' ');
  // Step 6: Clean up any remaining excessive newlines
  normalized = normalized.replace(/\n{3,}/g, '\n\n');
  // Step 7: Remove trailing whitespace from each line but preserve intentional line breaks
  normalized = normalized.split('\n').map(line => line.trimEnd()).join('\n');

  return normalized.trim();
}
