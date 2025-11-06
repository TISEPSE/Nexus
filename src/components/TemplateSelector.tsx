import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface TemplateSelectorProps {
  selectedTemplate: string;
  onTemplateChange: (template: string) => void;
}

/**
 * Template Selector Dropdown - Role-based Tool Filtering
 *
 * DESIGN RATIONALE:
 * - Matches existing LanguageToggle and ThemeToggle visual language
 * - Dropdown pattern scales better than toggle for 3+ templates
 * - Icon + label pattern maintains header consistency
 * - Clear selected state with accent color
 * - 44x44px minimum touch target for mobile accessibility
 *
 * UX PATTERN: Notion role selector + GitHub filter dropdown
 * PSYCHOLOGY: Role-based mental models help users find tools faster
 */
export const TemplateSelector = ({
  selectedTemplate,
  onTemplateChange,
}: TemplateSelectorProps) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const templates = [
    { id: 'all', icon: 'grid', label: t('templates.all') },
    { id: 'designer', icon: 'palette', label: t('templates.designer') },
    { id: 'developer', icon: 'code', label: t('templates.developer') },
    { id: 'content-creator', icon: 'video', label: t('templates.contentCreator') },
    { id: 'marketer', icon: 'megaphone', label: t('templates.marketer') },
    { id: 'trader', icon: 'chart', label: t('templates.trader') },
    { id: 'data-analyst', icon: 'chart-bar', label: t('templates.dataAnalyst') },
    { id: '3d-artist', icon: 'cube', label: t('templates.3dArtist') },
    { id: 'video-editor', icon: 'film', label: t('templates.videoEditor') },
    { id: 'student', icon: 'book', label: t('templates.student') },
    { id: 'media-enthusiast', icon: 'play', label: t('templates.mediaEnthusiast') },
  ];

  const selectedTemplateData = templates.find(t => t.id === selectedTemplate) || templates[0];

  // Icons as inline SVG for better control
  const icons = {
    grid: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    ),
    palette: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
    ),
    code: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    ),
    video: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
    ),
    megaphone: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
    ),
    chart: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    ),
    'chart-bar': (
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    ),
    cube: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    ),
    film: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
    ),
    book: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    ),
    play: (
      <>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </>
    ),
  };

  return (
    <div className="relative">
      {/* Dropdown Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        onBlur={() => setTimeout(() => setIsOpen(false), 200)}
        className="group relative flex items-center gap-1.5 px-2 sm:px-3 py-2 min-h-[44px] min-w-[44px] bg-gh-canvas-subtle border border-gh-border-default rounded-md hover:bg-gh-canvas-inset hover:border-gh-accent-fg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gh-accent-fg focus:ring-offset-2 focus:ring-offset-gh-canvas-default"
        aria-label={t('templates.selectTemplate')}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        {/* Icon */}
        <svg
          className="w-4 h-4 text-gh-fg-muted group-hover:text-gh-accent-fg transition-colors flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth={2}
          aria-hidden="true"
        >
          {icons[selectedTemplateData.icon as keyof typeof icons]}
        </svg>

        {/* Label - Hidden on mobile, shown on desktop */}
        <span className="hidden sm:inline text-sm font-medium text-gh-fg-default whitespace-nowrap">
          {selectedTemplateData.label}
        </span>

        {/* Dropdown Arrow */}
        <svg
          className={`w-3.5 h-3.5 text-gh-fg-muted transition-transform duration-200 ${
            isOpen ? 'rotate-180' : 'rotate-0'
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth={2.5}
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>

        {/* Hover Tooltip */}
        <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gh-canvas-default border border-gh-border-default rounded text-xs text-gh-fg-default whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg z-50">
          {t('templates.selectTemplate')}
        </span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className="absolute top-full mt-2 right-0 w-56 bg-gh-canvas-subtle border border-gh-border-default rounded-md shadow-lg overflow-hidden z-50 animate-slide-in-fade"
          role="listbox"
        >
          {templates.map((template) => (
            <button
              key={template.id}
              onClick={() => {
                onTemplateChange(template.id);
                setIsOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all duration-200 ${
                selectedTemplate === template.id
                  ? 'bg-gh-accent-subtle text-gh-accent-fg border-l-2 border-gh-accent-fg'
                  : 'text-gh-fg-default hover:bg-gh-accent-subtle/30 hover:text-gh-accent-fg'
              }`}
              role="option"
              aria-selected={selectedTemplate === template.id}
            >
              <svg
                className={`w-5 h-5 flex-shrink-0 transition-all duration-200 ${
                  selectedTemplate === template.id
                    ? 'text-gh-accent-fg scale-110'
                    : 'text-gh-fg-muted'
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2}
                aria-hidden="true"
              >
                {icons[template.icon as keyof typeof icons]}
              </svg>
              <span className="text-sm font-medium">{template.label}</span>

              {/* Check icon for selected state */}
              {selectedTemplate === template.id && (
                <svg
                  className="w-4 h-4 ml-auto text-gh-accent-fg"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={2.5}
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
