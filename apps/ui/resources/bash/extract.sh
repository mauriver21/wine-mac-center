extract() {
    local FROM="$1"
    local TARGET="$2"

    if [[ -z "$FROM" || -z "$TARGET" ]]; then
        echo "Usage: extract <archive> <target-dir>"
        return 1
    fi

    if [[ ! -f "$FROM" ]]; then
        echo "Error: file '$FROM' not found"
        return 1
    fi

    mkdir -p "$TARGET"

    case "$FROM" in
        *.tar.gz|*.tgz)
            tar -xzf "$FROM" -C "$TARGET"
            ;;
        *.tar.bz2)
            tar -xjf "$FROM" -C "$TARGET"
            ;;
        *.tar.xz)
            tar -xJf "$FROM" -C "$TARGET"
            ;;
        *.tar)
            tar -xf "$FROM" -C "$TARGET"
            ;;
        *.zip)
            tar -xf "$FROM" -C "$TARGET"
            ;;
        *.rar)
            tar -xf "$FROM" -C "$TARGET"
            ;;
        *)
            echo "Unsupported archive format: $FROM"
            return 1
            ;;
    esac
}

extract "$@"
