#!/bin/bash

set -o pipefail

REQUIRED_FORMULAS=(bison mingw-w64 pkgconf freetype gnutls molten-vk sdl2)

find_brew() {
    if command -v brew >/dev/null 2>&1; then
        command -v brew
    elif [[ -x "/opt/homebrew/bin/brew" ]]; then
        echo "/opt/homebrew/bin/brew"
    elif [[ -x "/usr/local/bin/brew" ]]; then
        echo "/usr/local/bin/brew"
    fi
}

install_homebrew() {
    if ! command -v curl >/dev/null 2>&1; then
        echo "Error: curl is required to install Homebrew."
        return 1
    fi

    echo "Homebrew not found. Installing Homebrew..."
    NONINTERACTIVE=1 /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
}

validate_xcode_tools() {
    if ! xcode-select -p >/dev/null 2>&1 || ! xcrun --find clang >/dev/null 2>&1 || ! xcrun --find make >/dev/null 2>&1; then
        echo "Xcode Command Line Tools are required. Starting the Apple installer..."
        xcode-select --install >/dev/null 2>&1 || true
        echo "Complete the Xcode Command Line Tools installation, then run this step again."
        return 1
    fi

    echo "Xcode Command Line Tools: installed"
    echo "Compiler: $(xcrun clang --version | head -n 1)"
    echo "SDK: $(xcrun --show-sdk-path)"
}

install_required_formulas() {
    local BREW_PATH="$1"
    local FORMULA
    local MISSING_FORMULAS=()

    for FORMULA in "${REQUIRED_FORMULAS[@]}"; do
        if "$BREW_PATH" list --versions "$FORMULA" >/dev/null 2>&1; then
            echo "$FORMULA: installed"
        else
            echo "$FORMULA: missing"
            MISSING_FORMULAS+=("$FORMULA")
        fi
    done

    if [[ ${#MISSING_FORMULAS[@]} -eq 0 ]]; then
        echo "All Wine build dependencies are already installed."
        return 0
    fi

    echo "Installing missing dependencies: ${MISSING_FORMULAS[*]}"
    "$BREW_PATH" install "${MISSING_FORMULAS[@]}"
}

validate_installed_formulas() {
    local BREW_PATH="$1"
    local FORMULA
    local FAILED=0

    for FORMULA in "${REQUIRED_FORMULAS[@]}"; do
        if "$BREW_PATH" list --versions "$FORMULA" >/dev/null 2>&1; then
            echo "$FORMULA: ready"
        else
            echo "Error: $FORMULA is still missing after installation."
            FAILED=1
        fi
    done

    if [[ $FAILED -ne 0 ]]; then
        return 1
    fi

    echo "Wine build dependencies are ready."
    echo "Use $BREW_PATH --prefix bison to add Homebrew Bison to the build PATH."
}

install_wine_build_dependencies() {
    local BREW_PATH

    validate_xcode_tools || return 1

    BREW_PATH=$(find_brew)
    if [[ -z "$BREW_PATH" ]]; then
        install_homebrew || return 1
        BREW_PATH=$(find_brew)
    fi

    if [[ -z "$BREW_PATH" ]]; then
        echo "Error: Homebrew installation completed but brew could not be found."
        return 1
    fi

    echo "Homebrew: $BREW_PATH"
    install_required_formulas "$BREW_PATH" || return 1
    validate_installed_formulas "$BREW_PATH"
}

install_wine_build_dependencies
