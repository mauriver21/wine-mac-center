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

echo "$$" > "$PID_FILE" || {
    echo "Error: could not create the Wine build PID file."
    exit 1
}
trap cleanup EXIT
trap 'exit 130' INT TERM

fail() {
    echo "Error: $1"
    exit 1
}

validate_environment() {
    local CONFIGURE_HELP

    [[ -n "$WINE_REPOSITORY_PATH" ]] || fail "WINE_REPOSITORY_PATH is not set."
    [[ -n "$WINE_TMP_PATH" ]] || fail "WINE_TMP_PATH is not set."
    [[ -n "$WINE_ENGINES_PATH" ]] || fail "WINE_ENGINES_PATH is not set."
    [[ -d "$WINE_REPOSITORY_PATH/.git" ]] || fail "Wine repository was not found."
    [[ -n "$WINE_TAG" ]] || fail "Wine tag is required."
    [[ "$WINE_TAG" =~ ^[a-zA-Z0-9._/-]+$ ]] || fail "Invalid Wine tag."
    [[ "$WINE_ARCH" =~ ^(wine32on64|wow64|wine64)$ ]] || fail "Invalid Wine architecture."
    git -C "$WINE_REPOSITORY_PATH" show-ref --verify --quiet "refs/tags/$WINE_TAG" ||
        fail "Wine tag $WINE_TAG does not exist."
    command -v make >/dev/null 2>&1 || fail "make is not installed."
    command -v clang >/dev/null 2>&1 || fail "clang is not installed."

    CONFIGURE_HELP=$("$WINE_REPOSITORY_PATH/configure" --help)
    case "$WINE_ARCH" in
        wine32on64)
            grep -q -- '--enable-win32on64' <<< "$CONFIGURE_HELP" ||
                fail "$WINE_TAG does not support --enable-win32on64. Use a WineCX source tree."
            ;;
        wow64)
            grep -q -- '--enable-archs' <<< "$CONFIGURE_HELP" ||
                fail "$WINE_TAG does not support --enable-archs."
            ;;
        wine64)
            grep -q -- '--enable-win64' <<< "$CONFIGURE_HELP" ||
                fail "$WINE_TAG does not support --enable-win64."
            ;;
    esac
}

configure_build_environment() {
    local BREW_PATH
    local BREW_PREFIX
    local FORMULA
    local FORMULA_PREFIX

    if command -v brew >/dev/null 2>&1; then
        BREW_PATH=$(command -v brew)
    elif [[ -x "/opt/homebrew/bin/brew" ]]; then
        BREW_PATH="/opt/homebrew/bin/brew"
    elif [[ -x "/usr/local/bin/brew" ]]; then
        BREW_PATH="/usr/local/bin/brew"
    else
        fail "Homebrew is not installed. Install the Wine build dependencies first."
    fi

    BREW_PREFIX=$("$BREW_PATH" --prefix)
    export PATH="$BREW_PREFIX/opt/bison/bin:$BREW_PREFIX/bin:$PATH"
    export PKG_CONFIG_PATH="$BREW_PREFIX/lib/pkgconfig:$BREW_PREFIX/share/pkgconfig:${PKG_CONFIG_PATH:-}"
    for FORMULA in freetype gnutls molten-vk sdl2; do
        FORMULA_PREFIX=$("$BREW_PATH" --prefix "$FORMULA" 2>/dev/null) || continue
        export PKG_CONFIG_PATH="$FORMULA_PREFIX/lib/pkgconfig:$FORMULA_PREFIX/share/pkgconfig:$PKG_CONFIG_PATH"
    done
    export CC="${CC:-clang}"
    export CXX="${CXX:-clang++}"
}

configure_wine() {
    local BUILD_PATH="$1"
    shift

    mkdir -p "$BUILD_PATH" || return 1
    cd "$BUILD_PATH" || return 1
    "$WINE_REPOSITORY_PATH/configure" --prefix="$BUNDLE_PATH" "$@"
}

compile_and_install() {
    local BUILD_PATH="$1"
    local CPU_COUNT

    CPU_COUNT=$(sysctl -n hw.logicalcpu 2>/dev/null || echo 4)
    cd "$BUILD_PATH" || return 1
    make -j "$CPU_COUNT" || return 1
    make install
}

build_wine64() {
    configure_wine "$BUILD_ROOT/wine64" --enable-win64 || return 1
    compile_and_install "$BUILD_ROOT/wine64"
}

build_wow64() {
    configure_wine "$BUILD_ROOT/wow64" --enable-archs=i386,x86_64 || return 1
    compile_and_install "$BUILD_ROOT/wow64"
}

build_wine32on64() {
    configure_wine "$BUILD_ROOT/wine64" --enable-win64 || return 1
    compile_and_install "$BUILD_ROOT/wine64" || return 1
    configure_wine \
        "$BUILD_ROOT/wine32on64" \
        --enable-win32on64 \
        --with-wine64="$BUILD_ROOT/wine64" || return 1
    compile_and_install "$BUILD_ROOT/wine32on64"
}

package_engine() {
    mkdir -p "$WINE_ENGINES_PATH" || return 1
    echo "$WINE_TAG $WINE_ARCH" > "$BUNDLE_PATH/version" || return 1
    tar -cJf "$TEMP_ENGINE_ARCHIVE_PATH" -C "$STAGING_PATH" wswine.bundle || return 1
    mv "$TEMP_ENGINE_ARCHIVE_PATH" "$ENGINE_ARCHIVE_PATH" || return 1
    echo "Wine engine created: $ENGINE_ARCHIVE_PATH"
}

play_completion_sound() {
    local SOUND_PATH="/System/Library/Sounds/Glass.aiff"

    if command -v afplay >/dev/null 2>&1 && [[ -f "$SOUND_PATH" ]]; then
        afplay "$SOUND_PATH" >/dev/null 2>&1 &
    fi
}

validate_environment
configure_build_environment

ENGINE_NAME="${WINE_TAG}-${WINE_ARCH}"
BUILD_ROOT="$WINE_TMP_PATH/wine-build/$ENGINE_NAME"
STAGING_PATH="$BUILD_ROOT/staging"
BUNDLE_PATH="$STAGING_PATH/wswine.bundle"
ENGINE_ARCHIVE_PATH="$WINE_ENGINES_PATH/$ENGINE_NAME.tar.7z"
TEMP_ENGINE_ARCHIVE_PATH="$BUILD_ROOT/$ENGINE_NAME.tar.7z"

case "$BUILD_ROOT" in
    "$WINE_TMP_PATH"/wine-build/*) ;;
    *) fail "Invalid Wine build directory." ;;
esac

rm -rf "$BUILD_ROOT"
mkdir -p "$BUNDLE_PATH" || fail "Could not create the Wine engine staging directory."
git -C "$WINE_REPOSITORY_PATH" checkout --detach "refs/tags/$WINE_TAG" ||
    fail "Could not check out $WINE_TAG."

echo "Building $WINE_TAG for $WINE_ARCH..."
case "$WINE_ARCH" in
    wine32on64) build_wine32on64 || fail "Wine32on64 build failed." ;;
    wow64) build_wow64 || fail "WoW64 build failed." ;;
    wine64) build_wine64 || fail "Wine64 build failed." ;;
esac

package_engine || fail "Could not package the Wine engine."
play_completion_sound
