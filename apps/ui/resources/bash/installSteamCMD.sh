#!/bin/bash

installSteamCMD() {
    local STEAM_CLI_PATH="$CLIENTS_PATH/steam"

    mkdir -p "$STEAM_CLI_PATH"
    cd "$STEAM_CLI_PATH" || exit 1
    curl -sL "https://steamcdn-a.akamaihd.net/client/installer/steamcmd_osx.tar.gz" | tar zxvf -
    echo "Extraction finished, launching SteamCMD"    
    ./steamcmd.sh +login anonymous +quit
}

installSteamCMD
