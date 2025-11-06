# Template Icons System

## Vue d'ensemble

Système d'icônes SVG centralisé pour les templates de prompts et les catégories dans Nexus. Conçu pour être cohérent avec le **GitHub Primer Design System** et compatible avec le mode dark/light.

## Caractéristiques

- **Style Heroicons Outline** : Icônes en stroke uniquement (pas de fill)
- **Support Dark/Light Mode** : Utilise `currentColor` pour s'adapter automatiquement
- **Tailles flexibles** : Classes Tailwind pour contrôler la taille (w-4 h-4, w-5 h-5, etc.)
- **Accessible** : SVG sémantiques avec viewBox et strokeWidth optimisés
- **Type-safe** : TypeScript pour tous les composants

## Structure

```
src/components/icons/
├── TemplateIcons.tsx    # Toutes les icônes SVG
├── index.ts             # Point d'entrée pour les exports
└── README.md           # Cette documentation
```

## Usage

### Import

```tsx
import { TemplateIconRenderer } from '@/components/icons/TemplateIcons';
// ou
import { TemplateIconRenderer } from '@/components/icons';
```

### Utilisation du renderer universel

```tsx
<TemplateIconRenderer iconType="summarize" className="w-5 h-5" />
<TemplateIconRenderer iconType="code" className="w-6 h-6 text-blue-500" />
```

### Utilisation d'icônes individuelles

```tsx
import { SummarizeIcon, CodeIcon } from '@/components/icons/TemplateIcons';

<SummarizeIcon className="w-5 h-5" />
<CodeIcon className="w-6 h-6 text-gh-accent-fg" />
```

## Icônes disponibles

### Templates

| Icon Type | Nom du composant | Usage |
|-----------|------------------|-------|
| `summarize` | `SummarizeIcon` | Résumer du texte |
| `translate` | `TranslateIcon` | Traduire en anglais |
| `translate-french` | `TranslateFrenchIcon` | Traduire en français |
| `spell-check` | `SpellCheckIcon` | Corriger l'orthographe |
| `lightbulb` | `LightBulbIcon` | Expliquer simplement |
| `code-review` | `CodeReviewIcon` | Analyser le code |
| `sparkles` | `SparklesIcon` | Améliorer le code |
| `book-open` | `BookOpenIcon` | Expliquer le code |
| `book-stack` | `BookStackIcon` | Documenter le code |
| `bug` | `BugIcon` | Corriger un bug |
| `photograph` | `PhotographIcon` | Décrire une image |
| `color-swatch` | `ColorSwatchIcon` | Analyser l'UI |
| `document-text` | `DocumentTextIcon` | Extraire le texte |
| `exclamation` | `ExclamationIcon` | Débugger une erreur |
| `wand` | `WandIcon` | Prompt personnalisé |

### Catégories

| Icon Type | Nom du composant | Usage |
|-----------|------------------|-------|
| `pin` | `PinIcon` | Catégorie "Tous" |
| `document` | `DocumentIcon` | Catégorie "Texte" |
| `code` | `CodeIcon` | Catégorie "Code" |
| `globe` | `GlobeIcon` | Catégorie "Traduction" |
| `image` | `ImageIcon` | Catégorie "Image" |

### Types de Clipboard

| Icon Type | Nom du composant | Usage |
|-----------|------------------|-------|
| `link` | `LinkIcon` | Type URL |
| `camera` | `CameraIcon` | Type Image/Screenshot |
| `clipboard` | `ClipboardIcon` | Type générique |

## Design Guidelines

### Tailles recommandées

- **Boutons de catégorie** : `w-4 h-4`
- **Cards de templates** : `w-6 h-6`
- **Icons dans le texte** : `w-5 h-5`
- **Empty states** : `w-16 h-16`

### Couleurs

Les icônes utilisent `currentColor` et héritent automatiquement de la couleur du texte. Pour personnaliser :

```tsx
// Utiliser les classes Tailwind
<TemplateIconRenderer iconType="code" className="w-5 h-5 text-blue-500" />

// Utiliser les tokens GitHub Primer
<TemplateIconRenderer iconType="bug" className="w-5 h-5 text-gh-danger-fg" />
<TemplateIconRenderer iconType="sparkles" className="w-5 h-5 text-gh-accent-fg" />
```

### Classes Primer recommandées

- `text-gh-accent-fg` : Pour les icônes accentuées
- `text-gh-fg-default` : Pour les icônes normales
- `text-gh-fg-muted` : Pour les icônes secondaires
- `text-gh-danger-fg` : Pour les erreurs/avertissements
- `text-gh-success-fg` : Pour les succès

## Ajouter une nouvelle icône

1. **Créer le composant dans TemplateIcons.tsx** :

```tsx
export function MyNewIcon({ className = "w-5 h-5" }: IconProps) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="..." />
    </svg>
  );
}
```

2. **Ajouter au renderer** dans `TemplateIconRenderer` :

```tsx
case 'my-new-icon':
  return <MyNewIcon className={className} />;
```

3. **Utiliser** :

```tsx
<TemplateIconRenderer iconType="my-new-icon" className="w-5 h-5" />
```

## Sources d'icônes

- **Heroicons** : https://heroicons.com/ (icônes outline principalement)
- **GitHub Primer Icons** : https://primer.style/foundations/icons (pour l'inspiration)
- **Lucide Icons** : https://lucide.dev/ (alternative compatible)

## Bonnes pratiques

1. **Toujours utiliser `currentColor`** pour la compatibilité dark/light
2. **StrokeWidth de 2** pour la cohérence avec Heroicons
3. **ViewBox 0 0 24 24** comme standard
4. **StrokeLinecap et StrokeLinejoin à "round"** pour un look moderne
5. **Pas de `fill`** sauf exceptions (style outline uniquement)

## Migration depuis les émojis

### Avant
```tsx
<span className="text-2xl">📝</span>
```

### Après
```tsx
<TemplateIconRenderer iconType="document" className="w-6 h-6" />
```

## Performance

- Les icônes sont rendues en JSX (pas d'images externes)
- Pas de requêtes HTTP additionnelles
- Tree-shaking automatique avec les imports nommés
- Minification optimale avec le build Vite

## Accessibilité

Les icônes doivent toujours être accompagnées de texte ou avoir un `aria-label` :

```tsx
// Bon : icône + texte
<button>
  <TemplateIconRenderer iconType="code" className="w-4 h-4" />
  <span>Analyser le code</span>
</button>

// Bon : icône seule avec aria-label
<button aria-label="Analyser le code">
  <TemplateIconRenderer iconType="code" className="w-5 h-5" />
</button>
```
