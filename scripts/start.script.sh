#!/bin/bash

# Function to display checkmark
function checkmark {
  echo -e " ✅"
}

# Function to display cross mark
function crossmark {
  echo -e " ❌"
}

# Install dependencies
echo -n "🚀 Installing dependencies..."
npm install >/dev/null 2>&1 && checkmark || crossmark

if [ $? -ne 0 ]; then
  exit 1
fi

# Setting Node environment
echo -n "Setting Node environment to production"
export NODE_ENV=production >/dev/null 2>&1 && checkmark || crossmark

if [ $? -ne 0 ]; then
  exit 1
fi

# Setting Node environment
echo -n "Setting congiguration directory"
export NODE_CONFIG_DIR=./src/config >/dev/null 2>&1 && checkmark || crossmark

if [ $? -ne 0 ]; then
  exit 1
fi

# Start the server
echo "🌐 Starting production server.."
cross-env ts-node src/server.ts

if [ $? -ne 0 ]; then
  exit 1
fi
