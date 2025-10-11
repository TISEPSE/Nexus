import { useEffect } from 'react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  toolName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteConfirmModal({ isOpen, toolName, onConfirm, onCancel }: DeleteConfirmModalProps) {
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

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onCancel();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  };

  return (
    <div
      className="fixed inset-0 backdrop-blur-md bg-black/20 flex items-center justify-center z-50 p-4 overflow-hidden"
      onClick={handleBackdropClick}
    >
      <div className="bg-gh-canvas-default border border-gh-border-default rounded-lg max-w-md w-full p-6 shadow-2xl">
        {/* Warning Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
            <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold text-gh-fg-default text-center mb-2">
          Delete Custom Tool?
        </h2>

        {/* Tool Name */}
        <div className="mb-4 p-3 bg-gh-canvas-subtle border border-gh-border-default rounded text-center">
          <p className="text-sm font-mono text-gh-fg-default font-semibold">
            {toolName}
          </p>
        </div>

        {/* Warning Message */}
        <p className="text-sm text-gh-fg-muted text-center mb-6">
          This action cannot be undone. This tool will be permanently removed from your custom tools.
        </p>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            autoFocus
            className="flex-1 px-4 py-2 bg-gh-canvas-subtle border border-gh-border-default text-gh-fg-default rounded hover:bg-gh-canvas-inset transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors font-medium"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
