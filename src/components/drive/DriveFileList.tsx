import { DriveFile } from '../../pages/GoogleDrivePage';
import { useTranslation } from 'react-i18next';
import { DriveFileActions } from './DriveFileActions';
import { getFileIcon, formatFileSize, formatDateTime } from '../../utils/driveUtils';

type SortBy = 'name' | 'modifiedTime' | 'size';
type SortOrder = 'asc' | 'desc';

interface DriveFileListProps {
  files: DriveFile[];
  loading: boolean;
  onFolderClick: (folderId: string, folderName: string) => void;
  sortBy: SortBy;
  sortOrder: SortOrder;
}

export function DriveFileList({
  files,
  loading,
  onFolderClick,
  sortBy,
  sortOrder,
}: DriveFileListProps) {
  const { t } = useTranslation();

  const isFolder = (file: DriveFile) => file.mimeType.includes('folder');

  const handleFileClick = (file: DriveFile) => {
    if (isFolder(file)) {
      onFolderClick(file.id, file.name);
    }
  };

  const handleFileDoubleClick = (file: DriveFile) => {
    if (isFolder(file)) {
      onFolderClick(file.id, file.name);
    } else if (file.webViewLink) {
      window.open(file.webViewLink, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="h-16 bg-gh-canvas-subtle border border-gh-border-default rounded-lg animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="bg-gh-canvas-subtle border border-gh-border-default rounded-lg overflow-x-auto">
      {/* Table Header */}
      <div className="bg-gh-canvas-inset border-b border-gh-border-default px-4 py-3">
        <div className="grid grid-cols-12 gap-4 items-center">
          <div className="col-span-6 sm:col-span-5 flex items-center gap-2">
            <span className="text-xs font-semibold text-gh-fg-muted uppercase tracking-wider">
              {t('googleDrive.name', 'Name')}
            </span>
            {sortBy === 'name' && (
              <svg className="w-4 h-4 text-gh-accent-fg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {sortOrder === 'asc' ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                )}
              </svg>
            )}
          </div>
          <div className="hidden sm:flex col-span-3 items-center gap-2">
            <span className="text-xs font-semibold text-gh-fg-muted uppercase tracking-wider">
              {t('googleDrive.modified', 'Modified')}
            </span>
            {sortBy === 'modifiedTime' && (
              <svg className="w-4 h-4 text-gh-accent-fg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {sortOrder === 'asc' ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                )}
              </svg>
            )}
          </div>
          <div className="hidden md:flex col-span-2 items-center gap-2">
            <span className="text-xs font-semibold text-gh-fg-muted uppercase tracking-wider">
              {t('googleDrive.size', 'Size')}
            </span>
            {sortBy === 'size' && (
              <svg className="w-4 h-4 text-gh-accent-fg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {sortOrder === 'asc' ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                )}
              </svg>
            )}
          </div>
          <div className="col-span-6 sm:col-span-2 flex justify-end">
            <span className="text-xs font-semibold text-gh-fg-muted uppercase tracking-wider">
              {t('googleDrive.actions', 'Actions')}
            </span>
          </div>
        </div>
      </div>

      {/* File List */}
      <div className="divide-y divide-gh-border-default">
        {files.map((file) => (
          <div
            key={file.id}
            onClick={() => handleFileClick(file)}
            onDoubleClick={() => handleFileDoubleClick(file)}
            className={`
              group px-4 py-2.5 relative
              hover:bg-gh-canvas-default
              transition-colors duration-100
              ${isFolder(file) ? 'cursor-pointer' : 'cursor-default'}
            `}
          >
            <div className="grid grid-cols-12 gap-4 items-center">
              {/* Name column */}
              <div className="col-span-6 sm:col-span-5 flex items-center gap-2.5 min-w-0">
                <div className="flex-shrink-0 w-7 h-7 text-gh-accent-fg">
                  {getFileIcon(file.mimeType)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-medium text-gh-fg-default truncate group-hover:text-gh-accent-fg transition-colors">
                    {file.name}
                  </p>
                  {/* Mobile: show date below name */}
                  <p className="sm:hidden text-[11px] text-gh-fg-muted mt-0.5">
                    {formatDateTime(file.modifiedTime)}
                  </p>
                </div>
              </div>

              {/* Modified column - hidden on mobile */}
              <div className="hidden sm:block col-span-3">
                <p className="text-[13px] text-gh-fg-muted">
                  {formatDateTime(file.modifiedTime)}
                </p>
              </div>

              {/* Size column - hidden on mobile/tablet */}
              <div className="hidden md:block col-span-2">
                <p className="text-[13px] text-gh-fg-muted">
                  {isFolder(file) ? '—' : formatFileSize(file.size)}
                </p>
              </div>

              {/* Actions column */}
              <div className="col-span-6 sm:col-span-2 flex justify-end">
                <DriveFileActions file={file} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
