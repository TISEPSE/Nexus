import { useTranslation } from 'react-i18next';

interface SchoolButtonProps {
  isActive: boolean;
  onClick: () => void;
}

export function SchoolButton({ isActive, onClick }: SchoolButtonProps) {
  const { t } = useTranslation();

  return (
    <button
      onClick={onClick}
      className={`group relative flex items-center justify-center gap-1.5 px-2 sm:px-3 py-2 min-h-[44px] min-w-[44px] rounded-md border transition-all duration-200 focus:outline-none ${
        isActive
          ? 'bg-gh-accent-subtle border-gh-accent-emphasis text-gh-accent-fg'
          : 'bg-gh-canvas-subtle border-gh-border-default hover:bg-gh-canvas-inset hover:border-gh-accent-fg'
      }`}
      title={t('navigation.school')}
      aria-label={t('navigation.school')}
      aria-current={isActive ? 'page' : undefined}
    >
      {/* Academic Cap Icon */}
      <svg
        className={`w-5 h-5 transition-colors ${
          isActive ? 'text-gh-accent-fg' : 'text-gh-fg-default group-hover:text-gh-accent-fg'
        }`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 14l9-5-9-5-9 5 9 5z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"
        />
      </svg>

      {/* Label - Hidden on mobile, shown on desktop */}
      <span className="hidden sm:inline text-sm font-medium">
        {t('navigation.school')}
      </span>
    </button>
  );
}
