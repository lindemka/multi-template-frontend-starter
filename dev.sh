#!/bin/bash

# Development script for fast frontend development
# This runs both backend and frontend with hot reloading

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Get the directory where this script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

echo -e "${BLUE}🚀 Starting development environment...${NC}"
echo ""
echo -e "${YELLOW}This will start:${NC}"
echo -e "  - Spring Boot backend on ${GREEN}http://localhost:8080${NC}"
echo -e "  - Next.js frontend on ${GREEN}http://localhost:3000${NC}"
echo -e "  - Hot reloading enabled for instant updates"
echo ""
echo -e "${YELLOW}Access points:${NC}"
echo -e "  - Dashboard: ${GREEN}http://localhost:3000/dashboard/${NC}"
echo -e "  - API: ${GREEN}http://localhost:8080/api/users${NC}"
echo ""
echo -e "${YELLOW}Commands:${NC}"
echo -e "  - Stop servers: ${GREEN}./dev.sh stop${NC}"
echo -e "  - View logs: ${GREEN}tail -f backend/backend.log${NC} or ${GREEN}tail -f frontend/frontend.log${NC}"
echo ""

# Function to stop servers
stop_servers() {
    echo -e "${BLUE}Stopping development servers...${NC}"
    pkill -f "java.*multi-template-demo" || true
    pkill -f "next dev" || true
    rm -f backend/backend.log frontend/frontend.log
    echo -e "${GREEN}✅ Servers stopped${NC}"
    exit 0
}

# Check for stop command
if [ "$1" = "stop" ]; then
    stop_servers
fi

# Kill any existing processes
echo -e "${BLUE}Cleaning up existing processes...${NC}"
pkill -f "java.*multi-template-demo" || true
pkill -f "next dev" || true
sleep 2

# Start backend server
echo -e "${BLUE}Starting Spring Boot backend...${NC}"
cd backend
nohup mvn spring-boot:run > backend.log 2>&1 &
BACKEND_PID=$!
echo "Backend PID: $BACKEND_PID"
cd ..

# Wait for backend to start
echo -e "${BLUE}Waiting for backend to start...${NC}"
for i in {1..30}; do
    if curl -s http://localhost:8080/api/users > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Backend is running!${NC}"
        break
    fi
    echo -n "."
    sleep 1
done
echo ""

# Start frontend server
echo -e "${BLUE}Starting Next.js frontend...${NC}"
cd frontend
npm install
nohup npm run dev > frontend.log 2>&1 &
FRONTEND_PID=$!
echo "Frontend PID: $FRONTEND_PID"
cd ..

# Wait for frontend to start
echo -e "${BLUE}Waiting for frontend to start...${NC}"
for i in {1..30}; do
    if curl -s http://localhost:3000 > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Frontend is running!${NC}"
        break
    fi
    echo -n "."
    sleep 1
done
echo ""

# Summary
echo -e "${GREEN}✅ Development environment is ready!${NC}"
echo -e "${GREEN}${NC}"
echo -e "${GREEN}Access points:${NC}"
echo -e "${GREEN}  - Dashboard: http://localhost:3000/dashboard/${NC}"
echo -e "${GREEN}  - API: http://localhost:8080/api/users${NC}"
echo -e "${GREEN}${NC}"
echo -e "${GREEN}Process IDs:${NC}"
echo -e "${GREEN}  - Backend: $BACKEND_PID${NC}"
echo -e "${GREEN}  - Frontend: $FRONTEND_PID${NC}"
echo -e "${GREEN}${NC}"
echo -e "${GREEN}Logs:${NC}"
echo -e "${GREEN}  - Backend: tail -f backend/backend.log${NC}"
echo -e "${GREEN}  - Frontend: tail -f frontend/frontend.log${NC}"
echo -e "${GREEN}${NC}"
echo -e "${GREEN}To stop: ./dev.sh stop${NC}"