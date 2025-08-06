#!/bin/bash

# Quick status check for frontend and backend

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🔍 Checking Project Status...${NC}"
echo ""

# Check Frontend
echo -e "${YELLOW}Frontend Status:${NC}"
if lsof -ti:3000 > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Frontend is running on port 3000${NC}"
    FRONTEND_PID=$(lsof -ti:3000)
    echo -e "   PID: $FRONTEND_PID"
else
    echo -e "${RED}❌ Frontend is not running${NC}"
    echo -e "   Start with: ./scripts/dev-frontend.sh"
fi

echo ""

# Check Backend
echo -e "${YELLOW}Backend Status:${NC}"
if curl -s http://localhost:8080/api/users > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Backend is running on port 8080${NC}"
    BACKEND_PID=$(lsof -ti:8080)
    echo -e "   PID: $BACKEND_PID"
    # Count users
    USER_COUNT=$(curl -s http://localhost:8080/api/users | jq 'length' 2>/dev/null || echo "?")
    echo -e "   Users in database: $USER_COUNT"
else
    echo -e "${RED}❌ Backend is not running${NC}"
    echo -e "   Start with: ./scripts/backend-restart.sh"
fi

echo ""
echo -e "${YELLOW}Quick Actions:${NC}"
echo -e "  ${GREEN}Start both:${NC} ./scripts/dev.sh"
echo -e "  ${GREEN}Frontend only:${NC} ./scripts/dev-frontend.sh"
echo -e "  ${GREEN}Restart backend:${NC} ./scripts/backend-restart.sh"
echo -e "  ${GREEN}Stop all:${NC} ./scripts/dev.sh stop"