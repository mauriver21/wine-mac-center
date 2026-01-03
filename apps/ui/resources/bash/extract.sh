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
            tar -xzf "$FROM" -C "$TARGET" &
            ;;
        *.tar.bz2)
            tar -xjf "$FROM" -C "$TARGET" &
            ;;
        *.tar.xz)
            tar -xJf "$FROM" -C "$TARGET" &
            ;;
        *.tar|*.zip|*.rar)
            tar -xf "$FROM" -C "$TARGET" &
            ;;
        *.bin)
            if ! command -v unar >/dev/null 2>&1; then
                echo "Error: unar not found. Install with: brew install unar"
                return 1
            fi
            unar -D -o "$TARGET" "$FROM" &
            ;;
        *)
            echo "Unsupported archive format: $FROM"
            return 1
            ;;
    esac

    local PID=$!
    wait "$PID"    
}

extract "$@"
