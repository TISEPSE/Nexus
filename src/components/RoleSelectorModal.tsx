import { useEffect, useRef, ReactNode, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface Template {
  id: string;
  icon: string;
  label: string;
}

interface RoleSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  templates: Template[];
  selectedTemplate: string;
  onTemplateChange: (templateId: string) => void;
  icons: Record<string, ReactNode>;
}

/**
 * Role Selector Modal - Bottom Sheet Design
 *
 * DESIGN SPECS:
 * - Partial overlay (70vh max height)
 * - Slide-up animation with backdrop fade
 * - 3-column responsive grid (4 columns landscape)
 * - Staggered fade-in for grid items
 * - Triple dismissal: backdrop tap, close button, ESC key
 * - Full accessibility support
 */
export const RoleSelectorModal = ({
  isOpen,
  onClose,
  templates,
  selectedTemplate,
  onTemplateChange,
  icons,
}: RoleSelectorModalProps) => {
  const { t } = useTranslation();
  const modalRef = useRef<HTMLDivElement>(null);
  const [isClosing, setIsClosing] = useState(false);

  // Close on ESC key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  // Focus trap
  useEffect(() => {
    if (isOpen && modalRef.current) {
      const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      const handleTab = (e: KeyboardEvent) => {
        if (e.key !== 'Tab') return;

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement?.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement?.focus();
            e.preventDefault();
          }
        }
      };

      document.addEventListener('keydown', handleTab);
      firstElement?.focus();

      return () => {
        document.removeEventListener('keydown', handleTab);
      };
    }
  }, [isOpen]);

  // Handle close with animation
  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 200); // Match animation duration
  };

  // Reset closing state when opening
  useEffect(() => {
    if (isOpen) {
      setIsClosing(false);
    }
  }, [isOpen]);

  if (!isOpen && !isClosing) return null;

  const handleRoleSelect = (templateId: string) => {
    onTemplateChange(templateId);
    handleClose();
  };

  return (
    <div className="fixed inset-0 z-45 lg:hidden">
      {/* Backdrop */}
      <div
        className={`
          absolute inset-0
          bg-black/50
          dark:bg-black/50
          backdrop-blur-sm
          ${isClosing ? 'animate-backdrop-out' : 'animate-backdrop-in'}
        `}
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Bottom Sheet */}
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className={`
          absolute bottom-0 left-0 right-0
          max-h-[70vh]
          bg-gh-canvas-subtle
          border-t-2 border-gh-border-default
          rounded-t-2xl
          shadow-2xl
          ${isClosing ? 'animate-modal-slide-down' : 'animate-modal-slide-up'}
          flex flex-col
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gh-border-default flex-shrink-0">
          <h2
            id="modal-title"
            className="text-lg font-semibold text-gh-fg-default"
          >
            {t('templates.selectTemplate')}
          </h2>

          {/* Close Button */}
          <button
            onClick={handleClose}
            className="
              w-10 h-10
              flex items-center justify-center
              rounded-full
              bg-transparent
              hover:bg-gh-canvas-inset
              text-gh-fg-muted
              hover:text-gh-fg-default
              transition-colors duration-200
              focus:outline-none focus:ring-2 focus:ring-gh-accent-fg
            "
            aria-label="Close role selector"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Role Grid */}
        <div
          className="
            grid grid-cols-3 landscape:grid-cols-4
            gap-3
            p-4
            overflow-y-auto overflow-x-hidden
            max-h-[calc(70vh-80px)]
          "
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {templates.map((template, index) => {
            const isSelected = selectedTemplate === template.id;

            return (
              <button
                key={template.id}
                onClick={() => handleRoleSelect(template.id)}
                className={`
                  min-w-[80px] aspect-square
                  flex flex-col items-center justify-center gap-2
                  p-3
                  bg-gh-canvas-default
                  border-2
                  ${
                    isSelected
                      ? 'border-gh-accent-emphasis bg-gh-accent-subtle ring-4 ring-gh-accent-fg/20'
                      : 'border-gh-border-default hover:border-gh-accent-fg hover:bg-gh-canvas-inset'
                  }
                  rounded-lg
                  transition-all duration-200
                  hover:scale-105
                  active:scale-95
                  focus:outline-none focus:ring-2 focus:ring-gh-accent-fg focus:ring-offset-2
                  animate-item-stagger
                `}
                style={{
                  animationDelay: `${index * 50}ms`,
                }}
                role="radio"
                aria-checked={isSelected}
                tabIndex={isSelected ? 0 : -1}
              >
                {/* Icon */}
                <svg
                  className={`
                    w-8 h-8 flex-shrink-0
                    ${
                      isSelected
                        ? 'text-gh-accent-fg'
                        : 'text-gh-fg-muted group-hover:text-gh-accent-fg'
                    }
                    transition-colors
                  `}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  aria-hidden="true"
                >
                  {icons[template.icon]}
                </svg>

                {/* Label */}
                <span
                  className={`
                    text-xs font-medium text-center line-clamp-2
                    ${isSelected ? 'text-gh-accent-fg' : 'text-gh-fg-default'}
                  `}
                >
                  {template.label}
                </span>

                {/* Selected Checkmark */}
                {isSelected && (
                  <div className="absolute top-1 right-1">
                    <svg
                      className="w-4 h-4 text-gh-accent-fg"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
