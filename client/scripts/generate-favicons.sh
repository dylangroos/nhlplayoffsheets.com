#!/bin/bash

# Make sure we're in the public directory
cd "$(dirname "$0")/../public"

# Generate different sizes from the PNG
convert placeholder-logo.png -resize 16x16 favicon-16x16.png
convert placeholder-logo.png -resize 32x32 favicon-32x32.png
convert placeholder-logo.png -resize 180x180 apple-touch-icon.png
convert placeholder-logo.png -resize 192x192 android-chrome-192x192.png
convert placeholder-logo.png -resize 512x512 android-chrome-512x512.png

# Generate social preview image (1200x630 for optimal social media sharing)
convert placeholder-logo.png -resize 1200x1200 -gravity center -background '#1e3a8a' -extent 1200x630 social-preview.png

# Generate Safari pinned tab SVG (should be single color)
cat > safari-pinned-tab.svg << EOL
<?xml version="1.0" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 20010904//EN" "http://www.w3.org/TR/2001/REC-SVG-20010904/DTD/svg10.dtd">
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <path fill="#000000" d="M120 150 L392 150 L392 250 L120 250 Z M160 280 L352 280 L352 380 L160 380 Z"/>
</svg>
EOL

echo "Generated all placeholder images and icons" 