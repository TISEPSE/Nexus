import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DriveToolbar } from '../components/drive/DriveToolbar';
import { DriveFileList } from '../components/drive/DriveFileList';
import { DriveFileGrid } from '../components/drive/DriveFileGrid';
import { DriveEmptyState } from '../components/drive/DriveEmptyState';

// Dynamic import to avoid errors when not in Tauri context
const invoke = async (cmd: string, args?: any) => {
  if (typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window) {
    const { invoke: tauriInvoke } = await import('@tauri-apps/api/core');
    return tauriInvoke(cmd, args);
  }
  throw new Error('Tauri is not available');
};

export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  modifiedTime: string;
  size?: number;
  webViewLink?: string;
  iconLink?: string;
  parents?: string[];
}

type ViewMode = 'list' | 'grid';
type SortBy = 'name' | 'modifiedTime' | 'size';
type SortOrder = 'asc' | 'desc';

interface BreadcrumbItem {
  id: string;
  name: string;
}

interface GoogleDrivePageProps {
  searchQuery: string;
}

export function GoogleDrivePage({ searchQuery }: GoogleDrivePageProps) {
  const { t } = useTranslation();

  // Authentication & data
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [files, setFiles] = useState<DriveFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Navigation & view
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [breadcrumb, setBreadcrumb] = useState<BreadcrumbItem[]>([
    { id: 'root', name: t('googleDrive.myDrive', 'My Drive') }
  ]);
  const [viewMode, setViewMode] = useState<ViewMode>('list');

  // Filters
  const [fileTypeFilter, setFileTypeFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortBy>('modifiedTime');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  // Check authentication on mount
  useEffect(() => {
    checkAuthentication();
  }, []);

  const checkAuthentication = async () => {
    // For demo purposes, auto-authenticate
    try {
      // In production, check if token exists
      setIsAuthenticated(true);
      await loadFiles();
    } catch (err) {
      console.error('Auth check failed:', err);
    }
  };

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
      // Fallback to demo mode
      if (err instanceof Error && err.message === 'Tauri is not available') {
        console.warn('Tauri not available, showing demo files');
        setIsAuthenticated(true);
        loadDemoFiles();
      } else {
        setError(err instanceof Error ? err.message : 'Authentication failed');
        console.error('Auth error:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  // Load files from Google Drive
  const loadFiles = async (folderId?: string) => {
    setLoading(true);
    setError(null);
    try {
      const filesList = await invoke('google_drive_list_files', {
        folderId: folderId || undefined
      }) as DriveFile[];
      setFiles(filesList);
    } catch (err) {
      // Fallback to demo mode
      if (err instanceof Error && err.message === 'Tauri is not available') {
        loadDemoFiles();
      } else {
        setError(err instanceof Error ? err.message : 'Failed to load files');
        console.error('Load files error:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  // Demo files for development
  const loadDemoFiles = () => {
    const demoFiles: DriveFile[] = [
      {
        id: 'folder-1',
        name: 'Projects',
        mimeType: 'application/vnd.google-apps.folder',
        modifiedTime: new Date(2024, 9, 15).toISOString(),
      },
      {
        id: 'folder-2',
        name: 'Documents',
        mimeType: 'application/vnd.google-apps.folder',
        modifiedTime: new Date(2024, 9, 10).toISOString(),
      },
      {
        id: 'demo-1',
        name: 'Project Presentation.pptx',
        mimeType: 'application/vnd.google-apps.presentation',
        modifiedTime: new Date(2024, 9, 20).toISOString(),
        size: 2457600,
        webViewLink: 'https://docs.google.com/presentation/d/demo-1',
      },
      {
        id: 'demo-2',
        name: 'Budget 2024.xlsx',
        mimeType: 'application/vnd.google-apps.spreadsheet',
        modifiedTime: new Date(2024, 9, 18).toISOString(),
        size: 1048576,
        webViewLink: 'https://docs.google.com/spreadsheets/d/demo-2',
      },
      {
        id: 'demo-3',
        name: 'Meeting Notes.docx',
        mimeType: 'application/vnd.google-apps.document',
        modifiedTime: new Date(2024, 9, 19).toISOString(),
        size: 524288,
        webViewLink: 'https://docs.google.com/document/d/demo-3',
      },
      {
        id: 'demo-4',
        name: 'Team Photo.jpg',
        mimeType: 'image/jpeg',
        modifiedTime: new Date(2024, 9, 12).toISOString(),
        size: 3145728,
        webViewLink: 'https://drive.google.com/file/d/demo-4',
      },
      {
        id: 'demo-5',
        name: 'Design System.pdf',
        mimeType: 'application/pdf',
        modifiedTime: new Date(2024, 9, 8).toISOString(),
        size: 8388608,
        webViewLink: 'https://drive.google.com/file/d/demo-5',
      },
    ];
    setFiles(demoFiles);
  };

  // Navigate to folder
  const handleFolderClick = (folderId: string, folderName: string) => {
    setCurrentFolderId(folderId);
    setBreadcrumb([...breadcrumb, { id: folderId, name: folderName }]);
    loadFiles(folderId);
  };

  // Navigate via breadcrumb
  const handleBreadcrumbClick = (index: number) => {
    const newBreadcrumb = breadcrumb.slice(0, index + 1);
    setBreadcrumb(newBreadcrumb);
    const folderId = newBreadcrumb[newBreadcrumb.length - 1].id;
    setCurrentFolderId(folderId === 'root' ? null : folderId);
    loadFiles(folderId === 'root' ? undefined : folderId);
  };

  // Refresh files
  const handleRefresh = () => {
    loadFiles(currentFolderId || undefined);
  };

  // Filter and sort files
  const getFilteredAndSortedFiles = () => {
    let filtered = [...files];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(file =>
        file.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // File type filter
    if (fileTypeFilter !== 'all') {
      filtered = filtered.filter(file => {
        switch (fileTypeFilter) {
          case 'folders':
            return file.mimeType.includes('folder');
          case 'documents':
            return file.mimeType.includes('document');
          case 'spreadsheets':
            return file.mimeType.includes('spreadsheet');
          case 'presentations':
            return file.mimeType.includes('presentation');
          case 'images':
            return file.mimeType.includes('image');
          case 'pdfs':
            return file.mimeType.includes('pdf');
          default:
            return true;
        }
      });
    }

    // Sort
    filtered.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'modifiedTime':
          comparison = new Date(a.modifiedTime).getTime() - new Date(b.modifiedTime).getTime();
          break;
        case 'size':
          comparison = (a.size || 0) - (b.size || 0);
          break;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  };

  const filteredFiles = getFilteredAndSortedFiles();

  // Not authenticated - show sign-in screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gh-canvas-default">
        <div className="max-w-md w-full text-center space-y-6">
          <svg className="w-24 h-24 mx-auto text-gh-accent-fg opacity-80" viewBox="0 0 640 640" fill="currentColor">
            <path d="M403 378.9L239.4 96L400.6 96L564.2 378.9L403 378.9zM265.5 402.5L184.9 544L495.4 544L576 402.5L265.5 402.5zM218.1 131.4L64 402.5L144.6 544L301 272.8L218.1 131.4z"/>
          </svg>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-gh-fg-default">
              {t('googleDrive.connectTitle', 'Connect to Google Drive')}
            </h1>
            <p className="text-sm text-gh-fg-muted">
              {t('googleDrive.connectDescription', 'Sign in with your Google account to access and manage your Drive files.')}
            </p>
          </div>
          <button
            onClick={handleAuthenticate}
            disabled={loading}
            className="
              px-6 py-3 rounded-lg w-full
              bg-gh-accent-emphasis
              text-white font-semibold
              hover:bg-gh-accent-fg
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-all duration-200
              flex items-center justify-center gap-2
              focus:outline-none
              focus:ring-2
              focus:ring-gh-accent-emphasis
              focus:ring-offset-2
              focus:ring-offset-gh-canvas-default
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
      </div>
    );
  }

  // Main drive interface
  return (
    <div className="h-full flex flex-col">
      {/* Compact Toolbar */}
      <div className="mb-3">
        <DriveToolbar
          breadcrumb={breadcrumb}
          onBreadcrumbClick={handleBreadcrumbClick}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onRefresh={handleRefresh}
          loading={loading}
          searchQuery={searchQuery}
          onSearchChange={() => {}} // Search handled by UnifiedHeader
          fileTypeFilter={fileTypeFilter}
          onFileTypeFilterChange={setFileTypeFilter}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSortChange={setSortBy}
          onSortOrderChange={setSortOrder}
        />
      </div>

      {/* Full-width content - no sidebar */}
      <div className="flex-1 min-h-0">
        {error ? (
          <div className="bg-gh-danger-emphasis/10 border border-gh-danger-emphasis rounded-lg p-4">
            <p className="text-gh-danger-emphasis text-sm">{error}</p>
          </div>
        ) : filteredFiles.length === 0 && !loading ? (
          <DriveEmptyState
            searchQuery={searchQuery}
            fileTypeFilter={fileTypeFilter}
            onClearFilters={() => {
              setFileTypeFilter('all');
            }}
          />
        ) : viewMode === 'list' ? (
          <DriveFileList
            files={filteredFiles}
            loading={loading}
            onFolderClick={handleFolderClick}
            sortBy={sortBy}
            sortOrder={sortOrder}
          />
        ) : (
          <DriveFileGrid
            files={filteredFiles}
            loading={loading}
            onFolderClick={handleFolderClick}
          />
        )}
      </div>
    </div>
  );
}
