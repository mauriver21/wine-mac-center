#!/bin/bash
copyWindowsApplication() {
  local WINDOWS_APPLICATION_PATH=$1

  # Check if the source path is provided
  if [[ -z "$WINDOWS_APPLICATION_PATH" ]]; then
    echo "Error: No application path provided."
    exit 1
  fi

  # Check if the destination variable is set
  if [[ -z "$WINE_APP_PROGRAM_FILES_X86" ]]; then
    echo "Error: WINE_APP_PROGRAM_FILES_X86 is not set."
    exit 1
  fi

  cp -r "$WINDOWS_APPLICATION_PATH" "$WINE_APP_PROGRAM_FILES_X86"
}

copyWindowsApplication "$@"