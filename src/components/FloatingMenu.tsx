import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface Template {
  id: string;
  icon: string;
  label: string;
}

interface FloatingMenuProps {
  // Navigation
  activeView: 'dashboard' | 'workspace';
  onViewChange: (view: 'dashboard' | 'workspace') => void;

  // Template
  templates: Template[];
  selectedTemplate: string;
  onTemplateChange: (templateId: string) => void;
  icons: Record<string, React.ReactNode>;

  // Category
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

/**
 * Floating Menu - Mobile Navigation & Filters
 *
 * Combines all controls into a single expandable bottom-right menu:
 * - Navigation (Dashboard/Workspace)
 * - Role/Template selector
 * - Category filter
 *
 * Note: Theme and Language toggles are in the header for quick access
 */
export const FloatingMenu: React.FC<FloatingMenuProps> = ({
  activeView,
  onViewChange,
  templates,
  selectedTemplate,
  onTemplateChange,
  icons,
  categories,
  selectedCategory,
  onCategoryChange,
}) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Swipe to close
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchCurrent, setTouchCurrent] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Close on ESC key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle close - always immediate, no animation delay
  const handleClose = () => {
    // Remove focus from button to prevent ring effect
    if (buttonRef.current) {
      buttonRef.current.blur();
    }

    setIsOpen(false);
    setTouchStart(null);
    setTouchCurrent(null);
    setIsDragging(false);
  };

  // Handle swipe to close (only from header)
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setTouchStart(touch.clientY);
    setTouchCurrent(touch.clientY);
    setIsDragging(false);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStart === null) return;

    const touch = e.touches[0];
    const diff = touch.clientY - touchStart;

    // Only allow dragging down
    if (diff > 0) {
      setTouchCurrent(touch.clientY);
      setIsDragging(true);
    }
  };

  const handleTouchEnd = () => {
    if (touchStart === null) {
      setTouchStart(null);
      setTouchCurrent(null);
      setIsDragging(false);
      return;
    }

    const diff = touchCurrent ? touchCurrent - touchStart : 0;

    // If dragged down more than 80px, close the modal
    if (diff > 80) {
      handleClose();
    } else {
      // Reset - will bounce back to original position
      setTouchStart(null);
      setTouchCurrent(null);
      setIsDragging(false);
    }
  };

  // Calculate transform based on drag
  const getTransform = () => {
    if (!isDragging || touchStart === null || touchCurrent === null) {
      return 'translateY(0)';
    }

    const diff = touchCurrent - touchStart;
    return diff > 0 ? `translateY(${diff}px)` : 'translateY(0)';
  };

  if (!isOpen) {
    return (
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(true)}
        className="
          fixed bottom-6 right-4 z-40
          w-16 h-16 rounded-full
          bg-gh-accent-emphasis
          text-white
          shadow-fab
          flex lg:hidden items-center justify-center
          transition-all duration-200
          hover:scale-110
          active:scale-95
          focus:outline-none
          animate-fab-entry
        "
        aria-label="Open menu"
        aria-expanded={false}
        aria-haspopup="dialog"
      >
        {/* Menu Icon */}
        <svg
          className="w-7 h-7"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>

        {/* Badge indicator if filters are active */}
        {(selectedTemplate !== 'all' || selectedCategory !== 'All') && (
          <div
            className="
              absolute -top-1 -right-1
              w-3 h-3
              bg-gh-accent-fg
              border-2 border-gh-canvas-default
              rounded-full
              animate-pulse
            "
            aria-hidden="true"
          />
        )}
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-45 lg:hidden">
      {/* Backdrop */}
      <div
        className="
          absolute inset-0
          bg-black/50
          dark:bg-black/50
          backdrop-blur-sm
          animate-backdrop-in
        "
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Bottom Sheet */}
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="menu-title"
        style={{
          transform: getTransform(),
          transition: isDragging ? 'none' : 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        className="
          absolute bottom-0 left-0 right-0
          max-h-[70vh]
          bg-gh-canvas-subtle
          border-t-2 border-gh-border-default
          rounded-t-2xl
          shadow-2xl
          animate-modal-slide-up
          flex flex-col
        "
      >
        {/* Drag Handle & Header - Draggable zone */}
        <div
          className="flex-shrink-0 cursor-grab active:cursor-grabbing"
          style={{ touchAction: 'none', userSelect: 'none' }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Drag Handle */}
          <div className="flex justify-center pt-3 pb-2">
            <div className="w-12 h-1.5 bg-gh-border-default rounded-full" aria-hidden="true"></div>
          </div>

          {/* Header */}
          <div className="flex items-center justify-center px-6 py-3 border-b border-gh-border-default">
            <h2
              id="menu-title"
              className="text-lg font-semibold text-gh-fg-default"
            >
              {t('menu.title', 'Menu')}
            </h2>
          </div>
        </div>

        {/* Content - Scrollable zone */}
        <div className="overflow-y-auto overflow-x-hidden flex-1 p-4 space-y-6">
          {/* Navigation Section */}
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  onViewChange('dashboard');
                  handleClose();
                }}
                className={`
                  px-4 py-4 rounded-md
                  flex flex-col items-center justify-center gap-2
                  font-semibold text-sm
                  transition-all duration-200
                  ${activeView === 'dashboard'
                    ? 'bg-gh-accent-emphasis text-white shadow-lg scale-[1.02]'
                    : 'bg-gh-canvas-default text-gh-fg-default hover:bg-gh-canvas-inset border-2 border-gh-border-default'
                  }
                `}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                {t('navigation.dashboard', 'Dashboard')}
              </button>
              <button
                onClick={() => {
                  onViewChange('workspace');
                  handleClose();
                }}
                className={`
                  px-4 py-4 rounded-md
                  flex flex-col items-center justify-center gap-2
                  font-semibold text-sm
                  transition-all duration-200
                  ${activeView === 'workspace'
                    ? 'bg-gh-accent-emphasis text-white shadow-lg scale-[1.02]'
                    : 'bg-gh-canvas-default text-gh-fg-default hover:bg-gh-canvas-inset border-2 border-gh-border-default'
                  }
                `}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                {t('navigation.workspace', 'My Workspace')}
              </button>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gh-border-default"></div>

          {/* Role/Template Section */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-gh-fg-muted uppercase tracking-wider">
              {t('menu.role', 'Role / Template')}
            </h3>
            <div className="grid grid-cols-4 gap-2">
              {templates.map((template) => {
                const isSelected = selectedTemplate === template.id;
                return (
                  <button
                    key={template.id}
                    onClick={() => {
                      onTemplateChange(template.id);
                    }}
                    className={`
                      aspect-square
                      flex flex-col items-center justify-center gap-1
                      p-2
                      rounded-md
                      transition-all duration-200
                      ${isSelected
                        ? 'bg-gh-accent-emphasis text-white shadow-md scale-105'
                        : 'bg-gh-canvas-default text-gh-fg-muted hover:text-gh-fg-default hover:bg-gh-canvas-inset border border-gh-border-default'
                      }
                    `}
                  >
                    <svg
                      className="w-5 h-5 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                    >
                      {icons[template.icon]}
                    </svg>
                    <span className="text-[9px] font-semibold text-center line-clamp-2 leading-tight">
                      {template.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gh-border-default"></div>

          {/* Category Filter Section */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-gh-fg-muted uppercase tracking-wider">
              {t('menu.category', 'Category')}
            </h3>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => {
                const isSelected = selectedCategory === category;
                return (
                  <button
                    key={category}
                    onClick={() => {
                      onCategoryChange(category);
                    }}
                    className={`
                      px-3 py-1.5 rounded-md
                      text-xs font-semibold
                      transition-all duration-200
                      ${isSelected
                        ? 'bg-gh-accent-emphasis text-white shadow-md'
                        : 'bg-gh-canvas-default text-gh-fg-default hover:bg-gh-canvas-inset border border-gh-border-default'
                      }
                    `}
                  >
                    {t(`categories.${category}`, category)}
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
