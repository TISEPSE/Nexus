import { useTranslation } from 'react-i18next';

interface HomeButtonProps {
  isActive: boolean;
  onClick: () => void;
}

export function HomeButton({ isActive, onClick }: HomeButtonProps) {
  const { t } = useTranslation();

  return (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-2 px-4 py-3 rounded-md font-semibold text-sm
        transition-all duration-200 min-h-[48px] border-2
        ${isActive
          ? 'bg-gh-accent-emphasis text-white border-gh-accent-emphasis shadow-sm'
          : 'bg-gh-canvas-subtle text-gh-fg-default border-gh-border-default hover:bg-gh-accent-subtle hover:border-gh-accent-fg hover:text-gh-accent-fg'
        }
      `}
      aria-label={t('navigation.home')}
      aria-current={isActive ? 'page' : undefined}
    >
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
      <span>{t('navigation.home')}</span>
    </button>
  );
}
