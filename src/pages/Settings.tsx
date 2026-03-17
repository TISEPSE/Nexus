import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  SettingToggle,
  SettingSelect,
  SettingButton,
} from '../components/SettingsSection';
import { ImportExportPanel } from '../components/ImportExportPanel';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { clearAllData, resetToDefaults } from '../utils/configExport';

interface SettingsProps {
  isDarkTheme: boolean;
  onToggleTheme: () => void;
}

type SettingsTab = 'appearance' | 'data' | 'advanced' | 'about';

// ─── Icons ────────────────────────────────────────────────────────────────────

const AppearanceIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75}>
    <circle cx="12" cy="12" r="4" />
    <path strokeLinecap="round" d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
  </svg>
);

const DataIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75}>
    <ellipse cx="12" cy="5" rx="9" ry="3" />
    <path strokeLinecap="round" d="M21 12c0 1.66-4.03 3-9 3S3 13.66 3 12" />
    <path strokeLinecap="round" d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5" />
  </svg>
);

const AdvancedIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
  </svg>
);

const AboutIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75}>
    <circle cx="12" cy="12" r="10" />
    <path strokeLinecap="round" d="M12 16v-4M12 8h.01" />
  </svg>
);

const ChevronDown = () => (
  <svg width={16} height={16} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
);

const ExternalLinkIcon = () => (
  <svg width={14} height={14} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
  </svg>
);

// ─── Row Primitives ────────────────────────────────────────────────────────────

function Row({
  label,
  description,
  children,
  danger,
}: {
  label: string;
  description?: string;
  children: React.ReactNode;
  danger?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-6 py-4">
      <div className="min-w-0 flex-1">
        <p className={`text-sm font-medium ${danger ? 'text-gh-danger-fg' : 'text-gh-fg-default'}`}>
          {label}
        </p>
        {description && (
          <p className="mt-0.5 text-xs text-gh-fg-muted leading-relaxed">{description}</p>
        )}
      </div>
      <div className="flex-shrink-0">{children}</div>
    </div>
  );
}

function Divider() {
  return <div className="h-px bg-gh-border-muted/60" />;
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-6 mb-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-gh-fg-subtle first:mt-0">
      {children}
    </p>
  );
}

// ─── Tab definitions ───────────────────────────────────────────────────────────

const TABS: { id: SettingsTab; labelKey: string; fallback: string; descKey: string; descFallback: string; Icon: React.FC<{ size?: number }> }[] = [
  { id: 'appearance', labelKey: 'settings.tabs.appearance', fallback: 'Appearance', descKey: 'settings.appearance.description', descFallback: 'Theme, language & display', Icon: AppearanceIcon },
  { id: 'data',       labelKey: 'settings.tabs.data',       fallback: 'Data',       descKey: 'settings.data.description',       descFallback: 'Import, export & backup', Icon: DataIcon },
  { id: 'advanced',   labelKey: 'settings.tabs.advanced',   fallback: 'Advanced',   descKey: 'settings.advanced.description',   descFallback: 'Updates & developer options', Icon: AdvancedIcon },
  { id: 'about',      labelKey: 'settings.tabs.about',      fallback: 'About',      descKey: 'settings.about.description',      descFallback: 'Version & credits', Icon: AboutIcon },
];

// ─── Main component ────────────────────────────────────────────────────────────

