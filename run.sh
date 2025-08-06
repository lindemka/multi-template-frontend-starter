#!/bin/bash

# Simple run script for development
# This script assumes the project is already built

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Get the directory where this script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

echo -e "${BLUE}Starting Spring Boot application...${NC}"

# Kill any existing Spring Boot process
pkill -f "java.*multi-template-demo" || true
sleep 1

# Change to backend directory
cd "$SCRIPT_DIR/backend"

# Check if JAR exists
if [ ! -f "target/multi-template-demo-0.0.1-SNAPSHOT.jar" ]; then
    echo -e "${RED}Error: JAR file not found! Run ./build.sh first${NC}"
    exit 1
fi

# Start Spring Boot
echo -e "${BLUE}Starting server...${NC}"
java -jar target/multi-template-demo-0.0.1-SNAPSHOT.jar &
SPRING_PID=$!

echo -e "${BLUE}Waiting for server to start (PID: $SPRING_PID)...${NC}"

# Wait for Spring Boot to be ready
for i in {1..30}; do
    if curl -s http://localhost:8080/api/users > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Server is running!${NC}"
        echo -e "${GREEN}Opening browser...${NC}"
        open http://localhost:8080/
        echo ""
        echo -e "${GREEN}Application URLs:${NC}"
        echo -e "${GREEN}  Main: http://localhost:8080/${NC}"
        echo -e "${GREEN}  Dashboard: http://localhost:8080/nextjs/dashboard/${NC}"
        echo -e "${GREEN}  API: http://localhost:8080/api/users${NC}"
        echo ""
        echo -e "${GREEN}To stop: kill $SPRING_PID${NC}"
        exit 0
    fi
    echo -n "."
    sleep 1
done

echo -e "${RED}Error: Server failed to start after 30 seconds${NC}"
echo -e "${RED}Check the logs with: tail -f $SCRIPT_DIR/backend/server.log${NC}"
exit 1