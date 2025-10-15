import { SearchBar } from './SearchBar';
import { CategoryFilterButton } from './CategoryFilterButton';
import { TemplateSelector } from './TemplateSelector';
import { LanguageToggle } from './LanguageToggle';
import { ThemeToggle } from './ThemeToggle';
import { HomeButton } from './HomeButton';
import { MyWorkspaceButton } from './MyWorkspaceButton';

type ViewMode = 'dashboard' | 'workspace';

interface UnifiedHeaderProps {
  // View state
  activeView: ViewMode;
  onViewChange: (view: ViewMode) => void;

  // Search
  searchQuery: string;
  onSearchChange: (query: string) => void;
  searchPlaceholder?: string;

  // Category filter (dashboard only)
  categories?: string[];
  selectedCategory?: string;
  onCategoryChange?: (category: string) => void;

  // Template selector (dashboard only)
  selectedTemplate?: string;
  onTemplateChange?: (template: string) => void;

  // Theme
  isDarkTheme: boolean;
  onToggleTheme: () => void;

  // Display info
  title: string;
  subtitle: string;
}

export function UnifiedHeader({
  activeView,
  onViewChange,
  searchQuery,
  onSearchChange,
  categories,
  selectedCategory,
  onCategoryChange,
  selectedTemplate,
  onTemplateChange,
  isDarkTheme,
  onToggleTheme,
  title,
  subtitle,
}: UnifiedHeaderProps) {
  return (
    <header className="mb-4 border-b border-gh-border-default pb-3">
      <div className="flex flex-col gap-2.5">
        {/* Top Row: Title + All Buttons */}
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

          {/* Unified Control Bar - All Buttons */}
          <div className="flex flex-wrap items-center justify-end gap-1.5">
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

            {/* Filter Group - Toujours visible */}
            <div className="flex items-center gap-1.5">
              {onTemplateChange && (
                <TemplateSelector
                  selectedTemplate={selectedTemplate || 'all'}
                  onTemplateChange={onTemplateChange}
                />
              )}
              {categories && onCategoryChange && (
                <CategoryFilterButton
                  categories={categories}
                  selectedCategory={selectedCategory || 'All'}
                  onCategoryChange={onCategoryChange}
                />
              )}
            </div>

            {/* Divider - Desktop only */}
            <div className="hidden lg:block w-px h-6 bg-gh-border-default mx-1" />

            {/* Settings Group */}
            <div className="flex items-center gap-1.5">
              <LanguageToggle />
              <ThemeToggle isDark={isDarkTheme} onToggle={onToggleTheme} />
            </div>
          </div>
        </div>

        {/* Search Bar - avec marge supplémentaire */}
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
