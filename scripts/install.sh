#!/bin/bash

# Nexus - Installation automatique
# Usage: curl -fsSL https://raw.githubusercontent.com/TISEPSE/Nexus/main/scripts/install.sh | bash

set -e

# Couleurs
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Chemin d'installation
INSTALL_DIR="$HOME/Nexus"

echo -e "${BLUE}╔═══════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║         Installation de Nexus             ║${NC}"
echo -e "${BLUE}╚═══════════════════════════════════════════╝${NC}"
echo ""

# Vérifier si on est sur Linux
if [[ "$OSTYPE" != "linux-gnu"* ]]; then
    echo -e "${RED}Erreur: Ce script ne fonctionne que sur Linux.${NC}"
    exit 1
fi

# Vérifier si sudo est disponible
if ! command -v sudo &> /dev/null; then
    echo -e "${RED}Erreur: sudo n'est pas installé.${NC}"
    exit 1
fi

# Vérification des privilèges sudo au début
if ! sudo -n true 2>/dev/null; then
    echo -e "${YELLOW}⚠️  Ce script nécessite des privilèges sudo pour installer les dépendances.${NC}"
    echo -e "${YELLOW}Veuillez entrer votre mot de passe sudo si demandé.${NC}"
    sudo -v
fi

# Garder sudo actif pendant l'installation
while true; do sudo -n true; sleep 60; kill -0 "$$" || exit; done 2>/dev/null &

# Installer git si nécessaire
if ! command -v git &> /dev/null; then
    echo -e "${YELLOW}Installation de git...${NC}"
    sudo apt update && sudo apt install -y git
fi

# Installer curl si nécessaire
if ! command -v curl &> /dev/null; then
    echo -e "${YELLOW}Installation de curl...${NC}"
    sudo apt update && sudo apt install -y curl
fi

# Installer Rust
if ! command -v cargo &> /dev/null; then
    echo -e "${BLUE}Installation de Rust...${NC}"
    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
    source "$HOME/.cargo/env"
    rustup default stable
    echo -e "${GREEN}✓ Rust installé${NC}"
else
    echo -e "${GREEN}✓ Rust déjà installé${NC}"
    source "$HOME/.cargo/env" 2>/dev/null || true
fi

# Installer Node.js
if ! command -v node &> /dev/null; then
    echo -e "${BLUE}Installation de Node.js...${NC}"
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt install -y nodejs
    echo -e "${GREEN}✓ Node.js installé${NC}"
else
    NODE_VERSION=$(node -v)
    echo -e "${GREEN}✓ Node.js déjà installé ($NODE_VERSION)${NC}"
fi

# Installer les dépendances système
echo -e "${BLUE}Installation des dépendances système...${NC}"
sudo apt update
sudo apt install -y \
    libwebkit2gtk-4.1-dev \
    build-essential \
    wget \
    libssl-dev \
    libayatana-appindicator3-dev \
    librsvg2-dev
echo -e "${GREEN}✓ Dépendances système installées${NC}"

# Installer linuxdeploy si nécessaire
if ! command -v linuxdeploy &> /dev/null; then
    echo -e "${BLUE}Installation de linuxdeploy...${NC}"
    wget -q https://github.com/linuxdeploy/linuxdeploy/releases/download/continuous/linuxdeploy-x86_64.AppImage -O /tmp/linuxdeploy
    chmod +x /tmp/linuxdeploy
    sudo mv /tmp/linuxdeploy /usr/local/bin/linuxdeploy
    echo -e "${GREEN}✓ linuxdeploy installé${NC}"
else
    echo -e "${GREEN}✓ linuxdeploy déjà installé${NC}"
fi

# Cloner ou mettre à jour le dépôt
if [ -d "$INSTALL_DIR" ]; then
    echo -e "${YELLOW}Le dossier $INSTALL_DIR existe déjà.${NC}"
    echo -e "${YELLOW}Mise à jour du dépôt...${NC}"
    cd "$INSTALL_DIR"
    git pull origin main
else
    echo -e "${BLUE}Clonage du dépôt...${NC}"
    git clone https://github.com/TISEPSE/Nexus.git "$INSTALL_DIR"
    cd "$INSTALL_DIR"
fi

echo -e "${GREEN}✓ Code source téléchargé${NC}"

# Installer les dépendances npm
echo -e "${BLUE}Installation des dépendances npm...${NC}"
npm install
echo -e "${GREEN}✓ Dépendances npm installées${NC}"

# Compiler et installer l'application
echo -e "${BLUE}Compilation de l'application...${NC}"
echo -e "${YELLOW}(Cela peut prendre plusieurs minutes...)${NC}"

# Sourcer Rust et fixer les variables d'environnement
source "$HOME/.cargo/env"
unset LD_LIBRARY_PATH LD_PRELOAD GIO_MODULE_DIR GTK_PATH GTK_IM_MODULE_FILE LOCPATH
export LD_LIBRARY_PATH=/usr/lib/x86_64-linux-gnu:/lib/x86_64-linux-gnu
export GIO_MODULE_DIR=/usr/lib/x86_64-linux-gnu/gio/modules
export GTK_PATH=/usr/lib/x86_64-linux-gnu/gtk-3.0

npm run tauri build 2>&1 | grep -v "failed to run linuxdeploy" || true

# Chercher le package .deb
DEBFILE=$(find src-tauri/target/release/bundle/deb -name "*.deb" 2>/dev/null | head -n 1)

if [ -n "$DEBFILE" ]; then
    echo -e "${BLUE}Installation du package .deb...${NC}"
    sudo dpkg -i "$DEBFILE"
    echo -e "${GREEN}✓ Application installée${NC}"
else
    echo -e "${RED}Erreur: La compilation a échoué. Aucun package .deb trouvé.${NC}"
    exit 1
fi

# Créer l'alias Nexus
BASHRC="$HOME/.bashrc"
ZSHRC="$HOME/.zshrc"

# Détecter le shell et le nom du binaire
BINARY_NAME=$(basename "$DEBFILE" .deb | sed 's/_.*//g')

if [ -f "$BASHRC" ]; then
    if ! grep -q "alias Nexus=" "$BASHRC"; then
        echo -e "${BLUE}Ajout de l'alias Nexus dans ~/.bashrc...${NC}"
        echo "" >> "$BASHRC"
        echo "# Nexus alias" >> "$BASHRC"
        echo "alias Nexus='$BINARY_NAME'" >> "$BASHRC"
        echo -e "${GREEN}✓ Alias ajouté à ~/.bashrc${NC}"
    fi
fi

if [ -f "$ZSHRC" ]; then
    if ! grep -q "alias Nexus=" "$ZSHRC"; then
        echo -e "${BLUE}Ajout de l'alias Nexus dans ~/.zshrc...${NC}"
        echo "" >> "$ZSHRC"
        echo "# Nexus alias" >> "$ZSHRC"
        echo "alias Nexus='$BINARY_NAME'" >> "$ZSHRC"
        echo -e "${GREEN}✓ Alias ajouté à ~/.zshrc${NC}"
    fi
fi

echo ""
echo -e "${GREEN}╔═══════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║   Installation terminée avec succès ! ✓   ║${NC}"
echo -e "${GREEN}╚═══════════════════════════════════════════╝${NC}"
echo ""
echo -e "${BLUE}Pour lancer l'application :${NC}"
echo -e "  • Depuis le menu d'applications"
echo -e "  • Ou tapez: ${YELLOW}nexus${NC}"
echo -e "  ${YELLOW}(Redémarrez votre terminal ou tapez: source ~/.bashrc)${NC}"
echo ""
