import { useState, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { UnifiedHeader } from './components/UnifiedHeader';
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
    const announcement =
      newView === 'dashboard'
        ? t('navigation.switchedToDashboard')
        : t('navigation.switchedToWorkspace');

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
  const subtitle =
    activeView === 'dashboard'
      ? t('app.toolCount', { count: totalToolsCount })
      : t('workspace.summary', {
          favorites: favorites.length,
          custom: customTools.length,
        });

  const searchPlaceholder =
    activeView === 'dashboard'
      ? t('search.placeholder')
      : t('workspace.searchPlaceholder');

  // Compute available categories
  const categories = useMemo(() => {
    return allCategories;
  }, []);

  return (
    <div className="min-h-screen bg-gh-canvas-default text-gh-fg-default overflow-x-hidden">
      {/* ARIA live region for screen reader announcements */}
      <div
        id="view-announcer"
        className="sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      />

      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 max-w-full">
        {/* Unified Header */}
        <UnifiedHeader
          activeView={activeView}
          onViewChange={handleViewChange}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder={searchPlaceholder}
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          selectedTemplate={selectedTemplate}
          onTemplateChange={setSelectedTemplate}
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
            onCategoryChange={setSelectedCategory}
            onTemplateChange={setSelectedTemplate}
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
      </div>
    </div>
  );
}
