import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { AITool } from '../data/aiData';
import { buildLogoSources, extractDomain } from '../utils/logoUtils';
import { launchTool } from '../services/appLauncher';
import { Collection } from '../types/collection';
import { logger } from '../utils/logger';
import { validateUrl } from '../utils/urlValidator';

interface AICardProps {
  tool: AITool;
  isFavorite: boolean;
  onToggleFavorite?: (toolId: string) => void;
  isCustom?: boolean;
  showEditDelete?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  matchesTemplate?: boolean;
  isMultiSelectMode?: boolean;
  isSelected?: boolean;
  onToggleSelect?: (toolId: string) => void;
  collections?: Collection[];
  onOpenCollectionModal?: (tool: AITool) => void;
  showCollectionIndicator?: boolean;
}

const AICardComponent: React.FC<AICardProps> = ({
  tool,
  isFavorite,
  onToggleFavorite,
  isCustom = false,
  showEditDelete = false,
  onEdit,
  onDelete,
  matchesTemplate = false,
  isMultiSelectMode = false,
  isSelected = false,
  onToggleSelect,
  collections = [],
  onOpenCollectionModal,
  showCollectionIndicator = true
}) => {
  const { t, i18n } = useTranslation();

  // Count how many collections contain this tool
  const collectionCount = useMemo(() => {
    return collections.filter(collection => collection.toolIds.includes(tool.id)).length;
  }, [collections, tool.id]);

  // Get collection names for tooltip
  const collectionNames = useMemo(() => {
    return collections
      .filter(collection => collection.toolIds.includes(tool.id))
      .map(collection => collection.name);
  }, [collections, tool.id]);

  // Build complete list of logo sources (primary + fallbacks)
  const logoSources = React.useMemo(() => {
    const domain = tool.domain || extractDomain(tool.url);
    return buildLogoSources(tool.logo, domain);
  }, [tool.logo, tool.domain, tool.url]);

  // Get translated description if available
  const translatedDescription = React.useMemo(() => {
    if (i18n.language === 'fr') {
      const translationKey = `tools.${tool.id}`;
      const translated = t(translationKey);
      // Only use translation if it's not the same as the key (meaning translation exists)
      return translated !== translationKey ? translated : tool.description;
    }
    return tool.description;
  }, [tool.id, tool.description, i18n.language, t]);

  // State for managing logo fallback
  const [currentLogoIndex, setCurrentLogoIndex] = useState(0);
  const [showFallback, setShowFallback] = useState(false);
  const currentLogo = logoSources[currentLogoIndex];

  // State for context menu
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState<{ top: number; left: number } | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // State for collection tooltip
  const [showCollectionTooltip, setShowCollectionTooltip] = useState(false);

  // Reset logo index when tool changes
  useEffect(() => {
    setCurrentLogoIndex(0);
    // Force fallback for localhost URLs
    const isLocalhost = tool.url.includes('localhost') || tool.url.includes('127.0.0.1');
    setShowFallback(isLocalhost);
  }, [tool.id, tool.url]);

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

  // Handle logo loading error - try next source
  const handleLogoError = useCallback(() => {
    if (currentLogoIndex < logoSources.length - 1) {
      // Try next logo source
      setCurrentLogoIndex(prev => prev + 1);
    } else {
      // All sources failed, show letter fallback
      setShowFallback(true);
    }
  }, [currentLogoIndex, logoSources.length]);

  const handleClick = useCallback(async (e: React.MouseEvent) => {
    // Don't launch if menu is open
    if (menuOpen) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }

    // In multi-select mode, clicking toggles selection instead of launching
    if (isMultiSelectMode && onToggleSelect) {
      onToggleSelect(tool.id);
      return;
    }

    // Validate URL before attempting to launch
    const urlValidation = validateUrl(tool.url);
    if (!urlValidation.isValid) {
      console.error('Invalid URL for tool:', tool.name, urlValidation.error);
      const errorMessage = t('errors.cannotOpen', { name: tool.name, error: urlValidation.error });
      alert(errorMessage);
      return;
    }

    try {
      logger.log('Launching tool:', tool.name, 'with ID:', tool.id);
      await launchTool(tool.id, tool.url);
      logger.log('Tool launched successfully');
    } catch (error) {
      console.error('Error launching tool:', error);
      // Last resort fallback with validated URL
      if (urlValidation.sanitizedUrl) {
        window.open(urlValidation.sanitizedUrl, '_blank', 'noopener,noreferrer');
      }
    }
  }, [menuOpen, isMultiSelectMode, onToggleSelect, tool.id, tool.name, tool.url]);

  return (
    <div
      onClick={handleClick}
      className={`group relative bg-gh-canvas-subtle border border-gh-border-default rounded-lg p-3 sm:p-4
                 hover:bg-gh-canvas-default hover:border-gh-accent-fg hover:shadow-md
                 active:scale-[0.98] transition-all duration-100 text-left w-full cursor-pointer
                 focus:outline-none focus:ring-2 focus:ring-gh-accent-fg focus:ring-offset-2 focus:ring-offset-gh-canvas-default
                 touch-manipulation aspect-[0.7] sm:aspect-auto sm:h-[200px] md:h-[220px]
                 template-transition
                 ${matchesTemplate ? 'template-highlighted' : ''}`}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick(e as any);
        }
      }}
    >
      <div className="flex flex-col h-full items-center justify-between">
        {/* Logo with automatic fallback */}
        <div className="flex items-center justify-center mb-2 sm:mb-3">
          {!showFallback ? (
            <img
              key={currentLogoIndex}
              src={currentLogo}
              alt={`${tool.name} logo`}
              className="w-12 h-12 sm:w-16 sm:h-16 object-contain rounded-md"
              onError={handleLogoError}
              loading="lazy"
            />
          ) : (
            <div className="w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center bg-blue-900 text-white text-xl sm:text-2xl font-bold rounded-md">
              {tool.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        {/* Name - Responsive text size */}
        <h3 className="text-xs sm:text-sm font-semibold text-gh-fg-default group-hover:text-gh-accent-fg transition-colors mb-1 sm:mb-1.5 text-center line-clamp-2 sm:truncate w-full px-1 leading-tight sm:leading-normal">
          {tool.name}
        </h3>

        {/* Description - Hidden on mobile, shown on desktop */}
        <p className="hidden sm:block text-xs text-gh-fg-muted mb-3 line-clamp-1 text-center leading-relaxed w-full px-1">
          {translatedDescription}
        </p>

        {/* Categories - Hidden on mobile, shown on desktop */}
        <div className="hidden sm:flex flex-wrap gap-1 justify-center mt-auto">
          {/* Custom badge if tool is custom */}
          {isCustom && (
            <span className="px-2 py-0.5 text-[10px] leading-tight rounded bg-purple-500/10 text-purple-400 border border-purple-500/20 font-medium">
              {t('card.custom')}
            </span>
          )}
          {/* Regular categories */}
          {tool.category.filter(cat => cat !== 'Ajout personnel').slice(0, isCustom ? 1 : 2).map((cat, index) => (
            <span
              key={index}
              className="px-2 py-0.5 text-[10px] leading-tight rounded bg-gh-accent-subtle text-gh-accent-fg border border-gh-border-muted font-medium"
            >
              {t(`categories.${cat}`)}
            </span>
          ))}
          {tool.category.filter(cat => cat !== 'Ajout personnel').length > (isCustom ? 1 : 2) && (
            <span className="px-2 py-0.5 text-[10px] leading-tight text-gh-fg-subtle">
              +{tool.category.filter(cat => cat !== 'Ajout personnel').length - (isCustom ? 1 : 2)}
            </span>
          )}
        </div>
      </div>

      {/* Multi-select checkbox - Top left (shows instead of favorite in multi-select mode) */}
      {isMultiSelectMode ? (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleSelect?.(tool.id);
          }}
          className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2 z-20 p-1 touch-manipulation"
          aria-label={isSelected ? t('aiCard.deselectTool') : t('aiCard.selectTool')}
        >
          <div
            className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all ${
              isSelected
                ? 'bg-gh-accent-emphasis border-gh-accent-emphasis'
                : 'bg-gh-canvas-default border-gh-border-default hover:border-gh-accent-fg'
            }`}
          >
            {isSelected && (
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>
        </button>
      ) : onToggleFavorite ? (
        /* Favorite button - Top left, larger touch target on mobile */
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(tool.id);
          }}
          className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2 z-10 p-1.5 sm:p-1 rounded hover:bg-gh-canvas-default active:bg-gh-canvas-default transition-colors touch-manipulation"
          aria-label={isFavorite ? t('card.removeFromFavorites') : t('card.addToFavorites')}
        >
          <svg
            className={`w-4 h-4 sm:w-4 sm:h-4 transition-colors ${
              isFavorite
                ? 'fill-yellow-400 stroke-yellow-400'
                : 'fill-none stroke-gh-fg-muted hover:stroke-yellow-400'
            }`}
            viewBox="0 0 24 24"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
            />
          </svg>
        </button>
      ) : null}


      {/* Collection indicator - Top right, when tool is in collection */}
      {!showEditDelete && showCollectionIndicator && collectionCount > 0 && (
        <div
          className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 rounded bg-gh-accent-subtle/90 border border-gh-accent-emphasis/50 backdrop-blur-sm"
          onMouseEnter={() => setShowCollectionTooltip(true)}
          onMouseLeave={() => setShowCollectionTooltip(false)}
        >
          <svg
            className="w-3 h-3 text-gh-accent-fg"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
            />
          </svg>
          <span className="text-xs font-medium text-gh-accent-fg">{collectionCount}</span>

          {/* Tooltip with collection names */}
          {showCollectionTooltip && collectionNames.length > 0 && (
            <div className="absolute bottom-full right-0 mb-1 px-2 py-1 bg-gh-canvas-default border border-gh-border-default rounded shadow-lg z-[10000] whitespace-nowrap animate-menu-appear">
              <div className="text-xs text-gh-fg-default">
                {collectionNames.join(', ')}
              </div>
            </div>
          )}
        </div>
      )}

      {/* External link icon - Top right, hidden on very small mobile and when edit button or collection indicator is shown */}
      {!showEditDelete && (!showCollectionIndicator || collectionCount === 0) && (
        <div className="hidden sm:block absolute top-2 right-2 opacity-0 group-hover:opacity-60 transition-opacity">
          <svg
            className="w-3.5 h-3.5 text-gh-fg-muted"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
        </div>
      )}

      {/* Three-dot menu button - Top right */}
      {showEditDelete && (onEdit || onDelete) && (
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            const button = e.currentTarget;
            const rect = button.getBoundingClientRect();
            const menuHeight = 80; // Approximate menu height
            const windowHeight = window.innerHeight;
            const shouldFlipUp = rect.bottom + menuHeight > windowHeight;

            setMenuPosition({
              top: shouldFlipUp ? rect.top - menuHeight - 4 : rect.bottom + 4,
              left: rect.right - 128 // 128px = w-32, right-align menu with button
            });
            setMenuOpen(!menuOpen);
          }}
          className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 z-10 p-1.5 rounded hover:bg-gh-canvas-inset transition-colors touch-manipulation focus:outline-none"
          aria-label={t('aiCard.options')}
        >
          <svg className="w-5 h-5 text-gh-fg-muted transition-colors" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
          </svg>
        </button>
      )}

      {/* Add to Collection button - Bottom right (next to edit/delete if present) */}
      {!isMultiSelectMode && collections.length > 0 && onOpenCollectionModal && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpenCollectionModal(tool);
          }}
          className={`absolute z-10 p-1 rounded
                     hover:bg-gh-canvas-default/50 active:bg-gh-canvas-default/70
                     transition-all duration-200 ease-out
                     focus:outline-none focus:ring-2 focus:ring-gh-accent-fg focus:ring-offset-2 focus:ring-offset-gh-canvas-subtle
                     touch-manipulation
                     ${showEditDelete ? 'bottom-1 left-1 sm:bottom-1.5 sm:left-1.5' : 'bottom-1 right-1 sm:bottom-1.5 sm:right-1.5'}`}
          aria-label={t('aiCard.addToCollection')}
          title={t('aiCard.addToCollection')}
        >
          {/* Bookmark Plus Icon */}
          <svg
            className={`w-3.5 h-3.5 transition-colors ${
              collectionCount > 0
                ? 'fill-gh-accent-fg stroke-gh-accent-fg'
                : 'fill-none stroke-gh-fg-muted hover:stroke-gh-accent-fg'
            }`}
            viewBox="0 0 24 24"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
            />
            {collectionCount === 0 && (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 8v5m-2.5-2.5h5"
              />
            )}
          </svg>
        </button>
      )}

      {/* Context Menu - Rendered as portal at bottom of card */}
      {menuOpen && menuPosition && (
        <div
          ref={menuRef}
          className="fixed w-32 bg-gh-canvas-default border border-gh-border-default rounded-md shadow-xl z-[9999] animate-menu-appear overflow-hidden"
          style={{
            top: `${menuPosition.top}px`,
            left: `${menuPosition.left}px`
          }}
        >
          {onEdit && (
            <button
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setMenuOpen(false);
                onEdit();
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gh-fg-default hover:bg-gh-accent-emphasis/10 hover:text-gh-accent-fg transition-colors text-left"
            >
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              <span>{t('card.editCustomTool')}</span>
            </button>
          )}
          {onDelete && (
            <button
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setMenuOpen(false);
                onDelete();
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-500/10 transition-colors text-left"
            >
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              <span>{t('card.deleteCustomTool')}</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};

/**
 * Custom comparison function for React.memo optimization
 * Only re-render if these critical props change
 */
const arePropsEqual = (
  prevProps: AICardProps,
  nextProps: AICardProps
): boolean => {
  // Check tool identity (most important for re-renders)
  if (prevProps.tool.id !== nextProps.tool.id) {
    return false;
  }

  // Check favorite status
  if (prevProps.isFavorite !== nextProps.isFavorite) {
    return false;
  }

  // Check collections count (indicates tool was added/removed from collections)
  const prevCollectionsCount = prevProps.collections?.length || 0;
  const nextCollectionsCount = nextProps.collections?.length || 0;
  if (prevCollectionsCount !== nextCollectionsCount) {
    return false;
  }

  // Check if tool is in any collections (membership changed)
  const prevInCollections = prevProps.collections?.some(c =>
    c.toolIds.includes(prevProps.tool.id)
  ) || false;
  const nextInCollections = nextProps.collections?.some(c =>
    c.toolIds.includes(nextProps.tool.id)
  ) || false;
  if (prevInCollections !== nextInCollections) {
    return false;
  }

  // Check multi-select state
  if (prevProps.isMultiSelectMode !== nextProps.isMultiSelectMode) {
    return false;
  }
  if (prevProps.isSelected !== nextProps.isSelected) {
    return false;
  }

  // Check template matching (visual highlighting)
  if (prevProps.matchesTemplate !== nextProps.matchesTemplate) {
    return false;
  }

  // Check custom tool flags
  if (prevProps.isCustom !== nextProps.isCustom) {
    return false;
  }
  if (prevProps.showEditDelete !== nextProps.showEditDelete) {
    return false;
  }

  // All critical props are the same, no need to re-render
  return true;
};

export const AICard = React.memo(AICardComponent, arePropsEqual);
