#!/bin/bash

# Production Deployment Script
# This script builds and deploys the application for production

set -e  # Exit on any error

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Get the project root directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$SCRIPT_DIR"
cd "$PROJECT_ROOT"

echo -e "${CYAN}🚀 PRODUCTION DEPLOYMENT SCRIPT${NC}"
echo -e "${CYAN}================================${NC}"
echo ""

# Check prerequisites
echo -e "${BLUE}📋 Checking prerequisites...${NC}"

# Check Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Node.js: $(node -v)${NC}"

# Check npm
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm is not installed${NC}"
    exit 1
fi
echo -e "${GREEN}✅ npm: $(npm -v)${NC}"

# Check Java
if ! command -v java &> /dev/null; then
    echo -e "${RED}❌ Java is not installed${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Java: $(java -version 2>&1 | head -n 1)${NC}"

# Check Maven
if ! command -v mvn &> /dev/null; then
    echo -e "${RED}❌ Maven is not installed${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Maven: $(mvn -v | head -n 1)${NC}"

# Check PostgreSQL connection
echo -e "${BLUE}🗄️  Checking PostgreSQL connection...${NC}"
if PGPASSWORD=password psql -h localhost -p 5432 -U postgres -d project1 -c "SELECT 1" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ PostgreSQL is accessible${NC}"
else
    echo -e "${YELLOW}⚠️  PostgreSQL connection failed. Make sure PostgreSQL is running.${NC}"
    echo -e "${YELLOW}   The application will fail to start without database access.${NC}"
fi

echo ""
echo -e "${BLUE}🔨 Step 1: Clean previous builds...${NC}"
rm -rf frontend/out
rm -rf frontend/.next
rm -rf backend/target
rm -rf backend/src/main/resources/static/*

echo ""
echo -e "${BLUE}📦 Step 2: Build Frontend (Next.js)...${NC}"
cd frontend

# Install dependencies
echo -e "${CYAN}   Installing dependencies...${NC}"
npm install

# Build for production
echo -e "${CYAN}   Building production bundle...${NC}"
NODE_ENV=production npm run build

# Check if build was successful
if [ ! -d "out" ]; then
    echo -e "${RED}❌ Frontend build failed - 'out' directory not found${NC}"
    exit 1
fi

# Copy to Spring Boot static resources
echo -e "${CYAN}   Copying to Spring Boot static resources...${NC}"
mkdir -p ../backend/src/main/resources/static
cp -r out/* ../backend/src/main/resources/static/

echo -e "${GREEN}✅ Frontend build complete${NC}"

cd ..

echo ""
echo -e "${BLUE}🔧 Step 3: Build Backend (Spring Boot)...${NC}"
cd backend

# Clean and package
echo -e "${CYAN}   Building Spring Boot JAR...${NC}"
mvn clean package -DskipTests

# Check if JAR was created
if [ ! -f "target/fbase-0.0.1-SNAPSHOT.jar" ]; then
    echo -e "${RED}❌ Backend build failed - JAR not found${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Backend build complete${NC}"
echo -e "${GREEN}   JAR location: backend/target/fbase-0.0.1-SNAPSHOT.jar${NC}"

cd ..

echo ""
echo -e "${BLUE}🔄 Step 4: Stop existing services...${NC}"

# Stop frontend dev server
if lsof -ti:3000 > /dev/null 2>&1; then
    echo -e "${YELLOW}   Stopping frontend dev server on port 3000...${NC}"
    kill $(lsof -ti:3000) 2>/dev/null || true
    sleep 2
fi

# Stop backend
if lsof -ti:8080 > /dev/null 2>&1; then
    echo -e "${YELLOW}   Stopping backend on port 8080...${NC}"
    pkill -f "java.*fbase" 2>/dev/null || true
    kill $(lsof -ti:8080) 2>/dev/null || true
    sleep 2
fi

echo -e "${GREEN}✅ Previous services stopped${NC}"

echo ""
echo -e "${BLUE}🚀 Step 5: Start Production Server...${NC}"

cd backend
echo -e "${CYAN}   Starting Spring Boot application...${NC}"

# Start Spring Boot in the background
nohup java -jar target/fbase-0.0.1-SNAPSHOT.jar > production.log 2>&1 &
SPRING_PID=$!

echo -e "${GREEN}   Spring Boot started with PID: $SPRING_PID${NC}"

# Wait for application to start
echo -e "${CYAN}   Waiting for application to start...${NC}"
for i in {1..30}; do
    if curl -s http://localhost:8080 > /dev/null 2>&1; then
        echo ""
        echo -e "${GREEN}✅ Application is running!${NC}"
        break
    fi
    echo -n "."
    sleep 1
done

if ! curl -s http://localhost:8080 > /dev/null 2>&1; then
    echo ""
    echo -e "${RED}❌ Application failed to start. Check logs: tail -f backend/production.log${NC}"
    exit 1
fi

cd ..

echo ""
echo -e "${GREEN}🎉 DEPLOYMENT SUCCESSFUL!${NC}"
echo ""
echo -e "${CYAN}📊 Deployment Summary:${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✅ Application URL:     http://localhost:8080${NC}"
echo -e "${GREEN}✅ Login Page:          http://localhost:8080/login${NC}"
echo -e "${GREEN}✅ Dashboard:           http://localhost:8080/dashboard${NC}"
echo -e "${GREEN}✅ API Endpoint:        http://localhost:8080/api/members${NC}"
echo -e "${GREEN}✅ Process ID:          $SPRING_PID${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${CYAN}📝 Test Credentials:${NC}"
echo -e "   Username: sarah.chen"
echo -e "   Password: password123"
echo ""
echo -e "${CYAN}🛠️  Management Commands:${NC}"
echo -e "   View logs:     ${YELLOW}tail -f backend/production.log${NC}"
echo -e "   Stop server:   ${YELLOW}kill $SPRING_PID${NC}"
echo -e "   Check status:  ${YELLOW}ps aux | grep $SPRING_PID${NC}"
echo -e "   Restart:       ${YELLOW}./deploy-production.sh${NC}"
echo ""
echo -e "${CYAN}📦 Deployment Artifacts:${NC}"
echo -e "   JAR file:      backend/target/fbase-0.0.1-SNAPSHOT.jar"
echo -e "   Static files:  backend/src/main/resources/static/"
echo -e "   Logs:          backend/production.log"
echo ""

# Optional: Open browser
if [[ "$OSTYPE" == "darwin"* ]]; then
    echo -e "${BLUE}🌐 Opening browser...${NC}"
    sleep 2
    open http://localhost:8080/login
fi

echo -e "${GREEN}✨ Deployment complete! The application is ready for use.${NC}"