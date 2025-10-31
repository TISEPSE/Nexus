import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface FloatingMenuProps {
  // Navigation
  activeView: 'dashboard' | 'workspace' | 'school' | 'settings';
  onViewChange: (view: 'dashboard' | 'workspace' | 'school' | 'settings') => void;

  // Category
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

/**
 * Floating Menu - Simple Mobile Navigation
 *
 * A clean, bottom-sheet style menu for mobile with:
 * - Quick navigation buttons (Dashboard, Workspace, Settings)
 * - Optional category filters
 *
 * Theme and Language toggles remain in the header
 */
export const FloatingMenu: React.FC<FloatingMenuProps> = ({
  activeView,
  onViewChange,
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

  // Handle close
  const handleClose = () => {
    if (buttonRef.current) {
      buttonRef.current.blur();
    }

    setIsOpen(false);
    setTouchStart(null);
    setTouchCurrent(null);
    setIsDragging(false);
  };

  // Handle swipe to close
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
      // Reset
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

  // Navigation items
  const navigationItems = [
    {
      id: 'dashboard' as const,
      label: t('navigation.dashboard', 'Dashboard'),
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      id: 'workspace' as const,
      label: t('navigation.workspace', 'My Workspace'),
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
    },
    {
      id: 'school' as const,
      label: t('navigation.school', 'School'),
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
        </svg>
      ),
    },
    {
      id: 'settings' as const,
      label: t('settings.title', 'Settings'),
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
  ];

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
        aria-label={t('menu.title', 'Menu')}
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
        {selectedCategory !== 'All' && (
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
        {/* Drag Handle & Header */}
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
              {t('menu.navigation', 'Navigation')}
            </h2>
          </div>
        </div>

        {/* Content - Scrollable zone */}
        <div className="overflow-y-auto overflow-x-hidden flex-1 p-5 space-y-6">

          {/* Main Navigation Section */}
          <div className="space-y-3">
            {navigationItems.map((item) => {
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onViewChange(item.id);
                    handleClose();
                  }}
                  className={`
                    w-full px-5 py-4 rounded-lg
                    flex items-center gap-4
                    font-semibold text-base
                    transition-all duration-200
                    ${isActive
                      ? 'bg-gh-accent-emphasis text-white shadow-lg scale-[1.02] ring-2 ring-gh-accent-muted ring-offset-2 ring-offset-gh-canvas-subtle'
                      : 'bg-gh-canvas-default text-gh-fg-default hover:bg-gh-canvas-inset border-2 border-gh-border-default hover:border-gh-border-muted hover:scale-[1.01]'
                    }
                  `}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <div className="flex-shrink-0">
                    {item.icon}
                  </div>
                  <span className="flex-1 text-left">{item.label}</span>
                  {isActive && (
                    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>

          {/* Divider */}
          <div className="border-t border-gh-border-default"></div>

          {/* Category Filter Section */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-gh-fg-muted uppercase tracking-wider px-1">
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
                      px-4 py-2 rounded-lg
                      text-sm font-semibold
                      transition-all duration-200
                      ${isSelected
                        ? 'bg-gh-accent-emphasis text-white shadow-md ring-2 ring-gh-accent-muted'
                        : 'bg-gh-canvas-default text-gh-fg-default hover:bg-gh-canvas-inset border border-gh-border-default hover:border-gh-border-muted'
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
