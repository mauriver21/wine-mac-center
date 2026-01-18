winetrick() {
  WINETRICKS_FALLBACK_LIBRARY_PATH="$WINE_APP_FRAMEWORKS_PATH" \
  "$WINE_APP_SCRIPTS_PATH/wineEnv.sh" \
  "$WINE_APP_SCRIPTS_PATH/winetricks.sh" $@ &
  PID=$!
  CHILD_PID=$(ps -p "$PID" -o pgid= | tr -d ' ')
  echo "[PIDS_START]$PID,$CHILD_PID[PIDS_END]"
  wait "$PID"
}

winetrick "$@"