import { useState, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { UnifiedHeader } from './components/UnifiedHeader';
import { FloatingMenu } from './components/FloatingMenu';
import App from './App';
import { MyWorkspace } from './pages/MyWorkspace';
import { AITool, categories as allCategories, aiTools } from './data/aiData';

type ViewMode = 'dashboard' | 'workspace';

interface AppContainerProps {
  favorites: string[];
  customTools: AITool[];
  onToggleFavorite: (toolId: string) => void;
  onAddTool: (toolData: any) => void;
  onEditTool: (toolId: string, toolData: any) => void;
  onDeleteTool: (toolId: string) => void;
  isDarkTheme: boolean;
  onToggleTheme: () => void;
}

export function AppContainer({
  favorites,
  customTools,
  onToggleFavorite,
  onAddTool,
  onEditTool,
  onDeleteTool,
  isDarkTheme,
  onToggleTheme,
}: AppContainerProps) {
  const { t } = useTranslation();
  const [activeView, setActiveView] = useState<ViewMode>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedTemplate, setSelectedTemplate] = useState('all');


  const handleViewChange = useCallback((newView: ViewMode) => {
    // Scroll to top on view change
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Announce to screen readers
    let announcement = '';
    if (newView === 'dashboard') {
      announcement = t('navigation.switchedToDashboard', 'Switched to Dashboard');
    } else if (newView === 'workspace') {
      announcement = t('navigation.switchedToWorkspace', 'Switched to Workspace');
    }

    // Update ARIA live region
    const liveRegion = document.getElementById('view-announcer');
    if (liveRegion) liveRegion.textContent = announcement;

    setActiveView(newView);
  }, [t]);

  // Calculate total tools count
  const totalToolsCount = useMemo(() => {
    return aiTools.length + customTools.length;
  }, [customTools.length]);

  // Compute title and subtitle based on view
  const title = t('app.title');
  let subtitle = '';
  let searchPlaceholder = '';

  if (activeView === 'dashboard') {
    subtitle = t('app.toolCount', { count: totalToolsCount });
    searchPlaceholder = t('search.placeholder');
  } else if (activeView === 'workspace') {
    subtitle = t('workspace.summary', {
      favorites: favorites.length,
      custom: customTools.length,
    });
    searchPlaceholder = t('workspace.searchPlaceholder');
  }

  // Compute available categories
  const categories = useMemo(() => {
    return allCategories;
  }, []);

  // Templates and icons for FloatingMenu
  const templates = useMemo(
    () => [
      { id: 'all', icon: 'grid', label: t('templates.all') },
      { id: 'designer', icon: 'palette', label: t('templates.designer') },
      { id: 'developer', icon: 'code', label: t('templates.developer') },
      { id: 'content-creator', icon: 'video', label: t('templates.contentCreator') },
      { id: 'marketer', icon: 'megaphone', label: t('templates.marketer') },
      { id: 'trader', icon: 'chart', label: t('templates.trader') },
      { id: 'data-analyst', icon: 'chart-bar', label: t('templates.dataAnalyst') },
      { id: '3d-artist', icon: 'cube', label: t('templates.3dArtist') },
      { id: 'video-editor', icon: 'film', label: t('templates.videoEditor') },
      { id: 'student', icon: 'book', label: t('templates.student') },
      { id: 'media-enthusiast', icon: 'play', label: t('templates.mediaEnthusiast') },
    ],
    [t]
  );

  const icons = {
    grid: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    ),
    palette: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
    ),
    code: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    ),
    video: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
    ),
    megaphone: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
    ),
    chart: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    ),
    'chart-bar': (
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    ),
    cube: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    ),
    film: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
    ),
    book: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    ),
    play: (
      <>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </>
    ),
  };

  return (
    <div
      className="min-h-screen bg-gh-canvas-default text-gh-fg-default overflow-x-hidden"
    >
      {/* ARIA live region for screen reader announcements */}
      <div
        id="view-announcer"
        className="sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      />

      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 max-w-full">
        {/* Unified Header - Show for all views */}
        <UnifiedHeader
          activeView={activeView}
          onViewChange={handleViewChange}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder={searchPlaceholder}
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          isDarkTheme={isDarkTheme}
          onToggleTheme={onToggleTheme}
          title={title}
          subtitle={subtitle}
        />

        {/* Content Area - Conditional Rendering */}
        {activeView === 'dashboard' ? (
          <App
            favorites={favorites}
            customTools={customTools}
            onToggleFavorite={onToggleFavorite}
            onAddTool={onAddTool}
            onEditTool={onEditTool}
            onDeleteTool={onDeleteTool}
            searchQuery={searchQuery}
            selectedCategory={selectedCategory}
            selectedTemplate={selectedTemplate}
          />
        ) : (
          <MyWorkspace
            favorites={favorites}
            customTools={customTools}
            searchQuery={searchQuery}
            selectedCategory={selectedCategory}
            selectedTemplate={selectedTemplate}
            onToggleFavorite={onToggleFavorite}
            onAddTool={onAddTool}
            onEditTool={onEditTool}
            onDeleteTool={onDeleteTool}
          />
        )}

        {/* Mobile Floating Menu */}
        <FloatingMenu
          activeView={activeView}
          onViewChange={handleViewChange}
          templates={templates}
          selectedTemplate={selectedTemplate}
          onTemplateChange={setSelectedTemplate}
          icons={icons}
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
      </div>
    </div>
  );
}
