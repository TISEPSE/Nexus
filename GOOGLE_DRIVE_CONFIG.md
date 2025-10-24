# Configuration Google Drive OAuth

Pour activer l'intégration Google Drive, vous devez configurer les identifiants OAuth.

## Étape 1: Créer un projet Google Cloud

1. Allez sur [Google Cloud Console](https://console.cloud.google.com/)
2. Créez un nouveau projet ou sélectionnez un projet existant
3. Activez l'API Google Drive

## Étape 2: Créer des identifiants OAuth 2.0

1. Allez dans **APIs & Services** > **Credentials**
2. Cliquez sur **Create Credentials** > **OAuth client ID**
3. Choisissez **Desktop app** comme type d'application
4. Configurez l'URI de redirection: `http://localhost:3000/oauth/callback`
5. Copiez votre **Client ID** et **Client Secret**

## Étape 3: Configurer les variables d'environnement

### Option 1: Fichier .env (Recommandé pour le développement)

1. Copiez le fichier `.env.example` vers `.env`:
   ```bash
   cp .env.example .env
   ```

2. Éditez `.env` et ajoutez vos identifiants:
   ```
   GOOGLE_CLIENT_ID=votre-client-id.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=votre-client-secret
   ```

### Option 2: Variables d'environnement système

Exportez les variables avant de compiler:

```bash
export GOOGLE_CLIENT_ID="votre-client-id.apps.googleusercontent.com"
export GOOGLE_CLIENT_SECRET="votre-client-secret"
```

## Étape 4: Compiler et exécuter

```bash
npm run tauri dev
```

## Sécurité

⚠️ **IMPORTANT**: Ne commitez JAMAIS vos identifiants OAuth dans Git!

- Le fichier `.env` est déjà dans `.gitignore`
- Utilisez `.env.example` comme template sans vos vrais identifiants
- Pour la production, utilisez des variables d'environnement sécurisées

## Dépannage

Si vous voyez "Google Drive OAuth is not configured", vérifiez que:
1. Vos identifiants sont correctement définis dans `.env`
2. Vous avez recompilé l'application après avoir modifié `.env`
3. Les variables ne contiennent pas `YOUR_CLIENT_ID_HERE`
