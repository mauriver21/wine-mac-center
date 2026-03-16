killWineProcesses() {
  PATH="$WINE_APP_BIN_PATH:$PATH" \
  WINEPREFIX="$WINE_APP_PREFIX_PATH" \
  wineserver -k
}

killWineProcesses "$@"