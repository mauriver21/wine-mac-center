#!/bin/bash
LAUNCHER_PATH_RESOURCES="$RESOURCES_PATH/launcher/winemacapp.app/Contents/Resources"

rsync -av --exclude='icon.icns' "$LAUNCHER_PATH_RESOURCES/" "$WINE_APP_RESOURCES_PATH/"
rsync -av "$SCRIPTS_PATH/" "$WINE_APP_RESOURCES_PATH/bash"