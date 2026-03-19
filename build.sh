#!/bin/bash
set -e

# =============================================================================
# BUILD SCRIPT FOR NATIONAL CONTROLS CONSULTING
# =============================================================================
# This script controls what gets deployed to the live site.
#
# FULL SITE MODE (active):
#   - Builds the full site with Parcel into public/
#
# NOTE:
#   This repo previously overwrote public/index.html with coming-soon.html.
#   That override has been removed so Cloudflare Pages will deploy the full site.
# =============================================================================

echo "=== Building National Controls Consulting ==="

echo "Step 1: Building with Parcel..."
# Build the full site assets
npx parcel build project-root/index.html --dist-dir public --public-url ./

echo "=== Build complete ==="
ls -la public/