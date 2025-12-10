import { useState, useMemo, useCallback } from 'react';
import { AICard } from './components/AICard';
import { AddToolCard } from './components/AddToolCard';
import { AddToolModal } from './components/AddToolModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { UpdateChecker } from './components/UpdateChecker';
import { AddToCollectionModal } from './components/AddToCollectionModal';
import { useCollections } from './hooks/useCollections';
import { aiTools, categories, AITool } from './data/aiData';
import { toolMatchesTemplate } from './data/templateMappings';
import { ToolFormData } from './types/tool';

interface AppProps {
  favorites: string[];
  customTools: AITool[];
  onAddTool: (toolData: ToolFormData) => void;
  onEditTool: (toolId: string, toolData: ToolFormData) => void;
  onDeleteTool: (toolId: string) => void;
  searchQuery: string;
  selectedCategory: string;
  selectedTemplate: string;
}

function App({
  favorites: _favorites,
  customTools,
  onAddTool,
  onEditTool,
  onDeleteTool,
  searchQuery,
  selectedCategory,
  selectedTemplate,
}: AppProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTool, setEditingTool] = useState<AITool | null>(null);
  const [deletingTool, setDeletingTool] = useState<AITool | null>(null);
  const [collectionModalTool, setCollectionModalTool] = useState<AITool | null>(null);

  const { collections, addToolsToCollection, removeToolsFromCollection, createCollection, setSelectedCollectionId } = useCollections();

  const handleEdit = useCallback((tool: AITool) => {
    setEditingTool(tool);
    setIsModalOpen(true);
  }, []);

  const handleDeleteClick = useCallback((tool: AITool) => {
    setDeletingTool(tool);
  }, []);

  const handleEditSave = (toolId: string, toolData: ToolFormData) => {
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
      <div id="dashboard-content" className="grid grid-cols-3 min-[480px]:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-2 sm:gap-3 md:gap-3">
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
                isCustom={isCustom}
                showEditDelete={showEditDelete}
                onEdit={showEditDelete ? () => handleEdit(tool) : undefined}
                onDelete={
                  showEditDelete ? () => handleDeleteClick(tool) : undefined
                }
                matchesTemplate={matchesTemplate}
                collections={collections}
                onOpenCollectionModal={(tool) => setCollectionModalTool(tool)}
              />
            );
          })}
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

      {/* Update Notification */}
      <UpdateChecker />

      {/* Add to Collection Modal */}
      <AddToCollectionModal
        isOpen={!!collectionModalTool}
        onClose={() => setCollectionModalTool(null)}
        tool={collectionModalTool}
        collections={collections}
        onAddToCollection={(collectionId, toolId) => addToolsToCollection(collectionId, [toolId])}
        onRemoveFromCollection={(collectionId, toolId) => removeToolsFromCollection(collectionId, [toolId])}
        onCreateCollection={createCollection}
        onSelectCollection={setSelectedCollectionId}
      />
    </>
  );
}

export default App;
