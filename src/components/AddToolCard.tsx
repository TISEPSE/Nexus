import { useTranslation } from 'react-i18next';

interface AddToolCardProps {
  onClick: () => void;
}

export function AddToolCard({ onClick }: AddToolCardProps) {
  const { t } = useTranslation();
  return (
    <button
      onClick={onClick}
      className="group relative bg-gh-canvas-subtle hover:bg-gh-canvas-default border-2 border-dashed border-gh-border-default hover:border-gh-accent-fg hover:shadow-md rounded-lg p-3 sm:p-4 transition-all duration-100 aspect-[0.7] sm:aspect-auto sm:h-[200px] md:h-[220px] flex items-center justify-center cursor-pointer"
    >
      <div className="flex flex-col items-center gap-2">
        <div className="text-4xl text-gh-fg-muted group-hover:text-gh-accent-fg transition-colors">
          +
        </div>
        <span className="text-xs text-gh-fg-muted group-hover:text-gh-accent-fg transition-colors">
          {t('addTool.addTool')}
        </span>
      </div>
    </button>
  );
}
