import { ReactNode } from 'react';

interface SettingsSectionProps {
  id?: string;
  title: string;
  description?: string;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
}

/**
 * Reusable Settings Section Component
 *
 * DESIGN RATIONALE:
 * - Card-based layout for clear visual hierarchy
 * - Icon + title for quick section identification
 * - Optional description for context
 * - Consistent spacing and styling
 * - Responsive design
 */
export function SettingsSection({
  id,
  title,
  description,
  icon,
  children,
  className = '',
}: SettingsSectionProps) {
  return (
    <section
      id={id}
      className={`bg-gh-canvas-subtle border border-gh-border-default rounded-lg p-4 sm:p-6 ${className}`}
    >
      {/* Section Header */}
      <div className="mb-4 pb-3 border-b border-gh-border-muted">
        <div className="flex items-start gap-3">
          {icon && (
            <div className="flex-shrink-0 mt-0.5 text-gh-accent-fg">
              {icon}
            </div>
          )}
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gh-fg-default">
              {title}
            </h3>
            {description && (
              <p className="mt-1 text-base text-gh-fg-muted">
                {description}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Section Content */}
      <div className="space-y-4">
        {children}
      </div>
    </section>
  );
}

interface SettingItemProps {
  label: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

/**
 * Individual Setting Item within a section
 */
export function SettingItem({
  label,
  description,
  children,
  className = '',
}: SettingItemProps) {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 ${className}`}>
      <div className="flex-1">
        <label className="block text-base font-medium text-gh-fg-default">
          {label}
        </label>
        {description && (
          <p className="mt-0.5 text-sm text-gh-fg-muted">
            {description}
          </p>
        )}
      </div>
      <div className="flex-shrink-0">
        {children}
      </div>
    </div>
  );
}

interface SettingButtonProps {
  onClick: () => void;
  variant?: 'primary' | 'danger' | 'secondary';
  disabled?: boolean;
  children: ReactNode;
  icon?: ReactNode;
  className?: string;
}

/**
 * Styled button for settings actions
 */
export function SettingButton({
  onClick,
  variant = 'secondary',
  disabled = false,
  children,
  icon,
  className = '',
}: SettingButtonProps) {
  const variantClasses = {
    primary: 'bg-gh-accent-emphasis text-white hover:bg-gh-accent-emphasis/90 border-transparent',
    danger: 'bg-gh-danger-emphasis text-white hover:bg-gh-danger-emphasis/90 border-transparent',
    secondary: 'bg-gh-canvas-subtle text-gh-fg-default hover:bg-gh-canvas-inset border-gh-border-default',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        inline-flex items-center justify-center gap-2
        px-4 py-2 rounded-md
        text-base font-medium
        border
        transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-gh-accent-fg focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variantClasses[variant]}
        ${className}
      `}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{children}</span>
    </button>
  );
}

interface SettingToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

/**
 * Toggle switch for settings
 */
export function SettingToggle({
  checked,
  onChange,
  disabled = false,
}: SettingToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`
        relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent
        transition-colors duration-200 ease-in-out
        focus:outline-none focus:ring-2 focus:ring-gh-accent-fg focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        ${checked ? 'bg-gh-accent-emphasis' : 'bg-gh-border-muted'}
      `}
    >
      <span
        aria-hidden="true"
        className={`
          pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0
          transition duration-200 ease-in-out
          ${checked ? 'translate-x-5' : 'translate-x-0'}
        `}
      />
    </button>
  );
}

interface SettingSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  disabled?: boolean;
}

/**
 * Select dropdown for settings
 */
export function SettingSelect({
  value,
  onChange,
  options,
  disabled = false,
}: SettingSelectProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className={`
        block w-full sm:w-auto
        px-3 py-2 rounded-md
        text-base
        bg-gh-canvas-default
        border border-gh-border-default
        text-gh-fg-default
        focus:outline-none focus:ring-2 focus:ring-gh-accent-fg focus:border-transparent
        disabled:opacity-50 disabled:cursor-not-allowed
        transition-all duration-200
      `}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
