#!/bin/bash

PID_FILE="${TMPDIR:-/tmp}/wine-mac-center-build-wine.pid"

list_descendants() {
    local PARENT_PID="$1"
    local CHILD_PID

    for CHILD_PID in $(pgrep -P "$PARENT_PID" 2>/dev/null); do
        list_descendants "$CHILD_PID"
        echo "$CHILD_PID"
    done
}

abort_wine_build() {
    local BUILD_PID
    local PROCESS_PID
    local PROCESS_PIDS
    local RETRY=0

    if [[ ! -f "$PID_FILE" ]]; then
        echo "No Wine build is running."
        return 0
    fi

    BUILD_PID=$(cat "$PID_FILE")
    if [[ ! "$BUILD_PID" =~ ^[0-9]+$ ]] || [[ "$BUILD_PID" == "0" ]] || [[ "$BUILD_PID" == "1" ]]; then
        echo "Error: invalid Wine build PID."
        return 1
    fi

    if ! kill -0 "$BUILD_PID" 2>/dev/null; then
        rm -f "$PID_FILE"
        echo "No Wine build is running."
        return 0
    fi

    PROCESS_PIDS="$(list_descendants "$BUILD_PID") $BUILD_PID"
    echo "Aborting Wine build..."

    for PROCESS_PID in $PROCESS_PIDS; do
        kill -TERM "$PROCESS_PID" 2>/dev/null || true
    done

    while [[ $RETRY -lt 20 ]] && kill -0 "$BUILD_PID" 2>/dev/null; do
        sleep 0.1
        RETRY=$((RETRY + 1))
    done

    for PROCESS_PID in $PROCESS_PIDS; do
        if kill -0 "$PROCESS_PID" 2>/dev/null; then
            kill -KILL "$PROCESS_PID" 2>/dev/null || true
        fi
    done

    rm -f "$PID_FILE"
    echo "Wine build aborted."
}

abort_wine_build
