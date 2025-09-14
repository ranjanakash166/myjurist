import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
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
