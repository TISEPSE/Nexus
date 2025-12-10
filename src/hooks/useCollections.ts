import { useState, useEffect, useCallback, useMemo } from 'react';
import { Collection, StoredCollections } from '../types/collection';
import { useDebounce } from './useDebounce';

const STORAGE_KEY = 'nexus_collections';
const SELECTED_COLLECTION_KEY = 'nexus_selected_collection';
const FAVORITES_KEY = 'nexus_favorites';
const DEBOUNCE_DELAY = 500; // 500ms delay for localStorage writes

export function useCollections() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [favoritesArray, setFavoritesArray] = useState<string[]>([]);
  const [selectedCollectionId, setSelectedCollectionId] = useState<string | null>(() => {
    try {
      return localStorage.getItem(SELECTED_COLLECTION_KEY);
    } catch (error) {
      console.error('Failed to load selected collection:', error);
      return null;
    }
  });

  // Debounced localStorage write for selected collection
  const debouncedSaveSelectedCollection = useDebounce((collectionId: string | null) => {
    try {
      if (collectionId) {
        localStorage.setItem(SELECTED_COLLECTION_KEY, collectionId);
      } else {
        localStorage.removeItem(SELECTED_COLLECTION_KEY);
      }
    } catch (error) {
      console.error('Failed to save selected collection:', error);
    }
  }, DEBOUNCE_DELAY);

  // Save selectedCollectionId to localStorage when it changes (debounced)
  useEffect(() => {
    debouncedSaveSelectedCollection(selectedCollectionId);
  }, [selectedCollectionId, debouncedSaveSelectedCollection]);

  // Load collections from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const data: StoredCollections = JSON.parse(stored);
        setCollections(data.collections || []);
      } catch (error) {
        console.error('Failed to load collections:', error);
      }
    }
  }, []);

  // Load favorites from localStorage and sync with state
  useEffect(() => {
    const loadFavorites = () => {
      try {
        const stored = localStorage.getItem(FAVORITES_KEY);
        if (stored) {
          const favorites = JSON.parse(stored);
          setFavoritesArray(Array.isArray(favorites) ? favorites : []);
        } else {
          setFavoritesArray([]);
        }
      } catch (error) {
        console.error('Failed to load favorites:', error);
        setFavoritesArray([]);
      }
    };

    // Initial load
    loadFavorites();

    // Listen for changes to favorites in localStorage (from other components)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === FAVORITES_KEY) {
        loadFavorites();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Debounced localStorage write for collections
  const debouncedSaveCollections = useDebounce((collections: Collection[]) => {
    try {
      const data: StoredCollections = {
        version: 1,
        collections
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save collections:', error);
    }
  }, DEBOUNCE_DELAY);

  // Save collections to localStorage (debounced)
  const saveCollections = useCallback((updater: Collection[] | ((prev: Collection[]) => Collection[])) => {
    setCollections(prev => {
      const newCollections = typeof updater === 'function' ? updater(prev) : updater;
      debouncedSaveCollections(newCollections);
      return newCollections;
    });
  }, [debouncedSaveCollections]);

  // Create collection
  const createCollection = useCallback((name: string, description?: string) => {
    let newId = '';
    saveCollections(prev => {
      const newCollection: Collection = {
        id: `collection-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name,
        description,
        toolIds: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
        order: prev.length
      };
      newId = newCollection.id;
      return [...prev, newCollection];
    });
    return newId;
  }, [saveCollections]);

  // Rename collection
  const renameCollection = useCallback((collectionId: string, newName: string) => {
    saveCollections(prev => prev.map(c =>
      c.id === collectionId
        ? { ...c, name: newName, updatedAt: Date.now() }
        : c
    ));
  }, [saveCollections]);

  // Delete collection
  const deleteCollection = useCallback((collectionId: string) => {
    saveCollections(prev => prev.filter(c => c.id !== collectionId));
    if (selectedCollectionId === collectionId) {
      setSelectedCollectionId(null);
    }
  }, [selectedCollectionId, saveCollections]);

  // Add tools to collection
  const addToolsToCollection = useCallback((collectionId: string, toolIds: string[]) => {
    saveCollections(prev => prev.map(c =>
      c.id === collectionId
        ? {
            ...c,
            toolIds: [...new Set([...c.toolIds, ...toolIds])],
            updatedAt: Date.now()
          }
        : c
    ));
  }, [saveCollections]);

  // Remove tools from collection
  const removeToolsFromCollection = useCallback((collectionId: string, toolIds: string[]) => {
    saveCollections(prev => prev.map(c =>
      c.id === collectionId
        ? {
            ...c,
            toolIds: c.toolIds.filter(id => !toolIds.includes(id)),
            updatedAt: Date.now()
          }
        : c
    ));
  }, [saveCollections]);

  // Create system Favorites collection from favorites array
  const favoritesSystemCollection: Collection = useMemo(() => ({
    id: 'system-favorites',
    name: 'system.favorites', // Translation key for i18n
    description: 'System favorites collection',
    toolIds: favoritesArray,
    createdAt: 0,
    updatedAt: Date.now(),
    order: -1, // Always first
    isSystemCollection: true,
    systemType: 'favorites' as const
  }), [favoritesArray]);

  // Merge system collection with user collections
  const allCollections = useMemo(() => {
    // Always include favorites collection (even if empty)
    return [favoritesSystemCollection, ...collections];
  }, [favoritesSystemCollection, collections]);

  // Get collection by ID (includes system collections)
  const getCollection = useCallback((collectionId: string | null): Collection | null => {
    if (!collectionId) return null;
    if (collectionId === 'system-favorites') {
      return favoritesSystemCollection;
    }
    return collections.find(c => c.id === collectionId) || null;
  }, [collections, favoritesSystemCollection]);

  return {
    collections: allCollections,
    selectedCollectionId,
    setSelectedCollectionId,
    createCollection,
    renameCollection,
    deleteCollection,
    addToolsToCollection,
    removeToolsFromCollection,
    getCollection
  };
}
