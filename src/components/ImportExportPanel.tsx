import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  downloadConfiguration,
  importConfiguration,
  validateConfiguration,
  getConfigStats,
  NexusConfig,
  ValidationResult,
} from '../utils/configExport';
import { SettingButton } from './SettingsSection';

interface ImportExportPanelProps {
  onImportComplete?: () => void;
}

export function ImportExportPanel({ onImportComplete }: ImportExportPanelProps) {
  const { t } = useTranslation();
  const [isImporting, setIsImporting] = useState(false);
  const [importPreview, setImportPreview] = useState<NexusConfig | null>(null);
  const [validation, setValidation] = useState<ValidationResult | null>(null);
  const [importMode, setImportMode] = useState<'merge' | 'replace'>('merge');
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const stats = getConfigStats();

  const handleExport = () => {
    try {
      downloadConfiguration();
    } catch (err) {
      setError(t('settings.export.error'));
      console.error('Export failed:', err);
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);
    setValidation(null);

    try {
      const text = await file.text();
      const data = JSON.parse(text);

      const validationResult = validateConfiguration(data);
      setValidation(validationResult);

      if (validationResult.valid) {
        setImportPreview(data as NexusConfig);
      } else {
        setError(validationResult.errors.join('; '));
      }
    } catch (err) {
      setError(t('settings.import.invalidJson'));
      console.error('Import failed:', err);
    }

    // Reset file input
    event.target.value = '';
  };

  const handleConfirmImport = async () => {
    if (!importPreview) return;

    setIsImporting(true);
    try {
      await importConfiguration(importPreview, importMode);
      setImportPreview(null);
      setValidation(null);
      onImportComplete?.();

      // Reload page to apply changes
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (err) {
      setError(t('settings.import.error'));
      console.error('Import failed:', err);
    } finally {
      setIsImporting(false);
    }
  };

  const handleCancelImport = () => {
    setImportPreview(null);
    setValidation(null);
    setError(null);
  };

  return (
    <div className="space-y-4">
      {/* Data Statistics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard
          label={t('settings.stats.favorites')}
          value={stats.favorites}
          icon="⭐"
        />
        <StatCard
          label={t('settings.stats.customTools')}
          value={stats.customTools}
          icon="🔧"
        />
        <StatCard
          label={t('settings.stats.collections')}
          value={stats.collections}
          icon="📁"
        />
        <StatCard
          label={t('settings.stats.total')}
          value={stats.totalTools}
          icon="📊"
        />
      </div>

      {/* Export/Import Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <SettingButton
          onClick={handleExport}
          variant="primary"
          icon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          }
        >
          {t('settings.export.button')}
        </SettingButton>

        <SettingButton
          onClick={handleImportClick}
          variant="secondary"
          icon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L9 8m4-4v12" />
            </svg>
          }
        >
          {t('settings.import.button')}
        </SettingButton>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-gh-danger-subtle border border-gh-danger-muted rounded-md">
          <div className="flex items-start gap-2">
            <svg className="w-5 h-5 text-gh-danger-fg flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div className="flex-1">
              <p className="text-sm font-medium text-gh-danger-fg">
                {t('settings.import.errorTitle')}
              </p>
              <p className="mt-1 text-sm text-gh-danger-fg">
                {error}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Import Preview Modal */}
      {importPreview && validation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-gh-canvas-default border border-gh-border-default rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gh-border-default">
              <h3 className="text-lg font-semibold text-gh-fg-default">
                {t('settings.import.previewTitle')}
              </h3>
              <p className="mt-1 text-sm text-gh-fg-muted">
                {t('settings.import.previewDescription')}
              </p>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {/* Warnings */}
              {validation.warnings.length > 0 && (
                <div className="mb-4 p-3 bg-gh-attention-subtle border border-gh-attention-muted rounded-md">
                  <p className="text-sm font-medium text-gh-attention-fg mb-2">
                    {t('settings.import.warnings')}
                  </p>
                  <ul className="list-disc list-inside space-y-1">
                    {validation.warnings.map((warning, i) => (
                      <li key={i} className="text-xs text-gh-attention-fg">
                        {warning}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Configuration Details */}
              <div className="space-y-3">
                <PreviewItem
                  label={t('settings.import.exportedAt')}
                  value={new Date(importPreview.exportedAt).toLocaleString()}
                />
                <PreviewItem
                  label={t('settings.import.version')}
                  value={importPreview.version}
                />
                <PreviewItem
                  label={t('settings.theme')}
                  value={t(`settings.${importPreview.theme}`)}
                />
                <PreviewItem
                  label={t('settings.language')}
                  value={importPreview.language}
                />
                <PreviewItem
                  label={t('settings.stats.favorites')}
                  value={importPreview.favorites.length.toString()}
                />
                <PreviewItem
                  label={t('settings.stats.customTools')}
                  value={importPreview.customTools.length.toString()}
                />
                <PreviewItem
                  label={t('settings.stats.collections')}
                  value={importPreview.collections.length.toString()}
                />
              </div>

              {/* Import Mode Selection */}
              <div className="mt-6 p-4 bg-gh-canvas-subtle rounded-md">
                <p className="text-sm font-medium text-gh-fg-default mb-3">
                  {t('settings.import.modeTitle')}
                </p>
                <div className="space-y-2">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="importMode"
                      value="merge"
                      checked={importMode === 'merge'}
                      onChange={() => setImportMode('merge')}
                      className="mt-0.5 text-gh-accent-fg focus:ring-gh-accent-fg"
                    />
                    <div>
                      <span className="text-sm font-medium text-gh-fg-default">
                        {t('settings.import.modeMerge')}
                      </span>
                      <p className="text-xs text-gh-fg-muted mt-0.5">
                        {t('settings.import.modeMergeDesc')}
                      </p>
                    </div>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="importMode"
                      value="replace"
                      checked={importMode === 'replace'}
                      onChange={() => setImportMode('replace')}
                      className="mt-0.5 text-gh-accent-fg focus:ring-gh-accent-fg"
                    />
                    <div>
                      <span className="text-sm font-medium text-gh-fg-default">
                        {t('settings.import.modeReplace')}
                      </span>
                      <p className="text-xs text-gh-fg-muted mt-0.5">
                        {t('settings.import.modeReplaceDesc')}
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gh-border-default flex gap-3 justify-end">
              <SettingButton
                onClick={handleCancelImport}
                variant="secondary"
                disabled={isImporting}
              >
                {t('settings.import.cancel')}
              </SettingButton>
              <SettingButton
                onClick={handleConfirmImport}
                variant="primary"
                disabled={isImporting}
              >
                {isImporting ? t('settings.import.importing') : t('settings.import.confirm')}
              </SettingButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, icon }: { label: string; value: number; icon: string }) {
  return (
    <div className="p-3 bg-gh-canvas-default border border-gh-border-default rounded-md">
      <div className="flex items-center gap-2">
        <span className="text-2xl">{icon}</span>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gh-fg-muted truncate">{label}</p>
          <p className="text-lg font-semibold text-gh-fg-default">{value}</p>
        </div>
      </div>
    </div>
  );
}

function PreviewItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-gh-border-muted last:border-0">
      <span className="text-sm text-gh-fg-muted">{label}</span>
      <span className="text-sm font-medium text-gh-fg-default">{value}</span>
    </div>
  );
}
