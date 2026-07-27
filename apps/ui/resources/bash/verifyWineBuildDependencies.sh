#!/bin/bash

set -o pipefail

WINE_TAG="$1"
WINE_ARCH="$2"
PID_FILE="${TMPDIR:-/tmp}/wine-mac-center-build-wine.pid"

cleanup() {
    if [[ -f "$PID_FILE" ]] && [[ "$(cat "$PID_FILE")" == "$$" ]]; then
        rm -f "$PID_FILE"
    fi
}

play_failure_sound() {
    local SOUND_PATH="/System/Library/Sounds/Basso.aiff"
    if command -v afplay >/dev/null 2>&1 && [[ -f "$SOUND_PATH" ]]; then
        afplay "$SOUND_PATH" >/dev/null 2>&1 &
    fi
}

fail() {
    echo "Error: $1"
    play_failure_sound
    exit "${2:-1}"
}

find_brew() {
    if command -v brew >/dev/null 2>&1; then
        command -v brew
    elif [[ -x "/opt/homebrew/bin/brew" ]]; then
        echo "/opt/homebrew/bin/brew"
    elif [[ -x "/usr/local/bin/brew" ]]; then
        echo "/usr/local/bin/brew"
    fi
}

require_command() {
    local COMMAND="$1"
    local PACKAGE="$2"

    if command -v "$COMMAND" >/dev/null 2>&1; then
        echo "✓ $COMMAND: $(command -v "$COMMAND")"
    else
        fail "$COMMAND is missing. Install it with: brew install $PACKAGE"
    fi
}

configure_environment() {
    local FORMULA
    local FORMULA_PREFIX

    BREW_PATH=$(find_brew)
    [[ -n "$BREW_PATH" ]] || fail "Homebrew is missing. Install the Wine build dependencies first."
    BREW_PREFIX=$("$BREW_PATH" --prefix) || fail "Could not determine the Homebrew prefix."
    export PATH="$BREW_PREFIX/opt/bison/bin:$BREW_PREFIX/bin:$PATH"
    export PKG_CONFIG_PATH="$BREW_PREFIX/lib/pkgconfig:$BREW_PREFIX/share/pkgconfig:${PKG_CONFIG_PATH:-}"

    for FORMULA in freetype gnutls molten-vk sdl2; do
        FORMULA_PREFIX=$("$BREW_PATH" --prefix "$FORMULA" 2>/dev/null) || continue
        export PKG_CONFIG_PATH="$FORMULA_PREFIX/lib/pkgconfig:$FORMULA_PREFIX/share/pkgconfig:$PKG_CONFIG_PATH"
    done
}

verify_tools() {
    xcode-select -p >/dev/null 2>&1 || fail "Xcode Command Line Tools are missing."
    xcrun --find clang >/dev/null 2>&1 || fail "Clang is missing from Xcode Command Line Tools."
    xcrun --find make >/dev/null 2>&1 || fail "Make is missing from Xcode Command Line Tools."

    echo "✓ Xcode Command Line Tools: $(xcode-select -p)"
    echo "✓ Compiler: $(xcrun clang --version | head -n 1)"
    echo "✓ SDK: $(xcrun --show-sdk-path)"
    echo "✓ Homebrew: $BREW_PATH"

    require_command bison bison
    require_command flex flex
    require_command pkg-config pkgconf
    require_command x86_64-w64-mingw32-gcc mingw-w64

    if [[ "$WINE_ARCH" == "wow64" ]]; then
        require_command i686-w64-mingw32-gcc mingw-w64
    fi
}

verify_source() {
    local CONFIGURE_HELP
    local CHECKED_OUT_TAG

    [[ -d "$WINE_REPOSITORY_PATH/.git" ]] || fail "Wine repository was not found."
    [[ "$WINE_TAG" =~ ^[a-zA-Z0-9._/-]+$ ]] || fail "Invalid Wine tag."
    [[ "$WINE_ARCH" =~ ^(wine32on64|wow64|wine64)$ ]] || fail "Invalid Wine architecture."

    CHECKED_OUT_TAG=$(git -C "$WINE_REPOSITORY_PATH" describe --tags --exact-match 2>/dev/null) ||
        fail "The Wine repository is not checked out at an exact tag."
    [[ "$CHECKED_OUT_TAG" == "$WINE_TAG" ]] ||
        fail "Expected $WINE_TAG but the repository is at $CHECKED_OUT_TAG."

    CONFIGURE_HELP=$("$WINE_REPOSITORY_PATH/configure" --help)
    case "$WINE_ARCH" in
        wine32on64)
            grep -q -- '--enable-win32on64' <<< "$CONFIGURE_HELP" ||
                fail "$WINE_TAG does not support Wine32on64." 2
            ;;
        wow64)
            grep -q -- '--enable-archs' <<< "$CONFIGURE_HELP" ||
                fail "$WINE_TAG does not support WoW64." 2
            ;;
        wine64)
            grep -q -- '--enable-win64' <<< "$CONFIGURE_HELP" ||
                fail "$WINE_TAG does not support Wine64." 2
            ;;
    esac

    echo "✓ Wine source: $CHECKED_OUT_TAG"
    echo "✓ Architecture: $WINE_ARCH"
}

run_configure_probe() {
    local CONFIGURE_ARGS=()

    case "$WINE_ARCH" in
        wine32on64) CONFIGURE_ARGS=(--enable-win32on64) ;;
        wow64) CONFIGURE_ARGS=(--enable-archs=i386,x86_64) ;;
        wine64) CONFIGURE_ARGS=(--enable-win64) ;;
    esac

    mkdir -p "$PROBE_PATH" || fail "Could not create the dependency probe directory."
    cd "$PROBE_PATH" || fail "Could not open the dependency probe directory."
    echo "Running Wine configure dependency probe..."
    "$WINE_REPOSITORY_PATH/configure" \
        --prefix="$PROBE_PATH/install" \
        "${CONFIGURE_ARGS[@]}" || fail "Wine configure dependency probe failed." 3
}

[[ -n "$WINE_REPOSITORY_PATH" ]] || fail "WINE_REPOSITORY_PATH is not set."
[[ -n "$WINE_TMP_PATH" ]] || fail "WINE_TMP_PATH is not set."

echo "$$" > "$PID_FILE" || fail "Could not create the dependency verification PID file."
trap cleanup EXIT
trap 'exit 130' INT TERM

PROBE_PATH="$WINE_TMP_PATH/wine-dependency-check/${WINE_TAG}-${WINE_ARCH}"
case "$PROBE_PATH" in
    "$WINE_TMP_PATH"/wine-dependency-check/*) ;;
    *) fail "Invalid dependency probe directory." ;;
esac

rm -rf "$PROBE_PATH"
configure_environment
echo "Checking Wine build dependencies..."
verify_source
verify_tools
run_configure_probe
echo "Wine build dependency verification completed successfully."
