import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  SettingsSection,
  SettingItem,
  SettingButton,
  SettingToggle,
  SettingSelect,
} from '../components/SettingsSection';
import { ImportExportPanel } from '../components/ImportExportPanel';
import { clearAllData, resetToDefaults } from '../utils/configExport';

interface SettingsProps {
  isDarkTheme: boolean;
  onToggleTheme: () => void;
}

type SettingsTab =
  | 'appearance'
  | 'data'
  | 'collections'
  | 'tools'
  | 'updates'
  | 'privacy'
  | 'advanced'
  | 'about';

// SVG Icon Components
const PaletteIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
  </svg>
);

const DatabaseIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
  </svg>
);

const FolderIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
  </svg>
);

const ToolsIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const UpdateIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

const ShieldIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const SlidersIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
  </svg>
);

const InfoIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

interface TabGroup {
  title: string;
  tabs: Array<{
    id: SettingsTab;
    label: string;
    icon: React.ReactNode;
    description?: string;
  }>;
}

export function Settings({ isDarkTheme, onToggleTheme }: SettingsProps) {
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState<SettingsTab>('appearance');
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [compactMode, setCompactMode] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [autoUpdate, setAutoUpdate] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const tabGroups: TabGroup[] = [
    {
      title: t('settings.groups.interface') || 'Interface',
      tabs: [
        {
          id: 'appearance',
          label: t('settings.tabs.appearance'),
          icon: <PaletteIcon />,
          description: 'Theme, language, display'
        },
        {
          id: 'collections',
          label: t('settings.tabs.collections'),
          icon: <FolderIcon />,
          description: 'Organization settings'
        },
        {
          id: 'tools',
          label: t('settings.tabs.tools'),
          icon: <ToolsIcon />,
          description: 'Tool preferences'
        }
      ]
    },
    {
      title: t('settings.groups.system') || 'System',
      tabs: [
        {
          id: 'data',
          label: t('settings.tabs.data'),
          icon: <DatabaseIcon />,
          description: 'Import, export, backup'
        },
        {
          id: 'updates',
          label: t('settings.tabs.updates'),
          icon: <UpdateIcon />,
          description: 'Application updates'
        },
        {
          id: 'privacy',
          label: t('settings.tabs.privacy'),
          icon: <ShieldIcon />,
          description: 'Data privacy'
        },
        {
          id: 'advanced',
          label: t('settings.tabs.advanced'),
          icon: <SlidersIcon />,
          description: 'Developer options'
        }
      ]
    },
    {
      title: t('settings.groups.info') || 'Information',
      tabs: [
        {
          id: 'about',
          label: t('settings.tabs.about'),
          icon: <InfoIcon />,
          description: 'Version, credits'
        }
      ]
    }
  ];

  const allTabs = tabGroups.flatMap(group => group.tabs);

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  const handleResetDefaults = () => {
    if (confirm(t('settings.advanced.resetConfirm'))) {
      resetToDefaults();
      window.location.reload();
    }
  };

  const handleClearData = () => {
    clearAllData();
  };

  const handleCheckUpdates = () => {
    // This would integrate with Tauri updater
    alert(t('settings.updates.checkingUpdates'));
  };

  return (
    <div className="flex h-full">
      {/* Desktop Sidebar Navigation */}
      <aside className="hidden lg:flex flex-col w-72 border-r border-gh-border-default bg-gh-canvas-subtle rounded-lg">
        <div className="sticky top-0 z-10 px-4 py-4 border-b border-gh-border-muted bg-gh-canvas-subtle rounded-t-lg">
          <h2 className="text-lg font-semibold text-gh-fg-default">
            {t('settings.title') || 'Settings'}
          </h2>
          <p className="text-xs text-gh-fg-muted mt-1">
            {t('settings.subtitle') || 'Customize your experience'}
          </p>
        </div>

        <nav className="flex-1 overflow-y-auto py-3 px-2" aria-label="Settings navigation">
          {tabGroups.map((group, groupIndex) => (
            <div key={group.title} className="mb-6">
              {/* Group Header */}
              <div className="px-3 mb-2">
                <h3 className="text-xs font-semibold text-gh-fg-subtle uppercase tracking-wider">
                  {group.title}
                </h3>
              </div>

              {/* Group Tabs */}
              <div className="space-y-1">
                {group.tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      group w-full flex items-center gap-3 px-3 py-2 rounded-md text-left
                      transition-all duration-200 ease-out
                      ${
                        activeTab === tab.id
                          ? 'bg-gh-accent-subtle text-gh-accent-fg shadow-sm ring-1 ring-gh-accent-muted'
                          : 'text-gh-fg-muted hover:bg-gh-canvas-default hover:text-gh-fg-default'
                      }
                    `}
                    aria-current={activeTab === tab.id ? 'page' : undefined}
                  >
                    {/* Icon Container */}
                    <div
                      className={`
                        flex-shrink-0 transition-all duration-200
                        ${
                          activeTab === tab.id
                            ? 'text-gh-accent-fg scale-110'
                            : 'text-gh-fg-subtle group-hover:text-gh-fg-default group-hover:scale-105'
                        }
                      `}
                    >
                      {tab.icon}
                    </div>

                    {/* Label */}
                    <div className="flex-1 min-w-0">
                      <div
                        className={`
                          text-sm font-medium transition-colors duration-200
                          ${activeTab === tab.id ? 'text-gh-accent-fg' : ''}
                        `}
                      >
                        {tab.label}
                      </div>
                    </div>

                    {/* Active Indicator */}
                    {activeTab === tab.id && (
                      <div className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-gh-accent-fg animate-pulse" />
                    )}
                  </button>
                ))}
              </div>

              {/* Divider (except for last group) */}
              {groupIndex < tabGroups.length - 1 && (
                <div className="mt-4 px-3">
                  <div className="border-t border-gh-border-muted" />
                </div>
              )}
            </div>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Navigation Header */}
        <div className="lg:hidden sticky top-0 z-20 border-b border-gh-border-default bg-gh-canvas-subtle backdrop-blur-sm bg-opacity-95">
          <div className="px-4 py-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-full flex items-center justify-between px-4 py-3 rounded-lg bg-gh-canvas-default border border-gh-border-default text-gh-fg-default hover:bg-gh-canvas-subtle transition-colors"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-settings-menu"
            >
              <div className="flex items-center gap-3">
                {allTabs.find(t => t.id === activeTab)?.icon}
                <span className="font-medium">
                  {allTabs.find(t => t.id === activeTab)?.label}
                </span>
              </div>
              <svg
                className={`w-5 h-5 text-gh-fg-muted transition-transform duration-200 ${
                  mobileMenuOpen ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Mobile Menu Dropdown */}
            {mobileMenuOpen && (
              <div
                id="mobile-settings-menu"
                className="mt-2 p-2 rounded-lg border border-gh-border-default bg-gh-canvas-default shadow-lg animate-menu-appear"
              >
                {tabGroups.map((group) => (
                  <div key={group.title} className="mb-4 last:mb-0">
                    <div className="px-3 py-1.5">
                      <h3 className="text-xs font-semibold text-gh-fg-subtle uppercase tracking-wider">
                        {group.title}
                      </h3>
                    </div>
                    <div className="space-y-1">
                      {group.tabs.map((tab) => (
                        <button
                          key={tab.id}
                          onClick={() => {
                            setActiveTab(tab.id);
                            setMobileMenuOpen(false);
                          }}
                          className={`
                            w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-left transition-colors
                            ${
                              activeTab === tab.id
                                ? 'bg-gh-accent-subtle text-gh-accent-fg'
                                : 'text-gh-fg-muted hover:bg-gh-canvas-subtle hover:text-gh-fg-default'
                            }
                          `}
                        >
                          <div className="flex-shrink-0">{tab.icon}</div>
                          <span className="text-sm font-medium">{tab.label}</span>
                          {activeTab === tab.id && (
                            <svg
                              className="ml-auto w-4 h-4 text-gh-accent-fg"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              aria-hidden="true"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto p-6 space-y-6">

            {/* Appearance Settings */}
            {activeTab === 'appearance' && (
              <>
                <SettingsSection
                  title={t('settings.appearance.title')}
                  description={t('settings.appearance.description')}
                  icon={<PaletteIcon />}
                >
                  <SettingItem
                    label={t('settings.theme')}
                    description={t('settings.appearance.themeDesc')}
                  >
                    <SettingSelect
                      value={isDarkTheme ? 'dark' : 'light'}
                      onChange={(value) => {
                        if ((value === 'dark') !== isDarkTheme) {
                          onToggleTheme();
                        }
                      }}
                      options={[
                        { value: 'dark', label: t('settings.dark') },
                        { value: 'light', label: t('settings.light') },
                      ]}
                    />
                  </SettingItem>

                  <SettingItem
                    label={t('settings.language')}
                    description={t('settings.appearance.languageDesc')}
                  >
                    <SettingSelect
                      value={i18n.language}
                      onChange={handleLanguageChange}
                      options={[
                        { value: 'en', label: 'English' },
                        { value: 'fr', label: 'Français' },
                      ]}
                    />
                  </SettingItem>

                  <SettingItem
                    label={t('settings.appearance.fontSize')}
                    description={t('settings.appearance.fontSizeDesc')}
                  >
                    <SettingSelect
                      value={fontSize}
                      onChange={(value) => setFontSize(value as any)}
                      options={[
                        { value: 'small', label: t('settings.appearance.fontSmall') },
                        { value: 'medium', label: t('settings.appearance.fontMedium') },
                        { value: 'large', label: t('settings.appearance.fontLarge') },
                      ]}
                    />
                  </SettingItem>

                  <SettingItem
                    label={t('settings.appearance.compactMode')}
                    description={t('settings.appearance.compactModeDesc')}
                  >
                    <SettingToggle
                      checked={compactMode}
                      onChange={setCompactMode}
                    />
                  </SettingItem>

                  <SettingItem
                    label={t('settings.appearance.reducedMotion')}
                    description={t('settings.appearance.reducedMotionDesc')}
                  >
                    <SettingToggle
                      checked={reducedMotion}
                      onChange={setReducedMotion}
                    />
                  </SettingItem>
                </SettingsSection>
              </>
            )}

            {/* Data & Sync Settings */}
            {activeTab === 'data' && (
              <>
                <SettingsSection
                  title={t('settings.data.title')}
                  description={t('settings.data.description')}
                  icon={<DatabaseIcon />}
                >
                  <ImportExportPanel />
                </SettingsSection>

                <SettingsSection
                  title={t('settings.data.dangerZone')}
                  description={t('settings.data.dangerZoneDesc')}
                  icon={
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  }
                >
                  <div className="space-y-3">
                    <div className="p-4 bg-gh-attention-subtle border border-gh-attention-muted rounded-md">
                      <p className="text-sm font-medium text-gh-attention-fg mb-2">
                        {t('settings.data.resetTitle')}
                      </p>
                      <p className="text-xs text-gh-attention-fg mb-3">
                        {t('settings.data.resetDesc')}
                      </p>
                      <SettingButton
                        onClick={handleResetDefaults}
                        variant="secondary"
                      >
                        {t('settings.data.resetButton')}
                      </SettingButton>
                    </div>

                    <div className="p-4 bg-gh-danger-subtle border border-gh-danger-muted rounded-md">
                      <p className="text-sm font-medium text-gh-danger-fg mb-2">
                        {t('settings.data.clearTitle')}
                      </p>
                      <p className="text-xs text-gh-danger-fg mb-3">
                        {t('settings.data.clearDesc')}
                      </p>
                      <SettingButton
                        onClick={handleClearData}
                        variant="danger"
                      >
                        {t('settings.data.clearButton')}
                      </SettingButton>
                    </div>
                  </div>
                </SettingsSection>
              </>
            )}

            {/* Collections Settings */}
            {activeTab === 'collections' && (
              <SettingsSection
                title={t('settings.collections.title')}
                description={t('settings.collections.description')}
                icon={<FolderIcon />}
              >
                <SettingItem
                  label={t('settings.collections.defaultSort')}
                  description={t('settings.collections.defaultSortDesc')}
                >
                  <SettingSelect
                    value="name"
                    onChange={() => {}}
                    options={[
                      { value: 'name', label: t('collections.sortName') },
                      { value: 'date', label: t('collections.sortDate') },
                      { value: 'size', label: t('collections.sortSize') },
                    ]}
                  />
                </SettingItem>
              </SettingsSection>
            )}

            {/* Tools Settings */}
            {activeTab === 'tools' && (
              <SettingsSection
                title={t('settings.tools.title')}
                description={t('settings.tools.description')}
                icon={<ToolsIcon />}
              >
                <SettingItem
                  label={t('settings.tools.defaultView')}
                  description={t('settings.tools.defaultViewDesc')}
                >
                  <SettingSelect
                    value="all"
                    onChange={() => {}}
                    options={[
                      { value: 'all', label: t('workspace.tabs.all') },
                      { value: 'favorites', label: t('workspace.tabs.favorites') },
                      { value: 'custom', label: t('workspace.tabs.custom') },
                    ]}
                  />
                </SettingItem>
              </SettingsSection>
            )}

            {/* Updates Settings */}
            {activeTab === 'updates' && (
              <SettingsSection
                title={t('settings.updates.title')}
                description={t('settings.updates.description')}
                icon={<UpdateIcon />}
              >
                <SettingItem
                  label={t('settings.updates.autoUpdate')}
                  description={t('settings.updates.autoUpdateDesc')}
                >
                  <SettingToggle
                    checked={autoUpdate}
                    onChange={setAutoUpdate}
                  />
                </SettingItem>

                <div className="pt-3">
                  <SettingButton
                    onClick={handleCheckUpdates}
                    variant="primary"
                    icon={
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    }
                  >
                    {t('settings.updates.checkNow')}
                  </SettingButton>
                </div>
              </SettingsSection>
            )}

            {/* Privacy Settings */}
            {activeTab === 'privacy' && (
              <SettingsSection
                title={t('settings.privacy.title')}
                description={t('settings.privacy.description')}
                icon={<ShieldIcon />}
              >
                <div className="p-4 bg-gh-success-subtle border border-gh-success-muted rounded-md">
                  <p className="text-sm text-gh-success-fg">
                    {t('settings.privacy.localOnly')}
                  </p>
                </div>
              </SettingsSection>
            )}

            {/* Advanced Settings */}
            {activeTab === 'advanced' && (
              <SettingsSection
                title={t('settings.advanced.title')}
                description={t('settings.advanced.description')}
                icon={<SlidersIcon />}
              >
                <SettingItem
                  label={t('settings.advanced.developerMode')}
                  description={t('settings.advanced.developerModeDesc')}
                >
                  <SettingToggle
                    checked={false}
                    onChange={() => {}}
                  />
                </SettingItem>
              </SettingsSection>
            )}

            {/* About Settings */}
            {activeTab === 'about' && (
              <SettingsSection
                title={t('settings.about.title')}
                description={t('settings.about.description')}
                icon={<InfoIcon />}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-center py-6">
                    <div className="text-center">
                      <h3 className="text-3xl font-bold text-gh-fg-default mb-2">
                        Nexus
                      </h3>
                      <p className="text-sm text-gh-fg-muted">
                        {t('settings.about.version')}: 0.0.2
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-3">
                    <a
                      href="https://github.com/TISEPSE/Nexus"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 bg-gh-canvas-default border border-gh-border-default rounded-md hover:bg-gh-canvas-subtle transition-colors"
                    >
                      <span className="text-sm text-gh-fg-default">
                        {t('settings.about.github')}
                      </span>
                      <svg className="w-4 h-4 text-gh-fg-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>

                  <div className="pt-4 border-t border-gh-border-muted">
                    <p className="text-xs text-gh-fg-muted text-center">
                      {t('settings.about.credits')}
                    </p>
                  </div>
                </div>
              </SettingsSection>
            )}

          </div>
        </div>
      </main>
    </div>
  );
}
