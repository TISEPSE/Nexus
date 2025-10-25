import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Collection } from '../types/collection';

interface ManageCollectionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  collections: Collection[];
  onRenameCollection: (collectionId: string, newName: string) => void;
  onDeleteCollection: (collectionId: string) => void;
  onCreateCollection: (name: string) => void;
}

export function ManageCollectionsModal({
  isOpen,
  onClose,
  collections,
  onRenameCollection,
  onDeleteCollection,
  onCreateCollection
}: ManageCollectionsModalProps) {
  const { t } = useTranslation();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const startEditing = (collection: Collection) => {
    setEditingId(collection.id);
    setEditingName(collection.name);
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

  const confirmDelete = (collectionId: string) => {
    onDeleteCollection(collectionId);
    setDeletingId(null);
  };

  const deletingCollection = collections.find(c => c.id === deletingId);

  return (
    <div
      className="fixed inset-0 backdrop-blur-md bg-black/20 flex items-center justify-center z-50 p-4 overflow-hidden"
      onClick={handleBackdropClick}
    >
      <div className="bg-gh-canvas-default border border-gh-border-default rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gh-border-default bg-gh-canvas-subtle sticky top-0 z-10">
          <h2 className="text-xl font-bold text-gh-fg-default">{t('collections.manage')}</h2>
          <button
            onClick={onClose}
            className="text-gh-fg-muted hover:text-gh-fg-default transition-colors p-1"
            aria-label="Close modal"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {collections.length === 0 ? (
            <div className="text-center py-12">
              <svg
                className="w-16 h-16 mx-auto text-gh-fg-muted mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                />
              </svg>
              <p className="text-gh-fg-muted mb-6">{t('collections.noCollections')}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {collections.map((collection) => (
                <div
                  key={collection.id}
                  className="bg-gh-canvas-subtle border border-gh-border-default rounded-lg p-4 hover:border-gh-accent-muted transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <svg
                        className="w-5 h-5 text-gh-accent-fg flex-shrink-0"
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

                      {editingId === collection.id ? (
                        <div className="flex items-center gap-2 flex-1">
                          <input
                            type="text"
                            value={editingName}
                            onChange={(e) => setEditingName(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') saveEdit(collection.id);
                              if (e.key === 'Escape') cancelEdit();
                            }}
                            className="flex-1 px-2 py-1 bg-gh-canvas-default border border-gh-accent-emphasis rounded text-gh-fg-default text-sm focus:outline-none"
                            autoFocus
                          />
                          <button
                            onClick={() => saveEdit(collection.id)}
                            className="p-1.5 text-gh-accent-fg hover:bg-gh-accent-subtle rounded transition-colors"
                            aria-label="Save"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="p-1.5 text-gh-fg-muted hover:bg-gh-canvas-inset rounded transition-colors"
                            aria-label="Cancel"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ) : (
                        <>
                          <span className="font-medium text-gh-fg-default truncate" title={collection.name}>
                            {collection.name}
                          </span>
                          <span className="text-xs text-gh-fg-muted flex-shrink-0">
                            {t('collections.toolCount', { count: collection.toolIds.length })}
                          </span>
                        </>
                      )}
                    </div>

                    {editingId !== collection.id && (
                      <div className="flex items-center gap-2 ml-4">
                        <button
                          onClick={() => startEditing(collection)}
                          className="p-1.5 text-gh-accent-fg hover:bg-gh-accent-subtle rounded transition-colors"
                          aria-label={t('collections.rename')}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => setDeletingId(collection.id)}
                          className="p-1.5 text-red-500 hover:bg-red-500/10 rounded transition-colors"
                          aria-label={t('collections.delete')}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gh-border-default bg-gh-canvas-subtle flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gh-accent-emphasis text-white rounded hover:bg-gh-accent-fg transition-colors"
          >
            {t('addTool.cancel')}
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deletingId && deletingCollection && (
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

              {deletingCollection.toolIds.length > 0 && (
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-md p-3 mb-4">
                  <div className="flex gap-2">
                    <svg className="w-5 h-5 text-yellow-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <div>
                      <p className="text-sm text-gh-fg-default font-medium mb-1">
                        {t('collections.deleteWarning', { count: deletingCollection.toolIds.length })}
                      </p>
                      <p className="text-sm text-gh-fg-muted">{t('collections.deleteNote')}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setDeletingId(null)}
                  className="flex-1 px-4 py-2 bg-gh-canvas-subtle border border-gh-border-default text-gh-fg-default rounded hover:bg-gh-canvas-inset transition-colors"
                >
                  {t('addTool.cancel')}
                </button>
                <button
                  onClick={() => confirmDelete(deletingId)}
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
