#!/bin/bash

# Simple Development Environment
# Starts both frontend and backend servers

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Get project root
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
cd "$PROJECT_ROOT"

# Stop function
stop_servers() {
    echo -e "${BLUE}Stopping development servers...${NC}"
    pkill -f "java.*multi-template-demo" || true
    pkill -f "next dev" || true
    rm -f backend/backend.log frontend/frontend.log 2>/dev/null || true
    echo -e "${GREEN}✅ Servers stopped${NC}"
    exit 0
}

# Handle stop command
if [ "$1" = "stop" ]; then
    stop_servers
fi

# Start servers
echo -e "${BLUE}🚀 Starting development environment...${NC}"
echo -e "${YELLOW}  - Backend: http://localhost:8080${NC}"
echo -e "${YELLOW}  - Frontend: http://localhost:3000${NC}"
echo -e "${YELLOW}  - Dashboard: http://localhost:3000/dashboard/${NC}"
echo ""

# Clean up any existing processes
pkill -f "java.*multi-template-demo" || true
pkill -f "next dev" || true
sleep 2

# Start backend in background
echo -e "${BLUE}Starting backend...${NC}"
cd backend
nohup mvn spring-boot:run > backend.log 2>&1 &
cd ..

# Start frontend in background  
echo -e "${BLUE}Starting frontend...${NC}"
cd frontend
nohup npm run dev > frontend.log 2>&1 &
cd ..

# Wait for servers to start
echo -e "${BLUE}Waiting for servers to start...${NC}"
for i in {1..60}; do
    BACKEND_UP=$(curl -s http://localhost:8080/api/users > /dev/null 2>&1 && echo "yes" || echo "no")
    FRONTEND_UP=$(curl -s http://localhost:3000 > /dev/null 2>&1 && echo "yes" || echo "no")
    
    if [ "$BACKEND_UP" = "yes" ] && [ "$FRONTEND_UP" = "yes" ]; then
        break
    fi
    
    echo -n "."
    sleep 1
done
echo ""

# Final status check
echo -e "${GREEN}✅ Development environment ready!${NC}"
echo ""
echo -e "${GREEN}Access Points:${NC}"
echo -e "  ${YELLOW}Dashboard:${NC} http://localhost:3000/dashboard/"
echo -e "  ${YELLOW}API:${NC} http://localhost:8080/api/users"
echo ""
echo -e "${GREEN}Commands:${NC}"
echo -e "  ${YELLOW}Stop:${NC} ./scripts/dev.sh stop"
echo -e "  ${YELLOW}Status:${NC} ./scripts/status.sh"
echo ""
echo -e "${GREEN}Logs:${NC}"
echo -e "  ${YELLOW}Backend:${NC} tail -f backend/backend.log"
echo -e "  ${YELLOW}Frontend:${NC} tail -f frontend/frontend.log"