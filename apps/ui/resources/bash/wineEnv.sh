wineEnv() {
  if [[ -x "$WINE_APP_BIN_PATH/wine32on64" ]]; then
    WINE_PATH=$WINE_APP_BIN_PATH/wine32on64
  elif [[ -x "$WINE_APP_BIN_PATH/wine64" ]]; then
    WINE_PATH=$WINE_APP_BIN_PATH/wine64
  elif [[ -x "$WINE_APP_BIN_PATH/wine" ]]; then
    WINE_PATH=$WINE_APP_BIN_PATH/wine
  else
    echo "Error: No executable Wine binary found in $WINE_APP_BIN_PATH"
    exit 1
  fi

  DYLD_FALLBACK_LIBRARY_PATH="${DYLD_FALLBACK_LIBRARY_PATH}:$WINE_APP_FRAMEWORKS_PATH" \
  PATH="$WINE_APP_BIN_PATH:$PATH" \
  WINEPREFIX=$WINE_APP_PREFIX_PATH \
  WINE=$WINE_PATH \
  "$@"
}

wineEnv "$@"
