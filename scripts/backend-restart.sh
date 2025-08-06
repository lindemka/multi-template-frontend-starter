#!/bin/bash

# Backend-only restart script - keeps frontend running!

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}🔄 Restarting Backend Only...${NC}"
echo -e "${GREEN}Frontend will keep running without interruption!${NC}"
echo ""

# Kill only backend process
echo -e "${YELLOW}Stopping backend...${NC}"
pkill -f "java.*multi-template-demo" || true
pkill -f "mvn spring-boot:run" || true
sleep 2

# Check if frontend is running
FRONTEND_RUNNING=false
if lsof -ti:3000 > /dev/null 2>&1; then
    FRONTEND_RUNNING=true
    echo -e "${GREEN}✅ Frontend is still running on port 3000${NC}"
else
    echo -e "${YELLOW}⚠️  Frontend is not running. Start it with ./dev-frontend.sh${NC}"
fi

# Start backend
echo -e "${BLUE}Starting backend...${NC}"
cd backend
nohup mvn spring-boot:run > backend.log 2>&1 &
BACKEND_PID=$!
echo "Backend PID: $BACKEND_PID"

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

# Summary
echo -e "${GREEN}✅ Backend restarted successfully!${NC}"
echo -e "${GREEN}Backend PID: $BACKEND_PID${NC}"
if [ "$FRONTEND_RUNNING" = true ]; then
    echo -e "${GREEN}Frontend: Still running (no interruption)${NC}"
else
    echo -e "${YELLOW}Frontend: Not running - start with ./dev-frontend.sh${NC}"
fi
echo -e "${GREEN}API: http://localhost:8080/api/users${NC}"
echo -e "${GREEN}Logs: tail -f backend/backend.log${NC}"