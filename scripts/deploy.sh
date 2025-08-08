#!/bin/bash

# Deploy script that keeps dev servers running
# This script only builds artifacts without stopping anything
set -euo pipefail

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}🚀 Production Build (Dev servers stay running)${NC}"
echo ""

# Check if frontend dev server is running
if lsof -ti:3000 > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Frontend dev server is running on port 3000 (will stay running)${NC}"
else
    echo -e "${YELLOW}⚠️  Frontend dev server is not running${NC}"
    echo -e "${YELLOW}   Start it with: ./scripts/dev.sh --frontend-only${NC}"
fi

# Check if backend is running
if curl -s http://localhost:8080/api/users > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Backend is running on port 8080 (will stay running)${NC}"
else
    echo -e "${YELLOW}⚠️  Backend is not running${NC}"
    echo -e "${YELLOW}   Start it with: ./scripts/dev.sh --backend-only${NC}"
fi

echo ""
echo -e "${BLUE}📦 Building frontend for production...${NC}"

# Build frontend
cd frontend
npm ci || npm install
if npm run build; then
    echo -e "${GREEN}✅ Frontend build successful${NC}"
else
    echo -e "${RED}❌ Frontend build failed${NC}"
    exit 1
fi

# Copy to Spring Boot resources (build already outputs there)
echo -e "${BLUE}📋 Frontend artifacts ready...${NC}"

# No redirect needed - Next.js exports to root
echo -e "${BLUE}🔄 Next.js exports directly to root (no redirect needed)${NC}"

# Build backend JAR
echo -e "${BLUE}📦 Building Spring Boot JAR...${NC}"
cd ../backend
if mvn -q -DskipTests package; then
    echo -e "${GREEN}✅ Backend build successful${NC}"
else
    echo -e "${RED}❌ Backend build failed${NC}"
    exit 1
fi

cd ..

echo ""
echo -e "${GREEN}✅ Build complete!${NC}"
echo ""
echo -e "${YELLOW}📝 Next steps:${NC}"
echo -e "   1. Your dev servers are still running (frontend on :3000, backend on :8080)"
echo -e "   2. To test JAR:"
echo -e "      ${BLUE}pkill -f 'java.*fbase' || true && java -jar backend/target/fbase-0.0.1-SNAPSHOT.jar${NC}"
echo ""
echo -e "${GREEN}💡 Tip: Keep using ./dev.sh for development!${NC}"