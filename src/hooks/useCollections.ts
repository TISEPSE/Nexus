import { useState, useEffect, useCallback } from 'react';
import { Collection, StoredCollections } from '../types/collection';

const STORAGE_KEY = 'nexus_collections';
const SELECTED_COLLECTION_KEY = 'nexus_selected_collection';

export function useCollections() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [selectedCollectionId, setSelectedCollectionId] = useState<string | null>(() => {
    try {
      return localStorage.getItem(SELECTED_COLLECTION_KEY);
    } catch {
      return null;
    }
  });

  // Save selectedCollectionId to localStorage when it changes
  useEffect(() => {
    if (selectedCollectionId) {
      localStorage.setItem(SELECTED_COLLECTION_KEY, selectedCollectionId);
    } else {
      localStorage.removeItem(SELECTED_COLLECTION_KEY);
    }
  }, [selectedCollectionId]);

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

  // Save collections to localStorage
  const saveCollections = useCallback((updater: Collection[] | ((prev: Collection[]) => Collection[])) => {
    setCollections(prev => {
      const newCollections = typeof updater === 'function' ? updater(prev) : updater;
      const data: StoredCollections = {
        version: 1,
        collections: newCollections
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      return newCollections;
    });
  }, []);

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

  // Get collection by ID
  const getCollection = useCallback((collectionId: string | null): Collection | null => {
    if (!collectionId) return null;
    return collections.find(c => c.id === collectionId) || null;
  }, [collections]);

  return {
    collections,
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
