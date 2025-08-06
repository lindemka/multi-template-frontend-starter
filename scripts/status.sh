#!/bin/bash

# Simple status check for development servers

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🔍 Development Server Status${NC}"
echo ""

# Check Frontend
echo -e "${YELLOW}Frontend (port 3000):${NC}"
if curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Running${NC}"
    FRONTEND_PID=$(lsof -ti:3000 2>/dev/null || echo "unknown")
    echo -e "   PID: $FRONTEND_PID"
else
    echo -e "${RED}❌ Not running${NC}"
fi

echo ""

# Check Backend
echo -e "${YELLOW}Backend (port 8080):${NC}"
if curl -s http://localhost:8080/api/users > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Running${NC}"
    BACKEND_PID=$(lsof -ti:8080 2>/dev/null || echo "unknown")
    echo -e "   PID: $BACKEND_PID"
    USER_COUNT=$(curl -s http://localhost:8080/api/users | jq 'length' 2>/dev/null || echo "?")
    echo -e "   Users in database: $USER_COUNT"
else
    echo -e "${RED}❌ Not running${NC}"
fi

echo ""
echo -e "${YELLOW}Commands:${NC}"
echo -e "  ${GREEN}Start:${NC} ./scripts/dev.sh"
echo -e "  ${GREEN}Stop:${NC} ./scripts/dev.sh stop"
echo -e "  ${GREEN}Build:${NC} ./scripts/build.sh"
echo ""
echo -e "${YELLOW}Access Points:${NC}"
echo -e "  ${GREEN}Dashboard:${NC} http://localhost:3000/dashboard/"
echo -e "  ${GREEN}API:${NC} http://localhost:8080/api/users"