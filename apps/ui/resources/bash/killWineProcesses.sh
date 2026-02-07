killWineProcesses() {
  WINEPREFIX="$WINE_APP_PREFIX_PATH" wineserver -k
}

killWineProcesses "$@"