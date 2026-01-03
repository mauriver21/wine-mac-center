unmountVolume() {
    local VOLUME="$1"
    hdiutil detach "$VOLUME"
}

unmountVolume "$@"
