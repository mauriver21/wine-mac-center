killWinetricks() {
  local force=false

  case "$1" in
    -f|--force) force=true ;;
  esac

  pkill -f '[w]inetricks'

  if $force; then
    WINEPREFIX="$WINE_APP_PREFIX_PATH" wineserver -k
  fi
}

killWinetricks "$@"