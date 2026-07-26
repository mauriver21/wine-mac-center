#!/bin/bash

runSteamCMD() {
    local STEAM_CLI_PATH="$CLIENTS_PATH/steam"
    local STEAMCMD_BIN="$STEAM_CLI_PATH/steamcmd.sh"
    local INSTALL_SCRIPT="$SCRIPTS_PATH/installSteamCMD.sh"

    # Ensure base directory exists
    mkdir -p "$STEAM_CLI_PATH"
    cd "$STEAM_CLI_PATH" || exit 1

    # Check if SteamCMD is installed
    if [[ ! -x "$STEAMCMD_BIN" ]]; then
        echo "SteamCMD not found. Installing..."

        if [[ ! -x "$INSTALL_SCRIPT" ]]; then
            echo "Error: installSteamCMD.sh not found or not executable"
            exit 1
        fi

        "$INSTALL_SCRIPT"

        # Re-check after install
        if [[ ! -x "$STEAMCMD_BIN" ]]; then
            echo "Error: SteamCMD installation failed"
            exit 1
        fi
    fi

    # Run SteamCMD
    "$STEAMCMD_BIN" "$@"
}

runSteamCMD "$@"
