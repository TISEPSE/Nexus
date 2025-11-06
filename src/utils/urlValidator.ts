/**
 * URL Validation Utility
 *
 * Provides secure URL validation to prevent security vulnerabilities
 * before opening URLs with window.open() or browser shell
 */

/**
 * Allowed URL protocols for security
 */
const ALLOWED_PROTOCOLS = ['http:', 'https:'];

/**
 * Validation result interface
 */
export interface URLValidationResult {
  isValid: boolean;
  error?: string;
  sanitizedUrl?: string;
}

/**
 * Validates and sanitizes a URL before opening
 *
 * Security checks:
 * - Only allows http: and https: protocols
 * - Blocks javascript:, data:, file:, and other dangerous protocols
 * - Validates URL structure
 * - Prevents XSS attacks via URL
 *
 * @param url - The URL string to validate
 * @returns Validation result with sanitized URL or error message
 */
export function validateUrl(url: string): URLValidationResult {
  // Check for empty or null URL
  if (!url || url.trim() === '') {
    return {
      isValid: false,
      error: 'URL cannot be empty',
    };
  }

  const trimmedUrl = url.trim();

  // Check for obviously malicious patterns
  const maliciousPatterns = [
    /javascript:/i,
    /data:/i,
    /vbscript:/i,
    /file:/i,
    /about:/i,
  ];

  for (const pattern of maliciousPatterns) {
    if (pattern.test(trimmedUrl)) {
      return {
        isValid: false,
        error: `Dangerous protocol detected in URL: ${trimmedUrl}`,
      };
    }
  }

  try {
    // Attempt to parse the URL
    const urlObj = new URL(trimmedUrl);

    // Check if protocol is allowed
    if (!ALLOWED_PROTOCOLS.includes(urlObj.protocol)) {
      return {
        isValid: false,
        error: `Protocol "${urlObj.protocol}" is not allowed. Only http: and https: are permitted.`,
      };
    }

    // Additional check: ensure hostname exists
    if (!urlObj.hostname || urlObj.hostname.trim() === '') {
      return {
        isValid: false,
        error: 'Invalid URL: missing hostname',
      };
    }

    // URL is valid
    return {
      isValid: true,
      sanitizedUrl: urlObj.toString(),
    };
  } catch (error) {
    // URL parsing failed
    return {
      isValid: false,
      error: `Invalid URL format: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}

/**
 * Quick check if a URL is safe to open
 * (simplified version of validateUrl for cases where you only need a boolean)
 *
 * @param url - The URL to check
 * @returns true if URL is safe, false otherwise
 */
export function isUrlSafe(url: string): boolean {
  const result = validateUrl(url);
  return result.isValid;
}

/**
 * Opens a validated URL in a new window/tab
 * Returns true if successful, false if validation failed
 *
 * @param url - The URL to open
 * @param onError - Optional callback for validation errors
 * @returns true if URL was opened, false if validation failed
 */
export function openValidatedUrl(
  url: string,
  onError?: (error: string) => void
): boolean {
  const validation = validateUrl(url);

  if (!validation.isValid) {
    if (onError && validation.error) {
      onError(validation.error);
    }
    console.error('URL validation failed:', validation.error);
    return false;
  }

  // Open the validated URL
  window.open(validation.sanitizedUrl, '_blank', 'noopener,noreferrer');
  return true;
}
