#!/bin/bash
set -e

# =============================================================================
# BUILD SCRIPT FOR NATIONAL CONTROLS CONSULTING
# =============================================================================
# This script controls what gets deployed to the live site.
#
# COMING SOON MODE (current):
#   - Builds the full site with Parcel
#   - Overwrites public/index.html with coming-soon.html
#   - Public sees the "Coming Soon" page
#
# TO LAUNCH FULL SITE:
#   Tell Copilot: "Launch the full site" or "Remove coming soon page"
#   This will comment out the coming-soon override below.
# =============================================================================

echo "=== Building National Controls Consulting ==="

# Step 1: Run parcel build (builds the full site assets)
echo "Step 1: Building with Parcel..."
npx parcel build project-root/index.html --dist-dir public --public-url ./

# -----------------------------------------------------------------------------
# COMING SOON OVERRIDE - Comment out lines below to launch full site
# -----------------------------------------------------------------------------
echo "Step 2: Applying coming soon page..."
cp project-root/coming-soon.html public/index.html
cp project-root/images/coming-soon-bg.jpg public/coming-soon-bg.jpg
echo ">>> COMING SOON PAGE IS ACTIVE <<<"
# -----------------------------------------------------------------------------

echo "=== Build complete ==="
ls -la public/
