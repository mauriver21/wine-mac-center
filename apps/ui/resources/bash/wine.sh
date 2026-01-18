#!/bin/bash
wine() {
  if [[ -e "$WINE_APP_BIN_PATH/wine32on64" ]]; then
    WINE_ARCH=wine32on64
  else
    WINE_ARCH=wine64
  fi

  WINDOWS_EXE=$1

  if [ "$WINDOWS_EXE" = "WINDOWS_EXE" ]; then
    EXE_PATH=$(printf "%b" "$2")   # unescape if needed
    EXE_FLAGS="$3"

    EXE_DIR=$(dirname "$EXE_PATH")
    EXE_FILE=$(basename "$EXE_PATH")

    cd "$EXE_DIR" || exit 1
    "$WINE_APP_SCRIPTS_PATH/wineEnv.sh" "$WINE_ARCH" "$EXE_FILE" $EXE_FLAGS
    script_pid=$!
    wait $script_pid

    echo "Checking PIDS"

    wine_pids=$(ps -eo pid,command | grep -i "wine.*$EXE_FILE" | grep -v grep | grep -v "wine.sh" | awk '{print $1}' )
    wine_pid=$(ps -eo pid,command | grep -i "wine.*$EXE_FILE" | grep -v grep | grep -v "wine.sh" | awk '{print $1}' | head -n 1 )

    echo "WINE PIDS: $wine_pids"  
    echo "Tracking PID: $wine_pid"

    # Wait for that PID to exit
    while ps -p "$wine_pid" > /dev/null; do
      sleep 1
    done
  else
    "$WINE_APP_SCRIPTS_PATH/wineEnv.sh" "$WINE_ARCH" "$@"
  fi
}

wine "$@"