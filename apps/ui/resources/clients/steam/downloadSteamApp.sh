downloadSteamApp() {
    local STEAM_CLI_PATH="$CLIENTS_PATH/steam"
    local GAME_INSTALL_DIR="$1"
    local USER_NAME="$2"
    local PASSWORD="$3"
    local APP_ID="$4"
    local ACF_MANIFEST_FILE="$GAME_INSTALL_DIR/steamapps/appmanifest_$APP_ID.acf"

    mkdir -f "$GAME_INSTALL_DIR"

    cd "$STEAM_CLI_PATH"    
    ./steamcmd.sh +@sSteamCmdForcePlatformType windows +force_install_dir "$GAME_INSTALL_DIR" +login "$USER_NAME" "$PASSWORD" +app_update "$APP_ID" validate +quit

    cd "$GAME_INSTALL_DIR"
    cp "$ACF_MANIFEST_FILE" "../../"
}

downloadSteamApp "$@"