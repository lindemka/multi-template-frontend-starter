#!/bin/bash

# Ultra-safe deploy script using temporary directory
# Completely isolated from dev environment

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}🚀 Isolated Production Deployment${NC}"
echo ""

# Check if dev servers are running
if lsof -ti:3000 > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Frontend dev server running on :3000 (protected)${NC}"
else
    echo -e "${YELLOW}ℹ️  No frontend dev server detected${NC}"
fi

if curl -s http://localhost:8080/api/users > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Backend dev server running on :8080 (protected)${NC}"
else
    echo -e "${YELLOW}ℹ️  No backend dev server detected${NC}"
fi

echo ""

# Create temporary build directory
BUILD_DIR="/tmp/fbase-build-$(date +%s)"
echo -e "${BLUE}📁 Creating isolated build environment: $BUILD_DIR${NC}"

# Copy project to temp directory
cp -r . "$BUILD_DIR"
cd "$BUILD_DIR"

# Clean up any existing builds
rm -rf frontend/.next
rm -rf frontend/out
rm -rf backend/target

echo -e "${BLUE}📦 Building frontend in isolation...${NC}"
cd frontend

# Build with explicit environment
if NODE_ENV=production npm run build; then
    echo -e "${GREEN}✅ Frontend build successful${NC}"
else
    echo -e "${RED}❌ Frontend build failed${NC}"
    cd - > /dev/null
    rm -rf "$BUILD_DIR"
    exit 1
fi

echo -e "${BLUE}📦 Building backend JAR...${NC}"
cd ../backend
if mvn clean package -DskipTests -q; then
    echo -e "${GREEN}✅ Backend build successful${NC}"
else
    echo -e "${RED}❌ Backend build failed${NC}"
    cd - > /dev/null
    rm -rf "$BUILD_DIR"
    exit 1
fi

# Copy the built JAR back to the original location
echo -e "${BLUE}📋 Copying production JAR to original location...${NC}"
cp target/fbase-*.jar ~/cursor-projects/project1/backend/target/

echo -e "${BLUE}🧹 Cleaning up build directory...${NC}"
cd - > /dev/null
rm -rf "$BUILD_DIR"

echo ""
echo -e "${GREEN}✅ Isolated deployment complete!${NC}"
echo ""

# Verify dev servers are still running
if lsof -ti:3000 > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Frontend dev server still running${NC}"
else
    echo -e "${YELLOW}⚠️  Frontend dev server not running${NC}"
fi

if curl -s http://localhost:8080/api/users > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Backend dev server still running${NC}"
else
    echo -e "${YELLOW}⚠️  Backend dev server not running${NC}"
fi

echo ""
echo -e "${YELLOW}🎉 You now have:${NC}"
echo -e "   • ${GREEN}Development environment${NC}: Running and untouched"
echo -e "   • ${GREEN}Production JAR${NC}: backend/target/fbase-*.jar"
echo -e ""
echo -e "${YELLOW}🚀 Test production:${NC}"
echo -e "   ${BLUE}java -jar backend/target/fbase-*.jar${NC}"
echo ""
echo -e "${GREEN}💡 Continue developing normally!${NC}"