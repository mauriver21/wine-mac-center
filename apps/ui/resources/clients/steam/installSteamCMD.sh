installSteamCMD() {
    local STEAM_CLI_PATH="$CLIENTS_PATH/steam"
    cd "$STEAM_CLI_PATH"
    curl -sL "https://steamcdn-a.akamaihd.net/client/installer/steamcmd_osx.tar.gz" | tar zxvf -
    echo "Extraction finished, launching SteamCMD"    
    ./steamcmd.sh +login anonymous +quit
}

installSteamCMD