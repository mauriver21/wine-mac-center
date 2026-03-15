killWineProcesses() {  
  if [[ -n "$1" ]]; then
    WINE_APP_PREFIX_PATH="$1"
  fi

  WINEPREFIX="$WINE_APP_PREFIX_PATH" wineserver -k
}

killWineProcesses "$@"