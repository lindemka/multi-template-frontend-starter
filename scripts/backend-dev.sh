#!/bin/bash

# Backend development with auto-restart on code changes

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}🔥 Backend Development Mode (with Auto-Restart)${NC}"
echo -e "${YELLOW}Spring Boot DevTools will auto-restart on Java changes${NC}"
echo ""

# Kill existing backend
pkill -f "java.*multi-template-demo" || true
pkill -f "mvn spring-boot:run" || true

# Enable DevTools
export SPRING_DEVTOOLS_RESTART_ENABLED=true
export SPRING_DEVTOOLS_RESTART_POLL_INTERVAL=2
export SPRING_DEVTOOLS_RESTART_QUIET_PERIOD=1

cd backend

echo -e "${BLUE}Starting backend with DevTools...${NC}"
echo -e "${YELLOW}Changes to Java files will trigger automatic restart${NC}"
echo ""

# Run with DevTools enabled
mvn spring-boot:run -Dspring-boot.run.fork=false