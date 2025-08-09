#!/bin/bash

# PRODUCTION BUILD & RUN SCRIPT
# This script STOPS all servers and runs production build
# Use ./deploy.sh if you want to keep dev servers running

set -euo pipefail

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

# Step 2: Build Next.js application (server mode)
echo -e "${BLUE}Step 2: Building Next.js application...${NC}"
cd frontend
# Ensure dependencies are up to date
npm ci || npm install
# Clean any previous builds
rm -rf .next
# Build with production flag (Next.js server runtime)
NODE_ENV=production npm run build
cd ..

# Step 3: Start Next.js server (port 3000)
echo -e "${BLUE}Step 3: Starting Next.js server (port 3000)...${NC}"
pkill -f "next start" || true
cd frontend
nohup npx next start -p 3000 > ../frontend-start.log 2>&1 &
NEXT_PID=$!
cd ..
echo "Next.js started with PID: $NEXT_PID"

# Wait for Next.js to start
for i in {1..60}; do
    if curl -s http://localhost:3000/ > /dev/null; then
        echo -e "${GREEN}✅ Next.js server is running on http://localhost:3000${NC}"
        break
    fi
    echo -n "."
    sleep 1
done
echo ""

# Step 5: Build Spring Boot application
echo -e "${BLUE}Step 5: Building Spring Boot application...${NC}"
cd backend
# Ensure Java 21 for this Maven invocation
JAVA_21_PATH=""
if command -v /usr/libexec/java_home >/dev/null 2>&1; then
  JAVA_21_PATH=$(/usr/libexec/java_home -v 21 2>/dev/null || echo "")
fi
if [ -z "$JAVA_21_PATH" ] && command -v jenv >/dev/null 2>&1; then
  JAVA_21_PATH=$(jenv which java 2>/dev/null | xargs dirname | xargs dirname || echo "")
fi
if [ -n "$JAVA_21_PATH" ]; then
  echo -e "${BLUE}Using Java 21 at ${JAVA_21_PATH} for Maven build${NC}"
  JAVA_HOME="$JAVA_21_PATH" PATH="$JAVA_21_PATH/bin:$PATH" mvn -q -DskipTests package
else
  echo -e "${YELLOW}Java 21 path not auto-detected; attempting build with current Java...${NC}"
  mvn -q -DskipTests package
fi

# Verify Spring Boot build
if [ ! -f "target/fbase-0.0.1-SNAPSHOT.jar" ]; then
    echo -e "${RED}Error: Spring Boot build failed - JAR not found${NC}"
    exit 1
fi

# Step 6: Kill any existing Spring Boot process
echo -e "${BLUE}Step 6: Stopping any existing Spring Boot instances...${NC}"
pkill -f "java.*fbase" || true
sleep 2

# Step 7: Start Spring Boot
echo -e "${BLUE}Step 7: Starting Spring Boot application...${NC}"
# Make sure we're in the backend directory
pwd
ls -la target/*.jar
nohup java -jar target/fbase-0.0.1-SNAPSHOT.jar > server.log 2>&1 &
SPRING_PID=$!
echo "Spring Boot started with PID: $SPRING_PID"

# Wait for Spring Boot to start
echo -e "${BLUE}Waiting for Spring Boot to start...${NC}"
for i in {1..60}; do
    if curl -s http://localhost:8080/health > /dev/null; then
        echo -e "${GREEN}✅ Application is running!${NC}"
        break
    fi
    echo -n "."
    sleep 1
done
echo ""

# Step 8: Open browser
echo -e "${BLUE}Step 8: Opening browser...${NC}"
open http://localhost:3000/

# Summary
echo -e "${GREEN}✅ Production build and deployment completed!${NC}"
echo -e "${GREEN}Application is now running at:${NC}"
echo -e "${GREEN}  Frontend: http://localhost:3000/${NC}"
echo -e "${GREEN}  Dashboard: http://localhost:3000/dashboard/${NC}"
echo -e "${GREEN}  Backend health: http://localhost:8080/health${NC}"
echo -e "${GREEN}${NC}"
echo -e "${GREEN}Commands:${NC}"
echo -e "${GREEN}  Stop: pkill -f \"java.*fbase\"${NC}"
echo -e "${GREEN}  Status: ./scripts/status.sh${NC}"
echo -e "${GREEN}  View logs: tail -f backend/server.log${NC}"