#!/bin/bash

# Fix for snap VS Code library conflicts with Tauri
# This script ensures the Tauri application uses system libraries instead of snap libraries

# Unset all snap-related library paths that could interfere
unset LD_LIBRARY_PATH
unset LD_PRELOAD

# Reset snap-modified environment variables to their original values
if [ -n "$GIO_MODULE_DIR_VSCODE_SNAP_ORIG" ]; then
    export GIO_MODULE_DIR="$GIO_MODULE_DIR_VSCODE_SNAP_ORIG"
else
    unset GIO_MODULE_DIR
fi

if [ -n "$GSETTINGS_SCHEMA_DIR_VSCODE_SNAP_ORIG" ]; then
    export GSETTINGS_SCHEMA_DIR="$GSETTINGS_SCHEMA_DIR_VSCODE_SNAP_ORIG"
else
    unset GSETTINGS_SCHEMA_DIR
fi

if [ -n "$GTK_EXE_PREFIX_VSCODE_SNAP_ORIG" ]; then
    export GTK_EXE_PREFIX="$GTK_EXE_PREFIX_VSCODE_SNAP_ORIG"
else
    unset GTK_EXE_PREFIX
fi

if [ -n "$GTK_IM_MODULE_FILE_VSCODE_SNAP_ORIG" ]; then
    export GTK_IM_MODULE_FILE="$GTK_IM_MODULE_FILE_VSCODE_SNAP_ORIG"
else
    unset GTK_IM_MODULE_FILE
fi

if [ -n "$GTK_PATH_VSCODE_SNAP_ORIG" ]; then
    export GTK_PATH="$GTK_PATH_VSCODE_SNAP_ORIG"
else
    unset GTK_PATH
fi

if [ -n "$LOCPATH_VSCODE_SNAP_ORIG" ]; then
    export LOCPATH="$LOCPATH_VSCODE_SNAP_ORIG"
else
    unset LOCPATH
fi

if [ -n "$XDG_DATA_HOME_VSCODE_SNAP_ORIG" ]; then
    export XDG_DATA_HOME="$XDG_DATA_HOME_VSCODE_SNAP_ORIG"
else
    unset XDG_DATA_HOME
fi

if [ -n "$XDG_DATA_DIRS_VSCODE_SNAP_ORIG" ]; then
    export XDG_DATA_DIRS="$XDG_DATA_DIRS_VSCODE_SNAP_ORIG"
fi

if [ -n "$XDG_CONFIG_DIRS_VSCODE_SNAP_ORIG" ]; then
    export XDG_CONFIG_DIRS="$XDG_CONFIG_DIRS_VSCODE_SNAP_ORIG"
fi

# Remove snap paths from PATH if present
export PATH=$(echo "$PATH" | tr ':' '\n' | grep -v '/snap/' | tr '\n' ':' | sed 's/:$//')

# Ensure the script is executable
if [ ! -x "$0" ]; then
    chmod +x "$0"
fi

# Run Tauri in development mode
echo "Starting Tauri development server with clean environment..."
exec npm run tauri dev
