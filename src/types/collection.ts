export interface Collection {
  id: string;                    // UUID: "collection-uuid-1234"
  name: string;                  // "Work Tools"
  description?: string;          // Optional description
  toolIds: string[];             // Array of tool IDs
  icon?: string;                 // Future: custom icon emoji
  color?: string;                // Future: custom accent color
  createdAt: number;             // Timestamp
  updatedAt: number;             // Timestamp
  order: number;                 // For custom sorting
  isSystemCollection?: boolean;  // True for system-managed collections (non-deletable)
  systemType?: 'favorites';      // Type of system collection
}

export interface CollectionState {
  collections: Collection[];
  selectedCollectionId: string | null;
}

export interface StoredCollections {
  version: number;               // Schema version for migrations
  collections: Collection[];
}
