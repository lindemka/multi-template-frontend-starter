#!/bin/bash

# PRODUCTION BUILD & RUN SCRIPT
# This script STOPS all servers and runs production build
# Use ./deploy.sh if you want to keep dev servers running

# Exit on any error
set -e

# Get the project root directory (parent of scripts directory)
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
cd "$PROJECT_ROOT"

echo "🔨 Starting PRODUCTION build (will stop dev servers)..."
echo "💡 Tip: Use ./scripts/deploy.sh to build without stopping dev servers"
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Step 1: Clean old builds
echo -e "${BLUE}Step 1: Cleaning old builds...${NC}"
rm -rf backend/src/main/resources/static/*
rm -rf backend/target

# Step 2: Build Next.js application
echo -e "${BLUE}Step 2: Building Next.js application...${NC}"
cd frontend
# Ensure dependencies are up to date
npm install
# Clean any previous builds
rm -rf .next
# Build with production flag
NODE_ENV=production npm run build

# Verify Next.js build output (it builds directly to Spring Boot static root)
if [ ! -f "../backend/src/main/resources/static/index.html" ]; then
    echo -e "${RED}Error: Next.js build failed - no index.html found${NC}"
    exit 1
fi

# Step 3 is no longer needed as Next.js builds directly to the right place
echo -e "${BLUE}Step 3: Next.js already built to Spring Boot location...${NC}"
cd ..

# Step 4: No redirect needed - Next.js exports to root
echo -e "${BLUE}Step 4: Next.js exports directly to root (no redirect needed)...${NC}"

# Step 5: Build Spring Boot application
echo -e "${BLUE}Step 5: Building Spring Boot application...${NC}"
cd backend
mvn clean package -DskipTests

# Verify Spring Boot build
if [ ! -f "target/multi-template-demo-0.0.1-SNAPSHOT.jar" ]; then
    echo -e "${RED}Error: Spring Boot build failed - JAR not found${NC}"
    exit 1
fi

# Step 6: Kill any existing Spring Boot process
echo -e "${BLUE}Step 6: Stopping any existing Spring Boot instances...${NC}"
pkill -f "java.*multi-template-demo" || true
sleep 2

# Step 7: Start Spring Boot
echo -e "${BLUE}Step 7: Starting Spring Boot application...${NC}"
# Make sure we're in the backend directory
pwd
ls -la target/*.jar
nohup java -jar target/multi-template-demo-0.0.1-SNAPSHOT.jar > server.log 2>&1 &
SPRING_PID=$!
echo "Spring Boot started with PID: $SPRING_PID"

# Wait for Spring Boot to start
echo -e "${BLUE}Waiting for Spring Boot to start...${NC}"
for i in {1..30}; do
    if curl -s http://localhost:8080/api/users > /dev/null; then
        echo -e "${GREEN}✅ Application is running!${NC}"
        break
    fi
    echo -n "."
    sleep 1
done
echo ""

# Step 8: Open browser
echo -e "${BLUE}Step 8: Opening browser...${NC}"
open http://localhost:8080/

# Summary
echo -e "${GREEN}✅ Production build and deployment completed!${NC}"
echo -e "${GREEN}Application is now running at:${NC}"
echo -e "${GREEN}  Main: http://localhost:8080/${NC}"
echo -e "${GREEN}  Dashboard: http://localhost:8080/dashboard/${NC}"
echo -e "${GREEN}  API: http://localhost:8080/api/users${NC}"
echo -e "${GREEN}${NC}"
echo -e "${GREEN}Commands:${NC}"
echo -e "${GREEN}  Stop: pkill -f \"java.*multi-template-demo\"${NC}"
echo -e "${GREEN}  Status: ./scripts/status.sh${NC}"
echo -e "${GREEN}  View logs: tail -f backend/server.log${NC}"