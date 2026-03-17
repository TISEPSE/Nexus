import { useState, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, Routes, Route } from 'react-router-dom';
import { UnifiedHeader } from './components/UnifiedHeader';
import { FloatingMenu } from './components/FloatingMenu';
import { LoadingBar } from './components/LoadingBar';
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
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Derive active view from URL
  const activeView: ViewMode =
    location.pathname === '/workspace'
      ? 'workspace'
      : location.pathname === '/settings'
      ? 'settings'
      : 'dashboard';

  const handleViewChange = useCallback((newView: ViewMode) => {
    logger.log('🔄 View changing to:', newView);

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

    const liveRegion = document.getElementById('view-announcer');
    if (liveRegion) liveRegion.textContent = announcement;

    navigate(newView === 'dashboard' ? '/' : `/${newView}`);
    logger.log('✅ Navigated to:', newView);
  }, [t, navigate]);

  const totalToolsCount = useMemo(() => {
    return aiTools.length + customTools.length;
  }, [customTools.length]);

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

  const categories = useMemo(() => {
    return allCategories;
  }, []);

  return (
    <div className="min-h-screen bg-gh-canvas-default text-gh-fg-default overflow-x-hidden">
      {/* Loading bar on route change */}
      <LoadingBar />

      {/* ARIA live region for screen reader announcements */}
      <div
        id="view-announcer"
        className="sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      />

      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 max-w-full">
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

        {/* Routed pages */}
        <Routes>
          <Route
            path="/"
            element={
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
            }
          />
          <Route
            path="/workspace"
            element={
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
            }
          />
          <Route
            path="/settings"
            element={
              <Settings
                isDarkTheme={isDarkTheme}
                onToggleTheme={onToggleTheme}
              />
            }
          />
          {/* Fallback to dashboard */}
          <Route
            path="*"
            element={
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
            }
          />
        </Routes>

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
