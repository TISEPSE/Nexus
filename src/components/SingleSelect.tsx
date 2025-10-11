import { useRef, useState } from 'react';

interface SingleSelectProps {
  label: string;
  options: { value: string; label: string }[]; // Changed to support key-label pairs
  selected: string; // This should be the VALUE (not translated label)
  onChange: (selected: string) => void;
  placeholder?: string;
  required?: boolean;
  helperText?: string;
}

/**
 * Enhanced Inline Radio Selector - Modal-Optimized SingleSelect
 *
 * IMPROVEMENTS 2025:
 * - Fixed translation bug by using value/label pairs
 * - Responsive grid (2 cols mobile, 3 cols desktop)
 * - Tooltip for truncated text
 * - Smooth micro-interactions
 * - Better visual hierarchy
 * - Hover state for container
 *
 * DESIGN RATIONALE:
 * - Eliminates dropdown overflow issues by using fixed-height inline grid
 * - No z-index conflicts - everything stays within component bounds
 * - Clear selection state with visual radio buttons and color coding
 * - Touch-friendly 44x44px minimum tap targets
 * - Accessible keyboard navigation with arrow keys and spacebar
 */
export function SingleSelect({
  label,
  options,
  selected,
  onChange,
  required = false,
  helperText,
}: SingleSelectProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredOption, setHoveredOption] = useState<string | null>(null);

  const selectOption = (value: string) => {
    onChange(value);
  };

  // Find selected option label for display
  const selectedLabel = options.find(opt => opt.value === selected)?.label || '';

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent, value: string, index: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      selectOption(value);
    } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIndex = Math.min(index + 1, options.length - 1);
      (containerRef.current?.querySelectorAll('[role="radio"]')[nextIndex] as HTMLElement)?.focus();
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      const prevIndex = Math.max(index - 1, 0);
      (containerRef.current?.querySelectorAll('[role="radio"]')[prevIndex] as HTMLElement)?.focus();
    }
  };

  return (
    <div ref={containerRef} className="space-y-2">
      {/* Label - Clean, no redundant indicator */}
      <label className="block text-sm font-medium text-gh-fg-default">
        {label}
        {required && <span className="text-red-500 ml-1" aria-label="required">*</span>}
      </label>

      {/* Enhanced Inline Grid - Responsive & Interactive */}
      <div
        className="bg-gh-canvas-subtle border border-gh-border-default rounded-lg p-2 transition-all duration-200 hover:border-gh-border-default hover:bg-gh-canvas-inset/50 focus-within:border-gh-accent-emphasis focus-within:ring-2 focus-within:ring-gh-accent-emphasis/20"
        role="radiogroup"
        aria-label={label}
      >
        {options.length === 0 ? (
          <div className="px-3 py-6 text-sm text-gh-fg-muted text-center">
            No options available
          </div>
        ) : (
          <div
            className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 max-h-40 overflow-y-auto scrollbar-thin scrollbar-thumb-gh-border-default scrollbar-track-transparent"
            style={{
              scrollbarWidth: 'thin',
              scrollbarColor: 'var(--color-gh-border-default) transparent'
            }}
          >
            {options.map((option, index) => {
              const isSelected = selected === option.value;
              const isHovered = hoveredOption === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => selectOption(option.value)}
                  onMouseEnter={() => setHoveredOption(option.value)}
                  onMouseLeave={() => setHoveredOption(null)}
                  onKeyDown={(e) => handleKeyDown(e, option.value, index)}
                  role="radio"
                  aria-checked={isSelected}
                  aria-label={option.label}
                  tabIndex={0}
                  title={option.label} // Tooltip for truncated text
                  className={`
                    group relative flex items-center gap-2 px-2.5 py-2.5 rounded-md text-left
                    min-h-[44px] touch-manipulation
                    transition-all duration-200 ease-out
                    ${isSelected
                      ? 'bg-gh-accent-emphasis text-white shadow-md scale-[1.02] transform'
                      : 'bg-gh-canvas-default hover:bg-gh-canvas-inset border border-gh-border-muted hover:border-gh-accent-fg hover:shadow-sm'
                    }
                    focus:outline-none focus:ring-2 focus:ring-gh-accent-fg focus:ring-offset-2 focus:ring-offset-gh-canvas-subtle
                  `}
                >
                  {/* Enhanced Radio Button Icon */}
                  <div className={`
                    flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center
                    transition-all duration-200 ease-out
                    ${isSelected
                      ? 'bg-white/20 border-2 border-white/60 scale-110'
                      : isHovered
                        ? 'bg-gh-accent-subtle border-2 border-gh-accent-fg scale-105'
                        : 'bg-gh-canvas-subtle border-2 border-gh-border-default'
                    }
                  `}>
                    {isSelected && (
                      <div className="w-2.5 h-2.5 rounded-full bg-white animate-in zoom-in duration-150"></div>
                    )}
                  </div>

                  {/* Option Label with Truncate */}
                  <span className={`
                    text-sm font-medium truncate
                    transition-colors duration-200
                    ${isSelected ? 'text-white' : 'text-gh-fg-default'}
                  `}>
                    {option.label}
                  </span>

                  {/* Selection Indicator - Subtle checkmark */}
                  {isSelected && (
                    <svg
                      className="absolute right-1.5 top-1.5 w-3.5 h-3.5 text-white/80 animate-in zoom-in duration-200"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth={3}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Helper Text with Selection Preview */}
      {helperText && (
        <div className="flex items-start justify-between gap-2">
          <p className="text-xs text-gh-fg-muted flex-1">{helperText}</p>
          {selectedLabel && (
            <span className="text-xs font-medium text-gh-accent-fg bg-gh-accent-subtle px-2 py-0.5 rounded-full whitespace-nowrap animate-in fade-in slide-in-from-right-2 duration-200">
              {selectedLabel}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
