import { useState, useMemo, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { SearchBar } from './components/SearchBar';
import { CategoryFilter } from './components/CategoryFilter';
import { AICard } from './components/AICard';
import { ThemeToggle } from './components/ThemeToggle';
import { LanguageToggle } from './components/LanguageToggle';
import { TemplateSelector } from './components/TemplateSelector';
import { AddToolCard } from './components/AddToolCard';
import { AddToolModal } from './components/AddToolModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { RoleSelectorFAB } from './components/RoleSelectorFAB';
import { RoleSelectorModal } from './components/RoleSelectorModal';
import { TitleBar } from './components/TitleBar';
import { aiTools, categories, AITool } from './data/aiData';
import { toolMatchesTemplate } from './data/templateMappings';

function App() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedTemplate, setSelectedTemplate] = useState('all');
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('favorites');
    return saved ? JSON.parse(saved) : [];
  });

  // Convert favorites array to Set for O(1) lookup performance
  const favoritesSet = useMemo(() => new Set(favorites), [favorites]);
  const [isDarkTheme, setIsDarkTheme] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved ? saved === 'dark' : true;
  });
  const [customTools, setCustomTools] = useState<AITool[]>(() => {
    const saved = localStorage.getItem('customTools');
    return saved ? JSON.parse(saved) : [];
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTool, setEditingTool] = useState<AITool | null>(null);
  const [deletingTool, setDeletingTool] = useState<AITool | null>(null);
  const [isRoleSelectorOpen, setIsRoleSelectorOpen] = useState(false);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Apply theme to body and save to localStorage
  useEffect(() => {
    if (isDarkTheme) {
      document.body.classList.remove('light-theme');
    } else {
      document.body.classList.add('light-theme');
    }
    localStorage.setItem('theme', isDarkTheme ? 'dark' : 'light');
  }, [isDarkTheme]);

  // Save custom tools to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('customTools', JSON.stringify(customTools));
  }, [customTools]);

  const toggleFavorite = useCallback((toolId: string) => {
    setFavorites(prev =>
      prev.includes(toolId)
        ? prev.filter(id => id !== toolId)
        : [...prev, toolId]
    );
  }, []);

  const addCustomTool = (toolData: {
    name: string;
    description: string;
    url: string;
    category: string[];
    tags: string[];
    logo: string | string[];
    domain: string;
  }) => {
    const newTool: AITool = {
      id: `custom-${Date.now()}`,
      name: toolData.name,
      description: toolData.description,
      url: toolData.url,
      category: toolData.category,
      logo: toolData.logo,
      tags: toolData.tags,
      domain: toolData.domain,
    };

    setCustomTools(prev => [...prev, newTool]);
  };

  const editCustomTool = (toolId: string, toolData: {
    name: string;
    description: string;
    url: string;
    category: string[];
    tags: string[];
    logo: string | string[];
    domain: string;
  }) => {
    setCustomTools(prev => prev.map(tool =>
      tool.id === toolId
        ? { ...tool, ...toolData }
        : tool
    ));
    setEditingTool(null);
  };

  const deleteCustomTool = (toolId: string) => {
    setCustomTools(prev => prev.filter(tool => tool.id !== toolId));
    // Also remove from favorites if it was favorited
    setFavorites(prev => prev.filter(id => id !== toolId));
    setDeletingTool(null);
  };

  const handleEdit = useCallback((tool: AITool) => {
    setEditingTool(tool);
    setIsModalOpen(true);
  }, []);

  const handleDeleteClick = useCallback((tool: AITool) => {
    setDeletingTool(tool);
  }, []);

  // Extract available categories (excluding special categories)
  const availableCategories = useMemo(() => {
    return categories.filter(cat =>
      cat !== 'All' &&
      cat !== 'Favorites' &&
      cat !== 'Ajout personnel'
    );
  }, []);

  // Templates and icons for role selector (shared with TemplateSelector)
  const templates = useMemo(() => [
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
  ], [t]);

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

  const selectedTemplateData = useMemo(
    () => templates.find(t => t.id === selectedTemplate) || templates[0],
    [templates, selectedTemplate]
  );

  const filteredTools = useMemo(() => {
    // Combine default tools with custom tools
    const allTools = [...aiTools, ...customTools];

    return allTools.filter((tool) => {
      const isCustom = tool.id.startsWith('custom-');

      // Favorites filter
      if (selectedCategory === 'Favorites') {
        return favoritesSet.has(tool.id);
      }

      // "Ajout personnel" filter - show all custom tools
      if (selectedCategory === 'Ajout personnel') {
        return isCustom;
      }

      // Category filter for other categories
      const categoryMatch =
        selectedCategory === 'All' ||
        tool.category.includes(selectedCategory);

      // Search filter
      const searchLower = searchQuery.toLowerCase();
      const searchMatch =
        searchQuery === '' ||
        tool.name.toLowerCase().includes(searchLower) ||
        tool.description.toLowerCase().includes(searchLower) ||
        tool.tags.some((tag) => tag.toLowerCase().includes(searchLower)) ||
        tool.category.some((cat) => cat.toLowerCase().includes(searchLower));

      return categoryMatch && searchMatch;
    });
  }, [searchQuery, selectedCategory, favoritesSet, customTools]);

  // Precompute template matches for all filtered tools for better performance
  const toolsWithTemplateMatch = useMemo(() => {
    return filteredTools.map((tool) => ({
      tool,
      matchesTemplate: toolMatchesTemplate(tool.category, selectedTemplate),
      isCustom: tool.id.startsWith('custom-'),
    }));
  }, [filteredTools, selectedTemplate]);

  return (
    <div className="min-h-screen bg-gh-canvas-default text-gh-fg-default overflow-x-hidden flex flex-col">
      <TitleBar />
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 max-w-full flex-1">
        {/* Header - Optimized responsive layout with clear visual hierarchy */}
        <header className="mb-4 sm:mb-6 border-b border-gh-border-default pb-4 sm:pb-6">
          <div className="flex flex-col gap-3 sm:gap-4">
            {/* Title Row */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex-shrink-0">
                <h1 className="text-2xl sm:text-3xl font-bold text-gh-fg-default mb-1">{t('app.title')}</h1>
                <p className="text-xs sm:text-sm text-gh-fg-muted">
                  {t('app.toolCount', { count: filteredTools.length })}
                  {selectedCategory !== 'All' && ` ${t('app.in')} ${t(`categories.${selectedCategory}`)}`}
                </p>
              </div>

              {/* Utility Buttons - Desktop Only (including TemplateSelector) */}
              <div className="hidden lg:flex items-center gap-2 flex-shrink-0">
                <TemplateSelector
                  selectedTemplate={selectedTemplate}
                  onTemplateChange={setSelectedTemplate}
                />
                <LanguageToggle />
                <ThemeToggle isDark={isDarkTheme} onToggle={() => setIsDarkTheme(!isDarkTheme)} />
              </div>
            </div>

            {/* Search Row - Full Width Priority */}
            <div className="flex items-center gap-2 w-full">
              {/* Search takes priority and most space */}
              <div className="flex-1">
                <SearchBar value={searchQuery} onChange={setSearchQuery} />
              </div>

              {/* Utility Buttons - Mobile/Tablet Only (No TemplateSelector, it's in FAB) */}
              <div className="flex lg:hidden items-center gap-2 flex-shrink-0">
                <LanguageToggle />
                <ThemeToggle isDark={isDarkTheme} onToggle={() => setIsDarkTheme(!isDarkTheme)} />
              </div>
            </div>
          </div>
        </header>

        {/* Category Filter - Mobile optimized */}
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        {/* Tile Grid View - Progressive responsive columns */}
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 min-[480px]:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-8 gap-2 sm:gap-3 md:gap-3">
            {/* Add Tool Card - Only show in "All" category */}
            {selectedCategory === 'All' && (
              <AddToolCard onClick={() => setIsModalOpen(true)} />
            )}

            {/* Existing Tools */}
            {toolsWithTemplateMatch.map(({ tool, matchesTemplate, isCustom }) => {
              const showEditDelete = isCustom && selectedCategory === 'Ajout personnel';
              return (
                <AICard
                  key={tool.id}
                  tool={tool}
                  isFavorite={favoritesSet.has(tool.id)}
                  onToggleFavorite={toggleFavorite}
                  isCustom={isCustom}
                  showEditDelete={showEditDelete}
                  onEdit={showEditDelete ? () => handleEdit(tool) : undefined}
                  onDelete={showEditDelete ? () => handleDeleteClick(tool) : undefined}
                  matchesTemplate={matchesTemplate}
                />
              );
            })}
          </div>

          {/* Empty state for Favorites */}
          {filteredTools.length === 0 && selectedCategory === 'Favorites' && (
            <div className="col-span-full text-center py-12 sm:py-16 border border-gh-border-default rounded-md bg-gh-canvas-subtle mx-2 sm:mx-0">
              <p className="text-gh-fg-muted text-sm">No favorite tools yet</p>
              <p className="text-gh-fg-subtle text-xs mt-1">
                Click the star icon on any tool to add it to your favorites
              </p>
            </div>
          )}

          {/* Empty state for Ajout personnel */}
          {filteredTools.length === 0 && selectedCategory === 'Ajout personnel' && (
            <div className="col-span-full flex flex-col items-center justify-center py-16 sm:py-20 px-4 border-2 border-dashed border-gh-border-muted rounded-lg bg-gh-canvas-subtle/50">
              {/* Large icon */}
              <div className="w-16 h-16 mb-4 rounded-full bg-gh-accent-subtle flex items-center justify-center">
                <svg className="w-8 h-8 text-gh-accent-fg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>

              {/* Heading */}
              <h3 className="text-lg font-semibold text-gh-fg-default mb-2">
                No Custom Tools Yet
              </h3>

              {/* Description */}
              <p className="text-sm text-gh-fg-muted text-center max-w-sm mb-6">
                Add your favorite tools to quickly access them alongside built-in tools.
              </p>

              {/* CTA Button */}
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-2 bg-gh-accent-emphasis text-white rounded-md hover:bg-gh-accent-fg transition-colors font-medium">
                Add Your First Tool
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Tool Modal */}
      <AddToolModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTool(null);
        }}
        onAdd={addCustomTool}
        onEdit={editCustomTool}
        availableCategories={availableCategories}
        editingTool={editingTool}
        mode={editingTool ? 'edit' : 'add'}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!deletingTool}
        toolName={deletingTool?.name || ''}
        onConfirm={() => deletingTool && deleteCustomTool(deletingTool.id)}
        onCancel={() => setDeletingTool(null)}
      />

      {/* Mobile Role Selector FAB */}
      <RoleSelectorFAB
        selectedIcon={
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={2}
            aria-hidden="true"
          >
            {icons[selectedTemplateData.icon as keyof typeof icons]}
          </svg>
        }
        isFilterActive={selectedTemplate !== 'all'}
        onClick={() => setIsRoleSelectorOpen(true)}
      />

      {/* Mobile Role Selector Modal */}
      <RoleSelectorModal
        isOpen={isRoleSelectorOpen}
        onClose={() => setIsRoleSelectorOpen(false)}
        templates={templates}
        selectedTemplate={selectedTemplate}
        onTemplateChange={setSelectedTemplate}
        icons={icons}
      />
    </div>
  );
}

export default App;
