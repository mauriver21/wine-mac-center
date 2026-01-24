CONTENTS_PATH="$WINE_APP_PATH/Contents"
PLIST="$CONTENTS_PATH/Info.plist"

"$SCRIPTS_PATH/imageToIcns.sh" "$WINE_APP_RESOURCES_PATH/icon.icns" "$WINE_APP_RESOURCES_PATH/icon.icns"

plutil -replace CFBundleIconFile -string "icon" "$PLIST"
plutil -replace CFBundleIconName -string "icon" "$PLIST"

touch "$WINE_APP_PATH"
