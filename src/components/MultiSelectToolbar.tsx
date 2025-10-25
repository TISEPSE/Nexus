import { useTranslation } from 'react-i18next';

interface MultiSelectToolbarProps {
  selectedCount: number;
  onCancel: () => void;
  onAddToCollection: () => void;
  collectionName: string;
  onSelectAll?: () => void;
  onDeselectAll?: () => void;
  allSelected?: boolean;
}

export function MultiSelectToolbar({
  selectedCount,
  onCancel,
  onAddToCollection,
  collectionName,
  onSelectAll,
  onDeselectAll,
  allSelected = false
}: MultiSelectToolbarProps) {
  const { t } = useTranslation();

  return (
    <div className="fixed top-16 sm:top-20 left-0 right-0 z-40 bg-gh-accent-subtle border-b-2 border-gh-accent-fg shadow-lg animate-slide-in-fade">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1">
          {/* Select All / Deselect All Toggle */}
          {(onSelectAll || onDeselectAll) && (
            <button
              onClick={allSelected ? onDeselectAll : onSelectAll}
              className="flex items-center gap-2 px-3 py-1.5 bg-gh-canvas-subtle border border-gh-border-default text-gh-fg-default text-sm rounded hover:bg-gh-canvas-inset transition-colors min-h-[44px]"
              aria-label={allSelected ? t('collections.multiSelectDeselectAll') : t('collections.multiSelectSelectAll')}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2}
              >
                {allSelected ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                  />
                )}
              </svg>
              <span className="hidden sm:inline">
                {allSelected ? t('collections.multiSelectDeselectAll') : t('collections.multiSelectSelectAll')}
              </span>
            </button>
          )}

          {/* Selected Count */}
          <div className="flex items-center gap-2 text-gh-fg-default">
            <svg className="w-5 h-5 text-gh-accent-fg" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
              />
            </svg>
            <span className="text-sm font-medium">
              {t('collections.multiSelectSelected', { count: selectedCount })}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gh-canvas-subtle border border-gh-border-default text-gh-fg-default text-sm rounded hover:bg-gh-canvas-inset transition-colors min-h-[44px]"
          >
            {t('collections.multiSelectCancel')}
          </button>
          <button
            onClick={onAddToCollection}
            disabled={selectedCount === 0}
            className="px-4 py-2 bg-gh-accent-emphasis text-white text-sm rounded hover:bg-gh-accent-fg transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
          >
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              <span className="hidden sm:inline">{t('collections.addToolsTo', { name: collectionName })}</span>
              <span className="sm:hidden">{t('collections.multiSelectAdd', { count: selectedCount })}</span>
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
