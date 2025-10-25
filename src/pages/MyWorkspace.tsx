import { useState, useMemo, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { AICard } from '../components/AICard';
import { AddToolCard } from '../components/AddToolCard';
import { AddToolModal } from '../components/AddToolModal';
import { DeleteConfirmModal } from '../components/DeleteConfirmModal';
import { CollectionSelector } from '../components/CollectionSelector';
import { ManageCollectionsModal } from '../components/ManageCollectionsModal';
import { useCollections } from '../hooks/useCollections';
import { AITool, aiTools } from '../data/aiData';
import { categories } from '../data/aiData';

const WORKSPACE_STATE_KEY = 'nexus_workspace_state';

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

  // Load saved state from localStorage
  const [view, setView] = useState<ViewType>(() => {
    try {
      const saved = localStorage.getItem(WORKSPACE_STATE_KEY);
      if (saved) {
        const { view } = JSON.parse(saved);
        return view || 'all';
      }
    } catch (error) {
      console.error('Failed to load workspace state:', error);
    }
    return 'all';
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTool, setEditingTool] = useState<AITool | null>(null);
  const [deletingTool, setDeletingTool] = useState<AITool | null>(null);

  // Collections state
  const {
    collections,
    selectedCollectionId,
    setSelectedCollectionId,
    createCollection,
    renameCollection,
    deleteCollection,
    getCollection
  } = useCollections();

  const [isManageCollectionsOpen, setIsManageCollectionsOpen] = useState(false);

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

    // If a collection is selected, get tools from ALL available tools
    if (selectedCollectionId) {
      const collection = getCollection(selectedCollectionId);
      if (collection) {
        tools = allTools.filter(tool => collection.toolIds.includes(tool.id));
      }
    } else {
      // Filter by view type only when no collection is selected
      if (view === 'all') {
        const favTools = allTools.filter((tool) => favorites.includes(tool.id));
        const customToolsNotInFav = customTools.filter((tool) => !favorites.includes(tool.id));
        tools = [...favTools, ...customToolsNotInFav];
      } else if (view === 'favorites') {
        tools = allTools.filter((tool) => favorites.includes(tool.id));
      } else {
        tools = customTools;
      }
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
  }, [allTools, favorites, customTools, view, searchQuery, selectedCategory, selectedCollectionId, getCollection]);

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

  // Save workspace state to localStorage when view changes
  useEffect(() => {
    try {
      localStorage.setItem(WORKSPACE_STATE_KEY, JSON.stringify({ view }));
    } catch (error) {
      console.error('Failed to save workspace state:', error);
    }
  }, [view]);

  const handleSelectCollection = useCallback((collectionId: string | null) => {
    setSelectedCollectionId(collectionId);
  }, [setSelectedCollectionId]);

  return (
    <>
      {/* Collection Selector */}
      <div className="flex items-center gap-2 mb-4">
        <CollectionSelector
          collections={collections}
          selectedCollectionId={selectedCollectionId}
          selectedView={view}
          onSelectCollection={handleSelectCollection}
          onSelectView={setView}
          onCreateCollection={createCollection}
          onRenameCollection={renameCollection}
          onDeleteCollection={deleteCollection}
        />
      </div>

      {/* Grid View - Aligned with filter tabs */}
      <div className="grid grid-cols-3 min-[480px]:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-2 sm:gap-3 md:gap-3">
        {/* Add Tool Card - Only show in "all" view and not when a collection is selected */}
        {view === 'all' && !selectedCollectionId && (
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

      {/* Manage Collections Modal */}
      <ManageCollectionsModal
        isOpen={isManageCollectionsOpen}
        onClose={() => setIsManageCollectionsOpen(false)}
        collections={collections}
        onRenameCollection={renameCollection}
        onDeleteCollection={deleteCollection}
      />
    </>
  );
}

