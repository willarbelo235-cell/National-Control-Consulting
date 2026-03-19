#!/bin/bash
set -e

# =============================================================================
# BUILD SCRIPT FOR NATIONAL CONTROLS CONSULTING
# =============================================================================
# Simple static site — copies project-root/ files directly to public/.
# No transpilation or bundling needed (plain HTML/CSS/JS).
# =============================================================================

echo "=== Building National Controls Consulting ==="

# Clean previous build output
rm -rf public
mkdir -p public

# Copy all site files to public/
cp project-root/index.html public/
cp project-root/about.html public/
cp project-root/training.html public/
cp project-root/services.html public/
cp project-root/contact.html public/
cp project-root/style.css public/
cp project-root/script.js public/
cp -r project-root/images public/

# Copy coming-soon page if needed
if [ -f ".coming_soon" ] || [ "${COMING_SOON:-0}" = "1" ]; then
    echo "Coming-soon mode: overwriting index.html"
    cp project-root/coming-soon.html public/index.html
fi

echo "=== Build complete ==="
ls -la public/