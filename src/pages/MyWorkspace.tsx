import { useState, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { AICard } from '../components/AICard';
import { AddToolCard } from '../components/AddToolCard';
import { AddToolModal } from '../components/AddToolModal';
import { DeleteConfirmModal } from '../components/DeleteConfirmModal';
import { AITool, aiTools } from '../data/aiData';
import { categories } from '../data/aiData';

interface MyWorkspaceProps {
  favorites: string[];
  customTools: AITool[];
  searchQuery: string;
  selectedCategory: string;
  selectedTemplate: string;
  onToggleFavorite: (toolId: string) => void;
  onAddTool: (toolData: any) => void;
  onEditTool: (toolId: string, toolData: any) => void;
  onDeleteTool: (toolId: string) => void;
}

type ViewType = 'all' | 'favorites' | 'custom';

export function MyWorkspace({
  favorites,
  customTools,
  searchQuery,
  selectedCategory,
  onToggleFavorite,
  onAddTool,
  onEditTool,
  onDeleteTool,
}: MyWorkspaceProps) {
  const { t } = useTranslation();
  const [view, setView] = useState<ViewType>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTool, setEditingTool] = useState<AITool | null>(null);
  const [deletingTool, setDeletingTool] = useState<AITool | null>(null);

  // Available categories
  const availableCategories = useMemo(() => {
    return categories.filter((cat) => cat !== 'All');
  }, []);

  // Get all tools (default + custom)
  const allTools = useMemo(() => {
    return [...aiTools, ...customTools];
  }, [customTools]);

  // Get all workspace tools (favorites + custom) with filters
  const workspaceTools = useMemo(() => {
    let tools: AITool[] = [];

    // Filter by view type
    if (view === 'all') {
      const favTools = allTools.filter((tool) => favorites.includes(tool.id));
      // Add custom tools that are not already in favorites to avoid duplicates
      const customToolsNotInFav = customTools.filter((tool) => !favorites.includes(tool.id));
      tools = [...favTools, ...customToolsNotInFav];
    } else if (view === 'favorites') {
      tools = allTools.filter((tool) => favorites.includes(tool.id));
    } else {
      tools = customTools;
    }

    // Apply search filter
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      tools = tools.filter((tool) =>
        tool.name.toLowerCase().includes(searchLower) ||
        tool.description.toLowerCase().includes(searchLower) ||
        tool.tags.some((tag) => tag.toLowerCase().includes(searchLower))
      );
    }

    // Apply category filter
    if (selectedCategory !== 'All') {
      tools = tools.filter((tool) => tool.category.includes(selectedCategory));
    }

    return tools;
  }, [allTools, favorites, customTools, view, searchQuery, selectedCategory]);

  // Convert favorites to Set for O(1) lookup
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

  return (
    <>
      {/* Quick Filter Tabs - Full width, aligned left */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
        <FilterTab
          active={view === 'all'}
          onClick={() => setView('all')}
          count={favorites.length + customTools.length}
        >
          {t('workspace.tabs.all')}
        </FilterTab>
        <FilterTab
          active={view === 'favorites'}
          onClick={() => setView('favorites')}
          count={favorites.length}
        >
          {t('workspace.tabs.favorites')}
        </FilterTab>
        <FilterTab
          active={view === 'custom'}
          onClick={() => setView('custom')}
          count={customTools.length}
        >
          {t('workspace.tabs.custom')}
        </FilterTab>
      </div>

      {/* Grid View - Aligned with filter tabs */}
      <div className="grid grid-cols-3 min-[480px]:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-2 sm:gap-3 md:gap-3">
        {/* Add Tool Card - Only show in custom view or all view */}
        {(view === 'all' || view === 'custom') && (
          <AddToolCard onClick={() => setIsModalOpen(true)} />
        )}

        {/* Tools Grid */}
        {workspaceTools.map((tool) => {
          const isCustom = tool.id.startsWith('custom-');
          const showEditDelete = isCustom && (view === 'all' || view === 'custom');

          return (
            <AICard
              key={tool.id}
              tool={tool}
              isFavorite={favoritesSet.has(tool.id)}
              onToggleFavorite={onToggleFavorite}
              isCustom={isCustom}
              showEditDelete={showEditDelete}
              onEdit={showEditDelete ? () => handleEdit(tool) : undefined}
              onDelete={showEditDelete ? () => handleDeleteClick(tool) : undefined}
              matchesTemplate={false}
            />
          );
        })}
      </div>

      {/* Empty State */}
      {workspaceTools.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gh-fg-muted">
            {t('empty.noToolsFound')}
          </p>
        </div>
      )}

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
        onConfirm={() => {
          if (deletingTool) {
            onDeleteTool(deletingTool.id);
            setDeletingTool(null);
          }
        }}
        onCancel={() => setDeletingTool(null)}
      />
    </>
  );
}

// Filter Tab Component
interface FilterTabProps {
  active: boolean;
  onClick: () => void;
  count: number;
  children: React.ReactNode;
}

function FilterTab({ active, onClick, count, children }: FilterTabProps) {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-2 px-4 py-2 rounded-md font-medium text-sm transition-colors whitespace-nowrap
        ${
          active
            ? 'bg-gh-accent-emphasis text-white'
            : 'bg-gh-canvas-subtle text-gh-fg-muted hover:bg-gh-canvas-inset hover:text-gh-fg-default'
        }
      `}
    >
      {children}
      <span
        className={`
        text-xs px-1.5 py-0.5 rounded-full
        ${active ? 'bg-white/20' : 'bg-gh-canvas-inset'}
      `}
      >
        {count}
      </span>
    </button>
  );
}
