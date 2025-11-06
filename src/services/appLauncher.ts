import { invoke } from '@tauri-apps/api/core';
import { open } from '@tauri-apps/plugin-shell';
import { aiTools } from '../data/aiData';
import { logger } from '../utils/logger';

/**
 * App Launch Service
 *
 * Handles launching applications natively when available,
 * with automatic fallback to web URLs
 */

// Cache for found applications to avoid repeated searches
const appCache = new Map<string, string | null>();

/**
 * Get executable names for a tool on the current platform
 */
function getExecutablesForTool(toolId: string): string[] {
  // Find the tool in aiData
  const tool = aiTools.find(t => t.id === toolId);
  if (!tool || !tool.executables) {
    return [];
  }

  // Detect platform
  const platform = window.navigator.platform.toLowerCase();

  if (platform.includes('win')) {
    return tool.executables.windows || [];
  } else if (platform.includes('mac')) {
    return tool.executables.macos || [];
  } else {
    return tool.executables.linux || [];
  }
}

/**
 * Find native application on the system
 *
 * @param toolId - The tool ID from aiData
 * @returns The path to the application if found, null otherwise
 */
export async function findNativeApp(toolId: string): Promise<string | null> {
  // Check cache first
  if (appCache.has(toolId)) {
    return appCache.get(toolId) || null;
  }

  try {
    // Get executable names for this tool
    const executables = getExecutablesForTool(toolId);

    if (executables.length === 0) {
      // No native app mapping for this tool
      appCache.set(toolId, null);
      return null;
    }

    logger.log(`[App Launcher] Searching for ${toolId} with executables:`, executables);

    // Call Rust backend to find the app
    const appPath = await invoke<string | null>('find_app', {
      appNames: executables,
    });

    if (appPath) {
      logger.log(`[App Launcher] Found ${toolId} at: ${appPath}`);
      appCache.set(toolId, appPath);
      return appPath;
    } else {
      logger.log(`[App Launcher] Native app not found for ${toolId}`);
      appCache.set(toolId, null);
      return null;
    }
  } catch (error) {
    console.error(`[App Launcher] Error finding app for ${toolId}:`, error);
    appCache.set(toolId, null);
    return null;
  }
}

/**
 * Launch native application
 *
 * @param appPath - The path to the application
 * @returns true if launched successfully, false otherwise
 */
export async function launchNativeApp(appPath: string): Promise<boolean> {
  try {
    logger.log(`[App Launcher] Launching native app: ${appPath}`);
    const result = await invoke<boolean>('launch_app', {
      appPath,
    });
    logger.log(`[App Launcher] Launch result: ${result}`);
    return result;
  } catch (error) {
    console.error('[App Launcher] Error launching app:', error);
    return false;
  }
}

/**
 * Launch tool (native app if available, otherwise web URL)
 *
 * This is the main function to use from components
 *
 * @param toolId - The tool ID from aiData
 * @param webUrl - The fallback web URL
 * @returns Promise that resolves when the tool is launched
 */
export async function launchTool(toolId: string, webUrl: string): Promise<void> {
  try {
    // Try to find native app
    const appPath = await findNativeApp(toolId);

    if (appPath) {
      // Native app found, try to launch it
      const launched = await launchNativeApp(appPath);

      if (launched) {
        logger.log(`[App Launcher] Successfully launched native app for ${toolId}`);
        return;
      }

      logger.log(`[App Launcher] Failed to launch native app, falling back to URL`);
    }

    // Fallback to web URL
    logger.log(`[App Launcher] Opening web URL for ${toolId}: ${webUrl}`);
    await open(webUrl);
  } catch (error) {
    console.error('[App Launcher] Error launching tool:', error);

    // Last resort fallback to window.open
    logger.log('[App Launcher] Using window.open as last resort');
    window.open(webUrl, '_blank', 'noopener,noreferrer');
  }
}

/**
 * Clear the app cache
 *
 * Useful for testing or when apps are installed/uninstalled
 */
export function clearAppCache(): void {
  appCache.clear();
  logger.log('[App Launcher] Cache cleared');
}

/**
 * Get cache status for debugging
 */
export function getCacheStatus(): {
  size: number;
  entries: Array<{ toolId: string; path: string | null }>;
} {
  const entries = Array.from(appCache.entries()).map(([toolId, path]) => ({
    toolId,
    path,
  }));

  return {
    size: appCache.size,
    entries,
  };
}
