import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="w-full max-w-7xl mx-auto mb-3 sm:mb-4 overflow-x-hidden">
      {/* Desktop: Show all categories */}
      <div className="hidden sm:flex flex-wrap gap-2 max-w-full">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onSelectCategory(category)}
            className={`px-2.5 py-1 rounded text-xs font-medium transition-all duration-150
              ${
                selectedCategory === category
                  ? 'bg-gh-accent-emphasis text-white shadow-sm'
                  : 'bg-gh-canvas-subtle text-gh-fg-muted border border-gh-border-default hover:border-gh-accent-fg hover:text-gh-accent-fg hover:bg-gh-canvas-default'
              }`}
          >
            {t(`categories.${category}`)}
          </button>
        ))}
      </div>

      {/* Mobile: Collapsible categories */}
      <div className="sm:hidden">
        {/* Expand/Collapse button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full py-2 px-3 rounded text-xs font-medium bg-gh-canvas-subtle text-gh-fg-muted border border-gh-border-default hover:border-gh-accent-fg hover:text-gh-accent-fg active:bg-gh-canvas-default transition-all duration-150 touch-manipulation flex items-center justify-center gap-1 mb-2"
        >
          {isExpanded ? (
            <>
              Hide filters
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            </>
          ) : (
            <>
              Show filters ({t(`categories.${selectedCategory}`)})
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </>
          )}
        </button>

        {/* Categories - Hidden by default on mobile */}
        {isExpanded && (
          <div className="flex flex-wrap gap-1.5 max-w-full overflow-x-hidden">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => {
                  onSelectCategory(category);
                  setIsExpanded(false); // Close after selection
                }}
                className={`px-2.5 py-1.5 rounded text-xs font-medium transition-all duration-150 touch-manipulation
                  ${
                    selectedCategory === category
                      ? 'bg-gh-accent-emphasis text-white shadow-sm'
                      : 'bg-gh-canvas-subtle text-gh-fg-muted border border-gh-border-default hover:border-gh-accent-fg hover:text-gh-accent-fg active:bg-gh-canvas-default'
                  }`}
              >
                {t(`categories.${category}`)}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
