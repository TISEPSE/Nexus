import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Collection } from '../types/collection';

type ViewType = 'all' | 'favorites' | 'custom';

interface CollectionSelectorProps {
  collections: Collection[];
  selectedCollectionId: string | null;
  selectedView: ViewType;
  onSelectCollection: (collectionId: string | null) => void;
  onSelectView: (view: ViewType) => void;
  onCreateCollection: (name: string) => string;
  onRenameCollection: (collectionId: string, newName: string) => void;
  onDeleteCollection: (collectionId: string) => void;
}

export function CollectionSelector({
  collections,
  selectedCollectionId,
  selectedView,
  onSelectCollection,
  onSelectView,
  onCreateCollection,
  onRenameCollection,
  onDeleteCollection
}: CollectionSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [menuPosition, setMenuPosition] = useState<{ top: number; left: number } | null>(null);
  const { t } = useTranslation();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Get selected collection or null
  const selectedCollection = collections.find(c => c.id === selectedCollectionId);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setIsCreating(false);
        setMenuOpenId(null);
        setEditingId(null);
        setEditingName('');
      }
    };

    if (isOpen || menuOpenId) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, menuOpenId]);

  // Close menu when collection changes
  useEffect(() => {
    setMenuOpenId(null);
    setEditingId(null);
    setEditingName('');
  }, [selectedCollectionId]);

  // Cancel editing when dropdown closes
  useEffect(() => {
    if (!isOpen) {
      setEditingId(null);
      setEditingName('');
    }
  }, [isOpen]);

  const handleCreateCollection = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCollectionName.trim()) {
      const newId = onCreateCollection(newCollectionName.trim());
      setNewCollectionName('');
      setIsCreating(false);
      setIsOpen(false);
      // Auto-select the newly created collection
      if (newId) {
        onSelectCollection(newId);
      }
    }
  };

  const handleSelectCollection = (collectionId: string | null) => {
    onSelectCollection(collectionId);
    setIsOpen(false);
  };

  const startEditing = (collection: Collection) => {
    setEditingId(collection.id);
    setEditingName(collection.name);
    setMenuOpenId(null);
  };

  const saveEdit = (collectionId: string) => {
    if (editingName.trim() && editingName !== collections.find(c => c.id === collectionId)?.name) {
      onRenameCollection(collectionId, editingName.trim());
    }
    setEditingId(null);
    setEditingName('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingName('');
  };

  const handleDelete = (collectionId: string) => {
    onDeleteCollection(collectionId);
    setDeletingId(null);
    setMenuOpenId(null);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Dropdown Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center gap-1.5 px-2 sm:px-3 py-2 min-h-[44px] min-w-[44px] bg-gh-canvas-subtle border border-gh-border-default rounded-md hover:bg-gh-canvas-inset hover:border-gh-accent-fg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gh-accent-fg focus:ring-offset-2 focus:ring-offset-gh-canvas-default"
        aria-label={t('collections.openSelector')}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        {/* Folder Icon */}
        <svg
          className="w-4 h-4 text-gh-fg-muted group-hover:text-gh-accent-fg transition-colors flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
          />
        </svg>

        {/* Label - Shows view or selected collection name */}
        <span className="hidden sm:inline text-sm font-medium text-gh-fg-default whitespace-nowrap">
          {selectedCollection ? selectedCollection.name :
           selectedView === 'all' ? 'Tout' :
           selectedView === 'favorites' ? 'Favoris' :
           'Personnalisé'}
        </span>

        {/* Count */}
        {selectedCollection && (
          <span className="hidden sm:inline text-xs text-gh-fg-muted">
            ({selectedCollection.toolIds.length})
          </span>
        )}

        {/* Dropdown Arrow */}
        <svg
          className={`w-3.5 h-3.5 text-gh-fg-muted transition-transform duration-200 ${
            isOpen ? 'rotate-180' : 'rotate-0'
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth={2.5}
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>

        {/* Hover Tooltip */}
        <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gh-canvas-default border border-gh-border-default rounded text-xs text-gh-fg-default whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg z-50">
          {t('collections.selectCollection')}
        </span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className="absolute top-full mt-2 left-0 w-72 max-h-[70vh] overflow-y-auto bg-gh-canvas-subtle border border-gh-border-default rounded-md shadow-lg z-50 animate-slide-in-fade scrollbar-thin scrollbar-track-gh-canvas-default scrollbar-thumb-gh-border-muted hover:scrollbar-thumb-gh-accent-muted"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: 'var(--color-border-muted) var(--color-canvas-default)'
          }}
          role="listbox"
        >
          {/* View Sections */}
          <div className="border-b border-gh-border-default">
            {/* Tout */}
            <button
              onClick={() => {
                onSelectView('all');
                onSelectCollection(null);
                setIsOpen(false);
              }}
              className={`w-full flex items-center gap-2 px-4 py-3 text-left transition-all duration-200 ${
                selectedView === 'all' && !selectedCollectionId
                  ? 'bg-gh-accent-subtle text-gh-accent-fg border-l-2 border-gh-accent-fg'
                  : 'text-gh-fg-default hover:bg-gh-accent-subtle/30'
              }`}
            >
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <span className="text-sm font-medium flex-1">Tout</span>
            </button>

            {/* Favoris */}
            <button
              onClick={() => {
                onSelectView('favorites');
                onSelectCollection(null);
                setIsOpen(false);
              }}
              className={`w-full flex items-center gap-2 px-4 py-3 text-left transition-all duration-200 ${
                selectedView === 'favorites' && !selectedCollectionId
                  ? 'bg-gh-accent-subtle text-gh-accent-fg border-l-2 border-gh-accent-fg'
                  : 'text-gh-fg-default hover:bg-gh-accent-subtle/30'
              }`}
            >
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
              <span className="text-sm font-medium flex-1">Favoris</span>
            </button>

            {/* Personnalisé */}
            <button
              onClick={() => {
                onSelectView('custom');
                onSelectCollection(null);
                setIsOpen(false);
              }}
              className={`w-full flex items-center gap-2 px-4 py-3 text-left transition-all duration-200 ${
                selectedView === 'custom' && !selectedCollectionId
                  ? 'bg-gh-accent-subtle text-gh-accent-fg border-l-2 border-gh-accent-fg'
                  : 'text-gh-fg-default hover:bg-gh-accent-subtle/30'
              }`}
            >
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              <span className="text-sm font-medium flex-1">Personnalisé</span>
            </button>
          </div>

          {/* Collections Header */}
          <div className="px-4 py-2 border-b border-gh-border-default bg-gh-canvas-default">
            <span className="text-xs font-semibold text-gh-fg-muted uppercase tracking-wide">
              Collections
            </span>
          </div>

          {/* Collections List */}
          {collections.length > 0 && (
            <div>
              {collections.map((collection) => (
                <div
                  key={collection.id}
                  data-collection-id={collection.id}
                  className={`w-full flex items-center gap-2 px-4 py-2 transition-all duration-200 ${
                    selectedCollectionId === collection.id
                      ? 'bg-gh-accent-subtle text-gh-accent-fg border-l-2 border-gh-accent-fg'
                      : 'text-gh-fg-default hover:bg-gh-accent-subtle/30'
                  }`}
                >
                  <svg
                    className={`w-4 h-4 flex-shrink-0 transition-all duration-200 ${
                      selectedCollectionId === collection.id ? 'text-gh-accent-fg' : 'text-gh-fg-muted'
                    }`}
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

                  {/* Editable name or clickable name */}
                  {editingId === collection.id ? (
                    <input
                      type="text"
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          saveEdit(collection.id);
                        }
                        if (e.key === 'Escape') {
                          cancelEdit();
                        }
                      }}
                      className="flex-1 px-2 py-1 bg-gh-canvas-default border border-gh-accent-emphasis rounded text-gh-fg-default text-sm focus:outline-none max-w-[158px]"
                      autoFocus
                      onClick={(e) => e.stopPropagation()}
                    />
                  ) : (
                    <button
                      onClick={() => handleSelectCollection(collection.id)}
                      className="flex-1 text-left text-sm font-medium truncate hover:text-gh-accent-fg"
                      title={collection.name}
                    >
                      {collection.name}
                    </button>
                  )}

                  <span className="text-xs text-gh-fg-muted mr-2">({collection.toolIds.length})</span>

                  {/* Three dots menu */}
                  <div className="relative ml-auto">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const button = e.currentTarget;
                        const rect = button.getBoundingClientRect();
                        const menuHeight = 80; // Approximate height of 2-item menu
                        const viewportHeight = window.innerHeight;
                        const spaceBelow = viewportHeight - rect.bottom;
                        const spaceAbove = rect.top;

                        // Decide if menu should appear above or below
                        const shouldFlipUp = spaceBelow < menuHeight && spaceAbove > spaceBelow;

                        setMenuPosition({
                          top: shouldFlipUp ? rect.top - menuHeight - 4 : rect.bottom + 4,
                          left: rect.right - 128 // 128px = w-32, right-align menu with button
                        });
                        setMenuOpenId(menuOpenId === collection.id ? null : collection.id);
                      }}
                      className="p-1.5 rounded hover:bg-gh-canvas-inset/70 transition-colors"
                      aria-label="Options"
                    >
                      <svg className="w-5 h-5 text-gh-fg-muted transition-colors" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}


          {/* Create New Collection - Inline Form */}
          {isCreating ? (
            <form onSubmit={handleCreateCollection} className="border-t border-gh-border-default p-3">
              <input
                type="text"
                value={newCollectionName}
                onChange={(e) => setNewCollectionName(e.target.value)}
                placeholder={t('collections.namePlaceholder')}
                className="w-full px-3 py-2 bg-gh-canvas-default border border-gh-border-default rounded text-gh-fg-default text-sm focus:outline-none focus:border-gh-accent-emphasis mb-2"
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 px-3 py-1.5 bg-gh-accent-emphasis text-white text-sm rounded hover:bg-gh-accent-fg transition-colors"
                  disabled={!newCollectionName.trim()}
                >
                  {t('collections.createButton')}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsCreating(false);
                    setNewCollectionName('');
                  }}
                  className="flex-1 px-3 py-1.5 bg-gh-canvas-subtle border border-gh-border-default text-gh-fg-default text-sm rounded hover:bg-gh-canvas-inset transition-colors"
                >
                  {t('addTool.cancel')}
                </button>
              </div>
            </form>
          ) : (
            <button
              onClick={() => setIsCreating(true)}
              className="w-full flex items-center gap-3 px-4 py-3 border-t border-gh-border-default text-gh-accent-fg hover:bg-gh-accent-subtle/50 font-medium transition-all duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              <span className="text-sm">{t('collections.createNew')}</span>
            </button>
          )}

        </div>
      )}

      {/* Context Menu - Rendered outside main dropdown */}
      {menuOpenId && menuPosition && (
        <div
          className="fixed w-32 bg-gh-canvas-default border border-gh-border-default rounded-md shadow-xl z-[9999] animate-menu-appear overflow-hidden"
          style={{
            top: `${menuPosition.top}px`,
            left: `${menuPosition.left}px`
          }}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              const collection = collections.find(c => c.id === menuOpenId);
              if (collection) {
                startEditing(collection);
              }
            }}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gh-fg-default hover:bg-gh-accent-emphasis/10 hover:text-gh-accent-fg transition-colors text-left"
          >
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            <span>Renommer</span>
          </button>
          <div className="h-px bg-gh-border-default"></div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setDeletingId(menuOpenId);
              setMenuOpenId(null);
            }}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-500/10 transition-colors text-left"
          >
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            <span>Supprimer</span>
          </button>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingId && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-[60]"
          onClick={(e) => {
            if (e.target === e.currentTarget) setDeletingId(null);
          }}
        >
          <div className="bg-gh-canvas-default border border-gh-border-default rounded-lg max-w-md w-full mx-4 shadow-2xl">
            <div className="p-6">
              <h3 className="text-lg font-bold text-gh-fg-default mb-4">{t('collections.delete')}</h3>

              <p className="text-gh-fg-default mb-4">{t('collections.deleteConfirm')}</p>

              {(() => {
                const collection = collections.find(c => c.id === deletingId);
                return collection && collection.toolIds.length > 0 && (
                  <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-md p-3 mb-4">
                    <div className="flex gap-2">
                      <svg className="w-5 h-5 text-yellow-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <div>
                        <p className="text-sm text-gh-fg-default font-medium mb-1">
                          {t('collections.deleteWarning', { count: collection.toolIds.length })}
                        </p>
                        <p className="text-sm text-gh-fg-muted">{t('collections.deleteNote')}</p>
                      </div>
                    </div>
                  </div>
                );
              })()}

              <div className="flex gap-3">
                <button
                  onClick={() => setDeletingId(null)}
                  className="flex-1 px-4 py-2 bg-gh-canvas-subtle border border-gh-border-default text-gh-fg-default rounded hover:bg-gh-canvas-inset transition-colors"
                >
                  {t('addTool.cancel')}
                </button>
                <button
                  onClick={() => handleDelete(deletingId)}
                  className="flex-1 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                >
                  {t('collections.deleteButton')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
