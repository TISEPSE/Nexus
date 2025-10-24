import { useTranslation } from 'react-i18next';

interface GoogleDriveButtonProps {
  onClick: () => void;
}

export function GoogleDriveButton({ onClick }: GoogleDriveButtonProps) {
  const { t } = useTranslation();

  return (
    <button
      onClick={onClick}
      className="
        group relative flex items-center gap-1.5 px-2 sm:px-3 py-2
        rounded-md font-medium text-sm transition-all duration-200
        min-h-[44px] min-w-[44px] border
        bg-gh-canvas-subtle border-gh-border-default text-gh-fg-default
        hover:bg-gh-canvas-inset hover:border-gh-accent-fg hover:text-gh-accent-fg
      "
      aria-label={t('googleDrive.button', 'Google Drive')}
      title={t('googleDrive.button', 'Google Drive')}
    >
      {/* Google Drive Icon - FontAwesome SVG */}
      <svg
        className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 group-hover:text-gh-accent-fg transition-colors"
        fill="currentColor"
        viewBox="0 0 640 640"
        aria-hidden="true"
      >
        <path d="M403 378.9L239.4 96L400.6 96L564.2 378.9L403 378.9zM265.5 402.5L184.9 544L495.4 544L576 402.5L265.5 402.5zM218.1 131.4L64 402.5L144.6 544L301 272.8L218.1 131.4z"/>
      </svg>

      {/* Label - Hidden on mobile, shown on larger screens */}
      <span className="hidden sm:inline whitespace-nowrap">
        {t('googleDrive.button', 'Drive')}
      </span>

      {/* Hover Tooltip - Mobile only */}
      <span className="sm:hidden absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gh-canvas-default border border-gh-border-default rounded text-xs text-gh-fg-default whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg z-50">
        {t('googleDrive.button', 'Google Drive')}
      </span>
    </button>
  );
}
