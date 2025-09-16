rm -rf "$WINE_APP_ENGINE_PATH/"*;
tar -xf "$WINE_ENGINES_PATH/$WINE_ENGINE_VERSION.tar.7z" -C "$WINE_APP_PATH" -v &
PID=$!
echo "[PID_START]$PID[PID_END]"
wait "$PID"
mv "$WINE_APP_PATH/wswine.bundle/"* "$WINE_APP_ENGINE_PATH";
rm -rf "$WINE_APP_PATH/wswine.bundle";