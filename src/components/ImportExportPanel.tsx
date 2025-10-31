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
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard
          label={t('settings.stats.favorites')}
          value={stats.favorites}
          icon={
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          }
        />
        <StatCard
          label={t('settings.stats.customTools')}
          value={stats.customTools}
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          }
        />
        <StatCard
          label={t('settings.stats.collections')}
          value={stats.collections}
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
          }
        />
        <StatCard
          label={t('settings.stats.total')}
          value={stats.totalTools}
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          }
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

function StatCard({ label, value, icon }: { label: string; value: number; icon: React.ReactNode }) {
  return (
    <div className="p-4 bg-gh-canvas-default border border-gh-border-default rounded-lg hover:border-gh-border-muted hover:shadow-sm transition-all duration-200">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5 text-gh-accent-fg">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-gh-fg-muted uppercase tracking-wide mb-1.5 truncate">{label}</p>
          <p className="text-2xl font-semibold tabular-nums text-gh-fg-default">{value}</p>
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
