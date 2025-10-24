import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

// Dynamic import to avoid errors when not in Tauri context
const invoke = async (cmd: string, args?: any) => {
  if (typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window) {
    const { invoke: tauriInvoke } = await import('@tauri-apps/api/core');
    return tauriInvoke(cmd, args);
  }
  throw new Error('Tauri is not available');
};

interface GoogleDriveModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  modifiedTime: string;
  size?: number;
  webViewLink?: string;
}

export function GoogleDriveModal({ isOpen, onClose }: GoogleDriveModalProps) {
  const { t } = useTranslation();
  const modalRef = useRef<HTMLDivElement>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [files, setFiles] = useState<DriveFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Close on ESC key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  // Authentication handler
  const handleAuthenticate = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await invoke('google_drive_authenticate') as { success: boolean };
      if (result.success) {
        setIsAuthenticated(true);
        await loadFiles();
      }
    } catch (err) {
      // Fallback to demo mode if Tauri not available
      if (err instanceof Error && err.message === 'Tauri is not available') {
        console.warn('Tauri not available, showing demo files');
        setIsAuthenticated(true);
        setFiles([
          {
            id: 'demo-1',
            name: 'Project Presentation.pptx',
            mimeType: 'application/vnd.google-apps.presentation',
            modifiedTime: new Date().toISOString(),
            size: 2457600,
            webViewLink: 'https://docs.google.com/presentation/d/demo-1',
          },
          {
            id: 'demo-2',
            name: 'Budget 2024.xlsx',
            mimeType: 'application/vnd.google-apps.spreadsheet',
            modifiedTime: new Date().toISOString(),
            size: 1048576,
            webViewLink: 'https://docs.google.com/spreadsheets/d/demo-2',
          },
          {
            id: 'demo-3',
            name: 'Meeting Notes.docx',
            mimeType: 'application/vnd.google-apps.document',
            modifiedTime: new Date().toISOString(),
            size: 524288,
            webViewLink: 'https://docs.google.com/document/d/demo-3',
          },
        ]);
      } else {
        setError(err instanceof Error ? err.message : 'Authentication failed');
        console.error('Auth error:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  // Load files from Google Drive
  const loadFiles = async () => {
    setLoading(true);
    setError(null);
    try {
      const filesList = await invoke('google_drive_list_files') as DriveFile[];
      setFiles(filesList);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load files');
      console.error('Load files error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Format file size
  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'N/A';
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    const mb = kb / 1024;
    if (mb < 1024) return `${mb.toFixed(1)} MB`;
    const gb = mb / 1024;
    return `${gb.toFixed(1)} GB`;
  };

  // Get file icon based on MIME type
  const getFileIcon = (mimeType: string) => {
    if (mimeType.includes('folder')) return '📁';
    if (mimeType.includes('document')) return '📄';
    if (mimeType.includes('spreadsheet')) return '📊';
    if (mimeType.includes('presentation')) return '📊';
    if (mimeType.includes('image')) return '🖼️';
    if (mimeType.includes('video')) return '🎥';
    if (mimeType.includes('audio')) return '🎵';
    return '📎';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-backdrop-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="google-drive-title"
        className="
          absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
          w-[95vw] max-w-4xl max-h-[85vh]
          bg-gh-canvas-subtle
          border-2 border-gh-border-default
          rounded-xl
          shadow-2xl
          flex flex-col
          animate-modal-slide-up
        "
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gh-border-default flex-shrink-0">
          <div className="flex items-center gap-3">
            <svg className="w-6 h-6 text-gh-accent-fg" viewBox="0 0 640 640" fill="currentColor">
              <path d="M403 378.9L239.4 96L400.6 96L564.2 378.9L403 378.9zM265.5 402.5L184.9 544L495.4 544L576 402.5L265.5 402.5zM218.1 131.4L64 402.5L144.6 544L301 272.8L218.1 131.4z"/>
            </svg>
            <h2 id="google-drive-title" className="text-xl font-bold text-gh-fg-default">
              {t('googleDrive.title', 'Google Drive')}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="
              p-2 rounded-md
              text-gh-fg-muted hover:text-gh-fg-default
              hover:bg-gh-canvas-default
              transition-colors
              focus:outline-none
              focus:ring-2
              focus:ring-gh-accent-emphasis
            "
            aria-label={t('common.close', 'Close')}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {!isAuthenticated ? (
            /* Authentication Screen */
            <div className="flex flex-col items-center justify-center py-12 space-y-6">
              <svg className="w-24 h-24 text-gh-accent-fg opacity-80" viewBox="0 0 640 640" fill="currentColor">
                <path d="M403 378.9L239.4 96L400.6 96L564.2 378.9L403 378.9zM265.5 402.5L184.9 544L495.4 544L576 402.5L265.5 402.5zM218.1 131.4L64 402.5L144.6 544L301 272.8L218.1 131.4z"/>
              </svg>
              <div className="text-center space-y-2">
                <h3 className="text-lg font-semibold text-gh-fg-default">
                  {t('googleDrive.connectTitle', 'Connect to Google Drive')}
                </h3>
                <p className="text-sm text-gh-fg-muted max-w-md">
                  {t('googleDrive.connectDescription', 'Sign in with your Google account to access and manage your Drive files.')}
                </p>
              </div>
              <button
                onClick={handleAuthenticate}
                disabled={loading}
                className="
                  px-6 py-3 rounded-lg
                  bg-gh-accent-emphasis
                  text-white font-semibold
                  hover:bg-gh-accent-fg
                  disabled:opacity-50 disabled:cursor-not-allowed
                  transition-all duration-200
                  flex items-center gap-2
                  focus:outline-none
                  focus:ring-2
                  focus:ring-gh-accent-emphasis
                  focus:ring-offset-2
                  focus:ring-offset-gh-canvas-subtle
                "
              >
                {loading ? (
                  <>
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    {t('googleDrive.connecting', 'Connecting...')}
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    {t('googleDrive.signIn', 'Sign in with Google')}
                  </>
                )}
              </button>
              {error && (
                <div className="text-sm text-gh-danger-emphasis bg-gh-danger-emphasis/10 px-4 py-2 rounded-md">
                  {error}
                </div>
              )}
            </div>
          ) : (
            /* Files List */
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gh-fg-muted">
                  {t('googleDrive.filesCount', { count: files.length })} files
                </p>
                <button
                  onClick={loadFiles}
                  disabled={loading}
                  className="
                    px-3 py-1.5 rounded-md
                    text-sm font-medium
                    bg-gh-canvas-default
                    text-gh-fg-default
                    border border-gh-border-default
                    hover:bg-gh-canvas-inset
                    disabled:opacity-50
                    transition-colors
                  "
                >
                  {loading ? 'Loading...' : 'Refresh'}
                </button>
              </div>

              {loading ? (
                <div className="flex justify-center py-12">
                  <svg className="w-8 h-8 animate-spin text-gh-accent-fg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                </div>
              ) : files.length === 0 ? (
                <div className="text-center py-12 text-gh-fg-muted">
                  {t('googleDrive.noFiles', 'No files found')}
                </div>
              ) : (
                <div className="space-y-2">
                  {files.map((file) => (
                    <div
                      key={file.id}
                      className="
                        flex items-center gap-3 p-3 rounded-lg
                        bg-gh-canvas-default
                        border border-gh-border-default
                        hover:border-gh-accent-emphasis
                        transition-colors
                        group
                      "
                    >
                      <span className="text-2xl flex-shrink-0">{getFileIcon(file.mimeType)}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gh-fg-default truncate">
                          {file.name}
                        </p>
                        <p className="text-xs text-gh-fg-muted">
                          {formatFileSize(file.size)} • {new Date(file.modifiedTime).toLocaleDateString()}
                        </p>
                      </div>
                      {file.webViewLink && (
                        <a
                          href={file.webViewLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="
                            px-3 py-1.5 rounded-md
                            text-xs font-medium
                            bg-gh-accent-emphasis
                            text-white
                            opacity-0 group-hover:opacity-100
                            transition-opacity
                            hover:bg-gh-accent-fg
                          "
                        >
                          Open
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {error && (
                <div className="text-sm text-gh-danger-emphasis bg-gh-danger-emphasis/10 px-4 py-2 rounded-md">
                  {error}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
