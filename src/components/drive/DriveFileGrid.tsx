import { DriveFile } from '../../pages/GoogleDrivePage';
import { DriveFileActions } from './DriveFileActions';
import { getFileIcon, formatFileSize, formatDateTime } from '../../utils/driveUtils';

interface DriveFileGridProps {
  files: DriveFile[];
  loading: boolean;
  onFolderClick: (folderId: string, folderName: string) => void;
}

export function DriveFileGrid({
  files,
  loading,
  onFolderClick,
}: DriveFileGridProps) {
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
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-3">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="aspect-[3/4] bg-gh-canvas-subtle border border-gh-border-default rounded-lg animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 xl:grid-cols-8 2xl:grid-cols-9 gap-2.5">
      {files.map((file) => (
        <div
          key={file.id}
          onClick={() => handleFileClick(file)}
          onDoubleClick={() => handleFileDoubleClick(file)}
          className={`
            group relative
            bg-gh-canvas-subtle border border-gh-border-default
            rounded-lg
            hover:border-gh-accent-fg hover:shadow-md hover:bg-gh-canvas-default
            transition-all duration-150
            ${isFolder(file) ? 'cursor-pointer' : 'cursor-default'}
          `}
        >
          {/* File preview area */}
          <div className="aspect-[4/3] flex items-center justify-center bg-gh-canvas-inset border-b border-gh-border-default">
            <div className="w-10 h-10 text-gh-accent-fg opacity-80 group-hover:scale-110 transition-transform duration-200">
              {getFileIcon(file.mimeType)}
            </div>
          </div>

          {/* File info */}
          <div className="p-2 space-y-0.5">
            <div className="min-h-[28px]">
              <h3 className="text-[11px] font-medium text-gh-fg-default line-clamp-2 leading-tight group-hover:text-gh-accent-fg transition-colors">
                {file.name}
              </h3>
            </div>

            <div className="flex items-center justify-between gap-1 pt-0.5">
              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-gh-fg-muted truncate">
                  {formatDateTime(file.modifiedTime, true)}
                </p>
                {!isFolder(file) && file.size && (
                  <p className="text-[10px] text-gh-fg-subtle">
                    {formatFileSize(file.size)}
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <DriveFileActions file={file} compact />
              </div>
            </div>
          </div>

          {/* Folder indicator */}
          {isFolder(file) && (
            <div className="absolute top-2 right-2 bg-gh-accent-emphasis text-white px-2 py-1 rounded text-xs font-medium">
              Folder
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
