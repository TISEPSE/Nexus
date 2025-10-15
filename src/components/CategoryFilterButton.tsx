import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface CategoryFilterButtonProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export function CategoryFilterButton({
  categories,
  selectedCategory,
  onCategoryChange
}: CategoryFilterButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const isFiltered = selectedCategory !== 'All';

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          group relative flex items-center gap-1.5 px-2 sm:px-3 py-2
          min-h-[44px] min-w-[44px]
          border rounded-md transition-all duration-200
          ${isFiltered
            ? 'bg-gh-accent-subtle border-gh-accent-emphasis text-gh-accent-fg'
            : 'bg-gh-canvas-subtle border-gh-border-default text-gh-fg-default hover:bg-gh-canvas-inset hover:border-gh-accent-fg'
          }
        `}
        aria-label={t('filters.label')}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        {/* Filter Icon */}
        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round"
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>

        {/* Label - Desktop only */}
        <span className="hidden sm:inline text-sm font-medium whitespace-nowrap">
          {t('filters.label')}
        </span>

        {/* Chevron */}
        <svg
          className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>

        {/* Active Badge */}
        {isFiltered && (
          <span
            className="absolute -top-1 -right-1 w-3 h-3 bg-gh-accent-emphasis rounded-full border-2 border-gh-canvas-default"
            aria-label="Filter active"
          />
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute top-full mt-2 right-0 w-56 max-h-80 overflow-y-auto
                        bg-gh-canvas-default border border-gh-border-default rounded-md
                        shadow-lg z-50 animate-slide-in">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => {
                onCategoryChange(category);
                setIsOpen(false);
              }}
              className={`w-full px-4 py-3 text-left text-sm transition-colors
                ${selectedCategory === category
                  ? 'bg-gh-accent-subtle text-gh-accent-fg border-l-2 border-gh-accent-emphasis font-medium'
                  : 'text-gh-fg-default hover:bg-gh-canvas-subtle border-l-2 border-transparent'
                }`}
              role="option"
              aria-selected={selectedCategory === category}
            >
              {t(`categories.${category}`)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
