#!/bin/bash

mkdir -p "$WINE_APP_PATH"
mkdir -p "$WINE_APP_CONTENTS_PATH"

# Creates Config.app
mkdir -p "$WINE_CONFIG_APP_RESOURCES_PATH"
mkdir -p "$WINE_APP_DATA_PATH"
cp -R "$SCRIPTS_PATH" "$WINE_CONFIG_APP_RESOURCES_PATH"

source "$SCRIPTS_PATH/env.sh"

# Creates the initial folder structure
mkdir -p "$WINE_APP_RESOURCES_PATH"
mkdir -p "$WINE_APP_LOGS_PATH"
mkdir -p "$WINE_APP_ENGINE_PATH"
mkdir -p "$WINE_APP_PREFIX_PATH"

# Frameworks path is taken from Config.app env
tar -xf "$COMPRESSED_PATH/Frameworks.zip" -C "$WINE_APP_CONTENTS_PATH" -v &
PID=$!
echo "[PIDS_START]$PID[PIDS_END]"