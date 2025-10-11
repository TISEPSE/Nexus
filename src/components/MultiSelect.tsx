import { useRef } from 'react';

interface MultiSelectProps {
  label: string;
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  required?: boolean;
  helperText?: string;
}

/**
 * Compact Inline Tag Selector - Modal-Optimized MultiSelect
 *
 * DESIGN RATIONALE:
 * - Eliminates dropdown overflow issues by using fixed-height inline grid
 * - No z-index conflicts - everything stays within component bounds
 * - Clear selection state with visual checkmarks and color coding
 * - Touch-friendly 44x44px minimum tap targets
 * - Accessible keyboard navigation with arrow keys and spacebar
 *
 * UX PATTERN: GitHub label selector + Linear tag input
 */
export function MultiSelect({
  label,
  options,
  selected,
  onChange,
  required = false,
  helperText,
}: MultiSelectProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleOption = (option: string) => {
    if (selected.includes(option)) {
      onChange(selected.filter((item) => item !== option));
    } else {
      onChange([...selected, option]);
    }
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent, option: string, index: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleOption(option);
    } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIndex = Math.min(index + 1, options.length - 1);
      (containerRef.current?.querySelectorAll('[role="checkbox"]')[nextIndex] as HTMLElement)?.focus();
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      const prevIndex = Math.max(index - 1, 0);
      (containerRef.current?.querySelectorAll('[role="checkbox"]')[prevIndex] as HTMLElement)?.focus();
    }
  };

  return (
    <div ref={containerRef} className="space-y-2">
      {/* Label with selection count */}
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gh-fg-default">
          {label}
          {required && <span className="text-red-500 ml-1" aria-label="required">*</span>}
        </label>
        {selected.length > 0 && (
          <span className="text-xs font-medium text-gh-accent-fg bg-gh-accent-subtle px-2 py-0.5 rounded-full">
            {selected.length} selected
          </span>
        )}
      </div>

      {/* Compact Inline Grid - No Dropdown, No Overflow */}
      <div
        className="bg-gh-canvas-subtle border border-gh-border-default rounded-lg p-2 transition-colors focus-within:border-gh-accent-emphasis focus-within:ring-2 focus-within:ring-gh-accent-emphasis/20"
        role="group"
        aria-label={label}
      >
        {options.length === 0 ? (
          <div className="px-3 py-6 text-sm text-gh-fg-muted text-center">
            No options available
          </div>
        ) : (
          <div
            className="grid grid-cols-2 gap-1.5 max-h-40 overflow-y-auto scrollbar-thin scrollbar-thumb-gh-border-default scrollbar-track-transparent"
            style={{
              scrollbarWidth: 'thin',
              scrollbarColor: 'var(--color-gh-border-default) transparent'
            }}
          >
            {options.map((option, index) => {
              const isSelected = selected.includes(option);
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => toggleOption(option)}
                  onKeyDown={(e) => handleKeyDown(e, option, index)}
                  role="checkbox"
                  aria-checked={isSelected}
                  tabIndex={0}
                  className={`group relative flex items-center gap-2 px-2.5 py-2.5 rounded-md text-left transition-all min-h-[44px] touch-manipulation border focus:outline-none ${
                    isSelected
                      ? 'bg-gh-accent-subtle border-gh-accent-fg'
                      : 'bg-gh-canvas-default hover:bg-gh-canvas-inset border-gh-border-muted hover:border-gh-border-default'
                  }`}
                >
                  {/* Checkmark Icon - Only visual indicator */}
                  <div className={`flex-shrink-0 w-5 h-5 rounded flex items-center justify-center transition-all ${
                    isSelected
                      ? 'bg-gh-accent-emphasis border-2 border-gh-accent-emphasis'
                      : 'bg-gh-canvas-subtle border-2 border-gh-border-default group-hover:border-gh-accent-fg'
                  }`}>
                    {isSelected && (
                      <svg
                        className="w-3.5 h-3.5 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        strokeWidth={3}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>

                  {/* Option Label */}
                  <span className={`text-sm font-medium truncate ${
                    isSelected ? 'text-gh-accent-fg' : 'text-gh-fg-default'
                  }`}>
                    {option}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Helper Text */}
      {helperText && (
        <p className="text-xs text-gh-fg-muted">{helperText}</p>
      )}

      {/* Selected Items Summary - Compact Chips Display */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {selected.map((item) => (
            <span
              key={item}
              className="inline-flex items-center gap-1.5 px-2 py-1 bg-gh-accent-subtle border border-gh-accent-emphasis/30 rounded text-xs font-medium text-gh-accent-fg"
            >
              {item}
              <button
                type="button"
                onClick={() => toggleOption(item)}
                className="hover:bg-gh-accent-emphasis/20 rounded-full p-0.5 transition-colors focus:outline-none focus:ring-2 focus:ring-gh-accent-fg min-w-[16px] min-h-[16px]"
                aria-label={`Remove ${item}`}
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
