import { useTranslation } from 'react-i18next';

type ViewMode = 'list' | 'grid';
type SortBy = 'name' | 'modifiedTime' | 'size';
type SortOrder = 'asc' | 'desc';

interface BreadcrumbItem {
  id: string;
  name: string;
}

interface DriveToolbarProps {
  breadcrumb: BreadcrumbItem[];
  onBreadcrumbClick: (index: number) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onRefresh: () => void;
  loading: boolean;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  fileTypeFilter: string;
  onFileTypeFilterChange: (type: string) => void;
  sortBy: SortBy;
  sortOrder: SortOrder;
  onSortChange: (sort: SortBy) => void;
  onSortOrderChange: (order: SortOrder) => void;
}

export function DriveToolbar({
  breadcrumb,
  onBreadcrumbClick,
  viewMode,
  onViewModeChange,
  onRefresh,
  loading,
  fileTypeFilter,
  onFileTypeFilterChange,
  sortBy,
  sortOrder,
  onSortChange,
  onSortOrderChange,
}: DriveToolbarProps) {
  const { t } = useTranslation();

  const filterOptions = [
    { id: 'all', label: t('googleDrive.filterAll', 'Tous les fichiers') },
    { id: 'folders', label: t('googleDrive.filterFolders', 'Dossiers') },
    { id: 'documents', label: t('googleDrive.filterDocuments', 'Documents') },
    { id: 'spreadsheets', label: t('googleDrive.filterSpreadsheets', 'Feuilles de calcul') },
    { id: 'presentations', label: t('googleDrive.filterPresentations', 'Présentations') },
    { id: 'images', label: t('googleDrive.filterImages', 'Images') },
    { id: 'pdfs', label: t('googleDrive.filterPDFs', 'PDFs') },
  ];


  return (
    <div className="flex items-center justify-between gap-3 py-1.5">
      {/* LEFT: Breadcrumb */}
      <nav className="flex items-center gap-1.5 flex-1 min-w-0 overflow-x-auto scrollbar-thin" aria-label="Breadcrumb">
        {breadcrumb.map((item, index) => (
          <div key={item.id} className="flex items-center gap-1.5 flex-shrink-0">
            {index > 0 && (
              <svg className="w-3.5 h-3.5 text-gh-fg-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            )}
            <button
              onClick={() => onBreadcrumbClick(index)}
              className={`
                px-2 py-1 rounded-md text-sm font-medium transition-colors
                ${index === breadcrumb.length - 1
                  ? 'text-gh-fg-default bg-gh-canvas-subtle cursor-default'
                  : 'text-gh-fg-muted hover:text-gh-accent-fg hover:bg-gh-canvas-subtle'
                }
              `}
              disabled={index === breadcrumb.length - 1}
            >
              {item.name}
            </button>
          </div>
        ))}
      </nav>

      {/* RIGHT: Compact controls */}
      <div className="flex items-center gap-1.5 flex-shrink-0">
        {/* File type filter */}
        <select
          value={fileTypeFilter}
          onChange={(e) => onFileTypeFilterChange(e.target.value)}
          className="
            h-9 px-2.5 pr-8 text-xs font-medium
            bg-gh-canvas-subtle border border-gh-border-default rounded-md
            text-gh-fg-default
            focus:outline-none focus:ring-2 focus:ring-gh-accent-emphasis
            transition-all cursor-pointer appearance-none
          "
          style={{
            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
            backgroundPosition: 'right 0.5rem center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '1.5em 1.5em'
          }}
        >
          {filterOptions.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>

        {/* Sort control - combined */}
        <select
          value={`${sortBy}-${sortOrder}`}
          onChange={(e) => {
            const [newSort, newOrder] = e.target.value.split('-');
            onSortChange(newSort as SortBy);
            onSortOrderChange(newOrder as SortOrder);
          }}
          className="
            h-9 px-2.5 pr-8 text-xs font-medium
            bg-gh-canvas-subtle border border-gh-border-default rounded-md
            text-gh-fg-default
            focus:outline-none focus:ring-2 focus:ring-gh-accent-emphasis
            transition-all cursor-pointer appearance-none
          "
          style={{
            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
            backgroundPosition: 'right 0.5rem center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '1.5em 1.5em'
          }}
        >
          <option value="name-asc">{t('googleDrive.sortNameAsc', 'Nom (A→Z)')}</option>
          <option value="name-desc">{t('googleDrive.sortNameDesc', 'Nom (Z→A)')}</option>
          <option value="modifiedTime-desc">{t('googleDrive.sortNewest', 'Plus récent')}</option>
          <option value="modifiedTime-asc">{t('googleDrive.sortOldest', 'Plus ancien')}</option>
          <option value="size-desc">{t('googleDrive.sortLargest', 'Plus grand')}</option>
          <option value="size-asc">{t('googleDrive.sortSmallest', 'Plus petit')}</option>
        </select>

        {/* View mode toggle - compact */}
        <div className="flex items-center border border-gh-border-default rounded-md overflow-hidden">
          <button
            onClick={() => onViewModeChange('list')}
            className={`
              p-2 h-9 w-9 transition-colors flex items-center justify-center
              ${viewMode === 'list'
                ? 'bg-gh-accent-emphasis text-white'
                : 'bg-gh-canvas-subtle text-gh-fg-muted hover:text-gh-fg-default hover:bg-gh-canvas-inset'
              }
            `}
            aria-label={t('googleDrive.listView', 'Vue liste')}
            title={t('googleDrive.listView', 'Vue liste')}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="w-px h-5 bg-gh-border-default" />
          <button
            onClick={() => onViewModeChange('grid')}
            className={`
              p-2 h-9 w-9 transition-colors flex items-center justify-center
              ${viewMode === 'grid'
                ? 'bg-gh-accent-emphasis text-white'
                : 'bg-gh-canvas-subtle text-gh-fg-muted hover:text-gh-fg-default hover:bg-gh-canvas-inset'
              }
            `}
            aria-label={t('googleDrive.gridView', 'Vue grille')}
            title={t('googleDrive.gridView', 'Vue grille')}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>
        </div>

        {/* Refresh button */}
        <button
          onClick={onRefresh}
          disabled={loading}
          className="
            p-2 h-9 w-9 rounded-md
            bg-gh-canvas-subtle border border-gh-border-default
            hover:bg-gh-canvas-inset hover:border-gh-accent-fg
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-all flex items-center justify-center
          "
          aria-label={t('googleDrive.refresh', 'Actualiser')}
          title={t('googleDrive.refresh', 'Actualiser')}
        >
          <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>
    </div>
  );
}
