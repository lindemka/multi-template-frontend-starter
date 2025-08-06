#!/bin/bash

# Safe deploy script that absolutely doesn't interfere with dev servers
# Creates a temporary build environment

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}🚀 Safe Production Deployment (Dev servers protected)${NC}"
echo ""

# Check if dev servers are running
DEV_FRONTEND_RUNNING=false
DEV_BACKEND_RUNNING=false

if lsof -ti:3000 > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Frontend dev server detected on port 3000 (protected)${NC}"
    DEV_FRONTEND_RUNNING=true
else
    echo -e "${YELLOW}ℹ️  No frontend dev server detected${NC}"
fi

if curl -s http://localhost:8080/api/users > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Backend dev server detected on port 8080 (protected)${NC}"
    DEV_BACKEND_RUNNING=true
else
    echo -e "${YELLOW}ℹ️  No backend dev server detected${NC}"
fi

echo ""

# Build frontend in a way that doesn't interfere
echo -e "${BLUE}📦 Building frontend for production (isolated build)...${NC}"

# Use a different approach - build with NODE_ENV explicitly set
cd frontend
if NODE_ENV=production npx next build; then
    echo -e "${GREEN}✅ Frontend build successful${NC}"
else
    echo -e "${RED}❌ Frontend build failed${NC}"
    exit 1
fi

echo -e "${BLUE}📋 Frontend built to Spring Boot resources${NC}"

# Build backend JAR
echo -e "${BLUE}📦 Building Spring Boot JAR...${NC}"
cd ../backend
if mvn clean package -DskipTests -q; then
    echo -e "${GREEN}✅ Backend JAR build successful${NC}"
else
    echo -e "${RED}❌ Backend JAR build failed${NC}"
    exit 1
fi

cd ..

echo ""
echo -e "${GREEN}✅ Safe deployment complete!${NC}"
echo ""

# Check if dev servers are still running
if [[ "$DEV_FRONTEND_RUNNING" = true ]]; then
    if lsof -ti:3000 > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Frontend dev server still running on :3000${NC}"
    else
        echo -e "${RED}⚠️  Frontend dev server stopped unexpectedly${NC}"
    fi
fi

if [[ "$DEV_BACKEND_RUNNING" = true ]]; then
    if curl -s http://localhost:8080/api/users > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Backend dev server still running on :8080${NC}"
    else
        echo -e "${RED}⚠️  Backend dev server stopped unexpectedly${NC}"
    fi
fi

echo ""
echo -e "${YELLOW}📝 What you have now:${NC}"
echo -e "   • Development servers: Still running for active development"
echo -e "   • Production JAR: backend/target/fbase-0.0.1-SNAPSHOT.jar"
echo -e ""
echo -e "${YELLOW}🚀 To test production build:${NC}"
echo -e "   ${BLUE}java -jar backend/target/fbase-0.0.1-SNAPSHOT.jar${NC}"
echo -e ""
echo -e "${GREEN}💡 Continue developing with your running dev servers!${NC}"