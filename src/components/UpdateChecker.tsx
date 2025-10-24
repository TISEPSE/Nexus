import { useEffect, useState } from 'react';
import { check } from '@tauri-apps/plugin-updater';
import { relaunch } from '@tauri-apps/plugin-process';

export function UpdateChecker() {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    // Only run in Tauri environment
    const isTauri = '__TAURI__' in window;
    if (!isTauri) {
      return; // Exit early if not in Tauri
    }

    async function checkForUpdates() {
      try {
        const update = await check();
        if (update?.available) {
          setUpdateAvailable(true);
        }
      } catch (error) {
        console.error('Failed to check for updates:', error);
      }
    }

    // Check for updates on app start
    checkForUpdates();

    // Check every 30 minutes
    const interval = setInterval(checkForUpdates, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const handleUpdate = async () => {
    setDownloading(true);
    try {
      const update = await check();
      if (update?.available) {
        await update.downloadAndInstall();
        await relaunch();
      }
    } catch (error) {
      console.error('Failed to download update:', error);
      setDownloading(false);
    }
  };

  if (!updateAvailable) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-gh-accent-emphasis text-white rounded-lg shadow-lg p-4 max-w-sm z-50">
      <h3 className="font-semibold mb-2">Update Available!</h3>
      <p className="text-sm mb-3 opacity-90">A new version is ready to install.</p>
      <button
        onClick={handleUpdate}
        disabled={downloading}
        className="w-full bg-white text-gh-accent-emphasis px-4 py-2 rounded hover:bg-opacity-90 transition-colors font-medium disabled:opacity-50"
      >
        {downloading ? 'Installing...' : 'Update Now'}
      </button>
    </div>
  );
}
