import { useState, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { UnifiedHeader } from './components/UnifiedHeader';
import { FloatingMenu } from './components/FloatingMenu';
import App from './App';
import { MyWorkspace } from './pages/MyWorkspace';
import { Settings } from './pages/Settings';
import { AITool, categories as allCategories, aiTools } from './data/aiData';
import { ToolFormData } from './types/tool';
import { logger } from './utils/logger';

type ViewMode = 'dashboard' | 'workspace' | 'settings';

interface AppContainerProps {
  favorites: string[];
  customTools: AITool[];
  onAddTool: (toolData: ToolFormData) => void;
  onEditTool: (toolId: string, toolData: ToolFormData) => void;
  onDeleteTool: (toolId: string) => void;
  isDarkTheme: boolean;
  onToggleTheme: () => void;
}

export function AppContainer({
  favorites,
  customTools,
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


  const handleViewChange = useCallback((newView: ViewMode) => {
    logger.log('🔄 View changing to:', newView);

    // Scroll to top on view change
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Announce to screen readers
    let announcement = '';
    if (newView === 'dashboard') {
      announcement = t('navigation.switchedToDashboard', 'Switched to Dashboard');
    } else if (newView === 'workspace') {
      announcement = t('navigation.switchedToWorkspace', 'Switched to Workspace');
    } else if (newView === 'settings') {
      announcement = t('navigation.switchedToSettings', 'Switched to Settings');
    }

    // Update ARIA live region
    const liveRegion = document.getElementById('view-announcer');
    if (liveRegion) liveRegion.textContent = announcement;

    setActiveView(newView);
    logger.log('✅ Active view set to:', newView);
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
  } else if (activeView === 'settings') {
    subtitle = t('settings.subtitle', 'Customize your experience');
    searchPlaceholder = '';
  }

  // Compute available categories
  const categories = useMemo(() => {
    return allCategories;
  }, []);

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
          onViewChange={(view) => handleViewChange(view)}
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
          onOpenSettings={() => handleViewChange('settings')}
        />

        {/* Content Area - Conditional Rendering */}
        {activeView === 'dashboard' ? (
          <App
            favorites={favorites}
            customTools={customTools}
            onAddTool={onAddTool}
            onEditTool={onEditTool}
            onDeleteTool={onDeleteTool}
            searchQuery={searchQuery}
            selectedCategory={selectedCategory}
            selectedTemplate="all"
          />
        ) : activeView === 'workspace' ? (
          <MyWorkspace
            favorites={favorites}
            customTools={customTools}
            searchQuery={searchQuery}
            selectedCategory={selectedCategory}
            selectedTemplate="all"
            onAddTool={onAddTool}
            onEditTool={onEditTool}
            onDeleteTool={onDeleteTool}
          />
        ) : (
          <Settings
            isDarkTheme={isDarkTheme}
            onToggleTheme={onToggleTheme}
          />
        )}

        {/* Mobile Floating Menu - Hide on settings */}
        {activeView !== 'settings' && (
          <FloatingMenu
            activeView={activeView}
            onViewChange={(view) => handleViewChange(view)}
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        )}
      </div>
    </div>
  );
}
