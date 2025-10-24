import React from 'react';

interface RoleSelectorFABProps {
  selectedIcon: React.ReactNode;
  isFilterActive: boolean;
  onClick: () => void;
}

/**
 * Floating Action Button - Role Selector Trigger
 *
 * DESIGN SPECS:
 * - 56x56px circular button (mobile only)
 * - Bottom-right positioning with safe margins
 * - Dynamic icon showing current role selection
 * - Badge indicator when filter is active
 * - Smooth entry and pulse animations
 * - Touch-optimized with haptic-style feedback
 */
export const RoleSelectorFAB: React.FC<RoleSelectorFABProps> = ({
  selectedIcon,
  isFilterActive,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className="
        fixed bottom-6 right-4 z-40
        w-14 h-14 rounded-full
        bg-gh-accent-emphasis
        text-white
        shadow-fab
        flex items-center justify-center
        transition-all duration-300
        hover:scale-110
        active:scale-95
        focus:outline-none focus:ring-4 focus:ring-gh-accent-fg/50
        lg:hidden
        animate-fab-entry
      "
      aria-label="Open role selector"
      aria-expanded={false}
      aria-haspopup="dialog"
    >
      {/* Dynamic Role Icon */}
      <div className="relative w-6 h-6">
        {selectedIcon}
      </div>

      {/* Active Filter Badge */}
      {isFilterActive && (
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
};
