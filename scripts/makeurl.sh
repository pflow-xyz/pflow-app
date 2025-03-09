#!/bin/bash

# Read the SVG file and encode it in base64
base64_encoded=$(cat model.svg | base64)

# Create the data URL
data_url="data:image/svg+xml;base64,${base64_encoded}"

# Output the data URL
echo "<object type=\"image/xvg+xml\" data=\"${data_url}\" />"
