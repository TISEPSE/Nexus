# Nexus

Lanceur desktop pour accéder rapidement à 50+ outils d'IA.

**Version web :** [https://tisepse.github.io/IA_Website/](https://tisepse.github.io/IA_Website/)

## Installation

### Linux (Ubuntu/Debian)

Installation automatique :

```bash
wget -O - https://raw.githubusercontent.com/TISEPSE/Nexus/main/scripts/install.sh | bash
```

Cette commande installe toutes les dépendances, compile et installe l'application.

## Mise à jour

Pour mettre à jour Nexus vers la dernière version :

```bash
sudo dpkg -r nexus 2>/dev/null; wget -O - https://raw.githubusercontent.com/TISEPSE/Nexus/main/scripts/install.sh | bash
```

## Utilisation

### Lancer en mode développement
```bash
npm run tauri dev
```

### Compiler l'application
```bash
npm run tauri build
```

## Fonctionnalités

- 🔍 Recherche par nom, description ou catégorie
- ⭐ Système de favoris
- 🎨 Thème GitHub Dark
- ⚡ Ultra rapide et léger
- 📱 50+ outils d'IA : ChatGPT, Claude, Midjourney, Runway, GitHub Copilot, etc.

## Développement

### Ajouter un nouvel outil

Éditez `src/data/aiData.ts` :

```typescript
{
  id: 'mon-outil',
  name: 'Mon Outil IA',
  description: 'Description de l\'outil',
  url: 'https://example.com',
  category: ['AI', 'Chat'],
  logo: ['https://example.com/logo.png'],
  domain: 'example.com',
  tags: ['ai', 'chat']
}
```

## Technologies

- **Tauri** - Framework desktop
- **React** - Interface utilisateur
- **TypeScript** - Typage statique
- **Tailwind CSS** - Styles

## Licence

MIT - Libre d'utilisation pour projets personnels ou commerciaux.
