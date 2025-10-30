/**
 * Configuration Export/Import System
 * Handles all user data backup and restore functionality
 */

import { AITool } from '../data/aiData';
import { Collection } from '../types/collection';

export interface NexusConfig {
  version: string;
  exportedAt: string;
  theme: 'dark' | 'light';
  language: string;
  favorites: string[];
  customTools: AITool[];
  collections: Collection[];
  workspaceState: {
    view: 'all' | 'favorites' | 'custom';
  };
  selectedCollectionId: string | null;
  settings: {
    autoUpdate?: boolean;
    compactMode?: boolean;
    fontSize?: 'small' | 'medium' | 'large';
    reducedMotion?: boolean;
  };
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

const CURRENT_VERSION = '1.0.0';
const STORAGE_KEYS = {
  favorites: 'favorites',
  customTools: 'customTools',
  collections: 'nexus_collections',
  workspaceState: 'nexus_workspace_state',
  selectedCollection: 'nexus_selected_collection',
  theme: 'theme',
  language: 'i18nextLng',
};

/**
 * Export all configuration data to a JSON object
 */
export function exportConfiguration(): NexusConfig {
  try {
    // Load theme
    const theme = localStorage.getItem(STORAGE_KEYS.theme) === 'light' ? 'light' : 'dark';

    // Load language
    const language = localStorage.getItem(STORAGE_KEYS.language) || 'en';

    // Load favorites
    const favoritesData = localStorage.getItem(STORAGE_KEYS.favorites);
    const favorites: string[] = favoritesData ? JSON.parse(favoritesData) : [];

    // Load custom tools
    const customToolsData = localStorage.getItem(STORAGE_KEYS.customTools);
    const customTools: AITool[] = customToolsData ? JSON.parse(customToolsData) : [];

    // Load collections
    const collectionsData = localStorage.getItem(STORAGE_KEYS.collections);
    const collectionsObj = collectionsData ? JSON.parse(collectionsData) : { collections: [] };
    const collections: Collection[] = collectionsObj.collections || [];

    // Load workspace state
    const workspaceStateData = localStorage.getItem(STORAGE_KEYS.workspaceState);
    const workspaceState = workspaceStateData
      ? JSON.parse(workspaceStateData)
      : { view: 'all' };

    // Load selected collection
    const selectedCollectionId = localStorage.getItem(STORAGE_KEYS.selectedCollection);

    const config: NexusConfig = {
      version: CURRENT_VERSION,
      exportedAt: new Date().toISOString(),
      theme,
      language,
      favorites,
      customTools,
      collections,
      workspaceState,
      selectedCollectionId,
      settings: {
        autoUpdate: true,
        compactMode: false,
        fontSize: 'medium',
        reducedMotion: false,
      },
    };

    return config;
  } catch (error) {
    console.error('Failed to export configuration:', error);
    throw new Error('Failed to export configuration. Please try again.');
  }
}

/**
 * Download configuration as JSON file
 */
export function downloadConfiguration(): void {
  try {
    const config = exportConfiguration();
    const blob = new Blob([JSON.stringify(config, null, 2)], {
      type: 'application/json'
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const date = new Date().toISOString().split('T')[0];
    link.href = url;
    link.download = `nexus-config-${date}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Failed to download configuration:', error);
    throw error;
  }
}

/**
 * Validate imported configuration structure
 */
export function validateConfiguration(data: unknown): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check if data exists
  if (!data || typeof data !== 'object') {
    errors.push('Invalid configuration file: not a valid JSON object');
    return { valid: false, errors, warnings };
  }

  const config = data as Partial<NexusConfig>;

  // Check version
  if (!config.version) {
    errors.push('Missing version field');
  } else if (config.version !== CURRENT_VERSION) {
    warnings.push(`Configuration version (${config.version}) differs from current version (${CURRENT_VERSION})`);
  }

  // Check required fields
  if (!config.exportedAt) {
    errors.push('Missing exportedAt timestamp');
  }

  if (!config.theme || !['dark', 'light'].includes(config.theme)) {
    errors.push('Invalid or missing theme value');
  }

  if (config.favorites && !Array.isArray(config.favorites)) {
    errors.push('Favorites must be an array');
  }

  if (config.customTools && !Array.isArray(config.customTools)) {
    errors.push('Custom tools must be an array');
  }

  if (config.collections && !Array.isArray(config.collections)) {
    errors.push('Collections must be an array');
  }

  // Validate custom tools structure
  if (config.customTools && Array.isArray(config.customTools)) {
    config.customTools.forEach((tool, index) => {
      if (!tool.id || !tool.name || !tool.url) {
        warnings.push(`Custom tool at index ${index} is missing required fields`);
      }
    });
  }

  // Validate collections structure
  if (config.collections && Array.isArray(config.collections)) {
    config.collections.forEach((collection, index) => {
      if (!collection.id || !collection.name) {
        warnings.push(`Collection at index ${index} is missing required fields`);
      }
    });
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Import configuration with mode selection
 */
export async function importConfiguration(
  config: NexusConfig,
  mode: 'merge' | 'replace'
): Promise<void> {
  try {
    // Validate before import
    const validation = validateConfiguration(config);
    if (!validation.valid) {
      throw new Error(`Invalid configuration: ${validation.errors.join(', ')}`);
    }

    if (mode === 'replace') {
      // Clear existing data
      localStorage.clear();
    }

    // Import theme
    localStorage.setItem(STORAGE_KEYS.theme, config.theme);

    // Import language
    if (config.language) {
      localStorage.setItem(STORAGE_KEYS.language, config.language);
    }

    // Import favorites
    if (config.favorites) {
      if (mode === 'merge') {
        const existing = localStorage.getItem(STORAGE_KEYS.favorites);
        const existingFavorites: string[] = existing ? JSON.parse(existing) : [];
        const merged = [...new Set([...existingFavorites, ...config.favorites])];
        localStorage.setItem(STORAGE_KEYS.favorites, JSON.stringify(merged));
      } else {
        localStorage.setItem(STORAGE_KEYS.favorites, JSON.stringify(config.favorites));
      }
    }

    // Import custom tools
    if (config.customTools) {
      if (mode === 'merge') {
        const existing = localStorage.getItem(STORAGE_KEYS.customTools);
        const existingTools: AITool[] = existing ? JSON.parse(existing) : [];
        const merged = [...existingTools];

        // Add new tools, skip duplicates by URL
        config.customTools.forEach(newTool => {
          if (!merged.some(t => t.url === newTool.url)) {
            merged.push(newTool);
          }
        });

        localStorage.setItem(STORAGE_KEYS.customTools, JSON.stringify(merged));
      } else {
        localStorage.setItem(STORAGE_KEYS.customTools, JSON.stringify(config.customTools));
      }
    }

    // Import collections
    if (config.collections) {
      const collectionsData = {
        version: 1,
        collections: config.collections,
      };

      if (mode === 'merge') {
        const existing = localStorage.getItem(STORAGE_KEYS.collections);
        if (existing) {
          const existingData = JSON.parse(existing);
          const existingCollections: Collection[] = existingData.collections || [];
          const merged = [...existingCollections];

          // Add new collections, skip duplicates by name
          config.collections.forEach(newColl => {
            if (!merged.some(c => c.name === newColl.name)) {
              merged.push(newColl);
            }
          });

          collectionsData.collections = merged;
        }
      }

      localStorage.setItem(STORAGE_KEYS.collections, JSON.stringify(collectionsData));
    }

    // Import workspace state
    if (config.workspaceState) {
      localStorage.setItem(
        STORAGE_KEYS.workspaceState,
        JSON.stringify(config.workspaceState)
      );
    }

    // Import selected collection
    if (config.selectedCollectionId) {
      localStorage.setItem(
        STORAGE_KEYS.selectedCollection,
        config.selectedCollectionId
      );
    }

  } catch (error) {
    console.error('Failed to import configuration:', error);
    throw error;
  }
}

/**
 * Get statistics about current configuration
 */
export function getConfigStats(): {
  favorites: number;
  customTools: number;
  collections: number;
  totalTools: number;
} {
  try {
    const favoritesData = localStorage.getItem(STORAGE_KEYS.favorites);
    const favorites = favoritesData ? JSON.parse(favoritesData) : [];

    const customToolsData = localStorage.getItem(STORAGE_KEYS.customTools);
    const customTools = customToolsData ? JSON.parse(customToolsData) : [];

    const collectionsData = localStorage.getItem(STORAGE_KEYS.collections);
    const collectionsObj = collectionsData ? JSON.parse(collectionsData) : { collections: [] };
    const collections = collectionsObj.collections || [];

    return {
      favorites: favorites.length,
      customTools: customTools.length,
      collections: collections.length,
      totalTools: favorites.length + customTools.length,
    };
  } catch (error) {
    console.error('Failed to get config stats:', error);
    return { favorites: 0, customTools: 0, collections: 0, totalTools: 0 };
  }
}

/**
 * Clear all application data (nuclear option)
 */
export function clearAllData(): void {
  const confirmMessage =
    'This will permanently delete all your data including favorites, custom tools, and collections. This action cannot be undone. Are you absolutely sure?';

  if (!confirm(confirmMessage)) {
    return;
  }

  const doubleConfirm =
    'Last chance! Type "DELETE" to confirm you want to erase all data.';
  const userInput = prompt(doubleConfirm);

  if (userInput === 'DELETE') {
    localStorage.clear();
    window.location.reload();
  }
}

/**
 * Reset to default settings (preserves data)
 */
export function resetToDefaults(): void {
  localStorage.setItem(STORAGE_KEYS.theme, 'dark');
  localStorage.setItem(STORAGE_KEYS.language, 'en');
  localStorage.setItem(STORAGE_KEYS.workspaceState, JSON.stringify({ view: 'all' }));
  localStorage.removeItem(STORAGE_KEYS.selectedCollection);
}
