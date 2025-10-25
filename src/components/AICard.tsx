import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { AITool } from '../data/aiData';
import { buildLogoSources, extractDomain } from '../utils/logoUtils';
import { launchTool } from '../services/appLauncher';
import { Collection } from '../types/collection';

interface AICardProps {
  tool: AITool;
  isFavorite: boolean;
  onToggleFavorite: (toolId: string) => void;
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
  showCollectionIndicator = false
}) => {
  const { t, i18n } = useTranslation();

  // Count how many collections contain this tool
  const collectionCount = useMemo(() => {
    return collections.filter(collection => collection.toolIds.includes(tool.id)).length;
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

  // Reset logo index when tool changes
  useEffect(() => {
    setCurrentLogoIndex(0);
    setShowFallback(false);
  }, [tool.id]);

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

  const handleClick = async () => {
    // In multi-select mode, clicking toggles selection instead of launching
    if (isMultiSelectMode && onToggleSelect) {
      onToggleSelect(tool.id);
      return;
    }

    try {
      console.log('Launching tool:', tool.name, 'with ID:', tool.id);
      await launchTool(tool.id, tool.url);
      console.log('Tool launched successfully');
    } catch (error) {
      console.error('Error launching tool:', error);
      // Last resort fallback
      window.open(tool.url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`group relative bg-gh-canvas-subtle border border-gh-border-default rounded-lg p-3 sm:p-4
                 hover:bg-gh-canvas-default hover:border-gh-accent-fg hover:shadow-md
                 active:scale-[0.98] transition-all duration-150 text-left w-full cursor-pointer
                 focus:outline-none focus:ring-2 focus:ring-gh-accent-fg focus:ring-offset-2 focus:ring-offset-gh-canvas-default
                 touch-manipulation aspect-[0.7] sm:aspect-auto sm:h-[200px] md:h-[220px]
                 template-transition
                 ${matchesTemplate ? 'template-highlighted' : ''}`}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
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
            <div className="w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center text-gh-accent-fg text-xl sm:text-2xl font-bold">
              {tool.name.charAt(0)}
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
          aria-label={isSelected ? 'Deselect tool' : 'Select tool'}
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
      ) : (
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
      )}


      {/* Collection indicator - Top right, when tool is in collection */}
      {!showEditDelete && collectionCount > 0 && (
        <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 rounded bg-gh-accent-subtle/90 border border-gh-accent-emphasis/50 backdrop-blur-sm">
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
        </div>
      )}

      {/* External link icon - Top right, hidden on very small mobile and when edit button or collection indicator is shown */}
      {!showEditDelete && collectionCount === 0 && (
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

      {/* Edit button - Top right */}
      {showEditDelete && onEdit && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 z-10 p-1.5 rounded hover:bg-gh-accent-subtle/50 active:bg-gh-accent-subtle transition-colors touch-manipulation"
          aria-label={t('card.editCustomTool')}
        >
          <svg
            className="w-4 h-4 text-gh-accent-fg"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
        </button>
      )}

      {/* Delete button - Bottom right */}
      {showEditDelete && onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="absolute bottom-1.5 right-1.5 sm:bottom-2 sm:right-2 z-10 p-1.5 rounded hover:bg-red-500/10 active:bg-red-500/20 transition-colors touch-manipulation"
          aria-label={t('card.deleteCustomTool')}
        >
          <svg
            className="w-4 h-4 text-red-500 hover:text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      )}

      {/* Add to Collection button - Bottom left */}
      {!isMultiSelectMode && collections.length > 0 && onOpenCollectionModal && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpenCollectionModal(tool);
          }}
          className="absolute bottom-1.5 left-1.5 sm:bottom-2 sm:left-2 z-10
                     p-1.5 rounded
                     bg-gh-accent-emphasis hover:bg-gh-accent-fg active:bg-gh-accent-emphasis
                     opacity-0 sm:opacity-0 sm:group-hover:opacity-100
                     transition-all duration-200 ease-out
                     hover:scale-105 active:scale-95
                     focus:outline-none focus:ring-2 focus:ring-gh-accent-fg focus:ring-offset-2 focus:ring-offset-gh-canvas-subtle
                     touch-manipulation"
          aria-label="Ajouter à une collection"
        >
          {/* Folder Plus Icon */}
          <svg
            className="w-4 h-4 text-white"
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
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 11v4m-2-2h4"
            />
          </svg>
        </button>
      )}
    </div>
  );
};

export const AICard = React.memo(AICardComponent);
