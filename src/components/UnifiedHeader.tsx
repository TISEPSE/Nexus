import { SearchBar } from './SearchBar';
import { CategoryFilterButton } from './CategoryFilterButton';
import { LanguageToggle } from './LanguageToggle';
import { ThemeToggle } from './ThemeToggle';
import { HomeButton } from './HomeButton';
import { MyWorkspaceButton } from './MyWorkspaceButton';

type ViewMode = 'dashboard' | 'workspace' | 'settings';

interface UnifiedHeaderProps {
  // View state
  activeView: ViewMode;
  onViewChange: (view: ViewMode) => void;

  // Search
  searchQuery: string;
  onSearchChange: (query: string) => void;
  searchPlaceholder?: string;

  // Category filter
  categories?: string[];
  selectedCategory?: string;
  onCategoryChange?: (category: string) => void;

  // Theme
  isDarkTheme: boolean;
  onToggleTheme: () => void;

  // Display info
  title: string;
  subtitle: string;

  // Settings
  onOpenSettings?: () => void;
}

export function UnifiedHeader({
  activeView,
  onViewChange,
  searchQuery,
  onSearchChange,
  categories,
  selectedCategory,
  onCategoryChange,
  isDarkTheme,
  onToggleTheme,
  title,
  subtitle,
  onOpenSettings,
}: UnifiedHeaderProps) {
  console.log('🎯 UnifiedHeader activeView:', activeView);

  return (
    <header className="mb-4 border-b border-gh-border-default pb-3">
      <div className="flex flex-col gap-2.5">
        {/* Top Row: Title + Buttons */}
        <div className="flex items-center justify-between gap-3">
          {/* Title */}
          <div className="flex-shrink-0">
            <h1 className="text-xl sm:text-2xl font-bold text-gh-fg-default">
              {title}
            </h1>
            <p className="text-xs text-gh-fg-muted">
              {subtitle}
            </p>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-1.5">
            {/* Mobile: Theme + Language + Settings */}
            <div className="flex lg:hidden items-center gap-1.5">
              <LanguageToggle />
              <ThemeToggle isDark={isDarkTheme} onToggle={onToggleTheme} />
              {onOpenSettings && (
                <button
                  onClick={onOpenSettings}
                  className={`group relative flex items-center justify-center gap-1.5 px-2 py-2 min-h-[44px] min-w-[44px] rounded-md border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gh-accent-fg ${
                    activeView === 'settings'
                      ? 'bg-gh-accent-subtle border-gh-accent-emphasis text-gh-accent-fg'
                      : 'bg-gh-canvas-subtle border-gh-border-default hover:bg-gh-canvas-inset hover:border-gh-accent-fg'
                  }`}
                  title="Settings"
                  aria-label="Open settings"
                  aria-current={activeView === 'settings' ? 'page' : undefined}
                >
                  <svg className={`w-5 h-5 transition-colors ${activeView === 'settings' ? 'text-gh-accent-fg' : 'text-gh-fg-default group-hover:text-gh-accent-fg'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
              )}
            </div>

            {/* Desktop: Full Controls */}
            <div className="hidden lg:flex items-center gap-1.5">
              {/* Navigation Group */}
              <div className="flex items-center gap-1.5">
                <HomeButton
                  isActive={activeView === 'dashboard'}
                  onClick={() => onViewChange('dashboard')}
                />
                <MyWorkspaceButton
                  isActive={activeView === 'workspace'}
                  onClick={() => onViewChange('workspace')}
                />
              </div>

              {/* Filter Group */}
              <div className="flex items-center gap-1.5">
                {categories && onCategoryChange && (
                  <CategoryFilterButton
                    categories={categories}
                    selectedCategory={selectedCategory || 'All'}
                    onCategoryChange={onCategoryChange}
                  />
                )}
              </div>

              {/* Divider */}
              <div className="w-px h-6 bg-gh-border-default mx-1" />

              {/* Settings Group - Language + Theme + Settings */}
              <div className="flex items-center gap-1.5">
                <LanguageToggle />
                <ThemeToggle isDark={isDarkTheme} onToggle={onToggleTheme} />
                {onOpenSettings && (
                  <button
                    onClick={onOpenSettings}
                    className={`group relative flex items-center justify-center gap-1.5 px-2 sm:px-3 py-2 min-h-[44px] min-w-[44px] rounded-md border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gh-accent-fg focus:ring-offset-2 focus:ring-offset-gh-canvas-default ${
                      activeView === 'settings'
                        ? 'bg-gh-accent-subtle border-gh-accent-emphasis text-gh-accent-fg'
                        : 'bg-gh-canvas-subtle border-gh-border-default hover:bg-gh-canvas-inset hover:border-gh-accent-fg'
                    }`}
                    title="Settings"
                    aria-label="Open settings"
                    aria-current={activeView === 'settings' ? 'page' : undefined}
                  >
                    <svg className={`w-5 h-5 transition-colors ${activeView === 'settings' ? 'text-gh-accent-fg' : 'text-gh-fg-default group-hover:text-gh-accent-fg'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="w-full mt-1">
          <SearchBar
            value={searchQuery}
            onChange={onSearchChange}
          />
        </div>
      </div>
    </header>
  );
}
