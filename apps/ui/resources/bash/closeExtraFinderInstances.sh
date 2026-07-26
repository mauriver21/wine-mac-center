#!/bin/bash

# Restart Finder so macOS keeps a single Finder process.
/usr/bin/killall Finder 2>/dev/null || true

# Finder is normally relaunched automatically by macOS.
for _ in {1..10}; do
    if /usr/bin/pgrep -x Finder >/dev/null; then
        exit 0
    fi
    sleep 1
done

# Fall back to launching Finder if macOS did not restart it.
/usr/bin/open -a Finder
