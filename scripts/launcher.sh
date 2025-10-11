#!/bin/bash

# IA Launcher - All-in-One Script
# Usage: ./launcher.sh [install|dev|build|run]

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

# Fix snap library conflicts (Ubuntu)
fix_snap_env() {
    source "$HOME/.cargo/env" 2>/dev/null || true
    unset LD_LIBRARY_PATH LD_PRELOAD GIO_MODULE_DIR GTK_PATH GTK_IM_MODULE_FILE LOCPATH
    export LD_LIBRARY_PATH=/usr/lib/x86_64-linux-gnu:/lib/x86_64-linux-gnu
    export GIO_MODULE_DIR=/usr/lib/x86_64-linux-gnu/gio/modules
    export GTK_PATH=/usr/lib/x86_64-linux-gnu/gtk-3.0
}

# Install from scratch
install() {
    echo -e "${BLUE}Installing IA Launcher...${NC}"

    # Check git
    if ! command -v git &> /dev/null; then
        echo -e "${RED}Installing git...${NC}"
        sudo apt update && sudo apt install -y git
    fi

    # Check curl
    if ! command -v curl &> /dev/null; then
        echo -e "${RED}Installing curl...${NC}"
        sudo apt update && sudo apt install -y curl
    fi

    # Install Rust
    if ! command -v cargo &> /dev/null; then
        echo -e "${BLUE}Installing Rust...${NC}"
        curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
        source "$HOME/.cargo/env"
        rustup default stable
    fi

    # Install Node.js
    if ! command -v node &> /dev/null; then
        echo -e "${BLUE}Installing Node.js...${NC}"
        curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
        sudo apt install -y nodejs
    fi

    # Install system dependencies
    echo -e "${BLUE}Installing system dependencies...${NC}"
    sudo apt update
    sudo apt install -y \
        libwebkit2gtk-4.1-dev \
        build-essential \
        wget \
        libssl-dev \
        libayatana-appindicator3-dev \
        librsvg2-dev

    # Install linuxdeploy for AppImage creation
    if ! command -v linuxdeploy &> /dev/null; then
        echo -e "${BLUE}Installing linuxdeploy...${NC}"
        wget -q https://github.com/linuxdeploy/linuxdeploy/releases/download/continuous/linuxdeploy-x86_64.AppImage -O /tmp/linuxdeploy
        chmod +x /tmp/linuxdeploy
        sudo mv /tmp/linuxdeploy /usr/local/bin/linuxdeploy
        echo -e "${GREEN}linuxdeploy installed successfully${NC}"
    fi

    # Install npm dependencies
    echo -e "${BLUE}Installing npm dependencies...${NC}"
    npm install

    echo -e "${GREEN}Installation complete!${NC}"
}

# Development mode
dev() {
    echo -e "${BLUE}Starting development server...${NC}"
    fix_snap_env
    npm run tauri dev
}

# Production build
build() {
    echo -e "${BLUE}Building production app...${NC}"
    fix_snap_env
    npm run tauri build 2>&1 | grep -v "failed to run linuxdeploy" || true

    # Try to find .deb package (more reliable than AppImage)
    DEBFILE=$(find src-tauri/target/release/bundle/deb -name "*.deb" 2>/dev/null | head -n 1)

    if [ -n "$DEBFILE" ]; then
        echo -e "${BLUE}Installing .deb package...${NC}"
        sudo dpkg -i "$DEBFILE"

        echo -e "${GREEN}Build complete!${NC}"
        echo -e "${GREEN}App installed via .deb package${NC}"
        echo -e "${GREEN}Launch from application menu or run: ia-launcher${NC}"
    else
        echo -e "${RED}Build failed! No .deb package found.${NC}"
        exit 1
    fi
}

# Run installed app
run() {
    if command -v ia-launcher &> /dev/null; then
        ia-launcher
    else
        echo -e "${RED}App not installed. Run: ./launcher.sh build${NC}"
        exit 1
    fi
}

# Main
case "$1" in
    install)
        install
        ;;
    dev)
        dev
        ;;
    build)
        build
        ;;
    run)
        run
        ;;
    *)
        echo "IA Launcher - All-in-One Script"
        echo ""
        echo "Usage: ./launcher.sh [command]"
        echo ""
        echo "Commands:"
        echo "  install  - Install all dependencies from scratch"
        echo "  dev      - Start development server"
        echo "  build    - Build production app"
        echo "  run      - Run installed app"
        echo ""
        exit 1
        ;;
esac
