import { useTranslation } from 'react-i18next';

interface HomeButtonProps {
  isActive: boolean;
  onClick: () => void;
}

/**
 * Home Navigation Button - Redesigned for Visual Consistency
 *
 * DESIGN RATIONALE:
 * - Matches TemplateSelector/CategoryFilterButton subtle aesthetic
 * - Active state uses accent-subtle (not bold emphasis) for harmony
 * - Maintains distinction through home icon and positioning
 * - Follows GitHub Primer design language: subtle containers with accent highlights
 * - Consistent padding, borders, and hover effects across all nav buttons
 */
export function HomeButton({ isActive, onClick }: HomeButtonProps) {
  const { t } = useTranslation();

  return (
    <button
      onClick={onClick}
      className={`
        group relative flex items-center gap-1.5 px-2 sm:px-3 py-2
        rounded-md font-medium text-sm transition-all duration-200
        min-h-[44px] min-w-[44px] border
        ${isActive
          ? 'bg-gh-accent-subtle border-gh-accent-emphasis text-gh-accent-fg'
          : 'bg-gh-canvas-subtle border-gh-border-default text-gh-fg-default hover:bg-gh-canvas-inset hover:border-gh-accent-fg hover:text-gh-accent-fg'
        }
      `}
      aria-label={t('navigation.home')}
      aria-current={isActive ? 'page' : undefined}
    >
      {/* Home Icon - Maintains visual distinction */}
      <svg
        className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 group-hover:text-gh-accent-fg transition-colors"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        strokeWidth={2}
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
        />
      </svg>

      {/* Label - Hidden on mobile, shown on larger screens */}
      <span className="hidden sm:inline whitespace-nowrap">
        {t('navigation.home')}
      </span>

      {/* Hover Tooltip - Provides context on mobile when label is hidden */}
      <span className="sm:hidden absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gh-canvas-default border border-gh-border-default rounded text-xs text-gh-fg-default whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg z-50">
        {t('navigation.home')}
      </span>
    </button>
  );
}
