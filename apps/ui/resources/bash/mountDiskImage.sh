mountDiskImage() {
    local DISK_IMAGE="$1"

    if [[ ! -f "$DISK_IMAGE" ]]; then
        echo "Disk image not found: $DISK_IMAGE"
        return 1
    fi

    if hdiutil info | grep -Fq "$DISK_IMAGE"; then
        echo "Image already mounted"
    else
        hdiutil mount "$DISK_IMAGE"
    fi
}

mountDiskImage "$@"
