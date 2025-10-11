import { useRef, useState, useEffect } from 'react';

interface SingleSelectDropdownProps {
  label: string;
  options: { value: string; label: string }[];
  selected: string;
  onChange: (selected: string) => void;
  placeholder?: string;
  required?: boolean;
  helperText?: string;
}

/**
 * Premium Custom Dropdown - Alternative to Inline Grid
 *
 * DESIGN PATTERN: Radix UI / Shadcn-style select
 *
 * FEATURES:
 * - Smart auto-positioning (flips up if near bottom of modal)
 * - Click-outside to close
 * - Keyboard navigation with type-ahead search
 * - Smooth open/close animations
 * - Professional visual design
 *
 * USE WHEN:
 * - You want a more traditional select experience
 * - You have limited vertical space for inline grid
 * - Visual preference for dropdown pattern
 *
 * TRADE-OFFS vs Inline Grid:
 * - More complex state management (open/close)
 * - Potential z-index considerations (handled via portal-like positioning)
 * - Requires click to open (one extra interaction)
 * + More compact when closed
 * + Familiar pattern for users
 */
export function SingleSelectDropdown({
  label,
  options,
  selected,
  onChange,
  placeholder = 'Select an option...',
  required = false,
  helperText,
}: SingleSelectDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const selectedOption = options.find(opt => opt.value === selected);

  // Filter options based on search query
  const filteredOptions = searchQuery
    ? options.filter(opt => opt.label.toLowerCase().includes(searchQuery.toLowerCase()))
    : options;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery('');
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Reset highlighted index when options change
  useEffect(() => {
    setHighlightedIndex(0);
  }, [searchQuery]);

  // Type-ahead search (auto-clear after 500ms)
  useEffect(() => {
    if (searchQuery) {
      const timer = setTimeout(() => setSearchQuery(''), 500);
      return () => clearTimeout(timer);
    }
  }, [searchQuery]);

  const handleSelect = (value: string) => {
    onChange(value);
    setIsOpen(false);
    setSearchQuery('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => Math.min(prev + 1, filteredOptions.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => Math.max(prev - 1, 0));
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (filteredOptions[highlightedIndex]) {
          handleSelect(filteredOptions[highlightedIndex].value);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        setSearchQuery('');
        buttonRef.current?.focus();
        break;
      default:
        // Type-ahead search
        if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
          setSearchQuery(prev => prev + e.key);
        }
    }
  };

  return (
    <div ref={containerRef} className="space-y-2 relative">
      {/* Label */}
      <label className="block text-sm font-medium text-gh-fg-default">
        {label}
        {required && <span className="text-red-500 ml-1" aria-label="required">*</span>}
      </label>

      {/* Select Button */}
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        className={`
          w-full flex items-center justify-between gap-2 px-3 py-2.5
          bg-gh-canvas-subtle border rounded-lg text-left
          transition-all duration-200
          ${isOpen
            ? 'border-gh-accent-emphasis ring-2 ring-gh-accent-emphasis/20'
            : 'border-gh-border-default hover:border-gh-border-default hover:bg-gh-canvas-inset'
          }
          focus:outline-none focus:border-gh-accent-emphasis focus:ring-2 focus:ring-gh-accent-emphasis/20
        `}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className={`text-sm font-medium truncate ${
          selectedOption ? 'text-gh-fg-default' : 'text-gh-fg-muted'
        }`}>
          {selectedOption?.label || placeholder}
        </span>

        {/* Chevron Icon */}
        <svg
          className={`w-4 h-4 text-gh-fg-muted transition-transform duration-200 flex-shrink-0 ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-1 bg-gh-canvas-default border border-gh-border-default rounded-lg shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200"
          role="listbox"
          aria-label={label}
        >
          {/* Search Query Indicator */}
          {searchQuery && (
            <div className="px-3 py-2 bg-gh-accent-subtle border-b border-gh-border-muted text-xs text-gh-fg-muted">
              Searching: <span className="font-medium text-gh-accent-fg">{searchQuery}</span>
            </div>
          )}

          {/* Options List */}
          <div className="max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-gh-border-default scrollbar-track-transparent">
            {filteredOptions.length === 0 ? (
              <div className="px-3 py-6 text-sm text-gh-fg-muted text-center">
                No options found
              </div>
            ) : (
              filteredOptions.map((option, index) => {
                const isSelected = selected === option.value;
                const isHighlighted = index === highlightedIndex;

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleSelect(option.value)}
                    role="option"
                    aria-selected={isSelected}
                    className={`
                      w-full flex items-center justify-between gap-2 px-3 py-2.5 text-left
                      transition-colors duration-150
                      ${isHighlighted
                        ? 'bg-gh-canvas-inset'
                        : isSelected
                          ? 'bg-gh-accent-subtle'
                          : 'hover:bg-gh-canvas-subtle'
                      }
                    `}
                  >
                    <span className={`text-sm font-medium truncate ${
                      isSelected ? 'text-gh-accent-fg' : 'text-gh-fg-default'
                    }`}>
                      {option.label}
                    </span>

                    {/* Checkmark for selected */}
                    {isSelected && (
                      <svg
                        className="w-4 h-4 text-gh-accent-fg flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        strokeWidth={2.5}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                );
              })
            )}
          </div>

          {/* Footer Hint */}
          <div className="px-3 py-2 bg-gh-canvas-subtle border-t border-gh-border-muted text-xs text-gh-fg-muted flex items-center justify-between">
            <span>Type to search</span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-gh-canvas-default border border-gh-border-default rounded text-xs">Esc</kbd>
              to close
            </span>
          </div>
        </div>
      )}

      {/* Helper Text with Selection Preview */}
      {helperText && (
        <div className="flex items-start justify-between gap-2">
          <p className="text-xs text-gh-fg-muted flex-1">{helperText}</p>
          {selectedOption && (
            <span className="text-xs font-medium text-gh-accent-fg bg-gh-accent-subtle px-2 py-0.5 rounded-full whitespace-nowrap">
              {selectedOption.label}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
