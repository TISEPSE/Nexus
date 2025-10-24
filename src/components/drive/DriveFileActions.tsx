import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { DriveFile } from '../../pages/GoogleDrivePage';

interface DriveFileActionsProps {
  file: DriveFile;
  compact?: boolean;
}

export function DriveFileActions({ file, compact = false }: DriveFileActionsProps) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isFolder = file.mimeType.includes('folder');

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleOpen = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (file.webViewLink) {
      window.open(file.webViewLink, '_blank');
    }
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    // TODO: Implement download functionality
    console.log('Download file:', file.id);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    // TODO: Implement share functionality
    console.log('Share file:', file.id);
  };

  const handleCopyLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (file.webViewLink) {
      navigator.clipboard.writeText(file.webViewLink);
      // TODO: Show toast notification
      console.log('Link copied:', file.webViewLink);
    }
  };

  const handleRename = (e: React.MouseEvent) => {
    e.stopPropagation();
    // TODO: Implement rename functionality
    console.log('Rename file:', file.id);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    // TODO: Implement delete functionality
    console.log('Delete file:', file.id);
  };

  const toggleDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Quick actions for non-compact mode */}
      {!compact && !isFolder && file.webViewLink && (
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleOpen}
            className="
              px-3 py-1.5 rounded-md
              text-xs font-medium
              bg-gh-accent-emphasis text-white
              hover:bg-gh-accent-fg
              transition-colors
            "
            title={t('googleDrive.open', 'Open')}
          >
            {t('googleDrive.open', 'Open')}
          </button>

          {/* More actions button */}
          <button
            onClick={toggleDropdown}
            className="
              p-1.5 rounded-md
              text-gh-fg-muted hover:text-gh-fg-default
              hover:bg-gh-canvas-default
              transition-colors
            "
            aria-label={t('googleDrive.moreActions', 'More actions')}
            title={t('googleDrive.moreActions', 'More actions')}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
        </div>
      )}

      {/* Compact mode - just the menu button */}
      {(compact || isFolder) && (
        <button
          onClick={toggleDropdown}
          className="
            p-1.5 rounded-md
            text-gh-fg-muted hover:text-gh-fg-default
            hover:bg-gh-canvas-default
            transition-colors
          "
          aria-label={t('googleDrive.moreActions', 'More actions')}
          title={t('googleDrive.moreActions', 'More actions')}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
          </svg>
        </button>
      )}

      {/* Dropdown menu */}
      {isOpen && (
        <div
          className="
            absolute right-0 top-full mt-1 z-50
            w-48 py-1
            bg-gh-canvas-subtle border border-gh-border-default
            rounded-lg shadow-lg
            animate-modal-slide-up
          "
          onClick={(e) => e.stopPropagation()}
        >
          {!isFolder && file.webViewLink && (
            <button
              onClick={handleOpen}
              className="
                w-full flex items-center gap-3 px-3 py-2
                text-sm text-gh-fg-default
                hover:bg-gh-canvas-default
                transition-colors
              "
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              {t('googleDrive.open', 'Open')}
            </button>
          )}

          {!isFolder && (
            <button
              onClick={handleDownload}
              className="
                w-full flex items-center gap-3 px-3 py-2
                text-sm text-gh-fg-default
                hover:bg-gh-canvas-default
                transition-colors
              "
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              {t('googleDrive.download', 'Download')}
            </button>
          )}

          <button
            onClick={handleShare}
            className="
              w-full flex items-center gap-3 px-3 py-2
              text-sm text-gh-fg-default
              hover:bg-gh-canvas-default
              transition-colors
            "
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            {t('googleDrive.share', 'Share')}
          </button>

          {file.webViewLink && (
            <button
              onClick={handleCopyLink}
              className="
                w-full flex items-center gap-3 px-3 py-2
                text-sm text-gh-fg-default
                hover:bg-gh-canvas-default
                transition-colors
              "
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
              </svg>
              {t('googleDrive.copyLink', 'Copy link')}
            </button>
          )}

          <div className="h-px bg-gh-border-default my-1" />

          <button
            onClick={handleRename}
            className="
              w-full flex items-center gap-3 px-3 py-2
              text-sm text-gh-fg-default
              hover:bg-gh-canvas-default
              transition-colors
            "
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            {t('googleDrive.rename', 'Rename')}
          </button>

          <button
            onClick={handleDelete}
            className="
              w-full flex items-center gap-3 px-3 py-2
              text-sm text-gh-danger-emphasis
              hover:bg-gh-danger-emphasis/10
              transition-colors
            "
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            {t('googleDrive.delete', 'Delete')}
          </button>
        </div>
      )}
    </div>
  );
}
