#!/bin/bash

installSteamCMD() {
    local STEAM_CLI_PATH="$CLIENTS_PATH/steam"
    local FINDER_PID
    local PID

    FINDER_PID=$(pgrep -x Finder | head -n 1)

    mkdir -p "$STEAM_CLI_PATH"
    cd "$STEAM_CLI_PATH" || exit 1
    curl -sL "https://steamcdn-a.akamaihd.net/client/installer/steamcmd_osx.tar.gz" | tar zxvf -
    echo "Extraction finished, launching SteamCMD"    
    ./steamcmd.sh +login anonymous +quit

    # SteamCMD can cause macOS to launch additional Finder processes. Preserve
    # the Finder instance that existed before installation, or the first one
    # created during installation when Finder was not already running.
    if [[ -z "$FINDER_PID" ]]; then
        FINDER_PID=$(pgrep -x Finder | head -n 1)
    fi

    pgrep -x Finder | while read -r PID; do
        if [[ -n "$PID" && "$PID" != "$FINDER_PID" ]]; then
            kill "$PID" 2>/dev/null || true
        fi
    done
}

installSteamCMD
