/**
 * Utility functions for generating fallback logo URLs from multiple sources
 */

/**
 * Extracts the domain from a URL
 * @param url - The full URL
 * @returns The domain (e.g., "openai.com")
 */
export function extractDomain(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}

/**
 * Generates multiple logo source URLs for a given domain
 * @param domain - The domain (e.g., "openai.com")
 * @returns Array of logo URLs from different CDN/API services
 */
export function generateFallbackLogos(domain: string): string[] {
  const cleanDomain = domain.replace(/^www\./, '');

  return [
    // Google Favicon API - High quality, reliable
    `https://www.google.com/s2/favicons?domain=${cleanDomain}&sz=128`,

    // Clearbit Logo API - High quality company logos
    `https://logo.clearbit.com/${cleanDomain}`,

    // DuckDuckGo Icons - Good fallback
    `https://icons.duckduckgo.com/ip3/${cleanDomain}.ico`,

    // GitHub Favicons - Good for open source tools
    `https://favicons.githubusercontent.com/${cleanDomain}`,

    // Logo.dev API - Requires token but good quality
    // Note: Replace with actual token if available
    // `https://img.logo.dev/${cleanDomain}?token=YOUR_TOKEN`,
  ];
}

/**
 * Creates a comprehensive array of logo URLs with custom sources first, then fallbacks
 * @param primaryLogos - Primary logo URL(s) provided by the tool
 * @param domain - The domain for generating fallback URLs
 * @returns Complete array of logo URLs to try in order
 */
export function buildLogoSources(
  primaryLogos: string | string[],
  domain: string
): string[] {
  const sources: string[] = [];

  // Add primary logos first
  if (Array.isArray(primaryLogos)) {
    sources.push(...primaryLogos);
  } else {
    sources.push(primaryLogos);
  }

  // Add fallback sources
  sources.push(...generateFallbackLogos(domain));

  // Remove duplicates while preserving order
  return Array.from(new Set(sources));
}

/**
 * React hook for managing logo fallback state
 * Returns the current logo URL to display and a handler for errors
 */
export function useLogoFallback(sources: string[]) {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [failedSources, setFailedSources] = React.useState<Set<string>>(new Set());

  const currentSource = sources[currentIndex];

  const handleError = React.useCallback(() => {
    setFailedSources(prev => new Set(prev).add(currentSource));

    // Try next source
    if (currentIndex < sources.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  }, [currentIndex, sources.length, currentSource]);

  const reset = React.useCallback(() => {
    setCurrentIndex(0);
    setFailedSources(new Set());
  }, []);

  return {
    currentSource,
    handleError,
    allFailed: currentIndex >= sources.length - 1 && failedSources.has(currentSource),
    reset,
  };
}

// Re-export React for the hook
import React from 'react';
