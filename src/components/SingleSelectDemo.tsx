import { useState } from 'react';
import { SingleSelect } from './SingleSelect';
import { SingleSelectDropdown } from './SingleSelectDropdown';

/**
 * Visual Testing Component for SingleSelect Variants
 *
 * USAGE:
 * 1. Import this component in your App.tsx temporarily
 * 2. Render <SingleSelectDemo /> to test both variants side-by-side
 * 3. Test all interactions: hover, click, keyboard, selection
 * 4. Remove when done testing
 *
 * This is NOT for production - it's a design testing tool.
 */
export function SingleSelectDemo() {
  const [selectedInline, setSelectedInline] = useState('AI');
  const [selectedDropdown, setSelectedDropdown] = useState('Code');

  const categories = [
    'AI', 'Chat', 'Code', 'Image', 'Video', 'Audio',
    'Writing', 'Design', 'Documentation', 'Research',
    'Productivity', 'Translation', '3D', 'Data',
    'Multi-tool', 'Security', 'Privacy'
  ];

  const options = categories.map(cat => ({
    value: cat,
    label: cat.toUpperCase() === 'AI' ? 'Intelligence Artificielle' : cat
  }));

  return (
    <div className="min-h-screen bg-gh-canvas-default p-8">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gh-fg-default mb-2">
            SingleSelect Component Testing
          </h1>
          <p className="text-gh-fg-muted">
            Visual comparison of both implementation variants
          </p>
        </div>

        {/* Side-by-side comparison */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Option A: Inline Grid */}
          <div className="space-y-4">
            <div className="bg-gh-canvas-subtle border border-gh-border-default rounded-lg p-6">
              <div className="mb-4 pb-4 border-b border-gh-border-muted">
                <h2 className="text-xl font-semibold text-gh-fg-default mb-1">
                  Option A: Inline Grid
                </h2>
                <p className="text-sm text-gh-fg-muted">
                  Current implementation - Stable, no dropdown
                </p>
              </div>

              <SingleSelect
                label="Catégorie"
                options={options}
                selected={selectedInline}
                onChange={setSelectedInline}
                required
                helperText="Sélectionnez une catégorie pour cet outil"
              />

              <div className="mt-4 p-3 bg-gh-accent-subtle border border-gh-accent-emphasis/30 rounded text-sm">
                <strong className="text-gh-accent-fg">Selected:</strong>{' '}
                <code className="text-gh-fg-default">{selectedInline}</code>
              </div>
            </div>

            {/* Features checklist */}
            <div className="bg-gh-canvas-default border border-gh-border-default rounded-lg p-4">
              <h3 className="font-medium text-gh-fg-default mb-3">Features</h3>
              <ul className="space-y-2 text-sm text-gh-fg-muted">
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">✓</span>
                  <span>Responsive grid (2 cols mobile, 3 cols desktop)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">✓</span>
                  <span>Hover animations on radio buttons</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">✓</span>
                  <span>Scale effect on selected item</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">✓</span>
                  <span>Checkmark animation on selection</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">✓</span>
                  <span>Keyboard navigation (arrows)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">✓</span>
                  <span>Tooltip on truncated text</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">✓</span>
                  <span>No z-index conflicts</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Option B: Dropdown */}
          <div className="space-y-4">
            <div className="bg-gh-canvas-subtle border border-gh-border-default rounded-lg p-6">
              <div className="mb-4 pb-4 border-b border-gh-border-muted">
                <h2 className="text-xl font-semibold text-gh-fg-default mb-1">
                  Option B: Custom Dropdown
                </h2>
                <p className="text-sm text-gh-fg-muted">
                  Alternative - Compact, traditional pattern
                </p>
              </div>

              <SingleSelectDropdown
                label="Catégorie"
                options={options}
                selected={selectedDropdown}
                onChange={setSelectedDropdown}
                placeholder="Choisir une catégorie..."
                required
                helperText="Sélectionnez une catégorie pour cet outil"
              />

              <div className="mt-4 p-3 bg-gh-accent-subtle border border-gh-accent-emphasis/30 rounded text-sm">
                <strong className="text-gh-accent-fg">Selected:</strong>{' '}
                <code className="text-gh-fg-default">{selectedDropdown}</code>
              </div>
            </div>

            {/* Features checklist */}
            <div className="bg-gh-canvas-default border border-gh-border-default rounded-lg p-4">
              <h3 className="font-medium text-gh-fg-default mb-3">Features</h3>
              <ul className="space-y-2 text-sm text-gh-fg-muted">
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">✓</span>
                  <span>Compact single-line when closed</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">✓</span>
                  <span>Type-ahead search (type to filter)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">✓</span>
                  <span>Smooth open/close animation</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">✓</span>
                  <span>Click-outside to close</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">✓</span>
                  <span>Keyboard navigation (arrows, enter, esc)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">✓</span>
                  <span>Highlighted option on hover/keyboard</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">✓</span>
                  <span>Chevron rotation indicator</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Test instructions */}
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-yellow-200 mb-3">
            Testing Checklist
          </h3>
          <div className="grid md:grid-cols-2 gap-6 text-sm">
            <div>
              <h4 className="font-medium text-gh-fg-default mb-2">Visual Tests</h4>
              <ul className="space-y-1 text-gh-fg-muted">
                <li>□ Hover states work correctly</li>
                <li>□ Selection feedback is clear</li>
                <li>□ Animations are smooth (60fps)</li>
                <li>□ Colors match GitHub theme</li>
                <li>□ Spacing follows 8pt grid</li>
                <li>□ Touch targets are 44x44px min</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gh-fg-default mb-2">Interaction Tests</h4>
              <ul className="space-y-1 text-gh-fg-muted">
                <li>□ Mouse clicks select options</li>
                <li>□ Keyboard arrows navigate</li>
                <li>□ Enter/Space selects</li>
                <li>□ Focus rings visible</li>
                <li>□ Tooltips appear on hover</li>
                <li>□ Type-ahead works (dropdown only)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Responsive test */}
        <div className="bg-gh-canvas-subtle border border-gh-border-default rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gh-fg-default mb-4">
            Responsive Test
          </h3>
          <p className="text-sm text-gh-fg-muted mb-4">
            Resize your browser window to test mobile (2 cols) vs desktop (3 cols) for Option A
          </p>
          <div className="flex gap-4 flex-wrap text-xs text-gh-fg-muted">
            <div className="px-3 py-2 bg-gh-canvas-default border border-gh-border-default rounded">
              <span className="font-medium">Mobile:</span> &lt; 640px (2 cols)
            </div>
            <div className="px-3 py-2 bg-gh-canvas-default border border-gh-border-default rounded">
              <span className="font-medium">Desktop:</span> ≥ 640px (3 cols)
            </div>
          </div>
        </div>

        {/* Performance test */}
        <div className="bg-gh-canvas-default border border-gh-border-default rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gh-fg-default mb-4">
            Performance Stats
          </h3>
          <div className="grid md:grid-cols-2 gap-6 text-sm">
            <div>
              <h4 className="font-medium text-gh-fg-default mb-2">Option A (Inline Grid)</h4>
              <ul className="space-y-1 text-gh-fg-muted">
                <li>Initial render: {options.length} buttons</li>
                <li>Re-renders: On hover + selection only</li>
                <li>State variables: 2 (selected + hovered)</li>
                <li>Event listeners: 0 global</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gh-fg-default mb-2">Option B (Dropdown)</h4>
              <ul className="space-y-1 text-gh-fg-muted">
                <li>Initial render: 1 button + conditional menu</li>
                <li>Re-renders: On open/close/search/highlight</li>
                <li>State variables: 4 (selected + open + search + highlight)</li>
                <li>Event listeners: 1 global (click outside)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Recommendation */}
        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-green-200 mb-3">
            Recommendation
          </h3>
          <p className="text-gh-fg-muted mb-4">
            Based on your requirements ("ne bug pas" + modal context):
          </p>
          <div className="bg-green-500/20 border border-green-500/40 rounded-lg p-4">
            <p className="font-medium text-green-100 mb-2">
              ✓ Option A (Inline Grid) is RECOMMENDED
            </p>
            <ul className="text-sm text-gh-fg-muted space-y-1">
              <li>• More stable (no dropdown overflow issues)</li>
              <li>• Better mobile experience</li>
              <li>• Simpler state management</li>
              <li>• Consistent with MultiSelect pattern</li>
              <li>• Already implemented and tested</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-gh-fg-muted pt-8 border-t border-gh-border-muted">
          <p>
            This demo component should be removed from production builds.
            <br />
            It's for design testing and comparison purposes only.
          </p>
        </div>
      </div>
    </div>
  );
}
