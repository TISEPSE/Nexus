import { useState, useRef, useEffect } from 'react';

interface ThreeDotMenuProps {
  isPinned: boolean;
  onRename: () => void;
  onTogglePin: () => void;
  onDelete: () => void;
}

export function ThreeDotMenu({ isPinned, onRename, onTogglePin, onDelete }: ThreeDotMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState<{ top: number; left: number } | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const timeoutId = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
    }, 0);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          const button = e.currentTarget;
          const rect = button.getBoundingClientRect();
          const menuHeight = 150; // Approximate menu height with 3 items
          const menuWidth = 208; // 208px = w-52
          const windowHeight = window.innerHeight;
          const shouldFlipUp = rect.bottom + menuHeight > windowHeight;

          setMenuPosition({
            top: shouldFlipUp ? rect.top - menuHeight - 4 : rect.bottom + 4,
            left: rect.right - menuWidth // Right-align menu with button
          });
          setIsOpen(!isOpen);
        }}
        className="
          p-2 rounded-md
          text-gh-fg-muted
          hover:text-gh-fg-default
          hover:bg-gh-canvas-inset
          transition-colors duration-150
          focus:outline-none
                  "
        aria-label="Options de la note"
        aria-haspopup="menu"
        aria-expanded={isOpen}
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
        </svg>
      </button>

      {/* Dropdown Menu - Fixed positioning as portal */}
      {isOpen && menuPosition && (
        <div
          ref={menuRef}
          className="
            fixed
            w-52
            bg-gh-canvas-default
            border border-gh-border-default
            rounded-md
            shadow-xl
            overflow-hidden
            z-[9999]
            animate-menu-appear
          "
          style={{
            top: `${menuPosition.top}px`,
            left: `${menuPosition.left}px`
          }}
          role="menu"
          aria-orientation="vertical"
        >
          {/* Rename */}
          <button
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsOpen(false);
              onRename();
            }}
            role="menuitem"
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gh-fg-default hover:bg-gh-accent-emphasis/10 hover:text-gh-accent-fg transition-colors text-left"
          >
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <span>Renommer</span>
          </button>

          {/* Pin/Unpin */}
          <button
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsOpen(false);
              onTogglePin();
            }}
            role="menuitem"
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gh-fg-default hover:bg-gh-accent-emphasis/10 hover:text-gh-accent-fg transition-colors text-left"
          >
            <svg className={`w-4 h-4 flex-shrink-0 ${isPinned ? 'text-gh-accent-fg' : ''}`} fill="currentColor" viewBox="0 0 24 24">
              <path d="M16 12V4h1c.55 0 1-.45 1-1s-.45-1-1-1H7c-.55 0-1 .45-1 1s.45 1 1 1h1v8l-2 2v2h5v5c0 .55.45 1 1 1s1-.45 1-1v-5h5v-2l-2-2z" />
            </svg>
            <span>{isPinned ? 'Détacher' : 'Épingler'}</span>
          </button>

          {/* Delete */}
          <button
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsOpen(false);
              onDelete();
            }}
            role="menuitem"
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-500/10 transition-colors text-left"
          >
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            <span>Supprimer</span>
          </button>
        </div>
      )}
    </>
  );
}