export function Settings({ isDarkTheme, onToggleTheme }: SettingsProps) {
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState<SettingsTab>('appearance');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large'>(() => {
    try { return (localStorage.getItem('nexus_font_size') as any) || 'medium'; }
    catch { return 'medium'; }
  });
  const [compactMode, setCompactMode]     = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [autoUpdate, setAutoUpdate]       = useState(true);
  const [developerMode, setDeveloperMode] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  useEffect(() => {
    localStorage.setItem('nexus_font_size', fontSize);
    document.documentElement.setAttribute('data-font-size', fontSize);
  }, [fontSize]);

  const activeTabDef = TABS.find(tab => tab.id === activeTab)!;

  const handleResetDefaults = () => { resetToDefaults(); window.location.reload(); };
  const handleClearData     = () => { clearAllData(); setShowClearConfirm(false); };

  return (
    <>
      <style>{`
        .settings-sidebar-item {
          position: relative;
          display: flex;
          align-items: center;
          gap: 9px;
          width: 100%;
          padding: 7px 12px;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 450;
          text-align: left;
          transition: background 120ms, color 120ms;
          color: var(--color-fg-muted, #768390);
          border: none;
          background: transparent;
          cursor: pointer;
        }
        .settings-sidebar-item:hover {
          background: var(--color-canvas-default);
          color: var(--color-fg-default);
        }
        .settings-sidebar-item.active {
          background: var(--color-accent-subtle);
          color: var(--color-accent-fg);
          font-weight: 500;
        }
        .settings-sidebar-item.active::before {
          content: '';
          position: absolute;
          left: 0;
          top: 4px;
          bottom: 4px;
          width: 2.5px;
          border-radius: 2px;
          background: var(--color-accent-fg, #2f81f7);
        }
        .danger-zone {
          border: 1px solid var(--color-danger-muted);
          border-radius: 8px;
          overflow: hidden;
        }
        .danger-zone-header {
          padding: 12px 16px;
          background: var(--color-danger-subtle);
          border-bottom: 1px solid var(--color-danger-muted);
        }
        .about-logo-ring {
          width: 72px;
          height: 72px;
          border-radius: 18px;
          background: var(--color-accent-subtle);
          border: 1px solid var(--color-accent-muted);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 32px;
          font-weight: 700;
          color: var(--color-accent-fg);
          letter-spacing: -1px;
          font-variant-numeric: tabular-nums;
        }
      `}</style>

      <div className="flex rounded-lg overflow-hidden border border-gh-border-default bg-gh-canvas-default" style={{ minHeight: 520 }}>

        {/* ── Desktop Sidebar ── */}
        <aside className="hidden lg:flex flex-col w-[200px] shrink-0 border-r border-gh-border-default bg-gh-canvas-subtle">
          <div className="flex-1 px-2 py-4 space-y-0.5">
            {TABS.map(({ id, labelKey, fallback, Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`settings-sidebar-item${activeTab === id ? ' active' : ''}`}
                aria-current={activeTab === id ? 'page' : undefined}
              >
                <Icon size={15} />
                <span>{t(labelKey, fallback)}</span>
              </button>
            ))}
          </div>

          {/* Sidebar footer */}
          <div className="px-4 py-3 border-t border-gh-border-muted">
            <p className="text-[11px] text-gh-fg-subtle">Nexus v0.0.6</p>
          </div>
        </aside>

        {/* ── Main content ── */}
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">

          {/* Mobile nav */}
          <div className="lg:hidden border-b border-gh-border-default bg-gh-canvas-subtle">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="w-full flex items-center justify-between px-4 py-3 text-gh-fg-default"
              aria-expanded={mobileOpen}
            >
              <div className="flex items-center gap-2.5 text-sm font-medium">
                <activeTabDef.Icon size={15} />
                <span>{t(activeTabDef.labelKey, activeTabDef.fallback)}</span>
              </div>
              <span className={`text-gh-fg-muted transition-transform duration-200 ${mobileOpen ? 'rotate-180' : ''}`}>
                <ChevronDown />
              </span>
            </button>

            {mobileOpen && (
              <div className="border-t border-gh-border-muted px-2 py-2 space-y-0.5">
                {TABS.map(({ id, labelKey, fallback, Icon }) => (
                  <button
                    key={id}
                    onClick={() => { setActiveTab(id); setMobileOpen(false); }}
                    className={`settings-sidebar-item w-full${activeTab === id ? ' active' : ''}`}
                  >
                    <Icon size={15} />
                    <span>{t(labelKey, fallback)}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Content area */}
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-2xl px-6 py-6">

              {/* Page header */}
              <div className="mb-6">
                <h2 className="text-base font-semibold text-gh-fg-default">
                  {t(activeTabDef.labelKey, activeTabDef.fallback)}
                </h2>
                <p className="mt-0.5 text-xs text-gh-fg-muted">
                  {t(activeTabDef.descKey, activeTabDef.descFallback)}
                </p>
              </div>

              {/* ── Appearance ── */}
              {activeTab === 'appearance' && (
                <div>
                  <SectionLabel>{t('settings.groups.interface', 'Display')}</SectionLabel>
                  <div className="divide-y divide-gh-border-muted/60">
                    <Row label={t('settings.theme', 'Theme')} description={t('settings.appearance.themeDesc', 'Switch between light and dark interface')}>
                      <SettingSelect
                        value={isDarkTheme ? 'dark' : 'light'}
                        onChange={(v) => { if ((v === 'dark') !== isDarkTheme) onToggleTheme(); }}
                        options={[
                          { value: 'dark',  label: t('settings.dark', 'Dark') },
                          { value: 'light', label: t('settings.light', 'Light') },
                        ]}
                      />
                    </Row>
                    <Row label={t('settings.language', 'Language')} description={t('settings.appearance.languageDesc', 'Choose your preferred language')}>
                      <SettingSelect
                        value={i18n.language}
                        onChange={(v) => i18n.changeLanguage(v)}
                        options={[
                          { value: 'en', label: 'English' },
                          { value: 'fr', label: 'Français' },
                        ]}
                      />
                    </Row>
                    <Row label={t('settings.appearance.fontSize', 'Font size')} description={t('settings.appearance.fontSizeDesc', 'Adjust text size across the app')}>
                      <SettingSelect
                        value={fontSize}
                        onChange={(v) => setFontSize(v as any)}
                        options={[
                          { value: 'small',  label: t('settings.appearance.fontSmall', 'Small') },
                          { value: 'medium', label: t('settings.appearance.fontMedium', 'Medium') },
                          { value: 'large',  label: t('settings.appearance.fontLarge', 'Large') },
                        ]}
                      />
                    </Row>
                  </div>

                  <SectionLabel>{t('settings.groups.accessibility', 'Accessibility')}</SectionLabel>
                  <div className="divide-y divide-gh-border-muted/60">
                    <Row label={t('settings.appearance.compactMode', 'Compact mode')} description={t('settings.appearance.compactModeDesc', 'Reduce spacing between elements')}>
                      <SettingToggle checked={compactMode} onChange={setCompactMode} />
                    </Row>
                    <Row label={t('settings.appearance.reducedMotion', 'Reduce motion')} description={t('settings.appearance.reducedMotionDesc', 'Minimize animations and transitions')}>
                      <SettingToggle checked={reducedMotion} onChange={setReducedMotion} />
                    </Row>
                  </div>
                </div>
              )}

              {/* ── Data ── */}
              {activeTab === 'data' && (
                <div className="space-y-8">
                  <div>
                    <SectionLabel>{t('settings.data.title', 'Import & Export')}</SectionLabel>
                    <div className="rounded-md border border-gh-border-default overflow-hidden">
                      <div className="px-4 py-4">
                        <ImportExportPanel />
                      </div>
                    </div>
                  </div>

                  <div>
                    <SectionLabel>{t('settings.data.dangerZone', 'Danger zone')}</SectionLabel>
                    <div className="danger-zone">
                      <div className="danger-zone-header">
                        <p className="text-xs font-medium text-gh-danger-fg">
                          {t('settings.data.dangerZoneDesc', 'These actions are irreversible. Proceed with caution.')}
                        </p>
                      </div>
                      <div className="divide-y divide-gh-danger-muted/40 px-4">
                        <Row
                          label={t('settings.data.resetTitle', 'Reset to defaults')}
                          description={t('settings.data.resetDesc', 'Restore all settings to their default values')}
                          danger
                        >
                          <SettingButton onClick={() => setShowResetConfirm(true)} variant="secondary">
                            {t('settings.data.resetButton', 'Reset')}
                          </SettingButton>
                        </Row>
                        <Row
                          label={t('settings.data.clearTitle', 'Clear all data')}
                          description={t('settings.data.clearDesc', 'Permanently delete all tools, collections and favorites')}
                          danger
                        >
                          <SettingButton onClick={() => setShowClearConfirm(true)} variant="danger">
                            {t('settings.data.clearButton', 'Clear data')}
                          </SettingButton>
                        </Row>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ── Advanced ── */}
              {activeTab === 'advanced' && (
                <div>
                  <SectionLabel>{t('settings.updates.title', 'Updates')}</SectionLabel>
                  <div className="divide-y divide-gh-border-muted/60">
                    <Row label={t('settings.updates.autoUpdate', 'Automatic updates')} description={t('settings.updates.autoUpdateDesc', 'Download and install updates automatically')}>
                      <SettingToggle checked={autoUpdate} onChange={setAutoUpdate} />
                    </Row>
                    <Row label={t('settings.updates.checkNow', 'Check for updates')} description={t('settings.updates.description', 'Manually check if a newer version is available')}>
                      <SettingButton
                        onClick={() => console.log('checking updates…')}
                        variant="secondary"
                        icon={
                          <svg width={14} height={14} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                        }
                      >
                        {t('settings.updates.checkNow', 'Check now')}
                      </SettingButton>
                    </Row>
                  </div>

                  <SectionLabel>{t('settings.advanced.title', 'Developer')}</SectionLabel>
                  <div className="divide-y divide-gh-border-muted/60">
                    <Row label={t('settings.advanced.developerMode', 'Developer mode')} description={t('settings.advanced.developerModeDesc', 'Enable additional logging and debug tools')}>
                      <SettingToggle checked={developerMode} onChange={setDeveloperMode} />
                    </Row>
                  </div>

                  <div className="mt-6 px-4 py-3 rounded-md border border-gh-success-muted bg-gh-success-subtle">
                    <p className="text-xs text-gh-success-fg leading-relaxed">
                      {t('settings.privacy.localOnly', 'All your data is stored locally on your machine. Nothing is sent to external servers.')}
                    </p>
                  </div>
                </div>
              )}

              {/* ── About ── */}
              {activeTab === 'about' && (
                <div className="space-y-6">
                  {/* Hero */}
                  <div className="flex items-center gap-5 py-2">
                    <div className="about-logo-ring" aria-hidden="true">N</div>
                    <div>
                      <h3 className="text-xl font-bold text-gh-fg-default tracking-tight">Nexus</h3>
                      <p className="text-xs text-gh-fg-muted mt-0.5">
                        {t('settings.about.version', 'Version')} 0.0.6
                      </p>
                      <p className="text-xs text-gh-fg-subtle mt-1 max-w-xs">
                        {t('app.description', 'Your AI tools launcher — all your assistants in one place.')}
                      </p>
                    </div>
                  </div>

                  <Divider />

                  {/* Links */}
                  <div className="space-y-1">
                    <SectionLabel>{t('settings.about.links', 'Links')}</SectionLabel>
                    <a
                      href="https://github.com/TISEPSE/Nexus"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between px-3 py-2.5 rounded-md border border-gh-border-default bg-gh-canvas-subtle hover:bg-gh-canvas-default hover:border-gh-border-muted transition-colors group"
                    >
                      <div className="flex items-center gap-2.5 text-sm text-gh-fg-default">
                        <svg width={15} height={15} viewBox="0 0 24 24" fill="currentColor" className="text-gh-fg-muted">
                          <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                        </svg>
                        {t('settings.about.github', 'GitHub — TISEPSE/Nexus')}
                      </div>
                      <span className="text-gh-fg-subtle group-hover:text-gh-fg-muted transition-colors">
                        <ExternalLinkIcon />
                      </span>
                    </a>
                  </div>

                  <Divider />

                  <p className="text-[11px] text-gh-fg-subtle text-center">
                    {t('settings.about.credits', 'Built with Tauri · React · Tailwind CSS')}
                  </p>
                </div>
              )}

            </div>
          </div>
        </main>
      </div>

      {/* ── Dialogs ── */}
      <ConfirmDialog
        isOpen={showResetConfirm}
        onClose={() => setShowResetConfirm(false)}
        onConfirm={handleResetDefaults}
        title={t('settings.data.resetTitle', 'Reset to defaults')}
        message={t('settings.advanced.resetConfirm', 'This will restore all settings to their default values. Your custom tools and collections will not be affected.')}
        variant="warning"
      />
      <ConfirmDialog
        isOpen={showClearConfirm}
        onClose={() => setShowClearConfirm(false)}
        onConfirm={handleClearData}
        title={t('settings.data.clearTitle', 'Clear all data')}
        message={t('settings.data.clearDesc', 'This will permanently delete all your tools, collections and favorites. This action cannot be undone.')}
        variant="warning"
      />
    </>
  );
}
