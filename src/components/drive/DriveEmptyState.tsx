import { useTranslation } from 'react-i18next';

interface DriveEmptyStateProps {
  searchQuery: string;
  fileTypeFilter: string;
  onClearFilters: () => void;
}

export function DriveEmptyState({
  searchQuery,
  fileTypeFilter,
  onClearFilters,
}: DriveEmptyStateProps) {
  const { t } = useTranslation();

  const hasFilters = searchQuery || fileTypeFilter !== 'all';

  if (hasFilters) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <svg className="w-24 h-24 text-gh-fg-muted opacity-40 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <h3 className="text-lg font-semibold text-gh-fg-default mb-2">
          {t('googleDrive.noResultsTitle', 'No files found')}
        </h3>
        <p className="text-sm text-gh-fg-muted text-center max-w-md mb-6">
          {searchQuery
            ? t('googleDrive.noResultsSearch', `No files match "${searchQuery}". Try adjusting your search.`)
            : t('googleDrive.noResultsFilter', 'No files match the current filter. Try a different filter.')
          }
        </p>
        <button
          onClick={onClearFilters}
          className="
            px-4 py-2 rounded-lg
            bg-gh-accent-emphasis text-white
            hover:bg-gh-accent-fg
            transition-colors duration-200
            text-sm font-medium
          "
        >
          {t('googleDrive.clearFilters', 'Clear filters')}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="relative mb-6">
        <svg className="w-32 h-32 text-gh-fg-muted opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
        </svg>
        <svg className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 text-gh-fg-muted opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-gh-fg-default mb-2">
        {t('googleDrive.emptyFolderTitle', 'This folder is empty')}
      </h3>
      <p className="text-sm text-gh-fg-muted text-center max-w-md">
        {t('googleDrive.emptyFolderMessage', 'Upload files or create folders to get started with organizing your Drive.')}
      </p>
    </div>
  );
}
