#!/usr/bin/env bash

set -e

# Usage check
if [ -z "$1" ]; then
  echo "Usage: $0 input_image.png [output.icns]"
  exit 1
fi

INPUT_IMAGE="$1"
OUTPUT_ICNS="${2:-icon.icns}"

ICONSET_DIR="icon.iconset"

# Clean previous iconset
rm -rf "$ICONSET_DIR"
mkdir "$ICONSET_DIR"

echo "▶ Generating iconset from $INPUT_IMAGE..."

# Base sizes
sips -z 16 16     "$INPUT_IMAGE" --out "$ICONSET_DIR/icon_16x16.png"
sips -z 32 32     "$INPUT_IMAGE" --out "$ICONSET_DIR/icon_16x16@2x.png"
sips -z 32 32     "$INPUT_IMAGE" --out "$ICONSET_DIR/icon_32x32.png"
sips -z 64 64     "$INPUT_IMAGE" --out "$ICONSET_DIR/icon_32x32@2x.png"
sips -z 128 128   "$INPUT_IMAGE" --out "$ICONSET_DIR/icon_128x128.png"
sips -z 256 256   "$INPUT_IMAGE" --out "$ICONSET_DIR/icon_128x128@2x.png"
sips -z 256 256   "$INPUT_IMAGE" --out "$ICONSET_DIR/icon_256x256.png"
sips -z 512 512   "$INPUT_IMAGE" --out "$ICONSET_DIR/icon_256x256@2x.png"
sips -z 512 512   "$INPUT_IMAGE" --out "$ICONSET_DIR/icon_512x512.png"
sips -z 1024 1024 "$INPUT_IMAGE" --out "$ICONSET_DIR/icon_512x512@2x.png"

echo "▶ Creating $OUTPUT_ICNS..."
iconutil -c icns "$ICONSET_DIR" -o "$OUTPUT_ICNS"

# Cleanup
rm -rf "$ICONSET_DIR"

echo "✅ Done: $OUTPUT_ICNS"
