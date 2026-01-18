killPids() {
  local pid_list="$1"
  local pid

  # Replace commas with spaces and iterate
  IFS=',' read -ra PIDS <<< "$pid_list"

  for pid in "${PIDS[@]}"; do
    # Trim whitespace
    pid="${pid//[[:space:]]/}"

    # Skip empty values
    [[ -z "$pid" ]] && continue

    # Validate numeric PID
    if [[ ! "$pid" =~ ^[0-9]+$ ]]; then
      echo "Skipping invalid PID: $pid"
      continue
    fi

    if kill -0 "$pid" 2>/dev/null; then
      echo "Killing PID $pid"
      kill -9 "$pid"
    else
      echo "Process $pid does not exist."
    fi
  done
}

killPids "$@"