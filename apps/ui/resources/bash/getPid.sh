getPid() {
  local pid=$!
  echo "[PID_START]${pid}[PID_END]"
  echo "$pid"
}
