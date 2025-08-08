#!/bin/bash

# Simple Development Environment
# Starts both frontend and backend servers

set -euo pipefail

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Get project root
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
cd "$PROJECT_ROOT"

# Stop function
stop_servers() {
    echo -e "${BLUE}Stopping development servers...${NC}"
    pkill -f "java.*fbase" || true
    pkill -f "next dev" || true
    rm -f backend/backend.log frontend/frontend.log 2>/dev/null || true
    echo -e "${GREEN}✅ Servers stopped${NC}"
    exit 0
}

usage() {
  cat <<USAGE
Usage: ./scripts/dev.sh [options]

Options:
  stop            Stop running dev servers
  --backend-only  Start only the backend (Spring Boot)
  --frontend-only Start only the frontend (Next.js)
  --no-wait       Do not wait for readiness checks
  -h, --help      Show this help

Defaults: Starts both backend and frontend and waits until they are ready.
USAGE
}

# Parse args
START_BACKEND=true
START_FRONTEND=true
WAIT_FOR_READY=true

for arg in "$@"; do
  case "$arg" in
    stop)
      stop_servers ;;
    --backend-only)
      START_FRONTEND=false ;;
    --frontend-only)
      START_BACKEND=false ;;
    --no-wait)
      WAIT_FOR_READY=false ;;
    -h|--help)
      usage; exit 0 ;;
    *)
      echo -e "${RED}Unknown option:${NC} $arg"; usage; exit 1 ;;
  esac
done

# Preflight checks
command -v mvn >/dev/null 2>&1 || { echo -e "${RED}Maven not found. Install Maven first.${NC}"; exit 1; }
command -v node >/dev/null 2>&1 || { echo -e "${RED}Node.js not found. Install Node.js first.${NC}"; exit 1; }
command -v npm >/dev/null 2>&1 || { echo -e "${RED}npm not found. Install Node.js/npm first.${NC}"; exit 1; }

# Helpful context
JAVA_VER=$(java -version 2>&1 | head -n1 | sed 's/"/ /g') || true
NODE_VER=$(node -v 2>/dev/null || echo "?")
echo -e "${YELLOW}Java:${NC} ${JAVA_VER}"
echo -e "${YELLOW}Node:${NC} ${NODE_VER}"

# Start servers
echo -e "${BLUE}🚀 Starting development environment...${NC}"
echo -e "${YELLOW}  - Backend: http://localhost:8080${NC}"
echo -e "${YELLOW}  - Frontend: http://localhost:3000${NC}"
echo -e "${YELLOW}  - Dashboard: http://localhost:3000/dashboard/${NC}"
echo ""

# Clean up any existing processes
pkill -f "java.*fbase" || true
pkill -f "next dev" || true
sleep 2

if [ "$START_BACKEND" = true ]; then
  echo -e "${BLUE}Starting backend...${NC}"
  cd backend
  nohup mvn spring-boot:run > backend.log 2>&1 &
  cd ..
fi

if [ "$START_FRONTEND" = true ]; then
  echo -e "${BLUE}Starting frontend...${NC}"
  cd frontend
  nohup npm run dev > frontend.log 2>&1 &
  cd ..
fi

if [ "$WAIT_FOR_READY" = true ]; then
  echo -e "${BLUE}Waiting for servers to start...${NC}"
  for i in {1..90}; do
      BACKEND_UP=yes
      FRONTEND_UP=yes
      if [ "$START_BACKEND" = true ]; then
        BACKEND_UP=$(curl -s http://localhost:8080/health > /dev/null 2>&1 && echo "yes" || echo "no")
      fi
      if [ "$START_FRONTEND" = true ]; then
        FRONTEND_UP=$(curl -s http://localhost:3000 > /dev/null 2>&1 && echo "yes" || echo "no")
      fi
      if [ "$BACKEND_UP" = "yes" ] && [ "$FRONTEND_UP" = "yes" ]; then
          break
      fi
      echo -n "."
      sleep 1
  done
  echo ""
fi

# Final status check
echo -e "${GREEN}✅ Development environment ready!${NC}"
echo ""
echo -e "${GREEN}Access Points:${NC}"
echo -e "  ${YELLOW}Dashboard:${NC} http://localhost:3000/dashboard/"
echo -e "  ${YELLOW}API Health:${NC} http://localhost:8080/health"
echo ""
echo -e "${GREEN}Commands:${NC}"
echo -e "  ${YELLOW}Stop:${NC} ./scripts/dev.sh stop"
echo -e "  ${YELLOW}Status:${NC} ./scripts/status.sh"
echo ""
echo -e "${GREEN}Logs:${NC}"
echo -e "  ${YELLOW}Backend:${NC} tail -f backend/backend.log"
echo -e "  ${YELLOW}Frontend:${NC} tail -f frontend/frontend.log"