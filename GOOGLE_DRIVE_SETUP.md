# Configuration Google Drive OAuth

Ce guide explique comment configurer l'intégration Google Drive pour Nexus.

## Prérequis

1. Un compte Google
2. Accès à [Google Cloud Console](https://console.cloud.google.com/)

## Étapes de configuration

### 1. Créer un projet Google Cloud

1. Aller sur https://console.cloud.google.com/
2. Cliquer sur **"Create Project"** ou sélectionner un projet existant
3. Donner un nom au projet (ex: "Nexus App")
4. Cliquer sur **"Create"**

### 2. Activer l'API Google Drive

1. Dans votre projet, aller dans **"APIs & Services"** > **"Library"**
2. Rechercher **"Google Drive API"**
3. Cliquer sur **"Enable"**

### 3. Créer des identifiants OAuth 2.0

1. Aller dans **"APIs & Services"** > **"Credentials"**
2. Cliquer sur **"+ CREATE CREDENTIALS"** > **"OAuth client ID"**
3. Si demandé, configurer l'écran de consentement OAuth :
   - Type d'application : **Desktop app** ou **Web application**
   - Nom de l'application : **Nexus**
   - Ajouter les scopes : `https://www.googleapis.com/auth/drive.readonly`
4. Choisir le type d'application :
   - **Application type** : Desktop app (ou Web application)
   - **Name** : Nexus Desktop Client
5. Cliquer sur **"Create"**
6. **Copier le Client ID et Client Secret** (gardez-les en sécurité !)

### 4. Configurer les URI de redirection

1. Dans les paramètres de votre OAuth Client ID
2. Ajouter l'URI de redirection autorisée :
   ```
   http://localhost:3000/oauth/callback
   ```
3. Sauvegarder

### 5. Configurer l'application

#### Option A : Fichier de configuration (RECOMMANDÉ)

Créer un fichier `.env` à la racine du projet :

```env
GOOGLE_CLIENT_ID=votre_client_id_ici.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=votre_client_secret_ici
GOOGLE_REDIRECT_URI=http://localhost:3000/oauth/callback
```

#### Option B : Modification directe du code

Modifier le fichier `src-tauri/src/google_drive.rs` :

```rust
const CLIENT_ID: &str = "VOTRE_CLIENT_ID.apps.googleusercontent.com";
const CLIENT_SECRET: &str = "VOTRE_CLIENT_SECRET";
const REDIRECT_URI: &str = "http://localhost:3000/oauth/callback";
```

⚠️ **ATTENTION** : Ne jamais commiter vos vraies credentials dans Git !

### 6. Compiler et tester

```bash
# Installer les dépendances
npm install

# Compiler l'application
npm run tauri build

# Ou lancer en mode dev
npm run tauri dev
```

## Utilisation

1. Cliquer sur le bouton **"Google Drive"** dans l'en-tête
2. Cliquer sur **"Sign in with Google"**
3. Se connecter avec votre compte Google dans le navigateur
4. Autoriser l'accès à Google Drive
5. Vos fichiers apparaîtront dans le modal

## Sécurité

### ✅ Bonnes pratiques

- Utiliser des variables d'environnement (`.env`)
- Ne jamais commiter les credentials
- Ajouter `.env` au `.gitignore`
- Utiliser OAuth avec des scopes minimaux (read-only)

### ❌ À éviter

- Hardcoder les credentials dans le code
- Partager les credentials publiquement
- Donner des permissions trop larges

## Dépannage

### Erreur "OAuth not configured"

Les credentials ne sont pas configurés. Suivez les étapes ci-dessus.

### Erreur "Invalid redirect URI"

L'URI de redirection dans Google Cloud Console ne correspond pas à celle dans le code.

### Erreur "Access denied"

Vérifiez que vous avez bien autorisé l'application et que les scopes sont corrects.

## Mode démo

Pour tester sans configuration OAuth, l'application utilise des données fictives.
Pour une vraie intégration, suivez les étapes ci-dessus.

## Ressources

- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Google Drive API Documentation](https://developers.google.com/drive/api/guides/about-sdk)
- [Tauri Documentation](https://tauri.app/)

## Support

Pour toute question, ouvrez une issue sur GitHub.
