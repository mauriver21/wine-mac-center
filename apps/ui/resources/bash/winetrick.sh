winetrick() {
  WINETRICKS_FALLBACK_LIBRARY_PATH="$WINE_APP_FRAMEWORKS_PATH" \
  "$WINE_APP_SCRIPTS_PATH/wineEnv.sh" \
  "$WINE_APP_SCRIPTS_PATH/winetricks.sh" $@ &
  PID=$!  
  TREE_PIDS=$(pgrep -P "$PID" | tr '\n' ',' | sed 's/,$//')
  echo "[PIDS_START]$PID,$TREE_PIDS[PIDS_END]"
  wait "$PID"
}

winetrick "$@"