remove() {
    local TARGET=$1
    rm -rf "$TARGET"
}

remove "$@"