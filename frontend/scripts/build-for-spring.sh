#!/bin/bash

# Build script to integrate Next.js with Spring Boot
set -e

echo "🚀 Building Next.js application for Spring Boot integration..."

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf out/
rm -rf ../backend/src/main/resources/static/nextjs/

# Build Next.js application
echo "📦 Building Next.js application..."
npm run build

# Create Spring Boot static directory if it doesn't exist
mkdir -p ../backend/src/main/resources/static/nextjs/

# Copy built files to Spring Boot static directory
echo "📋 Copying files to Spring Boot static directory..."
cp -r out/* ../backend/src/main/resources/static/nextjs/

echo "✅ Build completed successfully!"
echo "📍 Files copied to: ../backend/src/main/resources/static/nextjs/"

# Optional: Start Spring Boot if requested
if [ "$1" = "--start-backend" ]; then
  echo "🚀 Starting Spring Boot backend..."
  cd ../backend
  mvn spring-boot:run
fi