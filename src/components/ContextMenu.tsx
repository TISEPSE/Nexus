import { useState, useRef, useEffect, ReactNode } from 'react';

export interface ContextMenuItem {
  label: string;
  icon: ReactNode;
  onClick: () => void;
  variant?: 'default' | 'danger';
}

interface ContextMenuProps {
  items: ContextMenuItem[];
  buttonClassName?: string;
  'aria-label'?: string;
}

export function ContextMenu({ items, buttonClassName, 'aria-label': ariaLabel = 'Options' }: ContextMenuProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState<{ top: number; left: number } | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    if (!menuOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    // Delay adding listener to avoid immediate closure
    const timeoutId = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
    }, 0);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);

  // Close on Escape key
  useEffect(() => {
    if (!menuOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [menuOpen]);

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          const button = e.currentTarget;
          const rect = button.getBoundingClientRect();
          const menuHeight = items.length * 40 + 8; // Approximate: 40px per item + padding
          const windowHeight = window.innerHeight;
          const shouldFlipUp = rect.bottom + menuHeight > windowHeight;

          setMenuPosition({
            top: shouldFlipUp ? rect.top - menuHeight - 4 : rect.bottom + 4,
            left: rect.right - 128 // 128px = w-32, right-align menu with button
          });
          setMenuOpen(!menuOpen);
        }}
        className={buttonClassName || "p-1 rounded hover:bg-gh-canvas-inset transition-colors focus:outline-none"}
        aria-label={ariaLabel}
      >
        <svg className="w-5 h-5 text-gh-fg-muted transition-colors" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
        </svg>
      </button>

      {/* Context Menu - Rendered as portal */}
      {menuOpen && menuPosition && (
        <div
          ref={menuRef}
          className="fixed w-32 bg-gh-canvas-default border border-gh-border-default rounded-md shadow-xl z-[9999] animate-menu-appear overflow-hidden"
          style={{
            top: `${menuPosition.top}px`,
            left: `${menuPosition.left}px`
          }}
        >
          {items.map((item, index) => (
            <button
              key={index}
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setMenuOpen(false);
                item.onClick();
              }}
              className={`w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors text-left ${
                item.variant === 'danger'
                  ? 'text-red-500 hover:bg-red-500/10'
                  : 'text-gh-fg-default hover:bg-gh-accent-emphasis/10 hover:text-gh-accent-fg'
              }`}
            >
              <div className="w-4 h-4 flex-shrink-0">{item.icon}</div>
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      )}
    </>
  );
}
