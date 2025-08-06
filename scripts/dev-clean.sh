#!/bin/bash

# Development script with automatic cache cleaning
# Prevents webpack module loading issues

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}🧹 Starting clean development environment...[0m"

# Stop any running servers
echo -e "${BLUE}Stopping existing servers...[0m"
./scripts/dev.sh stop 2>/dev/null || true

# Clean Next.js cache and build artifacts
echo -e "${BLUE}Cleaning Next.js cache...[0m"
rm -rf frontend/.next
rm -rf frontend/out
rm -rf frontend/node_modules/.cache
rm -rf frontend/.swc

# Clean webpack artifacts that can cause module loading issues
echo -e "${BLUE}Cleaning webpack artifacts...[0m"
find frontend -name "*.webpack.js" -delete 2>/dev/null || true
find frontend -name "webpack-runtime.js" -delete 2>/dev/null || true

# Start development servers
echo -e "${BLUE}Starting fresh development environment...[0m"
./scripts/dev.sh

echo ""
echo -e "${GREEN}✅ Clean development environment ready![0m"
echo -e "${YELLOW}💡 Use this script whenever you encounter webpack module errors[0m"