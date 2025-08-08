#!/bin/bash

# Simple Deployment Script - Runs backend JAR only
# Frontend continues to run on development server

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${CYAN}🚀 SIMPLE DEPLOYMENT - BACKEND ONLY${NC}"
echo -e "${CYAN}====================================${NC}"
echo ""

# Check PostgreSQL
echo -e "${BLUE}🗄️ Checking PostgreSQL...${NC}"
if PGPASSWORD=password psql -h localhost -p 5432 -U postgres -d project1 -c "SELECT 1" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ PostgreSQL is running${NC}"
else
    echo -e "${RED}❌ PostgreSQL is not running!${NC}"
    echo -e "${YELLOW}Starting PostgreSQL...${NC}"
    brew services start postgresql@16 2>/dev/null || brew services start postgresql 2>/dev/null || true
    sleep 3
fi

# Build backend
echo -e "${BLUE}📦 Building Backend...${NC}"
cd backend
mvn clean package -DskipTests

if [ ! -f "target/fbase-0.0.1-SNAPSHOT.jar" ]; then
    echo -e "${RED}❌ Build failed${NC}"
    exit 1
fi

# Stop existing backend
echo -e "${BLUE}🛑 Stopping existing backend...${NC}"
pkill -f "java.*fbase" 2>/dev/null || true
kill $(lsof -ti:8080) 2>/dev/null || true
sleep 2

# Start backend
echo -e "${BLUE}🚀 Starting Backend...${NC}"
nohup java -jar target/fbase-0.0.1-SNAPSHOT.jar > production.log 2>&1 &
BACKEND_PID=$!

echo -e "${GREEN}✅ Backend started with PID: $BACKEND_PID${NC}"

# Wait for backend
echo -e "${CYAN}Waiting for backend to start...${NC}"
for i in {1..30}; do
    if curl -s http://localhost:8080/api/members > /dev/null 2>&1; then
        echo ""
        echo -e "${GREEN}✅ Backend is running!${NC}"
        break
    fi
    echo -n "."
    sleep 1
done

cd ..

echo ""
echo -e "${GREEN}🎉 DEPLOYMENT COMPLETE!${NC}"
echo ""
echo -e "${CYAN}📊 System Status:${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

# Check frontend
if lsof -ti:3000 > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Frontend:   http://localhost:3000 (dev mode)${NC}"
else
    echo -e "${YELLOW}⚠️  Frontend:   Not running${NC}"
    echo -e "${YELLOW}   Start with:  cd frontend && npm run dev${NC}"
fi

echo -e "${GREEN}✅ Backend:    http://localhost:8080 (production)${NC}"
echo -e "${GREEN}✅ API:        http://localhost:8080/api/members${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${CYAN}📝 Test Login:${NC}"
echo -e "   Username: sarah.chen"
echo -e "   Password: password123"
echo ""
echo -e "${CYAN}🛠️ Commands:${NC}"
echo -e "   Backend logs:  ${YELLOW}tail -f backend/production.log${NC}"
echo -e "   Stop backend:  ${YELLOW}kill $BACKEND_PID${NC}"
echo -e "   Start frontend: ${YELLOW}cd frontend && npm run dev${NC}"
echo ""

# Start frontend if not running
if ! lsof -ti:3000 > /dev/null 2>&1; then
    echo -e "${BLUE}🌐 Starting frontend development server...${NC}"
    cd frontend
    nohup npm run dev > frontend.log 2>&1 &
    FRONTEND_PID=$!
    echo -e "${GREEN}✅ Frontend started with PID: $FRONTEND_PID${NC}"
    cd ..
    sleep 5
fi

# Open browser
if [[ "$OSTYPE" == "darwin"* ]]; then
    echo -e "${BLUE}🌐 Opening application...${NC}"
    open http://localhost:3000/login
fi

echo -e "${GREEN}✨ Application is ready!${NC}"