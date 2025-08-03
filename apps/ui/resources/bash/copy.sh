copy() {
    local FROM=$1
    local TARGET=$2
    cp -rf "$FROM" "$TARGET"
}

copy "$@"