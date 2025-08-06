#!/bin/bash

# FAST Frontend-only development script
# Use this when you only need to iterate on frontend code

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}⚡ FAST Frontend Development Mode${NC}"
echo -e "${YELLOW}This assumes backend is already running on port 8080${NC}"
echo ""

# Check if backend is running
if ! curl -s http://localhost:8080/api/users > /dev/null 2>&1; then
    echo -e "${RED}❌ Backend is not running!${NC}"
    echo -e "${YELLOW}Start it with: cd backend && mvn spring-boot:run${NC}"
    echo -e "${YELLOW}Or use ./dev.sh for full stack${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Backend detected on port 8080${NC}"

# Kill any existing frontend
pkill -f "next dev" || true

# Start frontend with Turbo mode
cd frontend
echo -e "${BLUE}Starting Next.js with Turbopack (FAST mode)...${NC}"

# Set development environment variables for maximum performance
export NEXT_TELEMETRY_DISABLED=1
export NODE_ENV=development

# Start with turbopack for fastest hot reload in background
nohup npm run dev -- --turbo > frontend.log 2>&1 &
FRONTEND_PID=$!

echo -e "${GREEN}✅ Frontend started with PID: $FRONTEND_PID${NC}"
echo ""
echo -e "${YELLOW}Access at:${NC}"
echo -e "  Frontend: ${GREEN}http://localhost:3000${NC}"
echo -e "  Backend: ${GREEN}http://localhost:8080${NC}"
echo ""
echo -e "${YELLOW}Logs:${NC}"
echo -e "  Frontend: ${GREEN}tail -f frontend/frontend.log${NC}"
echo ""
echo -e "${YELLOW}To stop:${NC}"
echo -e "  ${GREEN}kill $FRONTEND_PID${NC} or ${GREEN}./dev.sh stop${NC}"