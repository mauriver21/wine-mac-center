downloadSteamApp() {
    local STEAM_CLI_PATH="$CLIENTS_PATH/steam"
    local GAME_INSTALL_DIR="$1"
    local GAME_INSTALL_DIR_LOWER="$2"
    local USER_NAME="$3"
    local PASSWORD="$4"
    local APP_ID="$5"
    local ACF_MANIFEST_FILE="$GAME_INSTALL_DIR/steamapps/appmanifest_$APP_ID.acf"    

    cd "$STEAM_CLI_PATH"    
    ./steamcmd.sh +@sSteamCmdForcePlatformType windows +force_install_dir "$GAME_INSTALL_DIR" +login "$USER_NAME" "$PASSWORD" +app_update "$APP_ID" validate +quit

    mkdir -p "$GAME_INSTALL_DIR"
    mv "$GAME_INSTALL_DIR_LOWER"/. "$GAME_INSTALL_DIR"/
    rmdir "$GAME_INSTALL_DIR_LOWER"

    cd "$GAME_INSTALL_DIR"
    cp "$ACF_MANIFEST_FILE" "../../"
}

downloadSteamApp "$@"