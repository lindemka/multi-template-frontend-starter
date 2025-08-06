#!/bin/bash

# Deploy script that keeps dev servers running
# This script only builds and deploys without stopping anything

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}🚀 Production Deployment (Dev servers stay running)${NC}"
echo ""

# Check if frontend dev server is running
if lsof -ti:3000 > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Frontend dev server is running on port 3000 (will stay running)${NC}"
else
    echo -e "${YELLOW}⚠️  Frontend dev server is not running${NC}"
    echo -e "${YELLOW}   Start it with: ./dev-frontend.sh${NC}"
fi

# Check if backend is running
if curl -s http://localhost:8080/api/users > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Backend is running on port 8080 (will stay running)${NC}"
else
    echo -e "${YELLOW}⚠️  Backend is not running${NC}"
    echo -e "${YELLOW}   Start it with: ./backend-restart.sh${NC}"
fi

echo ""
echo -e "${BLUE}📦 Building frontend for production...${NC}"

# Build frontend
cd frontend
if npm run build; then
    echo -e "${GREEN}✅ Frontend build successful${NC}"
else
    echo -e "${RED}❌ Frontend build failed${NC}"
    exit 1
fi

# Copy to Spring Boot resources (build already outputs there)
echo -e "${BLUE}📋 Frontend already built to Spring Boot resources...${NC}"

# No redirect needed - Next.js exports to root
echo -e "${BLUE}🔄 Next.js exports directly to root (no redirect needed)${NC}"

# Build backend JAR
echo -e "${BLUE}📦 Building Spring Boot JAR...${NC}"
cd ../backend
if mvn clean package -DskipTests; then
    echo -e "${GREEN}✅ Backend build successful${NC}"
else
    echo -e "${RED}❌ Backend build failed${NC}"
    exit 1
fi

cd ..

echo ""
echo -e "${GREEN}✅ Deployment complete!${NC}"
echo ""
echo -e "${YELLOW}📝 Next steps:${NC}"
echo -e "   1. Your dev servers are still running (frontend on :3000, backend on :8080)"
echo -e "   2. To test production build: Stop backend and run:"
echo -e "      ${BLUE}java -jar backend/target/fbase-0.0.1-SNAPSHOT.jar${NC}"
echo -e "   3. To restart backend only: ${BLUE}./backend-restart.sh${NC}"
echo ""
echo -e "${GREEN}💡 Tip: Keep using ./dev.sh for development!${NC}"