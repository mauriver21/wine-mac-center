if [ "$#" -ne 2 ]; then
    echo "Missing arguments file and target"    
    exit 1
fi

ARCHIVE="$1"
DEST="$2"

PARTS_DIR=$(dirname "$ARCHIVE")

7z x -y "$ARCHIVE" -o"$DEST" &
PID=$!
echo "[PID_START]$PID[PID_END]"
wait "$PID"
rm -rf "$PARTS_DIR" &
PID=$!
echo "[PID_START]$PID[PID_END]"