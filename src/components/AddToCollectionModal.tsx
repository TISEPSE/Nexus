import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
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
}

export function AddToCollectionModal({
  isOpen,
  onClose,
  tool,
  collections,
  onAddToCollection,
  onRemoveFromCollection,
  onCreateCollection
}: AddToCollectionModalProps) {
  const { t } = useTranslation();
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
      }
    }
  };

  return (
    <div
      className="fixed top-0 left-0 right-0 bottom-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
      style={{ zIndex: 99999 }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="collection-modal-title"
    >
      <div
        className="bg-gh-canvas-default border border-gh-border-default rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl animate-modal-enter"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gh-border-default">
          <h2 id="collection-modal-title" className="text-lg font-semibold text-gh-fg-default">
            Ajouter "{tool.name}" à une collection
          </h2>
          <button
            onClick={onClose}
            className="text-gh-fg-muted hover:text-gh-fg-default transition-colors p-1 rounded hover:bg-gh-canvas-subtle"
            aria-label="Fermer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Collections Grid */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {collections.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
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
                    className={`relative flex flex-col items-start p-4 rounded-lg border-2 transition-all duration-200 min-h-[100px] ${
                      isInCollection
                        ? 'bg-gh-accent-subtle/50 border-gh-accent-emphasis hover:bg-gh-accent-subtle/70 hover:scale-105 active:scale-100'
                        : 'bg-gh-canvas-subtle border-gh-border-default hover:border-gh-accent-fg hover:scale-105 active:scale-100'
                    } ${wasJustAdded ? 'animate-success-pulse' : ''}`}
                  >
                    {/* Collection Icon */}
                    <div className="flex items-center gap-2 mb-2 w-full">
                      <svg
                        className={`w-5 h-5 ${isInCollection ? 'text-gh-accent-fg' : 'text-gh-fg-muted'}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                        />
                      </svg>

                      {/* Checkmark if added */}
                      {isInCollection && (
                        <svg
                          className={`ml-auto w-5 h-5 text-green-500 ${wasJustAdded ? 'animate-checkmark-appear' : ''}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          strokeWidth={3}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>

                    {/* Collection Name */}
                    <span className={`font-medium text-sm mb-1 ${isInCollection ? 'text-gh-accent-fg' : 'text-gh-fg-default'}`}>
                      {collection.name}
                    </span>

                    {/* Tool Count */}
                    <span className="text-xs text-gh-fg-muted mt-auto">
                      {collection.toolIds.length} {collection.toolIds.length === 1 ? 'outil' : 'outils'}
                    </span>
                  </button>
                );
              })}
            </div>
          ) : (
            <p className="text-center text-gh-fg-muted mb-4">Aucune collection</p>
          )}

          {/* Create New Collection */}
          {isCreating ? (
            <form onSubmit={handleCreateNew} className="border-2 border-dashed border-gh-border-muted rounded-lg p-4">
              <input
                type="text"
                value={newCollectionName}
                onChange={(e) => setNewCollectionName(e.target.value)}
                placeholder="Nom de la collection"
                className="w-full px-3 py-2 bg-gh-canvas-default border border-gh-border-default rounded text-gh-fg-default text-sm focus:outline-none focus:border-gh-accent-emphasis mb-3"
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={!newCollectionName.trim()}
                  className="flex-1 px-4 py-2 bg-gh-accent-emphasis text-white text-sm rounded hover:bg-gh-accent-fg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Créer
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsCreating(false);
                    setNewCollectionName('');
                  }}
                  className="flex-1 px-4 py-2 bg-gh-canvas-subtle border border-gh-border-default text-gh-fg-default text-sm rounded hover:bg-gh-canvas-inset transition-colors"
                >
                  Annuler
                </button>
              </div>
            </form>
          ) : (
            <button
              onClick={() => setIsCreating(true)}
              className="w-full flex items-center justify-center gap-2 p-4 border-2 border-dashed border-gh-border-muted rounded-lg text-gh-accent-fg hover:border-gh-accent-fg hover:bg-gh-accent-subtle/20 transition-all duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              <span className="text-sm font-medium">Créer une nouvelle collection</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
