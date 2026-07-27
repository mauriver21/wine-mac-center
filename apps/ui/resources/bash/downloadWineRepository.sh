#!/bin/bash

set -o pipefail

WINE_REPOSITORY_URL="https://gitlab.winehq.org/wine/wine.git"

find_brew() {
    if command -v brew >/dev/null 2>&1; then
        command -v brew
    elif [[ -x "/opt/homebrew/bin/brew" ]]; then
        echo "/opt/homebrew/bin/brew"
    elif [[ -x "/usr/local/bin/brew" ]]; then
        echo "/usr/local/bin/brew"
    fi
}

find_git() {
    local BREW_PATH="$1"
    local GIT_PATH

    GIT_PATH=$(command -v git 2>/dev/null)
    if [[ -n "$GIT_PATH" ]] && "$GIT_PATH" --version >/dev/null 2>&1; then
        echo "$GIT_PATH"
        return 0
    fi

    if [[ -n "$BREW_PATH" ]]; then
        GIT_PATH="$($BREW_PATH --prefix git 2>/dev/null)/bin/git"
        if [[ -x "$GIT_PATH" ]] && "$GIT_PATH" --version >/dev/null 2>&1; then
            echo "$GIT_PATH"
            return 0
        fi
    fi

    return 1
}

download_wine_repository() {
    local BREW_PATH
    local GIT_PATH

    if [[ -z "$WINE_REPOSITORY_PATH" ]]; then
        echo "Error: WINE_REPOSITORY_PATH is not set"
        return 1
    fi

    if [[ -d "$WINE_REPOSITORY_PATH/.git" ]]; then
        echo "Wine repository is already downloaded at $WINE_REPOSITORY_PATH"
        return 0
    fi

    if [[ -e "$WINE_REPOSITORY_PATH" ]]; then
        echo "Error: $WINE_REPOSITORY_PATH exists but is not a Git repository"
        return 1
    fi

    BREW_PATH=$(find_brew)
    if [[ -z "$BREW_PATH" ]]; then
        if ! command -v curl >/dev/null 2>&1; then
            echo "Error: curl is required to install Homebrew"
            return 1
        fi

        echo "Homebrew not found. Installing Homebrew..."
        NONINTERACTIVE=1 /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)" || return 1
        BREW_PATH=$(find_brew)
    fi

    if [[ -z "$BREW_PATH" ]]; then
        echo "Error: Homebrew installation completed but brew could not be found"
        return 1
    fi

    GIT_PATH=$(find_git "$BREW_PATH")
    if [[ -z "$GIT_PATH" ]]; then
        echo "Git not found. Installing Git..."
        "$BREW_PATH" install git || return 1
        GIT_PATH=$(find_git "$BREW_PATH")
    fi

    if [[ -z "$GIT_PATH" ]]; then
        echo "Error: Git installation completed but git could not be found"
        return 1
    fi

    mkdir -p "$(dirname "$WINE_REPOSITORY_PATH")" || return 1
    "$GIT_PATH" clone --progress "$WINE_REPOSITORY_URL" "$WINE_REPOSITORY_PATH"
}

download_wine_repository
