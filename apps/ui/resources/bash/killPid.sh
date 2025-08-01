killPid() {
    local pid="$1"
    if kill -0 "$pid" 2>/dev/null; then
        kill -9 "$pid"
    else
        echo "Process $pid does not exist."
    fi
}

killPid "$@"