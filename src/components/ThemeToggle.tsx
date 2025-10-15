import React from 'react';

interface ThemeToggleProps {
  isDark: boolean;
  onToggle: () => void;
}

/**
 * Modern Theme Toggle - 2025 Best Practices
 *
 * DESIGN RATIONALE:
 * - Icon + text label for immediate understanding
 * - Clear visual state: sun icon = light mode, moon icon = dark mode
 * - Smooth icon transition animation for delightful feedback
 * - Hover state reveals what will happen on click
 * - 44x44px minimum touch target for mobile
 * - Accessible with clear ARIA labels and role
 *
 * UX PATTERN: Vercel docs + GitHub settings style
 * PSYCHOLOGY: Icon recognition (sun/moon) is universal, no language needed
 */
export const ThemeToggle: React.FC<ThemeToggleProps> = ({ isDark, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className="group relative flex items-center justify-center sm:justify-start gap-1.5 px-2 sm:px-3 py-2 min-h-[44px] min-w-[44px] bg-gh-canvas-subtle border border-gh-border-default rounded-md hover:bg-gh-canvas-inset hover:border-gh-accent-fg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gh-accent-fg focus:ring-offset-2 focus:ring-offset-gh-canvas-default"
      role="switch"
      aria-checked={isDark}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {/* Icon Container with Animation */}
      <div className="relative w-5 h-5 flex-shrink-0 sm:flex-shrink">
        {/* Sun Icon - Visible in Dark Mode */}
        <svg
          className={`absolute inset-0 w-5 h-5 text-gh-fg-default group-hover:text-gh-accent-fg transition-all duration-300 ${
            isDark
              ? 'opacity-100 rotate-0 scale-100'
              : 'opacity-0 -rotate-90 scale-0'
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>

        {/* Moon Icon - Visible in Light Mode */}
        <svg
          className={`absolute inset-0 w-5 h-5 text-gh-fg-default group-hover:text-gh-accent-fg transition-all duration-300 ${
            !isDark
              ? 'opacity-100 rotate-0 scale-100'
              : 'opacity-0 rotate-90 scale-0'
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
      </div>

      {/* Text Label - Descriptive and Clear */}
      <span className="text-sm font-medium text-gh-fg-default group-hover:text-gh-accent-fg transition-colors whitespace-nowrap hidden sm:inline">
        {isDark ? 'Light' : 'Dark'}
      </span>

      {/* Hover Tooltip Enhancement - Shows Future State */}
      <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gh-canvas-default border border-gh-border-default rounded text-xs text-gh-fg-default whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg">
        Switch to {isDark ? 'light' : 'dark'} mode
      </span>
    </button>
  );
};
