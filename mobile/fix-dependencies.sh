#!/bin/bash

echo "🔧 Fixing Mobile App Dependencies..."

# Remove node_modules and package-lock.json
echo "Cleaning up existing dependencies..."
rm -rf node_modules
rm -f package-lock.json

# Use the simplified package.json without TensorFlow.js conflicts
echo "Using simplified package.json..."
cp package-simple.json package.json

# Install dependencies with legacy peer deps to resolve conflicts
echo "Installing dependencies..."
npm install --legacy-peer-deps

echo "✅ Dependencies fixed!"
echo "You can now run: expo start"
