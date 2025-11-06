import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export type ConfirmDialogVariant = 'danger' | 'warning' | 'info';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: ConfirmDialogVariant;
  children?: React.ReactNode; // For custom content like warnings
}

/**
 * Custom confirmation dialog component
 * Replaces native window.confirm() with accessible, themed dialog
 *
 * Features:
 * - Keyboard support (Enter to confirm, Escape to cancel)
 * - Accessible (ARIA labels, focus management)
 * - Theme-aware styling (GitHub Primer)
 * - Multiple variants (danger, warning, info)
 */
export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  cancelText,
  variant = 'info',
  children
}: ConfirmDialogProps) {
  const { t } = useTranslation();

  // Keyboard support
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        onConfirm();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, onConfirm]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Backdrop click handler
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Variant styling
  const getVariantStyles = () => {
    switch (variant) {
      case 'danger':
        return {
          icon: (
            <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          ),
          buttonClass: 'bg-red-500 text-white hover:bg-red-600 active:bg-red-700'
        };
      case 'warning':
        return {
          icon: (
            <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          ),
          buttonClass: 'bg-yellow-500 text-white hover:bg-yellow-600 active:bg-yellow-700'
        };
      case 'info':
      default:
        return {
          icon: (
            <svg className="w-6 h-6 text-gh-accent-fg" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
          buttonClass: 'bg-gh-accent-emphasis text-white hover:bg-gh-accent-fg active:bg-gh-accent-emphasis'
        };
    }
  };

  const variantStyles = getVariantStyles();
  const defaultConfirmText = variant === 'danger' ? t('common.delete') : t('common.confirm');
  const defaultCancelText = t('common.cancel');

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999] p-4 animate-fade-in"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-description"
    >
      <div
        className="bg-gh-canvas-default border border-gh-border-default rounded-lg max-w-md w-full shadow-2xl animate-modal-enter"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with icon */}
        <div className="flex items-start gap-4 p-6 pb-4">
          <div className="flex-shrink-0 mt-0.5">
            {variantStyles.icon}
          </div>
          <div className="flex-1 min-w-0">
            <h2
              id="confirm-dialog-title"
              className="text-lg font-semibold text-gh-fg-default mb-2"
            >
              {title}
            </h2>
            <p
              id="confirm-dialog-description"
              className="text-sm text-gh-fg-muted"
            >
              {message}
            </p>
          </div>
        </div>

        {/* Custom content (warnings, details, etc.) */}
        {children && (
          <div className="px-6 pb-4">
            {children}
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-3 px-6 py-4 border-t border-gh-border-default bg-gh-canvas-subtle">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gh-canvas-default border border-gh-border-default text-gh-fg-default rounded-md hover:bg-gh-canvas-subtle active:bg-gh-canvas-inset transition-colors focus:outline-none focus:ring-2 focus:ring-gh-accent-fg focus:ring-offset-2 focus:ring-offset-gh-canvas-subtle"
            autoFocus
          >
            {cancelText || defaultCancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`flex-1 px-4 py-2 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gh-canvas-subtle ${variantStyles.buttonClass}`}
          >
            {confirmText || defaultConfirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
