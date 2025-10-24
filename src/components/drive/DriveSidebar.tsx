import { useTranslation } from 'react-i18next';

interface DriveSidebarProps {
  fileTypeFilter: string;
  onFileTypeFilterChange: (type: string) => void;
  filesCount: number;
}

export function DriveSidebar({
  fileTypeFilter,
  onFileTypeFilterChange,
  filesCount,
}: DriveSidebarProps) {
  const { t } = useTranslation();

  const fileTypes = [
    {
      id: 'all',
      label: t('googleDrive.filterAll', 'All files'),
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      id: 'folders',
      label: t('googleDrive.filterFolders', 'Folders'),
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
        </svg>
      ),
    },
    {
      id: 'documents',
      label: t('googleDrive.filterDocuments', 'Documents'),
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      id: 'spreadsheets',
      label: t('googleDrive.filterSpreadsheets', 'Spreadsheets'),
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      id: 'presentations',
      label: t('googleDrive.filterPresentations', 'Presentations'),
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
        </svg>
      ),
    },
    {
      id: 'images',
      label: t('googleDrive.filterImages', 'Images'),
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      id: 'pdfs',
      label: t('googleDrive.filterPDFs', 'PDFs'),
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
    },
  ];

  return (
    <aside className="w-60 flex-shrink-0">
      <div className="sticky top-6 space-y-6">
        {/* Quick Access */}
        <div>
          <h3 className="text-xs font-semibold text-gh-fg-muted uppercase tracking-wider mb-3">
            {t('googleDrive.quickAccess', 'Quick Access')}
          </h3>
          <nav className="space-y-1">
            {fileTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => onFileTypeFilterChange(type.id)}
                className={`
                  w-full flex items-center gap-3 px-3 py-2 rounded-md
                  text-sm font-medium transition-all duration-200
                  ${fileTypeFilter === type.id
                    ? 'bg-gh-accent-emphasis text-white'
                    : 'text-gh-fg-default hover:bg-gh-canvas-subtle hover:text-gh-accent-fg'
                  }
                `}
              >
                {type.icon}
                <span className="flex-1 text-left">{type.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Storage Info */}
        <div className="bg-gh-canvas-subtle border border-gh-border-default rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-gh-fg-muted uppercase tracking-wider">
              {t('googleDrive.storage', 'Storage')}
            </h3>
            <svg className="w-4 h-4 text-gh-fg-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
            </svg>
          </div>

          {/* Progress bar */}
          <div className="space-y-2">
            <div className="h-2 bg-gh-border-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-gh-accent-emphasis transition-all duration-500"
                style={{ width: '45%' }}
              />
            </div>
            <p className="text-xs text-gh-fg-muted">
              6.8 GB of 15 GB used
            </p>
          </div>

          {/* Files count */}
          <div className="pt-3 border-t border-gh-border-muted">
            <p className="text-xs text-gh-fg-muted">
              <span className="font-semibold text-gh-fg-default">{filesCount}</span> {t('googleDrive.filesInView', 'files in current view')}
            </p>
          </div>
        </div>

        {/* Help Section */}
        <div className="bg-gh-canvas-subtle border border-gh-border-default rounded-lg p-4 space-y-2">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-gh-accent-fg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-xs font-semibold text-gh-fg-default uppercase tracking-wider">
              {t('googleDrive.tips', 'Tips')}
            </h3>
          </div>
          <p className="text-xs text-gh-fg-muted leading-relaxed">
            {t('googleDrive.tipMessage', 'Double-click folders to navigate, right-click files for more options.')}
          </p>
        </div>
      </div>
    </aside>
  );
}
