#!/bin/bash
# Run an executable from config.json file located at
# Config.app/Contents/Resources/data/config.json
runExecutable() {
  json=$(cat "$WINE_APP_CONFIG_JSON_PATH")
  path=$(echo "$json" | jq -r '.executables[] | select(.main) | .path')
  flags=$(echo "$json" | jq -r '.executables[] | select(.main) | .flags')
  "$WINE_APP_SCRIPTS_PATH/wine.sh" WINDOWS_EXE "${WINE_APP_PREFIX_PATH}${path}" $flags
}

runExecutable "$@"
