downloadSteamApp() {
    local STEAM_CLI_PATH="$CLIENTS_PATH/steam"
    local GAME_INSTALL_DIR="$1"
    local GAME_INSTALL_DIR_LOWER="$2"
    local USER_NAME="$3"
    local PASSWORD="$4"
    local APP_ID="$5"
    local GUARD_CODE="$6"
    local ACF_MANIFEST_FILE="$GAME_INSTALL_DIR/steamapps/appmanifest_$APP_ID.acf"

    cd "$STEAM_CLI_PATH"

    cmd=(
    "./steamcmd.sh"
    "+@sSteamCmdForcePlatformType" "windows"
    "+force_install_dir" "$GAME_INSTALL_DIR"
    )

    [[ -n "$GUARD_CODE" ]] && cmd+=( "+set_steam_guard_code" "$GUARD_CODE" )

    cmd+=(
    "+login" "$USER_NAME" "$PASSWORD"
    "+app_update" "$APP_ID" "validate"
    "+quit"
    )

    source "$SCRIPTS_PATH/getPid.sh"
    "${cmd[@]}" &
    PID=$(getPid)
    wait "$PID"

    mkdir -p "$GAME_INSTALL_DIR"
    mv "$GAME_INSTALL_DIR_LOWER"/. "$GAME_INSTALL_DIR"/
    rmdir "$GAME_INSTALL_DIR_LOWER"

    cd "$GAME_INSTALL_DIR"
    cp "$ACF_MANIFEST_FILE" "../../"
}

downloadSteamApp "$@"