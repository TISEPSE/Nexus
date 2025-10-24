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
    <div className="w-full max-w-7xl mx-auto mb-3 sm:mb-4">
      {/* Toggle Button - Now on ALL breakpoints */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full sm:w-auto py-2.5 px-4 rounded-md text-sm font-medium
                   bg-gh-canvas-subtle text-gh-fg-default border border-gh-border-default
                   hover:border-gh-accent-fg hover:bg-gh-canvas-inset transition-all duration-200
                   flex items-center justify-between gap-3"
        aria-expanded={isExpanded}
        aria-controls="category-filter-panel"
      >
        <span className="flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          <span className="font-normal">{t('filters.label')}:</span>
          <strong>{t(`categories.${selectedCategory}`)}</strong>
        </span>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gh-fg-muted hidden sm:inline">
            {categories.length} {t('filters.available')}
          </span>
          <svg
            className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Expandable Panel */}
      <div
        id="category-filter-panel"
        className={`
          overflow-hidden transition-all duration-300 ease-in-out
          ${isExpanded ? 'max-h-96 opacity-100 mt-3' : 'max-h-0 opacity-0'}
        `}
      >
        <div className="flex flex-wrap gap-2 p-4 bg-gh-canvas-subtle rounded-md border border-gh-border-default">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => {
                onSelectCategory(category);
              }}
              className={`px-3 py-1.5 rounded text-xs font-medium transition-all duration-150
                ${selectedCategory === category
                  ? 'bg-gh-accent-emphasis text-white shadow-sm'
                  : 'bg-gh-canvas-default text-gh-fg-muted border border-gh-border-default hover:border-gh-accent-fg hover:text-gh-accent-fg'
                }`}
            >
              {t(`categories.${category}`)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
