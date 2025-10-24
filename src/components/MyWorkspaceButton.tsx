import { useTranslation } from 'react-i18next';

interface MyWorkspaceButtonProps {
  isActive: boolean;
  onClick: () => void;
}

export function MyWorkspaceButton({ isActive, onClick }: MyWorkspaceButtonProps) {
  const { t } = useTranslation();

  return (
    <button
      onClick={onClick}
      className={`
        group relative flex items-center gap-1.5 px-2 sm:px-3 py-2 rounded-md border transition-all duration-200
        min-h-[44px] min-w-[44px]
        ${isActive
          ? 'bg-gh-accent-subtle border-gh-accent-emphasis text-gh-accent-fg'
          : 'bg-gh-canvas-subtle border-gh-border-default text-gh-fg-default hover:bg-gh-canvas-inset hover:border-gh-accent-fg hover:text-gh-accent-fg'
        }
      `}
      aria-label={t('workspace.ariaLabel')}
      aria-current={isActive ? 'page' : undefined}
      title={t('workspace.title')}
    >
      {/* Thumbtack Icon - FontAwesome - Rotated 45deg */}
      <svg
        className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 group-hover:text-gh-accent-fg transition-colors rotate-45"
        fill="currentColor"
        viewBox="0 0 640 640"
        aria-hidden="true"
      >
        <path d="M160 96C160 78.3 174.3 64 192 64L448 64C465.7 64 480 78.3 480 96C480 113.7 465.7 128 448 128L418.5 128L428.8 262.1C465.9 283.3 494.6 318.5 507 361.8L510.8 375.2C513.6 384.9 511.6 395.2 505.6 403.3C499.6 411.4 490 416 480 416L160 416C150 416 140.5 411.3 134.5 403.3C128.5 395.3 126.5 384.9 129.3 375.2L133 361.8C145.4 318.5 174 283.3 211.2 262.1L221.5 128L192 128C174.3 128 160 113.7 160 96zM288 464L352 464L352 576C352 593.7 337.7 608 320 608C302.3 608 288 593.7 288 576L288 464z"/>
      </svg>

      {/* Label - Desktop only */}
      <span className="hidden sm:inline text-sm font-medium whitespace-nowrap">
        {t('workspace.title')}
      </span>

      {/* Hover Tooltip - Mobile */}
      <span className="sm:hidden absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gh-canvas-default border border-gh-border-default rounded text-xs text-gh-fg-default whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg z-50">
        {t('workspace.title')}
      </span>
    </button>
  );
}
