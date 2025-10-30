import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { MultiSelect } from './MultiSelect';
import { extractDomain, generateFallbackLogos } from '../utils/logoUtils';

interface AddToolModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd?: (tool: {
    name: string;
    description: string;
    url: string;
    category: string[];
    tags: string[];
    logo: string | string[];
    domain: string;
  }) => void;
  onEdit?: (toolId: string, tool: {
    name: string;
    description: string;
    url: string;
    category: string[];
    tags: string[];
    logo: string | string[];
    domain: string;
  }) => void;
  availableCategories: string[];
  editingTool?: {
    id: string;
    name: string;
    description: string;
    url: string;
    category: string[];
    tags: string[];
    logo: string | string[];
    domain?: string;
  } | null;
  mode?: 'add' | 'edit';
}

export function AddToolModal({ isOpen, onClose, onAdd, onEdit, availableCategories, editingTool, mode = 'add' }: AddToolModalProps) {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [logoPreviewError, setLogoPreviewError] = useState(false);

  // Populate form when editing
  useEffect(() => {
    if (mode === 'edit' && editingTool) {
      setName(editingTool.name);
      setDescription(editingTool.description);
      setUrl(editingTool.url);
      // Extract logo URL if it's a string or first element of array
      const toolLogo = Array.isArray(editingTool.logo) ? editingTool.logo[0] : editingTool.logo;
      setLogoUrl(toolLogo || '');
      // Filter out 'Ajout personnel' from categories display
      const categoriesWithoutPersonal = editingTool.category.filter(cat =>
        cat !== 'Ajout personnel' && availableCategories.includes(cat)
      );
      setSelectedCategories(categoriesWithoutPersonal);
      setLogoPreviewError(false);
    } else if (mode === 'add') {
      // Reset form for add mode
      setName('');
      setDescription('');
      setUrl('');
      setLogoUrl('');
      setSelectedCategories([]);
      setLogoPreviewError(false);
    }
  }, [mode, editingTool, isOpen]);

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

  // Display transform for categories
  const displayCategory = useCallback((cat: string) => t(`categories.${cat}`), [t]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !url) {
      alert('Name and URL are required');
      return;
    }

    // Extract domain for logo fallback
    const domain = extractDomain(url.startsWith('http') ? url : `https://${url}`);

    // Determine logo strategy
    let finalLogo: string | string[];

    if (logoUrl.trim()) {
      // User provided a logo URL - use it as primary with fallbacks
      finalLogo = [logoUrl.trim(), ...generateFallbackLogos(domain)];
    } else {
      // No logo provided - use auto-generated fallbacks
      finalLogo = generateFallbackLogos(domain);
    }

    const toolData = {
      name,
      description,
      url: url.startsWith('http') ? url : `https://${url}`,
      category: ['Ajout personnel', ...selectedCategories],
      tags: selectedCategories.length > 0 ? selectedCategories.map(c => c.toLowerCase()) : [name.toLowerCase()],
      logo: finalLogo,
      domain,
    };

    if (mode === 'edit' && editingTool && onEdit) {
      onEdit(editingTool.id, toolData);
    } else if (mode === 'add' && onAdd) {
      onAdd(toolData);
    }

    // Reset form
    setName('');
    setDescription('');
    setUrl('');
    setLogoUrl('');
    setSelectedCategories([]);
    setLogoPreviewError(false);
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 backdrop-blur-md bg-black/20 flex items-center justify-center z-50 p-4 overflow-hidden"
      onClick={handleBackdropClick}
    >
      <div className="bg-gh-canvas-default border border-gh-border-default rounded-lg max-w-3xl w-full p-8 shadow-2xl min-h-[85vh] max-h-[98vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gh-fg-default">
            {mode === 'edit' ? t('addTool.editTitle') : t('addTool.title')}
          </h2>
          <button
            onClick={onClose}
            className="text-gh-fg-muted hover:text-gh-fg-default transition-colors p-1"
            aria-label="Close modal"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gh-fg-default mb-1">
                {t('addTool.name')} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-gh-canvas-subtle border border-gh-border-default rounded text-gh-fg-default placeholder:text-gh-fg-default/60 focus:outline-none focus:border-gh-accent-emphasis"
                placeholder={t('addTool.namePlaceholder')}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gh-fg-default mb-1">
                {t('addTool.url')} <span className="text-red-500">*</span>
              </label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full px-3 py-2 bg-gh-canvas-subtle border border-gh-border-default rounded text-gh-fg-default placeholder:text-gh-fg-default/60 focus:outline-none focus:border-gh-accent-emphasis transition-colors"
                placeholder={t('addTool.urlPlaceholder')}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gh-fg-default mb-1">
                {t('addTool.logoUrl')}
                <span className="text-xs text-gh-fg-muted ml-2 font-normal">{t('addTool.logoUrlOptional')}</span>
              </label>
              <input
                type="url"
                value={logoUrl}
                onChange={(e) => {
                  setLogoUrl(e.target.value);
                  setLogoPreviewError(false);
                }}
                className="w-full px-3 py-2 bg-gh-canvas-subtle border border-gh-border-default rounded text-gh-fg-default placeholder:text-gh-fg-default/60 focus:outline-none focus:border-gh-accent-emphasis transition-colors"
                placeholder={t('addTool.logoUrlPlaceholder')}
              />
              <p className="text-xs text-gh-fg-muted mt-1">
                {t('addTool.logoUrlHelper')}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gh-fg-default mb-1">
                {t('addTool.description')}
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 bg-gh-canvas-subtle border border-gh-border-default rounded text-gh-fg-default placeholder:text-gh-fg-default/60 focus:outline-none focus:border-gh-accent-emphasis resize-none"
                placeholder={t('addTool.descriptionPlaceholder')}
                rows={3}
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-5">
            {/* Logo Preview */}
            <div>
              <label className="block text-sm font-medium text-gh-fg-default mb-1">
                Logo Preview
              </label>
              <div className="w-32 h-32 flex items-center justify-center bg-gh-canvas-subtle border-2 border-dashed border-gh-border-default rounded-lg overflow-hidden">
                {logoUrl && !logoPreviewError ? (
                  <img
                    src={logoUrl}
                    alt="Logo preview"
                    className="w-full h-full object-contain p-2"
                    onError={() => setLogoPreviewError(true)}
                  />
                ) : (
                  <div className="text-center p-4">
                    <svg className="w-12 h-12 mx-auto text-gh-fg-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-xs text-gh-fg-muted mt-2">No logo</p>
                  </div>
                )}
              </div>
            </div>

            {/* Categories */}
            <MultiSelect
              label={t('addTool.categories')}
              options={availableCategories}
              selected={selectedCategories}
              onChange={setSelectedCategories}
              displayTransform={displayCategory}
              helperText={t('addTool.categoriesHelper')}
            />
          </div>

          {/* Buttons span full width */}
          <div className="md:col-span-2 flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gh-canvas-subtle border border-gh-border-default text-gh-fg-default rounded hover:bg-gh-canvas-inset transition-colors"
            >
              {t('addTool.cancel')}
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-gh-accent-emphasis text-white rounded hover:bg-gh-accent-fg transition-colors"
            >
              {mode === 'edit' ? t('addTool.save') : t('addTool.add')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
