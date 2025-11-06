import { useEffect, useRef } from 'react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export const SearchBar = ({ value, onChange }: SearchBarProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Auto-focus on mount
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <div className="relative w-full sm:w-80">
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search tools..."
        className="w-full px-3 py-2 pl-9 sm:py-1.5 sm:pl-8 text-sm bg-gh-canvas-subtle border border-gh-border-default rounded-md
                   text-gh-fg-default placeholder-gh-fg-subtle
                   focus:outline-none focus:border-gh-accent-fg focus:ring-1 focus:ring-gh-accent-fg
                   transition-all duration-150"
      />
      <svg
        className="absolute left-2.5 sm:left-2.5 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-3.5 sm:h-3.5 text-gh-fg-subtle pointer-events-none"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-gh-fg-subtle hover:text-gh-fg-muted transition-colors"
          aria-label="Clear search"
        >
          <svg className="w-4 h-4 sm:w-3.5 sm:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
};
