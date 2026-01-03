mountDiskImage() {
    local DISK_IMAGE="$1"

    if [[ ! -f "$DISK_IMAGE" ]]; then
        echo "Disk image not found: $DISK_IMAGE"
        return 1
    fi

    hdiutil mount "$DISK_IMAGE"
}

mountDiskImage "$@"
