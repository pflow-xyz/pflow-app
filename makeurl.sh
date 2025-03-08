#!/bin/bash

# Read the SVG file and encode it in base64
base64_encoded=$(cat render.svg | base64)

# Create the data URL
data_url="data:image/svg+xml;base64,${base64_encoded}"

# Output the data URL
echo "[petri-net](${data_url})" > test.md
