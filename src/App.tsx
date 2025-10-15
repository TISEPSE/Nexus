import { useState, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { AICard } from './components/AICard';
import { AddToolCard } from './components/AddToolCard';
import { AddToolModal } from './components/AddToolModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { RoleSelectorFAB } from './components/RoleSelectorFAB';
import { RoleSelectorModal } from './components/RoleSelectorModal';
import { UpdateChecker } from './components/UpdateChecker';
import { aiTools, categories, AITool } from './data/aiData';
import { toolMatchesTemplate } from './data/templateMappings';

interface AppProps {
  favorites: string[];
  customTools: AITool[];
  onToggleFavorite: (toolId: string) => void;
  onAddTool: (toolData: any) => void;
  onEditTool: (toolId: string, toolData: any) => void;
  onDeleteTool: (toolId: string) => void;
  searchQuery: string;
  selectedCategory: string;
  selectedTemplate: string;
  onCategoryChange: (category: string) => void;
  onTemplateChange: (template: string) => void;
}

function App({
  favorites,
  customTools,
  onToggleFavorite,
  onAddTool,
  onEditTool,
  onDeleteTool,
  searchQuery,
  selectedCategory,
  selectedTemplate,
  onTemplateChange,
}: AppProps) {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTool, setEditingTool] = useState<AITool | null>(null);
  const [deletingTool, setDeletingTool] = useState<AITool | null>(null);
  const [isRoleSelectorOpen, setIsRoleSelectorOpen] = useState(false);

  // Convert favorites array to Set for O(1) lookup performance
  const favoritesSet = useMemo(() => new Set(favorites), [favorites]);

  const handleEdit = useCallback((tool: AITool) => {
    setEditingTool(tool);
    setIsModalOpen(true);
  }, []);

  const handleDeleteClick = useCallback((tool: AITool) => {
    setDeletingTool(tool);
  }, []);

  const handleEditSave = (toolId: string, toolData: any) => {
    onEditTool(toolId, toolData);
    setEditingTool(null);
  };

  const handleDelete = (toolId: string) => {
    onDeleteTool(toolId);
    setDeletingTool(null);
  };

  // Extract available categories (excluding special categories)
  const availableCategories = useMemo(() => {
    return categories.filter((cat) => cat !== 'All');
  }, []);

  // Templates and icons for role selector (shared with TemplateSelector)
  const templates = useMemo(
    () => [
      { id: 'all', icon: 'grid', label: t('templates.all') },
      { id: 'designer', icon: 'palette', label: t('templates.designer') },
      { id: 'developer', icon: 'code', label: t('templates.developer') },
      {
        id: 'content-creator',
        icon: 'video',
        label: t('templates.contentCreator'),
      },
      { id: 'marketer', icon: 'megaphone', label: t('templates.marketer') },
      { id: 'trader', icon: 'chart', label: t('templates.trader') },
      {
        id: 'data-analyst',
        icon: 'chart-bar',
        label: t('templates.dataAnalyst'),
      },
      { id: '3d-artist', icon: 'cube', label: t('templates.3dArtist') },
      {
        id: 'video-editor',
        icon: 'film',
        label: t('templates.videoEditor'),
      },
      { id: 'student', icon: 'book', label: t('templates.student') },
      {
        id: 'media-enthusiast',
        icon: 'play',
        label: t('templates.mediaEnthusiast'),
      },
    ],
    [t]
  );

  const icons = {
    grid: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
      />
    ),
    palette: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
      />
    ),
    code: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
      />
    ),
    video: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
      />
    ),
    megaphone: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
      />
    ),
    chart: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
      />
    ),
    'chart-bar': (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
      />
    ),
    cube: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
      />
    ),
    film: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
      />
    ),
    book: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
      />
    ),
    play: (
      <>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </>
    ),
  };

  const selectedTemplateData = useMemo(
    () => templates.find((t) => t.id === selectedTemplate) || templates[0],
    [templates, selectedTemplate]
  );

  const filteredTools = useMemo(() => {
    // Combine default tools with custom tools
    const allTools = [...aiTools, ...customTools];

    return allTools.filter((tool) => {
      // Category filter
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
  }, [searchQuery, selectedCategory, customTools]);

  // Precompute template matches for all filtered tools for better performance
  const toolsWithTemplateMatch = useMemo(() => {
    return filteredTools.map((tool) => ({
      tool,
      matchesTemplate: toolMatchesTemplate(tool.category, selectedTemplate),
      isCustom: tool.id.startsWith('custom-'),
    }));
  }, [filteredTools, selectedTemplate]);

  return (
    <>
      {/* Tile Grid View */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 min-[480px]:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-8 gap-2 sm:gap-3 md:gap-3">
          {/* Add Tool Card - Only show in "All" category */}
          {selectedCategory === 'All' && (
            <AddToolCard onClick={() => setIsModalOpen(true)} />
          )}

          {/* Existing Tools */}
          {toolsWithTemplateMatch.map(({ tool, matchesTemplate, isCustom }) => {
            const showEditDelete = isCustom && selectedCategory === 'All';
            return (
              <AICard
                key={tool.id}
                tool={tool}
                isFavorite={favoritesSet.has(tool.id)}
                onToggleFavorite={onToggleFavorite}
                isCustom={isCustom}
                showEditDelete={showEditDelete}
                onEdit={showEditDelete ? () => handleEdit(tool) : undefined}
                onDelete={
                  showEditDelete ? () => handleDeleteClick(tool) : undefined
                }
                matchesTemplate={matchesTemplate}
              />
            );
          })}
        </div>
      </div>

      {/* Add/Edit Tool Modal */}
      <AddToolModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTool(null);
        }}
        onAdd={onAddTool}
        onEdit={handleEditSave}
        availableCategories={availableCategories}
        editingTool={editingTool}
        mode={editingTool ? 'edit' : 'add'}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!deletingTool}
        toolName={deletingTool?.name || ''}
        onConfirm={() => deletingTool && handleDelete(deletingTool.id)}
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
        onTemplateChange={onTemplateChange}
        icons={icons}
      />

      {/* Update Notification */}
      <UpdateChecker />
    </>
  );
}

export default App;
