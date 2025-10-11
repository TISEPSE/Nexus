import { useTranslation } from 'react-i18next';

/**
 * Professional Language Toggle - Bilingual Switcher
 *
 * DESIGN RATIONALE:
 * - Language codes (EN/FR) instead of flag emojis for professionalism
 * - Current language highlighted with accent color
 * - Visual separator shows "from → to" relationship
 * - Scales easily to 3+ languages (just update to dropdown)
 * - Accessible with proper ARIA labels and language codes
 * - Works perfectly across all operating systems (no emoji rendering issues)
 *
 * UX PATTERN: Stripe docs + MDN Web Docs + VS Code
 * PSYCHOLOGY: Shows both current state AND future action clearly
 */
export function LanguageToggle() {
  const { i18n } = useTranslation();
  const currentLang = i18n.language;
  const isFrench = currentLang === 'fr';

  const toggleLanguage = () => {
    const newLang = isFrench ? 'en' : 'fr';
    i18n.changeLanguage(newLang);
    localStorage.setItem('language', newLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="group relative flex items-center gap-1 px-2 sm:px-3 py-2 min-h-[44px] min-w-[44px] bg-gh-canvas-subtle border border-gh-border-default rounded-md hover:bg-gh-canvas-inset hover:border-gh-accent-fg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gh-accent-fg focus:ring-offset-2 focus:ring-offset-gh-canvas-default"
      aria-label={isFrench ? 'Switch to English' : 'Passer en français'}
      title={isFrench ? 'Switch to English' : 'Passer en français'}
    >
      {/* Globe Icon - Universal Language Symbol */}
      <svg
        className="w-4 h-4 text-gh-fg-muted group-hover:text-gh-accent-fg transition-colors"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        strokeWidth={2}
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>

      {/* Language Code Display - Clear Current State */}
      <div className="flex items-center gap-1">
        {/* Current Language - Highlighted */}
        <span
          className={`text-sm font-semibold transition-colors ${
            isFrench
              ? 'text-gh-accent-fg'
              : 'text-gh-fg-muted group-hover:text-gh-fg-default'
          }`}
        >
          FR
        </span>

        {/* Visual Separator - Shows Direction */}
        <svg
          className="w-3 h-3 text-gh-fg-subtle group-hover:text-gh-accent-fg transition-all group-hover:translate-x-0.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth={2.5}
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>

        {/* Target Language - Will Become Active */}
        <span
          className={`text-sm font-semibold transition-colors ${
            !isFrench
              ? 'text-gh-accent-fg'
              : 'text-gh-fg-muted group-hover:text-gh-fg-default'
          }`}
        >
          EN
        </span>
      </div>

      {/* Hover Tooltip - Reinforces Action */}
      <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gh-canvas-default border border-gh-border-default rounded text-xs text-gh-fg-default whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg z-50">
        {isFrench ? 'Switch to English' : 'Passer en français'}
      </span>
    </button>
  );
}
