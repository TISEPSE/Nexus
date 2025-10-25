import React, { useState, useEffect } from 'react';
import { AITool } from '../data/aiData';
import { Collection } from '../types/collection';

interface AddToCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  tool: AITool | null;
  collections: Collection[];
  onAddToCollection: (collectionId: string, toolId: string) => void;
  onRemoveFromCollection: (collectionId: string, toolId: string) => void;
  onCreateCollection: (name: string) => string;
  onSelectCollection?: (collectionId: string) => void;
}

export function AddToCollectionModal({
  isOpen,
  onClose,
  tool,
  collections,
  onAddToCollection,
  onRemoveFromCollection,
  onCreateCollection,
  onSelectCollection
}: AddToCollectionModalProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [justAddedToId, setJustAddedToId] = useState<string | null>(null);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setIsCreating(false);
      setNewCollectionName('');
      setJustAddedToId(null);
    }
  }, [isOpen]);

  // Close on ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen || !tool) return null;

  const handleAddToCollection = (collectionId: string) => {
    onAddToCollection(collectionId, tool.id);
    setJustAddedToId(collectionId);
    setTimeout(() => setJustAddedToId(null), 2000);
  };

  const handleCreateNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCollectionName.trim()) {
      const newId = onCreateCollection(newCollectionName.trim());
      setNewCollectionName('');
      setIsCreating(false);
      if (newId) {
        handleAddToCollection(newId);
        // Auto-select the newly created collection if callback is provided
        onSelectCollection?.(newId);
      }
    }
  };

  return (
    <div
      className="fixed top-0 left-0 right-0 bottom-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-[99999] animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="collection-modal-title"
    >
      <div
        className="bg-gh-canvas-default border border-gh-border-default rounded-xl max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl animate-modal-enter"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-5 border-b border-gh-border-default bg-gh-canvas-subtle/30">
          <div className="flex-1">
            <h2 id="collection-modal-title" className="text-xl font-semibold text-gh-fg-default mb-1">
              Ajouter à une collection
            </h2>
            <p className="text-sm text-gh-fg-muted flex items-center gap-2">
              <span className="font-medium text-gh-accent-fg">{tool.name}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gh-fg-muted hover:text-gh-fg-default hover:bg-gh-canvas-inset transition-all p-2 rounded-md ml-4 flex-shrink-0"
            aria-label="Fermer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Collections Grid */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)] scrollbar-thin scrollbar-track-gh-canvas-default scrollbar-thumb-gh-border-muted hover:scrollbar-thumb-gh-accent-muted">
          {collections.length > 0 && (
            <div className="mb-5">
              <h3 className="text-xs font-semibold text-gh-fg-muted uppercase tracking-wider mb-3 px-1">
                Vos Collections
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {collections.map((collection) => {
                  const isInCollection = collection.toolIds.includes(tool.id);
                  const wasJustAdded = justAddedToId === collection.id;

                  return (
                    <button
                      key={collection.id}
                      onClick={() => {
                        if (isInCollection) {
                          onRemoveFromCollection(collection.id, tool.id);
                        } else {
                          handleAddToCollection(collection.id);
                        }
                      }}
                      className={`group relative flex flex-col items-start p-4 rounded-lg border transition-all duration-200 min-h-[110px] text-left ${
                        isInCollection
                          ? 'bg-gh-accent-subtle/40 border-gh-accent-emphasis shadow-sm hover:bg-gh-accent-subtle/60 hover:shadow-md hover:scale-105'
                          : 'bg-gh-canvas-subtle border-gh-border-default hover:border-gh-accent-fg hover:shadow-md hover:scale-105'
                      } ${wasJustAdded ? 'animate-success-pulse' : ''}`}
                    >
                      {/* Collection Header */}
                      <div className="flex items-start gap-2.5 mb-3 w-full">
                        <div className={`p-2 rounded-md transition-colors ${
                          isInCollection ? 'bg-gh-accent-emphasis/20' : 'bg-gh-canvas-default group-hover:bg-gh-accent-subtle/30'
                        }`}>
                          <svg
                            className={`w-4 h-4 ${isInCollection ? 'text-gh-accent-fg' : 'text-gh-fg-muted group-hover:text-gh-accent-fg'}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                            />
                          </svg>
                        </div>

                        {/* Checkmark if added */}
                        {isInCollection && (
                          <div className={`ml-auto p-1 rounded-full bg-green-500/10 ${wasJustAdded ? 'animate-checkmark-appear' : ''}`}>
                            <svg
                              className="w-4 h-4 text-green-500"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              strokeWidth={3}
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        )}
                      </div>

                      {/* Collection Name */}
                      <h4 className={`font-semibold text-sm mb-1.5 line-clamp-2 ${
                        isInCollection ? 'text-gh-accent-fg' : 'text-gh-fg-default'
                      }`}>
                        {collection.name}
                      </h4>

                      {/* Tool Count */}
                      <div className="flex items-center gap-1.5 mt-auto">
                        <svg className="w-3 h-3 text-gh-fg-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                        <span className="text-xs text-gh-fg-muted font-medium">
                          {collection.toolIds.length} {collection.toolIds.length === 1 ? 'outil' : 'outils'}
                        </span>
                      </div>

                      {/* Hover state indicator */}
                      {!isInCollection && (
                        <div className="absolute inset-0 rounded-lg bg-gh-accent-emphasis/0 group-hover:bg-gh-accent-emphasis/5 transition-colors pointer-events-none" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Create New Collection */}
          <div className={collections.length > 0 ? 'border-t border-gh-border-default pt-5' : ''}>
            {collections.length > 0 && (
              <h3 className="text-xs font-semibold text-gh-fg-muted uppercase tracking-wider mb-3 px-1">
                Nouvelle Collection
              </h3>
            )}
            {isCreating ? (
              <form onSubmit={handleCreateNew} className="border-2 border-dashed border-gh-accent-emphasis/50 bg-gh-accent-subtle/10 rounded-lg p-5">
                <label className="block mb-2">
                  <span className="text-xs font-medium text-gh-fg-muted uppercase tracking-wide">Nom de la collection</span>
                  <input
                    type="text"
                    value={newCollectionName}
                    onChange={(e) => setNewCollectionName(e.target.value)}
                    placeholder="Ex: Mes outils préférés..."
                    className="mt-1.5 w-full px-3 py-2.5 bg-gh-canvas-default border border-gh-border-default rounded-md text-gh-fg-default text-sm placeholder:text-gh-fg-muted/50 focus:outline-none focus:border-gh-accent-emphasis focus:ring-2 focus:ring-gh-accent-emphasis/20 transition-all"
                    autoFocus
                  />
                </label>
                <div className="flex gap-2 mt-4">
                  <button
                    type="submit"
                    disabled={!newCollectionName.trim()}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gh-accent-emphasis text-white text-sm font-medium rounded-md hover:bg-gh-accent-fg active:bg-gh-accent-emphasis transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gh-accent-emphasis"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    Créer et ajouter
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsCreating(false);
                      setNewCollectionName('');
                    }}
                    className="px-4 py-2.5 bg-gh-canvas-subtle border border-gh-border-default text-gh-fg-default text-sm font-medium rounded-md hover:bg-gh-canvas-inset active:bg-gh-canvas-subtle transition-all"
                  >
                    Annuler
                  </button>
                </div>
              </form>
            ) : (
              <button
                onClick={() => setIsCreating(true)}
                className="group w-full flex items-center justify-center gap-3 p-5 border-2 border-dashed border-gh-border-muted rounded-lg text-gh-accent-fg hover:border-gh-accent-fg hover:bg-gh-accent-subtle/20 transition-all duration-200 hover:shadow-sm"
              >
                <div className="p-2 rounded-md bg-gh-accent-subtle/30 group-hover:bg-gh-accent-subtle/50 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <span className="text-sm font-semibold">Créer une nouvelle collection</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
