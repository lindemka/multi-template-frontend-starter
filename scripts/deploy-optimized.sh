#!/bin/bash

# Optimized deployment script with all improvements
set -e

echo "🚀 Starting optimized deployment..."

# Load environment variables
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

# Check required environment variables
required_vars=("DB_PASSWORD" "JWT_SECRET" "JWT_REFRESH_SECRET")
for var in "${required_vars[@]}"; do
    if [ -z "${!var}" ]; then
        echo "❌ Error: $var is not set in environment"
        exit 1
    fi
done

# Run database migrations
echo "📊 Running database migrations..."
psql -h ${DB_HOST:-localhost} -p ${DB_PORT:-5432} -U ${DB_USERNAME:-postgres} -d ${DB_NAME:-fbase} < scripts/database/01_add_indexes.sql

# Build backend with caching enabled
echo "🔨 Building backend..."
cd backend
mvn clean package -DskipTests

# Build frontend with optimizations
echo "🎨 Building frontend..."
cd ../frontend
npm ci
npm run build

# Copy frontend build to Spring Boot static resources
echo "📦 Copying frontend build to backend..."
rm -rf ../backend/src/main/resources/static/nextjs
cp -r out ../backend/src/main/resources/static/nextjs

# Start the application
echo "✅ Starting optimized application..."
cd ../backend
java -jar \
  -Dspring.profiles.active=production \
  -Dspring.cache.type=caffeine \
  -Xmx2g \
  -XX:+UseG1GC \
  target/fbase-0.0.1-SNAPSHOT.jar

echo "🎉 Deployment complete! Application is running with optimizations."