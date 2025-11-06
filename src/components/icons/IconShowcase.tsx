/**
 * Icon Showcase Component
 *
 * Composant de développement pour visualiser toutes les icônes disponibles.
 * Utile pour le design et les tests visuels.
 *
 * Usage :
 * Importer ce composant dans une page de test ou Settings pour voir toutes les icônes.
 */

import React from 'react';
import {
  SummarizeIcon,
  TranslateIcon,
  TranslateFrenchIcon,
  SpellCheckIcon,
  LightBulbIcon,
  CodeReviewIcon,
  SparklesIcon,
  BookOpenIcon,
  BookStackIcon,
  BugIcon,
  PhotographIcon,
  ColorSwatchIcon,
  DocumentTextIcon,
  ExclamationIcon,
  WandIcon,
  PinIcon,
  DocumentIcon,
  CodeIcon,
  GlobeIcon,
  ImageIcon,
  LinkIcon,
  CameraIcon,
  ClipboardIcon,
} from './TemplateIcons';

interface IconDisplayProps {
  icon: React.ReactNode;
  name: string;
  description: string;
}

function IconDisplay({ icon, name, description }: IconDisplayProps) {
  return (
    <div className="flex flex-col items-center p-4 bg-gh-canvas-subtle border border-gh-border-default rounded-lg hover:bg-gh-canvas-inset transition-colors">
      <div className="text-gh-accent-fg mb-2">{icon}</div>
      <div className="text-sm font-medium text-gh-fg-default text-center mb-1">
        {name}
      </div>
      <div className="text-xs text-gh-fg-muted text-center">{description}</div>
    </div>
  );
}

