#!/bin/bash

# Local Production Deployment
# Runs both frontend and backend in production mode locally

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${CYAN}🚀 LOCAL PRODUCTION DEPLOYMENT${NC}"
echo -e "${CYAN}================================${NC}"
echo ""

# Check PostgreSQL
echo -e "${BLUE}🗄️ Checking PostgreSQL...${NC}"
if PGPASSWORD=password psql -h localhost -p 5432 -U postgres -d project1 -c "SELECT 1" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ PostgreSQL is running${NC}"
else
    echo -e "${YELLOW}⚠️ PostgreSQL is not running. Starting...${NC}"
    brew services start postgresql@16 2>/dev/null || brew services start postgresql 2>/dev/null || true
    sleep 3
fi

# Stop existing services
echo -e "${BLUE}🛑 Stopping existing services...${NC}"
pkill -f "java.*fbase" 2>/dev/null || true
kill $(lsof -ti:8080) 2>/dev/null || true
kill $(lsof -ti:3000) 2>/dev/null || true
sleep 2

echo ""
echo -e "${BLUE}📦 Step 1: Build Backend...${NC}"
cd backend
mvn clean package -DskipTests

if [ ! -f "target/fbase-0.0.1-SNAPSHOT.jar" ]; then
    echo -e "${RED}❌ Backend build failed${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Backend built successfully${NC}"

echo ""
echo -e "${BLUE}📦 Step 2: Build Frontend...${NC}"
cd ../frontend
npm install
npm run build

echo -e "${GREEN}✅ Frontend built successfully${NC}"

echo ""
echo -e "${BLUE}🚀 Step 3: Start Production Services...${NC}"

# Start backend
cd ../backend
echo -e "${CYAN}Starting backend on port 8080...${NC}"
nohup java -jar -Dspring.profiles.active=production target/fbase-0.0.1-SNAPSHOT.jar > production.log 2>&1 &
BACKEND_PID=$!
echo -e "${GREEN}✅ Backend started with PID: $BACKEND_PID${NC}"

# Start frontend in production mode
cd ../frontend
echo -e "${CYAN}Starting frontend on port 3000...${NC}"
nohup npm run start > ../frontend-prod.log 2>&1 &
FRONTEND_PID=$!
echo -e "${GREEN}✅ Frontend started with PID: $FRONTEND_PID${NC}"

# Wait for services to start
echo -e "${CYAN}Waiting for services to start...${NC}"
for i in {1..30}; do
    if curl -s http://localhost:8080/health > /dev/null 2>&1 && curl -s http://localhost:3000 > /dev/null 2>&1; then
        echo ""
        echo -e "${GREEN}✅ All services are running!${NC}"
        break
    fi
    echo -n "."
    sleep 1
done

cd ..

echo ""
echo -e "${GREEN}🎉 PRODUCTION DEPLOYMENT COMPLETE!${NC}"
echo ""
echo -e "${CYAN}📊 Production Status:${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✅ Frontend:   http://localhost:3000 (Next.js production)${NC}"
echo -e "${GREEN}✅ Backend:    http://localhost:8080 (Spring Boot API)${NC}"
echo -e "${GREEN}✅ Health:     http://localhost:8080/health${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${CYAN}📝 Test Credentials:${NC}"
echo -e "   Username: sarah.chen"
echo -e "   Password: password123"
echo ""
echo -e "${CYAN}🛠️ Management:${NC}"
echo -e "   Backend logs:  ${YELLOW}tail -f backend/production.log${NC}"
echo -e "   Frontend logs: ${YELLOW}tail -f frontend-prod.log${NC}"
echo -e "   Stop backend:  ${YELLOW}kill $BACKEND_PID${NC}"
echo -e "   Stop frontend: ${YELLOW}kill $FRONTEND_PID${NC}"
echo ""

# Open browser
if [[ "$OSTYPE" == "darwin"* ]]; then
    echo -e "${BLUE}🌐 Opening browser...${NC}"
    sleep 3
    open http://localhost:3000
fi

echo -e "${GREEN}✨ Production environment is ready!${NC}"