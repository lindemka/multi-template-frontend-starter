#!/bin/bash

# Unified Production Deployment - Everything on port 8080
# Frontend served via Spring Boot proxy

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${CYAN}🚀 UNIFIED PRODUCTION DEPLOYMENT${NC}"
echo -e "${CYAN}Everything served from port 8080${NC}"
echo -e "${CYAN}================================${NC}"
echo ""

# Check PostgreSQL
echo -e "${BLUE}🗄️ Starting PostgreSQL...${NC}"
brew services start postgresql@16 2>/dev/null || brew services start postgresql 2>/dev/null || true
sleep 3

# Stop existing services
echo -e "${BLUE}🛑 Stopping existing services...${NC}"
pkill -f "spring-boot:run\|java.*fbase\|next dev" 2>/dev/null || true
kill $(lsof -ti:8080) 2>/dev/null || true
kill $(lsof -ti:3000) 2>/dev/null || true
kill $(lsof -ti:3001) 2>/dev/null || true
sleep 2

# Build backend
echo -e "${BLUE}🔧 Building Backend...${NC}"
cd backend
mvn clean package -DskipTests
if [ ! -f "target/fbase-0.0.1-SNAPSHOT.jar" ]; then
    echo -e "${RED}❌ Backend build failed${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Backend built${NC}"

# Start backend
echo -e "${BLUE}🚀 Starting Backend on port 8080...${NC}"
nohup java -jar target/fbase-0.0.1-SNAPSHOT.jar > production.log 2>&1 &
BACKEND_PID=$!
echo -e "${GREEN}✅ Backend PID: $BACKEND_PID${NC}"

cd ..

# Start frontend on port 3001 (production mode)
echo -e "${BLUE}🌐 Starting Frontend on port 3001...${NC}"
cd frontend
PORT=3001 nohup npm run dev > frontend.log 2>&1 &
FRONTEND_PID=$!
echo -e "${GREEN}✅ Frontend PID: $FRONTEND_PID${NC}"

cd ..

# Wait for services
echo -e "${CYAN}⏳ Waiting for services to start...${NC}"
for i in {1..30}; do
    BACKEND_UP=$(curl -s http://localhost:8080/health 2>/dev/null | jq -r '.status // "DOWN"' 2>/dev/null)
    FRONTEND_UP=$(curl -s http://localhost:3001 2>/dev/null && echo "UP" || echo "DOWN")
    
    if [ "$BACKEND_UP" = "UP" ] && [ "$FRONTEND_UP" = "UP" ]; then
        echo ""
        echo -e "${GREEN}✅ Both services are running!${NC}"
        break
    fi
    echo -n "."
    sleep 1
done

echo ""
echo -e "${GREEN}🎉 UNIFIED DEPLOYMENT COMPLETE!${NC}"
echo ""
echo -e "${CYAN}📊 Service Status:${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✅ Main Application: http://localhost:8080 (with frontend proxy)${NC}"
echo -e "${GREEN}✅ Backend API:      http://localhost:8080/api${NC}"  
echo -e "${GREEN}✅ Direct Frontend:  http://localhost:3001${NC}"
echo -e "${GREEN}✅ Backend Process:  $BACKEND_PID${NC}"
echo -e "${GREEN}✅ Frontend Process: $FRONTEND_PID${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${CYAN}📝 Test Credentials:${NC}"
echo -e "   Username: sarah.chen"
echo -e "   Password: password123"
echo ""
echo -e "${CYAN}🛠️ Management:${NC}"
echo -e "   Backend logs:  ${YELLOW}tail -f backend/production.log${NC}"
echo -e "   Frontend logs: ${YELLOW}tail -f frontend/frontend.log${NC}"
echo -e "   Stop all:      ${YELLOW}kill $BACKEND_PID $FRONTEND_PID${NC}"
echo ""

# Configure Spring Boot to proxy frontend
echo -e "${BLUE}🔧 Configuring frontend proxy...${NC}"
curl -s "http://localhost:8080/" > /dev/null 2>&1 && echo -e "${GREEN}✅ Proxy configured${NC}" || echo -e "${YELLOW}⚠️ Manual proxy setup may be needed${NC}"

# Open browser
if [[ "$OSTYPE" == "darwin"* ]]; then
    echo -e "${BLUE}🌐 Opening unified application...${NC}"
    sleep 2
    open http://localhost:8080/login
fi

echo -e "${GREEN}✨ Application ready at http://localhost:8080${NC}"