export function IconShowcase() {
  const templateIcons = [
    { icon: <SummarizeIcon className="w-8 h-8" />, name: 'Summarize', description: 'Résumer du texte' },
    { icon: <TranslateIcon className="w-8 h-8" />, name: 'Translate', description: 'Traduire en anglais' },
    { icon: <TranslateFrenchIcon className="w-8 h-8" />, name: 'Translate FR', description: 'Traduire en français' },
    { icon: <SpellCheckIcon className="w-8 h-8" />, name: 'Spell Check', description: 'Corriger orthographe' },
    { icon: <LightBulbIcon className="w-8 h-8" />, name: 'Light Bulb', description: 'Expliquer simplement' },
    { icon: <CodeReviewIcon className="w-8 h-8" />, name: 'Code Review', description: 'Analyser le code' },
    { icon: <SparklesIcon className="w-8 h-8" />, name: 'Sparkles', description: 'Améliorer le code' },
    { icon: <BookOpenIcon className="w-8 h-8" />, name: 'Book Open', description: 'Expliquer le code' },
    { icon: <BookStackIcon className="w-8 h-8" />, name: 'Book Stack', description: 'Documenter le code' },
    { icon: <BugIcon className="w-8 h-8" />, name: 'Bug', description: 'Corriger un bug' },
    { icon: <PhotographIcon className="w-8 h-8" />, name: 'Photograph', description: 'Décrire une image' },
    { icon: <ColorSwatchIcon className="w-8 h-8" />, name: 'Color Swatch', description: 'Analyser l\'UI' },
    { icon: <DocumentTextIcon className="w-8 h-8" />, name: 'Document Text', description: 'Extraire le texte' },
    { icon: <ExclamationIcon className="w-8 h-8" />, name: 'Exclamation', description: 'Débugger une erreur' },
    { icon: <WandIcon className="w-8 h-8" />, name: 'Wand', description: 'Prompt personnalisé' },
  ];

  const categoryIcons = [
    { icon: <PinIcon className="w-8 h-8" />, name: 'Pin', description: 'Catégorie Tous' },
    { icon: <DocumentIcon className="w-8 h-8" />, name: 'Document', description: 'Catégorie Texte' },
    { icon: <CodeIcon className="w-8 h-8" />, name: 'Code', description: 'Catégorie Code' },
    { icon: <GlobeIcon className="w-8 h-8" />, name: 'Globe', description: 'Catégorie Traduction' },
    { icon: <ImageIcon className="w-8 h-8" />, name: 'Image', description: 'Catégorie Image' },
  ];

  const clipboardIcons = [
    { icon: <LinkIcon className="w-8 h-8" />, name: 'Link', description: 'Type URL' },
    { icon: <CameraIcon className="w-8 h-8" />, name: 'Camera', description: 'Type Screenshot' },
    { icon: <ClipboardIcon className="w-8 h-8" />, name: 'Clipboard', description: 'Type générique' },
  ];

  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gh-fg-default mb-2">
          Icon Showcase
        </h1>
        <p className="text-gh-fg-muted">
          Visualisation de toutes les icônes SVG disponibles dans Nexus
        </p>
      </div>

      {/* Template Icons */}
      <section>
        <h2 className="text-xl font-semibold text-gh-fg-default mb-4">
          Templates de prompts
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {templateIcons.map((item) => (
            <IconDisplay key={item.name} {...item} />
          ))}
        </div>
      </section>

      {/* Category Icons */}
      <section>
        <h2 className="text-xl font-semibold text-gh-fg-default mb-4">
          Catégories
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {categoryIcons.map((item) => (
            <IconDisplay key={item.name} {...item} />
          ))}
        </div>
      </section>

      {/* Clipboard Icons */}
      <section>
        <h2 className="text-xl font-semibold text-gh-fg-default mb-4">
          Types de Clipboard
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {clipboardIcons.map((item) => (
            <IconDisplay key={item.name} {...item} />
          ))}
        </div>
      </section>

      {/* Size Examples */}
      <section>
        <h2 className="text-xl font-semibold text-gh-fg-default mb-4">
          Exemples de tailles
        </h2>
        <div className="flex items-center gap-6 p-4 bg-gh-canvas-subtle rounded-lg">
          <div className="text-center">
            <SparklesIcon className="w-4 h-4 text-gh-accent-fg mx-auto mb-1" />
            <div className="text-xs text-gh-fg-muted">w-4 h-4</div>
          </div>
          <div className="text-center">
            <SparklesIcon className="w-5 h-5 text-gh-accent-fg mx-auto mb-1" />
            <div className="text-xs text-gh-fg-muted">w-5 h-5</div>
          </div>
          <div className="text-center">
            <SparklesIcon className="w-6 h-6 text-gh-accent-fg mx-auto mb-1" />
            <div className="text-xs text-gh-fg-muted">w-6 h-6</div>
          </div>
          <div className="text-center">
            <SparklesIcon className="w-8 h-8 text-gh-accent-fg mx-auto mb-1" />
            <div className="text-xs text-gh-fg-muted">w-8 h-8</div>
          </div>
          <div className="text-center">
            <SparklesIcon className="w-12 h-12 text-gh-accent-fg mx-auto mb-1" />
            <div className="text-xs text-gh-fg-muted">w-12 h-12</div>
          </div>
          <div className="text-center">
            <SparklesIcon className="w-16 h-16 text-gh-accent-fg mx-auto mb-1" />
            <div className="text-xs text-gh-fg-muted">w-16 h-16</div>
          </div>
        </div>
      </section>

      {/* Color Examples */}
      <section>
        <h2 className="text-xl font-semibold text-gh-fg-default mb-4">
          Exemples de couleurs (GitHub Primer)
        </h2>
        <div className="flex flex-wrap gap-6 p-4 bg-gh-canvas-subtle rounded-lg">
          <div className="text-center">
            <CodeIcon className="w-8 h-8 text-gh-accent-fg mx-auto mb-1" />
            <div className="text-xs text-gh-fg-muted">accent-fg</div>
          </div>
          <div className="text-center">
            <BugIcon className="w-8 h-8 text-gh-danger-fg mx-auto mb-1" />
            <div className="text-xs text-gh-fg-muted">danger-fg</div>
          </div>
          <div className="text-center">
            <SparklesIcon className="w-8 h-8 text-gh-success-fg mx-auto mb-1" />
            <div className="text-xs text-gh-fg-muted">success-fg</div>
          </div>
          <div className="text-center">
            <LightBulbIcon className="w-8 h-8 text-gh-fg-default mx-auto mb-1" />
            <div className="text-xs text-gh-fg-muted">fg-default</div>
          </div>
          <div className="text-center">
            <DocumentIcon className="w-8 h-8 text-gh-fg-muted mx-auto mb-1" />
            <div className="text-xs text-gh-fg-muted">fg-muted</div>
          </div>
        </div>
      </section>

      {/* Usage Example */}
      <section>
        <h2 className="text-xl font-semibold text-gh-fg-default mb-4">
          Exemple d'utilisation
        </h2>
        <div className="bg-gh-canvas-subtle border border-gh-border-default rounded-lg p-4">
          <pre className="text-sm text-gh-fg-default overflow-x-auto">
            <code>{`import { SparklesIcon } from '@/components/icons/TemplateIcons';

// Basique
<SparklesIcon className="w-5 h-5" />

// Avec couleur
<SparklesIcon className="w-5 h-5 text-gh-accent-fg" />

// Dans un bouton
<button className="flex items-center gap-2">
  <SparklesIcon className="w-4 h-4" />
  <span>Améliorer le code</span>
</button>`}</code>
          </pre>
        </div>
      </section>
    </div>
  );
}
