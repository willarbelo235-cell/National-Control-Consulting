#!/bin/bash
set -e

echo "Starting build..."

# Run parcel build
npx parcel build project-root/index.html --dist-dir public --public-url ./

# Copy coming soon page over the built index
echo "Copying coming-soon.html to public/index.html"
cp project-root/coming-soon.html public/index.html

# Copy background image
echo "Copying coming-soon-bg.jpg to public/"
cp project-root/images/coming-soon-bg.jpg public/coming-soon-bg.jpg

echo "Build complete - coming soon page deployed"
ls -la public/
